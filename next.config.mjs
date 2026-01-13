/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' *; connect-src 'self' https://*.clerk.accounts.dev https://clerk.com *; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://*.clerk.accounts.dev https://clerk.com *; style-src 'self' 'unsafe-inline' *; img-src 'self' data: https://*.clerk.com *;",
          },
        ],
      },
    ]
  },
};

export default nextConfig;