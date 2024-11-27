import { Input } from "~/components/ui/input";
import { SubmitButton } from "~/components/ui/submit-button";
import { Textarea } from "~/components/ui/textarea";
import {
  addChatUserSchema,
  getChatByIdSchema,
  rmChatUserSchema,
  updateChatSchema,
} from "~/server/api/routers/chat";
import { api, revalidateTRPC } from "~/trpc/server";

async function updateChatAction(formData: FormData): Promise<void> {
  "use server";
  const data = updateChatSchema.parse(Object.fromEntries(formData));
  await api.chat.update(data);
  revalidateTRPC("chat.list");
  revalidateTRPC("chat.getById");
}

async function addChatUserAction(formData: FormData): Promise<void> {
  "use server";
  const data = addChatUserSchema.parse(Object.fromEntries(formData));
  await api.chat.addUser(data);
  revalidateTRPC("chat.list");
  revalidateTRPC("chat.getById");
}

async function removeChatUserAction(formData: FormData): Promise<void> {
  "use server";
  const data = rmChatUserSchema.parse(Object.fromEntries(formData));
  await api.chat.removeUser(data);
  revalidateTRPC("chat.list");
  revalidateTRPC("chat.getById");
}

export default async function EditChat(
  props: PageProps,
): Promise<React.JSX.Element> {
  const params = await props.params;
  const chatId = getChatByIdSchema.parse(params).id;
  const chat = await api.chat.getById({ id: chatId });
  const friends = await api.friend.list();

  const chatUserIds = new Set(chat.chatsUsers.map((c) => c.userId));
  const friendsNotInChat = friends.filter((f) => !chatUserIds.has(f.id));
  const friendsInChat = friends.filter((f) => chatUserIds.has(f.id));

  return (
    <main>
      <form action={updateChatAction}>
        <input type="hidden" name="chatId" value={chat.id} />
        <Input type="text" name="name" defaultValue={chat.name} />
        <Textarea name="description" defaultValue={chat.description ?? ""} />
        <SubmitButton>Save</SubmitButton>
      </form>
      <ul>
        {friendsInChat.map((friend) => (
          <li key={friend.id}>
            <form action={removeChatUserAction}>
              <p>{friend.email}</p>
              <input type="hidden" name="userId" value={friend.id} />
              <input type="hidden" name="chatId" value={chat.id} />
              <SubmitButton>Remove</SubmitButton>
            </form>
          </li>
        ))}
        {friendsNotInChat.map((friend) => (
          <li key={friend.id}>
            <form action={addChatUserAction}>
              <p>{friend.email}</p>
              <input type="hidden" name="userId" value={friend.id} />
              <input type="hidden" name="chatId" value={chat.id} />
              <SubmitButton>Add</SubmitButton>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
