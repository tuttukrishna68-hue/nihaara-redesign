(() => {
  'use strict';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => Array.from(root.querySelectorAll(s));
  const config = window.NIHAARA_CONFIG;
  const data = window.NIHAARA_DATA;
  const escape = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = v => String(v).padStart(2, '0');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const putImage = (image, source, alt) => {
    if (alt) image.alt = alt;
    if (window.nihaaraSetImage) window.nihaaraSetImage(image, source);
    else image.src = source;
  };
  const swapImage = (image, source, alt) => {
    if (reducedMotion) {putImage(image, source, alt);return;}
    image.classList.add('image-changing');
    setTimeout(() => {
      putImage(image, source, alt);
      const finish = () => image.classList.remove('image-changing');
      if (image.decode) image.decode().catch(()=>{}).finally(finish);else finish();
      setTimeout(finish, 650);
    }, 160);
  };

  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  // Navigation remains available without motion or IntersectionObserver support.
  const header = $('#site-header');
  if (header) {
    const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 10);
    updateHeader();
    window.addEventListener('scroll', updateHeader, {passive: true});
  }
  const menuToggle = $('.menu-toggle'), menu = $('#mobile-menu');
  function closeMenu(restoreFocus = false) {
    if (!menu || !menuToggle) return;
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    if (restoreFocus) menuToggle.focus();
  }
  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const opened = menuToggle.getAttribute('aria-expanded') === 'true';
      menu.hidden = opened;
      menuToggle.setAttribute('aria-expanded', String(!opened));
      menuToggle.setAttribute('aria-label', opened ? 'Open menu' : 'Close menu');
    });
    $$('a', menu).forEach(a => a.addEventListener('click', () => closeMenu()));
    document.addEventListener('keydown', e => {if (e.key === 'Escape' && !menu.hidden) closeMenu(true);});
    document.addEventListener('click', e => {if (!header.contains(e.target) && !menu.hidden) closeMenu();});
    window.matchMedia('(min-width: 761px)').addEventListener('change', e => {if (e.matches) closeMenu();});
  }

  function cardMarkup(project, index, gallery = false) {
    return `<button class="project-card${gallery ? '' : ' reveal'}" data-lightbox="${index}" aria-label="View ${escape(project.title)}"><div class="project-image-wrap"><img src="${escape(project.image)}" alt="${escape(project.title)} — Nihaara architectural portfolio" width="1000" height="750" loading="lazy" decoding="async"><span class="project-open" aria-hidden="true">↗</span></div><div class="project-meta"><h3>${escape(project.title)}</h3><span>${gallery && index >= data.projects.length ? 'Studio gallery' : 'Nihaara Architects'}</span></div></button>`;
  }
  const selectedProjects = $('#selected-projects');
  if (selectedProjects) selectedProjects.innerHTML = [0, 2, 4].map(i => cardMarkup(data.projects[i], i)).join('');

  // All published FAQs and testimonials are bundled; no network fetch is needed.
  function faqMarkup(faq, i) {
    return `<details class="faq-item" id="question-${i}"><summary>${escape(faq.question)}<span class="toggle-symbol" aria-hidden="true"></span></summary><div class="faq-answer">${escape(faq.answer)}</div></details>`;
  }
  const homeFaqs = $('#home-faqs');
  if (homeFaqs) homeFaqs.innerHTML = data.faqs.slice(0, 5).map(faqMarkup).join('');
  const faqPage = $('#faq-page-list');
  if (faqPage) {
    const search = $('#faq-search'), count = $('#faq-result-count'), noResults = $('#faq-empty');
    faqPage.innerHTML = data.faqs.map(faqMarkup).join('');
    const items = $$('.faq-item', faqPage);
    const filterFaqs = () => {
      const term = search.value.trim().toLocaleLowerCase();
      let visible = 0;
      items.forEach((item, i) => {
        const faq = data.faqs[i];
        item.hidden = term !== '' && !(faq.question + ' ' + faq.answer).toLocaleLowerCase().includes(term);
        if (!item.hidden) visible++;
      });
      count.textContent = `${visible} of ${data.faqs.length} questions`;
      noResults.hidden = visible > 0;
      $('#faq-clear').hidden = !term;
    };
    search.addEventListener('input', filterFaqs);
    $('#faq-clear').addEventListener('click', () => {search.value = ''; filterFaqs(); search.focus();});
    $('#faq-empty-clear').addEventListener('click', () => {search.value = ''; filterFaqs(); search.focus();});
    filterFaqs();
    const target = /^#question-\d+$/.test(location.hash) ? $(location.hash) : null;
    if (target) {target.open = true; setTimeout(() => target.scrollIntoView(), 80);}
  }
  let testimonialIndex = 0;
  function updateTestimonial() {
    const item = data.testimonials[testimonialIndex];
    const block = $('#testimonial-quote').closest('blockquote');
    block.style.animation = 'none';void block.offsetWidth;block.style.animation = '';
    $('#testimonial-quote').textContent = item.description;
    $('#testimonial-name').textContent = item.name;
    $('#testimonial-count').textContent = `${number(testimonialIndex + 1)} / ${number(data.testimonials.length)}`;
  }
  if ($('#testimonial-quote')) {
    updateTestimonial();
    $('#testimonial-prev').addEventListener('click', () => {testimonialIndex = (testimonialIndex - 1 + data.testimonials.length) % data.testimonials.length; updateTestimonial();});
    $('#testimonial-next').addEventListener('click', () => {testimonialIndex = (testimonialIndex + 1) % data.testimonials.length; updateTestimonial();});
  }

  const services = $('#services-list');
  if (services) {
    const serviceIcons = {
      vasthu:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter"><path d="M24 2 17 9h4v8H10v-4l-8 9 8 9v-4h11v8h-4l7 7 7-7h-4v-8h11v4l8-9-8-9v4H27V9h4L24 2Z"></path><path d="M15 34V22l9-8 9 8v12H15Z"></path><path d="M20 34v-7h8v7M18 34h12"></path></svg>',
      estimate:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="13" y="7" width="22" height="34" rx="2"></rect><path d="M18 14h12M18 21h1M24 21h1M30 21h1M18 28h1M24 28h1M30 28h1M18 35h1M24 35h1M30 35h1"></path></svg>',
      interior:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M25 11c-8 0-14 6-14 14s6 13 14 13c3 0 5-2 5-5 0-2-1-3-3-4-2-1-1-4 2-4h4c4 0 6-2 6-6 0-4-5-8-14-8Z"></path><circle cx="19" cy="19" r="1"></circle><circle cx="26" cy="17" r="1"></circle><circle cx="32" cy="20" r="1"></circle></svg>',
      site:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17 7c-3 0-5 3-5 7 0 5 2 9 5 9s5-4 5-9c0-4-2-7-5-7Z"></path><path d="M31 10c-3 0-5 3-5 7 0 5 2 9 5 9s5-4 5-9c0-4-2-7-5-7Z"></path><path d="M17 23v12M31 26v12M14 38h6M28 41h6"></path></svg>',
      drawing:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10 38 4-12L34 6l8 8-20 20-12 4Z"></path><path d="m29 11 8 8M14 26l8 8"></path></svg>',
      construction:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h30v10H9zM15 28v12M33 28v12M13 18V9M24 18V9M35 18V9"></path><path d="M9 9h30M17 12v6M31 12v6"></path></svg>',
      landscaping:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M24 40V25"></path><path d="M24 26c-8 0-11-5-11-10 7 0 11 3 11 10ZM24 22c0-7 4-11 11-11 0 7-4 11-11 11Z"></path><path d="M15 40h18M17 35h14"></path></svg>',
      electrical:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m27 7-11 15h8l-3 19 11-17h-8l3-17Z"></path><path d="m12 29 5 5M31 14l5 5"></path></svg>',
      painting:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m9 29 11-11 11 11-7 7H16z"></path><path d="m20 18 7-7 11 11-7 7M14 34l-4 7M30 24l8-8"></path></svg>',
      roofing:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="11" width="28" height="11" rx="1"></rect><rect x="10" y="27" width="12" height="10" rx="1"></rect><rect x="27" y="27" width="11" height="10" rx="1"></rect></svg>',
      furniture:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 26h28v10H10zM13 26v-7c0-3 2-5 5-5h12c3 0 5 2 5 5v7M14 36v5M34 36v5"></path></svg>',
      remodeling:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m13 35 7-7 7 7-7 7zM21 28l9-9M29 10l9 9M31 7l4-4 8 8-4 4"></path><path d="m10 31 7 7M24 24l7 7"></path></svg>',
      turnkey:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M28 9a9 9 0 0 0-10 12L9 30l9 9 9-9a9 9 0 0 0 12-10l-7 7-5-5 7-7a9 9 0 0 0-6-6Z"></path></svg>'
    };
    const icon = name => serviceIcons[name] || '';
    services.innerHTML = `<div class="service-overview-grid">${data.services.map((s, i) => `<article class="service-overview"><span class="service-index eyebrow">${number(i + 1)}</span><span class="service-icon" aria-hidden="true">${icon(s.icon)}</span><h3>${escape(s.title)}</h3><p>${escape(s.text)}</p></article>`).join('')}</div><div class="service-offers-grid">${data.serviceOffers.map(offer => `<article class="service-offer"><span class="service-offer-icon service-icon" aria-hidden="true">${icon(offer.icon)}</span><h3>${escape(offer.title)}</h3></article>`).join('')}</div><div class="service-end"><p>From the first drawing to the final finish, we can help carry your project through.</p><button class="text-link" data-enquire data-service-name="Services">Discuss your project <span aria-hidden="true">↗</span></button></div>`;
  }

  let comparisonIndex = 0;
  const comparison = $('#comparison'), range = $('#comparison-range');
  function updateComparison() {
    const c = data.comparisons[comparisonIndex];
    putImage($('#comparison-real'), c.real);
    $('#comparison-real').alt = `Completed Nihaara home, comparison ${c.id}`;
    putImage($('#comparison-render'), c.render);
    $('#comparison-render').alt = `Original 3D design, comparison ${c.id}`;
    $('#comparison-title').textContent = c.title;
    $('#compare-count').textContent = `${number(comparisonIndex + 1)} / ${number(data.comparisons.length)}`;
    range.value = 50; updateRange();
  }
  function updateRange() {
    comparison.style.setProperty('--position', `${range.value}%`);
    range.setAttribute('aria-valuetext', `${range.value}% 3D visual, ${100 - range.value}% completed home`);
  }
  if (comparison && range) {
    updateComparison();
    range.addEventListener('input', updateRange);
    $('#compare-prev').addEventListener('click', () => {comparisonIndex = (comparisonIndex - 1 + data.comparisons.length) % data.comparisons.length; updateComparison();});
    $('#compare-next').addEventListener('click', () => {comparisonIndex = (comparisonIndex + 1) % data.comparisons.length; updateComparison();});
  }

  const approachImages = [
    {image:'assets/projects/project-03.jpg', alt:'Site-responsive residential design by Nihaara'},
    {image:'assets/projects/project-06.jpg', alt:'Vasthu-informed home design by Nihaara'},
    {image:'assets/gallery/gallery-030.jpg', alt:'Details from the Nihaara studio portfolio'},
    {image:'assets/comparisons/1-real.jpg', alt:'A completed Nihaara home'}
  ];
  if ($('#approach-image') && 'IntersectionObserver' in window) {
    let step = 0;
    const approachObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = Number(entry.target.dataset.step);
        if (index === step) continue;
        step = index;
        swapImage($('#approach-image'), approachImages[index].image, approachImages[index].alt);
        $$('.approach-step').forEach(el=>el.classList.toggle('is-current',Number(el.dataset.step)===index));
        $('#approach-count').textContent = `${number(index + 1)} / 04`;
      }
    }, {rootMargin:'-30% 0px -30% 0px', threshold:0});
    $$('.approach-step').forEach(el => approachObserver.observe(el));
  }

  // Gallery pagination is local, so every image can be inspected offline.
  const collection = [...data.projects, ...data.gallery];
  const gallery = $('#gallery-grid');
  let galleryFilter = 'all', visibleLimit = 24;
  let activeGalleryIndices = collection.map((_, i) => i);
  if (gallery) {
    const params = new URLSearchParams(location.search);
    galleryFilter = ['all','projects','studio'].includes(params.get('view')) ? params.get('view') : 'all';
    function renderGallery() {
      activeGalleryIndices = collection.map((_, i) => i).filter(i => galleryFilter === 'all' || (galleryFilter === 'projects' ? i < data.projects.length : i >= data.projects.length));
      gallery.innerHTML = activeGalleryIndices.slice(0, visibleLimit).map(i => cardMarkup(collection[i], i, true)).join('');
      const shown = Math.min(visibleLimit, activeGalleryIndices.length);
      $('#gallery-count').textContent = `Showing ${shown} of ${activeGalleryIndices.length}`;
      $('#gallery-load-more').hidden = shown >= activeGalleryIndices.length;
      $$('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === galleryFilter)));
    }
    $$('[data-filter]').forEach(button => button.addEventListener('click', () => {
      galleryFilter = button.dataset.filter;
      visibleLimit = 24;
      const u = new URL(location.href);u.searchParams.set('view', galleryFilter);history.replaceState(null, '', u);
      renderGallery();
    }));
    $('#gallery-load-more').addEventListener('click', () => {visibleLimit += 24;renderGallery();});
    renderGallery();
  }

  const dialogRoot = $('#dialog-root');
  if (dialogRoot) dialogRoot.innerHTML = `
    <dialog class="dialog enquiry-dialog" id="enquiry-dialog" aria-labelledby="enquiry-heading" aria-describedby="enquiry-intro">
      <div class="dialog-header"><div><p class="eyebrow">A place to begin</p><h2 id="enquiry-heading">Tell us about <em>your home.</em></h2></div><button class="dialog-close" data-close-dialog aria-label="Close enquiry form">×</button></div>
      <p class="dialog-intro" id="enquiry-intro">A new home, a fresh perspective, or a question. We’d love to hear what you have in mind. Visits are confirmed directly by the studio.</p>
      <form class="enquiry-form" id="enquiry-form"><div class="form-grid">
        <div class="field"><label for="enquiry-name">Your name <span>*</span></label><input id="enquiry-name" name="name" autocomplete="name" placeholder="Your full name" required minlength="2" maxlength="80"></div>
        <div class="field"><label for="enquiry-number">Phone number <span>*</span></label><input id="enquiry-number" name="number" type="tel" inputmode="tel" autocomplete="tel" placeholder="+91" required maxlength="22" aria-describedby="phone-error"><span class="field-error" id="phone-error" hidden>Please enter a valid phone number, including your country code if outside India.</span></div>
        <div class="field full"><label for="enquiry-email">Email address <span>*</span></label><input id="enquiry-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required maxlength="160"></div>
        <div class="field"><label for="enquiry-service">How can we help?</label><select id="enquiry-service" name="service"><option>New home / Architecture</option><option>Vasthu consulting</option><option>Interior & exterior design</option><option>Turnkey construction</option><option>Renovation / Remodeling</option><option>Site visit</option><option>Other enquiry</option></select></div>
        <div class="field"><label for="enquiry-location">Project location</label><input id="enquiry-location" name="location" placeholder="Town / district" maxlength="120"></div>
        <div class="field full"><label for="enquiry-message">What do you have in mind? <span>*</span></label><textarea id="enquiry-message" name="message" placeholder="Tell us about your project, requirements and preferred time to speak…" required minlength="10" maxlength="4000" rows="3"></textarea></div>
      </div><div class="honeypot" aria-hidden="true"><label for="enquiry-website">Leave this field empty</label><input id="enquiry-website" name="website" tabindex="-1" autocomplete="off"></div>
      <label class="consent"><input type="checkbox" name="consent" required><span>I agree that Nihaara may use these details to respond to my enquiry. <a href="privacy.html" target="_blank" rel="noopener">Privacy notice ↗</a></span></label>
      <div class="form-footer"><p>Your first step is a conversation.<br>No appointment is booked automatically.</p><button class="pill" type="submit" id="enquiry-submit">Send enquiry <span aria-hidden="true">→</span></button></div>
      <p id="enquiry-status" class="form-status" role="status" aria-live="polite"></p>
      <div id="handoff-actions" class="handoff-actions" hidden><a id="enquiry-whatsapp" href="#" target="_blank" rel="noopener noreferrer">Send via WhatsApp ↗</a><a id="enquiry-mailto" href="#">Send with your email app ↗</a><button type="button" class="text-link" id="copy-enquiry">Copy enquiry <span aria-hidden="true">↗</span></button></div>
      </form>
    </dialog>
    <dialog class="dialog lightbox" id="lightbox" aria-labelledby="lightbox-title"><div class="lightbox-bar"><div><h2 class="lightbox-title" id="lightbox-title"></h2><p class="lightbox-caption" id="lightbox-caption"></p></div><button class="dialog-close" data-close-dialog aria-label="Close project viewer">×</button></div><img class="lightbox-image" id="lightbox-image" src="assets/projects/project-01.jpg" alt=""><div class="lightbox-bottom"><button class="lightbox-enquire" id="project-enquire">Discuss your own project <span aria-hidden="true">↗</span></button><div class="pager"><button class="circle-button" id="lightbox-prev" aria-label="Previous image">←</button><span id="lightbox-count" aria-live="polite"></span><button class="circle-button" id="lightbox-next" aria-label="Next image">→</button></div></div></dialog>`;
  const enquiryDialog = $('#enquiry-dialog'), lightbox = $('#lightbox');
  let lightboxIndices = [], lightboxPosition = 0, lastFocus = null;
  function showDialog(dialog) {
    lastFocus = document.activeElement;
    dialog.showModal();document.body.classList.add('modal-open');
  }
  function openEnquiry(source) {
    closeMenu();
    if (lightbox.open) lightbox.close();
    const service = source?.dataset?.serviceName;
    if (service) {
      const select = $('#enquiry-service');
      const matching = Array.from(select.options).find(o => o.textContent.toLowerCase().includes(service.split(' ')[0].toLowerCase()));
      if (matching) select.value = matching.value;
    }
    showDialog(enquiryDialog);
  }
  for (const dialog of [enquiryDialog, lightbox].filter(Boolean)) {
    dialog.addEventListener('close', () => {
      if (!$$('dialog[open]').length) document.body.classList.remove('modal-open');
      if (lastFocus?.isConnected) lastFocus.focus({preventScroll:true});
    });
    dialog.addEventListener('click', e => {
      if (e.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    $$('[data-close-dialog]', dialog).forEach(button => button.addEventListener('click', () => dialog.close()));
  }
  document.addEventListener('click', e => {
    const enquiry = e.target.closest('[data-enquire]');
    if (enquiry) {openEnquiry(enquiry);return;}
    const project = e.target.closest('[data-lightbox]');
    if (project) {
      const i = Number(project.dataset.lightbox);
      lightboxIndices = gallery ? activeGalleryIndices : data.projects.map((_, index) => index);
      lightboxPosition = Math.max(0, lightboxIndices.indexOf(i));
      updateLightbox();showDialog(lightbox);
    }
  });
  function updateLightbox() {
    const i = lightboxIndices[lightboxPosition], item = collection[i];
    $('#lightbox-title').textContent = item.title;
    $('#lightbox-caption').textContent = i < data.projects.length ? 'Project for ' + item.title + ' · Nihaara Architects' : 'From the original Nihaara studio gallery';
    putImage($('#lightbox-image'), item.image, item.title + ' — Nihaara Architects');
    $('#lightbox-count').textContent = `${number(lightboxPosition + 1)} / ${number(lightboxIndices.length)}`;
  }
  function moveLightbox(change) {lightboxPosition = (lightboxPosition + change + lightboxIndices.length) % lightboxIndices.length;updateLightbox();}
  if (lightbox) {
    $('#lightbox-prev').addEventListener('click', () => moveLightbox(-1));
    $('#lightbox-next').addEventListener('click', () => moveLightbox(1));
    lightbox.addEventListener('keydown', e => {
      if (e.key === 'ArrowLeft') {e.preventDefault();moveLightbox(-1);}
      if (e.key === 'ArrowRight') {e.preventDefault();moveLightbox(1);}
    });
    $('#project-enquire').addEventListener('click', () => {
      const message = $('#enquiry-message');
      if (!message.value) message.value = 'Hello Nihaara, I would like to discuss a project after viewing your portfolio.';
      openEnquiry();
    });
  }

  const form = $('#enquiry-form');
  let preparedText = '';
  function prepareHandoff(values) {
    preparedText = `Hello Nihaara,\n\nName: ${values.name}\nPhone: ${values.number}\nEmail: ${values.email}\nService: ${values.service}\nLocation: ${values.location || 'To be discussed'}\n\n${values.message}`;
    $('#enquiry-whatsapp').href = `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(preparedText)}`;
    $('#enquiry-mailto').href = `mailto:${config.email}?subject=${encodeURIComponent('Project enquiry — ' + values.name)}&body=${encodeURIComponent(preparedText)}`;
    $('#handoff-actions').hidden = false;
  }
  function formValues() {
    const entries = Object.fromEntries(new FormData(form));
    return Object.fromEntries(Object.entries(entries).map(([k,v]) => [k,typeof v === 'string' ? v.trim() : v]));
  }
  function status(text, state = '') {
    const el = $('#enquiry-status');el.textContent = text;el.dataset.state = state;
  }
  for (const selector of ['#enquiry-name','#enquiry-message']) $(selector)?.addEventListener('input', e => e.target.setCustomValidity(''));
  const phone = $('#enquiry-number');
  phone?.addEventListener('input', () => {phone.setCustomValidity('');$('#phone-error').hidden = true;});
  if (form) form.addEventListener('submit', async e => {
    e.preventDefault();
    const values = formValues();
    if (values.website) {status('Please contact the studio directly by phone.');return;}
    $('#enquiry-name').setCustomValidity(values.name.length >= 2 ? '' : 'Please enter your name.');
    $('#enquiry-message').setCustomValidity(values.message.length >= 10 ? '' : 'Please describe your project in at least 10 characters.');
    const digits = values.number.replace(/[^0-9]/g, '');
    const phoneValid = /^\+?[0-9 ()-]+$/.test(values.number) && (values.number.startsWith('+') ? digits.length >= 8 && digits.length <= 15 : digits.length === 10 || digits.length === 12 && digits.startsWith('91'));
    phone.setCustomValidity(phoneValid ? '' : 'Please enter a valid phone number.');
    $('#phone-error').hidden = phoneValid;
    if (!form.reportValidity()) return;
    prepareHandoff(values);
    const submit = $('#enquiry-submit');
    submit.disabled = true;submit.textContent = 'Sending…';
    status('Sending your enquiry…');
    try {
      if (config.enquiryMode === 'handoff') {
        status('Your enquiry is ready. Choose WhatsApp or your email app below to send it to the studio.');
      } else if (config.enquiryMode === 'api') {
        const response = await fetch(config.enquiryEndpoint, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,consent:true,requestId:crypto.randomUUID?.() || String(Date.now())}),signal:AbortSignal.timeout(15000)});
        const result = await response.json();
        if (!response.ok || !result.ok) throw new Error(result.error || 'Unable to save enquiry');
        status(result.delivered ? `Your enquiry has been sent. Reference: ${result.reference}. The studio will contact you to confirm the next step.` : `Your enquiry has been saved. Reference: ${result.reference}. To contact the studio immediately, send it via WhatsApp or email below.`, 'success');
      } else {
        const params = {name:values.name,email:values.email,number:values.number.startsWith('+') ? values.number : '+' + (digits.length === 10 ? '91' : '') + digits,message:`Service: ${values.service}\nProject location: ${values.location || 'To be discussed'}\n\n${values.message}`};
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({service_id:config.emailjs.serviceId,template_id:config.emailjs.templateId,user_id:config.emailjs.publicKey,template_params:params}),signal:AbortSignal.timeout(15000)});
        if (!response.ok) throw new Error('The email service did not confirm delivery');
        status('Your enquiry has been sent to the studio. We’ll be in touch to discuss your project and confirm any visit.', 'success');
      }
    } catch (error) {
      status('We couldn’t confirm delivery. Your details are still here. Please send your enquiry using WhatsApp or your email app below, or call +91 94473 30144.', 'error');
    } finally {submit.disabled = false;submit.innerHTML = 'Send enquiry <span aria-hidden="true">→</span>';}
  });
  $('#copy-enquiry')?.addEventListener('click', async () => {
    try {await navigator.clipboard.writeText(preparedText);$('#copy-enquiry').textContent = 'Copied';}
    catch {status('Copy isn’t available in this browser. Use the WhatsApp or email link to keep the complete enquiry.');}
  });

  if ('IntersectionObserver' in window && !reducedMotion) {
    document.documentElement.classList.add('motion-ready');
    const reveals = new IntersectionObserver(entries => {
      entries.forEach(entry => {if (entry.isIntersecting) {entry.target.classList.add('visible');reveals.unobserve(entry.target);}});
    }, {threshold:.08});
    $$('.reveal').forEach(el => reveals.observe(el));
  }

  if (!reducedMotion && 'IntersectionObserver' in window) {
    const hero = $('.hero'), landscape = $('.landscape');
    let heroVisible = false, heroFrame = 0;
    function drift(time) {
      heroFrame = 0;
      if (!heroVisible || document.hidden) return;
      const scroll = Math.max(0, window.scrollY);
      landscape.style.setProperty('--landscape-x', `${(Math.sin(time / 6500) * 10).toFixed(2)}px`);
      landscape.style.setProperty('--landscape-y', `${Math.min(scroll * .13, 80).toFixed(2)}px`);
      heroFrame = requestAnimationFrame(drift);
    }
    if (hero && landscape) {
      const visibility = new IntersectionObserver(entries=>{
        heroVisible = entries.some(e=>e.isIntersecting);
        if (heroVisible && !heroFrame) heroFrame=requestAnimationFrame(drift);
        else if (!heroVisible && heroFrame) {cancelAnimationFrame(heroFrame);heroFrame=0;}
      });
      visibility.observe(hero);
      document.addEventListener('visibilitychange',()=>{if(!document.hidden && heroVisible && !heroFrame)heroFrame=requestAnimationFrame(drift);});
    }
    if (comparison && range) {
      let interacted = false;
      const stop = () => {interacted = true;};
      range.addEventListener('pointerdown', stop, {passive:true});range.addEventListener('keydown', stop);
      $('#compare-prev').addEventListener('pointerdown',stop,{passive:true});$('#compare-next').addEventListener('pointerdown',stop,{passive:true});
      const showCompare = new IntersectionObserver(entries=>{
        if (!entries.some(e=>e.isIntersecting) || interacted) return;
        showCompare.disconnect();let started;
        function demonstrate(time) {
          if (interacted) return;
          if (started===undefined) started=time;
          const progress=Math.min(1,(time-started)/2200);
          range.value=50+25*Math.sin(progress*Math.PI*2);updateRange();
          if(progress<1)requestAnimationFrame(demonstrate);
        }
        requestAnimationFrame(demonstrate);
      },{threshold:.4});showCompare.observe(comparison);
    }
  }
  document.dispatchEvent(new Event('nihaara:ready'));
})();
