# Implementation Plan: Multi-Feature Enhancement

This plan addresses 8 distinct requests. Here is every change organized by feature.

---

## 1. Create Teacher Accounts via Edge Function

**Problem**: AdminAddStaff uses `supabase.auth.signUp()` which logs out the admin (same bug as students had).

**Changes**:

- **Create `supabase/functions/create-staff/index.ts**`: Similar to `create-student`, accepts role (teacher/principal), email, password, full_name, phone, employee_id, department_id, qualification, experience, subjects. Uses `admin.createUser()`with service role. Waits for`handle_new_user`trigger, then updates`teachers` table with all details. Validates caller is admin.
- **Add to `supabase/config.toml**`: `[functions.create-staff]`with`verify_jwt = false`
- **Update `src/pages/dashboard/admin/AdminAddStaff.tsx**`: Replace `signUp`call with`supabase.functions.invoke("create-staff", { body: {...} })` for teacher/principal creation. Keep admin pending request flow as-is.

---

## 2. add extra student data fields

add this things - in the students' field, add extra details like [Aadhaar no.](https://uidai.gov.in/en/) , nationality, religion, caste, etc.

---

## 3. Merge Staff/Add-Staff into User Management with Tabs

**Changes**:

- **Update `src/pages/dashboard/admin/AdminUsers.tsx**`: Add a Tabs component at the top with two tabs: "User Management" (existing user list) and "Add Staff / Users" (embed the AddStaff form content). Use `@radix-ui/react-tabs` (already available).
- This consolidates the two separate pages into one unified view.

---

## 4. Fix Popup Banner Image Cropping & Home-Page Only

**Changes**:

- **Update `src/components/PopupBanner.tsx**`:
  - Change image class from `object-cover` to `object-contain` so the full image is visible without cropping.
  - Add route check: only show popup on `/` (home page). Use `useLocation()` from react-router-dom to check `pathname === "/"`.
- **Update `src/components/Layout.tsx**`: No change needed since PopupBanner will handle its own route check.

---

## 5. Student Details as Separate Page (Not Dialog)

**Changes**:

- **Create `src/pages/dashboard/admin/AdminStudentDetail.tsx**`: A new full-page component at route `/dashboard/admin/users/:userId`. Shows all student details similar to the existing dialog view but as a full page, modeled after AdminStudentFeeDetail. Includes personal info, academic info, parent info, fee summary, and the new document upload section (see feature 6).
- **Update `src/App.tsx**`: Add route `/dashboard/admin/users/:userId` with AdminRoute wrapper.
- **Update `src/pages/dashboard/admin/AdminUsers.tsx**`: Change the Eye button for students to navigate via `<Link>`to`/dashboard/admin/users/${u.user_id}` instead of opening the dialog. Keep dialog for non-student roles.

---

## 6. Student Document Upload & Download

**Changes**:

- **Database migration**: Create `student_documents` table with columns: id (uuid), student_id (uuid), document_type (text - e.g. "10th_marks_card", "12th_marks_card", "transfer_certificate", "other"), file_name (text), file_url (text), uploaded_by (uuid), created_at (timestamptz). Add RLS: staff can manage all, students can view own.
- **Storage**: Create a `student-documents` storage bucket (private). Add RLS policies for staff upload/download and student read-own.
- **Integrate into AdminStudentDetail page**: Add a "Documents" section with upload buttons for each document type (10th Marks Card, 12th Marks Card, Transfer Certificate, Other). Show uploaded documents with download buttons. Admin can upload and delete documents.

---

## 7. Change Fee Labels to "Yearly Fee"

**Changes**:

- **Update `src/pages/dashboard/admin/AdminStudentFeeDetail.tsx**`: Change "Total Fee" labels to "Yearly Fee" where applicable.
- **Update `src/pages/dashboard/admin/AdminUsers.tsx**`: Change fee labels in edit form and view dialog from "Total Fee" to "Yearly Fee".
- **Update `src/pages/dashboard/admin/AdminFeeManagement.tsx**`: Update fee-related labels.
- **Update `src/pages/dashboard/student/StudentFees.tsx**`: Update student-facing fee labels.
- **Update `supabase/functions/chat/index.ts**`: Update the system prompt to clarify fees are yearly fees (e.g., "Total Fee: ₹80,000" becomes "Yearly Fee: ₹80,000/year" or clarify that the listed fees are per year).

---

## 8. Advanced Security Hardening

**Changes**:

- **Add rate limiting to edge functions**: Add IP-based rate limiting to `create-student` and the new `create-staff` functions (similar to existing chat function).
- **Add input validation with Zod** in edge functions: Validate email format, password strength, string lengths in `create-student` and `create-staff`.
- **Add Content Security Policy headers**: Update `index.html` with CSP meta tags to prevent XSS.
- **Add security headers**: Add `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy` headers in `vercel.json`.
- **Sanitize all user inputs**: Add `DOMPurify` sanitization for any rendered user content (notices, announcements, messages).
- **Rate limit login attempts**: Add client-side rate limiting on the login page.
- **Add CSRF protection**: Ensure all mutations include proper auth headers (already done via Supabase client).

---

## Technical Summary

| Feature                 | Files Created                              | Files Modified                              |
| ----------------------- | ------------------------------------------ | ------------------------------------------- |
| Teacher edge function   | `supabase/functions/create-staff/index.ts` | `AdminAddStaff.tsx`, `config.toml`          |
| Application photo fix   | —                                          | Storage RLS migration                       |
| Tabs in User Management | —                                          | `AdminUsers.tsx`                            |
| Popup banner fixes      | —                                          | `PopupBanner.tsx`                           |
| Student detail page     | `AdminStudentDetail.tsx`                   | `App.tsx`, `AdminUsers.tsx`                 |
| Document upload         | —                                          | `AdminStudentDetail.tsx`, migration         |
| Yearly fee labels       | —                                          | Multiple fee pages, `chat/index.ts`         |
| Security hardening      | —                                          | `index.html`, `vercel.json`, edge functions |

**Database migrations needed**:

1. Create `student_documents` table with RLS
2. Create `student-documents` storage bucket with RLS policies
3. Add storage policies for `admission-photos` bucket (allow public uploads)
