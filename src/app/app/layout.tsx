import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { SubmitButton } from "~/components/ui/submit-button";
import { auth, signOut } from "~/server/auth";
import { api } from "~/trpc/server";
import { ChatLink } from "./_components/chat-link";

async function signOutAction(): Promise<void> {
  "use server";
  await signOut();
}

type ChatsLayoutProps = Readonly<{ children: React.ReactNode }>;

export default async function ChatsLayout(
  props: ChatsLayoutProps,
): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session) return redirect("/auth/sign-in");

  const chats = await api.chat.list();

  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <nav>
              <ul>
                <li>
                  <Link href="/app/friends">Friends</Link>
                </li>
                <li>
                  <Link href="/app/chats/create">Create Chat</Link>
                </li>
              </ul>
            </nav>
          </SidebarHeader>
          <SidebarContent>
            <ul className="space-y-4 p-2">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <ChatLink chat={chat} />
                </li>
              ))}
            </ul>
          </SidebarContent>
          <SidebarFooter>
            <div className="flex items-center gap-4 p-2">
              <form action={signOutAction}>
                <SubmitButton>Sign Out</SubmitButton>
              </form>
              <Link href="/app/settings">Settings</Link>
            </div>
          </SidebarFooter>
        </Sidebar>
        <div className="relative h-screen w-full">
          <div className="absolute">
            <SidebarTrigger />
          </div>
          {props.children}
        </div>
      </SidebarProvider>
    </div>
  );
}
