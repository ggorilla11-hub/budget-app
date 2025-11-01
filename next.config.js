/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn1.genspark.ai'],
    formats: ['image/avif', 'image/webp']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}

module.exports = nextConfig
