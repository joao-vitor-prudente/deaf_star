import { redirect } from "next/navigation";

export default function HomePage(): React.JSX.Element {
  return redirect("/app/chats");
}
