import { ThreadCard } from "~/app/_components/thread-card";
import { SubmitButton } from "~/components/ui/submit-button";
import { Textarea } from "~/components/ui/textarea";
import { createThreadSchema } from "~/server/api/routers/thread";
import { api, revalidateTRPC } from "~/trpc/server";

async function createThreadAction(data: FormData): Promise<void> {
  "use server";
  const objectData = Object.fromEntries(data.entries());
  const parsedData = createThreadSchema.parse(objectData);
  await api.thread.create(parsedData);
  revalidateTRPC("thread.list");
}

export default async function HomePage(): AsyncReactNode {
  const threads = await api.thread.list();

  return (
    <main className="space-y-8 p-8">
      <form action={createThreadAction} className="flex gap-4">
        <Textarea
          id="text"
          name="text"
          placeholder="Whats on your mind?"
          className="w-96"
        />
        <SubmitButton successMessage="Thread shared successfully">
          Share
        </SubmitButton>
      </form>
      <ul className="space-y-4">
        {threads.map((thread) => (
          <li key={thread.id}>
            <ThreadCard thread={thread} />
          </li>
        ))}
      </ul>
    </main>
  );
}
