/* Opening from the reference: ivory screen, centred brand wipe, short hold,
   soft dissolve into the headline and landscape. No browser storage required. */
(() => {
  const splash = document.getElementById('site-splash');
  if (!splash) {document.documentElement.classList.add('splash-complete');return;}
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let ready = false, minimum = false, leaving = false;
  root.classList.add('splash-running');
  document.body.classList.add('splash-locked');
  function leave(force = false) {
    if (leaving || !force && !(ready && minimum)) return;
    leaving = true;root.classList.add('splash-complete');splash.classList.add('splash-exiting');
    document.body.classList.remove('splash-locked');
    setTimeout(() => {splash.remove();root.classList.remove('splash-running');document.dispatchEvent(new Event('nihaara:intro-complete'));},reduced ? 20 : 620);
  }
  requestAnimationFrame(() => {root.classList.add('splash-started');});
  setTimeout(() => {minimum = true;leave();},reduced ? 100 : 2050);
  document.addEventListener('nihaara:ready',()=>{ready=true;leave();},{once:true});
  document.getElementById('splash-skip')?.addEventListener('click',()=>leave(true));
  document.addEventListener('keydown',e=>{if(e.key==='Escape' && !leaving)leave(true);});
  // A failed script or slow third-party connection must never block the page.
  setTimeout(()=>leave(true),10000);
})();
