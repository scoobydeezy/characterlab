import {it,expect,vi} from 'vitest';
import {ContractReadProjection} from '../substrate/state';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as traceModule from '../substrate/trace';
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier,rational,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {decodeProbeReview,probeRecord} from '../campaign2/probeCodecs';
import {campaign2Record as r} from '../campaign2/codecs';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT,PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
const character=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const exposure=(at:number,n:number)=>list([signed(at),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:character,ExposureReferentId:character,ActualContactCount:unsigned(n)})}),list([])]);
const probe=()=>list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])]);
it('actual probe .2 factory: permitted scalar diverges, X/E/L remain equal, restore continues exactly',async()=>{
 const source={...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES},model=await prepareCampaign2Model(source),results=[];
 for(const n of [0,1]){
  const ordered=enc(list([exposure(2,n),probe(),exposure(6,0)])),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)});
  await run.settleNextInstant();const before=run.snapshot();const restored=await restoreCampaign2Run(source,{orderedInputs:ordered,save:run.save()});
  await run.settleNextInstant();await restored.settleNextInstant();expect(restored.save()).toEqual(run.save());expect(run.snapshot().state).toEqual(before.state);
  const outputs=items(decodeProbeReview(run.snapshot().outputs),'list');
  const select=(type:bigint)=>outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).at(-1)!;
  expect(f(rec(select(334n),334n),4n)).toEqual(signed(50+n));
  const obs=rec(select(203n),203n);expect(f(rec(f(obs,6n),204n),2n)).toEqual(rational(BigInt(50+n),10n));expect(f(obs,9n)).toEqual(list([]));expect(f(obs,10n)).toEqual(list([]));
  const after=run.save();await run.settleNextInstant();const resumed=await restoreCampaign2Run(source,{orderedInputs:ordered,save:after});await resumed.settleNextInstant();expect(resumed.save()).toEqual(run.save());
  results.push({before:enc(list(items(decodeProbeReview(before.outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[203n,227n,269n,270n].includes(v.schema.typeId)))),obs:enc(select(203n)),truth:enc(select(334n)),safe:enc(list([select(227n),select(269n),select(270n)]))});
 }
 expect(results[0].before).toEqual(results[1].before);expect(results[0].obs).not.toEqual(results[1].obs);expect(results[0].truth).not.toEqual(results[1].truth);expect(results[0].safe).toEqual(results[1].safe);
});
it('all committed permission branches preserve later sentinel identities and exact budget',async()=>{
 const results=[];
 for(const a of [false,true])for(const p of [false,true]){
  const source={...probeModelReviewSource(a,p),rulesVersion:PROBE_SUCCESSOR_RULES},model=await prepareCampaign2Model(source),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([probe(),exposure(6,0)])),runSeed:new Uint8Array(32)});
  await run.settleNextInstant();const save=rec(decodeProbeReview(run.save()),132n),out=items(decodeProbeReview(run.snapshot().outputs),'list');expect(out.length).toBe(a?(p?5:1):0);
  const allocator=enc(f(save,6n));expect(f(rec(f(save,6n),131n),1n)).toEqual(unsigned(5));expect(f(rec(f(save,6n),131n),2n)).toEqual(unsigned(9));expect(f(rec(f(save,6n),131n),3n)).toEqual(unsigned(9));
  expect(items(decodeProbeReview(run.snapshot().trace),'list')).toHaveLength(8);
  await run.settleNextInstant();const last=items(decodeProbeReview(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===203n).at(-1)!;results.push({allocator,last:enc(last)});
 }
 for(const r of results){expect(r.allocator).toEqual(results[0].allocator);expect(r.last).toEqual(results[0].last);}
});
it.each([[false,false],[false,true],[true,false]])('hidden D stays observer-inaccessible for availability/permission %s/%s',async(a,p)=>{
 const model=await prepareCampaign2Model({...probeModelReviewSource(a,p),rulesVersion:PROBE_SUCCESSOR_RULES}),pair=[];
 for(const n of [0,1]){const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([exposure(2,n),probe(),exposure(6,0)])),runSeed:new Uint8Array(32)});while(await run.settleNextInstant()){}
  const permitted=items(decodeProbeReview(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[203n,227n,269n,270n].includes(v.schema.typeId));
  expect(permitted.length).toBe(8);pair.push({safe:enc(list(permitted)),state:run.snapshot().state,allocator:enc(f(rec(decodeProbeReview(run.save()),132n),6n))});}
 expect(pair[0].state).not.toEqual(pair[1].state);expect(pair[0].safe).toEqual(pair[1].safe);expect(pair[0].allocator).toEqual(pair[1].allocator);
});
it('historical probe .1 cannot activate successor trace semantics',async()=>{await expect(prepareCampaign2Model(probeModelReviewSource())).rejects.toThrow();});
it('probe restore rejects changed archived accessor, channel, provenance and union tag',async()=>{
 const source={...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES},model=await prepareCampaign2Model(source),orderedInputs=enc(list([probe(),exposure(6,0)])),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});
 await run.settleNextInstant();const saved=decodeProbeReview(run.save());
 for(const mode of ['accessor','channel','provenance','tag']){
  let changed=0;
  function mutate(v:CanonicalValue):CanonicalValue{
   if(typeof v==='boolean')return v;
   if(v.kind==='record'){
    const fields=new Map([...v.fields].map(([k,x])=>[k,mutate(x)]));
    if(mode==='accessor'&&v.schema.typeId===147n){fields.set(1n,typedIdentifier(1028,text('accessor/adaptation-target-prior')));changed++;}
    if((mode==='channel'||mode==='provenance')&&v.schema.typeId===203n){fields.set(mode==='channel'?4n:10n,mode==='channel'?typedIdentifier(1005,text('channel/wrong')):list([typedIdentifier(1123,unsigned(0))]));changed++;}
    if(mode==='tag'&&v.schema.typeId===335n){fields.set(1n,unsigned(9));changed++;}
    return record(v.schema,fields);
   }
   if(v.kind==='list')return list(v.items.map(mutate));if(v.kind==='set')return set(v.items.map(mutate));return v;
  }
  const bytes=enc(mutate(saved));expect(changed).toBeGreaterThan(0);await expect(restoreCampaign2Run(source,{orderedInputs,save:bytes})).rejects.toThrow();
 }
});
it.each(['accessor/adaptation-target-prior','accessor/adaptation-gate-prior','ResolvedCharacterSubject','accessor/wrong'])(
 'ACCESSOR-A/C: substituted %s rejects and rolls back the probe instant',async(member)=>{
 const model=await prepareCampaign2Model({...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES});
 const original=ContractReadProjection.prototype.actualReadRecords;
 const spy=vi.spyOn(ContractReadProjection.prototype,'actualReadRecords').mockImplementation(function(this:ContractReadProjection<any>){return original.call(this).map(x=>({...x,accessorId:typedIdentifier(1028,text(member))}));});
 try{const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([probe()])),runSeed:new Uint8Array(32)}),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toMatchObject({code:'TRACE_VALIDATION_FAILURE'});const after=run.snapshot();expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);expect(after.state).toEqual(before.state);expect(after.clock).toBe(before.clock);
 }finally{spy.mockRestore();}
});
it.each([false,true])('ACCESSOR-A/B: availability %s has exact actual-read cardinality and identity',async(a)=>{
 const model=await prepareCampaign2Model({...probeModelReviewSource(a,false),rulesVersion:PROBE_SUCCESSOR_RULES}),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([probe()])),runSeed:new Uint8Array(32)});
 await run.settleNextInstant();const traces=items(decodeProbeReview(run.snapshot().trace),'list'),first=traces[0];if(typeof first==='boolean'||first.kind!=='record')throw Error();
 const reads=items(f(first,first.schema.fields.find(x=>x.name==='ActualReadRecords')!.id),'list');expect(reads.length).toBe(a?1:0);
 if(a)expect(f(rec(reads[0],147n),1n)).toEqual(typedIdentifier(1028,text('accessor/regulatory-diagnostic-displacement-prior')));
});
it.each([true,false])('PROBE-K: late trace failure rolls back real/padded ordinals, permitted=%s',async(p)=>{
 const model=await prepareCampaign2Model({...probeModelReviewSource(true,p),rulesVersion:PROBE_SUCCESSOR_RULES}),original=runtimeModule.createAdaptationRuntime,trace=traceModule.traceRecordValue;
 let captured:ReturnType<typeof original>|undefined;
 const spy=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{captured=original(...args);return captured;});
 const traceSpy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{if(value.event.phase===130n)throw Error('injected late probe trace failure');return trace(value);});
 try{const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([probe()])),runSeed:new Uint8Array(32)}),before=captured!.snapshot();
  await expect(run.settleNextInstant()).rejects.toMatchObject({code:'TRACE_VALIDATION_FAILURE'});const after=captured!.snapshot();
  for(const k of ['allocators','queue','outputs','committedTrace','clock'] as const)expect(after[k]).toEqual(before[k]);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
 }finally{spy.mockRestore();traceSpy.mockRestore();}
});
