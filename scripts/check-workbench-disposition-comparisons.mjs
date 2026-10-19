import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gzipSync,gunzipSync} from 'node:zlib';import {createServer} from 'vite';
const smoke=process.argv.includes('--smoke'),root=`docs/planning/workbench-disposition-comparison-${smoke?'smoke-':''}rev1`,sha=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p));assert(!fs.existsSync(root));
const planPath='docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json',plan=read(planPath),roster=smoke?plan.runs.filter(r=>[0,1,7,13,14].includes(r.index)):plan.runs,horizon=smoke?1:18;
const files=new Set();function visit(p){p=p.replaceAll('\\','/');if(files.has(p))return;files.add(p);for(const m of fs.readFileSync(p,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const stem=path.join(path.dirname(p),m[1].split('?')[0]),child=[stem,stem+'.ts',path.join(stem,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(child,stem);if(child.endsWith('.ts'))visit(child);else files.add(child.replaceAll('\\','/'));}}
for(const p of ['src/workbench/dispositionAdapter.ts','src/workbench/dispositionComparison.ts','src/test/workbenchDispositionComparison.test.ts'])visit(p);files.add('scripts/check-workbench-disposition-comparisons.mjs');for(const r of roster)files.add(`docs/planning/DISPOSITION_PUBLIC_RUN_${r.index}_REV1.json`);
const sources=[...files].sort().map(p=>{const bytes=fs.readFileSync(p),target=root+'/sources/'+p;fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,bytes,{flag:'wx'});return {path:p,sha256:sha(bytes)};});
fs.writeFileSync(root+'/frozen.json',JSON.stringify({status:'FROZEN BEFORE EXECUTION',mode:smoke?'SMOKE':'FULL',sources,programs:roster.length,horizon,requiredPrefixes:roster.length*(horizon+1),requiredReports:smoke?10:570},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),artifacts=[];let prefixes=0,reports=0;
function save(name,value){const bytes=gzipSync(JSON.stringify(value),{level:9});assert(bytes.length<50_000_000);fs.writeFileSync(root+'/'+name,bytes,{flag:'wx'});artifacts.push({path:name,sha256:sha(bytes)});}
const snapshotName=(index,prefix)=>`snapshot-${index}-${prefix}.json.gz`,snapshots=new Map();
try{
 const {DispositionWorkbenchRun}=await server.ssrLoadModule('/src/workbench/dispositionAdapter.ts'),{DISPOSITION_CONTRASTS,compareDisposition}=await server.ssrLoadModule('/src/workbench/dispositionComparison.ts');
 const names=new Set(roster.map(r=>r.law+'/'+r.name)),contrasts=DISPOSITION_CONTRASTS.filter(c=>names.has(c.a)&&names.has(c.b));assert.equal(contrasts.length,smoke?5:30);
 for(const original of roster){
  const program=original.law+'/'+original.name,reference=read(`docs/planning/DISPOSITION_PUBLIC_RUN_${original.index}_REV1.json`),run=await DispositionWorkbenchRun.create(program);snapshots.set(program,original.index);
  for(let prefix=0;prefix<=horizon;prefix++){
   const view=run.snapshot();assert.equal(view.saveHash,reference.prefixes[prefix].saveSha256);assert.equal(view.modelHash,sha(Buffer.from(original.modelIdentity,'hex')));assert.equal(view.runHash,sha(Buffer.from(original.runIdentity,'hex')));save(snapshotName(original.index,prefix),view);prefixes++;
   for(const contrast of contrasts.filter(c=>c.b===program&&snapshots.has(c.a))){
    const a=JSON.parse(gunzipSync(fs.readFileSync(root+'/'+snapshotName(snapshots.get(contrast.a),prefix)))),report=await compareDisposition(contrast.id,a,view);assert(report.aligned);assert.equal(report.a.saveHash,a.saveHash);assert.equal(report.b.saveHash,view.saveHash);assert.equal(report.mechanismProjectionEqual,a.mechanismProjection===view.mechanismProjection);
    const left=new Map(a.fields.map(f=>[f.path,f.exact])),right=new Map(view.fields.map(f=>[f.path,f.exact]));assert.equal(report.fields.length,new Set([...left.keys(),...right.keys()]).size);for(const f of report.fields){assert.equal(f.a,left.get(f.path)??null);assert.equal(f.b,right.get(f.path)??null);assert.equal(f.equal,left.get(f.path)===right.get(f.path));}
    save(`comparison-${contrast.id.replaceAll('/','-')}-${prefix}.json.gz`,report);reports++;
   }
   console.log(`PASS comparison source ${original.index} prefix ${prefix}/${horizon}; ${reports} reports`);if(prefix<horizon)assert.equal(await run.advance(),true);
  }
 }
 assert.equal(prefixes,roster.length*(horizon+1));assert.equal(reports,contrasts.length*(horizon+1));for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:smoke?'PASS COMPARISON CHECKER SMOKE':'PASS FULL ORIGINAL DISPOSITION COMPARISON PREFIXES',sources,programs:roster.length,prefixes,contrasts:contrasts.length,reports,artifacts,scope:'Original native saves and exact committed snapshots retained; every selected declared contrast at every selected prefix. Mechanism-side projection equality remains distinct from character knowledge. No all-prefix restore, browser coverage, qualified narration, general personality, causal necessity or integrated-entry claim.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
