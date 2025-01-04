import { notFound } from "next/navigation";
import { SubmitButton } from "~/components/ui/submit-button";
import { Textarea } from "~/components/ui/textarea";
import { createReplySchema } from "~/server/api/routers/reply";
import { getThreadByIdSchema } from "~/server/api/routers/thread";
import { api, revalidateTRPC } from "~/trpc/server";
import { ThreadCard } from "../../_components/thread-card";

async function createReplyAction(data: FormData): Promise<void> {
  "use server";
  const objectData = Object.fromEntries(data.entries());
  const parsedData = createReplySchema.parse(objectData);
  await api.reply.create(parsedData);
  revalidateTRPC("reply.list");
}

export default async function ThreadsPage(props: PageProps): AsyncReactNode {
  const params = await props.params;
  const id = getThreadByIdSchema.parse(params).id;
  const thread = await api.thread.getById({ id });
  const replies = await api.reply.list({ threadId: id });

  if (!thread) return notFound();

  return (
    <main className="flex flex-col gap-4 p-8">
      <header className="flex flex-col gap-4">
        <ThreadCard thread={thread} />
        <form action={createReplyAction} className="flex gap-4">
          <input type="hidden" name="threadId" value={thread.id} readOnly />
          <Textarea
            id="text"
            name="text"
            placeholder="Reply to thread"
            className="w-96"
            required
          />
          <SubmitButton successMessage="Reply posted successfully">
            Reply
          </SubmitButton>
        </form>
      </header>
      <hr />
      <ul>
        {replies.map((threadReply) => (
          <li key={threadReply.reply.id}>
            <ThreadCard thread={threadReply.reply} />
          </li>
        ))}
      </ul>
    </main>
  );
}
