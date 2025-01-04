"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ReplyCardInner } from "~/app/app/threads/[id]/_components/reply-card-inner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { api, type RouterOutputs } from "~/trpc/react";

type ReplyCardProps = Readonly<{
  thread: RouterOutputs["thread"]["list"][number];
}>;

export function ReplyCard(props: ReplyCardProps): ReactNode {
  const [open, setOpen] = useState(false);
  const replies = api.reply.list.useQuery(
    { threadId: props.thread.id },
    { enabled: open },
  );

  return (
    <>
      <ReplyCardInner thread={props.thread} />
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="my-1 flex gap-1 text-sm text-muted-foreground">
          <span>{props.thread.replyCount}</span>
          <span>{props.thread.replyCount === 1 ? "Reply" : "Replies"}</span>
          <ChevronDown
            size={20}
            aria-hidden={!open}
            className="aria-hidden:hidden"
          />
          <ChevronUp
            size={20}
            aria-hidden={open}
            className="aria-hidden:hidden"
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <ul className="flex flex-col gap-2 border-l pl-2">
            {replies.data?.map((threadReply) => (
              <li key={threadReply.reply.id}>
                <ReplyCard thread={threadReply.reply} />
              </li>
            ))}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </>
  );
}
