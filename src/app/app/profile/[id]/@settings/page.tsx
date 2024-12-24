import { LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { SubmitButton } from "~/components/ui/submit-button";
import { signOut } from "~/server/auth";

async function signOutAction(): Promise<void> {
  "use server";
  await signOut();
}

export default function SettingsSheet(): ReactNode {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Account Settings</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Account Settings</SheetTitle>
          <SheetDescription>
            You can configure your account settings here.
          </SheetDescription>
        </SheetHeader>
        <form action={signOutAction} className="flex flex-col gap-4 py-4">
          <SubmitButton
            variant="ghost"
            successMessage="Signed out successfully"
            className="flex items-center justify-start gap-2"
          >
            <LogOut />
            <span>Sign out</span>
          </SubmitButton>
        </form>
      </SheetContent>
    </Sheet>
  );
}
