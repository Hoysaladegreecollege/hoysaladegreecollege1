

# Implementation Plan

## 1. Remove Auto-Scrolling from Homepage Gallery
The homepage gallery section (Index.tsx) is already a static grid with no auto-scrolling. The comment at line 274 confirms "Manual testimonial navigation only (no auto-scroll)". The InfoSlider marquee at line 485 is a separate news ticker, not the gallery. **No changes needed here** -- the gallery is already manual-only.

However, if the intent is to also remove the InfoSlider marquee that auto-scrolls announcements below the hero, I will leave it as-is since the request specifically mentions "gallery section."

## 2. Verify & Enhance Mock Dashboard Preview (PurchaseWebsite.tsx)
The mock dashboard already shows: Admin Dashboard with sidebar, stat cards, weekly attendance chart, fee collection donut, and recent activity table -- all without requiring login. Changes needed:

- **Add more visible dashboard features**: Add a "Quick Actions" panel showing Timetable, Notices, Gallery, Applications to showcase more features
- **Add a second mock tab view** (e.g., User Management or Attendance Hub tab content) so switching tabs actually shows different content instead of the same dashboard
- **Ensure mobile responsiveness** of the mock preview is solid

## 3. Fix Contact Page Map (Contact.tsx)
**Current issue**: The Google Maps embed URL uses generic coordinates that may not properly pin the college. The `MAPS_LINK` for "Get Directions" uses an old link.

**Changes**:
- Update `MAPS_LINK` to the new link: `https://maps.app.goo.gl/vgj6BFejregTZTrT8`
- Update the iframe `src` to use a proper embed URL derived from the new Google Maps link that pins Hoysala Degree College with a marker
- Use `!1m18` place embed format so the pin is clearly visible

## 4. Enhance Event Detail Page (EventDetail.tsx)
Currently functional but basic styling. Enhancements:

- **Ultra-premium header**: Add glassmorphism event info card with gradient borders, ambient glow, and backdrop blur
- **Enhanced carousel**: Add subtle gradient overlays on edges, refined nav button styling with glassmorphism
- **Better thumbnail strip**: Add active indicator glow, smoother border transitions
- **Event details section**: Premium card with gradient accent line, enhanced typography, category/date badges with glow effects
- **Keep all existing functionality intact**: auto-scroll (4s), thumbnail auto-centering, lightbox with pinch-zoom, virtualized thumbnails

### Files to Modify
1. `src/pages/Contact.tsx` -- Update map link and embed URL
2. `src/pages/EventDetail.tsx` -- Ultra-premium UI redesign
3. `src/pages/PurchaseWebsite.tsx` -- Add more dashboard feature visibility in mock preview

### Technical Details
- Contact map embed will use: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.5!2d77.3892!3d13.0965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae23a3a58ed6f1%3A0x8b0e1e6e2b3e1a0!2sHoysala%20Degree%20College%20Nelamangala!5e0!3m2!1sen!2sin!4v1` with proper place ID
- EventDetail will use framer-motion for entrance animations and glassmorphism styling matching the site's visual identity
- Mock dashboard will add tab-specific content for User Management and Attendance tabs

