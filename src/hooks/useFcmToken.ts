import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Captures FCM token injected by the Android WebView wrapper
 * via window.__FCM_TOKEN__ and saves it to the fcm_tokens table.
 */
export function useFcmToken() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const saveFcmToken = async (token: string) => {
      if (!token) return;
      try {
        // Upsert: check if exists first
        const { data: existing } = await supabase
          .from("fcm_tokens" as any)
          .select("id")
          .eq("user_id", user.id)
          .eq("token", token)
          .maybeSingle();

        if (!existing) {
          await supabase.from("fcm_tokens" as any).insert({
            user_id: user.id,
            token,
            device_info: navigator.userAgent?.substring(0, 200) || "android",
          });
          console.log("FCM token saved to database");
        }
      } catch (err) {
        console.error("Failed to save FCM token:", err);
      }
    };

    // Check if token is already available (injected by Android before page load)
    const existingToken = (window as any).__FCM_TOKEN__;
    if (existingToken) {
      saveFcmToken(existingToken);
    }

    // Listen for token updates from Android bridge
    const originalSetter = Object.getOwnPropertyDescriptor(window, "__FCM_TOKEN__")?.set;
    
    // Use a polling approach for simplicity - check every 5 seconds for 30 seconds
    let attempts = 0;
    const maxAttempts = 6;
    const interval = setInterval(() => {
      attempts++;
      const token = (window as any).__FCM_TOKEN__;
      if (token) {
        saveFcmToken(token);
        clearInterval(interval);
      } else if (attempts >= maxAttempts) {
        clearInterval(interval);
      }
    }, 5000);

    // Also listen for custom event from Android bridge
    const handler = (e: any) => {
      const token = e.detail?.token || (window as any).__FCM_TOKEN__;
      if (token) saveFcmToken(token);
    };
    window.addEventListener("fcm-token-ready", handler);

    return () => {
      clearInterval(interval);
      window.removeEventListener("fcm-token-ready", handler);
    };
  }, [user]);
}
