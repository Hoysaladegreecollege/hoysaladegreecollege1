

# Plan: Slot-Machine Price Reveal + Passkey Hardening

## 1. Premium Slot-Machine Price Reveal Animation

**File**: `src/pages/PurchaseWebsite.tsx` (lines 78–123)

Replace the current simple blur/scale reveal with a dramatic sequential slot-machine animation:

- Create a `SlotDigit` component that renders a vertical column of numbers (0–9) scrolling rapidly
- Each digit in "₹15,000" rolls independently with staggered stop times (e.g., ₹ appears instantly, then "1" stops after 0.8s, "5" after 1.2s, "," after 1.4s, "0" after 1.6s, etc.)
- Use framer-motion `animate` to translate the number strip from a random offset to the target digit position
- Add a golden glow pulse on each digit as it locks in
- Add a final "shimmer sweep" across the full price after all digits land
- Keep the "Reveal Price" button as the trigger

**Animation sequence**:
1. Button click → button shrinks away
2. All digit columns appear spinning simultaneously (rapid vertical scroll)
3. Digits lock in left-to-right with 300ms stagger: ₹ → 1 → 5 → , → 0 → 0 → 0
4. Each lock-in has a small bounce + gold flash
5. After all digits land, a horizontal shimmer sweeps across + "one-time" text fades in

## 2. Passkey Flow Hardening

The passkey registration and authentication code looks structurally correct. The main issue is that **passkeys are cryptographically bound to the domain where they're registered** — a passkey registered on `id-preview--*.lovable.app` won't work on `hoysaladegreecollege1.lovable.app` or vice versa.

**Fixes to apply**:

### `src/pages/dashboard/student/StudentProfile.tsx`
- Add a visible note below the "Register Passkey" button explaining that passkeys only work on the domain where they were registered
- Add better error logging: catch the specific `DOMException` types and show user-friendly messages

### `src/pages/Login.tsx`  
- When passkey auth fails with "Passkey not found", show a more helpful message suggesting re-registration on the current domain
- Add `allowCredentials: []` (empty array for discoverable credentials) when no email is provided, so the browser shows all available passkeys for the domain

### `supabase/functions/passkey-register/index.ts`
- No changes needed — rpId derivation from origin header is correct

### `supabase/functions/passkey-authenticate/index.ts`
- No changes needed — rpId derivation matches

## Summary of Changes

1. **`src/pages/PurchaseWebsite.tsx`** — Replace price reveal with slot-machine rolling digit animation
2. **`src/pages/dashboard/student/StudentProfile.tsx`** — Add domain-binding info note, better error messages
3. **`src/pages/Login.tsx`** — Improve passkey error messages, handle empty allowCredentials for discoverable credentials

