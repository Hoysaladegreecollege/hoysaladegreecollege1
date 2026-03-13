

# Fix Teacher List Visibility + Ultra Premium Messages UI

## Root Cause: Missing RLS Policy

The `teachers` table only has these SELECT policies:
- "Admin can view all teachers" — admin/principal only
- "Students can view active teachers" — students only
- "Teachers can view own record" — only their own row

**Teachers cannot see other teachers.** Need to add a SELECT policy allowing teachers to view all active teacher peers.

## Changes

### 1. Database Migration — RLS Policy Fix

Add policy on `teachers` table:
```sql
CREATE POLICY "Teachers can view active teachers"
ON public.teachers FOR SELECT
TO authenticated
USING (is_active = true AND has_role(auth.uid(), 'teacher'::app_role));
```

### 2. Rewrite `TeacherMessages.tsx` — Ultra Premium UI + Features

Complete overhaul with:

**Visual Upgrades:**
- Glassmorphism sidebar with `backdrop-blur-xl` and gradient header
- Animated gradient avatar rings with initials instead of generic icons
- Online status indicator dots on contacts
- Chat area with subtle mesh gradient background pattern
- Message bubbles with glassmorphism effect, gradient borders for sent messages
- Staggered entrance animations for contacts and messages
- Shimmer effect on the header bar
- Floating ambient glow orbs in empty state

**New Features:**
- **Message delete** — long-press/right-click to delete own messages (uses existing RLS delete policy)
- **Emoji quick-react** — small emoji picker button next to message input (common emojis only, no library needed)
- **Message count badge** — total messages shown in header
- **Character counter** — shows remaining chars when message exceeds 200 chars
- **Contact online indicator** — green dot decoration (visual only, no presence tracking)
- **Typing area auto-resize** — textarea instead of input for multi-line messages

**Files modified:** `src/pages/dashboard/teacher/TeacherMessages.tsx` (full rewrite)  
**Migration:** Add 1 RLS policy on `teachers` table

