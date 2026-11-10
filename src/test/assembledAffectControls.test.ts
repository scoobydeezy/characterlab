/** M79: scenarios/declarations in fixture and committed CURRENT card bd19c67f.
 * All gates use actual producer/receiver data; original laws are projections only. */
import {it,expect} from 'vitest';
import {list,unsigned as u,signed,typedIdentifier,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,decode,items,key,type Mode} from './fixtures/assembledAffectControls';
import {snap,through,finish,knowledge,bytes,exact,projection,probability,memory,allDraws,frac} from './fixtures/assembledAffectReceiving';
import {changeDefinition} from './fixtures/assembledCharacter';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {receivingRecord as rec} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {validateMitigationPacket} from '../assembled/mitigation';
import {REAPPRAISAL_OBSERVE} from '../assembled/reappraisal';
import {affectRecord as ar} from '../campaign3/affectCodecs';
import {beliefRecord as br} from '../campaign3/beliefCodecs';
import {deriveAffectEvidence} from '../campaign3/affectSource';
import {applyBeliefEvidence,classifyBeliefSample} from '../campaign3/beliefMath';
import {OBSERVER_NAME as ORIGINAL_OBSERVER,PROPOSITIONS} from '../campaign3/affectModel';
import {perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';

async function create(mode:Mode,at=10n){const b=fixture(mode),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
const trace=(r:Run)=>outputs(snap(r).trace,160n);
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const json=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
function sourceProof(r:Run){
 const k=knowledge(r),legacy:CanonicalValue[]=[],samples:CanonicalValue[]=[],ts=trace(r);
 for(const row of k.rows){
  const packet=items(row,'list')[8];if(!items(packet,'list').length)continue;
  const x=validateMitigationPacket(packet),out=x.outcome;
  const producer=ts.find(t=>uint(f(event(t),1n))===x.producer)!;
  expect(producer,'actual safe-packet producer').toBeDefined();expect(items(f(producer,13n),'list')).toContainEqual(packet);
  const observed=ts.find(t=>key(f(event(t),5n))===key(REAPPRAISAL_OBSERVE)&&key(f(t,13n))===key(row))!;
  expect(observed,'actual receiving observation').toBeDefined();expect(items(f(event(observed),8n),'list')).toContainEqual(u(x.producer));
  expect(items(f(observed,12n),'list')[1]).toEqual(packet);
  const context=perceptualEventReferentIdValue({...x.experience.perceptualEventReferentIds[0],observerId:ORIGINAL_OBSERVER});
  const sample=ar(750,new Map<bigint,CanonicalValue>([[1n,x.observation],[2n,signed(x.experience.occurredAt)],[3n,u(['Before','Motion','After'].indexOf(x.role)+1)],[4n,u(x.glyph)],[5n,u(x.action)],[6n,out[0]??false],[7n,out[1]??false],[8n,out[2]??false],[9n,u(0)],[11n,context]]));
  const frozen=ar(751,[typedIdentifier(1151,u(x.experience.experienceId)),sample,preRecognitionSemanticExperienceValue({...x.experience,observerId:ORIGINAL_OBSERVER,perceptualEventReferentIds:x.experience.perceptualEventReferentIds.map(c=>({...c,observerId:ORIGINAL_OBSERVER})),supportingObservationIds:x.experience.supportingObservationIds.map(o=>({...o,observerId:ORIGINAL_OBSERVER}))})]);
  const derived=rec(deriveAffectEvidence(legacy,frozen,typedIdentifier(1151,u(x.experience.experienceId))),752n);legacy.push(frozen);
  const evidence=derived.fields.get(4n);if(evidence&&key(f(rec(evidence,737n),3n))===key(PROPOSITIONS[0]))samples.push(evidence);
 }
 return {k,samples};
}
function learnedProjection(samples:CanonicalValue[],law:number){
 let prior:CanonicalValue|undefined;
 for(const s of samples)prior=applyBeliefEvidence(prior,br(741,[typedIdentifier(1150,u(1)),s,u(classifyBeliefSample(s))]),law).next;
 return prior?readQ(f(rec(prior,739n),1n)):undefined;
}
function live(r:Run,unknown=false,half=false){
 const p=projection(r,unknown?'denied':'normal');
 if(unknown){expect(items(p.a[6],'list')).toEqual([]);expect(p.signal(taskA,2n)).toEqual([]);}
 else {
  const value=q(119,half?1200:600);expect(p.a[6]).toEqual(list([value,value]));
  expect(p.signal(taskA,2n)).toHaveLength(1);expect(f(p.signal(taskA,2n)[0],2n)).toEqual(value);
 }
 expect(probability(p.data,p.A)).toEqual(unknown||half?Q.of(1n,2n):Q.of(47n,72n));
 return p;
}
it('M79 history: contradictory safe evidence and hidden truth',async()=>{
 const a=await create('historyRisk',8n),b=await create('contradiction',8n);
 expect(a.b.s).toEqual(b.b.s);bytes(a.b.d.initialState,b.b.d.initialState);bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);
 expect(knowledge(a.r).efficacy!.cue!.mean).toEqual(Q.of(1n));expect(knowledge(a.r).efficacy!.cue!.supports).toHaveLength(1);
 await through(a.r,10n);await through(b.r,10n);
 const pa=live(a.r),pb=live(b.r,false,true),sa=sourceProof(a.r),sb=sourceProof(b.r);
 for(const [s,mean] of [[sa,Q.of(1n)],[sb,Q.of(1n,2n)]] as const){
  expect(s.k.efficacy!.cue!.supports).toHaveLength(2);expect(s.k.efficacy!.cue!.mean).toEqual(mean);
  expect(s.samples).toHaveLength(2);expect(learnedProjection(s.samples,1)).toEqual(mean);
  for(const support of s.k.efficacy!.cue!.supports)expect(items(support,'list').map(v=>validateMitigationPacket(v).role)).toEqual(['Before','Motion','After']);
 }
 expect(sb.samples.map(s=>f(rec(s,737n),7n))).toEqual([true,false]);
 expect(learnedProjection(sb.samples,2)).toEqual(Q.of(0n));expect(learnedProjection(sb.samples,3)).toBeUndefined();
 expect(pa.nucleus(taskA).map(n=>f(n,4n))).toEqual(pb.nucleus(taskA).map(n=>f(n,4n)));
 expect(pa.nucleus(taskA).map(n=>f(n,6n))).toEqual([signed(1)]);expect(pb.nucleus(taskA).map(n=>f(n,6n))).toEqual([signed(0)]);
 const h=await create('hidden'),ph=live(h.r,false,true);sourceProof(h.r);
 expect(knowledge(h.r)).toEqual(knowledge(b.r));
 for(const k of ['a','raw','d'] as const)expect(ph[k]).toEqual(pb[k]);
 expect(allDraws(h.r)).toEqual(allDraws(b.r));expect(allDraws(h.r).length).toBeGreaterThan(0);
 expect(key(decode(snap(h.r).trace))).not.toBe(key(decode(snap(b.r).trace)));
 await through(b.r,11n);await through(h.r,11n);const mb=memory(b.r),mh=memory(h.r);
 for(const k of ['gain','scores','selected','episodes'] as const)expect(mh[k]).toEqual(mb[k]);
 console.info('M79 HISTORY PASS '+json({supports:2,mean:'1/2',latest:'0/1',noLearning:'unknown',referenceProbability:'47/72',contradictionProbability:'1/2',U:'119/1200',hiddenMatchedDraws:allDraws(h.r).length,recallGain:mb.gain,selected:mb.selected}));
},540000);

for(const [group,modes] of [
 ['source',['missingAction','deniedMotion','censored','noop']],
 ['catalogue',['zeroBaseline','unknownCatalogue','emptyCatalogue','ineffective']]
] as const)it('M79 boundaries '+group,async()=>{
 for(const mode of modes){
  const {r}=await create(mode),unknown=mode!=='emptyCatalogue'&&mode!=='ineffective',p=live(r,unknown),{k}=sourceProof(r),e=k.efficacy!;
  expect(e.cue!.mean).toEqual(Q.of(1n));expect(e.cue!.supports).toHaveLength(1);
  if(group==='source'){expect(e.control).toBeUndefined();expect(e.means[0]).toEqual(Q.of(1n));expect(e.means[1]).toBeUndefined();expect(e.supports).toHaveLength(1);}
  else if(mode==='zeroBaseline'){expect(e.means).toEqual([Q.of(0n),Q.of(1n)]);expect(e.control).toBeUndefined();expect(e.supports).toHaveLength(2);}
  else {expect(e.means).toEqual([Q.of(1n),Q.of(1n)]);expect(e.control).toEqual(Q.of(0n));expect(e.supports).toHaveLength(2);}
  await through(r,11n);const m=memory(r,unknown);expect(m.gain).toBe(unknown?'1/1':'719/600');
  console.info('M79 BOUNDARY '+json({mode,status:p.a[5],efficacy:e.control?e.control.numerator+'/'+e.control.denominator:'unknown',supports:e.supports.length,probability:frac(f(rec(items(f(p.data,2n),'list').find(v=>key(f(rec(v,421n),1n))===key(p.A))!,421n),2n)),recallGain:m.gain}));
 }
},540000);

it('M79 physical: normal failed attempt cannot rewrite prior reasoning',async()=>{
 const a=await create('ineffective',9n),b=await create('failed',9n);
 expect(a.b.d).toEqual(b.b.d);expect(a.b.s.registry).not.toEqual(b.b.s.registry);
 for(const r of [a.r,b.r])expect(outputs(snap(r).outputs,433n),'no earlier execution').toEqual([]);
 bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);
 const prior=knowledge(a.r).efficacy;
 await through(a.r,10n);await through(b.r,10n);const pa=live(a.r),pb=live(b.r);
 for(const k of ['a','raw','d'] as const)expect(pa[k]).toEqual(pb[k]);
 for(const type of [425n,426n,431n,432n]){
  const x=outputs(snap(a.r).outputs,type),y=outputs(snap(b.r).outputs,type);expect(x,'live earlier stage '+type).toHaveLength(1);expect(y).toEqual(x);
 }
 const old=fixture('ineffective',true),oldModel=await prepareCharacterModel(old.s),oldRun=await createCharacterRun(oldModel,old.d);await through(oldRun,10n);
 bytes(snap(a.r).state,snap(oldRun).state);bytes(snap(a.r).outputs,snap(oldRun).outputs);
 expect(allDraws(a.r)).toEqual(allDraws(oldRun));expect(a.r.runIdentity()).not.toEqual(oldRun.runIdentity());
 console.info('M79 VERSION PASS0.72/0.73 permitted exact state/output/actual draw equality at10; identity distinct.');
 const outA=outputs(snap(a.r).outputs,433n),outB=outputs(snap(b.r).outputs,433n);
 expect(outA).toHaveLength(1);expect(outB).toHaveLength(1);expect(f(outA[0],2n)).toEqual(f(outB[0],2n));
 expect(uint(f(outA[0],3n))).toBeGreaterThan(0n);expect(uint(f(outB[0],3n))).toBe(0n);
 const ta=trace(a.r).find(t=>key(f(t,13n))===key(outA[0]))!,tb=trace(b.r).find(t=>key(f(t,13n))===key(outB[0]))!;
 expect(ta).toBeDefined();expect(tb).toBeDefined();expect(f(event(ta),3n)).toEqual(u(110));expect(f(event(tb),3n)).toEqual(u(110));
 expect(f(event(ta),6n)).toEqual(f(outA[0],2n));expect(f(event(tb),6n)).toEqual(f(outB[0],2n));
 expect(allDraws(a.r).length).toBeGreaterThan(0);expect(allDraws(a.r)).toEqual(allDraws(b.r));
 const frozen=[a.r,b.r].map(r=>items(decode(snap(r).outputs),'list'));
 for(const r of [a.r,b.r]){
  expect(knowledge(r).efficacy).toEqual(prior);sourceProof(r);expect(r.diagnostic()).toBeUndefined();
  await through(r,11n);memory(r);expect(knowledge(r).efficacy).toEqual(prior);await finish(r);expect(knowledge(r).efficacy).toEqual(prior);
 }
 for(const [i,r] of [a.r,b.r].entries())expect(items(decode(snap(r).outputs),'list').slice(0,frozen[i].length)).toEqual(frozen[i]);
 expect(knowledge(a.r)).toEqual(knowledge(b.r));
 console.info('M79 PHYSICAL PASS '+json({successCount:String(uint(f(outA[0],3n))),failureCount:'0',sameEarlierStages:true,matchedDraws:allDraws(a.r).length,unchangedThreatSupports:prior!.cue!.supports.length,terminal:'101'}));
},540000);

it('M79 persistence: contradiction and failed execution',async()=>{
 for(const [mode,checkpoint] of [['contradiction',8n],['failed',9n]] as const){
  const a=await create(mode,checkpoint),repeat=await createCharacterRun(a.m,a.b.d);await through(repeat,checkpoint);exact(a.r,repeat);
  const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.r.save()});exact(a.r,restored);
  for(const r of [a.r,repeat,restored]){await through(r,10n);live(r,false,mode==='contradiction');await through(r,11n);memory(r);await finish(r);}
  exact(a.r,repeat);exact(a.r,restored);
  console.info('M79 PERSISTENCE '+mode+' PASS '+checkpoint+'->10->11->101 exact state/output/trace/save/identity');
 }
},540000);

it('M79 admission: versioned Boolean only, no topology widening',async()=>{
 const current=fixture('ineffective'),oldBlocked=fixture('failed',true);
 await expect(prepareCharacterModel(oldBlocked.s)).rejects.toThrow('undeclared topology change');
 await expect(prepareCharacterModel(changeDefinition(current.s,'definition/protocol-execution',1n,u(0)))).rejects.toThrow('Boolean required');
 await expect(prepareCharacterModel({...current.s,registrySchemaVersion:oldBlocked.s.registrySchemaVersion})).rejects.toThrow('unsupported assembled model version bundle');
 await expect(prepareCharacterModel(changeDefinition(current.s,'definition/task-concern',2n,false))).rejects.toThrow();
 console.info('M79 ADMISSION PASS old false, wrong type, mismatched version and unrelated closed declaration reject.');
},540000);
