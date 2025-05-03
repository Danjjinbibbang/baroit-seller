// next.config.ts
import type { NextConfig } from "next";
import fs   from "fs";
import path from "path";

const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true },
  // 개발 환경에서만 server 옵션에 https 를 추가
  ...(isDev && {
    server: {
      https: {
        key:  fs.readFileSync(path.join(__dirname, "ssl", "localhost.key")),
        cert: fs.readFileSync(path.join(__dirname, "ssl", "localhost.crt")),
      },
      port: 3001,
    },
  }),
};

export default nextConfig;
