import type { NextConfig } from "next";

const { PROD_URL, PORT, JWT_SECRET, JWT_DURATION, PASSWORD } = process.env;

const API_URL =
  process.env.NODE_ENV === "production" ? PROD_URL : `http://localhost:${PORT}`;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: { API_URL, JWT_SECRET, JWT_DURATION, PASSWORD },
};

export default nextConfig;
