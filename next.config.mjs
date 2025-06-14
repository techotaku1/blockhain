/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['assets.poap.xyz'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
