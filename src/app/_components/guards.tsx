import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export async function AuthGuard(props: ChildrenProps): AsyncReactNode {
  const session = await auth();
  return session ? redirect("/app/home") : <>{props.children}</>;
}

export async function AppGuard(props: ChildrenProps): AsyncReactNode {
  const session = await auth();
  return session ? <>{props.children}</> : redirect("/auth/sign-in");
}
