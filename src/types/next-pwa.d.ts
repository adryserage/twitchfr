declare module "next-pwa" {
  import { NextConfig } from "next";

  interface RuntimeCacheOptions {
    urlPattern: RegExp | string;
    handler: string;
    options?: {
      cacheName?: string;
      expiration?: {
        maxEntries?: number;
        maxAgeSeconds?: number;
      };
      cacheableResponse?: {
        statuses: number[];
        headers?: { [key: string]: string };
      };
      networkTimeoutSeconds?: number;
      plugins?: unknown[];
    };
  }

  interface WorkboxOptions {
    swDest?: string;
    clientsClaim?: boolean;
    skipWaiting?: boolean;
    sourcemap?: boolean;
    additionalManifestEntries?: Array<{ url: string; revision: string | null }>;
    cleanupOutdatedCaches?: boolean;
    maximumFileSizeToCacheInBytes?: number;
  }

  interface PWAConfig {
    dest?: string;
    disable?: boolean;
    register?: boolean;
    scope?: string;
    sw?: string;
    runtimeCaching?: RuntimeCacheOptions[];
    buildExcludes?: string[];
    publicExcludes?: string[];
    fallbacks?: {
      [key: string]: string;
    };
    cacheOnFrontEndNav?: boolean;
    reloadOnOnline?: boolean;
    subdomainPrefix?: string;
    workboxOptions?: WorkboxOptions;
  }

  function withPWA(config: PWAConfig): (nextConfig: NextConfig) => NextConfig;
  export default withPWA;
}
