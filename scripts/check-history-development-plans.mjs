// Canonical commitments only; never execute a developmental frame.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const p='docs/planning/',out=p+'campaign3-history-development-plans-rev1/',sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false,watch:null},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),codec=await server.ssrLoadModule('/src/campaign3/developmentPublicCodecs.ts'),ids=await server.ssrLoadModule('/src/substrate/identity.ts');
 const registry=new c.RecordSchemaRegistry(codec.developmentPublicSupportedSchemas()),decode=s=>c.canonicalDecode(new Uint8Array(Buffer.from(s,'hex')),registry),records=[];
 const spec=[['COMPONENT',1,'scripts/qualify-development-component.mjs','development-component-harness/0.1','All declared seeds0..7 for matched young/mature. Independent learning/formation disables; phase convergence; Step/Ramp midpoint; controlled practice/report/source/eligibility and saturation. Every component prefix and actual successor; no native claim.'],...[1,2,3].map(rev=>['PUBLIC',rev,rev===1?'scripts/qualify-development-public.mjs':`scripts/qualify-development-public-rev${rev}.mjs`,`development-public-harness/0.${rev}`,'Same36 component programs, all668 actual Save132 original-input restores and one successor each; exact rows, source ownership, barriers and reached faults. No full-tail claim.'])];
 for(const [lane,rev,harness,harnessVersion,coupling] of spec){
  const path=p+`DEVELOPMENT_${lane}_PLAN_REV${rev}.json`,v=JSON.parse(fs.readFileSync(path));
  const models=await Promise.all(v.runs.map(r=>ids.restoreModelIdentity(decode(r.modelIdentity)))),runs=await Promise.all(v.runs.map(r=>ids.restoreRunIdentity(decode(r.runIdentity))));
  const comparison=await ids.createComparisonCase(models,runs,c.text(coupling));assert.equal(hex(comparison.canonicalBytes),v.comparisonCase);
  const experiment=await ids.createExperimentIdentity('corpus/0.29.0',v.version,harnessVersion+';sha256='+sha(harness));assert.equal(hex(experiment.canonicalBytes),v.experimentIdentity);
  if(lane==='PUBLIC')for(const [i,r] of v.runs.entries()){
   const model=models[i].value,run=runs[i].value;const raw=x=>{assert.equal(x.kind,'bytes');return hex(x.value);};
   assert.equal(raw(model.fields.get(3n).fields.get(2n)),r.sourceHashes.parameters);assert.equal(raw(model.fields.get(6n).fields.get(2n)),r.sourceHashes.registry);
   assert.equal(raw(run.fields.get(2n)),r.sourceHashes.initial);assert.equal(raw(run.fields.get(3n)),r.sourceHashes.ordered);
  }
  records.push({path,sha256:sha(path),harness:{path:harness,sha256:sha(harness)},coupling,orderedModels:models.length,distinctModels:new Set(v.runs.map(r=>r.modelIdentity)).size,runs:runs.length,comparisonBytes:comparison.canonicalBytes.length});
 }
 const v={status:'FOUR DEVELOPMENTAL PLAN IDENTITY GRAPHS RECONSTRUCTED',records,scope:'Exact experiment/comparison identities and public source-digest fields; no frame execution, historical timing proof or universal gain law.',checkerSha256:sha('scripts/check-history-development-plans.mjs')};
 fs.mkdirSync(out,{recursive:true});const file=out+'canonical-check.json';if(fs.existsSync(file))assert.deepEqual(JSON.parse(fs.readFileSync(file)),v);else fs.writeFileSync(file,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
 console.log(v.status+':36 ordered models/7 distinct and36 runs each. No simulation.');
}finally{await server.close();}
