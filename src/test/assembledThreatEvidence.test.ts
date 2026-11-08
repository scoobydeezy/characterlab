import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,rational as q,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,enc,type Mode} from './fixtures/assembledThreatEvidence';
import {receivingRecord as rec,cognitiveRecord as cr} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {OBSERVED_THREAT_VERSION,SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath} from '../assembled/reappraisal';
import {GROUNDED_AFFECT_REGISTRY} from '../assembled/model';
import * as substrateState from '../substrate/state';
import {reappraisalKnowledge,REAPPRAISAL_OBSERVE} from '../assembled/reappraisal';
import {validateMitigationPacket} from '../assembled/mitigation';
import {affectRecord as ar} from '../campaign3/affectCodecs';
import {deriveAffectEvidence} from '../campaign3/affectSource';
import {OBSERVER_NAME as ORIGINAL_OBSERVER,PROPOSITIONS} from '../campaign3/affectModel';
import {perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {preRecognitionSemanticExperienceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {arbitrationOutput} from '../assembled/arbitration';
import {randomAddressValue,naturalRandomKeyValue} from '../substrate/random';
import {sid} from '../assembled/skill';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
const cache=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let v=cache.get(r);if(!v){v=r.snapshot();cache.set(r,v);}return v;};
async function step(r:Run){cache.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(32);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(32);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const trace=(r:Run)=>outputs(snap(r).trace,160n),event=(t:ReturnType<typeof trace>[number])=>rec(f(t,4n),130n);
const reports=(r:Run,tag:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const frac=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const dec=(r:Run)=>outputs(snap(r).outputs,409n).find(v=>signedValue(f(v,2n))===10n)!;
const result=(d:CanonicalValue)=>{const s=rec(f(rec(d,409n),4n),419n);expect(uint(f(s,1n)),'live resolved choice').toBe(3n);return rec(f(s,2n),420n);};
const definition=(s:ReturnType<typeof fixture>['s'],name:string)=>f(rec(items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!,171n),4n);
function projection(r:Run,live=true){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===10n)!;expect(a).toBeDefined();
 const provenance=items(a[7],'list');expect(provenance[0]).toEqual(taskA);
 const decision=dec(r);expect(decision).toBeDefined();const data=result(decision),context=rec(f(decision,3n),408n),raw=rec(f(context,2n),403n);
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n)),ns=items(f(context,3n),'list').map(v=>rec(v,407n));
 const signal=(task:CanonicalValue,role:bigint)=>signals.filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(task)&&uint(f(k,3n))===role;});
 const forTask=(task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(task,371n),2n)));
 if(live){for(const task of [taskA,taskB]){expect(signal(task,1n),'live positive existing base').toHaveLength(1);expect(readQ(f(signal(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);expect(forTask(task),'live compiled task reason').toHaveLength(1);}expect(ns).toHaveLength(2);expect(new Set(ns.map(n=>key(f(rec(f(n,1n),404n),1n)))).size,'distinct live competing actions').toBe(2);}
 const receive=trace(r).find(t=>txt(f(t,6n))===OBSERVED_THREAT_VERSION&&signedValue(f(event(t),2n))===10n&&uint(f(event(t),3n))===80n)!;expect(receive).toBeDefined();
 const input=items(f(receive,12n),'list');expect(input[1]).toEqual(list(a));
 const producer=trace(r).find(t=>uint(f(event(t),1n))===uint(input[2])&&key(f(t,13n))===key(list(a)))!;expect(producer).toBeDefined();expect(txt(f(producer,6n))).toBe(OBSERVED_THREAT_VERSION);
 expect(items(f(producer,11n),'list')).toHaveLength(3);expect(items(f(receive,14n),'list')).toEqual([]);
 expect(f(rec(f(receive,13n),403n),3n)).toEqual(f(raw,3n));
 const concern=trace(r).find(t=>txt(f(t,6n))===OBSERVED_THREAT_VERSION&&signedValue(f(event(t),2n))===10n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===388n)!;expect(concern).toBeDefined();expect(items(f(concern,12n),'list')[1]).toEqual(list(a));
 // Actual outcome ancestry proves this context reaches execution, not just a diagnostic projection.
 expect(outputs(snap(r).outputs,433n).some(o=>{const attempt=rec(f(o,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return key(f(intent,2n))===key(decision);})).toBe(true);
 expect(state(r).read(framePath(C)).presence).toBe(false);
 return {a,provenance,decision,data,context,raw,ns,signal,forTask,receive};
}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
async function create(mode:Mode,at=10n){const b=fixture(mode),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
async function exactProof(s:ReturnType<typeof fixture>['s'],runs:Run[]){
 const def=definition(s,'task-arbitration'),resolutions=runs.map(dec),rs=resolutions.map(result),contexts=resolutions.map(d=>rec(f(d,3n),408n)),ns=contexts.map(c=>items(f(c,3n),'list').map(n=>rec(n,407n)));
 expect(ns[0].map(n=>f(n,4n))).toEqual(ns[1].map(n=>f(n,4n)));
 expect(ns[0].map(n=>f(n,1n))).toEqual(ns[1].map(n=>f(n,1n)));
 const candidates=ns[0].map(n=>f(rec(f(n,1n),404n),1n)),sizes=ns[0].map(n=>uint(f(n,4n)));expect(sizes).toHaveLength(2);
 const counts=[0n,0n],total=sizes[0]*sizes[1]*2n;let changed=0;
 for(let a=0n;a<sizes[0];a++)for(let b=0n;b<sizes[1];b++)for(let tie=0n;tie<2n;tie++){
  const winners:CanonicalValue[]=[];
  for(let arm=0;arm<2;arm++){
   const occ=f(resolutions[arm],1n),draw=(value:bigint,span:bigint,n?:CanonicalValue)=>{
    const k=n?rec(f(rec(n,407n),1n),404n):undefined,c=k?rec(f(k,1n),395n):rec(candidates[0],395n);
    const address={causalRootId:id(occ),purposeId:sid(1042,k?'purpose/task-reason-face':'purpose/task-decision-tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},...(k?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(k,3n))}]:[])],drawIndex:0n};
    return cr(411,[randomAddressValue(address),naturalRandomKeyValue(address),u(value),u(span),u(((1n<<128n)/span)*span),false,list([cr(410,[u(0),u(value),false])])],1);
   };
   const out=await arbitrationOutput(occ,10n,contexts[arm],def,{async reason(n){const first=key(f(rec(f(rec(n,407n),1n),404n),1n))===key(candidates[0]);return draw(first?a:b,first?sizes[0]:sizes[1],n);},async tie(leaders){expect(leaders).toHaveLength(2);return draw(tie,2n);}},3),data=result(out),winner=f(data,1n);
   expect(f(data,2n)).toEqual(f(rs[arm],2n));winners.push(winner);if(key(winner)===key(candidates[0]))counts[arm]++;
  }
  if(key(winners[0])!==key(winners[1]))changed++;
 }
 console.info('M70 DIAGNOSTIC '+JSON.stringify({changed,cases:String(total),counts:counts.map(String),modes:rs.map(r=>String(uint(f(r,8n)))),probabilities:rs.map(r=>items(f(r,2n),'list').map(v=>frac(f(rec(v,421n),2n)))),nuclei:ns.map(xs=>xs.map(n=>({roles:[1n,2n,3n].map(i=>frac(f(rec(f(n,2n),406n),i))),die:String(uint(f(n,4n))),standing:String(signedValue(f(n,5n))),situation:String(signedValue(f(n,6n)))})))}));
 expect(changed).toBeGreaterThan(0);expect(counts[0]).not.toBe(counts[1]);
 for(let arm=0;arm<2;arm++){const probability=items(f(rs[arm],2n),'list').find(v=>key(f(rec(v,421n),1n))===key(candidates[0]))!;const actual=uint(f(rs[arm],8n))===1n?Q.of(key(f(rs[arm],1n))===key(candidates[0])?1n:0n):readQ(f(rec(probability,421n),2n));expect(actual.equals(Q.of(counts[arm],total))).toBe(true);}
 console.info('M70 EXACT '+JSON.stringify({cases:String(total),changed,firstCandidateWins:counts.map(String),probabilities:counts.map(n=>n+'/'+total),scope:'captured actual contexts; paired uniform faces and fair ties; no seed-pair claim'}));
}

const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true);
function sourceProof(r:Run){
 const k=knowledge(r),current=k.efficacy!.cue!,legacy:CanonicalValue[]=[];
 // Semantic projection of actual safe packets into the original source selector.
 // Observer identity is renamed; no claim of cross-model byte identity.
 for(const row of k.rows){
  const packet=items(row,'list')[8];if(!items(packet,'list').length)continue;
  const x=validateMitigationPacket(packet),out=x.outcome;
  const context=perceptualEventReferentIdValue({...x.experience.perceptualEventReferentIds[0],observerId:ORIGINAL_OBSERVER});
  const sample=ar(750,new Map<bigint,CanonicalValue>([[1n,x.observation],[2n,signed(x.experience.occurredAt)],[3n,u(['Before','Motion','After'].indexOf(x.role)+1)],[4n,u(x.glyph)],[5n,u(x.action)],[6n,out[0]??false],[7n,out[1]??false],[8n,out[2]??false],[9n,u(0)],[11n,context]]));
  const frozen=ar(751,[typedIdentifier(1151,u(x.experience.experienceId)),sample,preRecognitionSemanticExperienceValue({...x.experience,observerId:ORIGINAL_OBSERVER,perceptualEventReferentIds:x.experience.perceptualEventReferentIds.map(c=>({...c,observerId:ORIGINAL_OBSERVER})),supportingObservationIds:x.experience.supportingObservationIds.map(o=>({...o,observerId:ORIGINAL_OBSERVER}))})]);
  const derived=rec(deriveAffectEvidence(legacy,frozen,typedIdentifier(1151,u(x.experience.experienceId))),752n);legacy.push(frozen);
  if(x.glyph===0n&&x.role==='After'&&current.mean){
   const ev=rec(f(derived,4n),737n);expect(f(ev,3n)).toEqual(PROPOSITIONS[0]);expect([f(ev,5n),f(ev,6n),f(ev,7n)]).toEqual([true,true,current.mean.equals(Q.of(1n))]);
  }
  if(x.glyph===1n&&x.role==='After'){const ev=rec(f(derived,4n),737n);expect([key(PROPOSITIONS[1]),key(PROPOSITIONS[2])]).toContain(key(f(ev,3n)));}
  const producer=trace(r).find(t=>uint(f(event(t),1n))===x.producer)!;expect(producer).toBeDefined();expect(items(f(producer,13n),'list')).toContainEqual(packet);
  const observation=trace(r).find(t=>key(f(event(t),5n))===key(REAPPRAISAL_OBSERVE)&&key(f(t,13n))===key(row))!;expect(observation).toBeDefined();expect(items(f(event(observation),8n),'list')).toContainEqual(u(x.producer));
 }
 expect(k.efficacy!.means.map(v=>v?.equals(Q.of(1n)))).toEqual([true,true]);
 return k;
}
it('M70 connection: observed current cue reaches grounded choice',async()=>{
 const A=fixture('risk'),B=fixture('safe');expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);
 const m=await prepareCharacterModel(A.s),a=await createCharacterRun(m,A.d),b=await createCharacterRun(m,B.d);
 const dice=rec(definition(A.s,'task-reason-dice'),437n);console.info('M70 CALIBRATION '+JSON.stringify({threshold:frac(f(dice,2n)),situationUnit:frac(f(rec(f(dice,4n),439n),1n)),situationCap:String(uint(f(rec(f(dice,4n),439n),2n)))}));
 await through(a,8n);await through(b,8n);bytes(snap(a).state,snap(b).state);bytes(snap(a).outputs,snap(b).outputs);
 expect(knowledge(a).efficacy!.cue!.mean).toBeUndefined();
 await through(a,10n);await through(b,10n);const pa=projection(a),pb=projection(b),ka=sourceProof(a),kb=sourceProof(b);
 for(const [x,k,p] of [[pa,ka,1],[pb,kb,0]] as const){
  expect(txt(x.a[5]),'live completed affect').toBe('Known');
  expect(items(x.provenance[4],'list')).toEqual([q(p,1),q(1,1),q(59,60),q(0,1)]);
  expect(k.efficacy!.cue!.mean!.equals(Q.of(BigInt(p)))).toBe(true);expect(k.efficacy!.cue!.supports).toHaveLength(1);
  expect(x.provenance[7]).toEqual(k.efficacy!.cue!.provenance);
  expect(k.means[0]!.equals(Q.of(1n)),'legacy report stays positive').toBe(true);
 }
 expect(pa.a[6]).toEqual(list([q(119,120),q(119,120)]));expect(pb.a[6]).toEqual(list([q(0,1),q(0,1)]));
 expect(pa.signal(taskA,2n)).toHaveLength(1);expect(f(pa.signal(taskA,2n)[0],2n)).toEqual(q(119,120));expect(pb.signal(taskA,2n)).toHaveLength(0);
 // Every cue panel observation actually supports the receiving signal.
 const basis=key(f(pa.signal(taskA,2n)[0],3n));for(const packet of items(ka.efficacy!.cue!.supports[0],'list'))expect(basis).toContain(key(validateMitigationPacket(packet).observation));
 expect(pa.signal(taskA,1n)).toEqual(pb.signal(taskA,1n));expect(pa.forTask(taskB)).toEqual(pb.forTask(taskB));
 expect(f(pa.data,2n)).not.toEqual(f(pb.data,2n));await exactProof(A.s,[a,b]);
 console.info('M70 CONNECTION PASS observed glyph0 episode -> mean1/0 -> actual affect/grounded reason -> changed execution probability. Original source selector agrees.');
},540000);
it('M70 controls: missing evidence hidden truth and conditional isolation',async()=>{
 const main=await create('risk'),p=projection(main.r);
 for(const mode of ['denied','censored','noop','hidden','legacyFalse'] as const){
  const {r}=await create(mode),x=projection(r),k=knowledge(r);
  if(mode==='hidden'||mode==='legacyFalse'){
   expect(items(x.provenance[4],'list')).toEqual(items(p.provenance[4],'list'));expect(x.a[6]).toEqual(p.a[6]);expect(f(x.context,3n)).toEqual(f(p.context,3n));
   expect(k.efficacy!.cue!.mean!.equals(Q.of(1n))).toBe(true);
   if(mode==='hidden'){expect(x.a).toEqual(p.a);expect(state(r).read(reappraisalPath(C))).toEqual(state(main.r).read(reappraisalPath(C)));}
   else expect(k.means[0]!.equals(Q.of(0n))).toBe(true);
  }else{expect(txt(x.a[5])).toBe('Unavailable');expect(k.efficacy!.cue!.mean).toBeUndefined();expect(k.efficacy!.cue!.supports).toEqual([]);expect(x.signal(taskA,2n)).toHaveLength(0);expect(k.means[0]!.equals(Q.of(1n))).toBe(true);}
  expect(k.efficacy!.control!.equals(Q.of(0n))).toBe(true);
  console.info('M70 CONTROL '+mode+' '+txt(x.a[5]));
 }
 const b=fixture();await expect(prepareCharacterModel({...b.s,registrySchemaVersion:GROUNDED_AFFECT_REGISTRY})).rejects.toThrow('unsupported assembled model version bundle');
},540000);
it('M70 persistence and actual learning rollback',async()=>{
 const {b,m,r:a}=await create('risk',8n),repeat=await createCharacterRun(m,b.d);await through(repeat,8n);exact(a,repeat);
 expect(knowledge(a).efficacy!.cue!.mean).toBeUndefined();
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 const fault=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()}),before=snap(fault),apply=substrateState.applyStatePatch;let injected=false;
 const spy=vi.spyOn(substrateState,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===1000n&&o.path.fieldId===8n)){injected=true;throw Error('M70 after cue learning write');}return result;});
 try{await expect(step(fault)).rejects.toThrow('M70 after cue learning write');expect(injected).toBe(true);const after=snap(fault);expect(after.clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);}finally{spy.mockRestore();}
 for(const r of [a,repeat,restored]){await through(r,10n);projection(r);await finish(r);}exact(a,repeat);exact(a,restored);
 console.info('M70 PERSISTENCE PASS exact repeat/restore8->101 and actual cue-learning rollback.');
},540000);
