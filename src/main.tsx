import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// On every page load: clear old caches on version change (but preserve PWA SW)
function ensureFreshContent() {
  try {
    const APP_VERSION_KEY = 'hdc_app_version';
    const currentVersion = import.meta.env.VITE_APP_BUILD_TIME || '__BUILD__';
    const storedVersion = localStorage.getItem(APP_VERSION_KEY);

    if (storedVersion !== currentVersion) {
      localStorage.setItem(APP_VERSION_KEY, currentVersion);

      // Force hard reload if this isn't the first visit (version changed)
      if (storedVersion) {
        window.location.reload();
        return;
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
