import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  type DefaultSession,
  type NextAuthConfig,
  type Session,
} from "next-auth";
import NodeMailerProvider from "next-auth/providers/nodemailer";
import { db } from "~/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "~/server/db/schema";

declare module "next-auth" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Session extends DefaultSession {
    user: { id: string } & DefaultSession["user"];
  }
}

export const authConfig = {
  trustHost: true,
  providers: [
    NodeMailerProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    authorized: ({ auth }): boolean => !!auth,
    session: ({ session, user }): Session => ({
      ...session,
      user: { ...session.user, id: user.id },
    }),
  },
} satisfies NextAuthConfig;
