import { useState, useEffect } from "react";
import { Bell, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { usePushNotifications } from "@/hooks/usePushNotifications";

/**
 * Full-screen modal that forces logged-in users to enable notifications.
 * Dismissible only after granting permission or if notifications aren't supported.
 */
export default function NotificationPermissionGate() {
  const { user } = useAuth();
  const { permission, isSubscribed, isSupported, subscribe, isLoading } = usePushNotifications();
  const [dismissed, setDismissed] = useState(false);
  const [requesting, setRequesting] = useState(false);

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

  // If permission was denied, show a different message
  const isDenied = permission === "denied";

  const handleAllow = async () => {
    setRequesting(true);
    await subscribe();
    setRequesting(false);
    // If granted, component will unmount via the condition above
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
              ? "You've blocked notifications. Please go to your browser settings and allow notifications for this site to receive important updates about attendance, marks, and announcements."
              : "Stay updated with real-time alerts for attendance, marks, announcements, and more. Allow notifications to never miss important updates."}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          {!isDenied && (
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
