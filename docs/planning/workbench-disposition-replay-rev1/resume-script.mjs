import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-replay-rev1',parent='docs/planning/workbench-disposition-parity-rev1/receipt.json';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const native=read(parent),planPath='docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json',plan=read(planPath);
const frozen=read(root+'/manifest.json'),sources=frozen.sources;
for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
const interruption=read(root+'/interruption-2026-10-23.json');
assert.equal(interruption.records.length,242);assert.equal(new Set(interruption.records.map(a=>a.path)).size,242);
for(const a of interruption.records){assert.equal(sha(fs.readFileSync(root+'/'+a.path)),a.sha256,a.path);const m=/^program-(\d+)-prefix-(\d+)\.json$/.exec(a.path);assert(m);const index=Number(m[1]),prefix=Number(m[2]),p=plan.runs.find(p=>p.index===index),r=read(root+'/'+a.path);assert(p);assert(prefix>=0&&prefix<=18);assert.equal(r.program,p.law+'/'+p.name);assert.equal(r.prefix,prefix);assert.equal(r.advanced,prefix<18);assert.equal(r.successorPrefix,Math.min(prefix+1,18));assert.equal(r.events,prefix*10);assert.equal(r.modelHash,sha(Buffer.from(p.modelIdentity,'hex')));assert.equal(r.runHash,sha(Buffer.from(p.runIdentity,'hex')));}
assert(!fs.existsSync(root+'/receipt.json'));assert(!fs.existsSync(root+'/resume-start.json'));
fs.writeFileSync(root+'/resume-script.mjs',fs.readFileSync('scripts/resume-workbench-disposition-replay.mjs'),{flag:'wx'});
fs.writeFileSync(root+'/resume-start.json',JSON.stringify({date:'2026-10-23',retained:interruption.records.length,policy:'Retain original verified records. Reconstruct interrupted program through retained prefixes, checking original save hashes. Perform original complete restore/detachment/immediate-successor checks only for missing records. Completed programs are not re-executed.'},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const artifacts=[];let advancing=0,terminal=0;
try{
 const {DispositionWorkbenchRun}=await server.ssrLoadModule('/src/workbench/dispositionAdapter.ts');
 for(const p of plan.runs){
  const program=p.law+'/'+p.name,reference=read(native.results.find(r=>r.program===program).referencePath);
  const existing=Array.from({length:19},(_,prefix)=>root+'/program-'+p.index+'-prefix-'+prefix+'.json');
  if(existing.every(path=>fs.existsSync(path))){for(const path of existing){const r=read(path);assert.equal(r.program,program);assert.equal(r.saveHash,reference.prefixes[r.prefix].saveSha256);assert.equal(r.successorHash,reference.prefixes[r.prefix].nextSha256);artifacts.push({path:path.slice(root.length+1),sha256:sha(fs.readFileSync(path))});r.advanced?advancing++:terminal++;}continue;}
  let run=await DispositionWorkbenchRun.create(program);
  for(let prefix=0;prefix<=18;prefix++){
   const priorPath=root+'/program-'+p.index+'-prefix-'+prefix+'.json';
   if(fs.existsSync(priorPath)){const r=read(priorPath);assert.equal(r.program,program);assert.equal(r.prefix,prefix);assert.equal(run.snapshot().saveHash,r.saveHash);assert.equal(r.saveHash,reference.prefixes[prefix].saveSha256);assert.equal(await run.advance(),r.advanced);assert.equal(run.snapshot().saveHash,r.successorHash);assert.equal(r.successorHash,reference.prefixes[prefix].nextSha256);artifacts.push({path:priorPath.slice(root.length+1),sha256:sha(fs.readFileSync(priorPath))});r.advanced?advancing++:terminal++;continue;}
   const before=run.snapshot(),checkpoint=run.checkpoint();
   assert.equal(before.saveHash,reference.prefixes[prefix].saveSha256);
   assert.equal(checkpoint.prefix,prefix);assert.equal(checkpoint.runHash,sha(Buffer.from(p.runIdentity,'hex')));
   assert.equal(checkpoint.saveHash,sha(Buffer.from(checkpoint.saveHex,'hex')));
   const restored=await DispositionWorkbenchRun.restore(checkpoint);
   assert.deepEqual(restored.checkpoint(),checkpoint);assert.deepEqual(restored.snapshot(),before);
   const detached=restored.snapshot();detached.fields.length=0;detached.timeline.length=0;
   assert.deepEqual(restored.snapshot(),before);
   const advanced=await restored.advance(),after=restored.snapshot();
   assert.equal(advanced,prefix<18);assert.equal(after.prefix,Math.min(prefix+1,18));
   assert.equal(after.saveHash,reference.prefixes[prefix].nextSha256);
   assert.equal(after.saveHash,reference.prefixes[Math.min(prefix+1,18)].saveSha256);
   if(prefix===18){assert.deepEqual(after,before);terminal++;}else advancing++;
   const path=`program-${p.index}-prefix-${prefix}.json`,record={program,prefix,modelHash:before.modelHash,runHash:before.runHash,saveHash:checkpoint.saveHash,saveBytes:checkpoint.saveHex.length/2,stateHash:before.stateHash,projectionHash:before.projectionHash,events:before.timeline.length,advanced,successorHash:after.saveHash,successorPrefix:after.prefix};
   fs.writeFileSync(root+'/'+path,JSON.stringify(record)+'\n',{flag:'wx'});
   artifacts.push({path,sha256:sha(fs.readFileSync(root+'/'+path))});
   run=restored;console.log(`PASS Disposition replay ${p.index+1}/15 prefix ${prefix}/18`);
  }
 }
 assert.equal(artifacts.length,285);assert.equal(advancing,270);assert.equal(terminal,15);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS COMPLETE ORIGINAL DISPOSITION ADAPTER REPLAY',recovery:{retainedRecords:interruption.records.length,scriptSha256:sha(fs.readFileSync(root+'/resume-script.mjs')),policy:read(root+'/resume-start.json').policy},sources,artifacts,counts:{programs:15,prefixes:285,advancing,terminal},scope:'Every original adapter checkpoint restores identical complete snapshot and bytes, preserves detached snapshots, and reproduces the original immediate successor. Terminal no-ops preserve the complete snapshot. Does not qualify browser transport, general constitutional parameters, observer-safe narration or integrated entry.'},null,2)+'\n',{flag:'wx'});
}catch(error){
 fs.writeFileSync(root+'/resume-failure.json',JSON.stringify({error:String(error),artifacts},null,2)+'\n',{flag:'wx'});throw error;
}finally{await server.close();}
