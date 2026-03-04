import { supabase } from "@/integrations/supabase/client";

/**
 * Notify students by inserting records into the notifications table.
 * @param courseId - optional course filter
 * @param semester - optional semester filter
 * @param title - notification title
 * @param message - notification body
 * @param type - notification type (attendance, material, announcement, promotion, etc.)
 * @param link - optional link to navigate to
 */
export async function notifyStudents({
  courseId,
  semester,
  title,
  message,
  type = "general",
  link,
}: {
  courseId?: string | null;
  semester?: number | null;
  title: string;
  message: string;
  type?: string;
  link?: string;
}) {
  try {
    let q = supabase.from("students").select("user_id").eq("is_active", true);
    if (courseId) q = q.eq("course_id", courseId);
    if (semester) q = q.eq("semester", semester);
    const { data: students } = await q;
    if (!students || students.length === 0) return;

    const notifications = students.map((s) => ({
      user_id: s.user_id,
      title,
      message,
      type,
      link: link || null,
    }));

    // Insert in batches of 100
    for (let i = 0; i < notifications.length; i += 100) {
      await supabase.from("notifications").insert(notifications.slice(i, i + 100) as any);
    }
  } catch (err) {
    console.error("Failed to notify students:", err);
  }
}
