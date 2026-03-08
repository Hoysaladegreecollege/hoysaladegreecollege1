import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// On every page load: unregister stale service workers and clear old caches
function ensureFreshContent() {
  try {
    // Clear all browser caches on first visit or version mismatch
    const APP_VERSION_KEY = 'hdc_app_version';
    const currentVersion = import.meta.env.VITE_APP_BUILD_TIME || '__BUILD__';
    const storedVersion = localStorage.getItem(APP_VERSION_KEY);

    if (storedVersion !== currentVersion) {
      localStorage.setItem(APP_VERSION_KEY, currentVersion);

      // Clear all caches
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }

      // Force service worker update
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((reg) => {
            reg.update();
          });
        });
      }
    }
  } catch {
    // Silently fail
  }
}

ensureFreshContent();

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Hide the HTML splash loader once React mounts
const rootLoader = document.getElementById("root-loader");
if (rootLoader) {
  rootLoader.classList.add("hide");
  setTimeout(() => rootLoader.remove(), 500);
}
