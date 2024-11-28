import Link from "next/link";
import { SubmitButton } from "~/components/ui/submit-button";
import { Textarea } from "~/components/ui/textarea";
import { getChatByIdSchema } from "~/server/api/routers/chat";
import { createMsgSchema } from "~/server/api/routers/message";
import { api, revalidateTRPC } from "~/trpc/server";
import { Message } from "../_components/message";

async function createMessageAction(formData: FormData): Promise<void> {
  "use server";
  const data = createMsgSchema.parse(Object.fromEntries(formData));
  await api.message.create(data);
  revalidateTRPC("message.list");
}

export default async function ChatPage(
  props: Readonly<PageProps>,
): Promise<React.JSX.Element> {
  const params = await props.params;
  const chatId = getChatByIdSchema.parse(params).id;
  const messages = await api.message.list({ chatId });
  const chat = await api.chat.getById({ id: chatId });

  return (
    <main className="flex h-full w-full flex-col justify-between">
      <header className="w-full border-b border-zinc-800 p-6">
        <h4>{chat.name}</h4>
        <Link href={`/app/chats/${chatId}/edit`}>Edit</Link>
      </header>
      <ul className="flex flex-1 flex-col gap-2 p-4">
        {messages.map((message) => (
          <li key={message.id}>
            <Message message={message} />
          </li>
        ))}
      </ul>
      <footer className="border-t border-zinc-800 p-6">
        <form className="flex gap-6" action={createMessageAction}>
          <input type="hidden" name="chatId" value={chatId} />
          <Textarea name="text" />
          <SubmitButton type="submit">Send</SubmitButton>
        </form>
      </footer>
    </main>
  );
}
