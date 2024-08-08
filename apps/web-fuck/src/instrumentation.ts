import * as Sentry from "@sentry/nextjs";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      enabled: process.env.NODE_ENV === "production",
      dsn: "https://0e26a3db2e2c174a82a08ecc7c7c6d36@o4507240347009024.ingest.us.sentry.io/4507240348450816",
      tracesSampleRate: 1,
      debug: false,
      // Uncomment the line below to enable Spotlight (https://spotlightjs.com)
      // spotlight: process.env.NODE_ENV === 'development',
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      enabled: process.env.NODE_ENV === "production",
      dsn: "https://0e26a3db2e2c174a82a08ecc7c7c6d36@o4507240347009024.ingest.us.sentry.io/4507240348450816",
      tracesSampleRate: 1,
      debug: false,
    });
  }
}
