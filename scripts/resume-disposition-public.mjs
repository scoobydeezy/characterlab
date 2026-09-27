// Recovery packaging only: same frozen graph/roster and original qualification logic.
// Use after the original workers have stopped; completed receipts are verified and skipped.
if(process.argv.includes('--freeze'))throw Error('Use original qualifier for a new frozen plan');
import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',planFile=p+'DISPOSITION_PUBLIC_PLAN_REV1.json',sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex'),write=(p,v)=>fs.writeFileSync(p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
const fx=await server.ssrLoadModule('/src/test/dispositionPublicFixtures.ts'),factory=await server.ssrLoadModule('/src/campaign3/dispositionPublicFactory.ts'),codec=await server.ssrLoadModule('/src/campaign3/dispositionPublicCodecs.ts'),d=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
if(process.argv.includes('--freeze')){
 const graph=new Set();function visit(f){f=f.replaceAll('\\','/');if(graph.has(f))return;graph.add(f);if(!f.endsWith('.ts'))return;for(const m of fs.readFileSync(f,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const base=path.resolve(path.dirname(f),m[1].split('?')[0]),found=[base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(found);visit(path.relative('.',found));}}
 ['src/campaign3/dispositionPublicFactory.ts','src/test/dispositionPublicFixtures.ts','src/test/dispositionPublic.test.ts'].forEach(visit);['scripts/qualify-disposition-public.mjs','docs/formal/DISPOSITION_PUBLIC_CONTRACT.md'].forEach(f=>graph.add(f));
 const runs=[];for(const [index,row]of fx.dispositionRoster.entries()){const c=fx.nativeCase(row),run=await fx.nativeRun(c);runs.push({...row,index,modelIdentity:hex(run.modelIdentity()),runIdentity:hex(run.runIdentity()),inputsSha256:sha(c.orderedInputs),prefixes:Array.from({length:19},(_,i)=>i)});}
 write(planFile,{status:'FROZEN BEFORE QUALIFICATION',version:'disposition-public/0.1-candidate',models:new Set(runs.map(r=>r.modelIdentity)).size,runs,artifacts:[...graph].sort().map(path=>({path,sha256:sha(fs.readFileSync(path))}))});console.log('Frozen9 models/15 runs/285 native prefixes');
}else{
 const plan=JSON.parse(fs.readFileSync(planFile));for(const a of plan.artifacts)assert.equal(sha(fs.readFileSync(a.path)),a.sha256,a.path);
 const part=Number(process.argv.find(a=>a.startsWith('--part='))?.split('=')[1]??0);assert(part>=0&&part<3);
 for(const row of plan.runs.filter(r=>r.index%3===part)){
  const out=p+'DISPOSITION_PUBLIC_RUN_'+row.index+'_REV1.json';if(fs.existsSync(out)){const done=JSON.parse(fs.readFileSync(out));assert.equal(done.status,'PASS');assert.equal(done.planSha256,sha(fs.readFileSync(planFile)));assert.equal(done.runIdentity,row.runIdentity);assert.equal(done.modelIdentity,row.modelIdentity);assert.deepEqual(done.prefixes.map(p=>p.at),row.prefixes);console.log('Verified completed case '+row.index);continue;}const c=fx.nativeCase(row),run=await fx.nativeRun(c),saves=[],hashes=[];
  assert.equal(hex(run.modelIdentity()),row.modelIdentity);assert.equal(hex(run.runIdentity()),row.runIdentity);assert.equal(sha(c.orderedInputs),row.inputsSha256);
  // Persist temporary canonical bytes to avoid retaining nineteen large native saves.
  const dir=p+'disposition-public-working-'+row.index;fs.mkdirSync(dir,{recursive:true});
  for(let at=0;at<19;at++){const bytes=run.save();fs.writeFileSync(dir+'/'+at+'.bin',bytes);hashes.push(sha(bytes));if(at<18)assert(await run.settleNextInstant());}
  assert.equal(await run.settleNextInstant(),false);const final=run.save(),rows=fx.nativeRows(fx.saveOutputs(final),c.frames),old=JSON.parse(fs.readFileSync(p+'DISPOSITION_RUN_'+row.index+'_REV2.json')).rows;
  for(let i=0;i<18;i++){const {addresses,...expected}=old[i];if(!c.frames[i].active){expected.state.constitution=null;expected.state.effectiveBefore=null;}assert.deepEqual(rows[i],expected,'complete component correspondence');}
  assert.deepEqual(d.dataItems(d.dataField(codec.parseDispositionSave(final),10n),'list').map(v=>v.value),old.flatMap(r=>r.addresses));
  const projectionSha256=sha(run.characterProjection());
  for(const at of row.prefixes){const saved=new Uint8Array(fs.readFileSync(dir+'/'+at+'.bin')),restored=await factory.restoreDispositionPublicRun(c.source,fx.restoreInput(c,saved));assert.equal(sha(restored.save()),hashes[at]);assert.equal(await restored.settleNextInstant(),at<18);assert.equal(sha(restored.save()),hashes[Math.min(at+1,18)]);saves.push({at,saveSha256:hashes[at],nextSha256:hashes[Math.min(at+1,18)]});console.log(row.index+': prefix '+at+'/18');}
  write(out,{status:'PASS',planSha256:sha(fs.readFileSync(planFile)),...row,prefixes:saves,rows,projectionSha256,traceCount:d.dataItems(d.dataField(codec.parseDispositionSave(final),11n),'list').length});
  // Only exact paths created by this worker, all direct files under this case directory.
  for(let at=0;at<19;at++)fs.unlinkSync(dir+'/'+at+'.bin');fs.rmdirSync(dir);console.log('PASS native case '+row.index);
 }
}
}finally{await server.close();}
