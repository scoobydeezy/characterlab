import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'DEVELOPMENT_COMPONENT_PLAN_REV1.json',read=f=>JSON.parse(fs.readFileSync(f)),hash=b=>createHash('sha256').update(b).digest('hex'),sha=f=>hash(fs.readFileSync(f)),hex=b=>Buffer.from(b).toString('hex'),write=(f,x)=>fs.writeFileSync(f,JSON.stringify(x,null,2)+'\n',{flag:'wx'}),server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const m=await server.ssrLoadModule('/src/campaign3/developmentComponent.ts'),ident=await server.ssrLoadModule('/src/campaign3/developmentIdentity.ts'),fx=await server.ssrLoadModule('/src/test/developmentRoster.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),roster=fx.developmentRoster();
 if(process.argv.includes('--freeze')){
  const graph=new Set();function visit(file){file=file.replaceAll('\\','/');if(graph.has(file))return;graph.add(file);if(!file.endsWith('.ts'))return;for(const m of fs.readFileSync(file,'utf8').matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const base=path.resolve(path.dirname(file),m[1].split('?')[0]),found=[base,base+'.ts',base+'.json',path.join(base,'index.ts')].find(x=>fs.existsSync(x)&&fs.statSync(x).isFile());assert(found,file);visit(path.relative('.',found));}}
  ['src/campaign3/developmentIdentity.ts','src/test/developmentRoster.ts','src/test/developmentComponent.test.ts'].forEach(visit);graph.add('scripts/qualify-development-component.mjs');graph.add('docs/formal/DEVELOPMENT_COMPONENT_CONTRACT.md');const runs=[],models=[],runIds=[];
  for(const row of roster){const x=await ident.developmentIdentities(row.profile,row.frames);models.push(x.modelIdentity);runIds.push(x.runIdentity);runs.push({...row,modelIdentity:hex(x.modelIdentity.canonicalBytes),runIdentity:hex(x.runIdentity.canonicalBytes)});}
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',m.DEVELOPMENT_VERSION,'development-component-harness/0.1;sha256='+sha('scripts/qualify-development-component.mjs')),comparison=await ids.createComparisonCase(models,runIds,c.text('All declared seeds0..7 for matched young/mature. Independent learning/formation disables; phase convergence; Step/Ramp midpoint; controlled practice/report/source/eligibility and saturation. Every component prefix and actual successor; no native claim.'));
  write(planPath,{status:'FROZEN BEFORE QUALIFICATION',version:m.DEVELOPMENT_VERSION,runs,experimentIdentity:hex(experiment.canonicalBytes),comparisonCase:hex(comparison.canonicalBytes),files:[...graph].sort().map(path=>({path,sha256:sha(path)}))});console.log('Frozen '+runs.length+' cases.');
 }else{
  const plan=read(planPath);for(const f of plan.files)assert.equal(sha(f.path),f.sha256,f.path);assert.deepEqual(plan.runs.map(({modelIdentity,runIdentity,...r})=>r),roster);
  const partArg=process.argv.find(x=>x.startsWith("--part=")),part=partArg?Number(partArg.split("=")[1]):null;assert(part===null||Number.isInteger(part)&&part>=0&&part<4);
  for(const [index,row]of roster.entries()){
   if(part!==null&&index%4!==part)continue;
   const out=p+'DEVELOPMENT_COMPONENT_RUN_'+index+'_REV1.json';if(fs.existsSync(out)){const old=read(out);assert.equal(old.status,'PASS');assert.equal(old.planSha256,sha(planPath));continue;}
   const identity=await ident.developmentIdentities(row.profile,row.frames);assert.equal(hex(identity.runIdentity.canonicalBytes),plan.runs[index].runIdentity);const run=m.createDevelopmentRun(row.profile,row.frames),prefixes=[];
   for(let at=0;at<=row.frames.length;at++){const save=run.save(),restored=await m.restoreDevelopmentRun(row.profile,row.frames,save);assert.deepEqual(restored.save(),save);const advanced=await run.step();assert.equal(await restored.step(),advanced);assert.deepEqual(restored.save(),run.save());prefixes.push({at,save:hash(save),next:hash(run.save()),advanced});}
   write(out,{status:'PASS',planSha256:sha(planPath),index,name:row.name,modelIdentity:plan.runs[index].modelIdentity,runIdentity:plan.runs[index].runIdentity,prefixes,rows:run.rows()});console.log('PASS '+index+' '+row.name+' '+prefixes.length+' prefixes');
  }
 }
}finally{await server.close();}
