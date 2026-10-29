import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  agentRules: false,
  reactCompiler: true,
  allowedDevOrigins: ["192.168.1.13"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "goodies.plan-it.pro",
      },
      {
        protocol: "http",
        hostname: "*",
      },
    ],
    formats: [ "image/webp"],
    qualities: [50, 75, 100],

    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1600, 1920],

    imageSizes: [16, 32, 48, 64, 96, 128, 200, 256, 384, 512, 640],

    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
  experimental: {
    optimizePackageImports: ["react-icons", "swiper", "@reduxjs/toolkit"],
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);