import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.ufs.sh",
      },
    ],
  },
  allowedDevOrigins: ['0.0.0.0','192.168.0.229'],
};

export default nextConfig;
