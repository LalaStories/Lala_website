import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Allow larger image/video uploads in admin
    },
  },
};

export default nextConfig;
