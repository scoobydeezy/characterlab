import {it,expect,vi} from 'vitest';
import {canonicalEncode,list,set,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {firstModelCandidate,candidateId} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run,campaign2ModelIdentity} from '../campaign2/factory';
import {decodeCampaign2,campaign2Record as r} from '../campaign2/codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
import * as binding from '../campaign2/traceBinding';
import * as traceModule from '../substrate/trace';
const enc=canonicalEncode,character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
function input(count=2){return {initialState:enc(set([])),runSeed:new Uint8Array(32),orderedInputs:enc(list([
 r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(count)}),
 r('ProceduralPracticeFact',{CharacterId:character,ProcedureId:candidateId(1034,'procedure/fixture-practice'),CompletedRepetitions:unsigned(count)}),
].map((Fact,i)=>list([signed(2+i*2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact}),list([])]))))};}
const records=(bytes:Uint8Array)=>items(decodeCampaign2(bytes),'list').map(v=>rec(v,160n));
const scalar=(v:CanonicalValue)=>(v as {value:bigint}).value;
async function setup(count=2,old=false){const source=old?firstModelCandidate():firstTraceModel(),model=await prepareCampaign2Model(source),data=input(count),run=await createCampaign2Run(model,data);return {source,model,data,run};}
it('TRACE-C2-A/B/C/J/K: exact one-envelope handler matrix, child association and sole OBS output',async()=>{
 const c=await setup();await c.run.settleNextInstant();await c.run.settleNextInstant();const trace=records(c.run.snapshot().trace);
 expect(trace).toHaveLength(18);expect(trace.map(t=>scalar(f(rec(f(t,4n),130n),3n)))).toEqual([110n,120n,121n,122n,123n,124n,130n,130n,140n,110n,120n,121n,122n,123n,124n,130n,130n,140n]);
 const byId=new Map(trace.map(t=>[key(f(rec(f(t,4n),130n),1n)),f(t,4n)]));
 const expectedSeams=['authored-adaptation-fact-source','authored-fact-observation',...Array(4).fill('event-truth-to-pre-recognition-experience'),'character-learning-evidence','character-learning-evidence','automatic-adaptation'];
 const expectedVersions=['adaptation-input/0.31-candidate','authored-fact-observation/0.1-candidate',...Array(4).fill('semantic-binding/0.1-candidate#SEM-001H'),'character-learning-evidence/0.5-candidate','character-learning-evidence/0.5-candidate','adaptation-input/0.31-candidate'];
 trace.forEach((t,i)=>{
  const event=rec(f(t,4n),130n);expect(f(t,7n)).toEqual(f(event,5n));expect(enc(f(t,2n))).toEqual(campaign2ModelIdentity(c.model));expect(enc(f(t,3n))).toEqual(c.run.runIdentity());
  expect(f(t,5n)).toEqual(candidateId(1036,'seam/'+expectedSeams[i%9]));expect(f(t,6n)).toEqual({kind:'text',value:expectedVersions[i%9]});
  for(const child of items(f(t,18n),'list')){const e=rec(child,130n);expect(byId.get(key(f(e,1n)))).toEqual(child);expect(items(f(e,8n),'list')).toContainEqual(f(event,1n));}
 });
 const outputs=items(decodeCampaign2(c.run.snapshot().outputs),'list');expect(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===203n)).toHaveLength(2);
 for(const i of [1,10]){const t=trace[i],truth=rec(f(rec(f(rec(f(t,4n),130n),6n),310n),1n),200n);expect(f(t,9n)).toEqual(list([f(truth,9n)]));expect(f(rec(f(t,13n),203n),10n)).toEqual(list([]));}
});
it('TRACE-C2-D/I: safe EVID projections and zero reads remain invariant under hidden count changes',async()=>{
 const a=await setup(0),b=await setup(2);await a.run.settleNextInstant();await b.run.settleNextInstant();const ta=records(a.run.snapshot().trace),tb=records(b.run.snapshot().trace);
 for(const i of [1,5,6,7])expect(f(ta[i],13n)).toEqual(f(tb[i],13n));
 for(const i of [6,7]){
  const t=ta[i],p=rec(f(t,12n),i===6?227n:269n),x=i===6?p:rec(f(p,2n),227n);
  expect(f(t,9n)).toEqual(list([f(p,1n)]));expect(f(t,8n)).toEqual(list([f(x,2n)]));expect(f(t,10n)).toEqual(list([]));expect(f(t,11n)).toEqual(list([]));
  expect(f(rec(f(t,13n),i===6?269n:270n),2n)).toEqual(p);
 }
 expect(a.run.snapshot().state).not.toEqual(b.run.snapshot().state);
});
it('TRACE-C2-E/F: four rule mutations and one procedural mutation retain full intent, actual priors and WRT diffs',async()=>{
 const c=await setup();await c.run.settleNextInstant();await c.run.settleNextInstant();const ts=records(c.run.snapshot().trace);
 for(const [index,count] of [[8,4],[17,1]]){
  const t=ts[index],outputs=items(f(t,13n),'list'),ops=items(f(rec(f(t,16n),144n),1n),'list'),diffs=items(f(t,17n),'list');
  expect(outputs).toHaveLength(count+1);expect(ops).toHaveLength(count);expect(diffs).toHaveLength(count);expect(items(f(t,11n),'list')).toHaveLength(count);
  const evaluations=outputs.slice(1).map(v=>rec(v,325n));
  const everyEvaluationOperation=evaluations.flatMap(e=>items(f(rec(f(rec(f(e,6n),327n),2n),144n),1n),'list'));
  expect(ops.map(key).sort()).toEqual(everyEvaluationOperation.map(key).sort());
  expect(evaluations.map(v=>key(f(v,3n)))).toEqual(evaluations.map(v=>key(f(v,3n))).sort());
  expect(ops.map(v=>key(f(rec(v,145n),1n)))).toEqual(ops.map(v=>key(f(rec(v,145n),1n))).sort());
  for(const diff of diffs){const d=rec(diff,148n),op=ops.map(o=>rec(o,145n)).find(o=>key(f(o,1n))===key(f(d,1n)))!;expect(f(d,2n)).toBe(false);expect(f(d,4n)).toBe(true);expect(f(d,5n)).toEqual(f(op,4n));expect(f(d,6n)).toEqual(candidateId(1025,index===8?'authority/regulatory-adaptation':'authority/procedural-skill'));}
 }
 const zero=await setup(0);await zero.run.settleNextInstant();const t=records(zero.run.snapshot().trace)[8];expect(items(f(t,11n),'list')).toHaveLength(4);expect(items(f(rec(f(t,16n),144n),1n),'list')).toEqual([]);expect(f(t,17n)).toEqual(list([]));
});
it('TRACE-C2-G: trace finalization failure rolls back the whole instant',async()=>{
 const c=await setup(),before=c.run.snapshot(),original=traceModule.traceRecordValue;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{if(value.event.phase===140n)throw Error('late trace failure');return original(value);});
 try{await expect(c.run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:'TRACE_VALIDATION_FAILURE'}));const after=c.run.snapshot();expect(after.state).toEqual(before.state);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);expect(after.clock).toBe(0n);}finally{spy.mockRestore();}
});
it('TRACE-C2-H/L/N: new model restores exactly; old identity cannot select new trace semantics or restore as new',async()=>{
 const c=await setup();await c.run.settleNextInstant();const resumed=await restoreCampaign2Run(c.source,{save:c.run.save(),orderedInputs:c.data.orderedInputs});await c.run.settleNextInstant();await resumed.settleNextInstant();expect(resumed.save()).toEqual(c.run.save());
 const old=await setup(2,true);expect(()=>binding.compileTraceBinding(decodeCampaign2(campaign2ModelIdentity(old.model)),decodeCampaign2(old.run.runIdentity()))).toThrow(/0.2/);
 await expect(restoreCampaign2Run(c.source,{save:old.run.save(),orderedInputs:old.data.orderedInputs})).rejects.toThrow(/ModelIdentity/);
 const spy=vi.spyOn(binding,'supportsTraceProfile').mockReturnValue(false);try{await expect(prepareCampaign2Model(firstTraceModel())).rejects.toThrow(/unavailable/);}finally{spy.mockRestore();}
});
