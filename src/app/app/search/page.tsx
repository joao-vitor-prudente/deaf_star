import { Input } from "~/components/ui/input";
import { SubmitButton } from "~/components/ui/submit-button";
import { redirectFormAction } from "~/helpers/redirect-form-action";
import { listUsersSchema } from "~/server/api/routers/user";
import { api } from "~/trpc/server";
import { UserCard } from "./_components/user-card";

export default async function SearchPage(
  props: PageProps,
): Promise<React.JSX.Element> {
  const searchParams = await props.searchParams;
  const searchString = listUsersSchema.parse(searchParams).searchString;
  const users = await api.user.list({ searchString });

  return (
    <main className="flex max-w-md flex-col gap-4 p-4">
      <form action={redirectFormAction} className="flex gap-4">
        <Input type="text" name="searchString" defaultValue={searchString} />
        <input type="hidden" name="currentRoute" value="/app/search" readOnly />
        <SubmitButton>Procurar</SubmitButton>
      </form>
      <ul className="flex flex-col gap-4">
        {users.map((user) => (
          <li key={user.id}>
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    </main>
  );
}
