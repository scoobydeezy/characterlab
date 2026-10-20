import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-replay-rev1',parent='docs/planning/workbench-disposition-parity-rev1/receipt.json';
const read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const native=read(parent),planPath='docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json',plan=read(planPath);
assert(!fs.existsSync(root),'Preserve existing evidence; do not restart a live or partial audit');
assert.equal(native.programs,15);assert.equal(native.prefixes,285);
const paths=new Set([...native.sources.map(s=>s.path),parent,planPath,'scripts/check-workbench-disposition-replay.mjs',...native.results.map(r=>r.referencePath)]);
for(const s of native.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256,s.path);
const sources=[...paths].sort().map(path=>{
 const bytes=fs.readFileSync(path),target=root+'/sources/'+path;
 fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});
 return {path,sha256:sha(bytes)};
});
fs.writeFileSync(root+'/manifest.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources,requiredPrograms:15,requiredPrefixes:285,scope:'All original Disposition adapter checkpoints and immediate continuations, including terminal no-ops. No browser-file transport or observer-language claim.'},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
const artifacts=[];let advancing=0,terminal=0;
try{
 const {DispositionWorkbenchRun}=await server.ssrLoadModule('/src/workbench/dispositionAdapter.ts');
 for(const p of plan.runs){
  const program=p.law+'/'+p.name,reference=read(native.results.find(r=>r.program===program).referencePath);
  let run=await DispositionWorkbenchRun.create(program);
  for(let prefix=0;prefix<=18;prefix++){
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
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS COMPLETE ORIGINAL DISPOSITION ADAPTER REPLAY',sources,artifacts,counts:{programs:15,prefixes:285,advancing,terminal},scope:'Every original adapter checkpoint restores identical complete snapshot and bytes, preserves detached snapshots, and reproduces the original immediate successor. Terminal no-ops preserve the complete snapshot. Does not qualify browser transport, general constitutional parameters, observer-safe narration or integrated entry.'},null,2)+'\n',{flag:'wx'});
}catch(error){
 fs.writeFileSync(root+'/failure.json',JSON.stringify({error:String(error),artifacts},null,2)+'\n',{flag:'wx'});throw error;
}finally{await server.close();}
