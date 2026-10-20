import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createGunzip} from 'node:zlib';import {Transform,Writable} from 'node:stream';import {pipeline} from 'node:stream/promises';
const root='docs/planning/workbench-disposition-snapshot-sizes-rev1',prior='docs/planning/workbench-disposition-comparison-rev1',script='scripts/check-workbench-disposition-snapshot-sizes.mjs',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const source=fs.readFileSync(script),receiptBytes=fs.readFileSync(prior+'/receipt.json'),artifacts=new Map(JSON.parse(receiptBytes).artifacts.map(a=>[a.path,a.sha256]));
fs.writeFileSync(root+'/verifier.mjs',source,{flag:'wx'});fs.writeFileSync(root+'/freeze.json',JSON.stringify({verifier:{path:script,sha256:sha(source)},parent:{path:prior+'/receipt.json',sha256:sha(receiptBytes)}},null,2)+'\n',{flag:'wx'});
const rows=[];for(let program=0;program<15;program++){
 for(let prefix=0;prefix<=18;prefix++){
  const name=`snapshot-${program}-${prefix}.json.gz`,compressed=createHash('sha256'),decoded=createHash('sha256');let compressedBytes=0,jsonBytes=0;
  await pipeline(fs.createReadStream(prior+'/'+name),new Transform({transform(chunk,encoding,callback){compressed.update(chunk);compressedBytes+=chunk.length;callback(null,chunk);}}),createGunzip(),new Writable({write(chunk,encoding,callback){decoded.update(chunk);jsonBytes+=chunk.length;callback();}}));
  const hash=compressed.digest('hex');assert.equal(hash,artifacts.get(name),name);rows.push({program,prefix,path:prior+'/'+name,sha256:hash,compressedBytes,jsonBytes,jsonSha256:decoded.digest('hex')});
 }
 console.log(`PASS streamed snapshot sizes ${program+1}/15`);
}
assert.equal(rows.length,285);assert.equal(sha(fs.readFileSync(script)),sha(source));assert.equal(sha(fs.readFileSync(prior+'/receipt.json')),sha(receiptBytes));
const largest=rows.reduce((a,b)=>a.jsonBytes>b.jsonBytes?a:b),totalJsonBytes=rows.reduce((n,r)=>n+r.jsonBytes,0);
fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS AUTHENTICATED SNAPSHOT BYTE CENSUS',snapshots:rows.length,totalJsonBytes,largest,rows,scope:'All285 original archived diagnostic snapshots authenticated before acceptance. Full gzip streams decompressed and hashed incrementally; no whole-snapshot string or JSON object allocated. Exact UTF-8 serialized bytes are not JS string length, parsed object size, live heap, browser memory, native save bytes or a UI resource guarantee. No diagnostic fields, events or original evidence omitted.'},null,2)+'\n',{flag:'wx'});console.log(`PASS ${rows.length} snapshots; largest ${largest.jsonBytes} bytes at program${largest.program}/prefix${largest.prefix}`);
