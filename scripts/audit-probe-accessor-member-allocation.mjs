import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),prefix='docs/formal/';
const read=p=>fs.readFileSync(new URL(p,root));
const hash=p=>crypto.createHash('sha256').update(read(p)).digest('hex');
const path=prefix+'PROBE_ACCESSOR_MEMBER_ALLOCATION_TABLE.json',mdPath=prefix+'PROBE_ACCESSOR_MEMBER_ALLOCATION_REVIEW.md';
const t=JSON.parse(read(path)),md=read(mdPath).toString(),checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
eq('symbolic acceptance',read(t.authority).toString().includes('**SYMBOLICALLY ACCEPTED. Successor trace profile and model required.**'),true);
eq('frozen lifecycle',t.status,'PERMANENT AND FROZEN');eq('version',t.version,'probe-accessor-member-allocation/0.1-candidate');
eq('one exact member',t.members,[{namespace:1028,payload:'accessor/regulatory-diagnostic-displacement-prior'}]);
eq('Markdown member',md.includes('| 1028 | accessor/regulatory-diagnostic-displacement-prior |'),true);
eq('Markdown lifecycle',md.includes(`**Status: ${t.status}.**`)&&md.includes('`'+t.version+'`'),true);
for(const field of ['namespaces','records','roles','unionVariants','stateRoots','saveFields'])eq('no '+field,t[field],[]);
const expected=fs.readdirSync(new URL(prefix,root)).filter(n=>!n.startsWith('PROBE_ACCESSOR_MEMBER_')&&/ALLOCATION.*\.(json|md)$/.test(n)).map(n=>prefix+n).sort();
eq('complete prior allocation coverage',t.preservedSources.map(s=>s.path).sort(),expected);
for(const s of t.preservedSources){eq('preserved '+s.path,hash(s.path),s.sha256);if(s.path.endsWith('ALLOCATION_TABLE.json')){const prior=JSON.parse(read(s.path));eq('new member absent '+s.path,(prior.members??[]).some(m=>m.namespace===1028&&(m.payload??m.name)===t.members[0].payload),false);}}
const base=JSON.parse(read(prefix+'CAMPAIGN2_ALLOCATION_TABLE.json'));
eq('family home',base.namespaces.find(n=>n.namespace===1028)?.name,'ProjectionAccessorId');
eq('prior 1028 members',base.members.filter(m=>m.namespace===1028).map(m=>m.payload).sort(),['ResolvedCharacterSubject','accessor/adaptation-gate-prior','accessor/adaptation-target-prior']);
const report={status:'PASS',scope:'member allocation consistency only; allocation frozen; successor model freeze pending',checkCount:checks.length,checks,tableSha256:hash(path),markdownSha256:hash(mdPath)};
fs.writeFileSync(new URL(prefix+'PROBE_ACCESSOR_MEMBER_ALLOCATION_AUDIT.json',root),JSON.stringify(report,null,2)+'\n');
console.log(`${checks.length} checks PASS; no runtime verdict.`);
