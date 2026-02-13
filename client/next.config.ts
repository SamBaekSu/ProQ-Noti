import type { NextConfig } from 'next';
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
  dest: 'public',
  skipWaiting: true,
  // @ts-expect-error next-pwa types need update
  exclude: [
    // add buildExcludes here
    ({ asset }: { asset: { name: string } }) => {
      if (
        asset.name.startsWith('server/') ||
        asset.name.match(
          /^((app-|^)build-manifest\.json|react-loadable-manifest\.json)$/
        )
      ) {
        return true;
      }
      return false;
    }
  ]
});

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  // Silence Turbopack warning about webpack config
  turbopack: {},
  experimental: {}
};

// @ts-expect-error next-pwa return type mismatch
export default withPWA(nextConfig);
