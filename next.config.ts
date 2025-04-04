import type { NextConfig } from "next";
import fs from "fs";
const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  server: {
    https: {
      key: fs.readFileSync("./ssl/localhost.key"),
      cert: fs.readFileSync("./ssl/localhost.crt"),
    },
    port: 3001,
  },
};

export default nextConfig;
