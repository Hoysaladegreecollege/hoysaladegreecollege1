# Advanced Features Plan

## Overview

Add 7 high-impact, practical features across the public website and dashboards. No charts, no chat systems, no data visualizations -- purely functional utilities.

---

## Features

### 2. Student Feedback System (Student Dashboard)

- New sidebar link "Feedback" pointing to `/dashboard/student/feedback`
- Route already has `StudentFeedback.tsx` component built but **not wired into routes or sidebar nav**
- Wire it up: add route in `App.tsx`, add nav item in `DashboardLayout.tsx`

### 3. Admin Activity Log Page (Admin Dashboard)

- New page `/dashboard/admin/activity-log` 
- Create `activity_logs` table migration (if not exists) to track admin actions (user created, role changed, notice posted, etc.)
- Display a filterable, searchable timeline of recent admin actions
- Add sidebar nav link with `Activity` icon

### 4. Admin Feedback Management (Admin Dashboard)

- New page `/dashboard/admin/feedback` to view and respond to student feedback/complaints
- Uses existing `feedback_complaints` table (already has RLS for staff)
- Filter by status (pending/in_review/resolved/rejected), respond inline
- Add sidebar nav link

### 6. Website FAQ / Help Section (Public Website)

- New `/faq` public page with accordion-based frequently asked questions
- Categories: Admissions, Fees, Exams, Campus Life, Technical Support
- Hardcoded content -- no database needed
- Add to Navbar under "Other" dropdown

### 7. Teacher Quick Absent SMS/Call Link (Teacher Dashboard)

- On teacher attendance page, after marking a student absent, show a "Notify Parent" button
- Opens `tel:` or `sms:` link with the parent's phone number pre-filled from the `students` table
- No external API needed -- uses native device capabilities

---

## Technical Details

### Database Changes

- **Migration**: Create `activity_logs` table if it doesn't already exist (columns: id, user_id, action, entity_type, entity_id, details jsonb, created_at) with RLS for admin-only access
- No other schema changes needed -- `feedback_complaints` and `student_badges` tables already exist

### Files to Create


| File                                             | Purpose             |
| ------------------------------------------------ | ------------------- |
| &nbsp;                                           | &nbsp;              |
| `src/pages/dashboard/admin/AdminActivityLog.tsx` | Activity log viewer |
| `src/pages/dashboard/admin/AdminFeedback.tsx`    | Feedback management |
| `src/pages/FAQ.tsx`                              | Public FAQ page     |


### Files to Edit


| File                                                | Change                                                                    |
| --------------------------------------------------- | ------------------------------------------------------------------------- |
| `src/App.tsx`                                       | Add routes for certificate, feedback (student & admin), activity log, FAQ |
| `src/components/DashboardLayout.tsx`                | Add sidebar nav items for new pages                                       |
| `src/components/Navbar.tsx`                         | Add FAQ to "Other" dropdown                                               |
| `src/pages/dashboard/teacher/TeacherAttendance.tsx` | Add "Notify Parent" button after marking absent                           |
