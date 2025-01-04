import { ThreadCard } from "~/app/app/_components/thread-card";
import { ThreadType } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { profileParamsSchema } from "../layout";

export default async function RepliesTab(props: PageProps): AsyncReactNode {
  const params = await props.params;
  const id = profileParamsSchema.parse(params).id;
  const replies = await api.thread.listByAuthor({
    authorId: id,
    type: ThreadType.reply,
  });

  return (
    <section className="py-4">
      <ul className="flex max-w-md flex-col gap-4">
        {replies.map((reply) => (
          <li key={reply.id}>
            <ThreadCard thread={reply} />
          </li>
        ))}
      </ul>
    </section>
  );
}
