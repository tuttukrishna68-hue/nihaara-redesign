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
  enquiryMode: 'emailjs',
  enquiryEndpoint: '/api/enquiries',
  emailjs: {serviceId: 'service_pptcv1o', templateId: 'template_xzg1h8q', publicKey: 'tNhT4dHG0__IOK4e_'}
});
