import { initTRPC, TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import superjson from "superjson";
import { z, ZodError } from "zod";
import { env } from "~/env";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

export type TRPCContext = {
  headers: Headers;
  db: typeof db;
  session: Session | null;
};

export const createTRPCContext = async (opts: {
  headers: Headers;
}): Promise<TRPCContext> => {
  const session = await auth();

  return { db, session, ...opts };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    const zodError =
      error.cause instanceof ZodError ? error.cause.flatten() : null;
    return { ...shape, data: { ...shape.data, zodError } };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async (req) => {
  const start = Date.now();

  if (t._config.isDev && env.DELAY_REQUESTS) {
    // eslint-disable-next-line sonarjs/pseudo-random
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await req.next();

  const end = Date.now();
  const delta = end - start;
  console.log(`[TRPC] ${req.path} took ${delta.toString()}ms to execute`);

  return result;
});

const protectedMiddleware = t.middleware((req) => {
  if (!req.ctx.session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  const session = { ...req.ctx.session, user: req.ctx.session.user };
  return req.next({ ctx: { session } });
});

const userProtectedMiddleware = t.middleware(async (req) => {
  const input = await req.getRawInput();
  const parsedInput = z.object({ userId: z.string() }).safeParse(input);

  if (parsedInput.error) throw new TRPCError({ code: "BAD_REQUEST" });
  if (parsedInput.data.userId !== req.ctx.session?.user.id)
    throw new TRPCError({ code: "UNAUTHORIZED" });

  return req.next();
});

export const publicProc = t.procedure.use(timingMiddleware);

export const protectedProc = publicProc.use(protectedMiddleware);

export const userProtectedProc = protectedProc.use(userProtectedMiddleware);
