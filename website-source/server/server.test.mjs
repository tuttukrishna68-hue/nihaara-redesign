import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {createApp} from './server.mjs';

const sample = {name:'Website QA',email:'qa@example.com',number:'+919999999999',service:'Site visit',location:'Thodupuzha',message:'Local test enquiry only; no real message should be sent.',consent:true,requestId:'qa-request-001'};
async function setup(t, deliver = null) {
  const dir = await mkdtemp(path.join(tmpdir(),'nihaara-test-'));
  const server = createApp({dataDir:dir,deliver});
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  t.after(async()=>{await new Promise(resolve=>server.close(resolve));await rm(dir,{recursive:true,force:true});});
  const post = (body,extra={}) => fetch(base+'/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json',...extra},body:JSON.stringify(body)});
  return {dir,server,base,post};
}
test('persists validated enquiries and distinguishes saved from delivered',async t=>{
 const {dir,post}=await setup(t);
 const res=await post(sample);assert.equal(res.status,201);
 const result=await res.json();assert.equal(result.ok,true);assert.equal(result.delivered,false);assert.match(result.reference,/^NH-/);
 const saved=JSON.parse((await readFile(path.join(dir,'enquiries.jsonl'),'utf8')).trim());
 assert.equal(saved.email,sample.email);assert.equal(saved.message,sample.message);assert.equal(saved.consent,true);
 const duplicate=await post(sample);assert.equal(duplicate.status,200);assert.equal((await duplicate.json()).reference,result.reference);
 assert.equal((await readFile(path.join(dir,'enquiries.jsonl'),'utf8')).trim().split('\n').length,1);
});
test('requires consent and valid contact details',async t=>{
 const {post}=await setup(t);
 for(const bad of [{consent:false},{number:'abc123'},{number:'123456789012345'},{email:'invalid'},{name:'A'},{message:'short'},{website:'spam.example'}]) {
  const res=await post({...sample,...bad});assert.equal(res.status,400);assert.equal((await res.json()).ok,false);
 }
});
test('notification failure still saves the enquiry and never claims delivery',async t=>{
 const {dir,post}=await setup(t,async()=>{throw new Error('Offline test');});
 const response=await post(sample);assert.equal(response.status,201);assert.equal((await response.json()).delivered,false);
 assert.ok((await readFile(path.join(dir,'enquiries.jsonl'),'utf8')).includes(sample.email));
});
test('successful configured notification returns delivered status',async t=>{
 let called=0;const {post}=await setup(t,async enquiry=>{called++;assert.equal(enquiry.name,sample.name);});
 assert.equal((await (await post(sample)).json()).delivered,true);assert.equal(called,1);
});
test('blocks cross-origin writes and private server files',async t=>{
 const {post,base}=await setup(t);
 assert.equal((await post(sample,{Origin:'https://unrelated.example'})).status,403);
 for(const file of ['/server/server.mjs','/data/enquiries.jsonl','/.env','/docs/source-content.json','/assets/%2e%2e/server/server.mjs']) assert.equal((await fetch(base+file)).status,404);
 assert.equal((await fetch(base+'/index.html')).status,200);
 assert.equal((await fetch(base+'/css/styles.css')).status,200);
});
test('rate limits repeated distinct enquiries',async t=>{
 const {post}=await setup(t);
 for(let i=0;i<5;i++) assert.equal((await post({...sample,requestId:'request-'+i})).status,201);
 const res=await post({...sample,requestId:'request-over-limit'});assert.equal(res.status,429);assert.equal(res.headers.get('retry-after'),'600');
});
