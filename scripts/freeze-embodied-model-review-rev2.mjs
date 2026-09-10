// Independent on-disk cohort reconciliation before exact model commitment freeze.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const reviewed='docs/planning/campaign3-embodied-model-review-rev2',folder='docs/planning/campaign3-embodied-model-rev2';assert(!fs.existsSync(folder));
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const report=JSON.parse(fs.readFileSync(reviewed+'/REVIEW_MANIFEST.json'));for(const f of [...report.artifacts,...report.sources])assert.deepEqual(fp(f.path),f);
const bytes=p=>Uint8Array.from(Buffer.from(fs.readFileSync(p,'utf8').trim(),'hex')),hex=b=>Buffer.from(b).toString('hex');
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const codec=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts'),{compileEmbodiedModel}=await server.ssrLoadModule('/src/campaign3/embodiedModel.ts');
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{commitManifest,createRunIdentity}=await server.ssrLoadModule('/src/substrate/identity.ts');
 const models=new Map(),sources=new Map(),decode=codec.decodeEmbodied,key=v=>hex(c.canonicalEncode(v));
 for(const row of report.models){const source={...report.versions,...Object.fromEntries(['content','registry','parameters'].map(f=>[f,bytes(`${reviewed}/${row.name}/${f}.cenc.hex`)]))};const model=await compileEmbodiedModel(source);assert.equal(hex(model.modelIdentity.digest),row.modelDigest);assert.deepEqual(model.modelIdentity.canonicalBytes,bytes(`${reviewed}/${row.name}/model-identity.cenc.hex`));models.set(row.name,model);sources.set(row.name,source);}
 const baseline=sources.get('baseline'),baseSlots=decode(baseline.registry).items;
 const target={slower:['definition/embodied-reserve-parameters',3,1,2],coarser:['definition/embodied-level-channel',6,20,1],denied:['definition/embodied-level-channel',8,false],unavailable:['definition/embodied-level-channel',7,false],overflow:['definition/embodied-delivery-60',4,64,1]};
 const rows=(slots,name)=>slots[0].items.find(e=>e.schema.typeId===171n&&e.fields.get(1n).payload.value===name);
 for(const [name,[entry,field,n,d]] of Object.entries(target)){
  const source=sources.get(name),slots=decode(source.registry).items;assert.deepEqual(source.content,baseline.content);assert.deepEqual(source.parameters,baseline.parameters);
  const row=rows(slots,entry),baseRow=rows(baseSlots,entry),value=row.fields.get(4n).fields.get(BigInt(field));assert.equal(key(value),key(typeof n==='boolean'?n:c.rational(n,d)));
  const correctedDefinition=c.record(row.fields.get(4n).schema,new Map([...row.fields.get(4n).fields].map(([k,v])=>[k,k===BigInt(field)?baseRow.fields.get(4n).fields.get(k):v])));
  const correctedRow=c.record(row.schema,new Map([...row.fields].map(([k,v])=>[k,k===4n?correctedDefinition:v])));
  const corrected=c.list(slots.map((s,i)=>i===0?c.set(s.items.map(e=>e===row?correctedRow:e)):s));assert.equal(key(corrected),key(decode(baseline.registry)),name+' changes exactly its declared operand');
 }
 assert.deepEqual(sources.get('work7').registry,baseline.registry);assert.deepEqual(sources.get('work7').content,baseline.content);assert.equal(decode(sources.get('work7').parameters).items[0].fields.get(1n).value,7n);
 const seed=new Uint8Array(32),orderedBaseline=bytes(`${reviewed}/runs/baseline/ordered-inputs.cenc.hex`),runs=[];
 for(const row of report.runs){
  const initial=decode(bytes(`${reviewed}/runs/${row.name}/initial-state.cenc.hex`)),orderedBytes=bytes(`${reviewed}/runs/${row.name}/ordered-inputs.cenc.hex`);assert.deepEqual(orderedBytes,orderedBaseline);assert.equal(row.runSeedHex,hex(seed));
  const run=await createRunIdentity({modelIdentity:models.get(row.model).modelIdentity,initialState:await commitManifest(initial),orderedInputSequence:await commitManifest(decode(orderedBytes)),runSeed:seed});assert.equal(hex(run.digest),row.runDigest);assert.deepEqual(run.canonicalBytes,bytes(`${reviewed}/runs/${row.name}/run-identity.cenc.hex`));runs.push(row);
 }
 const inputs=decode(orderedBaseline).items;assert.equal(inputs.length,9);assert.deepEqual(inputs.map(e=>Number(e.items[3].schema.typeId)),[459,459,478,459,459,478,478,459,459]);
 assert.deepEqual(inputs.map(e=>[Number(e.items[0].value),Number(e.items[1].value)]),[[10,10],[40,10],[40,110],[41,10],[75,10],[75,110],[75,110],[76,10],[180,10]]);
 const frozen=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json'));for(const f of frozen.checks.filter(f=>!['src/substrate/scheduler.ts','src/campaign2/requiredProjection.ts'].includes(f.path)))assert.deepEqual(fp(f.path),{path:f.path,sha256:f.sha256});
 for(const f of report.artifacts){const suffix=f.path.slice(reviewed.length+1),dest=folder+'/'+suffix;fs.mkdirSync(dest.slice(0,dest.lastIndexOf('/')),{recursive:true});fs.copyFileSync(f.path,dest);assert.equal(fp(dest).sha256,f.sha256);}
 const result={status:'EXACT EMB MODEL/RUN COHORT ACCEPTED AND FROZEN; RUNTIME UNQUALIFIED',acceptance:'Separate primary-agent on-disk review under user autonomous-work authorization',versions:report.versions,models:report.models,runs,modelDigest:report.models[0].modelDigest,reviewedManifest:fp(reviewed+'/REVIEW_MANIFEST.json'),checks:['All seven on-disk model identities recomputed through actual declaration compiler','Five semantic model variants differ by exactly their named single registry operand','work7 differs only by committed work limit','All seven run identities recomputed; common exact zero32-byte seed and identical inputs','Actual source459 and delivery478 exact timeline verified','All review artifact copies byte-identical and all prior fingerprints except two explicitly reviewed source changes preserved'],artifacts:report.artifacts.map(f=>fp(folder+f.path.slice(reviewed.length))),script:fp('scripts/freeze-embodied-model-review-rev2.mjs'),preservedChecks:frozen.checks.filter(f=>!['src/substrate/scheduler.ts','src/campaign2/requiredProjection.ts'].includes(f.path)).length,reviewedSourceChanges:['src/substrate/scheduler.ts','src/campaign2/requiredProjection.ts'].map(fp),limits:['This freeze commits data, not runtime behavior or persistent-state admission.','EPACK work7 failure and all76 EMB runtime obligations remain unqualified.','Public activation must additionally enforce frozen model cohort membership.']};
 fs.writeFileSync(folder+'/FREEZE.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({status:result.status,models:7,runs:7,baseline:result.modelDigest,preserved:446}));
}finally{await server.close();}
