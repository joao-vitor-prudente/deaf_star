import { type DefaultSession } from "next-auth";
import { type Sql } from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var client: Sql | undefined;
}

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session extends DefaultSession {
    user: { id: string } & DefaultSession["user"];
  }
}

export {};
