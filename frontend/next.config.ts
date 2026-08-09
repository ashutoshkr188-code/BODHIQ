import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value:
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https:; " +
      "style-src 'self' 'unsafe-inline' https:; " +
      "img-src 'self' data: blob: https: http://localhost:8000 http://127.0.0.1:8000; " +
      "media-src 'self' blob: https: http://localhost:8000 http://127.0.0.1:8000; " +
      "font-src 'self' data: https:; " +
      "connect-src 'self' wss: https: http://localhost:8000 http://127.0.0.1:8000; " +
      "frame-src 'self' https:;",
  },
];

const nextConfig: NextConfig = {
  // Required for Docker standalone production build
  output: "standalone",

  images: {
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        // Local FastAPI uploads served from /uploads
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        // Local FastAPI uploads served from /uploads using 127.0.0.1 IP
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        // Production FastAPI (Docker internal network)
        protocol: "http",
        hostname: "backend",
        port: "8000",
      },
      {
        // Production domain — update before deploying
        protocol: "https",
        hostname: "*.bodhiq.in",
      },
      {
        protocol: "https",
        hostname: "bodhiqwatch.com",
      },
      {
        protocol: "https",
        hostname: "www.bodhiqwatch.com",
      },
      {
        // AWS EC2 / ECS public URL
        protocol: "https",
        hostname: "api.bodhiq.in",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;