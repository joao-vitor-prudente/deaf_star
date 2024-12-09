import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function HomePage(): Promise<React.JSX.Element> {
  const session = await auth();
  return session ? redirect("/app/home") : redirect("/auth/sign-in");
}
