
(() => {
 const placeholder="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZDlkZGNkIi8+PC9zdmc+", urls=new Map(), queued=new Set(), queue=[];
 let active=false;
 const payloads=new Map();
 window.nihaaraAssetURL=key=>urls.get(key)||placeholder;
 window.nihaaraSetImage=(image,key)=>{image.dataset.asset=key;image.src=window.nihaaraAssetURL(key);};
 async function processNext(){
  if(active || !queue.length)return;active=true;
  const key=queue.shift(),item=payloads.get(key);
  if(item){
   try{
    let blob;
    try{blob=await (await fetch('data:'+item.mime+';base64,'+item.encoded)).blob();}
    catch{
     const raw=atob(item.encoded),chunks=[];
     for(let offset=0;offset<raw.length;offset+=65536){const part=raw.slice(offset,offset+65536),bytes=new Uint8Array(part.length);for(let i=0;i<part.length;i++)bytes[i]=part.charCodeAt(i);chunks.push(bytes);}
     blob=new Blob(chunks,{type:item.mime});
    }
    const url=URL.createObjectURL(blob);urls.set(key,url);payloads.delete(key);
    document.querySelectorAll('img[data-asset]').forEach(image=>{if(image.dataset.asset===key)image.src=url;});
   }catch(error){console.error('Unable to decode embedded image',key,error);}
  }
  active=false;setTimeout(processNext,0);
 }
 window.nihaaraRegisterAsset=element=>{
  const key=element.dataset.key;payloads.set(key,{mime:element.dataset.mime,encoded:element.textContent});element.remove();
  if(!queued.has(key)){queued.add(key);queue.push(key);setTimeout(processNext,0);}
 };
})();

/* Public website settings. EmailJS values below are the existing site's public
   client integration, not private credentials. Confirm its domain allowlist/quota
   before launch. Never place a private key in this file. */
window.NIHAARA_CONFIG = Object.freeze({
  name: 'Nihaara Architects',
  tagline: 'The Vasthu Architecture',
  phone: '+91 94473 30144',
  telephone: '+919447330144',
  whatsapp: '919447330144',
  alternatePhones: ['+917559976144', '+914862227515'],
  email: 'vasthunihaara@gmail.com',
  careersEmail: 'nihaaraarchitects@gmail.com',
  address: 'Sreepadmam Building, Vengalloor–Kolany Bypass Road, Thodupuzha, Idukki, Kerala 685608, India',
  map: 'https://goo.gl/maps/oHnVtnCWVRrYitmh8',
  instagram: 'https://www.instagram.com/nihaara.architects/',
  facebook: 'https://www.facebook.com/nihaaratdpa',
  // 'emailjs': sends via the existing site's service on static hosting.
  // 'api': uses the included Node backend; set delivery environment variables.
  // 'handoff': prepares a message for the visitor to send via WhatsApp/email.
  enquiryMode: 'handoff',
  enquiryEndpoint: '/api/enquiries',
  emailjs: {serviceId: 'service_pptcv1o', templateId: 'template_xzg1h8q', publicKey: 'tNhT4dHG0__IOK4e_'}
});

/* Content from nihaara.com, retrieved 12 November 2026.
   Gallery images are kept in their source order; no locations, floor areas,
   completion dates or client names have been inferred from photographs. */
window.NIHAARA_DATA = {
  projects: [
    {title:'Mr Joby', image:'assets/projects/project-01.jpg'},
    {title:'Mr Lal Karinkunnam', image:'assets/projects/project-02.jpg'},
    {title:'Mr Binu C Babu', image:'assets/projects/project-03.jpg'},
    {title:'Mr Jibi', image:'assets/projects/project-04.jpg'},
    {title:'Mr Krishnachandran', image:'assets/projects/project-05.jpg'},
    {title:'Mr Roopesh', image:'assets/projects/project-06.jpg'},
    {title:'Mr Shibu', image:'assets/projects/project-07.jpg'},
    {title:'Dr Rahul', image:'assets/projects/project-08.jpg'}
  ],
  gallery: Array.from({length:115},(_,i)=>({title:`From the studio · ${String(i+1).padStart(3,'0')}`,image:`assets/gallery/gallery-${String(i+1).padStart(3,'0')}.jpg`})),
  comparisons: [6, 4, 7, 1, 2, 3, 5].map(i => ({id:i, render:`assets/comparisons/${i}-3d.jpg`, real:`assets/comparisons/${i}-real.jpg`, title:`From visual to built home · ${String(i).padStart(2,'0')}`})),
  services: [
    {title:'Vasthu Consulting',icon:'vasthu',text:'The Vasthu consultants recommend a simple and straightforward layout that allows you to balance the energy and vibrations in your home or office.'},
    {title:'Estimate',icon:'estimate',text:'An estimate for any construction work is the process of calculating the quantities and costs of the various items required for the work.'},
    {title:'Interior & Exterior Designing',icon:'interior',text:'We interpret your requirements and schedule during the brief, translating customer needs into rough plans.'},
    {title:'Site Visit',icon:'site',text:'A site visit is when an external evaluation team visits an institution to evaluate verbal, written and visual evidence.'},
    {title:'Drawing',icon:'drawing',text:'The construction drawing provides a graphic representation of how the building will be built.'}
  ],
  serviceOffers: [
    {title:'Construction',icon:'construction'},
    {title:'Landscaping',icon:'landscaping'},
    {title:'Electrical / Plumbing',icon:'electrical'},
    {title:'Painting',icon:'painting'},
    {title:'Roofing / Tiling',icon:'roofing'},
    {title:'Furniture and Accessories',icon:'furniture'},
    {title:'Remodeling',icon:'remodeling'},
    {title:'Full Turnkey Service',icon:'turnkey'}
  ]
};

/* Original Nihaara content, bundled for offline use. */
Object.assign(window.NIHAARA_DATA, {
  "faqs": [
    {
      "question": "What do Nihaara architects do?",
      "answer": "We are architects/designers who primarily offer services related to architectural design. We mainly design buildings, but we also deal with interiors, furniture, products, accessories, landscaping, as well as graphics if it is interesting."
    },
    {
      "question": "Where is your office?",
      "answer": "Location: Vengalloor-kolany by-pass road, Thodupuzha, Idukki (D+), State: Kerala, Country: India"
    },
    {
      "question": "Do you have branches elsewhere?",
      "answer": "No"
    },
    {
      "question": "Since when have you been practicing?",
      "answer": "Since 2006, we founded Nihaara architects in the year 2006"
    },
    {
      "question": "What style of architecture do you practice?",
      "answer": "We are constantly searching for a language (style) of our own. As of now, our designs can be broadly categorized as contemporary, traditional & colonial."
    },
    {
      "question": "Do you practice Traditional Kerala architecture?",
      "answer": "Yes. Many have asked us why we practice traditional architecture, being a practice based in Kerala."
    },
    {
      "question": "Can we see any of your built works?",
      "answer": "We can guide you to our projects that are under construction. But regarding our finished projects, we prefer to respect the client’s privacy and let you access only the documentation of the project (photographs or videos of our project available on the internet)."
    },
    {
      "question": "Do we have to travel down to your office to meet you?",
      "answer": "Yes. That way you’d get to see how we work."
    },
    {
      "question": "Do we need to take an appointment to meet you in your office?",
      "answer": "Yes. We have set aside the morning half of the office hours purely for designing, and it’s in the afternoon half of the office hours that we meet our clients to discuss project-related matters. Hence it is necessary to take an appointment in advance (by mail or phone) to meet us."
    },
    {
      "question": "What time is the best to reach you on the phone?",
      "answer": "We prefer calls only on weekdays between 10.00 am to 6.00 pm. In case we were unable to pick your call during these hours, it may be because we were in a meeting. In such a situation kindly reach us afterward or leave a message."
    },
    {
      "question": "When do we have the first meeting?",
      "answer": "If the client is comfortable with our ideas and working style, we give them an appointment for a meeting in our office. We usually meet the client in the afternoon session (between 3.00 pm to 6.00 pm) as the morning session is assigned for designing projects."
    },
    {
      "question": "What should we bring when we come to meet you?",
      "answer": "It would be advisable to bring: a) copy of the village sketch of the site, b) detailed brief/requirements for the project, c) a few photographs or video clips of the site would be helpful too."
    },
    {
      "question": "When would you start designing our project?",
      "answer": "We take up only a limited number of projects each year to maintain a certain level of quality, and as a result, we usually have a waiting list of projects/clients. We would add your project to this list and take it up based on the schedule."
    },
    {
      "question": "How does the whole process of designing happen?",
      "answer": "When clients contact us for their project, we make sure that we send the link to this website or an email that contains a gist of this website’s content. If the clients are comfortable with our ideas of architecture/design mentioned in the details sent to them, we call them over for a meeting in our office after which we visit their site. After the site visit, we give them a list of points to be considered when they get the digital survey of the site done. Once the survey details are obtained, we call the clients for a detailed discussion and note down all details regarding the project. As the next step, we sit with these requirements and prepare a core concept which would give a direction to their project. Once a basic layout is ready, we call the clients for the next meeting, which would help us both finalize the design. If the clients have communicated well during the first two sessions, it has been our experience that the clients approve what we show them at this stage. As soon as the meeting is over, we strengthen our design based on the outcome of the discussion. The next step is to create detailed drawings for approval/construction."
    },
    {
      "question": "Who would design our projects?",
      "answer": "It's sure that we are available at the office for all the major meetings as the design is developed together by us. Once we both feel that the project has reached a certain level of detail, we take all the responsibility for the project. However, the project would be designed by me and my team. Nihaara would be involved in every stage of it."
    },
    {
      "question": "Do we have to pay you for the first site visit?",
      "answer": "Yes. We do charge a nominal fee (+actual travel fee) for our first site visit if the site is outside Thodupuzha city limits, as many inquiries that come our way need not materialize into full-fledged projects due to several reasons."
    },
    {
      "question": "What services do you offer?",
      "answer": "(Please refer to our services and fee statements for details. If you don’t have it already, do contact us for the same.)"
    },
    {
      "question": "Do we have to pay you an advance before starting the project?",
      "answer": "Yes. The amount depends on the project. (Please refer to our services and fee statements for details. If you don’t have it already, do contact us for the same.)"
    },
    {
      "question": "When do we get the 'services and fee statement' from you?",
      "answer": "We usually send the 'services and fee statement' to the prospective clients only once we have had a detailed discussion (over the phone) regarding the project and choose to take it to the next level. It is necessary that we learn the project brief before we can send you the 'services and fee statement'. Do give us a call on the numbers given in the contact and request for the same."
    },
    {
      "question": "If we are comfortable with each other’s ideas, what are the details required before designing our project?",
      "answer": "1) Village Survey Sketch, 2) Total Station (Digital) Surveys in CAD/Dwg format. (We would give you instructions on points to be considered during the survey of your site), 3) Details of the site (we would give you a form which would have to be filled up by the client and returned to us), 4) A copy of the land deed document(s), 5) A copy of the Basic Tax Register (BTR from the village office) related to the survey number(s) of your site, 6) And, of course, detailed project requirements, 7) Nearest electric post number"
    },
    {
      "question": "Do you give us several options of designs to choose from?",
      "answer": "After finalizing your plan & 3D, we will draw all detailed drawings about your plan as per the 3D view. If you change the plan after finalization, additional charges may be applicable."
    },
    {
      "question": "Do you take up construction of your designs?",
      "answer": "Yes."
    },
    {
      "question": "Do you supervise your projects?",
      "answer": "We do not offer regular supervision or bill checking as Nihaara Architects are a small studio that concentrates on design solutions rather than the execution of their projects for the time being. But, we do offer timely visits at various stages (depending on the scheme chosen) to ensure that the construction is as per the finalized design."
    },
    {
      "question": "If we already have a plan ready from some other source, would you detail/design the rest of such a project?",
      "answer": "Yes, we will do!"
    },
    {
      "question": "Do you do elevations alone?",
      "answer": "Yes, we have a teamwork."
    },
    {
      "question": "Do you design considering Vasthu?",
      "answer": "Yes, we would like to consider the scientific vision of Vasthu."
    },
    {
      "question": "What is NMD?",
      "answer": "NMD stands for Nihaara Micro Details."
    },
    {
      "question": "What is Something Inside?",
      "answer": "Something Inside is the Interior division of Nihaara."
    },
    {
      "question": "What are the benefits of NMD?",
      "answer": "This is our concept for more details of each and every room. It helps more for internal work and interior works. It has different stages. NMD is more helpful for all finishing works. It focused on 4 side elevations. (Please refer to our services and fee statements for details. If you don’t have it already, do contact us for the same)."
    },
    {
      "question": "How can we contact you?",
      "answer": "Write to us @ NIHAARA ARCHITECTS, Sreepadmam building, Vengalloor – kolany by-pass, Thodupuzha, Idukki (D+), Pin:-685608, Kerala, India, Call us @ +91 9447330144, +91 7559976144, +91 4862227515, Email us @ (Projects and other related enquiry only): vasthunihaara@gmail.com, (Internship related enquiry only): nihaaraarchitects@gmail.com, Follow us: Website - www.nihaara.com, Facebook - https://www.facebook.com/nihaaratdpa/, Instagram - https://instagram.com/nihaara_architects?igshid=t7xkh7usjl5d"
    }
  ],
  "testimonials": [
    {
      "name": "Georgekutty",
      "description": "Nihaara and team are well organized and clear on the expectations needed to meet their customers needs"
    },
    {
      "name": "Vaisakh",
      "description": "All communications are timely and very professional"
    },
    {
      "name": "Dony",
      "description": "Innovative and professional staff. Would do business with again"
    },
    {
      "name": "Jayaraj & Sreeja Jayaraj",
      "description": "Great team of professional and ethics minded people"
    },
    {
      "name": "Sreeja Jayaraj",
      "description": "Nihaara and team are wonderful! They are very knowledgeable and helped me tremendously with my projects"
    },
    {
      "name": "Joy",
      "description": "Their ability to be creative and to bring insightful ideas to be considered was very impressive"
    },
    {
      "name": "Sugathan",
      "description": "Architect delivered extraordinarily high-quality work. They were disciplined, thoughtful, and insightful."
    },
    {
      "name": "Soumya George",
      "description": "We are satisfied with their performance. All the projects have been completed on time, and they have been completed within the requested scope and budget"
    },
    {
      "name": "Gigi USA",
      "description": "It was a very good experience. I highly recommend them for any Architectural work"
    },
    {
      "name": "Gigimol",
      "description": "Very satisfied with Nihaara. They were professional and always available and responsive"
    },
    {
      "name": "Abi Paika",
      "description": "I was impressed by the professionalism, attention to detail, and promptness of this firm"
    },
    {
      "name": "Sandhya",
      "description": "Nihaara Architects is one of the best companies I have worked with for architectural services"
    },
    {
      "name": "Saji Mulakkal",
      "description": "Professional and easy to work with. Listened to my needs and readily had plans done. Thank you Nihaara architects!"
    },
    {
      "name": "Ebin Raj",
      "description": "Truly a wonderful experience, exceeding my expectations. I would definitely recommend Nihaara Architects."
    },
    {
      "name": "Pramod Chacko",
      "description": "Great and talented architect he did a fantastic job for us. Very pleasant and accommodating"
    },
    {
      "name": "Meetu John",
      "description": "Thanks Nihaara, we appreciate your flexibility and skillful interior designs"
    },
    {
      "name": "Bibu Mannanam",
      "description": "Great team of professional and ethics minded people"
    },
    {
      "name": "Rajesh Kudayathoor",
      "description": "Very talented individuals working on the project who took a genuine interest in the project which showed in the quality of the outcomes."
    },
    {
      "name": "Prasad Okkal",
      "description": "Always willing to go the extra mile to ensure the projects success"
    },
    {
      "name": "Sajeev Kumar Pampady",
      "description": "Innovative ideas and advice to enhance the value of the outcome"
    },
    {
      "name": "Radha Krishnan",
      "description": "Thank you so much for everything. I will highly recommend everyone to contact you and your company."
    },
    {
      "name": "Arun Nagapuzha",
      "description": "What an awesome service from a great firm"
    },
    {
      "name": "Dr. Uniikrishnana & Viji Unnikrishnan",
      "description": "A very hard working and professional team who approach a project like its their own"
    },
    {
      "name": "Jesty kudayathoor",
      "description": "It has been a real pleasure to work with you and its fantastic to see how professional and hard working you are"
    }
  ]
});

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
    return `<button class="project-card${gallery ? '' : ' reveal'}" data-lightbox="${index}" aria-label="View ${escape(project.title)}"><div class="project-image-wrap"><img data-asset="${escape(project.image)}" src="${escape(window.nihaaraAssetURL(project.image))}" alt="${escape(project.title)} — Nihaara architectural portfolio" width="1000" height="750" loading="lazy" decoding="async"><span class="project-open" aria-hidden="true">↗</span></div><div class="project-meta"><h3>${escape(project.title)}</h3><span>${gallery && index >= data.projects.length ? 'Studio gallery' : 'Nihaara Architects'}</span></div></button>`;
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
      vasthu:'<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="20" cy="18" r="10"></circle><path d="M20 13v6l4 3"></path><path d="M27 29c4-1 8 1 10 5 2 4 1 8-3 10-4 2-8 1-10-3"></path><path d="m29 31 4 4 4-4"></path></svg>',
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
      // Offline filter state stays in this document.
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
    <dialog class="dialog lightbox" id="lightbox" aria-labelledby="lightbox-title"><div class="lightbox-bar"><div><h2 class="lightbox-title" id="lightbox-title"></h2><p class="lightbox-caption" id="lightbox-caption"></p></div><button class="dialog-close" data-close-dialog aria-label="Close project viewer">×</button></div><img class="lightbox-image" id="lightbox-image" data-asset="assets/projects/project-01.jpg" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjZDlkZGNkIi8+PC9zdmc+" alt=""><div class="lightbox-bottom"><button class="lightbox-enquire" id="project-enquire">Discuss your own project <span aria-hidden="true">↗</span></button><div class="pager"><button class="circle-button" id="lightbox-prev" aria-label="Previous image">←</button><span id="lightbox-count" aria-live="polite"></span><button class="circle-button" id="lightbox-next" aria-label="Next image">→</button></div></div></dialog>`;
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
      lightboxIndices = project.closest('#gallery-grid') ? activeGalleryIndices : data.projects.map((_, index) => index);
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


(() => {
 const panels=Array.from(document.querySelectorAll('[data-offline-page]'));
 const paths={'index.html':'home','gallery.html':'gallery','faq.html':'faq','studio.html':'studio','privacy.html':'privacy'};
 const names={home:'Nihaara — The Vasthu Architecture',gallery:'Work & gallery — Nihaara',faq:'Questions — Nihaara',studio:'The studio — Nihaara',privacy:'Privacy — Nihaara'};
 document.querySelectorAll('#home-faqs .faq-item').forEach((el,i)=>el.id='home-question-'+i);
 function show(page,hash='',view='') {
  panels.forEach(el=>el.hidden=el.dataset.offlinePage!==page);document.getElementById('offline-footer').hidden=page==='home';document.body.dataset.page=page;document.title=names[page];
  if(page==='gallery'&&['all','projects','studio'].includes(view))document.querySelector('[data-filter="'+view+'"]').click();
  document.dispatchEvent(new Event('nihaara:page-change'));
  if(hash&&hash!=='main'){const target=document.getElementById(hash);if(target){if(target.tagName==='DETAILS')target.open=true;target.scrollIntoView({behavior:'auto'});return;}}
  window.scrollTo({top:0,behavior:'auto'});
 }
 document.addEventListener('click',event=>{
  const a=event.target.closest('a[href]');if(!a)return;const href=a.getAttribute('href');
  if(href.startsWith('#')){event.preventDefault();const id=href.slice(1);if(id==='main'){document.getElementById('main').scrollIntoView();return;}if(document.getElementById(id)?.closest('[data-offline-page="home"]'))show('home',id);else document.getElementById(id)?.scrollIntoView();return;}
  const parts=href.split('#'),path=parts[0].split('?'),page=paths[path[0]];if(!page)return;event.preventDefault();show(page,parts[1]||'',new URLSearchParams(path[1]||'').get('view')||'');
 });
})();
