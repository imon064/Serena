import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin workspace root ke folder project ini. Tanpa ini Next bisa salah nebak
  // root gara-gara ada package-lock.json nyasar di folder home.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
