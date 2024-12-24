import { ThreadCard } from "~/app/app/_components/thread-card";
import { ThreadType } from "~/server/db/schema";
import { api } from "~/trpc/server";
import { profileParamsSchema } from "../layout";

export default async function RepliesTab(props: PageProps): AsyncReactNode {
  const params = await props.params;
  const id = profileParamsSchema.parse(params).id;
  const threads = await api.thread.listByAuthor({
    authorId: id,
    type: ThreadType.root,
  });

  return (
    <section className="py-4">
      <ul className="flex flex-col gap-4">
        {threads.map((thread) => (
          <li key={thread.id}>
            <ThreadCard thread={thread} />
          </li>
        ))}
      </ul>
    </section>
  );
}
