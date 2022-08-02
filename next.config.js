/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  pageExtensions: [
    "api.ts",
    "page.tsx",
    "page.ts",
  ],
};
module.exports = nextConfig;
