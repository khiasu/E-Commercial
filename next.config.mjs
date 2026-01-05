/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '*',
    '.replit.dev',
    '.replit.app'
  ],
  transpilePackages: ["@clerk/nextjs"],
};

export default nextConfig;