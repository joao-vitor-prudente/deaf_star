import { type Sql } from "postgres";
import { type User } from "./server/db/schema";

declare global {
  // eslint-disable-next-line no-var
  var client: Sql | undefined;
}

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session extends DefaultSession {
    user: User;
  }
}

export {};
