import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "prismarenting.com" },
      { protocol: "https", hostname: "www.prismarenting.com" },
    ],
  },
  outputFileTracingIncludes: {
    "/*": ["./migration-runtime/**/*", "./migration-products/**/*", "./migration-content/**/*"],
  },
};

export default nextConfig;
