import {it,expect} from 'vitest';
import frozenModelHex from '../../docs/planning/campaign2-measurement-evidence-model/model-identity.cenc.hex?raw';
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {measurementEvidenceModelSource,decodeMeasurement} from '../campaign2/measurementModelSource';
import {prepareCampaign2Model,campaign2ModelIdentity,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {probeRecord} from '../campaign2/probeCodecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
const ordered=enc(list([list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])]));
it('frozen carriage packet matches production declarations and runs exact transient intake with restore',async()=>{
 const source=measurementEvidenceModelSource(),model=await prepareCampaign2Model(source);
 expect(Array.from(campaign2ModelIdentity(model),b=>b.toString(16).padStart(2,'0')).join('')).toBe(frozenModelHex.trim());
 const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)});
 await run.settleNextInstant();const snapshot=run.snapshot();expect(snapshot.state).toEqual(enc(set([])));
 const outputs=items(decodeMeasurement(snapshot.outputs),'list');expect(outputs).toHaveLength(6);
 const evidence=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)!,337n);expect(f(evidence,2n)).toEqual(outputs[1]);
 expect(items(decodeMeasurement(snapshot.trace),'list')).toHaveLength(9);
 const restored=await restoreCampaign2Run(source,{orderedInputs:ordered,save:run.save()});expect(restored.save()).toEqual(run.save());
});
it.each([[false,false],[false,true],[true,false],[true,true]])('carriage fixed topology available=%s permitted=%s',async(a,p)=>{
 const source=measurementEvidenceModelSource(a,p),model=await prepareCampaign2Model(source),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)});
 await run.settleNextInstant();const save=rec(decodeMeasurement(run.save()),132n),allocator=rec(f(save,6n),131n);expect(f(allocator,1n)).toEqual(unsigned(6));expect(f(allocator,2n)).toEqual(unsigned(9));
 const outputs=items(decodeMeasurement(run.snapshot().outputs),'list');expect(outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)).toHaveLength(a&&p?1:0);
 const restored=await restoreCampaign2Run(source,{orderedInputs:ordered,save:run.save()});expect(restored.save()).toEqual(run.save());
});
import {vi} from 'vitest';
import {AuthoritativeState} from '../substrate/state';
import {compileMeasurementModel,INTAKE_EVENT,CARRIAGE_PADDING} from '../campaign2/measurementModel';
import {measurementRecord} from '../campaign2/measurementModelSource';
import {campaign2Record} from '../campaign2/codecs';
import * as intakeModule from '../campaign2/measurementExecution';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {canonicalEncode,record,rational} from '../substrate/canonicalEncoding';
import {dataKey as key} from '../campaign2/canonicalData';

it('EVC-A/G/J and old PROBE-M: scalar-only carriage at matched IDs, state unchanged, old models excluded',async()=>{
 const source=measurementEvidenceModelSource(),compiled=await compileMeasurementModel(source),model=await prepareCampaign2Model(source),pair=[];
 for(const d of [0n,1n]){
  const state=new AuthoritativeState(d===0n?[]:[{path:compiled.probe.path,value:campaign2Record('RegulatoryAdaptationValue',{Magnitude:signed(d)})}]);
  const bytes=enc(state.canonicalValue()),run=await createCampaign2Run(model,{initialState:bytes,orderedInputs:ordered,runSeed:new Uint8Array(32)});await run.settleNextInstant();expect(run.snapshot().state).toEqual(bytes);
  const out=items(decodeMeasurement(run.snapshot().outputs),'list'),evidence=rec(out.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)!,337n),obs=rec(f(evidence,2n),203n);
  expect(f(rec(f(obs,6n),204n),2n)).toEqual(rational(50n+d,10n));pair.push({id:key(f(evidence,1n)),evidence:key(evidence),learning:key(list(out.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&[227n,269n,270n].includes(v.schema.typeId))))});
 }
 expect(pair[0].id).toBe(pair[1].id);expect(pair[0].evidence).not.toBe(pair[1].evidence);expect(pair[0].learning).toBe(pair[1].learning);
 const old=await prepareCampaign2Model({...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES}),run=await createCampaign2Run(old,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)});await run.settleNextInstant();expect(items(decodeMeasurement(run.snapshot().outputs),'list').some(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)).toBe(false);
 await expect(prepareCampaign2Model({...source,rulesVersion:PROBE_SUCCESSOR_RULES})).rejects.toThrow();
});
it('EVC-D/E/L/O exact intake rejects observer/channel/version/precision/reference and occurrence substitutions',async()=>{
 const source=measurementEvidenceModelSource(),model=await prepareCampaign2Model(source),compiled=await compileMeasurementModel(source),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)});await run.settleNextInstant();
 const out=items(decodeMeasurement(run.snapshot().outputs),'list'),obs=rec(out[1],203n);
 for(const [field,value]of [[2n,typedIdentifier(1000,text('observer/other'))],[4n,typedIdentifier(1005,text('channel/other'))],[11n,text('observation/0.1-candidate')],[8n,rational(2n,1n)],[10n,list([text('truth/forged')])],[1n,typedIdentifier(1124,unsigned(1))]] as const){const changed=record(obs.schema,new Map([...obs.fields,[field,value]]));expect(()=>compiled.measurement.validateInput(changed)).toThrow();}
 const cme=rec(out.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)!,337n);
 for(const [field,value]of [[1n,f(obs,1n)],[3n,typedIdentifier(1039,text('unit/other'))],[4n,text('wrong/version')]] as const)expect(()=>compiled.measurement.validateOutput(record(cme.schema,new Map([...cme.fields,[field,value]])))).toThrow();
});
it('EVC-N: late intake failure rolls back state, queue, output and trace',async()=>{
 const model=await prepareCampaign2Model(measurementEvidenceModelSource()),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)}),before=run.snapshot();
 const spy=vi.spyOn(intakeModule,'executeMeasurementIntake').mockImplementation(()=>{throw Error('injected intake failure after allocation');});
 try{await expect(run.settleNextInstant()).rejects.toThrow();const after=run.snapshot();expect(after.state).toEqual(before.state);expect(after.outputs).toEqual(before.outputs);expect(after.trace).toEqual(before.trace);expect(after.clock).toBe(before.clock);}finally{spy.mockRestore();}
});
it('EVC-H/N: restore before and after intake preserves future continuation and rejects altered historical evidence',async()=>{
 const source=measurementEvidenceModelSource(),model=await prepareCampaign2Model(source),manifest=enc(list([...items(decodeMeasurement(ordered),'list'),list([signed(8),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])])),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:manifest,runSeed:new Uint8Array(32)});
 const early=await restoreCampaign2Run(source,{orderedInputs:manifest,save:run.save()});await run.settleNextInstant();await early.settleNextInstant();expect(early.save()).toEqual(run.save());
 const saved=run.save(),resumed=await restoreCampaign2Run(source,{orderedInputs:manifest,save:saved});await run.settleNextInstant();await resumed.settleNextInstant();expect(resumed.save()).toEqual(run.save());
 const save=rec(decodeMeasurement(saved),132n),outputs=items(f(save,12n),'list'),evidence=rec(outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)!,337n),changed=record(evidence.schema,new Map([...evidence.fields,[3n,typedIdentifier(1039,text('unit/other'))]]));
 const forged=record(save.schema,new Map([...save.fields,[12n,list(outputs.map(v=>key(v)===key(evidence)?changed:v))]]));await expect(restoreCampaign2Run(source,{orderedInputs:manifest,save:canonicalEncode(forged)})).rejects.toThrow();
});
it('PACK-E/I generated events never acquire original-input authority',async()=>{
 const model=await prepareCampaign2Model(measurementEvidenceModelSource());for(const kind of [INTAKE_EVENT,CARRIAGE_PADDING])await expect(createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([list([signed(4),unsigned(110),kind,list([]),list([])])])),runSeed:new Uint8Array(32)})).rejects.toThrow();
});
import * as ingressModule from '../campaign2/transitionIngressV04';
import type {ScheduledEvent} from '../substrate/scheduler';
it('EVC-K/N genuine shared ingress rejects altered children and rolls back',async()=>{
 const model=await prepareCampaign2Model(measurementEvidenceModelSource()),original=ingressModule.beginTransitionIngressV04;
 const changes:((children:readonly ScheduledEvent[])=>readonly ScheduledEvent[])[]=[()=>[],c=>[...c,...c],c=>[{...c[0],phase:124n}],c=>[{...c[0],causalParentEventIds:[]}],c=>[{...c[0],payload:list([])}]];
 for(const change of changes){const spy=vi.spyOn(ingressModule,'beginTransitionIngressV04').mockImplementation((...args)=>{const ingress=original(...args);return {...ingress,observeMeasurement(source,bytes){const plan=ingress.observeMeasurement(source,bytes);return {...plan,bindAllocatedChildren(children){plan.bindAllocatedChildren(change(children));}};}};});
 try{const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)}),before=run.snapshot();await expect(run.settleNextInstant()).rejects.toThrow();expect(run.snapshot().outputs).toEqual(before.outputs);expect(run.snapshot().trace).toEqual(before.trace);}finally{spy.mockRestore();}}
});
it('EVC-B/F/G: intake receives only exact safe operands; invented content and duplicated identity fail completion',async()=>{
 const model=await prepareCampaign2Model(measurementEvidenceModelSource()),original=intakeModule.executeMeasurementIntake;
 for(const mutate of ['identity','observation','unit','version']){
 const spy=vi.spyOn(intakeModule,'executeMeasurementIntake').mockImplementation((...args)=>{expect(args).toHaveLength(3);expect(rec(args[0],203n).schema.typeId).toBe(203n);const out=rec(original(...args),337n);
 const field=mutate==='identity'?1n:mutate==='observation'?2n:mutate==='unit'?3n:4n;
 const value=mutate==='identity'?f(rec(args[0],203n),1n):mutate==='observation'?record(rec(args[0],203n).schema,new Map([...rec(args[0],203n).fields,[8n,rational(2n,1n)]])):mutate==='unit'?typedIdentifier(1039,text('unit/forged')):text('wrong/version');return record(out.schema,new Map([...out.fields,[field,value]]));});
 try{const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)});await expect(run.settleNextInstant()).rejects.toThrow();expect(items(decodeMeasurement(run.snapshot().outputs),'list')).toHaveLength(0);}finally{spy.mockRestore();}}
});
it('PACK-A/B/D/O missing V07, occurrence role and changed registration version reject at model boundary',async()=>{
 const source=measurementEvidenceModelSource(),slots=items(decodeMeasurement(source.registry),'list');
 const isV07=(v:import('../substrate/canonicalEncoding').CanonicalValue)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(typedIdentifier(1009,text('MeasurementEvidenceIntakeTransition')));
 const variants=[list([set(items(slots[0],'set').filter(v=>!isV07(v))),...slots.slice(1)]),list([...slots.slice(0,5),set(items(slots[5],'set').filter(v=>{const pos=rec(f(rec(v,265n),1n),264n);return !(key(f(pos,1n))===key(unsigned(1))&&key(f(pos,2n))===key(unsigned(337)));}))]),list([set(items(slots[0],'set').map(v=>isV07(v)?record(rec(v,171n).schema,new Map([...rec(v,171n).fields,[3n,text('transition-admission/0.4-candidate')]])):v)),...slots.slice(1)])];
 for(const registry of variants)await expect(prepareCampaign2Model({...source,registry:enc(registry)})).rejects.toThrow();
});
import {compileRegulatoryReferences} from '../campaign2/regulatoryReference';
import {compileProbeExecution} from '../campaign2/probeExecution';
import {simInstant} from '../substrate/time';
it('EVC-B component scope: changed governed R0/D decomposition yields identical actual observer input and carriage; public model excludes changed anchor',async()=>{
 const source=measurementEvidenceModelSource(),model=await compileMeasurementModel(source),pair=[];
 for(const anchor of [50n,51n]){
  const slots=items(decodeMeasurement(source.registry),'list');let regEntry:import('../substrate/canonicalEncoding').CanonicalValue|undefined;
  const replace=(v:import('../substrate/canonicalEncoding').CanonicalValue,field:bigint,value:import('../substrate/canonicalEncoding').CanonicalValue)=>{const x=rec(v,(v as Extract<typeof v,{kind:'record'}>).schema.typeId);return record(x.schema,new Map([...x.fields,[field,value]]));};
  const entries=items(slots[0],'set').map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;const body=f(v,4n);if(typeof body==='boolean'||body.kind!=='record'||body.schema.typeId!==283n)return v;const reference=rec(f(body,2n),282n),anchors=f(reference,1n);if(typeof anchors==='boolean'||anchors.kind!=='map')throw Error('anchor');
   regEntry=replace(v,4n,replace(body,2n,replace(reference,1n,{kind:'map',entries:anchors.entries.map(([k,a])=>[k,replace(a,1n,signed(anchor))])})));return regEntry;
  });
  const registry=list([set(entries),...slots.slice(1)]),reg=compileRegulatoryReferences(enc(set([regEntry!])),model.compiled.content),probe=compileProbeExecution(registry,reg),state=new AuthoritativeState(anchor===51n?[]:[{path:probe.path,value:campaign2Record('RegulatoryAdaptationValue',{Magnitude:signed(1)})}]);
  const execution=probe.begin(4n);let ordinal=0n;const allocator={allocateRuntimeId:()=>ordinal++},event={eventId:0n,eventSequence:0n,dueAt:simInstant(4n),phase:110n,eventTypeId:PROBE_SOURCE_EVENT,payload:probeRecord(333,[probe.definitionId]),dependencies:list([]),causalParentEventIds:[]};
  const produced=execution.execute(event,state,allocator),children=produced.plan.emissions().map(e=>({...e,eventId:1n,eventSequence:1n,causalParentEventIds:[0n]}));produced.plan.bindAllocatedChildren(children);const observed=execution.execute(children[0],state,allocator).outputs[0];model.measurement.validateInput(observed);
  const ingress=ingressModule.beginTransitionIngressV04(model.admission,4n),plan=ingress.observeMeasurement(children[0],enc(observed)),intake=plan.emissions().map(e=>({...e,eventId:2n,eventSequence:2n,causalParentEventIds:[1n]}));plan.bindAllocatedChildren(intake);const token=ingress.admit(intake[0]),occurrence=ingress.allocateMeasurementIdentity(token,allocator),output=intakeModule.executeMeasurementIntake(observed,model.measurement.unit,occurrence);ingress.completeMeasurement(token,enc(output)).bindAllocatedChildren([]);ingress.finish();execution.abort();pair.push({input:key(observed),output:key(output)});
  if(anchor===51n)await expect(prepareCampaign2Model({...source,registry:enc(registry)})).rejects.toThrow();
 }
 expect(pair[0]).toEqual(pair[1]);
});
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';
const exposureInput=(at:number,count:number)=>{const c=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));return list([signed(at),unsigned(110),AUTHORED_FACT_EVENT,campaign2Record('AuthoredActualAdaptationFact',{Fact:campaign2Record('RegulatoryExposureFact',{CharacterId:c,ExposureReferentId:c,ActualContactCount:unsigned(count)})}),list([])]);};
it('EVC-C/M and PACK-I: all carriage branches leave identical subsequent authored-source EVID sentinel identities',async()=>{
 const sentinels=[];for(const a of [false,true])for(const p of [false,true]){
 const source=measurementEvidenceModelSource(a,p),model=await prepareCampaign2Model(source),manifest=enc(list([...items(decodeMeasurement(ordered),'list'),exposureInput(8,0)])),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:manifest,runSeed:new Uint8Array(32)});await run.settleNextInstant();await run.settleNextInstant();
 const outputs=items(decodeMeasurement(run.snapshot().outputs),'list'),last=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===270n).at(-1)!;sentinels.push(key(last));}
 expect(new Set(sentinels).size).toBe(1);
});
it('EVC-H: later adaptation changes current D but restore retains historical 337 exactly',async()=>{
 const source=measurementEvidenceModelSource(),model=await prepareCampaign2Model(source),manifest=enc(list([exposureInput(2,1),...items(decodeMeasurement(ordered),'list'),exposureInput(6,1)])),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:manifest,runSeed:new Uint8Array(32)});await run.settleNextInstant();await run.settleNextInstant();const before=run.snapshot(),historical=items(decodeMeasurement(before.outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)!;
 await run.settleNextInstant();expect(run.snapshot().state).not.toEqual(before.state);const restored=await restoreCampaign2Run(source,{orderedInputs:manifest,save:run.save()});expect(restored.save()).toEqual(run.save());expect(items(decodeMeasurement(restored.snapshot().outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===337n)).toEqual(historical);
});
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as traceModule from '../substrate/trace';
it.each([false,true])('EVC-N real/padded trace failure rolls back allocator and queue, permitted=%s',async permitted=>{
 const model=await prepareCampaign2Model(measurementEvidenceModelSource(true,permitted)),original=runtimeModule.createAdaptationRuntime,originalTrace=traceModule.traceRecordValue;let captured:ReturnType<typeof original>|undefined;
 const runtimeSpy=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{captured=original(...args);return captured;});
 const traceSpy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{if(key(value.event.eventTypeId)===key(INTAKE_EVENT)||key(value.event.eventTypeId)===key(CARRIAGE_PADDING))throw Error('late carriage trace fault');return originalTrace(value);});
 try{const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:ordered,runSeed:new Uint8Array(32)}),before=captured!.snapshot();await expect(run.settleNextInstant()).rejects.toThrow();const after=captured!.snapshot();for(const k of ['allocators','queue','outputs','committedTrace','clock'] as const)expect(after[k]).toEqual(before[k]);expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));}finally{traceSpy.mockRestore();runtimeSpy.mockRestore();}
});
