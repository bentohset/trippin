/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'github.com',
      },
    ],
  },
  env:{
    mapbox_key:'pk.eyJ1IjoiYmVudG9oc2V0IiwiYSI6ImNsY2djdGoxajAwMTQzb3A1dmdraTR5a3kifQ.NnNIeXGObFOi8Ue8QYsNiQ'
  }
}

module.exports = nextConfig
