import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Self-contained server build for Docker (step 6).
  output: "standalone",
  poweredByHeader: false,
  // Don't write AGENTS.md into the project on `next dev`.
  agentRules: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Nobody may show the site (or the admin dashboard) inside a frame: blocks clickjacking.
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
