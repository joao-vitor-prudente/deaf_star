/* eslint-disable @typescript-eslint/no-base-to-string */

import { redirect } from "next/navigation";

export async function redirectFormAction(formData: FormData): Promise<void> {
  "use server";
  await Promise.resolve();

  const currentRoute = formData.get("currentRoute")?.toString() ?? "";

  const query = Array.from(formData.entries())
    .filter(([key]) => !key.startsWith("$ACTION_ID") && key !== "currentRoute")
    .map(([key, value]) => `${key}=${value.toString()}`)
    .join("&");

  redirect(`${currentRoute}?${query}`);
}
