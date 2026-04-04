import { useState, useEffect } from "react";
import { Bell, ShieldAlert, Settings, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Capacitor } from "@capacitor/core";

/**
 * Full-screen modal that forces logged-in users to enable notifications.
 * On native apps, redirects to app notification settings when denied.
 */
export default function NotificationPermissionGate() {
  const { user } = useAuth();
  const { permission, isSubscribed, isSupported, subscribe, isLoading } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const isNative = Capacitor.isNativePlatform();

  // Reset dismissed state when user changes
  useEffect(() => {
    setDismissed(false);
  }, [user?.id]);

  // Don't show if: no user, already subscribed, already granted, not supported, or dismissed
  if (
    !user ||
    isSubscribed ||
    permission === "granted" ||
    !isSupported ||
    dismissed
  ) {
    return null;
  }

  const isDenied = permission === "denied";

  const handleAllow = async () => {
    setRequesting(true);
    await subscribe();
    setRequesting(false);
  };

  const handleOpenSettings = async () => {
    try {
      const { NativeSettings, AndroidSettings, IOSSettings } = await import("capacitor-native-settings");
      await NativeSettings.open({
        optionAndroid: AndroidSettings.AppNotification,
        optionIOS: IOSSettings.App,
      });
    } catch (err) {
      console.error("Failed to open native settings:", err);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-5 animate-in fade-in zoom-in-95 duration-300">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {isDenied ? (
              <ShieldAlert className="w-8 h-8 text-destructive" />
            ) : (
              <Bell className="w-8 h-8 text-primary animate-bounce" />
            )}
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-foreground">
            {isDenied ? "Notifications Blocked" : "Enable Notifications"}
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {isDenied
              ? isNative
                ? "Notifications are turned off for this app. Tap below to open your phone's settings and enable notifications to receive important updates."
                : "You've blocked notifications. Please go to your browser settings and allow notifications for this site to receive important updates about attendance, marks, and announcements."
              : "Stay updated with real-time alerts for attendance, marks, announcements, and more. Allow notifications to never miss important updates."}
          </p>
        </div>

        {/* Feature highlights */}
        {!isDenied && (
          <div className="space-y-2 px-2">
            {[
              { icon: "📋", text: "Attendance alerts when marked" },
              { icon: "📊", text: "Marks & results updates" },
              { icon: "📢", text: "Important announcements" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                <span className="text-sm">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2.5">
          {isDenied && isNative ? (
            <Button
              onClick={handleOpenSettings}
              className="w-full h-12 text-base font-semibold rounded-xl gap-2"
            >
              <Settings className="w-4 h-4" />
              Open App Settings
            </Button>
          ) : !isDenied ? (
            <Button
              onClick={handleAllow}
              disabled={isLoading || requesting}
              className="w-full h-12 text-base font-semibold rounded-xl"
            >
              {isLoading || requesting ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Allow Notifications
                </>
              )}
            </Button>
          ) : null}

          {isDenied && !isNative && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border">
              <Smartphone className="w-4 h-4 text-muted-foreground shrink-0" />
              <p className="text-[11px] text-muted-foreground leading-snug">
                Click the lock/info icon in your browser's address bar → Site settings → Allow notifications
              </p>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={() => setDismissed(true)}
            className="w-full text-xs text-muted-foreground hover:text-foreground"
          >
            {isDenied ? "I understand, continue anyway" : "Maybe later"}
          </Button>
        </div>
      </div>
    </div>
  );
}
