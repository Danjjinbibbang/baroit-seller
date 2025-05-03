import type { NextConfig } from "next";
import fs from "fs";
import path from "path";

const sslDir = path.join(__dirname, "ssl");

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  server: {
    https: {
      key: fs.readFileSync(path.join(sslDir, "localhost.key")),
      cert: fs.readFileSync(path.join(sslDir, "localhost.crt")),
    },
    port: 3001,
  },
};

export default nextConfig;
