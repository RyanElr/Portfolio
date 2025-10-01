import type { NextConfig } from "next";

const nextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "img-src 'self' data: https://lh3.googleusercontent.com https://*.googleusercontent.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
