"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PopoverContent } from "@radix-ui/react-popover";
import {
  EllipsisVertical,
  Heart,
  MessageCircle,
  Share,
  Trash,
} from "lucide-react";
import { type Route } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { ClipboardButton } from "~/components/ui/clipboard-button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Popover, PopoverTrigger } from "~/components/ui/popover";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env";
import { api, type RouterOutputs } from "~/trpc/react";
import { ProfileImage } from "../../../_components/profile-image";

type ReplyCardInnerProps = Readonly<{
  thread: RouterOutputs["thread"]["list"][number];
}>;

const replyFormSchema = z.object({ text: z.string().min(1) });

export function ReplyCardInner(props: ReplyCardInnerProps): ReactNode {
  const threadUrl = `${env.NEXT_PUBLIC_HTTP_URL}/app/thread/${props.thread.id}`;
  const session = useSession().data;
  const isOwner = session && session.user.id === props.thread.author.id;
  const hasLiked = props.thread.threadsLikedUsers.some(
    (like) => session && like.userId === session.user.id,
  );

  const utils = api.useUtils();

  const toggleLike = api.like.toggle.useMutation({
    onMutate: async () => {
      await utils.thread.list.invalidate();
    },
  });

  const deleteThread = api.thread.delete.useMutation({
    onMutate: async () => {
      await utils.thread.list.invalidate();
      await utils.thread.getById.invalidate({ id: props.thread.id });
      await utils.thread.listByAuthor.invalidate({
        authorId: props.thread.author.id,
      });
      await utils.reply.list.invalidate({ threadId: props.thread.id });
      toast.success("Thread deleted successfully");
    },
  });

  const reply = api.reply.create.useMutation({
    onMutate: async () => {
      await utils.reply.list.invalidate({ threadId: props.thread.id });
      toast.success("Reply posted successfully");
    },
  });

  const form = useForm<z.infer<typeof replyFormSchema>>({
    resolver: zodResolver(replyFormSchema),
  });

  const submitReply = async (
    data: z.infer<typeof replyFormSchema>,
  ): Promise<void> => {
    await reply.mutateAsync({
      text: data.text,
      threadId: props.thread.id,
    });
  };

  return (
    <Collapsible>
      <section className="rounded-md border p-4">
        <header className="flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-4">
            <ProfileImage
              image={props.thread.author.profileImage}
              size={40}
              expandedSize={240}
            />
            <Link href={`/app/profile/${props.thread.author.id}` as Route}>
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
              <Button
                variant="destructive"
                className="w-full"
                size="sm"
                onClick={() => {
                  deleteThread.mutate({ id: props.thread.id });
                }}
              >
                <Trash />
                <span>Delete</span>
              </Button>
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
              <CollapsibleTrigger asChild>
                <Button variant="ghost">
                  <MessageCircle />
                </Button>
              </CollapsibleTrigger>
            </li>
            <li>
              <Button
                variant="ghost"
                className="flex gap-2"
                onClick={() => {
                  toggleLike.mutate({ threadId: props.thread.id });
                }}
              >
                <Heart
                  data-liked={hasLiked}
                  className="data-[liked=true]:text-red-500"
                />
                <span>{props.thread.likeCount}</span>
              </Button>
            </li>
          </ul>
        </footer>
      </section>
      <CollapsibleContent className="mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitReply)}
            className="flex gap-4"
          >
            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel hidden></FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Reply to thread" />
                  </FormControl>
                  <FormDescription hidden>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button>Reply</Button>
          </form>
        </Form>
      </CollapsibleContent>
    </Collapsible>
  );
}
