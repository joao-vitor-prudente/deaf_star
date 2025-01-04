import { redirect } from "next/navigation";

export async function redirectFormAction(formData: FormData): Promise<void> {
  "use server";
  await Promise.resolve();
  const cr = formData.get("currentRoute");
  const currentRoute = typeof cr === "string" ? cr : "/";

  const query = Array.from(formData.entries())
    .filter(([key]) => !key.startsWith("$ACTION_ID") && key !== "currentRoute")
    .filter((kv): kv is [string, string] => typeof kv[1] === "string")
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  redirect(`${currentRoute}?${query}`);
}
