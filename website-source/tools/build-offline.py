#!/usr/bin/env python3
"""Build a single self-contained HTML preview without resizing/re-encoding assets.
Python standard library only. Photos are streamed as separate embedded payloads;
the browser converts them to local Blob URLs without a network connection.
"""
from pathlib import Path
import argparse,base64,json,mimetypes,re
parser=argparse.ArgumentParser();parser.add_argument('--output',required=True);args=parser.parse_args()
root=Path(__file__).resolve().parents[1];output=Path(args.output).resolve();output.parent.mkdir(parents=True,exist_ok=True)
photos=sorted(p for folder in ['projects','gallery','comparisons','team'] for p in (root/'assets'/folder).glob('*') if p.is_file())
small={}
for p in (root/'assets').rglob('*'):
 if not p.is_file() or p in photos or p.name.startswith('qa-'):continue
 if p.parent.name=='fonts' or p.suffix=='.svg':
  mime={'.ttf':'font/ttf','.svg':'image/svg+xml'}.get(p.suffix,mimetypes.guess_type(p.name)[0])
  small[p.relative_to(root).as_posix()]='data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()
placeholder='data:image/svg+xml;base64,'+base64.b64encode(b'<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="#d9ddcd"/></svg>').decode()
photo_names={p.relative_to(root).as_posix() for p in photos}
def inline_sources(html):
 def replace(m):
  key=m.group(1)
  if key in small:return 'src="'+small[key]+'"'
  if key in photo_names:return 'data-asset="'+key+'" src="'+placeholder+'"'
  raise ValueError('Unbundled asset '+key)
 return re.sub(r'\bsrc="(assets/[^"<>]+)"',replace,html)
css=(root/'css/styles.css').read_text(encoding='utf-8')
css=re.sub(r"url\((['\"]?)(\.\./assets/[^)'\"]+)\1\)",lambda m:'url("'+small[m.group(2)[3:]]+'")',css)
assert '../assets/' not in css
pages={}
for key,filename in [('home','index.html'),('gallery','gallery.html'),('faq','faq.html'),('studio','studio.html'),('privacy','privacy.html')]:
 html=(root/filename).read_text(encoding='utf-8');content=re.search(r'<main id="main">(.*?)</main>',html,re.S).group(1)
 if key=='privacy':
  content=content.replace('The website’s default form sends your enquiry through EmailJS, the email service used by the original Nihaara website. If the studio enables the included server mode, enquiries are stored on the studio’s server and may be forwarded through its configured notification service. A saved enquiry and an email delivery are shown as different states.','This offline preview prepares your enquiry as a draft in WhatsApp or your email app. You choose whether to send it. It does not submit your details to a website server.')
 pages[key]=inline_sources(content)
index=(root/'index.html').read_text(encoding='utf-8');header=re.search(r'<header class="site-header".*?</header>',index,re.S).group();splash=re.search(r'<body[^>]*>(.*?)<a class="skip-link"',index,re.S).group(1)
footer=(root/'gallery.html').read_text(encoding='utf-8').split('</main>',1)[1].split('<div id="dialog-root">',1)[0]
config=(root/'js/config.js').read_text(encoding='utf-8').replace("enquiryMode: 'emailjs'","enquiryMode: 'handoff'")
app=(root/'js/app.js').read_text(encoding='utf-8').replace("const u = new URL(location.href);u.searchParams.set('view', galleryFilter);history.replaceState(null, '', u);",'// Offline filter state stays in this document.')
app=app.replace('lightboxIndices = gallery ? activeGalleryIndices : data.projects.map((_, index) => index);',"lightboxIndices = project.closest('#gallery-grid') ? activeGalleryIndices : data.projects.map((_, index) => index);")
app=app.replace('src="${escape(project.image)}"','data-asset="${escape(project.image)}" src="${escape(window.nihaaraAssetURL(project.image))}"')
app=inline_sources(app)
# No reduced-size preview derivatives and no motion-disabling substitutions.
registry='''
(() => {
 const placeholder=PLACEHOLDER, urls=new Map(), queued=new Set(), queue=[];
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
'''.replace('PLACEHOLDER',json.dumps(placeholder))
router='''
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
'''
script=registry+'\n'+config+'\n'+(root/'js/data.js').read_text(encoding='utf-8')+'\n'+(root/'js/content.js').read_text(encoding='utf-8')+'\n'+app+'\n'+router
assert '</script' not in script.lower()
head='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#eeeee2"><title>Nihaara — The Vasthu Architecture</title><link rel="icon" href="'+small['assets/favicon.svg']+'" type="image/svg+xml"><style>'+css+'\n[data-offline-page][hidden]{display:none!important}</style><noscript><style>.site-splash{display:none!important}</style></noscript></head><body data-page="home">'
body=splash+'<script>'+(root/'js/intro.js').read_text(encoding='utf-8')+'</script><a class="skip-link" href="#main">Skip to content</a>'+header+'<main id="main">'+''.join('<div data-offline-page="'+key+'"'+(' hidden' if key!='home' else '')+'>'+value+'</div>' for key,value in pages.items())+'</main><div id="offline-footer" hidden>'+footer+'</div><div id="dialog-root"></div><noscript><div class="noscript-note">Enable JavaScript for photo loading and gallery controls. You can call the studio at <a href="tel:+919447330144">+91 94473 30144</a>.</div></noscript>'
# Put the homepage images first. All bytes are preserved exactly.
priority=['assets/projects/project-01.jpg','assets/projects/project-03.jpg','assets/projects/project-05.jpg','assets/comparisons/1-real.jpg','assets/comparisons/1-3d.jpg','assets/gallery/gallery-030.jpg']
photos.sort(key=lambda p:(priority.index(p.relative_to(root).as_posix()) if p.relative_to(root).as_posix() in priority else len(priority),str(p)))
with output.open('w',encoding='utf-8') as out:
 out.write(head+body+'<script>'+script+'</script>')
 for p in photos:
  mime=mimetypes.guess_type(p.name)[0] or 'application/octet-stream';key=p.relative_to(root).as_posix();out.write('<script type="application/octet-stream" data-key="'+key+'" data-mime="'+mime+'">')
  with p.open('rb') as source:
   while chunk:=source.read(98304):out.write(base64.b64encode(chunk).decode())
  out.write('</script><script>nihaaraRegisterAsset(document.currentScript.previousElementSibling);document.currentScript.remove();</script>')
 licenses='\n\n'.join(p.read_text(encoding='utf-8') for p in sorted((root/'docs').glob('*OFL.txt')));out.write('<script type="text/plain" id="font-license-notices">'+licenses+'</script></body></html>')
# Application code is small and independently syntax-checkable.
(root.parent/'research').mkdir(parents=True,exist_ok=True)
(root.parent/'research/hq-offline-script.js').write_text(script,encoding='utf-8')
print(json.dumps({'file':str(output),'bytes':output.stat().st_size,'photos':len(photos),'photoBytes':sum(p.stat().st_size for p in photos),'motionEnabled':True,'imagePolicy':'byte-for-byte original assets, native dimensions'}))
