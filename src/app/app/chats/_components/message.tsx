import { format, isToday } from "date-fns";
import { type MessageWithSender } from "~/server/api/routers/message";
import { auth } from "~/server/auth";

type MessageProps = Readonly<{ message: MessageWithSender }>;

export async function Message(props: MessageProps): Promise<React.JSX.Element> {
  const session = await auth();
  const isFromCurrentUser = session?.user.id === props.message.sender.id;

  return (
    <div
      data-is-from-current-user={isFromCurrentUser}
      className="flex w-full justify-start data-is-from-current-user:justify-end"
    >
      <div className="min-w-96 rounded-md bg-zinc-900 p-2">
        <div>
          <p className="text-xs text-zinc-500">
            <span>@</span>
            <span>{props.message.sender.email?.split("@").at(0)}</span>
          </p>
          <p>{props.message.text}</p>
        </div>
        <p className="w-full text-right text-xs text-zinc-500">
          {isToday(props.message.createdAt)
            ? format(props.message.createdAt, "HH:mm")
            : format(props.message.createdAt, "dd/MM/yyyy HH:mm")}
        </p>
      </div>
    </div>
  );
}
