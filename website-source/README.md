# Nihaara — The Vasthu Architecture

A complete website redesign recreated from the supplied reference video, with Nihaara’s own content and portfolio images from https://nihaara.com. The live website has not been changed.

## Start here

This updated ZIP has two ways to use the website:

- **Phone / offline preview:** Open the top-level `index.html` one folder above `website-source/`. This single file embeds the styling, scripts, fonts and images. Download/extract the ZIP completely, then choose Open with Chrome. Gallery, studio, FAQ and privacy views stay in the same file. This preview prepares enquiries for WhatsApp or your email app.
- **Hosting / development:** This `website-source/` folder contains the complete modular website, original-quality assets and optional backend. Serve these files over HTTP/HTTPS so all linked resources can load. Its own `index.html` uses separate CSS, JavaScript and images, and is not the file to open through an Android file manager.

For development, install Node.js 22 or later, open a terminal in `website-source/`, and run:

```sh
npm start
```

Open http://localhost:3000. No package installation or build step is needed. For hosting, see the Static hosting section below. The website-source form retains the existing EmailJS integration; the root offline preview uses message handoff.

## Motion and original-quality update

- Opening splash follows the website sequence inside the supplied reference video: centred Nihaara logo reveals on ivory, holds briefly, then fades into staggered headline lines and the olive landscape.
- Scroll reveals are enabled in the standalone phone preview as well as the modular site. Project image reveals, landscape drift, approach/service image crossfades and the comparison demonstration are included. Reduced-motion device preferences are respected.
- All 152 portfolio/comparison/team photographs now use the original downloaded bytes and native resolution. No images are downscaled, artificially enlarged or re-encoded for the preview. Source checksums and dimensions are recorded in `docs/asset-sources.json`.
- Header, splash and footer branding use SVG outlines traced from the supplied logo, so the large wordmark remains crisp.
- Navigation and section labels use a bundled bold font. A distinct Social Media column with icons sits beside Meet.
- Original source photos total about 223 MB. The fully embedded offline preview is about 298 MB; the complete ZIP includes both that preview and the separate full-quality source assets. This version prioritises the maximum quality available from the existing site and will take longer to download/open than the earlier compressed preview.
- Some images on the original website are themselves lower resolution. They remain at their original resolution; this update does not invent detail absent from those originals.

To rebuild the standalone preview after editing the source, run Python 3 (no extra Python packages needed):

```sh
python tools/build-offline.py --output ../index.html
```

## Included

- Home page with the reference’s ivory/olive palette, editorial serif typography, blurred landscape, generous spacing and large green wordmark footer.
- Responsive navigation, smooth anchor links, reduced-motion support and keyboard-accessible native dialogs.
- Staggered selected work and an interactive image viewer.
- Gallery containing all **8 named projects** and **115 studio gallery images** from the original site.
- All **7 original 3D-versus-built comparisons**, controlled by a touch/keyboard range slider and previous/next buttons.
- Four-stage approach section with changing imagery on desktop.
- Expandable service panels covering the original services.
- All **24 original testimonials**, with manual carousel controls.
- All **30 original FAQ answers**, with search and direct question links.
- Studio page with all **15 team members** listed on the original About page.
- Consultation form with validation, consent, email integration and WhatsApp/email-app fallback.
- An optional Node backend with durable enquiry records, notification webhook support, local CSV export, validation, size limits and rate limiting.
- Metadata, sitemap, redirects, font licences and source-content notes.

## Enquiry form — read before launch

The default setting in `js/config.js` is `enquiryMode: 'emailjs'`. It uses the **same public EmailJS service, template and public key embedded in your existing website**. It sends the same template fields: `name`, `email`, `number` and `message`; selected service and project location are included in `message`.

Confirm in the EmailJS account that the service is active, the receiving address is correct, quota is available and your final website domain is permitted. These account settings cannot be verified from the public website. **No live email, WhatsApp message or appointment request was sent during development.**

A success message is shown only after the provider returns a successful response. If delivery fails or cannot be confirmed, the form keeps the visitor’s details and offers a prefilled WhatsApp or email-app message. The visitor must send that message themselves. An appointment is never claimed to be booked automatically.

If you prefer to launch without an email service, set:

```js
enquiryMode: 'handoff'
```

The form then prepares a complete message and lets the visitor choose WhatsApp or their email app. It does not claim to have sent an enquiry.

## Optional backend

The visual website can be hosted entirely as static files. The backend is available if you want a first-party enquiry record as well.

1. In `js/config.js`, set `enquiryMode: 'api'` and leave `enquiryEndpoint: '/api/enquiries'`.
2. Copy `.env.example` to `.env` and set `DATA_DIR` to a private, persistent writable location on the server.
3. Optionally set `ENQUIRY_WEBHOOK_URL` to your own HTTPS CRM/workflow endpoint and `ENQUIRY_WEBHOOK_TOKEN` to its bearer token. Configure the receiving workflow to notify your team.
4. Run `npm start` behind an HTTPS reverse proxy.

`POST /api/enquiries` validates and stores enquiries in `DATA_DIR/enquiries.jsonl`. With no notification configured, the response reports **saved**, not **sent**, and visitors are offered direct contact links. A webhook 2xx response means the configured notification endpoint accepted the enquiry; its downstream email/CRM delivery remains the endpoint’s responsibility.

The Node server exposes only public website assets. It does not expose the data directory, environment file, documentation or server source through HTTP. There is no publicly accessible lead-list endpoint. To export enquiries on the server:

```sh
npm run export-enquiries
```

This writes a private `enquiries.csv` in the data directory. CSV output neutralises spreadsheet formula prefixes. Back up the data directory and set retention appropriate to your business. The built-in rate limiter is in memory and resets on restart; use infrastructure rate limiting for a high-traffic public deployment. The backend is intended for one Node process with persistent disk. Use a shared database/queue if you deploy multiple replicas or ephemeral serverless instances.

For a health check: `GET /api/status`.

## Static hosting

Upload these files/folders to your website’s document root:

- `index.html`, `studio.html`, `gallery.html`, `faq.html`, `privacy.html`
- `assets/`, `css/`, `js/`
- `robots.txt`, `sitemap.xml`
- `_redirects` on compatible static hosts, or `.htaccess` on compatible Apache hosts

Do not put `.env`, `data/`, or server files in a publicly downloadable directory. They are unnecessary for static hosting. Preserve the old routes using the included redirects. For a temporary preview domain, change the canonical/social URLs before public indexing; the final metadata is prepared for nihaara.com.

## Editing

| What to change | Where |
| --- | --- |
| Contact/form integration settings | `js/config.js` |
| Home-page text, metadata, structured data and footer contact details | `index.html` |
| Project names, gallery references and service copy | `js/data.js` |
| Original FAQs and testimonials | `js/content.js` |
| Studio story, team names and roles | `studio.html` |
| Colours, spacing, typography and responsive layouts | `css/styles.css` |
| Interactions and enquiry submission | `js/app.js` |
| Enquiry API | `server/server.mjs` |

The contact text rendered in HTML is intentionally available without JavaScript. When changing business details, update the HTML contact section, config and structured metadata together. Match any changed gallery image count in both `js/data.js` and the filter badges in `gallery.html`.

`assets/nihaara-logo.png` is the supplied logo cropped to its transparent content. `assets/nihaara-wordmark.png` is the original raster wordmark. Scalable `nihaara-wordmark.svg` and `nihaara-logo.svg` are used for the displayed branding. The original supplied PNG and reference image are included. The reference video is a design reference, not a site asset, and is not loaded by the website.

## Verification

Run:

```sh
npm test
```

Six backend tests cover validation/consent, persistence, retry deduplication, notification success/failure, private-path protection, origin checks and rate limiting. Test notifications are local mocks and do not contact external services.

Desktop and phone-width browser checks covered navigation, service expansion, gallery filtering/pagination and image navigation, comparison keyboard controls, testimonial controls, FAQ search, form phone validation and the prepared-message handoff. All local HTML/CSS asset references were checked. External email delivery, the business’s receiving accounts and final production hosting were not tested.

## Content and assets

Source content was retrieved on 12 November 2026. The design follows the uploaded reference’s structure and visual language, using your own project imagery instead of its sample photos. No unverified project sizes, budgets, locations, completion dates or awards have been added.

The original home page/FAQ give the founding year as 2006; the original About page contains a conflicting 2001 statement. This redesign consistently follows 2006. Other source details are retained in `docs/source-content.json` and `docs/asset-sources.json`.

Project imagery and branding remain the property of their respective owners. Instrument Serif and DM Sans are bundled under their included SIL Open Font Licences.
