"use client";

import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";

export default function ErrorPage(props: ErrorPageProps): React.JSX.Element {
  if (props.error.message === "UNAUTHORIZED") return redirect("/auth/sign-in");

  return (
    <main>
      <h2>Something went wrong</h2>
      <p>{props.error.message}</p>
      <Button onClick={props.reset}>Try again</Button>
    </main>
  );
}
