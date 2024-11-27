import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { revalidatePath } from "next/cache";
import { env } from "~/env";
import { createCaller, type AppRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";
import { createQueryClient } from "./query-client";

const createContext = cache(async () => {
  const heads = new Headers(await headers());
  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
  });
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);

type TRPCPaths<T extends Record<string, unknown>> = {
  [K in keyof T]: K extends string
    ? {
        [SubK in keyof T[K]]: SubK extends string ? `${K}.${SubK}` : never;
      }[keyof T[K]]
    : never;
}[keyof T];

export function revalidateTRPC(path: TRPCPaths<typeof api>): void {
  revalidatePath(`${env.TRPC_PATH}/${path}`);
}
