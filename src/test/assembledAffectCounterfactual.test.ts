import {it,expect} from 'vitest';
import {list,text,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture,taskA,taskB,decode,items,key,type Mode} from './fixtures/assembledAffectCounterfactual';
import {receivingRecord as rec,cognitiveRecord as cr} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataText as txt,dataIdentity as id} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {INTERPRETED_THREAT_VERSION,SHARED_AFFECT_APPRAISAL,reappraisalPath,framePath,reappraisalKnowledge} from '../assembled/reappraisal';
import {bodyPath} from '../assembled/body';
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
async function create(mode:Mode,at=10n){const b=fixture(mode),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);await through(r,at);return {b,m,r};}
function projection(r:Run,mode:'normal'|'noGround'|'denied'='normal'){
 const a=items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(SHARED_AFFECT_APPRAISAL))).map(v=>items(v,'list')).find(v=>uint(v[1])===10n)!;
 expect(a,'actual appraisal10').toBeDefined();expect(txt(a[5])).toBe(mode==='denied'?'Unavailable':'Known');
 if(mode!=='denied')expect(readQ(items(a[6],'list')[1]).compare(Q.of(0n)),'live positive affect').toBeGreaterThan(0);
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
 for(const task of mode==='noGround'?[taskB]:[taskA,taskB]){
  expect(signal(task,1n),'positive base liveness').toHaveLength(1);
  expect(readQ(f(signal(task,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);
  expect(nucleus(task),'live compiled ground').toHaveLength(1);
 }
 expect(ns).toHaveLength(mode==='noGround'?1:2);
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
async function commandProof(s:ReturnType<typeof fixture>['s'],x:ReturnType<typeof projection>){
 const na=x.nucleus(taskA)[0],nb=x.nucleus(taskB)[0];
 expect([na,nb].map(n=>uint(f(n,4n)))).toEqual([6n,6n]);
 expect([na,nb].map(n=>signedValue(f(n,5n)))).toEqual([0n,0n]);
 expect([na,nb].map(n=>signedValue(f(n,6n)))).toEqual([1n,0n]);
 expect(uint(f(x.data,8n)),'live non-Automatic decision').not.toBe(1n);
 const occ=f(x.d,1n);let wins=0,violations=0;
 for(let a=0n;a<6n;a++)for(let b=0n;b<6n;b++)for(let tie=0n;tie<2n;tie++){
  function draw(value:bigint,span:bigint,n?:CanonicalValue){
   const k=n?rec(f(rec(n,407n),1n),404n):undefined,c=k?rec(f(k,1n),395n):rec(x.A,395n);
   const address={causalRootId:id(occ),purposeId:sid(1042,k?'purpose/task-reason-face':'purpose/task-decision-tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},...(k?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(k,3n))}]:[])],drawIndex:0n};
   return cr(411,[randomAddressValue(address),naturalRandomKeyValue(address),u(value),u(span),u(((1n<<128n)/span)*span),false,list([cr(410,[u(0),u(value),false])])],1);
  }
  const d=await arbitrationOutput(occ,10n,x.context,definition(s,'task-arbitration'),{async reason(n){return draw(key(f(rec(n,407n),1n))===key(f(na,1n))?a:b,6n,n);},async tie(leaders){expect(leaders).toHaveLength(2);return draw(tie,2n);}},3),out=result(d);
  expect(f(out,2n)).toEqual(f(x.data,2n));
  const winner=f(out,1n);expect([key(x.A),key(x.B)]).toContain(key(winner));
  const command=readQ(items(x.a[6],'list')[1]).compare(Q.of(0n))>0?x.A:winner;
  if(key(winner)===key(x.A))wins++;if(key(winner)!==key(command))violations++;
 }
 expect(wins).toBe(47);expect(violations).toBe(25);
 expect(probability(x.data,x.A).equals(Q.of(47n,72n))).toBe(true);
 console.info('M73 FearAsCommand FAILS: actual A47/72 B25/72; command A72/72; captured production context,72 uniformly weighted face/tie cases.');
}
it('M73 counterfactuals: command extra-die and relief-evidence fail distinct actual controls',async()=>{
 const fsName='node:fs',{readFileSync}=await import(fsName);
 const original=JSON.parse(readFileSync('docs/planning/AFFECT_PUBLIC_EXPERIMENT_REV1.json','utf8')).negativeControls;
 expect([...original.FearAsCommand.violations].sort()).toEqual(['choice-4-10','choice-7-10']);
 expect(original.FearAsExtraDie).toMatchObject({actualSafetyProbability:'0/1',oracleProbability:'16/96',actualNuclei:1,oracleNuclei:2});
 expect(original.ReliefAsBeliefEvidence).toMatchObject({actualMean:'1/1',oracleMean:'1/2',relief:'1/2'});
 const low=await create('low',8n),high=await create('high',8n);expect(low.b.s).toEqual(high.b.s);bytes(low.b.d.initialState,high.b.d.initialState);
 bytes(snap(low.r).state,snap(high.r).state);bytes(snap(low.r).outputs,snap(high.r).outputs);
 await through(low.r,9n);await through(high.r,9n);
 const before=state(high.r).read(reappraisalPath(C));expect(state(low.r).read(reappraisalPath(C))).toEqual(before);
 await through(low.r,10n);await through(high.r,10n);const l=projection(low.r),h=projection(high.r);
 expect(l.a[6]).toEqual(list([q(199,600),q(199,600)]));expect(h.a[6]).toEqual(list([q(119,600),q(119,600)]));
 for(const run of [low.r,high.r]){expect(state(run).read(reappraisalPath(C))).toEqual(before);expect(knowledge(run).efficacy!.cue!.mean!.equals(Q.of(1n))).toBe(true);}
 await commandProof(high.b.s,h);
 const no=await create('noGround'),n=projection(no.r,'noGround');
 expect(n.a[6]).toEqual(h.a[6]);expect(n.signal(taskA,1n)).toEqual([]);expect(n.signal(taskA,2n)).toEqual([]);expect(n.nucleus(taskA)).toEqual([]);
 expect(n.nucleus(taskB)).toEqual(h.nucleus(taskB));expect(probability(n.data,n.A).equals(Q.of(0n))).toBe(true);expect(f(n.data,1n)).toEqual(n.B);
 const bn=n.nucleus(taskB)[0],die=uint(f(bn,4n));expect(die).toBe(6n);expect([5n,6n].map(i=>signedValue(f(bn,i)))).toEqual([0n,0n]);
 let doubledWins=0n;for(let fear=1n;fear<=4n;fear++)for(let task=1n;task<=die;task++)doubledWins+=fear>task?2n:fear===task?1n:0n;
 expect(doubledWins).toBe(16n);expect(Q.of(doubledWins,8n*die).equals(Q.of(1n,3n))).toBe(true);
 const relief=readQ(items(l.a[6],'list')[1]).subtract(readQ(items(h.a[6],'list')[1]));
 expect(relief.equals(Q.of(2n,15n))).toBe(true);
 const actual=knowledge(high.r).efficacy!.cue!.mean!,oracle=actual.multiply(Q.of(1n).subtract(relief));
 expect(oracle.equals(Q.of(13n,15n))).toBe(true);expect(oracle.equals(actual)).toBe(false);
 console.info('M73 FearAsExtraDie FAILS: actual one nucleus/A0; detached d4 oracle A16/48. Original16/96 used d12; current grounded B d6.');
 console.info('M73 ReliefAsBeliefEvidence FAILS: unchanged actual danger mean1/support history; relief2/15 predicts13/15. Original relief1/2 predicted1/2; changed body/valuation operands, same epistemic invariant.');
},540000);
it('M73 controls: hidden body and denied perception preserve epistemic boundary',async()=>{
 const a=await create('high',9n),b=await create('hidden',9n);expect(state(a.r).read(bodyPath(C))).not.toEqual(state(b.r).read(bodyPath(C)));
 await through(a.r,10n);await through(b.r,10n);const x=projection(a.r),y=projection(b.r);
 expect(x.a).toEqual(y.a);expect(x.ns).toEqual(y.ns);expect(state(a.r).read(reappraisalPath(C))).toEqual(state(b.r).read(reappraisalPath(C)));
 const d=await create('denied'),z=projection(d.r,'denied');expect(z.signal(taskA,2n)).toEqual([]);expect(z.a[6]).toEqual(list([]));
 console.info('M73 CONTROLS PASS distinct hidden anchors/equal safe appraisal and reasons; denied body Unavailable, no modifier.');
},540000);
it('M73 persistence: exact repeat and restored relief and absent-ground continuations',async()=>{
 const {b,m,r:a}=await create('high',9n),repeat=await createCharacterRun(m,b.d);await through(repeat,9n);exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 for(const r of [a,repeat,restored]){await through(r,10n);projection(r);await finish(r);}exact(a,repeat);exact(a,restored);
 const no=await create('noGround',9n),nr=await restoreCharacterRun(no.b.s,{initialState:no.b.d.initialState,orderedInputs:no.b.d.orderedInputs,save:no.r.save()});exact(no.r,nr);
 for(const r of [no.r,nr]){await through(r,10n);projection(r,'noGround');await finish(r);}exact(no.r,nr);
 console.info('M73 PERSISTENCE PASS high repeat/restore9->101 and noGround restore9->101; exact state/output/trace/save/identity.');
},540000);
