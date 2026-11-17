import {it,expect,vi} from 'vitest';
import {eventBindingValue} from '../semanticBinding/semanticEvidenceCodecs';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import * as phases from '../semanticBinding/phaseOrdering';
import * as appearance from '../assembled/semanticAppearance';
import {fullExperienceValue,CONTINUANT_FEATURES,EVENT_FEATURES} from '../assembled/semanticAppearance';
import {projectObserver,projectAllObservers,truthBindings,createRunAllocator,OBSERVER_AFFORDANCES,TRACK_FEATURES,type ObserverProjection,observerSemanticView} from './fixtures/phenSem001';
import {SEMANTIC_OCCURRENCE_NAMESPACES} from '../semanticBinding/semanticSchemaRegistry';
import {semanticRecordValue,restorePerceptualReferentId,observerIdValue} from '../semanticBinding/semanticCodecs';
import {PerceptualEventFeatureId as EF,PerceptualEventFacetId as EFacet} from '../semanticBinding/perceptualEventClassification';
import {PerceptualFeatureId as CF,PerceptualFacetId as CFacet} from '../semanticBinding/perceptualClassification';
import {restoreAuthoritativeState} from '../substrate/state';
import {personPath,personMean} from '../assembled/social';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {unsigned as u} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {sid} from '../assembled/skill';
import {fixture,MINA,DARIUS,GLEN,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledSemanticReplay';
type Full=phases.StagedSemanticExperience['experience'];
const snap=(r:Run)=>r.snapshot();
async function through(r:Run,at:bigint){for(let n=0;r.snapshot().clock<at;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<96;n++){const more=await r.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('M144 full queue cap');}
const trackKey=(t:Full['perceivedBindings'][number]['perceptualReferentId'])=>t.observerId+'/'+t.observerTrackSequence;
function semanticView(full:Full,labels:Map<string,string>){return full.perceivedBindings.map(b=>{
 const facets=full.perceptualClassifications.filter(c=>trackKey(c.perceptualReferentId)===trackKey(b.perceptualReferentId)).map(c=>c.perceptualFacetId+'='+c.typedPerceivedValue).sort();
 return labels.get(trackKey(b.perceptualReferentId))+'|'+(b.eventRoleEvidence.kind==='exact'?b.eventRoleEvidence.eventRoleId:'unresolved')+'|'+facets.join(',');
}).sort();}
async function create(profile:Parameters<typeof fixture>[0],padding=false){
 const b=fixture(profile,padding),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};
}
async function capture(r:Run){
 let full:Full|undefined,context:Parameters<typeof appearance.classifyAppearance>[1]|undefined;const freeze=phases.freezeAndStageSemanticExperience,classify=appearance.classifyAppearance;
 const a=vi.spyOn(phases,'freezeAndStageSemanticExperience').mockImplementation((...args)=>{const result=freeze(...args);if(args[2]===14n&&args[1].occurredAt===2n)full=result.experience;return result;});
 const b=vi.spyOn(appearance,'classifyAppearance').mockImplementation((...args)=>{context??=args[1].at===2n?args[1]:undefined;return classify(...args);});
 try{await through(r,2n);}finally{a.mockRestore();b.mockRestore();}expect(full).toBeDefined();expect(context).toBeDefined();return {full:full!,context:context!};
}
function compare(x:Awaited<ReturnType<typeof create>>,full:Full){
 const original=projectObserver({observerId:x.b.observer,truth:truthBindings(x.b.requests),allocator:createRunAllocator(),experienceId:1n,occurredAt:2n,affordances:x.b.affordances});
 const originalLabels=new Map([...original.tracksByLabel].map(([label,t])=>[trackKey(t),label]));
 const transitions=outputs(snap(x.r).trace,160n).filter(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===11n;}).flatMap(t=>items(f(t,13n),'list')).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===217n).map(v=>restorePerceptualReferentId(f(rec(v,217n),3n)));
 expect(transitions).toHaveLength(x.b.labels.length);const labels=new Map(transitions.map((t,i)=>[trackKey(t),x.b.labels[i]]));
 expect(semanticView(full,labels)).toEqual(semanticView(original.experience,originalLabels));
 expect(full.perceivedBindings).toHaveLength(original.perceivedBindings.length);expect(full.perceptualEventReferentIds).toHaveLength(1);
 expect(full.perceptualEventClassifications).toHaveLength(0);
 const safe=new Set(full.supportingObservationIds.map(o=>o.observerId+'/'+o.observationId));
 for(const value of [...full.perceivedBindings,...full.perceptualClassifications])for(const o of value.supportingObservationIds)expect(safe.has(o.observerId+'/'+o.observationId)).toBe(true);
 const worlds=outputs(snap(x.r).trace,160n).filter(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(2))&&uint(f(e,3n))===0n;}).flatMap(t=>items(f(t,13n),'list')).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===210n).map(v=>rec(v,210n));
 const world=worlds.find(w=>key(f(w,2n))===key(text('event-type/skip-rope')))!;expect(world).toBeDefined();
 const truth=items(f(world,4n),'set').map(v=>rec(v,211n)).map(v=>key(f(v,2n))+'|'+key(f(v,3n))).sort();
 expect(truth).toEqual(truthBindings(x.b.requests).map(b=>rec(eventBindingValue(b),211n)).map(v=>key(f(v,2n))+'|'+key(f(v,3n))).sort());
 return {original,labels};
}

function featureGrid(context:Parameters<typeof appearance.classifyAppearance>[1]){
 const rope=[EF.ObservedRepeatedVerticalBodyMotion,EF.ObservedCyclicFlexibleContinuantArc,EF.ObservedBodyContinuantPassageCoordination],states=[undefined,false,true],run=(c:CanonicalValue[],e:CanonicalValue[])=>{let n=100000n;return appearance.classifyAppearance(appearance.appearanceSource(list([list(c),list(e)])),context,appearance.reserveAppearance(()=>n++));};
 let count=0;for(const a of states)for(const b of states)for(const c of states){
  const values=[a,b,c],rows=values.flatMap((value,i)=>value===undefined?[]:[list([text(rope[i]),value,true])]);
  if(a!==undefined)rows.push(list([text(EF.ObservedRepeatedMotionPattern),a,true]));if(b!==undefined)rows.push(list([text(EF.ObservedCoupledMotionAcrossContinuants),b,true]));
  const result=run([],rows),map=new Map(result.events.map(v=>[v.perceptualEventFacetId,v.typedPerceivedValue]));
  expect(map.get(EFacet.AppearsRopeSkippingPatternLike)).toBe(values.includes(false)?false:values.every(v=>v===true)?true:undefined);
  expect(map.get(EFacet.AppearsRepetitiveMotionLike)).toBe(a);expect(map.get(EFacet.AppearsCoupledMultiContinuantMotionLike)).toBe(b);expect(result.continuants).toHaveLength(0);count++;
 }
 const facets=[[CF.ObservedPersonForm,CFacet.AppearsPersonLike],[CF.ObservedDiscreteObjectForm,CFacet.AppearsDiscreteObjectLike],[CF.ObservedEnclosureForm,CFacet.AppearsInteriorSpaceLike],[CF.ObservedMetallicSurface,CFacet.AppearsMetallic],[CF.ObservedElongatedForm,CFacet.AppearsElongated],[CF.ObservedBluntForm,CFacet.AppearsBlunt]];
 for(const[feature,facet]of facets)for(const value of states){const result=run(value===undefined?[]:[list([text(feature),value,true])],[]);expect(result.continuants.map(c=>[c.perceptualFacetId,c.typedPerceivedValue])).toEqual(value===undefined?[]:[[facet,value]]);expect(result.events).toHaveLength(0);}
 expect(count).toBe(27);
}
it('profiles144: pinned observer and multi-role views run through one character',async()=>{
 const controls=projectAllObservers(),reverse=projectAllObservers({order:[GLEN,DARIUS,MINA],allocator:createRunAllocator(20000n)});
 for(const name of[MINA,DARIUS,GLEN])expect(observerSemanticView(controls.get(name)!)).toEqual(observerSemanticView(reverse.get(name)!));
 let identity:Uint8Array|undefined;
 for(const profile of[MINA,DARIUS,GLEN,'multi','repeat'] as const){
  const x=await create(profile),captured=await capture(x.r);compare(x,captured.full);
  if(identity)bytes(characterModelIdentity(x.m),identity);else identity=characterModelIdentity(x.m);
  if(profile===MINA){featureGrid(captured.context);const restored=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.r.save()}),repeat=await createCharacterRun(x.m,x.b.d);await through(repeat,2n);exact(x.r,repeat);exact(x.r,restored);await finish(x.r,[repeat,restored]);}
  else await finish(x.r);
 }
 console.info('M144 PROFILES PASS same model; pinned Mina/Darius/Glen and multi/repeat views/roles/facets/truth multiplicity; original reversed observer allocation; explicit native support;27 event conjunctions/18 continuant cases; repeat/save2/full queues');
},590000);
const namespaces=new Set(Object.values(SEMANTIC_OCCURRENCE_NAMESPACES));
function opaqueView(values:readonly CanonicalValue[]){
 const maps=new Map<bigint,Map<string,bigint>>();
 const visit=(v:CanonicalValue):CanonicalValue=>{
  if(typeof v==='boolean')return v;
  if(v.kind==='typedIdentifier'){
   if(namespaces.has(v.namespaceId)){const m=maps.get(v.namespaceId)??new Map<string,bigint>(),k=key(v.payload);if(!m.has(k))m.set(k,BigInt(m.size));maps.set(v.namespaceId,m);return {...v,payload:u(m.get(k)!)};}
   return {...v,payload:visit(v.payload)};
  }
  if(v.kind==='record')return {...v,fields:new Map([...v.fields].map(([n,x])=>[n,visit(x)]))};
  if(v.kind==='list'||v.kind==='set')return {...v,items:v.items.map(visit)};
  if(v.kind==='map')return {...v,entries:v.entries.map(([a,b])=>[visit(a),visit(b)] as const)};
  return v;
 };
 return {value:list(values.map(visit)),maps};
}
function semRecords(r:Run){return items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId>=212n&&v.schema.typeId<=240n);}
function probability(r:Run,b:ReturnType<typeof fixture>){
 const rows=items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(JOINT_APPRAISAL))).map(v=>items(v,'list')),joint=rows.at(-1)!;
 for(const task of[b.taskA,b.taskB])expect(items(joint[4],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(task)),'live appraisal22').toHaveLength(5);
 const d=outputs(snap(r).outputs,409n).find(d=>key(f(d,2n))===key(signed(22)))!,result=rec(f(d,4n),419n);expect(uint(f(result,1n)),'resolved choice22').toBe(3n);
 const data=rec(f(result,2n),420n),isB=(v:CanonicalValue)=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')),row=items(f(data,2n),'list').map(v=>rec(v,421n)).find(v=>isB(f(v,1n)));
 return uint(f(data,8n))===1n?Q.of(isB(f(data,1n))?1n:0n):row?readQ(f(row,2n)):Q.of(0n);
}
it('ordinals144: unobserved world allocations cannot alter semantic structure or live probability',async()=>{
 const a=await create(GLEN),b=await create(GLEN,true);bytes(characterModelIdentity(a.m),characterModelIdentity(b.m));
 const ca=await capture(a.r),cb=await capture(b.r);compare(a,ca.full);compare(b,cb.full);expect(key(fullExperienceValue(ca.full))).not.toBe(key(fullExperienceValue(cb.full)));
 await through(a.r,3n);await through(b.r,3n);
 const av=opaqueView(semRecords(a.r)),bv=opaqueView(semRecords(b.r));expect(key(av.value)).toBe(key(bv.value));expect(av.maps.size).toBeGreaterThanOrEqual(8);
 const sa=restoreAuthoritativeState(decode(snap(a.r).state)),sb=restoreAuthoritativeState(decode(snap(b.r).state));expect(personMean(sa.read(personPath(C,target)).value)).toEqual(personMean(sb.read(personPath(C,target)).value));
 await through(a.r,22n);await through(b.r,22n);expect(probability(a.r,a.b).equals(probability(b.r,b.b))).toBe(true);
 for(const x of[a,b])await finish(x.r);
 console.info('M144 ORDINAL PASS extra hidden governed world changes raw allocation; consistent typed bijection preserves all native SEM through correction3, belief and live exact choice probability22; full queues; no equal-draw claim');
},590000);
