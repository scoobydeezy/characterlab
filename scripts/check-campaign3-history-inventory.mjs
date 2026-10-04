/** Independent source-location and identity verifier; no scientific disposition inference. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import readline from 'node:readline';
const dir='docs/planning/campaign3-history-universe-rev1/',read=p=>JSON.parse(fs.readFileSync(p,'utf8')),hash=b=>createHash('sha256').update(b).digest('hex');
const manifest=read(dir+'manifest.json'),extraction=read(dir+'extraction.json'),entries=new Map(manifest.entries.map(e=>[e.path,e]));
assert.equal(manifest.registryUsedForSelection,false);assert.equal(extraction.registryUsed,false);assert(!entries.has('docs/planning/RESEARCH_OBLIGATIONS.json'));assert.equal(entries.size,manifest.entries.length);
for(const a of [...manifest.method,...extraction.artifacts])assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);
const pointer=(obj,path)=>path?path.slice(1).split('/').reduce((o,k)=>o[k.replaceAll('~1','/').replaceAll('~0','~')],obj):obj;
const validate=(u,e,actual)=>{assert.equal(u.source,e.path);assert.equal(u.sourceSha256,e.sha256);assert.equal(u.text,actual);assert.equal(u.id,hash(Buffer.from(JSON.stringify([u.source,u.sourceSha256,u.location,u.text]))));assert.equal(u.review,'UNREVIEWED');};
let source,entry,body,lines,obj,count=0,marked=0,first;const ids=new Set(),counts=new Map();
for await(const line of readline.createInterface({input:fs.createReadStream(dir+'units.jsonl'),crlfDelay:Infinity})){
 const u=JSON.parse(line);entry=entries.get(u.source);assert(entry,u.source);
 if(source!==u.source){source=u.source;body=fs.readFileSync(entry.snapshot??entry.path);assert.equal(hash(body),entry.sha256,source);const text=body.toString('utf8').replace(/^\uFEFF/,'');if(entry.kind==='Markdown'){lines=(text.match(/[^\n\r\v\f\x1c-\x1e\u0085\u2028\u2029]*(?:\r\n|[\n\r\v\f\x1c-\x1e\u0085\u2028\u2029]|$)/g)??[]).filter(x=>x.length);obj=undefined;}else{obj=JSON.parse(text);lines=undefined;}}
 const actual=u.kind==='markdownParagraph'?lines.slice(u.location.startLine-1,u.location.endLine).join(''):pointer(obj,u.location.pointer);
 validate(u,entry,actual);assert(!ids.has(u.id),'duplicate occurrence');ids.add(u.id);count++;marked+=Number(u.markers.length>0);counts.set(u.source,(counts.get(u.source)??0)+1);if(!first)first={u,entry,actual};
}
assert.equal(count,extraction.counts.units);assert.equal(marked,extraction.counts.markedUnits);
let occurrenceCount=0;for await(const line of readline.createInterface({input:fs.createReadStream(dir+'occurrences.jsonl'),crlfDelay:Infinity})){const u=JSON.parse(line);assert(ids.has(u.id));assert(u.markers.length>0);occurrenceCount++;}assert.equal(occurrenceCount,marked);
const references=read(dir+'references.json');for(const r of references.references){assert(entries.has(r.source));assert(Number.isInteger(r.line)&&r.line>0);for(const t of r.targets)assert(entries.has(t)||manifest.excluded.some(e=>e.path===t));}
// Fail-closed fault tests on real source-located units, without changing preserved files.
let faults=0;for(const patch of [{source:'missing.md'},{sourceSha256:'0'.repeat(64)},{text:first.u.text+'changed'},{id:'0'.repeat(64)},{review:'RESOLVED'}]){assert.throws(()=>validate({...first.u,...patch},first.entry,first.actual));faults++;}
assert.throws(()=>assert(!ids.has(first.u.id),'duplicate occurrence'));faults++;assert.throws(()=>assert.equal(count-1,extraction.counts.units));faults++;assert.throws(()=>assert.equal(hash(Buffer.from('altered artifact')),manifest.entries[0].sha256));faults++;
const result={status:'PASS; INVENTORY ONLY, SEMANTIC RECONCILIATION OPEN',files:entries.size,units:count,markedUnits:marked,unmarkedUnits:count-marked,filesWithUnits:counts.size,referenceCounts:references.counts,faultChecks:faults,registryUsed:false,manifestSha256:hash(fs.readFileSync(dir+'manifest.json')),extractionSha256:hash(fs.readFileSync(dir+'extraction.json')),checkerSha256:hash(fs.readFileSync('scripts/check-campaign3-history-inventory.mjs'))};
const output='docs/planning/CAMPAIGN3_HISTORY_INVENTORY_CHECK_REV1.json';if(process.argv.includes('--write'))fs.writeFileSync(output,JSON.stringify(result,null,2)+'\n',{flag:'wx'});else assert.deepEqual(read(output),result);
console.log(JSON.stringify(result));
