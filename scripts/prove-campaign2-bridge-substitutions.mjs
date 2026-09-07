// Differential qualification against the checked frozen factory baseline, not an independent SEM implementation.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),hash=b=>crypto.createHash('sha256').update(b).digest('hex');
const bridge='src/campaign2/consequenceBridge.ts',obs='src/campaign2/bridgeObservation.ts';
const mutants=[
 {name:'retain-truth-provenance',file:obs,from:'fields.set(10n,list([]));',to:'/* retain raw truth provenance */'},
 {name:'omit-authoritative-observation',file:bridge,from:'outputs.push(observation); // Sole published observation, never its raw candidate.',to:'void observation;'},
 {name:'omit-sem-support',file:bridge,from:'supportingObservationIds:[{observerId:observer,observationId:observation.payload.value}]',to:'supportingObservationIds:[]'},
 {name:'duplicate-sem-support',file:bridge,from:'supportingObservationIds:[{observerId:observer,observationId:observation.payload.value}]',to:'supportingObservationIds:[{observerId:observer,observationId:observation.payload.value},{observerId:observer,observationId:observation.payload.value}]'},
 {name:'shift-sem-time',file:bridge,from:'experienceId:relation.reservation!.experienceId,observerId:observer,occurredAt:event.dueAt',to:'experienceId:relation.reservation!.experienceId,observerId:observer,occurredAt:event.dueAt+1n'},
];
const sources=[bridge,obs].map(path=>({path,sha256:hash(fs.readFileSync(new URL(path,root)))}));
async function execute(mutant){
 let transformed=0;
 const server=await createServer({server:{middlewareMode:true},appType:'custom',optimizeDeps:{noDiscovery:true,include:[]},plugins:mutant?[{
  name:'bridge-interpreter-substitution',enforce:'pre',transform(code,id){if(!id.replaceAll('\\','/').endsWith('/'+mutant.file))return;assert.equal(code.split(mutant.from).length-1,1);transformed++;return code.replace(mutant.from,mutant.to);},
 }]:[]});
 try{
  const {firstTraceModel}=await server.ssrLoadModule('/src/campaign2/firstTraceModel.ts'),source=firstTraceModel();
  const {prepareCampaign2Model,createCampaign2Run}=await server.ssrLoadModule('/src/campaign2/factory.ts');
  const {canonicalEncode:enc,list,set,signed,unsigned}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
  const {decodeCampaign2:decode,campaign2Record:r}=await server.ssrLoadModule('/src/campaign2/codecs.ts');
  const {semanticReferentFromAuthoredContent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
  const {AUTHORED_FACT_EVENT}=await server.ssrLoadModule('/src/campaign2/orderedInputs.ts');
  const character=semanticReferentFromAuthoredContent(decode(source.content).items[0].fields.get(1n)),model=await prepareCampaign2Model(source),cases=[];
  for(const count of [0,2]){
   const run=await createCampaign2Run(model,{initialState:enc(set([])),runSeed:new Uint8Array(32),orderedInputs:enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)})}),list([])])]))}),before=run.snapshot();
   let error;try{await run.settleNextInstant();}catch(e){error=e.code??e.name;}
   const after=run.snapshot(),bytes={state:after.state,outputs:after.outputs,trace:after.trace},rollback=error?['state','outputs','trace'].every(k=>Buffer.from(after[k]).equals(Buffer.from(before[k])))&&after.clock===before.clock:undefined;
   if(error)assert(rollback,'failed mutation rolls back');
   if(!mutant){
    assert.equal(error,undefined);const traces=decode(after.trace).items;assert.equal(traces.length,9);
    const outputs=decode(after.outputs).items;assert.equal(outputs.filter(v=>v.kind==='record'&&v.schema.typeId===203n).length,1);
    assert.deepEqual(traces[1].fields.get(13n).fields.get(10n),list([]));
    for(const i of [6,7]){assert.deepEqual(traces[i].fields.get(10n),list([]));assert.deepEqual(traces[i].fields.get(11n),list([]));assert.deepEqual(traces[i].fields.get(13n).fields.get(2n),traces[i].fields.get(12n));}
   }
   cases.push({count,error,rollback,bytes});
  }
  if(!mutant){const a=decode(cases[0].bytes.trace).items,b=decode(cases[1].bytes.trace).items;for(const i of [1,5,6,7])assert(Buffer.from(enc(a[i].fields.get(13n))).equals(Buffer.from(enc(b[i].fields.get(13n)))),'fixed safe source invariant');}
  if(mutant)assert.equal(transformed,1);
  return {cases,declarationHashes:{registry:hash(source.registry),content:hash(source.content),parameters:hash(source.parameters)},rulesVersion:source.rulesVersion};
 }finally{await server.close();}
}
const baseline=await execute(),mutations=[];console.log('Checked factory baseline PASS');
const summarize=c=>({count:c.count,...(c.error?{error:c.error,rollback:c.rollback}:{}),hashes:Object.fromEntries(Object.entries(c.bytes).map(([k,v])=>[k,hash(v)]))});
for(const m of mutants){
 const result=await execute(m);assert.deepEqual(result.declarationHashes,baseline.declarationHashes);assert.equal(result.rulesVersion,baseline.rulesVersion);
 const differences=result.cases.map((c,i)=>({count:c.count,error:c.error,changed:['state','outputs','trace'].filter(k=>!Buffer.from(c.bytes[k]).equals(Buffer.from(baseline.cases[i].bytes[k])))}));
 assert(differences.some(c=>c.error||c.changed.length),'substitution detected');
 mutations.push({name:m.name,status:'DETECTED',source:m.file,from:m.from,to:m.to,differences,cases:result.cases.map(summarize)});console.log(m.name+': DETECTED');
}
for(const s of sources)assert.equal(hash(fs.readFileSync(new URL(s.path,root))),s.sha256);
fs.writeFileSync(new URL('docs/planning/CAMPAIGN2_BRIDGE_SUBSTITUTION_PROOF.json',root),JSON.stringify({status:'COMPONENT PASS',sourceFingerprints:sources,rulesVersion:baseline.rulesVersion,declarationHashes:baseline.declarationHashes,
 baseline:baseline.cases.map(summarize),mutations,comparison:'Exact bytes compared in memory; hashes in report are diagnostics only.',
 limitations:['Differential interpreter substitution controls, not an independent OBS/SEM semantics implementation.',
 'Two first-profile regulatory inputs with the same fixed safe pulse; no complete FCT-F or inherited SEM vector claim.',
 'PRJ execution and roster variants are not admitted by this frozen first model and are separate controls.']},null,2)+'\n');
