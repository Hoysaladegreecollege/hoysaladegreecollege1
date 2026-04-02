import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Bell, Send, Users, GraduationCap, BookOpen, Loader2,
  AlertTriangle, Zap, CalendarOff, ShieldAlert, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import SEOHead from "@/components/SEOHead";

type TargetRole = "student" | "teacher";
type AlertPriority = "normal" | "urgent" | "emergency";

const QUICK_TEMPLATES = [
  { label: "🏖️ Holiday", title: "Holiday Notice", message: "College will remain closed on [DATE] on account of [REASON]. Classes will resume on [DATE].", priority: "urgent" as AlertPriority },
  { label: "🚨 Emergency", title: "Emergency Alert", message: "URGENT: [DESCRIBE EMERGENCY]. Please follow safety protocols and stay updated.", priority: "emergency" as AlertPriority },
  { label: "⏰ Early Dismissal", title: "Early Dismissal Today", message: "All students and staff are informed that the college will close early today at [TIME] due to [REASON].", priority: "urgent" as AlertPriority },
  { label: "📢 Exam Update", title: "Exam Schedule Update", message: "Important: The exam for [SUBJECT] scheduled on [DATE] has been [POSTPONED/RESCHEDULED] to [NEW DATE].", priority: "normal" as AlertPriority },
];

const PRIORITY_CONFIG = {
  normal: { label: "Normal", icon: Info, color: "text-primary", bg: "bg-primary/10", border: "border-primary/30", notifType: "broadcast" },
  urgent: { label: "Urgent", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/30", notifType: "urgent" },
  emergency: { label: "Emergency", icon: ShieldAlert, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30", notifType: "emergency" },
};

export default function AdminNotificationBroadcast() {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [targets, setTargets] = useState<TargetRole[]>([]);
  const [priority, setPriority] = useState<AlertPriority>("normal");
  const [sending, setSending] = useState(false);

  const toggleTarget = (role: TargetRole) => {
    setTargets(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const applyTemplate = (t: typeof QUICK_TEMPLATES[0]) => {
    setTitle(t.title);
    setMessage(t.message);
    setPriority(t.priority);
    if (targets.length === 0) setTargets(["student", "teacher"]);
    toast.info(`Template "${t.label}" applied — edit placeholders before sending`);
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
      const notifType = PRIORITY_CONFIG[priority].notifType;
      const prefixedTitle = priority === "emergency"
        ? `🚨 ${title.trim()}`
        : priority === "urgent"
        ? `⚠️ ${title.trim()}`
        : title.trim();

      // 1. Insert in-app notifications (batch 100)
      const notifications = userIds.map(uid => ({
        user_id: uid,
        title: prefixedTitle,
        message: message.trim(),
        type: notifType,
        link: null,
      }));

      for (let i = 0; i < notifications.length; i += 100) {
        await supabase.from("notifications").insert(notifications.slice(i, i + 100) as any);
      }

      // 2. Send web push notifications
      const pushPayload = userIds.map(uid => ({
        user_id: uid,
        title: prefixedTitle,
        body: message.trim(),
        url: targets.includes("student") ? "/dashboard/student" : "/dashboard/teacher",
        tag: `hdc-${notifType}-${Date.now()}`,
      }));

      // 3. Fire web push + FCM in parallel
      await Promise.allSettled([
        supabase.functions.invoke("send-push-notification", {
          body: { notifications: pushPayload },
        }),
        supabase.functions.invoke("send-fcm-notification", {
          body: {
            notifications: userIds.map(uid => ({
              user_id: uid,
              title: prefixedTitle,
              body: message.trim(),
              url: targets.includes("student") ? "/dashboard/student" : "/dashboard/teacher",
            })),
          },
        }),
      ]);

      toast.success(`${PRIORITY_CONFIG[priority].label} alert sent to ${userIds.length} user(s)!`);
      setTitle("");
      setMessage("");
      setTargets([]);
      setPriority("normal");
    } catch (err) {
      console.error("Broadcast error:", err);
      toast.error("Failed to send notification");
    } finally {
      setSending(false);
    }
  };

  const pc = PRIORITY_CONFIG[priority];

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <SEOHead title="Notification Broadcast | Admin" description="Send emergency alerts and notifications" />

      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-2xl ${pc.bg} flex items-center justify-center transition-colors`}>
          <Zap className={`w-6 h-6 ${pc.color}`} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Alert & Broadcast Center</h1>
          <p className="text-sm text-muted-foreground">Send instant alerts via push, in-app & mobile notifications</p>
        </div>
      </div>

      {/* Quick Templates */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Quick Alert Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {QUICK_TEMPLATES.map((t, i) => (
              <button
                key={i}
                type="button"
                onClick={() => applyTemplate(t)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 hover:shadow-sm ${
                  PRIORITY_CONFIG[t.priority].border
                } ${PRIORITY_CONFIG[t.priority].bg} hover:scale-[1.02]`}
              >
                <span className="font-medium text-sm text-foreground">{t.label}</span>
                <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{t.message.slice(0, 50)}…</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority Selector */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Alert Priority
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(PRIORITY_CONFIG) as AlertPriority[]).map(p => {
              const cfg = PRIORITY_CONFIG[p];
              const Icon = cfg.icon;
              const active = priority === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 ${
                    active ? `${cfg.border} ${cfg.bg} shadow-sm` : "border-border/40 hover:border-border"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${active ? cfg.color : "text-muted-foreground"}`} />
                  <span className={`font-medium text-xs ${active ? cfg.color : "text-muted-foreground"}`}>
                    {cfg.label}
                  </span>
                </button>
              );
            })}
          </div>
          {priority === "emergency" && (
            <div className="mt-3 p-2.5 rounded-lg bg-destructive/5 border border-destructive/20 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
              <p className="text-[11px] text-destructive">Emergency alerts are prefixed with 🚨 and sent with highest priority to all channels instantly.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
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

      {/* Content */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Send className="w-4 h-4" />
            Alert Content
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Title</label>
            <Input
              placeholder="e.g. Holiday Announcement, Emergency Closure"
              value={title}
              onChange={e => setTitle(e.target.value)}
              maxLength={100}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
            <Textarea
              placeholder="Enter the alert message..."
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
        className={`w-full h-12 text-base font-semibold gap-2 ${
          priority === "emergency"
            ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
            : priority === "urgent"
            ? "bg-amber-500 hover:bg-amber-600 text-white"
            : ""
        }`}
        size="lg"
      >
        {sending ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending {pc.label} Alert...
          </>
        ) : (
          <>
            {priority === "emergency" ? <ShieldAlert className="w-5 h-5" /> : <Send className="w-5 h-5" />}
            Send {pc.label} Alert
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Sends in-app notifications + web push + Android push to all selected users instantly.
      </p>
    </div>
  );
}
