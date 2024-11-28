import { type Session } from "next-auth";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export async function getSessionOrRedirect(): Promise<Session> {
  const session = await auth();
  return session ?? redirect("/auth/sign-in");
}
