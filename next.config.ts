import { withSerwist } from '@serwist/turbopack'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['192.168.0.103', '192.168.0.104', '192.168.0.105'],
}

export default withSerwist(nextConfig)
