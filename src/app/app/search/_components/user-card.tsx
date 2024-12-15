import Link from "next/link";
import { ProfileImage } from "~/app/_components/profile-image";
import { Card, CardDescription, CardTitle } from "~/components/ui/card";
import { type RouterOutputs } from "~/trpc/react";

type UserCardProps = Readonly<{
  user: RouterOutputs["user"]["list"][number];
}>;

export function UserCard(props: UserCardProps): ReactNode {
  return (
    <Link href={`/app/profile/${props.user.id}`}>
      <Card className="flex items-center gap-2 p-2">
        <CardTitle>
          <ProfileImage image={props.user.profileImage} size={40} />
        </CardTitle>
        <CardDescription>
          <span>@</span>
          <span>{props.user.name ?? props.user.email}</span>
        </CardDescription>
      </Card>
    </Link>
  );
}
