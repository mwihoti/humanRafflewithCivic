import { createCivicAuthPlugin } from "@civic/auth-web3/nextjs"

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_CIVIC_CLIENT_ID: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID,
  }
}

const withCivicAuth = createCivicAuthPlugin({
  clientId: process.env.NEXT_PUBLIC_CIVIC_CLIENT_ID
})
export default withCivicAuth(nextConfig)
