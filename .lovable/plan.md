

# Multi-Feature Update Plan

## 1. Message Reply/Quote Feature

The `direct_messages` table already has a `parent_message_id` column. We'll use it to support replying to specific messages.

**Database**: No schema changes needed — column exists.

**TeacherMessages.tsx & StudentMessages.tsx changes:**
- Add `replyTo` state holding the message being replied to
- When replying, set `parent_message_id` in the insert
- Show a quoted preview bar above the input area (with close button)
- In message bubbles, if `parent_message_id` exists, render a compact quoted block above the message text with the original message snippet
- Fetch parent message data from the existing thread messages array

## 2. Send Notification on Message Send

**Both TeacherMessages.tsx & StudentMessages.tsx:**
- After `supabase.from("direct_messages").insert(...)`, insert a notification for the receiver:
  ```
  { user_id: selectedContactId, title: "💬 New Message", message: "...", type: "message", link: "/dashboard/..." }
  ```
- Also invoke `send-push-notification` edge function with the receiver's user_id for device push notification

## 3. Google Analytics Tag

**index.html**: Add the gtag.js snippet immediately after `<head>`.

## 4. Marks Edit & Delete for Teachers

**TeacherMarks.tsx** — add a new "Manage Marks" section:
- Add a tab or section below the upload form showing previously uploaded marks
- Query marks table filtered by `uploaded_by = user.id` (or by course/semester)
- Each row shows student name, subject, exam type, obtained/max marks
- **Edit**: Inline edit button opens marks input, saves via `.update()` on the marks table
- **Delete**: Delete button with confirmation, uses `.delete()` on the marks table
- Existing RLS "Staff can manage marks" policy covers UPDATE and DELETE for teachers

## 5. Enhanced Messages UI (Both Teacher & Student)

Micro-animation and rounded corner enhancements:
- Reply quote block with gradient left border and slide-in animation
- Message send button with ripple micro-animation
- Contact list items with spring-in animation on mount
- All buttons use `rounded-2xl` consistently
- Message bubbles get subtle scale-in animation on appear
- Emoji picker slides up with spring animation

## Files Changed

1. **index.html** — Add Google Analytics tag
2. **src/pages/dashboard/teacher/TeacherMessages.tsx** — Reply/quote feature, notification on send, UI micro-animations
3. **src/pages/dashboard/student/StudentMessages.tsx** — Reply/quote feature, notification on send, UI micro-animations  
4. **src/pages/dashboard/teacher/TeacherMarks.tsx** — Add edit/delete uploaded marks section

