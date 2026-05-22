/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Временно, пока настраиваешь
  },
  typescript: {
    ignoreBuildErrors: true,  // Временно
  },
}

module.exports = nextConfig
