import { redirect } from "next/navigation";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SubmitButton } from "~/components/ui/submit-button";
import { Textarea } from "~/components/ui/textarea";
import { createChatSchema } from "~/server/api/routers/chat";
import { api, revalidateTRPC } from "~/trpc/server";

async function createChatAction(formData: FormData): Promise<void> {
  "use server";
  const data = createChatSchema.parse(Object.fromEntries(formData));
  const chatId = await api.chat.create(data);
  revalidateTRPC("chat.list");
  redirect(`/app/chats/${chatId}`);
}

export default function CreateChatPage(): React.JSX.Element {
  return (
    <main className="flex h-screen w-full flex-col items-center justify-center">
      <div className="space-y-12">
        <header>
          <h2 className="text-3xl">Create Chat</h2>
        </header>
        <form className="flex w-96 flex-col gap-6" action={createChatAction}>
          <Label className="flex flex-col gap-2" htmlFor="name">
            <span>Name</span>
            <Input id="name" name="name" />
          </Label>
          <Label className="flex flex-col gap-2" htmlFor="description">
            <span>Description</span>
            <Textarea id="description" name="description" />
          </Label>
          <SubmitButton>Create</SubmitButton>
        </form>
      </div>
    </main>
  );
}
