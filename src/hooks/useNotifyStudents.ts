import { supabase } from "@/integrations/supabase/client";

/**
 * Notify students by inserting records into the notifications table
 * AND sending browser push notifications.
 */
export async function notifyStudents({
  courseId,
  semester,
  title,
  message,
  type = "general",
  link,
  perStudentPush,
}: {
  courseId?: string | null;
  semester?: number | null;
  title: string;
  message: string;
  type?: string;
  link?: string;
  /** For per-student push content (e.g. attendance with individual status) */
  perStudentPush?: Array<{ user_id: string; title: string; body: string; url?: string }>;
}) {
  try {
    let q = supabase.from("students").select("user_id").eq("is_active", true);
    if (courseId) q = q.eq("course_id", courseId);
    if (semester) q = q.eq("semester", semester);
    const { data: students } = await q;
    if (!students || students.length === 0) return;

    // Insert in-app notifications
    const notifications = students.map((s) => ({
      user_id: s.user_id,
      title,
      message,
      type,
      link: link || null,
    }));

    for (let i = 0; i < notifications.length; i += 100) {
      await supabase.from("notifications").insert(notifications.slice(i, i + 100) as any);
    }

    // Send browser push notifications
    try {
      const pushNotifications = perStudentPush || students.map((s) => ({
        user_id: s.user_id,
        title,
        body: message,
        url: link || '/dashboard/student',
        tag: `hdc-${type}-${Date.now()}`,
      }));

      if (pushNotifications.length > 0) {
        console.log('Sending push notifications:', pushNotifications.length);
        const { data, error: pushError } = await supabase.functions.invoke('send-push-notification', {
          body: { notifications: pushNotifications },
        });
        if (pushError) {
          console.error('Push notification edge function error:', pushError);
        } else {
          console.log('Push notification result:', data);
        }
      }
    } catch (pushErr) {
      console.error("Push notification failed (non-critical):", pushErr);
    }
  } catch (err) {
    console.error("Failed to notify students:", err);
  }
}
