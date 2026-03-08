import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Smart cache clearing: clear cache after 3+ refreshes within 30 seconds
const REFRESH_KEY = 'hdc_refresh_tracker';
const REFRESH_WINDOW = 30_000; // 30 seconds

function trackRefreshAndClearCache() {
  try {
    const now = Date.now();
    const stored = localStorage.getItem(REFRESH_KEY);
    let tracker = stored ? JSON.parse(stored) : { timestamps: [] };
    
    // Filter timestamps within the window
    tracker.timestamps = tracker.timestamps.filter((t: number) => now - t < REFRESH_WINDOW);
    tracker.timestamps.push(now);
    localStorage.setItem(REFRESH_KEY, JSON.stringify(tracker));
    
    // If 3+ refreshes in the window, clear caches
    if (tracker.timestamps.length >= 3) {
      console.log('Multiple refreshes detected, clearing caches...');
      localStorage.setItem(REFRESH_KEY, JSON.stringify({ timestamps: [] }));
      
      if ("caches" in window) {
        caches.keys().then((names) => {
          names.forEach((name) => caches.delete(name));
        });
      }
    }
  } catch {
    // Silently fail
  }
}

// Track on every page load
trackRefreshAndClearCache();

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
