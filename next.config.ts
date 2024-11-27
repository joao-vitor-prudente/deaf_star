import { type NextConfig } from "next";
import "./src/env";

const config = {
  experimental: {
    reactCompiler: true,
    typedRoutes: true,
  },
} satisfies NextConfig;

export default config;
