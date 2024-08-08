/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   transpilePackages: ["@repo/ui", "@repo/database"],
//   async rewrites() {
//     return [
//       {
//         source: "/posthog/static/:path*",
//         destination: "https://us-assets.i.posthog.com/static/:path*",
//       },
//       {
//         source: "/posthog/:path*",
//         destination: "https://us.i.posthog.com/:path*",
//       },
//     ];
//   },
//   // This is required to support PostHog trailing slash API requests
//   skipTrailingSlashRedirect: true,
// };

// const withBundleAnalyzer = require("@next/bundle-analyzer")();
// // const { withSentryConfig } = require("@sentry/nextjs");

// module.exports =
//   process.env.ANALYZE === "true"
//     ? withBundleAnalyzer(nextConfig)
//     : nextConfig;
//     // : withSentryConfig(
//     //     nextConfig,
//     //     {
//     //       // For all available options, see:
//     //       // https://github.com/getsentry/sentry-webpack-plugin#options

//     //       // Suppresses source map uploading logs during build
//     //       silent: true,
//     //       org: "rodeoooo",
//     //       project: "javascript-nextjs",
//     //     },
//     //     {
//     //       // For all available options, see:
//     //       // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

//     //       // Upload a larger set of source maps for prettier stack traces (increases build time)
//     //       widenClientFileUpload: true,

//     //       // Transpiles SDK to be compatible with IE11 (increases bundle size)
//     //       transpileClientSDK: true,

//     //       // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
//     //       // This can increase your server load as well as your hosting bill.
//     //       // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
//     //       // side errors will fail.
//     //       tunnelRoute: "/sentry",

//     //       // Hides source maps from generated client bundles
//     //       hideSourceMaps: true,

//     //       // Automatically tree-shake Sentry logger statements to reduce bundle size
//     //       disableLogger: true,

//     //       // Enables automatic instrumentation of Vercel Cron Monitors.
//     //       // See the following for more information:
//     //       // https://docs.sentry.io/product/crons/
//     //       // https://vercel.com/docs/cron-jobs
//     //       automaticVercelMonitors: true,
//     //     },
//     //   );
