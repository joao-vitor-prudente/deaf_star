import { Home, Search, User } from "lucide-react";
import { AppGuard } from "~/app/_components/guards";
import { ModeToggle } from "~/components/ui/mode-toggle";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { auth } from "~/helpers/auth";

export default async function ChatsLayout(props: LayoutProps): AsyncReactNode {
  const session = await auth();

  return (
    <AppGuard>
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
    </AppGuard>
  );
}
