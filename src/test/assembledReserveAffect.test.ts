import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,rational as q,set,record,signed,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,enc,type Mode} from './fixtures/assembledReserveAffect';
import {receivingRecord as rec,cognitiveRecord as cr} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {RESERVE_AFFECT_VERSION,SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath} from '../assembled/reappraisal';
import {OBSERVED_THREAT_REGISTRY} from '../assembled/model';
import * as factors from '../campaign3/affectFactorComparison';
import {bodyPath} from '../assembled/body';
import {reappraisalKnowledge,observedReserveFraction} from '../assembled/reappraisal';
import {validateMitigationPacket} from '../assembled/mitigation';
import {affectRecord as ar} from '../campaign3/affectCodecs';
import {affectAppraisal} from '../campaign3/affectMath';
import {beliefRecord} from '../campaign3/beliefCodecs';
import {compileAffectModel,affectRecipe} from '../campaign3/affectModel';
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
 const receive=trace(r).find(t=>txt(f(t,6n))===RESERVE_AFFECT_VERSION&&signedValue(f(event(t),2n))===10n&&uint(f(event(t),3n))===80n)!;expect(receive).toBeDefined();
 const input=items(f(receive,12n),'list');expect(input[1]).toEqual(list(a));
 const producer=trace(r).find(t=>uint(f(event(t),1n))===uint(input[2])&&key(f(t,13n))===key(list(a)))!;expect(producer).toBeDefined();expect(txt(f(producer,6n))).toBe(RESERVE_AFFECT_VERSION);
 expect(items(f(producer,11n),'list')).toHaveLength(3);expect(items(f(receive,14n),'list')).toEqual([]);
 expect(f(rec(f(receive,13n),403n),3n)).toEqual(f(raw,3n));
 const concern=trace(r).find(t=>txt(f(t,6n))===RESERVE_AFFECT_VERSION&&signedValue(f(event(t),2n))===10n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===388n)!;expect(concern).toBeDefined();expect(items(f(concern,12n),'list')[1]).toEqual(list(a));
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
 console.info('M71 DIAGNOSTIC '+JSON.stringify({changed,cases:String(total),counts:counts.map(String),modes:rs.map(r=>String(uint(f(r,8n)))),probabilities:rs.map(r=>items(f(r,2n),'list').map(v=>frac(f(rec(v,421n),2n)))),nuclei:ns.map(xs=>xs.map(n=>({roles:[1n,2n,3n].map(i=>frac(f(rec(f(n,2n),406n),i))),die:String(uint(f(n,4n))),standing:String(signedValue(f(n,5n))),situation:String(signedValue(f(n,6n)))})))}));
 expect(changed).toBeGreaterThan(0);expect(counts[0]).not.toBe(counts[1]);
 for(let arm=0;arm<2;arm++){const probability=items(f(rs[arm],2n),'list').find(v=>key(f(rec(v,421n),1n))===key(candidates[0]))!;const actual=uint(f(rs[arm],8n))===1n?Q.of(key(f(rs[arm],1n))===key(candidates[0])?1n:0n):readQ(f(rec(probability,421n),2n));expect(actual.equals(Q.of(counts[arm],total))).toBe(true);}
 console.info('M71 EXACT '+JSON.stringify({cases:String(total),changed,firstCandidateWins:counts.map(String),probabilities:counts.map(n=>n+'/'+total),scope:'captured actual contexts; paired uniform faces and fair ties; no seed-pair claim'}));
 return {counts,total,changed};
}

const includesValue=(value:CanonicalValue,expected:CanonicalValue)=>typeof value!=='boolean'&&value.kind==='list'&&value.items.some(v=>key(v)===key(expected));
const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true);
let originalModel:Awaited<ReturnType<typeof compileAffectModel>>|undefined;
async function reserveProof(r:Run,capacity:number,fraction:CanonicalValue){
 const x=projection(r),joint=items(x.provenance[1],'list'),sample=rec(joint[2],461n),context=items(joint[5],'list');
 expect(txt(context[1])).toBe('Current');expect(f(sample,4n)).toEqual(signed(10));
 expect(x.provenance[8]).toEqual(list([q(capacity,1),fraction,joint[5]]));
 const bodySource=trace(r).find(t=>signedValue(f(event(t),2n))===10n&&uint(f(event(t),3n))===10n&&includesValue(f(t,13n),sample));
 expect(bodySource,'actual body observation producer').toBeDefined();
 expect(trace(r).some(t=>signedValue(f(event(t),2n))===10n&&uint(f(event(t),3n))===14n&&includesValue(f(t,13n),joint[3])),'actual frozen body experience').toBe(true);
 const producer=trace(r).find(t=>txt(f(t,6n))===RESERVE_AFFECT_VERSION&&key(f(t,13n))===key(list(x.a)))!;
 for(const read of items(f(producer,11n),'list'))expect(uint(f(rec(f(rec(read,147n),2n),140n),1n))).not.toBe(455n);
 const k=knowledge(r),cuePacket=items(k.efficacy!.cue!.supports[0],'list').at(-1)!,support=[validateMitigationPacket(cuePacket).observation,...k.efficacy!.supports.map(s=>validateMitigationPacket(items(items(s,'list')[1],'list').at(-1)!).observation)];
 const estimates=[k.efficacy!.cue!.mean!,...k.efficacy!.means.map(v=>v!)].map((v,i)=>beliefRecord(739,[q(v.numerator,v.denominator),u(1),set([support[i]])]));
 const originalContext=ar(750,new Map<bigint,CanonicalValue>([[1n,f(sample,1n)],[2n,signed(10)],[3n,u(0)],[4n,u(0)],[5n,u(0)],[6n,false],[7n,false],[8n,false],[9n,u(2)],[10n,fraction]]));
 const original=rec(affectAppraisal(originalModel??(originalModel=await compileAffectModel(affectRecipe())),10n,typedIdentifier(1151,u(9999)),estimates,originalContext,undefined),754n);
 expect(f(original,9n)).toEqual(items(x.provenance[4],'list')[2]);
 return x;
}
it('M71 connection: perceived reserve fraction changes grounded choice',async()=>{
 const A=fixture('low'),B=fixture('high');expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);
 const m=await prepareCharacterModel(A.s),a=await createCharacterRun(m,A.d),b=await createCharacterRun(m,B.d);
 const dice=rec(definition(A.s,'task-reason-dice'),437n);console.info('M71 CALIBRATION '+JSON.stringify({threshold:frac(f(dice,2n)),unit:frac(f(rec(f(dice,4n),439n),1n)),cap:String(uint(f(rec(f(dice,4n),439n),2n))),consequence:'1/3'}));
 await through(a,8n);await through(b,8n);bytes(snap(a).state,snap(b).state);bytes(snap(a).outputs,snap(b).outputs);
 await through(a,10n);await through(b,10n);const pa=await reserveProof(a,100,q(1,100)),pb=await reserveProof(b,100,q(81,100));
 expect(items(pa.provenance[4],'list')).toEqual([q(1,1),q(1,3),q(99,100),q(0,1)]);
 expect(items(pb.provenance[4],'list')).toEqual([q(1,1),q(1,3),q(19,100),q(0,1)]);
 expect(pa.a[6]).toEqual(list([q(199,600),q(199,600)]));expect(pb.a[6]).toEqual(list([q(119,600),q(119,600)]));
 expect(state(a).read(reappraisalPath(C))).toEqual(state(b).read(reappraisalPath(C)));
 expect(pa.signal(taskA,1n)).toEqual(pb.signal(taskA,1n));expect(pa.forTask(taskB)).toEqual(pb.forTask(taskB));
 expect(signedValue(f(pa.forTask(taskA)[0],6n))).toBe(2n);expect(signedValue(f(pb.forTask(taskA)[0],6n))).toBe(1n);
 const proof=await exactProof(A.s,[a,b]);expect(proof.counts).toEqual([72n,47n]);expect(proof.changed).toBe(25);
 expect(proof.counts[1]>0n&&proof.counts[1]<proof.total&&readQ(items(pb.a[6],'list')[1]).compare(Q.of(0n))>0,'two responses under fixed positive uncontrolled affect').toBe(true);
 console.info('M71 CONNECTION PASS actual body evidence -> original reserve fraction -> affect -> reason -> changed choice; no threat learning from relief.');
},540000);
it('M71 controls: hidden body missing evidence capacity and saturated choice',async()=>{
 const main=await create('high',9n),hidden=await create('hidden',9n);
 expect(state(main.r).read(bodyPath(C)).value).not.toEqual(state(hidden.r).read(bodyPath(C)).value);
 await through(main.r,10n);await through(hidden.r,10n);
 const p=await reserveProof(main.r,100,q(81,100)),h=await reserveProof(hidden.r,100,q(81,100));
 expect(p.a).toEqual(h.a);expect(f(p.context,3n)).toEqual(f(h.context,3n));expect(state(main.r).read(reappraisalPath(C))).toEqual(state(hidden.r).read(reappraisalPath(C)));
 console.info('M71 CONTROL hidden: distinct physical anchors, equal observed bin/appraisal/reasons');
 const denied=await create('denied'),d=projection(denied.r);expect(txt(d.a[5])).toBe('Unavailable');expect(d.signal(taskA,2n)).toEqual([]);expect(items(d.provenance[8],'list')[1]).toEqual(list([]));
 const wider=await create('capacity200'),w=await reserveProof(wider.r,200,q(81,200));expect(items(w.provenance[4],'list')[2]).toEqual(q(119,200));
 console.info('M71 CONTROL denied Unavailable; capacity200 exact observed fraction81/200');
 const low=await create('saturatedLow'),high=await create('saturatedHigh'),l=await reserveProof(low.r,100,q(1,100)),z=await reserveProof(high.r,100,q(81,100));
 expect(l.a[6]).not.toEqual(z.a[6]);expect([l,z].map(x=>signedValue(f(x.forTask(taskA)[0],6n)))).toEqual([3n,3n]);expect(f(l.data,2n)).toEqual(f(z.data,2n));expect([l,z].map(x=>uint(f(x.data,8n)))).toEqual([1n,1n]);
 expect(state(low.r).read(reappraisalPath(C))).toEqual(state(high.r).read(reappraisalPath(C)));
 console.info('M71 CONTROL severity1 saturation: different affect, identical +3 and Auto; null retained');
 const fixtureInput=fixture();await expect(prepareCharacterModel({...fixtureInput.s,registrySchemaVersion:OBSERVED_THREAT_REGISTRY})).rejects.toThrow('unsupported assembled model version bundle');
 const sample=items(p.provenance[1],'list')[2],fields=new Map(rec(sample,461n).fields);fields.set(5n,cr(462,[q(0,1),q(101,1)]));expect(()=>observedReserveFraction(record(rec(sample,461n).schema,fields),Q.of(100n))).toThrow('observed reserve interval');
 expect(()=>observedReserveFraction(sample,Q.of(0n))).toThrow('positive reserve capacity');
},540000);
it('M71 persistence and actual normalized appraisal rollback',async()=>{
 const {b,m,r:a}=await create('high',9n),repeat=await createCharacterRun(m,b.d);await through(repeat,9n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 const fault=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()}),before=snap(fault),original=factors.compareAffectFactors;let injected=false;
 const spy=vi.spyOn(factors,'compareAffectFactors').mockImplementation((input,candidate)=>{const result=original(input,candidate);if(input.severity?.equals(Q.of(1n,3n))&&input.vulnerability?.equals(Q.of(19n,100n))){injected=true;throw Error('M71 after normalized appraisal');}return result;});
 try{await expect(step(fault)).rejects.toThrow('M71 after normalized appraisal');expect(injected).toBe(true);const after=snap(fault);expect(after.clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);}finally{spy.mockRestore();}
 for(const r of [a,repeat,restored]){await through(r,10n);projection(r);await finish(r);}exact(a,repeat);exact(a,restored);
 console.info('M71 PERSISTENCE PASS exact repeat/restore9->101 and actual normalized-appraisal rollback.');
},540000);
