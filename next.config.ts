import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow Jina reader images if we ever add product thumbnails
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
