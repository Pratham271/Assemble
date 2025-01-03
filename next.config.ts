import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARNING !!
    // This setting allows production builds to complete even if there are TypeScript errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
