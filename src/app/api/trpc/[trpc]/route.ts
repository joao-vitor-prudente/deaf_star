import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { type NextRequest } from "next/server";

import { env } from "~/env";
import { appRouter } from "~/server/api/root";
import { createTRPCContext, type TRPCContext } from "~/server/api/trpc";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a HTTP request (e.g. when you make requests from Client Components).
 */
async function createContext(req: NextRequest): Promise<TRPCContext> {
  return createTRPCContext({ headers: req.headers });
}

function handler(req: NextRequest): Promise<Response> {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => createContext(req),
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }): void => {
            console.error(`❌ tRPC failed on ${path ?? ""}: ${error.message}`);
          }
        : undefined,
  });
}
export { handler as GET, handler as POST };
