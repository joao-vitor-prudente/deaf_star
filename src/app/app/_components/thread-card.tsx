import { PopoverContent } from "@radix-ui/react-popover";
import {
  EllipsisVertical,
  Heart,
  MessageCircle,
  Share,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ClipboardButton } from "~/components/ui/clipboard-button";
import { Popover, PopoverTrigger } from "~/components/ui/popover";
import { SubmitButton } from "~/components/ui/submit-button";
import { env } from "~/env";
import { auth } from "~/helpers/auth";
import { toggleLikeSchema } from "~/server/api/routers/like";
import { getThreadByIdSchema } from "~/server/api/routers/thread";
import { type RouterOutputs } from "~/trpc/react";
import { api, revalidateTRPC } from "~/trpc/server";
import { ProfileImage } from "./profile-image";

async function toggleLikeAction(formData: FormData): Promise<void> {
  "use server";
  const objectData = Object.fromEntries(formData.entries());
  const parsedData = toggleLikeSchema.parse(objectData);
  await api.like.toggle(parsedData);
  revalidateTRPC("thread.list");
}

async function deleteThreadAction(formData: FormData): Promise<void> {
  "use server";
  const objectData = Object.fromEntries(formData.entries());
  const parsedData = getThreadByIdSchema.parse(objectData);
  await api.thread.delete(parsedData);
  revalidateTRPC("thread.list");
  revalidateTRPC("thread.getById");
  revalidateTRPC("thread.listByAuthor");
  revalidateTRPC("reply.list");
}

type ThreadCardProps = Readonly<{
  thread: RouterOutputs["thread"]["list"][number];
}>;

export async function ThreadCard(props: ThreadCardProps): AsyncReactNode {
  const threadUrl = `${env.NEXT_PUBLIC_HTTP_URL}/app/thread/${props.thread.id}`;
  const session = await auth();
  const isOwner = session.user.id === props.thread.author.id;
  const hasLiked = props.thread.threadsLikedUsers.some(
    (like) => like.userId === session.user.id,
  );

  return (
    <section className="rounded-md border p-4">
      <header className="flex items-center justify-between text-muted-foreground">
        <div className="flex items-center gap-4">
          <ProfileImage
            image={props.thread.author.profileImage}
            size={40}
            expandedSize={240}
          />
          <Link href={`/app/profile/${props.thread.author.id}`}>
            <h6>
              <span>@</span>
              <span>
                {props.thread.author.name ?? props.thread.author.email}
              </span>
            </h6>
          </Link>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" hidden={!isOwner} disabled={!isOwner}>
              <EllipsisVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={32}
            alignOffset={-18}
            align="start"
            side="right"
            className="flex flex-col gap-2 rounded-md border bg-background p-4"
          >
            <h6 className="text-sm">Thread actions</h6>
            <form action={deleteThreadAction}>
              <input type="hidden" name="id" value={props.thread.id} readOnly />
              <SubmitButton
                variant="destructive"
                className="w-full"
                size="sm"
                successMessage="Thread deleted successfully"
              >
                <Trash />
                <span>Delete</span>
              </SubmitButton>
            </form>
          </PopoverContent>
        </Popover>
      </header>
      <main>
        <Link href={`/app/threads/${props.thread.id}`}>
          <p>{props.thread.text}</p>
        </Link>
      </main>
      <footer className="flex flex-col items-end">
        <p className="text-sm text-muted-foreground">
          {props.thread.createdAt.toDateString()}
        </p>
        <ul className="flex gap-2">
          <li>
            <ClipboardButton variant="ghost" text={threadUrl}>
              <Share />
            </ClipboardButton>
          </li>
          <li>
            <Button variant="ghost" asChild>
              <Link
                href={`/app/threads/${props.thread.id}`}
                className="flex gap-2"
              >
                <MessageCircle />
                <span>{props.thread.replyCount}</span>
              </Link>
            </Button>
          </li>
          <li>
            <form action={toggleLikeAction}>
              <input type="hidden" name="threadId" value={props.thread.id} />
              <SubmitButton variant="ghost" className="flex gap-2" noLoading>
                <Heart
                  data-liked={hasLiked}
                  className="data-[liked=true]:text-red-500"
                />
                <span>{props.thread.likeCount}</span>
              </SubmitButton>
            </form>
          </li>
        </ul>
      </footer>
    </section>
  );
}
