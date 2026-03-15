# Fix Website Title, Registration Data, and Dashboard Greetings

## Issues Identified

1. **Website title shows "Lovable app"** — `index.html` has no `<title>` tag. Before React mounts and SEOHead kicks in, the browser shows the default. Fix: add `<title>Hoysala Degree College</title>` to `index.html`.
2. **Registration student details not persisting** — When email auto-confirm is OFF, `Register.tsx` stores extra info (phone, DOB, parent details) in `localStorage` under `hdc_pending_student_info`, but **nothing ever reads it back**. After the student verifies email and logs in, those details are lost. Fix: add code in `AuthContext.tsx` to check for `hdc_pending_student_info` after login and update the student/profile records.
3. **No time-based greeting on Student/Admin dashboards** — Teacher dashboard has `Good Morning/Afternoon/Evening, {name}` but Student says "Welcome, {name}" and Admin says "Welcome back, {name}". Fix: add the same time-based greeting logic to both.
4. **Dashboard pages lack `<title>` tags** — All ~30 dashboard pages have no SEOHead component, so navigating to them reverts the tab title to whatever was set in index.html. Fix: add SEOHead with `noIndex` to each dashboard page file. Given the volume, we'll add it to the 4 main dashboard files (Student, Teacher, Admin, Principal).

## Changes

### 1. `index.html` — Add `<title>` tag

Add `<title>Hoysala Degree College — BCA, BCom, BBA | Nelamangala</title>` right after the existing meta tags (before `<style>`).

### 2. `src/contexts/AuthContext.tsx` — Consume pending student info

In the `onAuthStateChange` callback, after fetching profile/role, check if `hdc_pending_student_info` exists in localStorage. If so, update the `students` and `profiles` tables with the stored data, then remove it from localStorage.

### 3. `src/pages/dashboard/StudentDashboard.tsx` — Time-based greeting

Replace `"Welcome, {name}"` with `Good Morning/Afternoon/Evening, {name}` using the same hour-based logic as TeacherDashboard.

### 4. `src/pages/dashboard/AdminDashboard.tsx` — Time-based greeting

Replace `"Welcome back, {name}"` with `Good Morning/Afternoon/Evening, {name}`.

### 5. `src/pages/dashboard/PrincipalDashboard.tsx` — Time-based greeting

Same treatment.

### 6. Dashboard SEOHead tags

Add `<SEOHead title="Student Dashboard" noIndex />` (and similar) to the 4 main dashboard components so the browser tab shows a meaningful title.

### 7.Make sure that compress the pre loadin image to 1mb so that the image load fastly

### 8.Add a passkey to log in instantly using your fingerprint, face or screen lock.

### 9.Remove the auto scroll feature in the galary section

### 10.add some features to admissions and **Online Application and also to Track Application page**

## Files Modified

- `index.html` (add `<title>`)
- `src/contexts/AuthContext.tsx` (consume pending student info after login)
- `src/pages/dashboard/StudentDashboard.tsx` (greeting + SEOHead)
- `src/pages/dashboard/AdminDashboard.tsx` (greeting + SEOHead)
- `src/pages/dashboard/PrincipalDashboard.tsx` (greeting + SEOHead)
- `src/pages/dashboard/TeacherDashboard.tsx` (SEOHead only — greeting already exists)