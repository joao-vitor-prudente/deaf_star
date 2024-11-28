import { SubmitButton } from "~/components/ui/submit-button";
import { redirectFormAction } from "~/helpers/redirectFormAction";
import { addFriendSchema } from "~/server/api/routers/friend";
import { listUsersSchema } from "~/server/api/routers/user";
import { api, revalidateTRPC } from "~/trpc/server";

async function addFriendAction(formData: FormData): Promise<void> {
  "use server";
  const data = addFriendSchema.parse(Object.fromEntries(formData));
  await api.friend.add(data);
  revalidateTRPC("friend.list");
  revalidateTRPC("user.list");
}

export default async function AddFriendPage(
  props: PageProps,
): Promise<React.JSX.Element> {
  const searchParams = await props.searchParams;
  const searchString = listUsersSchema.parse(searchParams).searchString;
  const users = await api.user.list({ searchString });

  return (
    <main>
      <h1>Add friend</h1>
      <form action={redirectFormAction} className="flex gap-4">
        <input type="hidden" name="currentRoute" value="/app/friends/add" />
        <label htmlFor="search-string" className="flex flex-col">
          <span>Search</span>
          <input
            type="text"
            id="search-string"
            name="searchString"
            defaultValue={searchString}
          />
        </label>
        <SubmitButton type="submit">Search</SubmitButton>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <p>{user.email}</p>
            <form action={addFriendAction}>
              <input type="hidden" name="friendId" value={user.id} />
              <SubmitButton type="submit">Add</SubmitButton>
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}
