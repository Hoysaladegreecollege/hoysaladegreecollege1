# Multi-Feature Update Plan

## 1. Replace Hero Background Image

Copy the uploaded college building image to `src/assets/hero-college.jpg` (replacing it) so the home page hero section uses the new image. No code changes needed — the import already references `hero-college.jpg`.

## 2. Home Gallery Section — Show DB Images Instead of Static

Currently `Index.tsx` uses a hardcoded `galleryImages` array of static imports. We'll add a query to fetch `gallery_images` from the database (same as `Gallery.tsx` does) and use those if available, falling back to the static images. This ensures admin uploads appear on the home page.

**File**: `src/pages/Index.tsx`

- Add a `useQuery` for `gallery_images` (active only, limit 6)
- Use DB images if available, else fallback to static array
- Update lightbox to work with the dynamic data

## 3. Admin Gallery — Album/Folder System + Multi-Upload

### Database Migration

Add an `album_name` column to `gallery_images`:

```sql
ALTER TABLE public.gallery_images ADD COLUMN album_name TEXT DEFAULT NULL;
```

This allows grouping images into albums like "Graduation Day & Sangama-2025".

### Admin Gallery Enhancements (`src/pages/dashboard/admin/AdminGallery.tsx`)

- **Album/Folder input**: Add an optional "Album Name" text field in the upload form. When filled, images are grouped under that album.
- **Multi-image upload**: Change the file input to accept `multiple`. Loop through selected files, uploading each with the same title prefix, category, and album name.
- **Album view in admin**: Show albums as folder cards at the top. Clicking an album filters to show only its images. Show "All Images" and individual album tabs.

### Gallery Page Updates (`src/pages/Gallery.tsx`)

- Fetch distinct album names from DB
- Show album folders as clickable cards (with cover image = first image in album)
- Clicking an album shows all images in that album
- Keep the existing category filter for non-album browsing

## 4. Passkey Testing Note

The passkey flow has already been fixed in previous updates (config.toml entries, CORS headers, rpId matching). The registration UI exists in `StudentProfile.tsx` and the login button exists in `Login.tsx`. No further code changes needed — this is a manual test.

**5.impliment all the above features at a time do not skip anything**

## Summary of Changes

1. **Asset**: Copy uploaded image → `src/assets/hero-college.jpg`
2. **DB Migration**: Add `album_name` column to `gallery_images`
3. `**src/pages/Index.tsx**`: Fetch gallery images from DB for home page gallery section
4. `**src/pages/dashboard/admin/AdminGallery.tsx**`: Add album name field, multi-image upload, album folder view
5. `**src/pages/Gallery.tsx**`: Add album folder navigation on public gallery page