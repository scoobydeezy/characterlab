import {it,expect} from 'vitest';
import {list,text,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,type Mode,type Law} from './fixtures/assembledAffectResponse';
import {receivingRecord as rec,cognitiveRecord as cr} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ,bounded} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {INTERPRETED_THREAT_VERSION,SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath,reappraisalKnowledge} from '../assembled/reappraisal';
import {importancePath,importanceValue} from '../assembled/priority';
import {AFFECT_RECALL,unpackAffectCue} from '../assembled/affectMemory';
import {isSocialEpisodePath,MEMORY_RECALL} from '../assembled/memory';
import {arbitrationOutput} from '../assembled/arbitration';
import {randomAddressValue,naturalRandomKeyValue} from '../substrate/random';
import {sid} from '../assembled/skill';
import {outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
const cache=new WeakMap<Run,ReturnType<Run['snapshot']>>();
function snap(r:Run){let v=cache.get(r);if(!v){v=r.snapshot();cache.set(r,v);}return v;}
async function step(r:Run){cache.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(32);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(32);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true,true);
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
const result=(d:CanonicalValue)=>{const s=rec(f(rec(d,409n),4n),419n);expect(uint(f(s,1n)),'live resolved choice').toBe(3n);return rec(f(s,2n),420n);};
const definition=(s:ReturnType<typeof fixture>['s'],name:string)=>f(rec(items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!,171n),4n);
async function create(mode:Mode,at=10n,law:Law='UncontrolledGain',control:0|1=0){const b=fixture(mode,law,control),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
function projection(r:Run,mode:'normal'|'weak'|'denied'='normal'){
 const a=items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(SHARED_AFFECT_APPRAISAL))).map(v=>items(v,'list')).find(v=>uint(v[1])===10n)!;
 expect(a,'actual appraisal10').toBeDefined();expect(txt(a[5])).toBe(mode==='denied'?'Unavailable':'Known');
 if(mode!=='denied')expect(readQ(items(a[6],'list')[1]).compare(Q.of(0n)),'live known affect').toBeGreaterThanOrEqual(0);
 const d=outputs(snap(r).outputs,409n).find(v=>signedValue(f(v,2n))===10n)!;expect(d).toBeDefined();
 const data=result(d),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list').map(v=>rec(v,407n));
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const signal=(task:CanonicalValue,role:bigint)=>signals.filter(v=>{const k=rec(f(v,1n),401n);return key(f(k,2n))===key(task)&&uint(f(k,3n))===role;});
 const nucleus=(task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(task,371n),2n)));
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));
 expect(candidates,'available physical alternatives').toHaveLength(2);
 const A=candidates.find(v=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-one')))!;
 const B=candidates.find(v=>key(f(rec(v,395n),2n))===key(sid(1027,'definition/protocol-contact-two')))!;
 expect(A).toBeDefined();expect(B).toBeDefined();expect(A).not.toEqual(B);
 for(const task of mode==='weak'?[taskA]:[taskA,taskB]){
  expect(signal(task,1n),'positive base liveness').toHaveLength(1);
  expect(readQ(f(signal(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);
  expect(nucleus(task),'live compiled ground').toHaveLength(1);
 }
 expect(ns).toHaveLength(mode==='weak'?1:2);
 const trace=outputs(snap(r).trace,160n),event=(v:CanonicalValue)=>rec(f(rec(v,160n),4n),130n);
 const receive=trace.find(t=>txt(f(t,6n))===INTERPRETED_THREAT_VERSION&&signedValue(f(event(t),2n))===10n&&uint(f(event(t),3n))===80n)!;
 expect(receive).toBeDefined();const input=items(f(receive,12n),'list');expect(input[1]).toEqual(list(a));
 const producer=trace.find(t=>uint(f(event(t),1n))===uint(input[2])&&key(f(t,13n))===key(list(a)))!;
 expect(producer,'actual completed appraisal producer').toBeDefined();expect(items(f(producer,11n),'list')).toHaveLength(3);
 expect(txt(f(producer,6n))).toBe(INTERPRETED_THREAT_VERSION);
 expect(f(rec(f(receive,13n),403n),3n)).toEqual(f(raw,3n));
 for(const t of [producer,receive])expect(items(f(t,14n),'list'),'no affect random draws').toEqual([]);
 expect(outputs(snap(r).outputs,433n).some(o=>{const intent=rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n);return key(f(intent,2n))===key(d);}), 'decision reaches execution').toBe(true);
 expect(state(r).read(framePath(C)).presence).toBe(false);
 return {a,d,data,context,raw,ns,signal,nucleus,A,B};
}
const probability=(data:CanonicalValue,candidate:CanonicalValue)=>readQ(f(rec(items(f(rec(data,420n),2n),'list').find(p=>key(f(rec(p,421n),1n))===key(candidate))!,421n),2n));
const event=(v:CanonicalValue)=>rec(f(rec(v,160n),4n),130n);
const reports=(r:Run,label:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const frac=(v:CanonicalValue)=>{const n=readQ(v);return n.numerator+'/'+n.denominator;};
function memory(r:Run,unknown=false){
 const a=reports(r,AFFECT_RECALL).find(a=>signedValue(a[1])===11n)!;expect(a,'actual delayed recall11').toBeDefined();
 const carry=unpackAffectCue(a[2],11n);expect(carry.carry?.at).toBe(10);expect(carry.carry?.status).toBe(unknown?'Unavailable':'Known');
 const episodes=state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list'));
 expect(episodes,'retained acquired memories').toHaveLength(2);
 const byId=new Map(episodes.map(a=>[uint(id(a[1]).payload),signedValue(a[5])]));
 expect([...byId.values()].sort()).toEqual([7n,8n]);
 const scores=items(a[4],'list').map(v=>{const x=items(v,'list');return {at:byId.get(uint(x[0])),base:frac(x[1]),pull:frac(x[2]),score:frac(x[3])};}).sort((a,b)=>Number(a.at!-b.at!));
 expect(scores,'both eligible memories').toHaveLength(2);expect(scores.some(s=>readQ(q(...s.pull.split('/').map(BigInt) as [bigint,bigint])).compare(Q.of(0n))>0),'live associative pull').toBe(true);
 const trace=outputs(snap(r).trace,160n),t=trace.find(t=>key(f(event(t),5n))===key(MEMORY_RECALL)&&signedValue(f(event(t),2n))===11n&&key(f(event(t),6n))===key(a[2]))!;
 expect(t,'actual ranking trace').toBeDefined();expect(items(f(t,13n),'list')).toContainEqual(list(a));const e=event(t);expect(signedValue(f(e,2n))).toBe(11n);expect(uint(f(e,3n))).toBe(20n);
 expect(items(f(e,8n),'list')).toContainEqual(u(carry.source!));
 const producer=trace.find(t=>uint(f(event(t),1n))===carry.source&&key(f(t,13n))===key(items(a[2],'list')[2]))!;
 expect(producer,'prior completed appraisal causal parent').toBeDefined();expect(signedValue(f(event(producer),2n))).toBe(10n);
 expect(items(f(t,11n),'list')).toHaveLength(2);
 const selected=items(a[5],'list').map(v=>byId.get(uint(items(v,'list')[0])));
 expect(selected.length).toBeGreaterThan(0);
 for(const at of selected)expect(items(episodes.find(x=>signedValue(x[5])===at)![4],'list')).toContainEqual(signed(11));
 return {gain:frac(a[3]),scores,selected,episodes,carry,raw:a};
}

async function pairedProof(s:ReturnType<typeof fixture>['s'],strong:ReturnType<typeof projection>,weak:ReturnType<typeof projection>){
 let changed=0,strongA=0,weakA=0;
 for(let a=0n;a<6n;a++)for(let b=0n;b<6n;b++)for(let tie=0n;tie<2n;tie++){
  const winners:string[]=[];
  for(const x of [strong,weak]){
   const occ=f(x.d,1n),na=x.nucleus(taskA)[0];
   function draw(value:bigint,span:bigint,n?:CanonicalValue){
    const k=n?rec(f(rec(n,407n),1n),404n):undefined,c=k?rec(f(k,1n),395n):rec(x.A,395n);
    const address={causalRootId:id(occ),purposeId:sid(1042,k?'purpose/task-reason-face':'purpose/task-decision-tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},...(k?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(k,3n))}]:[])],drawIndex:0n};
    return cr(411,[randomAddressValue(address),naturalRandomKeyValue(address),u(value),u(span),u(((1n<<128n)/span)*span),false,list([cr(410,[u(0),u(value),false])])],1);
   }
   const d=await arbitrationOutput(occ,10n,x.context,definition(s,'task-arbitration'),{async reason(n){expect(uint(f(rec(n,407n),4n))).toBe(6n);return draw(key(f(rec(n,407n),1n))===key(f(na,1n))?a:b,6n,n);},async tie(leaders){expect(leaders).toHaveLength(2);return draw(tie,2n);}},3),out=result(d);
   expect(f(out,2n)).toEqual(f(x.data,2n));winners.push(key(f(out,1n)));
  }
  if(winners[0]===key(strong.A))strongA++;if(winners[1]===key(weak.A))weakA++;if(winners[0]!==winners[1])changed++;
 }
 expect([strongA,weakA,changed]).toEqual([47,72,25]);
 console.info('M76 MATCHED RESPONSE strong A47/B25 versus weak A72/B0;25 changed winners in72 uniformly weighted captured-context cases.');
}
const json=(x:unknown)=>JSON.stringify(x,(_k,v)=>typeof v==='bigint'?String(v):v);
it('M76 comparisons: competing obligation and strictly later NoFeedback ablation',async()=>{
 const strong=await create('strong',0n),weak=await create('weak',0n);
 expect(strong.b.s).toEqual(weak.b.s);bytes(strong.b.d.initialState,weak.b.d.initialState);
 bytes(snap(strong.r).state,snap(weak.r).state);bytes(snap(strong.r).outputs,snap(weak.r).outputs);
 const inputsA=items(decode(strong.b.d.orderedInputs),'list'),inputsB=items(decode(weak.b.d.orderedInputs),'list');
 const diff=inputsA.map((v,i)=>key(v)===key(inputsB[i])?-1:i).filter(i=>i>=0);expect(diff).toHaveLength(1);
 const ix=diff[0],rowA=items(inputsA[ix],'list'),rowB=[...items(inputsB[ix],'list')];expect(signedValue(rowA[0])).toBe(1n);
 const pa=items(rowA[3],'list'),pb=items(rowB[3],'list'),rA=items(pa[1],'list'),rB=items(pb[1],'list').map(v=>{const a=[...items(v,'list')];if(key(a[0])===key(taskB)){expect(a[1]).toEqual(list([q(1,2)]));a[1]=list([q(1,1)]);}return list(a);});expect(rB).toEqual(rA);
 await through(strong.r,3n);const pre=snap(strong.r);
 await through(strong.r,10n);await through(weak.r,10n);
 const x=projection(strong.r),y=projection(weak.r,'weak');
 expect(x.a[6]).toEqual(list([q(119,600),q(119,600)]));expect(y.a[6]).toEqual(x.a[6]);
 expect(items(x.a[7],'list')[4]).toEqual(items(y.a[7],'list')[4]);expect(knowledge(strong.r)).toEqual(knowledge(weak.r));
 expect(x.nucleus(taskA)).toEqual(y.nucleus(taskA));expect(x.signal(taskA,1n)).toEqual(y.signal(taskA,1n));expect(x.signal(taskA,2n)).toEqual(y.signal(taskA,2n));
 expect(importanceValue(state(strong.r).read(importancePath(taskB)).value!).I).toEqual(Q.of(1n));
 expect(importanceValue(state(weak.r).read(importancePath(taskB)).value!).I).toEqual(Q.of(1n,2n));
 expect(x.signal(taskB,1n)).toHaveLength(1);expect(y.signal(taskB,1n)).toHaveLength(1);
 expect(readQ(f(x.signal(taskB,1n)[0],2n))).toEqual(Q.of(1n));expect(readQ(f(y.signal(taskB,1n)[0],2n))).toEqual(Q.of(1n,2n));
 const dice=rec(definition(strong.b.s,'task-reason-dice'),437n);expect(f(dice,2n)).toEqual(q(37,100));
 expect(bounded(Q.of(1n,2n))).toEqual(Q.of(1n,3n));expect(bounded(Q.of(1n,2n)).compare(readQ(f(dice,2n)))).toBeLessThan(0);
 expect(y.nucleus(taskB)).toEqual([]);expect(uint(f(y.data,8n))).toBe(1n);
 expect(probability(x.data,x.A)).toEqual(Q.of(47n,72n));await pairedProof(strong.b.s,x,y);
 const runs=new Map<string,Run>([['UncontrolledGain/0',strong.r]]);
 const prefixes=new Map<Law,ReturnType<typeof snap>>([['UncontrolledGain',pre]]);
 for(const law of ['UncontrolledGain','NoFeedback'] as const)for(const control of [0,1] as const){
  if(law==='UncontrolledGain'&&control===0)continue;
  const z=await create('strong',3n,law,control),old=prefixes.get(law);
  if(old){bytes(old.state,snap(z.r).state);bytes(old.outputs,snap(z.r).outputs);}else prefixes.set(law,snap(z.r));
  await through(z.r,10n);runs.set(law+'/'+control,z.r);
 }
 for(const c of [0,1]){
  const a=runs.get('UncontrolledGain/'+c)!,b=runs.get('NoFeedback/'+c)!;
  bytes(snap(a).state,snap(b).state);bytes(snap(a).outputs,snap(b).outputs);
  expect(projection(a).a).toEqual(projection(b).a);expect(projection(a).d).toEqual(projection(b).d);
  const draws=(r:Run)=>outputs(snap(r).trace,160n).flatMap(t=>items(f(t,14n),'list'));expect(draws(a).length).toBeGreaterThan(0);expect(draws(a)).toEqual(draws(b));
 }
 const rows=new Map<string,ReturnType<typeof memory>>();
 for(const [label,r] of runs){await through(r,11n);const m=memory(r);rows.set(label,m);console.info('M76 RECALL '+json({label,gain:m.gain,scores:m.scores,selected:m.selected}));}
 expect(rows.get('UncontrolledGain/0')!.gain).toBe('719/600');expect(rows.get('UncontrolledGain/0')!.selected).toEqual([7n]);
 expect(rows.get('UncontrolledGain/1')!.gain).toBe('1/1');expect(rows.get('UncontrolledGain/1')!.selected).toEqual([8n]);
 for(const c of [0,1]){const m=rows.get('NoFeedback/'+c)!;expect(m.gain).toBe('1/1');expect(m.selected).toEqual([8n]);}
 for(const k of ['scores','selected','episodes'] as const)expect(rows.get('NoFeedback/0')![k]).toEqual(rows.get('NoFeedback/1')![k]);
 const p0=projection(runs.get('NoFeedback/0')!),p1=projection(runs.get('NoFeedback/1')!);
 expect(p0.a[6]).toEqual(list([q(119,600),q(119,600)]));expect(p1.a[6]).toEqual(list([q(119,600),q(0,1)]));
 expect(knowledge(runs.get('NoFeedback/0')!).efficacy!.cue!.mean).toEqual(Q.of(1n));
 console.info('M76 COMPARISONS PASS matching affect/different competing priority; prior-only gain/recall difference disappears under admitted NoFeedback. No L4 change.');
},540000);
it('M76 privacy: unobserved competing importance remains unknown',async()=>{
 const a=await create('deniedStrong'),b=await create('deniedWeak');
 expect(state(a.r).read(importancePath(taskB)).presence).toBe(false);expect(state(b.r).read(importancePath(taskB)).presence).toBe(false);
 const x=projection(a.r,'weak'),y=projection(b.r,'weak');expect(x.a).toEqual(y.a);expect(x.raw).toEqual(y.raw);expect(x.d).toEqual(y.d);
 expect(x.signal(taskB,1n)).toEqual([]);expect(y.signal(taskB,1n)).toEqual([]);expect(knowledge(a.r)).toEqual(knowledge(b.r));bytes(snap(a.r).state,snap(b.r).state);
 console.info('M76 PRIVACY PASS hidden importance1/1 vs1/2 preserves unknown B importance, no B base/nucleus, and equal cognition/decision/state.');
},540000);
for(const law of ['UncontrolledGain','NoFeedback'] as const)it('M76 persistence '+law+': exact repeat and restored queued recall',async()=>{
 const a=await create('strong',10n,law),repeat=await createCharacterRun(a.m,a.b.d);await through(repeat,10n);exact(a.r,repeat);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.r.save()});exact(a.r,restored);
 for(const r of [a.r,repeat,restored]){await through(r,11n);memory(r);await finish(r);}
 exact(a.r,repeat);exact(a.r,restored);console.info('M76 PERSISTENCE '+law+' PASS10->11->101 exact state/output/trace/save/identity.');
},540000);
