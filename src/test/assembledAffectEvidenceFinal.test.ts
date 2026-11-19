/** M184 e0a9aeae: source meaning is checked at the actual shared consumers. */
import {it,expect} from 'vitest';
import {fixture,type Mode} from './fixtures/assembledAffectEvidenceFinal';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {decode,items,key,enc,list,text,u,signed,q,C,rec,f,uint,bytes,outputs,exact,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {restoreCharacterRun} from '../assembled/character';
import {SHARED_AFFECT_APPRAISAL,REAPPRAISAL_OBSERVE,reappraisalPath,reappraisalKnowledge} from '../assembled/reappraisal';
import {STRESS,STRESS_APPLY,stressPath,stressAnchor} from '../assembled/regulatoryStress';
import {validateMitigationPacket} from '../assembled/mitigation';
import {dataRecord as metadataRecord} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {affectRecord as ar} from '../campaign3/affectCodecs';
import {beliefRecord as br} from '../campaign3/beliefCodecs';
import {deriveAffectEvidence} from '../campaign3/affectSource';
import {applyBeliefEvidence,classifyBeliefSample} from '../campaign3/beliefMath';
import {OBSERVER_NAME as ORIGINAL_OBSERVER,PROPOSITIONS} from '../campaign3/affectModel';
import {perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M184 time');return v.value;};
const event=(t:ReturnType<typeof rec>)=>rec(f(t,4n),130n);
const tag=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='list'&&typeof v.items[0]!=='boolean'&&v.items[0]?.kind==='text'?v.items[0].value:'';
function build(r:Run){const s=r.snapshot();return {s,state:restoreAuthoritativeState(decode(s.state)),trace:outputs(s.trace,160n),out:items(decode(s.outputs),'list')};}
const cache=new WeakMap<Run,ReturnType<typeof build>>();
function view(r:Run){let v=cache.get(r);if(!v||v.s!==r.snapshot()){v=build(r);cache.set(r,v);}return v;}
const trace=(r:Run)=>view(r).trace;
const knowledge=(r:Run)=>reappraisalKnowledge(view(r).state.read(reappraisalPath(C)).value,C,true,true,true,true);
const reports=(r:Run,label:string)=>view(r).out.filter(v=>tag(v)===label).map(v=>items(v,'list'));
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){const prior=knowledge(r);for(let n=0;await r.settleNextInstant();n++){expect(n).toBeLessThan(96);expect(knowledge(r),'later physical stress is not danger evidence').toEqual(prior);}expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
function declarations(b:ReturnType<typeof fixture>){
 const slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(55);const body=items(slots[6],'list');expect(body).toEqual([text('assembled-body/0.2'),q(100,1),q(1,1),q(20,1),q(60,1),true,true,signed(0)]);
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>metadataRecord(v,171n));
 const protocol=rows.find(r=>{const id=f(r,1n);return typeof id!=='boolean'&&id.kind==='typedIdentifier'&&typeof id.payload!=='boolean'&&id.payload.kind==='text'&&id.payload.value==='definition/protocol-execution';})!;
 expect(f(metadataRecord(f(protocol,4n),434n),1n)).toBe(false);
 const task=items(slots[28],'list')[4];expect(items(items(slots[19],'list')[1],'list').flatMap(v=>items(items(v,'list')[1],'list')).some(v=>key(items(v,'list')[0])===key(task))).toBe(false);
 expect(b.d.runSeed).toEqual(new Uint8Array(32));
}
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

function live(r:Run,status:'Known'|'Unavailable',value?:CanonicalValue){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===10n)!;expect(a,'live appraisal before comparison').toBeDefined();expect(a[5]).toEqual(text(status));
 expect(a[6]).toEqual(list(status==='Known'?[value!,value!]:[]));
 const t=trace(r).find(t=>at(f(event(t),2n))===10n&&key(f(t,13n))===key(list(a)))!;expect(t,'actual phase50 producer').toBeDefined();expect(uint(f(event(t),3n))).toBe(50n);
 const joint=items(items(a[7],'list')[1],'list'),sample=rec(joint[2],461n);expect(f(sample,5n)).toEqual(rec(f(sample,5n),462n));expect([f(rec(f(sample,5n),462n),1n),f(rec(f(sample,5n),462n),2n)]).toEqual([q(40,1),q(60,1)]);
 expect(f(sample,6n)).toEqual(text('embodied-level-observation/0.2-candidate'));
 const consumer=trace(r).find(t=>{const input=f(t,12n);return at(f(event(t),2n))===10n&&uint(f(event(t),3n))===80n&&typeof input!=='boolean'&&input.kind==='list'&&input.items.some(v=>key(v)===key(list(a)));});
 expect(consumer,'actual reason-stage appraisal consumer').toBeDefined();expect(outputs(r.snapshot().outputs,408n).length).toBeGreaterThan(0);
 const d=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===10n)!;expect(d).toBeDefined();expect(uint(f(rec(f(d,4n),419n),1n))).toBe(1n);expect(outputs(r.snapshot().outputs,433n)).toHaveLength(0);
 for(const row of trace(r))expect(items(f(row,14n),'list')).toHaveLength(0);
 return {a,t};
}
function stress(r:Run,p:ReturnType<typeof live>,level:number){
 const a=reports(r,STRESS+'/applied').find(v=>at(v[1])===11n)!;expect(a,'actual later consumer').toBeDefined();const packet=items(a[2],'list');expect(packet[4]).toEqual(list(p.a));expect(packet[3]).toEqual(f(event(p.t),1n));expect(at(packet[2])).toBe(10n);
 expect(stressAnchor(a[4])).toEqual({at:11n,level});expect(stressAnchor(view(r).state.read(stressPath(C)).value!)).toEqual({at:11n,level});
 const t=trace(r).find(t=>at(f(event(t),2n))===11n&&key(f(event(t),5n))===key(STRESS_APPLY))!;expect(t).toBeDefined();expect(f(t,12n)).toEqual(a[2]);
 expect(items(a[5],'list')).toHaveLength(key(p.a[5])===key(text('Known'))?1:0);
}
it('final184 contradictory evidence and hidden physical truth',async()=>{
 const a=await startMemory(fixture('historyRisk')),b=await startMemory(fixture('contradiction')),h=await startMemory(fixture('hidden'));for(const x of[a,b,h])declarations(x.b);
 expect(a.b.s).toEqual(b.b.s);expect(b.b.s).toEqual(h.b.s);bytes(a.b.d.initialState,b.b.d.initialState);
 for(let n=0;a.run.snapshot().clock<8n;n++){expect(n).toBeLessThan(96);for(const r of[a.run,b.run,h.run])expect(await r.settleNextInstant()).toBe(true);for(const r of[b.run,h.run]){expect(r.snapshot().clock).toBe(a.run.snapshot().clock);bytes(a.run.snapshot().state,r.snapshot().state);bytes(a.run.snapshot().outputs,r.snapshot().outputs);}}expect(a.run.snapshot().clock).toBe(8n);
 expect(knowledge(a.run).efficacy!.cue!.mean).toEqual(Q.of(1n));expect(knowledge(a.run).efficacy!.cue!.supports).toHaveLength(1);
 for(let n=0;a.run.snapshot().clock<10n;n++){expect(n).toBeLessThan(96);for(const r of[a.run,b.run,h.run])expect(await r.settleNextInstant()).toBe(true);expect(b.run.snapshot().clock).toBe(h.run.snapshot().clock);bytes(b.run.snapshot().state,h.run.snapshot().state);bytes(b.run.snapshot().outputs,h.run.snapshot().outputs);}expect(a.run.snapshot().clock).toBe(10n);
 const pa=live(a.run,'Known',q(7,20)),pb=live(b.run,'Known',q(7,40));live(h.run,'Known',q(7,40));
 for(const [r,mean]of[[a.run,Q.of(1n)],[b.run,Q.of(1n,2n)],[h.run,Q.of(1n,2n)]] as const){const s=sourceProof(r);expect(s.k.efficacy!.cue!.mean).toEqual(mean);expect(s.k.efficacy!.cue!.supports).toHaveLength(2);expect(s.samples).toHaveLength(2);expect(learnedProjection(s.samples,1)).toEqual(mean);}
 const samples=sourceProof(b.run).samples;expect(samples.map(s=>f(rec(s,737n),7n))).toEqual([true,false]);expect(learnedProjection(samples,2)).toEqual(Q.of(0n));expect(learnedProjection(samples,3)).toBeUndefined();
 const fixed=knowledge(b.run);let reached=false;
 for(let n=0;n<96;n++){
  bytes(b.run.snapshot().state,h.run.snapshot().state);bytes(b.run.snapshot().outputs,h.run.snapshot().outputs);expect(knowledge(b.run)).toEqual(fixed);
  const more=await b.run.settleNextInstant();expect(await h.run.settleNextInstant()).toBe(more);expect(await a.run.settleNextInstant()).toBe(more);
  if(more&&b.run.snapshot().clock===11n){stress(a.run,pa,175);stress(b.run,pb,88);stress(h.run,pb,88);reached=true;}if(!more)break;if(n===95)throw Error('M184 full queue cap');
 }
 expect(reached).toBe(true);expect(key(decode(b.run.snapshot().trace))).not.toBe(key(decode(h.run.snapshot().trace)));
 for(const r of[a.run,b.run,h.run]){expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
 console.info('M184 HISTORY PASS every settled safe prefix through8, every hidden pair instant through101; two actual cue supports Mean1/1 vs1/2 -> U7/20 vs7/40 -> stress175/88. Original Mean1/2 Latest0 NoLearning unknown on exact admitted packets. Hidden truth preserves all state/output through101; later stress adds no danger evidence.');
},550000);
for(const [group,modes]of[
 ['source',['missingAction','deniedMotion','censored','noop']],
 ['catalogue',['zeroBaseline','unknownCatalogue','emptyCatalogue','ineffective']]
] as const)it('final184 boundaries '+group,async()=>{
 for(const mode of modes){const x=await startMemory(fixture(mode));declarations(x.b);await through(x.run,10n);const unknown=mode!=='emptyCatalogue'&&mode!=='ineffective',p=live(x.run,unknown?'Unavailable':'Known',unknown?undefined:q(7,20)),s=sourceProof(x.run),e=s.k.efficacy!;
  expect(e.cue!.mean).toEqual(Q.of(1n));expect(e.cue!.supports).toHaveLength(1);expect(s.samples).toHaveLength(1);expect(learnedProjection(s.samples,1)).toEqual(Q.of(1n));
  if(group==='source'){expect(e.control).toBeUndefined();expect(e.means[0]).toEqual(Q.of(1n));expect(e.means[1]).toBeUndefined();expect(e.supports).toHaveLength(1);}
  else if(mode==='zeroBaseline'){expect(e.means).toEqual([Q.of(0n),Q.of(1n)]);expect(e.control).toBeUndefined();expect(e.supports).toHaveLength(2);}
  else{expect(e.means).toEqual([Q.of(1n),Q.of(1n)]);expect(e.control).toEqual(Q.of(0n));expect(e.supports).toHaveLength(2);}
  if(group==='catalogue')expect(s.k.mitigation).toBe(mode==='unknownCatalogue'?0n:mode==='emptyCatalogue'?1n:2n);
  await through(x.run,11n);stress(x.run,p,unknown?0:175);await finish(x.run);
  console.info('M184 BOUNDARY PASS '+mode+' status='+ (unknown?'Unavailable':'Known')+' supports='+e.supports.length+' U='+(unknown?'absent':'7/20')+' stress11='+(unknown?0:175)+' terminal101');
 }
},550000);
it('final184 contradiction exact repeat and public continuation',async()=>{
 const a=await startMemory(fixture('contradiction')),repeat=await startMemory(fixture('contradiction'));for(const r of[a.run,repeat.run])await through(r,8n);exact(a.run,repeat.run);
 const restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);let p:ReturnType<typeof live>|undefined,reached=false;
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();for(const r of[repeat.run,restored]){expect(await r.settleNextInstant()).toBe(more);exact(a.run,r);}if(more&&a.run.snapshot().clock===10n)p=live(a.run,'Known',q(7,40));if(more&&a.run.snapshot().clock===11n){expect(p).toBeDefined();stress(a.run,p!,88);reached=true;}if(!more)break;if(n===95)throw Error('M184 persistence cap');}
 expect(reached).toBe(true);for(const r of[a.run,repeat.run,restored]){expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
 console.info('M184 CONTINUATION PASS independent repeat/public save8: every later complete byte through101, crossing admitted contradiction9, appraisal10, stress11 and later memory/cognition.');
},550000);
