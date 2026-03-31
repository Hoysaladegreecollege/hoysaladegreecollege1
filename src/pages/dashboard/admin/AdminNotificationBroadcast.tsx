import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Bell, Send, Users, GraduationCap, BookOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import SEOHead from "@/components/SEOHead";

type TargetRole = "student" | "teacher";

export default function AdminNotificationBroadcast() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targets, setTargets] = useState<TargetRole[]>([]);
  const [sending, setSending] = useState(false);

  const toggleTarget = (role: TargetRole) => {
    setTargets(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast.error("Please enter both title and message");
      return;
    }
    if (targets.length === 0) {
      toast.error("Please select at least one target audience");
      return;
    }

    setSending(true);
    try {
      // 1. Get user IDs for target roles
      const { data: roleUsers } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", targets);

      if (!roleUsers || roleUsers.length === 0) {
        toast.warning("No users found for selected roles");
        setSending(false);
        return;
      }

      const userIds = roleUsers.map(r => r.user_id);

      // 2. Insert in-app notifications (batch 100)
      const notifications = userIds.map(uid => ({
        user_id: uid,
        title: title.trim(),
        message: message.trim(),
        type: "broadcast",
        link: null,
      }));

      for (let i = 0; i < notifications.length; i += 100) {
        await supabase.from("notifications").insert(notifications.slice(i, i + 100) as any);
      }

      // 3. Send web push notifications
      const pushPayload = userIds.map(uid => ({
        user_id: uid,
        title: title.trim(),
        body: message.trim(),
        url: targets.includes("student") ? "/dashboard/student" : "/dashboard/teacher",
        tag: `hdc-broadcast-${Date.now()}`,
      }));

      try {
        await supabase.functions.invoke("send-push-notification", {
          body: { notifications: pushPayload },
        });
      } catch (e) {
        console.warn("Web push failed (non-critical):", e);
      }

      // 4. Send FCM notifications to Android devices
      try {
        await supabase.functions.invoke("send-fcm-notification", {
          body: {
            target_role: targets,
            notifications: userIds.map(uid => ({
              user_id: uid,
              title: title.trim(),
              body: message.trim(),
              url: targets.includes("student") ? "/dashboard/student" : "/dashboard/teacher",
            })),
          },
        });
      } catch (e) {
        console.warn("FCM push failed (non-critical):", e);
      }

      toast.success(`Notification sent to ${userIds.length} ${targets.join(" & ")}(s)!`);
      setTitle("");
      setMessage("");
      setTargets([]);
    } catch (err) {
      console.error("Broadcast error:", err);
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SEOHead title="Notification Broadcast | Admin" description="Send notifications to students and teachers" />
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Bell className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Notification Broadcast</h1>
          <p className="text-sm text-muted-foreground">Send push notifications to students and teachers</p>
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Target Audience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => toggleTarget("student")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                targets.includes("student")
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/60 hover:border-primary/40"
              }`}
            >
              <Checkbox checked={targets.includes("student")} className="pointer-events-none" />
              <GraduationCap className={`w-5 h-5 ${targets.includes("student") ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`font-medium text-sm ${targets.includes("student") ? "text-primary" : "text-foreground"}`}>
                Students
              </span>
            </button>

            <button
              type="button"
              onClick={() => toggleTarget("teacher")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                targets.includes("teacher")
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border/60 hover:border-primary/40"
              }`}
            >
              <Checkbox checked={targets.includes("teacher")} className="pointer-events-none" />
              <BookOpen className={`w-5 h-5 ${targets.includes("teacher") ? "text-primary" : "text-muted-foreground"}`} />
              <span className={`font-medium text-sm ${targets.includes("teacher") ? "text-primary" : "text-foreground"}`}>
                Teachers
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="w-4 h-4" />
            Notification Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
            <Input
              placeholder="e.g. Holiday Announcement"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
            <Textarea
              placeholder="Enter the notification message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <p className="text-[11px] text-muted-foreground mt-1">{message.length}/500 characters</p>
          </div>
        </CardContent>
      </Card>

      <Button
        onClick={handleSend}
        disabled={sending || !title.trim() || !message.trim() || targets.length === 0}
        className="w-full h-12 text-base font-semibold gap-2"
        size="lg"
      >
        {sending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Send Notification
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        This will send in-app notifications, web push, and Android push notifications to all selected users.
      </p>
    </div>
  );
}
