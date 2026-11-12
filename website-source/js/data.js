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
