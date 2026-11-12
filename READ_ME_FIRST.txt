NIHAARA WEBSITE — SPLASH / MOTION / ORIGINAL-QUALITY UPDATE

OPEN ON YOUR PHONE
1. Extract this ZIP completely.
2. Open the first/top-level index.html inside Nihaara_Website_Redesign/.
3. Choose Open with Chrome.

The top-level HTML contains all styling, scripts, fonts and original images.
It includes the logo splash from the reference website, the staggered headline
entrance, landscape motion, scroll reveals, full gallery, studio and FAQ views.
The Social Media column is beside Meet, and navigation text uses a regular weight.
Header, splash and footer logos use sharp SVG artwork.

MAXIMUM SOURCE QUALITY
All 152 photographs use the original downloaded bytes and native dimensions,
including images up to 7680 pixels wide. None are resized, enlarged or
re-encoded. Some original images are themselves lower resolution; their
missing detail cannot be recovered from the current public website.

This is a large package: original photos total about 223 MB and the embedded
HTML about 298 MB. GitHub’s 100 MB per-file limit means the generated
standalone HTML is not tracked in the repository; the complete modular source
is in website-source/ and can regenerate it with the command below. Opening it
locally will take longer than the previous compressed
preview. Allow it to finish loading. Device reduced-motion settings simplify
the animation; the opening can also be skipped with Skip intro or Escape.

The offline form prepares messages for WhatsApp or your email app.
No enquiry is sent until you choose to send it. Internet is needed for sending.

HOSTING AND EDITING
website-source/ contains all five production pages, all original-quality
assets, the editable CSS/JavaScript, the optional backend, tests, source
checksums and setup instructions. Follow website-source/README.md.
Serve that modular source over HTTP/HTTPS. For a direct local phone preview,
use the TOP-LEVEL index.html rather than website-source/index.html.

REBUILD THE SINGLE FILE
From website-source/, with Python 3:
python tools/build-offline.py --output ../index.html

The EmailJS account and final production hosting still need verification.
No live enquiry messages were sent during development.
