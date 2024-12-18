import { Home, Search, User } from "lucide-react";
import { redirect } from "next/navigation";
import { ModeToggle } from "~/components/ui/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { auth } from "~/server/auth";

type ChatsLayoutProps = Readonly<{ children: React.ReactNode }>;

export default async function ChatsLayout(
  props: ChatsLayoutProps,
): Promise<React.JSX.Element> {
  const session = await auth();
  if (!session) return redirect("/auth/sign-in");

  return (
    <div className="flex h-screen flex-col divide-y divide-primary-foreground">
      <header>
        <NavigationMenu>
          <NavigationMenuList className="p-4">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/app/home"
                className={navigationMenuTriggerStyle()}
              >
                <div className="flex items-center gap-2">
                  <Home />
                  <span>Home</span>
                </div>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/app/search"
                className={navigationMenuTriggerStyle()}
              >
                <div className="flex items-center gap-2">
                  <Search />
                  <span>Search</span>
                </div>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href={`/app/profile/${session.user.id}`}
                className={navigationMenuTriggerStyle()}
              >
                <div className="flex items-center gap-2">
                  <User />
                  <span>Profile</span>
                </div>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="fixed right-4 top-4">
          <ModeToggle />
        </div>
      </header>
      <div className="flex-1">{props.children}</div>
    </div>
  );
}
