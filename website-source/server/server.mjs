import http from 'node:http';
import {readFile, appendFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.svg':'image/svg+xml','.ttf':'font/ttf','.txt':'text/plain; charset=utf-8','.xml':'application/xml; charset=utf-8'};
const pages = new Set(['index.html','gallery.html','faq.html','privacy.html','studio.html','robots.txt','sitemap.xml']);
const legacy = {'/about':'/studio.html','/gallery':'/gallery.html','/faq':'/faq.html','/real-vs-3d':'/index.html#drawn-built','/contact':'/index.html#contact'};
const json = (res, code, value) => {res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};

function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'Invalid enquiry.';
  if (body.website) return 'Please contact the studio directly.';
  if (body.consent !== true) return 'Please confirm consent to respond to your enquiry.';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const phone = typeof body.number === 'string' ? body.number.trim() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  if (name.length < 2 || name.length > 80 || /[\r\n]/.test(name)) return 'Enter your name (2–80 characters).';
  if (email.length > 160 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
  const digits = phone.replace(/[^0-9]/g, '');
  if (!/^\+?[0-9 ()-]+$/.test(phone) || !(phone.startsWith('+') ? digits.length >= 8 && digits.length <= 15 : digits.length === 10 || digits.length === 12 && digits.startsWith('91'))) return 'Enter a valid phone number.';
  if (message.length < 10 || message.length > 4000) return 'Describe your project in 10–4000 characters.';
  for (const [key, max] of [['service',100],['location',120]]) if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > max)) return 'Invalid project details.';
  return null;
}

export function createApp({dataDir = process.env.DATA_DIR || path.join(root,'data'), deliver = null} = {}) {
  const rate = new Map(), recent = new Map();
  const notify = deliver || (process.env.ENQUIRY_WEBHOOK_URL ? async enquiry => {
    const url = new URL(process.env.ENQUIRY_WEBHOOK_URL);
    if (url.protocol !== 'https:') throw new Error('The notification URL must use HTTPS');
    const response = await fetch(url, {method:'POST',headers:{'Content-Type':'application/json',...(process.env.ENQUIRY_WEBHOOK_TOKEN ? {'Authorization':`Bearer ${process.env.ENQUIRY_WEBHOOK_TOKEN}`} : {})},body:JSON.stringify(enquiry),signal:AbortSignal.timeout(10000)});
    if (!response.ok) throw new Error('Notification service rejected enquiry');
  } : null);
  return http.createServer(async (req, res) => {
    res.setHeader('X-Content-Type-Options','nosniff');
    res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options','SAMEORIGIN');
    res.setHeader('Permissions-Policy','camera=(), microphone=(), geolocation=()');
    try {
      const u = new URL(req.url, 'http://localhost');
      if (u.pathname === '/api/status' && req.method === 'GET') return json(res,200,{ok:true,service:'nihaara-enquiries',notificationsConfigured:!!notify});
      if (u.pathname === '/api/enquiries') {
        if (req.method !== 'POST') {res.setHeader('Allow','POST');return json(res,405,{ok:false,error:'Use POST.'});}
        if (req.headers.origin) {
          let origin;
          try {origin = new URL(req.headers.origin);} catch {return json(res,403,{ok:false,error:'Invalid origin.'});}
          if (origin.host !== req.headers.host) return json(res,403,{ok:false,error:'Cross-origin submissions are not accepted.'});
        }
        if (!/^application\/json\b/i.test(req.headers['content-type'] || '')) return json(res,415,{ok:false,error:'Send application/json.'});
        const key = req.socket.remoteAddress || 'unknown';
        const now = Date.now();
        for (const [ip, item] of rate) if (now - item.start > 600000) rate.delete(ip);
        for (const [id, item] of recent) if (now - item.time > 600000) recent.delete(id);
        const limit = rate.get(key) || {start:now,count:0};
        if (limit.count >= 5) {res.setHeader('Retry-After','600');return json(res,429,{ok:false,error:'Please wait before submitting another enquiry.'});}
        const chunks = [];let bytes = 0;
        for await (const chunk of req) {
          bytes += chunk.length;
          if (bytes > 20000) return json(res,413,{ok:false,error:'Enquiry is too large.'});
          chunks.push(chunk);
        }
        let body;
        try {body = JSON.parse(Buffer.concat(chunks).toString('utf8'));} catch {return json(res,400,{ok:false,error:'Invalid JSON.'});}
        const error = validate(body);
        if (error) return json(res,400,{ok:false,error});
        const requestId = typeof body.requestId === 'string' && /^[a-zA-Z0-9-]{8,80}$/.test(body.requestId) ? body.requestId : null;
        const dedupKey = requestId ? `${key}:${requestId}` : null;
        if (dedupKey && recent.has(dedupKey)) return json(res,200,recent.get(dedupKey).result);
        limit.count++;rate.set(key,limit);
        const reference = 'NH-' + randomUUID().slice(0,8).toUpperCase();
        const enquiry = {reference,createdAt:new Date().toISOString(),name:body.name.trim(),email:body.email.trim(),number:body.number.trim(),service:(body.service || '').trim(),location:(body.location || '').trim(),message:body.message.trim(),consent:true};
        await mkdir(dataDir, {recursive:true,mode:0o700});
        await appendFile(path.join(dataDir,'enquiries.jsonl'),JSON.stringify(enquiry)+'\n',{mode:0o600});
        let delivered = false;
        if (notify) {
          try {await notify(enquiry);delivered = true;}
          catch {console.error(`Notification failed for ${reference}; enquiry is retained.`);}
        }
        const result = {ok:true,reference,delivered};
        if (dedupKey) recent.set(dedupKey,{time:now,result});
        return json(res,201,result);
      }
      if (!['GET','HEAD'].includes(req.method)) return json(res,405,{ok:false,error:'Method not allowed.'});
      if (legacy[u.pathname]) {res.writeHead(301,{Location:legacy[u.pathname]});return res.end();}
      let name;
      try {name = decodeURIComponent(u.pathname).replace(/^\/+/, '') || 'index.html';} catch {res.writeHead(400);return res.end('Bad request');}
      if (name.split('/').includes('..')) {res.writeHead(404);return res.end('Page not found.');}
      const allowed = pages.has(name) || /^(assets|css|js)\/[a-zA-Z0-9/_\-.]+$/.test(name);
      const filename = path.resolve(root,name);
      if (!allowed || !filename.startsWith(root + path.sep) || !mime[path.extname(filename)]) {res.writeHead(404);return res.end('Page not found.');}
      const info = await stat(filename);
      if (!info.isFile()) {res.writeHead(404);return res.end('Page not found.');}
      res.writeHead(200,{'Content-Type':mime[path.extname(filename)],'Content-Length':info.size,'Cache-Control':/\.(webp|png|jpg|ttf|svg)$/.test(name) ? 'public, max-age=86400' : 'no-cache'});
      res.end(req.method === 'HEAD' ? undefined : await readFile(filename));
    } catch (error) {
      if (!res.headersSent) {
        if (error.code === 'ENOENT') {res.writeHead(404);res.end('Page not found.');}
        else {console.error('Request failed:',error.code || error.name);json(res,500,{ok:false,error:'The request could not be completed. Please contact the studio directly.'});}
      } else res.end();
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.loadEnvFile) {try {process.loadEnvFile(path.join(root,'.env'));} catch(error) {if (error.code !== 'ENOENT') throw error;}}
  const option = name => {const i = process.argv.indexOf(name);return i >= 0 ? process.argv[i + 1] : undefined;};
  const port = Number(option('--port') || process.env.PORT || 3000);
  const host = option('--host') || process.env.HOST || '0.0.0.0';
  createApp().listen(port,host,() => console.log(`Nihaara is ready at http://localhost:${port}`));
}
