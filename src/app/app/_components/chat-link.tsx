import { format, isThisWeek, isToday, isYesterday } from "date-fns";
import Link from "next/link";
import { type ChatWithLastMessage } from "~/server/api/routers/chat";

type ChatLinkProps = Readonly<{ chat: ChatWithLastMessage }>;

export function ChatLink(props: ChatLinkProps): React.JSX.Element {
  return (
    <Link
      className="flex gap-2 rounded-md bg-zinc-800 p-2"
      href={`/app/chats/${props.chat.id}`}
    >
      <div className="flex flex-1 flex-col">
        <h6>{props.chat.name}</h6>
        {props.chat.lastMessage?.sender ? (
          <p className="flex gap-1 text-sm text-zinc-500">
            <span>{props.chat.lastMessage.sender.email.split("@").at(0)}</span>
            <span>:</span>
            <span>{props.chat.lastMessage.text}</span>
          </p>
        ) : (
          <p className="text-sm text-zinc-500">No messages yet</p>
        )}
      </div>
      {props.chat.lastMessage && (
        <p className="text-sm text-zinc-500">
          {formatDate(props.chat.lastMessage.createdAt)}
        </p>
      )}
    </Link>
  );
}

function formatDate(date: Date): string {
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return "Yesterday";
  if (isThisWeek(date)) return format(date, "EEEE");
  return format(date, "dd/MM/yyyy");
}
