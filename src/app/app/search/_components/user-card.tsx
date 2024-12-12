import Link from "next/link";
import { type User } from "~/server/db/schema";

type UserCardProps = Readonly<{ user: User }>;

export function UserCard(props: UserCardProps): ReactNode {
  return (
    <Link href={`/app/profile/${props.user.id}`}>
      <div className="rounded-md p-4 hover:bg-primary-foreground">
        <span>{props.user.email}</span>
      </div>
    </Link>
  );
}
