import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function AuthLayout(
  props: LayoutProps,
): Promise<React.JSX.Element> {
  const session = await auth();
  if (session) return redirect("/app/chats");

  return <>{props.children}</>;
}
