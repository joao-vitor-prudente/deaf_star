import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SubmitButton } from "~/components/ui/submit-button";
import { getSessionOrRedirect } from "~/helpers/get-session-or-redirect";
import { updateUserSchema } from "~/server/api/routers/user";
import { api, revalidateTRPC } from "~/trpc/server";

async function updateUserAction(formData: FormData): Promise<void> {
  "use server";
  const data = updateUserSchema.parse(Object.fromEntries(formData));
  await api.user.update(data);
  revalidateTRPC("user.getById");
}

export default async function SettingsPage(): Promise<React.JSX.Element> {
  const session = await getSessionOrRedirect();

  const user = await api.user.getById({ userId: session.user.id });

  return (
    <main className="p-6">
      <div className="space-y-4">
        <h2 className="text-3xl">Settings</h2>
        <form className="flex flex-col gap-4" action={updateUserAction}>
          <input type="hidden" name="userId" value={user.id} />
          <Label htmlFor="name" className="flex flex-col gap-2">
            <span>Name</span>
            <Input
              type="name"
              id="name"
              name="name"
              defaultValue={user.name ?? ""}
            />
          </Label>
          <SubmitButton>Update</SubmitButton>
        </form>
      </div>
    </main>
  );
}
