import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Unregister any stale service workers to ensure fresh content
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister());
  });
}

// Clear caches on hard reload (Ctrl+Shift+R or manual refresh)
if ((performance as any).navigation?.type === 1 || (performance.getEntriesByType?.("navigation")?.[0] as any)?.type === "reload") {
  if ("caches" in window) {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
