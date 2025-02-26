/* eslint-disable @typescript-eslint/no-require-imports */
import type { NextConfig } from 'next';

const withPWA = require('next-pwa')({
  dest: 'public'
});

const nextConfig: NextConfig = {};

export default withPWA(nextConfig);
