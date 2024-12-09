import Link from "next/link";
import { Input } from "~/components/ui/input";
import { SubmitButton } from "~/components/ui/submit-button";
import { redirectFormAction } from "~/helpers/redirect-form-action";
import { listUsersSchema } from "~/server/api/routers/user";
import { api } from "~/trpc/server";

export default async function SearchPage(
  props: PageProps,
): Promise<React.JSX.Element> {
  const searchParams = await props.searchParams;
  const searchString = listUsersSchema.parse(searchParams).searchString;
  const users = await api.user.list({ searchString });

  return (
    <main className="p-4">
      <form action={redirectFormAction} className="flex gap-4">
        <Input
          type="text"
          name="searchString"
          defaultValue={searchString}
          className="max-w-sm"
        />
        <input type="hidden" name="currentRoute" value="/app/search" readOnly />
        <SubmitButton>Procurar</SubmitButton>
      </form>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            <Link href={`/app/profile/${user.id}`}>{user.email}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
