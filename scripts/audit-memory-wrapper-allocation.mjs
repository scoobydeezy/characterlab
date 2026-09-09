import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url),prefix='docs/formal/MEMORY_WRAPPER_';
const raw=p=>fs.readFileSync(new URL(p,root)),read=p=>raw(p).toString('utf8'),hash=p=>crypto.createHash('sha256').update(raw(p)).digest('hex');
const t=JSON.parse(read(prefix+'ALLOCATION_TABLE.json')),md=read(prefix+'ALLOCATION_REVIEW.md'),checks=[];
function eq(name,a,b){assert.deepEqual(a,b,name);checks.push({name,status:'PASS'});}
eq('frozen status',t.status,'PERMANENT AND FROZEN');eq('frozen version',t.version,'memory-wrapper-allocation/0.1-candidate');
eq('Markdown status',md.includes('**Status: PERMANENT AND FROZEN.**'),true);
eq('accepted shape',read(t.authority).includes('**SHAPE ACCEPTED.'),true);
eq('accepted packaging',read('docs/planning/CAMPAIGN2_MEASUREMENT_MEMORY_PACKAGING.md').includes('**WHOLE PACKAGING SHAPE ACCEPTED.'),true);
eq('exact IDs',t.records.map(r=>r.typeId),[356,357,358]);
eq('names',t.records.map(r=>r.name),['MemoryV04TransitionSeamContract','MemoryFormationTransitionSeamContract','MemoryRecallTransitionSeamContract']);
const layouts=[['Registration','FieldRequirements','FieldPathRequirements','EpisodeReadRequirements'],['Registration','FieldPathRequirements'],['Registration','FieldRequirements','EpisodeReadRequirements']];
const types=[['272/1','set<266/1>','set<343/1>','set<349/1>'],['347/1','set<343/1>'],['353/1','set<266/1>','set<349/1>']];
const oldRecords=new Map();
for(const p of t.preservedSources){
 eq('preserved '+p.path,hash(p.path),p.sha256);
 if(p.path.endsWith('_ALLOCATION_TABLE.json'))for(const r of JSON.parse(read(p.path)).records??[])oldRecords.set(r.typeId,r);
}
eq('prior record frontier',Math.max(...oldRecords.keys()),355);
for(const [i,r]of t.records.entries()){
 eq(r.name+' available',oldRecords.has(r.typeId),false);eq(r.name+' schema version',r.schemaVersion,1);
 eq(r.name+' fields',r.fields.map(f=>f.name),layouts[i]);eq(r.name+' types',r.fields.map(f=>f.type),types[i]);
 eq(r.name+' required local IDs',r.fields.map(f=>[f.id,f.required]),layouts[i].map((_,j)=>[j+1,true]));
 eq(r.name+' accepted inventory',read(t.authority).includes(r.name),true);
 eq(r.name+' Markdown parity',md.includes(`| ${r.typeId} | ${r.schemaVersion} | ${r.name} | ${r.fields.map(f=>`${f.id} ${f.name}:${f.type}`).join('; ')} |`),true);
 for(const f of r.fields){
  const match=/^(?:set<)?(\d+)\/(\d+)>?$/.exec(f.type);
  eq(r.name+'.'+f.name+' exact record-valued grammar',match!==null,true);
  const prior=oldRecords.get(Number(match[1]));eq(r.name+'.'+f.name+' existing target',!!prior,true);
  eq(r.name+'.'+f.name+' target schema',prior.schemaVersion,Number(match[2]));
 }
}
eq('nine fields',t.records.reduce((n,r)=>n+r.fields.length,0),9);
for(const k of ['namespaces','members','roles','occurrenceIdentities','unionVariants','finiteValues'])eq('zero '+k,t[k],[]);
eq('static binding invariant',t.staticBindings,'profile-fixed empty');
eq('MEM-PACK-F external injection explicit',read(t.authority).includes('any nonempty or externally injected static binding'),true);
eq('seven frozen packaging vectors',(read(t.authority).match(/^\| MEM-PACK-[A-G] \|/gm)||[]).length,7);
eq('sixteen frozen runtime vectors',(read('docs/planning/CAMPAIGN2_MEASUREMENT_MEMORY_DRAFT.md').match(/^\| MEMR-[A-P] \|/gm)||[]).length,16);
eq('old memory allocation frozen',JSON.parse(read('docs/formal/MEASUREMENT_MEMORY_ALLOCATION_TABLE.json')).status,'PERMANENT AND FROZEN');
eq('no generic value field',t.records.every(r=>r.fields.every(f=>!f.type.includes('CanonicalValue'))),true);
fs.writeFileSync(new URL(prefix+'ALLOCATION_AUDIT.json',root),JSON.stringify({status:'PASS',scope:'allocation consistency only; allocation frozen; no packaging/runtime controls passed',tableSha256:hash(prefix+'ALLOCATION_TABLE.json'),checks},null,2)+'\n');
console.log(`${checks.length} allocation checks PASS; allocation frozen.`);
