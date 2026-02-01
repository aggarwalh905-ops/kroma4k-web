/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gen.pollinations.ai',
      },
    ],
  },
};

export default nextConfig;