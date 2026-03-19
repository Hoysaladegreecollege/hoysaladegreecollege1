# Multi-Feature Update Plan

## 1. Event Detail Page (Replace Popup with Full Page)

Currently events open in a Dialog popup which is laggy. We'll create a new dedicated page `src/pages/EventDetail.tsx` that shows the event with a proper image gallery, description, and metadata. Remove the Dialog from `Events.tsx` and make event cards link to `/events/:id`. Remove the white hover overlay effect on event cards.

**New file**: `src/pages/EventDetail.tsx` — Full page with image gallery slider, description, category/date info
**Modified**: `src/pages/Events.tsx` — Replace `onClick` with `Link to={/events/${id}}`, remove Dialog, remove white hover overlay
**Modified**: `src/App.tsx` — Add route `/events/:id` for EventDetail

## 2. Purchase Page — Price Reveal Animation

Currently the price `₹15,000` is shown directly. We'll hide it behind a "Reveal Price" button with an animated reveal (scale + fade + gradient shimmer) using framer-motion.

**Modified**: `src/pages/PurchaseWebsite.tsx` — Replace static price with a `useState` toggle + motion.div animation

## 3. Admin Events — Upload Progress Bar

The current upload in `AdminEvents.tsx` doesn't track per-file progress. Supabase JS SDK doesn't expose upload progress natively, but we can track file-by-file completion. We'll show a progress bar (completed files / total files) with a smooth animation during multi-file uploads.

**Modified**: `src/pages/dashboard/admin/AdminEvents.tsx` — Add state for `uploadProgress` (files completed / total), render a Progress bar component during upload

## 4. Admin Gallery — Drag-and-Drop Reordering

We'll add drag-and-drop to the gallery grid using HTML5 drag events (no extra library needed). When an image is dragged to a new position, update the `sort_order` column in the database.

**Modified**: `src/pages/dashboard/admin/AdminGallery.tsx` — Add `onDragStart`, `onDragOver`, `onDrop` handlers to gallery items, update `sort_order` in DB on drop

## 5. Fee Defaulters Fix — Only Show Actual Defaulters

The current logic uses a fallback `(s.total_fee || 0) / 6` when no semester-specific fee exists, which incorrectly flags students with no semester fees set. The fix: only consider a student a defaulter if they have an actual `semester_fees` record OR their `total_fee > fee_paid`. Skip the `/6` fallback entirely — if no semester fee is configured, they shouldn't appear as defaulters.

**Modified**: `src/pages/dashboard/admin/AdminFeeManagement.tsx` (lines ~900-910) — Change defaulter filter: only flag if `semFeeMap[s.id]?.[curSem]` exists AND `curSemPaid < curSemFee`, removing the `/6` fallback
**Modified**: `src/pages/dashboard/AdminDashboard.tsx` (lines ~164-177) — Same fix for the dashboard defaulters widget

## 6. Passkey Testing

No code changes — manual verification by user. there is a issue in the student profile that the passkey is not registering please make sure that the passkey feature work fully properly and also Test the passkey flow: log in as student ([stpra2133@gmail.com](mailto:stpra2133@gmail.com) / 123456), go to profile, register a passkey, then log out and try signing in with the passkey on the login page.

---

## Summary of Files

1. **New**: `src/pages/EventDetail.tsx`
2. **Modified**: `src/pages/Events.tsx` — Remove Dialog, link to detail page, remove white hover
3. **Modified**: `src/App.tsx` — Add `/events/:id` route
4. **Modified**: `src/pages/PurchaseWebsite.tsx` — Price reveal animation
5. **Modified**: `src/pages/dashboard/admin/AdminEvents.tsx` — Upload progress bar
6. **Modified**: `src/pages/dashboard/admin/AdminGallery.tsx` — Drag-and-drop reordering
7. **Modified**: `src/pages/dashboard/admin/AdminFeeManagement.tsx` — Fix defaulter logic
8. **Modified**: `src/pages/dashboard/AdminDashboard.tsx` — Fix defaulter logic