

# Plan: Add Teacher Messages Page

The teacher dashboard is missing a "Messages" nav item and page. Teachers need to view and respond to messages from students.

## Changes

### 1. Create `src/pages/dashboard/teacher/TeacherMessages.tsx`
- Reuse the same architecture as `StudentMessages.tsx` but adapted for teachers
- Contact tabs: "Students" (primary) and "Teachers" (peers)
- Fetches students list (from `students` + `profiles` tables) and teacher peers (from `teachers` + `profiles`)
- Same file sharing, real-time updates, and premium UI as the student version
- Uses `direct_messages` table with existing RLS policies (sender/receiver matching works for both roles)

### 2. Update `src/components/DashboardLayout.tsx`
- Add `{ label: "Messages", path: "/dashboard/teacher/messages", icon: MessageSquare }` to `teacherNav` array (after "Notices")

### 3. Update `src/App.tsx`
- Import `TeacherMessages` component
- Add route: `<Route path="messages" element={<TeacherMessages />} />`  under the teacher dashboard routes

**No database changes needed** — existing RLS on `direct_messages`, `profiles`, `students`, and `teachers` tables already supports teacher access.

