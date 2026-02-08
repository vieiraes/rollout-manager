/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
  webpack: (config) => {
    config.externals.push({
      'utf-8-validate': 'utf-8-validate',
      'bufferutil': 'bufferutil',
    });
    return config;
  },
};

export default nextConfig;
