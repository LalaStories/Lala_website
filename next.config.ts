import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async redirects() {
    return [
      // The old Books & Toys catalog page was replaced by /shop.
      { source: "/products", destination: "/shop", permanent: true },
    ];
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // Allow larger image/video uploads in admin
    },
  },
};

export default nextConfig;
