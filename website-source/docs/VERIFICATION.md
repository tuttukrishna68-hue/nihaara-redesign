# Verification record

Date: 12 November 2026

- Five public HTML pages and local CSS image/font references: no missing files.
- 8 named-project images, 115 gallery images, 14 comparison images and 15 team images included locally.
- Original content: 30 FAQ answers and 24 testimonials bundled.
- Node backend: 6 tests passed, using temporary local data and mock notifications.
- Desktop browser: hero, service expansion, gallery project viewer, image next/previous, filter and pagination, FAQ search, comparison keyboard controls and next comparison, testimonial controls checked.
- Phone layout: tested in a 390×844 iframe viewport (375 CSS pixels with the desktop browser’s scrollbar); no horizontal overflow. Mobile menu, enquiry dialog and gallery navigation checked. Phone gallery also has no horizontal overflow.
- Form: invalid phone rejected; valid form in temporary handoff mode generated the correct WhatsApp and email-app draft links. No test message was sent to the business.
- External EmailJS delivery and production hosting not verified. The final configuration restores the original website’s public EmailJS integration.

## Single-file preview update

- Added the previously verified self-contained phone preview as the ZIP's top-level `index.html`.
- Its CSS, JavaScript, fonts and 162 embedded assets need no adjacent files.
- Browser checks used an isolated sandboxed 390×844 iframe without same-origin permission. Styling loaded, the layout had no horizontal overflow, gallery navigation and image next/previous worked, and FAQ search returned the expected answers.
- Runtime DOM checks found zero external stylesheet/script files and all image sources embedded.
- This is an offline design preview with WhatsApp/email-app handoff. Live email delivery and physical Android file-manager behavior were not tested.
- Updated opening instructions distinguish the root phone preview from the modular deployment source.

## Motion and maximum source quality

- Matched the website splash at approximately 5–7 seconds of the supplied video: logo wipe/hold/dissolve, followed by staggered headline entrance and landscape fade.
- Both source and offline preview keep motion enabled; reduced-motion settings remain supported.
- All 152 photographs match the original source file SHA-256 checksums; no resize or additional lossy encoding is performed. Largest source width: 7680 pixels.
- Vector masks are used for splash/header/footer branding; navigation computes to font weight 700.
- A fifth Social Media column with noticeable icon links follows Meet, with Meet and Social Media sharing a row on phone layouts.

- Browser verified that the phone preview renders the original Mr Joby image at 4800×3000 via its embedded local Blob URL; viewer next/previous works.
- Desktop and offline phone preview compute `motion-ready` and `splash-complete`; the opening splash is removed after handover, and project reveals reach opacity 1.
- Native phone preview width equals document width (375 CSS pixels); no horizontal overflow.
- Phone Meet and Social Media column top positions match; the footer uses an embedded SVG mask.
- Independently decoded and SHA-256-verified all 152 embedded payloads; zero external image/script/stylesheet resources are required by the standalone preview.
