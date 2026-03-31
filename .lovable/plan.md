# Plan: Admin Dashboard Features + Ultra-Premium Student Profile

## Overview

completely redesign the Student Profile page with an ultra-premium, Apple-inspired aesthetic featuring glassmorphism, ambient glows, and elevated visual hierarchy.

---

## Part 1 - In the user management make sure that create a another tab called students in the tab a page sould be opend and in that all the students details should be shown and also make sure that the make ui design to ultra premium and arrnage the students in the proper responsive way and also make sure that add a filter  and search section on the top and below that show the student data's and also add important usefull features to this page.

---

## Part 2: Ultra-Premium Student Profile Redesign

### Design System

- Full-bleed gradient hero banner behind the avatar section with ambient glow orbs
- Glassmorphism card layers (backdrop-blur-xl, semi-transparent backgrounds)
- Rounded-[2rem] corners on all cards
- Shimmer sweep overlays on the profile hero card
- Staggered entrance animations for each info section
- Premium icon treatments with colored gradient backgrounds per field category

### Layout Changes

**Hero Section** — Large cover-style banner:

- Full-width gradient backdrop with floating ambient particles (CSS only)
- Large avatar (160px) with ring glow effect and verified badge
- Name, course, roll number, semester displayed prominently
- Quick-stat pills: Attendance %, Fee Status, Semester

**Personal Info Section** — Grouped into categories:

- "Academic Details" group (Roll, Course, Semester, Admission Year)
- "Personal Details" group (DOB, Gender, Blood Group, Nationality, Religion, Category)
- "Contact Details" group (Phone, Parent Phone, Father/Mother Name, Address)
- "Identity" group (Aadhaar)
- Each group gets a distinct accent color and section header

**Documents Section** — Premium file cards with file-type icons and hover lift

**Passkey Section** — Compact security card with shield iconography

### Technical Details

**Files to edit:**

1. `src/pages/dashboard/AdminDashboard.tsx` — Add 5-6 new widget queries and UI sections
2. `src/pages/dashboard/student/StudentProfile.tsx` — Complete UI redesign with ultra-premium styling

**No database changes needed** — all new widgets use existing tables (students, attendance, marks, admission_seats, fee_payments).

**No new dependencies** — uses existing Recharts, Lucide icons, and Tailwind utilities.