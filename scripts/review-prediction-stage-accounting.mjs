// Execute the accepted memory baseline; derive, do not claim execution of, the
// proposed prediction profile's two additional stage slots.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const root=new URL('../',import.meta.url),output='docs/planning/MEASUREMENT_PREDICTION_STAGE_ACCOUNTING.json';
assert(!fs.existsSync(new URL(output,root)),'Preserve stage review');
const fp=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(new URL(path,root))).digest('hex')});
const paths=['scripts/review-prediction-stage-accounting.mjs','src/campaign2/memoryFactory.ts','src/campaign2/memoryExecution.ts','src/campaign2/memoryModelSource.ts','docs/planning/CAMPAIGN2_MEASUREMENT_PREDICTION_PACKAGING.md'],before=paths.map(fp);
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const {canonicalEncode:enc,list,signed,unsigned:u,typedIdentifier,text}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {AuthoritativeState}=await server.ssrLoadModule('/src/substrate/state.ts');
 const {governedContentDefinitionId}=await server.ssrLoadModule('/src/substrate/contentDefinitionId.ts');
 const {semanticReferentFromAuthoredContent}=await server.ssrLoadModule('/src/substrate/referentOrigin.ts');
 const {memoryRecord:r,decodeMemory:decode}=await server.ssrLoadModule('/src/campaign2/memoryCodecs.ts');
 const {memoryModelSource,memoryWrapperDeclarations}=await server.ssrLoadModule('/src/campaign2/memoryModelSource.ts');
 const {prepareMemoryModel,createMemoryRun}=await server.ssrLoadModule('/src/campaign2/memoryFactory.ts');
 const id=(n,s)=>typedIdentifier(n,text(s)),f=(v,n)=>v.fields.get(BigInt(n));
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const state=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])}]);
 const probe=t=>list([signed(t),u(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])]);
 const results=[];
 for(const a of [false,true])for(const p of [false,true])for(const F of [false,true])for(const R of [false,true]){
  const w=memoryWrapperDeclarations(),model=await prepareMemoryModel(memoryModelSource(a,p,F?w.formation:w.formationAblated,R?w.recall:w.recallAblated));
  const run=await createMemoryRun(model,{initialState:enc(state.canonicalValue()),orderedInputs:enc(list([probe(4),probe(5)])),runSeed:new Uint8Array(32)});
  while(await run.settleNextInstant()){}
  const trace=decode(run.snapshot().trace).items,events=trace.map(t=>{const e=f(t,4);return {at:String(f(e,2).value),phase:String(f(e,3).value),kind:f(e,5).payload.value};});
  const counts=Object.fromEntries(['4','5','6'].map(t=>[t,events.filter(e=>e.at===t).length]));
  assert.deepEqual(counts,{'4':11,'5':12,'6':1});
  results.push({available:a,permitted:p,formation:F,memoryRead:R,executedMemoryCounts:counts,events,derivedPredictionCounts:{'4':12,'5':14,'6':2}});
 }
 assert.deepEqual(paths.map(fp),before);
 fs.writeFileSync(new URL(output,root),JSON.stringify({status:'EXECUTED OLD-PROFILE COUNTS; DERIVED NEW-PROFILE ACCOUNTING',sourceFingerprints:before,controls:results,workCeiling:100,maximumDerivedProbeInstantWork:14,limitations:['The prediction scheduler/dispatcher has not been implemented or executed.','New counts follow the accepted two-slot delta; runtime qualification must reproduce them.','Counts cover two consecutive probe sources and all sixteen inherited controls.','General authored-input overload remains governed by the existing work-ceiling failure, not this successful-probe bound.']},null,2)+'\n');
 console.log('PASS:16 memory controls execute11/12/1 events; proposed prediction delta yields12/14/2, ceiling100.');
}finally{await server.close();}
