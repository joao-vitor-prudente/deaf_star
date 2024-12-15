import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "~/components/ui/card";
import { type RouterOutputs } from "~/trpc/react";
import { ProfileImage } from "./profile-image";

type ThreadCardProps = Readonly<{
  thread: RouterOutputs["thread"]["list"][number];
}>;

export function ThreadCard(props: ThreadCardProps): ReactNode {
  return (
    <Card className="max-w-96 p-2">
      <div className="flex gap-2">
        <CardTitle>
          <ProfileImage image={props.thread.author.profileImage} size={40} expandedSize={240} />
        </CardTitle>
        <CardDescription className="flex items-center">
          <p>
            <span>@</span>
            <span>{props.thread.author.name ?? props.thread.author.email}</span>
          </p>
        </CardDescription>
      </div>
      <CardContent className="p-0">
        <p>{props.thread.text}</p>s
      </CardContent>
      <CardFooter className="justify-end p-0">
        <p className="text-sm text-muted-foreground">
          {props.thread.createdAt.toDateString()}
        </p>
      </CardFooter>
    </Card>
  );
}
