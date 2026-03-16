

# Multi-Feature Update Plan

This is a large request covering 6 areas. Here's the implementation plan:

## 1. Remove Auto-Scroll on Home Page Gallery/Testimonials Section

The gallery section on the home page is already a static grid — no auto-scroll exists there. The **testimonials** section auto-rotates every 5 seconds via `setInterval`. We'll remove that auto-rotation and add manual navigation dots/arrows instead.

**File**: `src/pages/Index.tsx` — Remove the `setInterval` in the `useEffect` (lines 261-268), add manual prev/next dots for testimonials.

## 2. Passkey/Biometric Login (WebAuthn)

WebAuthn passkeys require server-side credential storage and verification. We'll:
- Create a `passkeys` database table to store credential IDs, public keys, and user references
- Create two edge functions: `passkey-register` (attestation) and `passkey-authenticate` (assertion) using the `@simplewebauthn/server` library
- Add UI on the Login page: a "Sign in with Passkey" button that triggers WebAuthn `navigator.credentials.get()`
- Add a "Register Passkey" option in student/teacher profile settings

**New files**: `supabase/functions/passkey-register/index.ts`, `supabase/functions/passkey-authenticate/index.ts`
**DB migration**: Create `passkeys` table with columns: `id`, `user_id`, `credential_id`, `public_key`, `counter`, `created_at`
**Modified files**: `src/pages/Login.tsx` (add passkey button), `src/pages/dashboard/student/StudentProfile.tsx` (register passkey option)

## 3. Enhance Admissions & Application Tracking Pages

**Admissions page** (`src/pages/Admissions.tsx`):
- Add a "Documents Checklist" interactive tracker with checkmarks
- Add an FAQ accordion section for common admission questions
- Add scholarship information section

**Application Status page** (`src/pages/ApplicationStatus.tsx`):
- Add a visual timeline/stepper showing application stages (Submitted → Under Review → Interview → Accepted/Rejected)
- Show document verification status
- Add estimated processing time display

## 4. Credits Page → "Purchase This Website" Showcase

This is the biggest change. We'll create a new dedicated page and enhance the credits page.

**New file**: `src/pages/PurchaseWebsite.tsx` — A premium sales/showcase page with:
- Hero section with animated gradient and bold CTA
- Feature showcase grid (all major features: multi-role dashboards, attendance, marks, fees, messaging, notifications, gallery management, admission portal, etc.)
- Interactive dashboard previews (screenshots/mockups of admin, teacher, student dashboards)
- Pricing card: ₹15,000 with feature breakdown
- Contact section: WhatsApp link (`https://api.whatsapp.com/send/?phone=9036048950`), portfolio link (`https://pavan-05.framer.ai/`), email
- "Install Web App" style premium button (referencing Download.tsx button style)
- Technology stack section
- Testimonials/trust indicators

**Modified file**: `src/pages/Credits.tsx` — Add a premium CTA button linking to `/purchase` page
**Modified file**: `src/App.tsx` — Add route for `/purchase`
**Modified file**: `src/components/Navbar.tsx` — Optionally add link in footer

## 5. Compress Preloader Logo

The preloader uses `college-logo-optimized.webp`. We can't compress binary files directly, but we'll ensure the preloader references the optimized version and add `loading="eager"` with proper dimensions to prevent layout shift.

**File**: Check `src/components/PageLoader.tsx` — ensure it uses the optimized webp logo and has proper sizing.

## 6. Registration Flow Verification

The registration flow already stores pending student info in localStorage and syncs it on first login (implemented in AuthContext). This was fixed in the previous update. No code changes needed — just verification.

---

## Summary of Files Changed

1. **DB Migration**: Create `passkeys` table
2. **New**: `supabase/functions/passkey-register/index.ts`
3. **New**: `supabase/functions/passkey-authenticate/index.ts`
4. **New**: `src/pages/PurchaseWebsite.tsx` — Full sales/showcase page
5. **Modified**: `src/pages/Index.tsx` — Remove testimonial auto-scroll
6. **Modified**: `src/pages/Login.tsx` — Add passkey login button
7. **Modified**: `src/pages/Credits.tsx` — Add purchase CTA button
8. **Modified**: `src/pages/Admissions.tsx` — Enhanced with FAQ, checklist
9. **Modified**: `src/pages/ApplicationStatus.tsx` — Visual timeline, document status
10. **Modified**: `src/App.tsx` — Add `/purchase` route
11. **Modified**: `src/components/PageLoader.tsx` — Verify optimized logo usage

