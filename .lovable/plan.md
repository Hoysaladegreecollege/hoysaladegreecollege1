

## Problem Analysis

When the admin creates a student, the client-side code calls `supabase.auth.signUp()` which **switches the current session to the newly created user**. This means:

1. Admin calls `signUp` → session changes to new student
2. The `handle_new_user` trigger creates a skeleton student record
3. Subsequent `update` calls to `students` and `profiles` tables **fail silently** because the current user is now the new student (not admin), and the student doesn't have admin-level RLS permissions to update profiles by user_id
4. The phone, DOB, address, course, roll number, etc. are never saved

This is the **root cause**: `signUp` logs out the admin.

## Solution

Create a new **backend function** (`create-student`) that uses the service role to:
1. Create the auth user (via `admin.createUser`)
2. Wait for the trigger to fire
3. Update the student and profile records with all details
4. Return success without disrupting the admin's session

Then update the client-side `addStudentMutation` to call this function instead of `signUp`.

## Plan

### Step 1: Create `supabase/functions/create-student/index.ts`
- Accept: email, password, full_name, phone, date_of_birth, roll_number, course_id, year_level, semester, admission_year, father_name, mother_name, parent_phone, address
- Validate inputs (require email, password, full_name)
- Use `supabaseAdmin.auth.admin.createUser()` with `email_confirm: true` (so student can log in immediately)
- Wait briefly for the `handle_new_user` trigger
- Update `students` table with all fields (roll_number, course_id, semester, year_level, admission_year, phone, parent_phone, father_name, mother_name, address, date_of_birth)
- Update `profiles` table with phone
- Verify the admin caller has admin role via JWT check
- Return the created user ID

### Step 2: Update `src/pages/dashboard/admin/AdminUsers.tsx`
- Replace `addStudentMutation` to call `supabase.functions.invoke("create-student", { body: {...} })` instead of `supabase.auth.signUp()`
- This preserves the admin session
- Add proper error handling for the response
- All student details will now be reliably stored since the service role bypasses RLS

### Technical Details
- The edge function uses `SUPABASE_SERVICE_ROLE_KEY` (already configured) for admin-level database access
- CORS headers included for browser calls
- JWT validation ensures only admins can invoke the function
- `admin.createUser` with `email_confirm: true` means the student account is immediately active without email verification

