/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  experimental: {
    optimizePackageImports: ['@react-google-maps/api'],
  },
  images: {
    domains: ['images.unsplash.com'],
  },
}

module.exports = nextConfig
