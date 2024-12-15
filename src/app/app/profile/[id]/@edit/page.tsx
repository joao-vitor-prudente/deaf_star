import { redirect } from "next/navigation";
import { ProfileImage } from "~/app/_components/profile-image";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { SubmitButton } from "~/components/ui/submit-button";
import { Textarea } from "~/components/ui/textarea";
import { auth } from "~/helpers/auth";
import { updateUserSchemaWithoutTransform } from "~/server/api/routers/user";
import { api, revalidateTRPC } from "~/trpc/server";
import { profileParamsSchema } from "../layout";

async function updateUserAction(data: FormData): Promise<void> {
  "use server";
  console.log(data);
  const dataObject = Object.fromEntries(data.entries());
  const parsedData = updateUserSchemaWithoutTransform.parse(dataObject);
  await api.user.update(parsedData);
  revalidateTRPC("user.getById");
}

export default async function EditSheet(props: PageProps): AsyncReactNode {
  const session = await auth();
  const params = await props.params;
  const id = profileParamsSchema.parse(params).id;
  if (session.user.id !== id) return redirect(`app/profile/${session.user.id}`);

  const user = await api.user.getById({ userId: id });

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Edit profile</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>You can edit your profile here.</SheetDescription>
        </SheetHeader>
        <div className="flex w-full justify-center p-4">
          <ProfileImage size={160} image={user.profileImage} />
        </div>
        <form action={updateUserAction} className="flex flex-col gap-4">
          <Label htmlFor="image" className="space-y-2">
            <span>Profile Image</span>
            <Input
              name="image"
              id="image"
              type="file"
              accept="image/png,image/jpeg"
            />
          </Label>
          <Label htmlFor="name" className="space-y-2">
            <span>Name</span>
            <Input
              name="name"
              id="name"
              type="text"
              defaultValue={user.name ?? undefined}
            />
          </Label>
          <Label htmlFor="bio" className="space-y-2">
            <span>Bio</span>
            <Textarea
              name="bio"
              id="bio"
              defaultValue={user.bio ?? undefined}
            />
          </Label>
          <input type="hidden" name="userId" value={user.id} readOnly />
          <SubmitButton successMessage="Profile edited successfully">
            Save
          </SubmitButton>
        </form>
      </SheetContent>
    </Sheet>
  );
}
