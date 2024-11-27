import Link from "next/link";
import { SubmitButton } from "~/components/ui/submit-button";
import { removeFriendSchema } from "~/server/api/routers/friend";
import { api } from "~/trpc/server";

async function removeFriendAction(formData: FormData): Promise<void> {
  "use server";
  const data = removeFriendSchema.parse(Object.fromEntries(formData));
  await api.friend.remove(data);
}

export default async function Friends(): Promise<React.JSX.Element> {
  const friends = await api.friend.list();

  return (
    <main>
      <h1>Friends</h1>
      <Link href="/app/friends/add">Add friend</Link>
      <ul>
        {friends.map((friend) => (
          <li key={friend.id}>
            <p>{friend.email}</p>
            <form action={removeFriendAction}>
              <input type="hidden" name="friendId" value={friend.id} />
              <SubmitButton>Remove</SubmitButton>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
