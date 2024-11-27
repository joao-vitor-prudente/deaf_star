import { redirect } from "next/navigation";

export default function Home(): React.JSX.Element {
  return redirect("/app/chats");
}
