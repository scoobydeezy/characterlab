import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-parity-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),planPath='docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json',plan=JSON.parse(fs.readFileSync(planPath));assert(!fs.existsSync(root));
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);if(child.endsWith('.ts'))visit(child);else files.add(child.replaceAll('\\','/'));}}
for(const p of ['src/workbench/dispositionAdapter.ts','src/test/workbenchDisposition.test.ts','src/test/workbenchLargeCheckpointHex.test.ts'])visit(p);files.add('scripts/check-workbench-disposition.mjs');
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),target=root+'/sources/'+p;fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});
fs.writeFileSync(root+'/frozen.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',sources,plan:{path:planPath,sha256:sha(fs.readFileSync(planPath))},requiredPrograms:15,requiredPrefixes:285},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[];let prefixes=0;
try{
 const {DispositionWorkbenchRun}=await server.ssrLoadModule('/src/workbench/dispositionAdapter.ts');
 for(const original of plan.runs){
  const referencePath=`docs/planning/DISPOSITION_PUBLIC_RUN_${original.index}_REV1.json`,reference=JSON.parse(fs.readFileSync(referencePath)),program=original.law+'/'+original.name,run=await DispositionWorkbenchRun.create(program),rows=[];
  const constitution=run.snapshot().fields.find(f=>f.root==='1457');
  for(let prefix=0;prefix<=18;prefix++){
   const view=run.snapshot();assert.equal(view.saveHash,reference.prefixes[prefix].saveSha256);assert.equal(view.runHash,sha(Buffer.from(original.runIdentity,'hex')));assert.equal(view.modelHash,sha(Buffer.from(original.modelIdentity,'hex')));assert.equal(view.timeline.length,10*prefix);assert.equal(view.complete,prefix===18);assert.deepEqual(view.fields.find(f=>f.root==='1457'),constitution);
   rows.push({prefix,clock:view.clock,saveHash:view.saveHash,stateHash:view.stateHash,projectionHash:view.projectionHash,events:view.timeline.length,roots:view.fields.map(f=>f.root)});prefixes++;
   if(prefix===18){assert.equal(view.projectionHash,reference.projectionSha256);assert.equal(await run.advance(),false);}else assert.equal(await run.advance(),true);
   console.log(`PASS disposition ${original.index+1}/15 prefix ${prefix}/18`);
  }
  const filename=`run-${original.index}.json`;fs.writeFileSync(root+'/'+filename,JSON.stringify({program,rows},null,2)+'\n',{flag:'wx'});results.push({program,path:filename,sha256:sha(fs.readFileSync(root+'/'+filename)),referencePath,referenceSha256:sha(fs.readFileSync(referencePath))});
 }
 assert.equal(prefixes,285);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS ORIGINAL DISPOSITION NATIVE PREFIX PARITY',sources,programs:15,prefixes,results,scope:'All15 original programs/285 exact native saves, model/run identities, ten-event stages, immutable constitutional root and terminal mechanism projection. Mechanism projection is not subjective self-knowledge or qualified narration. Full every-prefix adapter restore, worker/UI, language, comparisons and integrated entry remain separate.'},null,2)+'\n',{flag:'wx'});console.log('PASS DISPOSITION15/285');
}finally{await server.close();}
