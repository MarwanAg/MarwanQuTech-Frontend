import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server build for Docker (step 6).
  output: "standalone",
  poweredByHeader: false,
  // Don't write AGENTS.md into the project on `next dev`.
  agentRules: false,
};

export default nextConfig;
