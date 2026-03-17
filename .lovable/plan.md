

# Fix Passkey Authentication Errors

## Root Causes Identified

1. **Missing `verify_jwt = false` in `supabase/config.toml`** — Both `passkey-authenticate` and `passkey-register` are NOT listed in config.toml. The default `verify_jwt = true` blocks unauthenticated calls. The `passkey-authenticate` function is called without a JWT (user isn't logged in yet), so the request is rejected before even reaching the function code. This is why the network log shows "Failed to fetch".

2. **Incomplete CORS headers** — The edge functions use a minimal `Access-Control-Allow-Headers` that's missing the newer Supabase client headers (`x-supabase-client-platform`, etc.), which can cause preflight failures.

3. **rpId domain mismatch risk** — WebAuthn binds passkeys to the domain (`rpId`). The function computes `rpId` from the request `origin` header. If a passkey is registered on the preview domain (`id-preview--...lovable.app`) and login is attempted on the published domain (`hoysaladegreecollege1.lovable.app`), or vice versa, it will fail. We should use `lovable.app` as the rpId so it works across subdomains.

## Changes

### 1. `supabase/config.toml` — Add both passkey functions
```toml
[functions.passkey-authenticate]
verify_jwt = false

[functions.passkey-register]
verify_jwt = false
```

### 2. `supabase/functions/passkey-authenticate/index.ts` — Fix CORS headers and rpId
- Update CORS headers to include all required Supabase client headers
- Fix rpId to use `lovable.app` as the base domain for cross-subdomain compatibility

### 3. `supabase/functions/passkey-register/index.ts` — Same CORS and rpId fixes
- Match the CORS headers
- Use consistent rpId (`lovable.app`)

### 4. `src/pages/Login.tsx` — Better error handling
- Add console logging for the actual error to aid debugging
- Show the specific server error message instead of generic "Passkey authentication failed"

## Files Modified
- `supabase/config.toml`
- `supabase/functions/passkey-authenticate/index.ts`
- `supabase/functions/passkey-register/index.ts`
- `src/pages/Login.tsx`

