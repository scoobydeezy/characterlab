/** defining-meaning/0.1-candidate; composed continuation, not public ingress. */
import {canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity,dataKey as key,dataText as txt} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {generalBindingContext} from './generalBindingProfile';
import {canonicalAcquisitionChildren} from './generalMemoryOwner';
import {definingTraining,definingStageBytes,definingLaws,type DefiningLaw} from './definingMemoryExperiment';
import {adoptMaintenanceGoal,type GoalInterval} from './bodilyMaintenanceGoal';
import {qualifyGoalOutcome} from './goalOutcomeQualification';
import {copySignificantMemory,applyQualifiedSignificance,applyQualifiedSignificantUse,type SignificantAcquisition} from './directionalSignificanceState';
import {retainSignificanceFirst,retainSharedProtectionTier} from './significanceFirstRetention';
import {retainByRecency} from './recencyRetention';
import {retainWithUseProtection} from './useProtectedRetention';
import {prepareEventRecollections,prepareBodyRecollections,publishRecollections,takeEventPresentation} from './recollectionProduction';
import {settleEventPresentationHistory} from './eventPresentationSettlement';
import {groupRetainedPositionTrial} from './retainedContextGrouping';
import {prepareAttributionProduction,produceAttributionResult} from './attributionProduction';
import type {AttributionField,PositionPairTrial,ObservedPosition} from './retainedAttributionUse';
import type {AttributionTrial} from './contrastiveAttribution';
const context=generalBindingContext(),ordinal=(v:CanonicalValue)=>uint(identity(v).payload),time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('MEANING_TIME');return v.value;};
const q=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('MEANING_INTERVAL');return Q.of(v.numerator,v.denominator);};
const interval=(lo:number,hi=lo):GoalInterval=>({lower:Q.of(BigInt(lo)),upper:Q.of(BigInt(hi))});
const domains=new Map([['A',{kind:'MetricInterval' as const,bounds:interval(0,100)}]]),goalDomains=new Map([['A',interval(0,100)]]);
function evidence(bytes:Uint8Array){const v=decode(bytes,context);if(typeof v==='boolean'||v.kind!=='record'||![544n,545n].includes(v.schema.typeId))throw Error('MEANING_EVIDENCE');return v;}
function companion(bytes:Uint8Array){const c=rec(f(evidence(bytes),2n),543n),event=rec(f(c,2n),213n),panel=rec(f(c,3n),542n),observer=txt(identity(f(event,1n)).payload);return {experience:ordinal(f(c,1n)),context:{observerId:observer,observerEventSequence:uint(f(event,2n))},panel:{observation:ordinal(f(panel,1n)),sample:{kind:'Present' as const,at:time(f(panel,3n)),glyph:Number(uint(f(panel,4n))),stage:(['Before','Motion','After'] as const)[Number(uint(f(panel,5n)))-1]}}};}
const bodyInterval=(bytes:Uint8Array)=>{const i=rec(f(rec(f(rec(evidence(bytes),545n),1n),461n),5n),462n);return {lower:q(f(i,1n)),upper:q(f(i,2n))};};
export function meaningTraining(state:Uint8Array,outputs:Uint8Array){
 const t=definingTraining(state),all=items(decode(outputs,context),'list');
 const attribution=all.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===575n).map(v=>rec(v,575n));if(attribution.length!==1||uint(f(attribution[0],7n))!==1n)throw Error('MEANING_ACTUAL_ATTRIBUTION');
 const a=attribution[0],consequence=ordinal(f(a,4n)),observer=txt(identity(f(a,2n)).payload);
 const publications=all.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===590n).map(v=>rec(v,590n)).filter(v=>time(f(v,3n))===37n);
 const basis=publications.map(v=>{const winner=f(v,4n);if(typeof winner==='boolean'||winner.kind!=='record')throw Error('MEANING_PUBLICATION');const entry=rec(f(winner,1n),587n),id=ordinal(f(entry,1n)),children=canonicalAcquisitionChildren(entry,false);if(children.length!==1)throw Error('MEANING_SINGLE_CHILD');const actual=t.memory.find(a=>a.id===id);if(!actual||key(encValue(actual.units[0].views))!==key(encValue(children[0].views)))throw Error('MEANING_PUBLICATION_BINDING');return {id,bytes:children[0].views[0],childKey:children[0].childKey,context:companion(children[0].views[0])};});
 if(basis.length!==16||new Set(basis.map(a=>a.id)).size!==16||t.memory.some(a=>a.units.some(u=>u.outcomeSignificanceDirections.length)))throw Error('MEANING_UNCREDITED_TRAINING');
 const focal=basis.find(b=>b.context.experience===consequence);if(!focal)throw Error('MEANING_CONSEQUENCE_JOIN');const group=groupRetainedPositionTrial(observer,focal.context.context,basis.map(b=>b.context));if(group.kind!=='Grouped')throw Error('MEANING_GROUP');
 const before=basis.find(b=>b.context.experience===group.beforeExperience)!,after=basis.find(b=>b.context.experience===group.afterExperience)!;
 const targets=items(f(a,9n),'set').map(v=>{const r=rec(v,573n),id=ordinal(f(r,1n)),b=basis.find(b=>b.id===id);if(!b||key(b.childKey)!==key(f(r,2n)))throw Error('MEANING_TARGET_JOIN');return {acquisition:id,unit:'child'};});
 if(targets.length!==1||basis.find(b=>b.id===targets[0].acquisition)?.context.experience!==group.endExperience)throw Error('MEANING_ENDPOINT');
 return {...t,observer,consequence,sourceAt:after.context.panel.sample.at,basis,before:bodyInterval(before.bytes),after:bodyInterval(after.bytes),targets};
}
// Compare the actual canonical evidence bytes without a decoder-dependent JSON shape.
import {list,bytes as byteString} from '../substrate/canonicalEncoding';
const encValue=(xs:readonly Uint8Array[])=>list(xs.map(byteString));
export type MeaningGoal='High'|'Low'|'Wide'|'Absent';
export interface MeaningSpec {law:DefiningLaw;goal:MeaningGoal;rehearsals:0|3;capacity:0|1|8;now:50|400|4000;cue:'matching'|'absent';report:'original'|'contrary'|'missing';worldAfter:20|30}
const calibration=(k:number)=>({beta:Q.of(0n),scale:100n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:Q.of(1n),k});
function attribute(t:ReturnType<typeof meaningTraining>,memory:readonly SignificantAcquisition[],now:bigint){
 const rows=t.basis.filter(b=>memory.some(a=>a.id===b.id)),contexts=[...new Map(rows.map(r=>[r.context.context.observerEventSequence,r.context.context])).values()];
 const view=prepareAttributionProduction({observer:t.observer,character:'holder',at:now,focal:{observer:t.observer,consequence:t.consequence,sourceAt:t.sourceAt}},()=>{
  if(rows.length!==16||contexts.length!==4)return null;const groups=contexts.map(c=>groupRetainedPositionTrial(t.observer,c,rows.map(r=>r.context)));if(groups.some(g=>g.kind!=='Grouped'))return null;
  const operand=(experience:bigint)=>{const row=rows.find(r=>r.context.experience===experience)!;return {kind:'Retained' as const,address:{acquisition:row.id,unit:'child'},view:0};};
  const trials:PositionPairTrial[]=groups.map(g=>{if(g.kind!=='Grouped')throw Error('MEANING_GROUP');return {before:operand(g.beforeExperience),after:operand(g.afterExperience),motion:{kind:'RetainedPositionPair',start:operand(g.startExperience),end:operand(g.endExperience)}};});
  const project=<K extends AttributionField>(bytes:Uint8Array,field:K):AttributionTrial[K]=>{if(field==='motion')throw Error('MEANING_POSITION');return bodyInterval(bytes) as AttributionTrial[K];};
  const position=(bytes:Uint8Array):ObservedPosition=>{const witness=rec(f(rec(f(rec(evidence(bytes),544n),1n),620n),6n),612n),p=witness.fields.get(3n);return {at:companion(bytes).panel.sample.at,position:p?[Number(uint(f(rec(p,608n),1n))),Number(uint(f(rec(p,608n),2n)))]:null};};
  return [{memory,now,admitted:memory.map(a=>({acquisition:a.id,unit:'child'})),trials,focalTrial:groups.findIndex(g=>g.kind==='Grouped'&&g.afterExperience===t.consequence)},project,position];
 });return produceAttributionResult(view,()=>now*100n);
}
export function runDefiningMeaning(t:ReturnType<typeof meaningTraining>,spec:MeaningSpec){
 if(!definingLaws.includes(spec.law)||!['High','Low','Wide','Absent'].includes(spec.goal)||![0,3].includes(spec.rehearsals)||![0,1,8].includes(spec.capacity)||![50,400,4000].includes(spec.now)||!['matching','absent'].includes(spec.cue)||!['original','contrary','missing'].includes(spec.report)||![20,30].includes(spec.worldAfter))throw Error('MEANING_SPEC');
 const desired=spec.goal==='High'?interval(30,31):spec.goal==='Low'?interval(20,21):interval(0,100),goals=spec.goal==='Absent'?[]:adoptMaintenanceGoal([],{character:'holder',goal:'maintenance',signal:'A',desired,adoptedAt:38n,activeFrom:38n,expiresAt:5001n},goalDomains);
 const assess=(after:GoalInterval|null,now:bigint)=>qualifyGoalOutcome({state:goals,character:'holder',goal:'maintenance',signal:'A',now,before:t.before,after,domains});
 const historical=assess(t.after,38n),attribution=attribute(t,t.memory,38n);let memory=copySignificantMemory(t.memory,38n),history:Map<bigint,readonly bigint[]>=new Map(t.presentations);
 if(attribution.kind!=='Result'||attribution.result.disposition!=='Supported'||JSON.stringify(attribution.result.targets,(_,v)=>typeof v==='bigint'?String(v):v)!==JSON.stringify(t.targets,(_,v)=>typeof v==='bigint'?String(v):v))throw Error('MEANING_ATTRIBUTION_REPLAY');
 if(historical.kind==='Qualifies')memory=applyQualifiedSignificance({observer:t.observer,character:'holder',memory},[{observer:t.observer,character:'holder',direction:historical.direction,targets:attribution.result.targets}],38n);
 const stages=[definingStageBytes({goals,historical,attribution,memory,history})],rehearsals=[];
 const eventRecall=(at:bigint,k:number,cue:'matching'|'absent')=>prepareEventRecollections({observer:t.observer,character:'holder'},cue==='absent'?{kind:'Absent'}:{kind:'Present',key:[...t.keys.values()][0]},at,calibration(k),()=>({memory:memory.filter(a=>a.kind==='EventContinuant').map(a=>({...a,units:a.units.map(u=>({key:t.keys.get(a.id)!,views:u.views}))})),graph:{keys:[],weights:[]},presentations:history}));
 for(let i=0;i<spec.rehearsals;i++){
  const at=39n+BigInt(i),prepared=eventRecall(at,8,'matching');let occurrence=at*100n;const event=publishRecollections(prepared.view,()=>occurrence++),batch=takeEventPresentation(event);
  const bodyPrepared=prepareBodyRecollections({observer:t.observer,character:'holder'},{kind:'Present',signals:['child']},at,8,()=>memory.filter(a=>a.kind==='Interoceptive'));
  const body=publishRecollections(bodyPrepared.view,()=>occurrence++),ids=new Set([...event.recollections,...body.recollections].map(r=>r.content.winner.id)),used=attribute(t,memory.filter(a=>ids.has(a.id)),at);
  if(used.kind!=='Result'||used.result.disposition!=='Supported')throw Error('MEANING_REHEARSAL_ATTRIBUTION');memory=applyQualifiedSignificantUse(memory,used.result.consumed,at);
  history=new Map(settleEventPresentationHistory({now:at,priorAcquisitions:memory.map(({id,kind,acquiredAt})=>({id,kind,acquiredAt})),formed:[],survivingAcquisitions:memory.map(a=>a.id),priorHistory:[...history].map(([acquisition,instants])=>({acquisition,instants})),presentations:batch.presentations}).map(r=>[r.acquisition,r.instants]));
  rehearsals.push({at,event,body,consumed:used.result.consumed});stages.push(definingStageBytes({memory,history,rehearsal:rehearsals.at(-1)}));
 }
 const prior=memory,cap={EventContinuant:spec.capacity,Interoceptive:8};
 if(spec.law==='SignificanceFirst'||spec.law==='SharedProtection')memory=(spec.law==='SignificanceFirst'?retainSignificanceFirst:retainSharedProtectionTier)(memory,42n,cap).acquisitions;
 else memory=(spec.law==='UseOnly'?retainWithUseProtection:retainByRecency)(memory,42n,cap).acquisitions.map(a=>({...a,units:a.units.map(u=>({...u,useProtection:prior.find(p=>p.id===a.id)!.units[0].useProtection,outcomeSignificanceDirections:prior.find(p=>p.id===a.id)!.units[0].outcomeSignificanceDirections}))}));
 history=new Map(settleEventPresentationHistory({now:42n,priorAcquisitions:prior.map(({id,kind,acquiredAt})=>({id,kind,acquiredAt})),formed:[],survivingAcquisitions:memory.map(a=>a.id),priorHistory:[...history].map(([acquisition,instants])=>({acquisition,instants})),presentations:[]}).map(r=>[r.acquisition,r.instants]));stages.push(definingStageBytes({memory,history}));
 const report=spec.report==='missing'?null:spec.report==='original'?interval(30,31):interval(20,21),current=assess(report,43n);stages.push(definingStageBytes({report,current}));
 const final=eventRecall(BigInt(spec.now),1,spec.cue);let occurrence=BigInt(spec.now)*100n;const publication=publishRecollections(final.view,()=>occurrence++);takeEventPresentation(publication);
 const view={goals,historical,attribution,rehearsals,current,report,memory,history,scores:final.evaluation.scores,publication};stages.push(definingStageBytes(view));
 return {view,stages,bytes:definingStageBytes(view)};
}
export function definingMeaningCases(){const rows:MeaningSpec[]=[],add=(changes:Partial<MeaningSpec>)=>{const s:MeaningSpec={law:'SignificanceFirst',goal:'High',rehearsals:0,capacity:1,now:50,cue:'matching',report:'original',worldAfter:30,...changes};if(!rows.some(r=>JSON.stringify(r)===JSON.stringify(s)))rows.push(s);};
 for(const goal of ['High','Low','Wide','Absent'] as const){for(const law of definingLaws)add({goal,law});for(const change of [{rehearsals:3},{now:400},{now:4000},{capacity:0},{capacity:8},{cue:'absent'},{report:'contrary'},{report:'missing'},{worldAfter:20},{report:'contrary',worldAfter:20},{rehearsals:3,now:4000},{capacity:0,report:'contrary'},{capacity:8,rehearsals:3}] as const)add({goal,...change});}return rows;}
