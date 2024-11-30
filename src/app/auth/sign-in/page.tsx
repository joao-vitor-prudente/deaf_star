import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { SubmitButton } from "~/components/ui/submit-button";
import { signIn } from "~/server/auth";

async function signInAction(formData: FormData): Promise<void> {
  "use server";
  await signIn("nodemailer", formData);
}

export default function SignInPage(): React.JSX.Element {
  return (
    <main className="m-auto flex h-screen w-min flex-col justify-center gap-12">
      <header>
        <h2 className="text-3xl">Sign In</h2>
      </header>
      <form className="flex w-96 flex-col gap-6" action={signInAction}>
        <Label htmlFor="email" className="space-y-2">
          <span>E-mail</span>
          <Input type="email" id="email" name="email" autoComplete="email" />
        </Label>
        <SubmitButton type="submit">Sign In</SubmitButton>
      </form>
    </main>
  );
}
