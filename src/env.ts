import { createEnv } from "@t3-oss/env-nextjs";
import {
  z
} from "zod";

export const env = createEnv({
  server: {
    AUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string()
        : z.string().optional(),
    EMAIL_SERVER_USER: z.string(),
    EMAIL_SERVER_PASSWORD: z.string(),
    EMAIL_SERVER_HOST: z.string(),
    EMAIL_SERVER_PORT: z.string(),
    EMAIL_FROM: z.string(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DELAY_REQUESTS: z.boolean({ coerce: true }).default(false),
    TRPC_PATH: z.string().default("/api/trpc"),
  },

  client: {
    NEXT_PUBLIC_TRPC_PATH: z.string().default("/api/trpc"),
  },

  runtimeEnv: {
    AUTH_SECRET: process.env.AUTH_SECRET,
    EMAIL_SERVER_USER: process.env.EMAIL_SERVER_USER,
    EMAIL_SERVER_PASSWORD: process.env.EMAIL_SERVER_PASSWORD,
    EMAIL_SERVER_HOST: process.env.EMAIL_SERVER_HOST,
    EMAIL_SERVER_PORT: process.env.EMAIL_SERVER_PORT,
    EMAIL_FROM: process.env.EMAIL_FROM,
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    DELAY_REQUESTS: process.env.DELAY_REQUESTS,
    TRPC_PATH: process.env.TRPC_PATH,
    NEXT_PUBLIC_TRPC_PATH: process.env.TRPC_PATH,
  },

  skipValidation: !!process.env.SKIP_ENV_VALIDATION,

  emptyStringAsUndefined: true,
});
