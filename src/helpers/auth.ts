import { type Session } from "next-auth";
import { redirect } from "next/navigation";
import { auth as _auth } from "~/server/auth";

export async function auth(): Promise<Session> {
  const session = await _auth();
  return session ?? redirect("/auth/sign-in");
}
