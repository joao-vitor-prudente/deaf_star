import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import * as routers from "./routers";

export const appRouter = createTRPCRouter(routers);

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
