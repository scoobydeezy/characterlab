import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,enc,type Mode} from './fixtures/assembledGroundedAffect';
import {receivingRecord as rec,cognitiveRecord as cr} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {GROUNDED_AFFECT_VERSION,SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath} from '../assembled/reappraisal';
import {MITIGATION_RULES,MITIGATION_REGISTRY} from '../assembled/model';
import * as factors from '../campaign3/affectFactorComparison';
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
const dec=(r:Run)=>outputs(snap(r).outputs,409n).find(v=>signedValue(f(v,2n))===9n)!;
const result=(d:CanonicalValue)=>{const s=rec(f(rec(d,409n),4n),419n);expect(uint(f(s,1n)),'live resolved choice').toBe(3n);return rec(f(s,2n),420n);};
const definition=(s:ReturnType<typeof fixture>['s'],name:string)=>f(rec(items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!,171n),4n);
function projection(r:Run,live=true){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===9n)!;expect(a).toBeDefined();
 const provenance=items(a[7],'list');expect(provenance[0]).toEqual(taskA);
 const decision=dec(r);expect(decision).toBeDefined();const data=result(decision),context=rec(f(decision,3n),408n),raw=rec(f(context,2n),403n);
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n)),ns=items(f(context,3n),'list').map(v=>rec(v,407n));
 const signal=(task:CanonicalValue,role:bigint)=>signals.filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(task)&&uint(f(k,3n))===role;});
 const forTask=(task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(task,371n),2n)));
 if(live){for(const task of [taskA,taskB]){expect(signal(task,1n),'live positive existing base').toHaveLength(1);expect(readQ(f(signal(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);expect(forTask(task),'live compiled task reason').toHaveLength(1);}expect(ns).toHaveLength(2);expect(new Set(ns.map(n=>key(f(rec(f(n,1n),404n),1n)))).size,'distinct live competing actions').toBe(2);}
 const receive=trace(r).find(t=>txt(f(t,6n))===GROUNDED_AFFECT_VERSION&&signedValue(f(event(t),2n))===9n&&uint(f(event(t),3n))===80n)!;expect(receive).toBeDefined();
 const input=items(f(receive,12n),'list');expect(input[1]).toEqual(list(a));
 const producer=trace(r).find(t=>uint(f(event(t),1n))===uint(input[2])&&key(f(t,13n))===key(list(a)))!;expect(producer).toBeDefined();expect(txt(f(producer,6n))).toBe(GROUNDED_AFFECT_VERSION);
 expect(items(f(producer,11n),'list')).toHaveLength(3);expect(items(f(receive,14n),'list')).toEqual([]);
 expect(f(rec(f(receive,13n),403n),3n)).toEqual(f(raw,3n));
 const concern=trace(r).find(t=>txt(f(t,6n))===GROUNDED_AFFECT_VERSION&&signedValue(f(event(t),2n))===9n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===388n)!;expect(concern).toBeDefined();expect(items(f(concern,12n),'list')[1]).toEqual(list(a));
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
   const out=await arbitrationOutput(occ,9n,contexts[arm],def,{async reason(n){const first=key(f(rec(f(rec(n,407n),1n),404n),1n))===key(candidates[0]);return draw(first?a:b,first?sizes[0]:sizes[1],n);},async tie(leaders){expect(leaders).toHaveLength(2);return draw(tie,2n);}},3),data=result(out),winner=f(data,1n);
   expect(f(data,2n)).toEqual(f(rs[arm],2n));winners.push(winner);if(key(winner)===key(candidates[0]))counts[arm]++;
  }
  if(key(winners[0])!==key(winners[1]))changed++;
 }
 console.info('M69 DIAGNOSTIC '+JSON.stringify({changed,cases:String(total),counts:counts.map(String),modes:rs.map(r=>String(uint(f(r,8n)))),probabilities:rs.map(r=>items(f(r,2n),'list').map(v=>frac(f(rec(v,421n),2n)))),nuclei:ns.map(xs=>xs.map(n=>({roles:[1n,2n,3n].map(i=>frac(f(rec(f(n,2n),406n),i))),die:String(uint(f(n,4n))),standing:String(signedValue(f(n,5n))),situation:String(signedValue(f(n,6n)))})))}));
 expect(changed).toBeGreaterThan(0);expect(counts[0]).not.toBe(counts[1]);expect(counts.some((n,i)=>n>0n&&n<total&&items(reports(runs[i],SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===9n)![6],'list').some(v=>readQ(v).compare(Q.of(0n))>0)),'two responses under a fixed nonzero affect vector').toBe(true);
 for(let arm=0;arm<2;arm++){const probability=items(f(rs[arm],2n),'list').find(v=>key(f(rec(v,421n),1n))===key(candidates[0]))!;const actual=uint(f(rs[arm],8n))===1n?Q.of(key(f(rs[arm],1n))===key(candidates[0])?1n:0n):readQ(f(rec(probability,421n),2n));expect(actual.equals(Q.of(counts[arm],total))).toBe(true);}
 console.info('M69 EXACT '+JSON.stringify({cases:String(total),changed,firstCandidateWins:counts.map(String),probabilities:counts.map(n=>n+'/'+total),scope:'captured actual contexts; paired uniform faces and fair ties; no seed-pair claim'}));
}
it('M69 connection: governed consequence and observed efficacy reach grounded choice',async()=>{
 const A=fixture('ineffective'),B=fixture('effective');expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);
 const m=await prepareCharacterModel(A.s),a=await createCharacterRun(m,A.d),b=await createCharacterRun(m,B.d);
 const dice=rec(definition(A.s,'task-reason-dice'),437n);console.info('M69 CALIBRATION '+JSON.stringify({threshold:frac(f(dice,2n)),situationUnit:frac(f(rec(f(dice,4n),439n),1n)),situationCap:String(uint(f(rec(f(dice,4n),439n),2n)))}));
 await through(a,3n);await through(b,3n);bytes(snap(a).state,snap(b).state);bytes(snap(a).outputs,snap(b).outputs);
 await through(a,10n);await through(b,10n);const pa=projection(a),pb=projection(b);
 expect(items(pa.provenance[4],'list')).toEqual([q(1,1),q(1,1),q(59,60),q(0,1)]);expect(items(pb.provenance[4],'list')).toEqual([q(1,1),q(1,1),q(59,60),q(1,1)]);
 expect(pa.a[6]).toEqual(list([q(119,120),q(119,120)]));expect(pb.a[6]).toEqual(list([q(119,120),q(0,1)]));
 expect(pa.signal(taskA,2n)).toHaveLength(1);expect(f(pa.signal(taskA,2n)[0],2n)).toEqual(q(119,120));expect(pb.signal(taskA,2n)).toHaveLength(0);
 expect(pa.signal(taskA,1n)).toEqual(pb.signal(taskA,1n));expect(pa.forTask(taskB)).toEqual(pb.forTask(taskB));expect(f(pa.forTask(taskA)[0],6n)).not.toEqual(f(pb.forTask(taskA)[0],6n));
 expect(f(pa.data,2n)).not.toEqual(f(pb.data,2n));await exactProof(A.s,[a,b]);
 console.info('M69 CONNECTION PASS actual valuation/learned efficacy -> completed affect -> existing situation role -> compiled reason -> choice distribution -> execution.');
},540000);
it('M69 controls: no-ground zero-severity unknown and hidden truth',async()=>{
 const main=await create('effective'),p=projection(main.r);
 for(const mode of ['zeroSeverity','noGround','unknown','hidden'] as const){
  const {r}=await create(mode),x=projection(r,mode!=='noGround');
  if(mode==='hidden'){expect(x.a).toEqual(p.a);expect(f(x.context,3n)).toEqual(f(p.context,3n));expect(state(r).read(reappraisalPath(C))).toEqual(state(main.r).read(reappraisalPath(C)));}
  else if(mode==='unknown'){expect(txt(x.a[5])).toBe('Unavailable');expect(x.signal(taskA,2n)).toHaveLength(0);}
  else if(mode==='noGround'){expect(txt(x.a[5])).toBe('Known');expect(x.a[6]).toEqual(list([q(119,120),q(119,120)]));expect(x.signal(taskA,1n)).toHaveLength(0);expect(x.signal(taskA,2n)).toHaveLength(0);expect(x.forTask(taskA)).toHaveLength(0);}
  else {expect(items(x.provenance[4],'list')[1]).toEqual(q(0,1));expect(x.a[6]).toEqual(list([q(0,1),q(0,1)]));expect(x.signal(taskA,2n)).toHaveLength(0);}
  console.info('M69 CONTROL '+mode+' '+txt(x.a[5]));
 }
 const b=fixture(),slots=items(decode(b.s.registry),'list'),a=items(slots[28],'list');
 for(const bad of [list([...a.slice(0,4),a[1],a[5]]),list([...a.slice(0,4),text('foreign'),a[5]]),list([...a.slice(0,5),q(2,1)])])await expect(prepareCharacterModel({...b.s,registry:enc(list(slots.map((v,i)=>i===28?bad:v)))})).rejects.toThrow();
 await expect(prepareCharacterModel({...b.s,rulesVersion:MITIGATION_RULES,registrySchemaVersion:MITIGATION_REGISTRY})).rejects.toThrow('reappraisal declaration');
},540000);
it('M69 persistence and actual appraisal rollback',async()=>{
 const {b,m,r:a}=await create('ineffective',8n),repeat=await createCharacterRun(m,b.d);await through(repeat,8n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 const fault=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()}),before=snap(fault),original=factors.compareAffectFactors;let injected=false;
 const spy=vi.spyOn(factors,'compareAffectFactors').mockImplementation((input,candidate)=>{const result=original(input,candidate);if(input.severity?.equals(Q.of(1n))){injected=true;throw Error('M69 after affect calculation');}return result;});
 try{await expect(step(fault)).rejects.toThrow('M69 after affect calculation');expect(injected).toBe(true);const after=snap(fault);expect(after.clock).toBe(before.clock);for(const p of ['state','outputs','trace'] as const)bytes(after[p],before[p]);}finally{spy.mockRestore();}
 for(const r of [a,repeat,restored]){await through(r,10n);projection(r);await finish(r);}exact(a,repeat);exact(a,restored);
 console.info('M69 PERSISTENCE PASS exact repeat/restore8->101 and actual derived-affect failure rollback.');
},540000);
