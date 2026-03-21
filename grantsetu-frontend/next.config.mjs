/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker standalone builds
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
