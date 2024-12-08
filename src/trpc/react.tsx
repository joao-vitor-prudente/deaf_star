"use client";

import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import {
  unstable_httpBatchStreamLink as httpBatchStreamLink,
  unstable_httpSubscriptionLink as httpSubscriptionLink,
  loggerLink,
  splitLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { useState } from "react";
import SuperJSON from "superjson";

import { env } from "~/env";
import { type AppRouter } from "~/server/api/root";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined = undefined;

function getQueryClient(): QueryClient {
  if (typeof window === "undefined") {
    return createQueryClient();
  }
  if (clientQueryClientSingleton) return clientQueryClientSingleton;

  clientQueryClientSingleton = createQueryClient();
  return clientQueryClientSingleton;
}

export const api = createTRPCReact<AppRouter>();

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;

type TRPCProviderProps = Readonly<{ children: React.ReactNode }>;

export function TRPCReactProvider(props: TRPCProviderProps): React.JSX.Element {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        splitLink({
          condition: (op) => op.type === "subscription",
          true: httpSubscriptionLink({
            url: env.NEXT_PUBLIC_HTTP_URL + env.NEXT_PUBLIC_TRPC_PATH,
            transformer: SuperJSON,
          }),
          false: httpBatchStreamLink({
            url: env.NEXT_PUBLIC_HTTP_URL + env.NEXT_PUBLIC_TRPC_PATH,
            transformer: SuperJSON,
            headers: () => {
              const headers = new Headers();
              headers.set("x-trpc-source", "nextjs-react");
              return headers;
            },
          }),
        }),
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
}
