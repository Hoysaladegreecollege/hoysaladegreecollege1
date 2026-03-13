

# Upgrade Student Messages to Match Teacher's Ultra Premium Design

The student messages page uses a basic UI while the teacher version has glassmorphism, gradient avatars, animations, emoji picker, message deletion, and more. The fix is to rewrite `StudentMessages.tsx` to mirror the teacher version's premium design, adapted for the student context.

## Changes

### Rewrite `src/pages/dashboard/student/StudentMessages.tsx`

Port all premium features from `TeacherMessages.tsx`:

**Visual upgrades:**
- Glassmorphism sidebar with `backdrop-blur-xl` and gradient header with shimmer sweep
- Gradient avatar rings with initials (replace generic `User` icons)
- Online status indicator dots (green dots on contacts)
- Ambient glow orbs in the empty state
- Message bubbles with gradient backgrounds and elevated shadows
- Staggered entrance animations for contacts and messages
- Shimmer effect on chat header

**New features (matching teacher version):**
- Message delete button (hover reveal on own messages)
- Quick emoji picker (8 common emojis)
- Message count badge in chat header
- Character counter for long messages (200+ chars)
- Auto-resizing textarea instead of single-line input
- Empty state with icon and descriptive text

**Preserved student-specific logic:**
- Contact tabs remain "Teachers" (primary) / "Students" (peers)
- Query keys stay as `student-*` to avoid cache conflicts
- Teacher contacts show subjects, student contacts show roll numbers
- Tab icons: `BookOpen` for teachers, `GraduationCap` for students

Single file change — full rewrite of `StudentMessages.tsx` to match the teacher version's architecture and styling.

