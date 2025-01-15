import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static-cdn.jtvnw.net',
        pathname: '/jtv_user_pictures/**',
      },
      {
        protocol: 'https',
        hostname: 'robohash.org',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
