import { z } from "zod";
import { ClipboardButton } from "~/components/ui/clipboard-button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "~/components/ui/navigation-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { env } from "~/env";

type ProfileLayoutProps = LayoutProps &
  Readonly<{
    replies: ReactNode;
    threads: ReactNode;
    reposts: ReactNode;
    edit: ReactNode;
  }>;

export const profileParamsSchema = z.object({ id: z.string() });

export default async function ProfileLayout(
  props: ProfileLayoutProps,
): AsyncReactNode {
  const params = await props.params;
  const id = profileParamsSchema.parse(params).id;

  return (
    <div className="space-y-8 p-8">
      {props.children}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>{props.edit}</NavigationMenuItem>
          <NavigationMenuItem>
            <ClipboardButton
              text={`${env.NEXT_PUBLIC_HTTP_URL}/app/profile/${id}`}
            >
              Share profile
            </ClipboardButton>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Tabs defaultValue="threads">
        <TabsList>
          <TabsTrigger value="threads">Threads</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
          <TabsTrigger value="reposts">Reposts</TabsTrigger>
        </TabsList>
        <TabsContent value="threads">{props.threads}</TabsContent>
        <TabsContent value="replies">{props.replies}</TabsContent>
        <TabsContent value="reposts">{props.reposts}</TabsContent>
      </Tabs>
    </div>
  );
}
