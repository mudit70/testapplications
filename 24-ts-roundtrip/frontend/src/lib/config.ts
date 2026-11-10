declare global {
  interface Window {
    __CONFIG__: { telemetryUrl: string };
  }
}

// Filled in by the page that hosts the app, so the URL is not in this repository.
export const config = { telemetryUrl: window.__CONFIG__.telemetryUrl };
