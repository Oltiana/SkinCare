import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Makes DEV_OPEN_DASHBOARD visible to Edge middleware during local dev/build. */
  env: {
    DEV_OPEN_DASHBOARD: process.env.DEV_OPEN_DASHBOARD ?? "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
