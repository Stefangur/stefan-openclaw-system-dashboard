/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['fs'],
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig