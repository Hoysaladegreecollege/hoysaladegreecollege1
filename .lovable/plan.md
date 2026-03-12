

# Implementation Plan — Remaining Features & Fixes

## 1. ChatBot Duplicate Portfolio Link Fix
**File:** `supabase/functions/chat/index.ts`
- The system prompt (line 39) includes the portfolio URL as plain text. The AI model likely repeats it in a clickable format, creating the duplicate. Fix: Update the system prompt to explicitly instruct "Include the portfolio link exactly once as plain text, do NOT repeat it in markdown link format."

## 2. Loading Screen Enhancement  
**File:** `src/components/PageLoader.tsx`
- Replace the basic splash with an ultra-premium cinematic experience: gold glow orbs, orbital particle ring animation, pulsing logo with scale-in effect, floating dust motes
- Add `<link rel="preload">` for the logo in `index.html` so it appears instantly
- Add CSS keyframes for `rl-fill`, `glow-pulse`, `orbit`, and `dust-float`

## 3. Gallery Auto-scroll Fix
**File:** `src/pages/Gallery.tsx`  
- Currently the lightbox doesn't auto-scroll (it locks body overflow). The issue is likely `ScrollReveal` re-triggering on filter change. No auto-scroll bug is visible in the code — will verify and remove any scroll behavior on image click.

## 4. About Page Responsive Fix
**File:** `src/pages/About.tsx`
- Review grid layouts for `values`, `facilities`, `quickFacts`, and `achievements` sections
- Ensure consistent `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` patterns
- Fix any sections where boxes aren't centered on mobile by adding `text-center` or proper `justify-items-center`

## 5. Fee Management PIN Session Persistence
**File:** `src/pages/dashboard/admin/AdminFeeManagement.tsx`
- Currently `pinUnlocked` state resets on every navigation. Fix: store `pinUnlocked` in `sessionStorage` after successful verification. On mount, check `sessionStorage` for the flag. `sessionStorage` naturally clears on tab close/reload, matching the requirement.

## 6. Application Form Submission Fix
**File:** `src/pages/Apply.tsx`
- Debug the form submission. The insert uses `.select("application_number, id").single()` which requires the response to return data. Check if RLS policy "Anyone can submit application" is working correctly. The `photo_url` stores just the path, but the `admission-photos` bucket is private — the upload might fail silently. Will add better error handling and ensure the upload works.

## 7. Navbar "Other" Dropdown Menu
**File:** `src/components/Navbar.tsx`
- Create a new `otherDropdown` array with: Committees, Question Bank (/previous-year-papers), Achievements, Notices
- Add `{ label: "Other", path: "#", hasDropdown: true, dropdownKey: "other" }` to navLinks
- Remove individual Committees, Question Bank, Achievements, Notices entries from navLinks since they'll be in the dropdown
- Add `other: otherDropdown` to `dropdownMap`

## 8. Submit Application Button — Mobile Responsive + Premium
**File:** `src/pages/Apply.tsx`
- Update the submit button container: change from `flex gap-3` to `flex flex-col sm:flex-row gap-3` 
- Enhance the submit button with rounded-full, gradient, shimmer effect

## 9. Receipt Dialog Close Button
**Files:** `src/pages/dashboard/admin/AdminFeeManagement.tsx`, `src/pages/dashboard/admin/AdminStudentFeeDetail.tsx`
- The `Dialog` component from Radix already has a built-in close X button. The receipt dialogs use `<DialogContent>` which includes one. If it's missing, add an explicit close button: `<Button variant="outline" onClick={() => setReceiptPayment(null)}>Close</Button>` at the bottom.

## 10. WhatsApp Button — Current Semester Balance Only
**File:** `src/pages/dashboard/admin/AdminStudentFeeDetail.tsx` (line 334)
- Currently the WhatsApp text shows `totalDue` (overall balance). Change to calculate current semester balance:
  - Get current semester fee from `existingSemFees` or `perSemFee`
  - Get current semester payments from `semPayments[currentSemester]`
  - Show: `currentSemFee - currentSemPaid` in the WhatsApp message instead of `totalDue`

## 11. Fee Defaulters — Current Semester Only
**File:** `src/pages/dashboard/admin/AdminFeeManagement.tsx` (lines 831-896)
- Currently filters by `(total_fee - fee_paid) > 0`. Change to filter by current semester balance:
  - For each student, need to know their current semester fee and payments for that semester
  - Query `semester_fees` and `fee_payments` grouped by semester to compute per-semester balance
  - Only show students whose current semester has unpaid balance

## 12. Overpayment Carry-Forward Logic
**Files:** `src/pages/dashboard/admin/AdminFeeManagement.tsx`, `src/pages/dashboard/admin/AdminStudentFeeDetail.tsx`
- In `recordPayment` mutation: after recording the payment, check if semester payment exceeds semester fee
- If overpaid, calculate excess and auto-apply to next semester by recording the surplus as a payment for the next semester
- This requires: fetching `semester_fees` for the student, computing per-semester balance, and distributing overpayment

## 13. Sidebar Ultra-Premium Enhancement
**File:** `src/components/DashboardLayout.tsx`
- Add staggered entrance animations to nav items using `style={{ animationDelay: `${i * 30}ms` }}`
- Add gold accent line on active item
- Add subtle gradient background with ambient glow
- Add top logo section gold shimmer effect

## Technical Summary

**Files to modify:**
- `supabase/functions/chat/index.ts` — prompt fix
- `src/components/PageLoader.tsx` — enhanced splash
- `index.html` — logo preload
- `src/pages/Gallery.tsx` — auto-scroll verify
- `src/pages/About.tsx` — responsive grid fixes
- `src/pages/dashboard/admin/AdminFeeManagement.tsx` — PIN session, defaulters filter, receipt close, overpayment
- `src/pages/dashboard/admin/AdminStudentFeeDetail.tsx` — WhatsApp text, receipt close, overpayment
- `src/components/Navbar.tsx` — "Other" dropdown
- `src/pages/Apply.tsx` — form fix, mobile button
- `src/components/DashboardLayout.tsx` — sidebar animations

**No database changes needed.**

