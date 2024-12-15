import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { updateSession } from "~/server/auth";
import { ImageFormat, images, users } from "~/server/db/schema";
import { createTRPCRouter, protectedProc, userProtectedProc } from "../trpc";

export const listUsersSchema = z.object({
  searchString: z.string().optional(),
});

export const getUserByIdSchema = z.object({ userId: z.string() });

const imageFormatSchema = z.enum([ImageFormat.JPEG, ImageFormat.PNG]);
const imageSizeSchema = z
  .number()
  .min(0)
  .max(5 * 1024 * 1024);
const imageSchema = z.instanceof(File);

const updateUserSchemaWithoutImage = z.object({
  userId: z.string(),
  name: z.string().optional(),
  bio: z.string().optional(),
});

export const updateUserSchemaWithoutTransform =
  updateUserSchemaWithoutImage.extend({ image: imageSchema.optional() });

const updateUserSchema = updateUserSchemaWithoutImage.extend({
  image: imageSchema.optional().transform(async (file) => {
    if (!file) return undefined;
    if (file.type === "application/octet-stream") return undefined;
    const type = imageFormatSchema.parse(file.type);
    const size = imageSizeSchema.parse(file.size);
    const name = file.name;
    const data = Buffer.from(await file.arrayBuffer()).toString("base64");
    return { type, size, data, name };
  }),
});

export const userRouter = createTRPCRouter({
  list: protectedProc.input(listUsersSchema).query(async (req) => {
    return await req.ctx.db.query.users.findMany({
      where: (users, { ilike, and, or, ne }) => {
        const searchStringQuery = or(
          ilike(users.email, `%${req.input.searchString}%`),
          ilike(users.name, `%${req.input.searchString}%`),
        );

        return and(
          req.input.searchString ? searchStringQuery : undefined,
          ne(users.id, req.ctx.session.user.id),
        );
      },
    });
  }),

  getById: protectedProc.input(getUserByIdSchema).query(async (req) => {
    const user = await req.ctx.db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, req.input.userId),
      with: { profileImage: true },
    });
    if (!user) throw new TRPCError({ code: "NOT_FOUND" });
    return user;
  }),

  delete: userProtectedProc.input(getUserByIdSchema).mutation(async (req) => {
    return await req.ctx.db.delete(users).where(eq(users.id, req.input.userId));
  }),

  update: userProtectedProc.input(updateUserSchema).mutation(async (req) => {
    if (req.ctx.session.user.id !== req.input.userId)
      throw new TRPCError({ code: "UNAUTHORIZED" });

    await req.ctx.db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ name: req.input.name, bio: req.input.bio })
        .where(eq(users.id, req.input.userId));

      if (!req.input.image) return;

      const image = await tx
        .insert(images)
        .values({
          updatedAt: new Date(),
          name: req.input.image.name,
          data: req.input.image.data,
          format: req.input.image.type,
          size: req.input.image.size,
        })
        .returning({ id: images.id });

      await tx
        .update(users)
        .set({ imageId: image.at(0)?.id })
        .where(eq(users.id, req.input.userId));

      if (req.ctx.session.user.imageId) {
        await tx
          .delete(images)
          .where(eq(images.id, req.ctx.session.user.imageId));
      }

      await updateSession({ user: { imageId: image.at(0)?.id } });
    });
  }),
});
