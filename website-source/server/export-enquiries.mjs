import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root = fileURLToPath(new URL('..',import.meta.url));
const source = path.join(process.env.DATA_DIR || path.join(root,'data'),'enquiries.jsonl');
const columns = ['reference','createdAt','name','email','number','service','location','message','consent'];
const quote = value => {
  let text = String(value ?? '');
  if (/^[\s]*[=+@-]/.test(text)) text = "'" + text;
  return '"' + text.replaceAll('"','""') + '"';
};
try {
  const records = (await readFile(source,'utf8')).trim().split('\n').filter(Boolean).map(JSON.parse);
  const output = path.join(process.env.DATA_DIR || path.join(root,'data'),'enquiries.csv');
  await writeFile(output,[columns.join(','),...records.map(row=>columns.map(key=>quote(row[key])).join(','))].join('\r\n'),{mode:0o600});
  console.log(`Exported ${records.length} enquiries to ${output}`);
} catch(error) {if(error.code==='ENOENT'){console.log('No saved enquiries yet.');}else{throw error;}}
