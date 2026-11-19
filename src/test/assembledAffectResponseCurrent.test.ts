/** M185 plan61513dc6: current affect, same reference laws and coupled production choice. */
import {it,expect} from 'vitest';
import {responseBase} from './fixtures/assembledAffectCurrent';
import {dataRecord as metadataRecord} from '../campaign2/canonicalData';
import {cachedMemory,startMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {restoreAuthoritativeState} from '../substrate/state';
import {restoreCharacterRun} from '../assembled/character';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q} from '../substrate/exactMath';
import {cognitiveRecord as cr} from '../assembled/codecs';
import {DISPLAY} from '../assembled/strategy';
import {PRIORITY_DISPLAY,PRIORITY_MOTIVE} from '../assembled/priority';
import {SHARED_AFFECT_APPRAISAL,reappraisalPath} from '../assembled/reappraisal';
import {AFFECT_RECALL} from '../assembled/affectMemory';
import {personPath} from '../assembled/social';
import {arbitrationOutput} from '../assembled/arbitration';
import {randomAddressValue,naturalRandomKeyValue} from '../substrate/random';
import {sid} from '../assembled/skill';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M185 RESPONSE signed');return v.value;};
const json=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const event=(t:ReturnType<typeof rec>)=>rec(f(t,4n),130n);
const result=(d:CanonicalValue)=>{const s=rec(f(rec(d,409n),4n),419n);expect(uint(f(s,1n)),'live resolved choice').toBe(3n);return rec(f(s,2n),420n);};
const fraction=(x:Q)=>x.numerator+'/'+x.denominator;
function fixture(urgency=1,permitted=true,hidden=false){
 const b=responseBase(hidden),slots=items(decode(b.s.registry),'list');
 expect(b.s.rulesVersion).toBe('rules/assembled-character/0.129-candidate');expect(items(slots[6],'list')).toEqual([text('assembled-body/0.2'),q(100,1),q(1,1),q(20,1),q(60,1),true,true,signed(0)]);
 const defs=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>metadataRecord(v,171n));
 const protocol=defs.find(v=>key(f(v,1n))===key(sid(1027,'definition/protocol-execution')))!;expect(f(metadataRecord(f(protocol,4n),434n),1n)).toBe(false);
 const threat=items(slots[28],'list')[4],group=items(items(slots[19],'list')[1],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(target))!;
 const competing=items(items(group[1],'list')[0],'list')[0];expect(key(competing)).not.toBe(key(threat));
 let changed=0;const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(at(a[0])===25n&&key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(competing))r[3]=uint(r[1])===1n;return list(r);}))]);return list(a);}if(at(a[0])!==26n||key(a[2])!==key(PRIORITY_DISPLAY))return v;
 const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(competing)){r[3]=list([q(urgency,1)]);r[4]=permitted;changed++;}return list(r);}))]);return list(a);});
 expect(changed).toBe(1);return {b:{s:b.s,d:{...b.d,orderedInputs:enc(list(rows))}},competing,threat};
}
async function create(urgency=1,permitted=true,hidden=false){const x=fixture(urgency,permitted,hidden);return {...await startMemory(x.b),competing:x.competing,threat:x.threat};}
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let n=0;await r.settleNextInstant();n++)expect(n).toBeLessThan(96);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
function projection(x:Awaited<ReturnType<typeof create>>){
 const r=x.run,a=reports(r,SHARED_AFFECT_APPRAISAL).find(a=>uint(a[1])===26n)!;
 expect(a,'live shared appraisal26').toBeDefined();expect(a[6]).toEqual(list([q(2,5),q(2,5)]));
 const body=rec(items(items(a[7],'list')[1],'list')[2],461n);expect(f(body,6n)).toEqual(text('embodied-level-observation/0.2-candidate'));expect([f(rec(f(body,5n),462n),1n),f(rec(f(body,5n),462n),2n)]).toEqual([q(20,1),q(40,1)]);expect(a[5]).toEqual(text('Known'));expect(readQ(items(a[6],'list')[1]).compare(Q.of(0n))).toBeGreaterThan(0);
 const d=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===26n)!;expect(d).toBeDefined();
 const data=result(d),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list').map(v=>rec(v,407n));
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));expect(candidates.length).toBeGreaterThanOrEqual(2);expect(candidates.length).toBeLessThanOrEqual(3);
 const signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const base=(task:CanonicalValue)=>signals.filter(v=>key(f(rec(f(v,1n),401n),2n))===key(task)&&uint(f(rec(f(v,1n),401n),3n))===1n);
 expect(base(x.threat),'live physical base').toHaveLength(1);expect(ns.some(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(x.threat,371n),2n))),'live threat ground').toBe(true);
 const priority=reports(r,PRIORITY_MOTIVE).find(a=>uint(a[1])===26n)!;expect(priority).toBeDefined();const operand=items(priority[2],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(x.competing))!;expect(operand).toBeDefined();
 const traces=outputs(r.snapshot().trace,160n),consumer=traces.find(t=>at(f(event(t),2n))===26n&&uint(f(event(t),3n))===80n&&typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).schema?.typeId===403n&&typeof f(t,12n)!=='boolean'&&(f(t,12n) as any).kind==='list'&&(f(t,12n) as any).items.length>1&&key(items(f(t,12n),'list')[1])===key(list(a)));
 expect(consumer,'actual affect-to-reasons consumer').toBeDefined();
 const produced=items(f(rec(f(consumer!,13n),403n),3n),'set').map(v=>rec(v,402n)).filter(v=>key(f(rec(f(v,1n),401n),2n))===key(x.threat)&&uint(f(rec(f(v,1n),401n),3n))===2n);
 expect(produced,'positive affect source').toHaveLength(1);const affect=produced[0];expect(f(affect,2n)).toEqual(items(a[6],'list')[1]);
 expect(signals.some(s=>key(s)===key(affect)),'exact affect signal reaches actual arbitration input').toBe(true);
 expect(items(f(raw,6n),'list').some(v=>key(items(v,'list')[2])===key(affect)),'actual described source').toBe(true);
 expect(ns.some(n=>items(f(rec(f(n,2n),406n),4n),'list').some(v=>{const c=rec(v,405n);return key(f(c,1n))===key(f(affect,1n))&&key(f(c,2n))===key(f(affect,2n))&&readQ(f(c,5n)).compare(Q.of(0n))>0;})),'compiled affect contribution survives source coverage').toBe(true);
 expect(traces.some(t=>at(f(event(t),2n))===26n&&key(f(t,12n))===key(raw)&&(key(f(t,13n))===key(context)||typeof f(t,13n)!=='boolean'&&(f(t,13n) as any).kind==='list'&&items(f(t,13n),'list').some(v=>key(v)===key(context)))),'actual compilation joins raw input to captured context').toBe(true);
 const producer=traces.find(t=>at(f(event(t),2n))===26n&&key(f(t,13n))===key(list(a)));expect(producer).toBeDefined();
 expect(outputs(r.snapshot().outputs,433n).some(o=>{const intent=rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n);return key(f(intent,2n))===key(d);}), 'actual intent/attempt/execution consumes decision').toBe(true);
 const mass=new Map(items(f(data,2n),'list').map(v=>{const p=rec(v,421n);return [key(f(p,1n)),readQ(f(p,2n))];}));
 const effective=(candidate:CanonicalValue)=>uint(f(data,8n))===1n?Q.of(key(f(data,1n))===key(candidate)?1n:0n):mass.get(key(candidate))!;
 console.info('M185 RESPONSE LIVE '+json({urgency:operand[2],motive:operand[3],affect:a[6],nuclei:ns.map(n=>({die:uint(f(n,4n)),standing:n.schema.schemaVersion===3n?uint(f(n,10n)):0n})),mode:uint(f(data,8n)),probabilities:candidates.map(c=>fraction(effective(c)))}));
 return {a,d,data,context,raw,ns,candidates,effective,operand,base};
}
const gcd=(a:bigint,b:bigint):bigint=>b?gcd(b,a%b):a,lcm=(a:bigint,b:bigint)=>a/gcd(a,b)*b;
async function enumerate(s:ReturnType<typeof fixture>['b']['s'],xs:ReturnType<typeof projection>[]){
 const defs=items(items(decode(s.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n));
 const def=f(defs.find(v=>key(f(v,1n))===key(sid(1027,'definition/task-arbitration')))!,4n);
 const spans=new Map<string,bigint>();
 for(const x of xs)for(const n of x.ns){if(n.schema.schemaVersion===3n)expect(uint(f(n,10n)),'no unenumerated fractional standing draw').toBe(0n);const k=key(f(n,1n));spans.set(k,lcm(spans.get(k)??1n,uint(f(n,4n))));}
 const dims=[...spans];let ties=1n;for(let n=2;n<=Math.max(...xs.map(x=>x.candidates.length));n++)ties=lcm(ties,BigInt(n));
 const total=dims.reduce((n,[,s])=>n*s,ties);expect(total).toBeLessThanOrEqual(4096n);
 const counts=xs.map(()=>new Map<string,bigint>());let changed=0n;
 for(let index=0n;index<total;index++){let rest=index;const tie=rest%ties;rest/=ties;const words=new Map<string,bigint>();for(const[k,span]of dims){words.set(k,rest%span);rest/=span;}
 const winners:string[]=[];
 for(const [arm,x]of xs.entries()){
  const draw=(value:bigint,span:bigint,n?:CanonicalValue)=>{
   const nk=n?rec(f(rec(n,407n),1n),404n):undefined,c=nk?rec(f(nk,1n),395n):rec(x.candidates[0],395n);
   const address={causalRootId:id(f(x.d,1n)),purposeId:sid(1042,nk?'purpose/task-reason-face':'purpose/task-decision-tie'),drawIndex:0n,subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},...(nk?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(nk,3n))}]:[])]};
   return cr(411,[randomAddressValue(address),naturalRandomKeyValue(address),u(value),u(span),u(((1n<<128n)/span)*span),false,list([cr(410,[u(0),u(value),false])])],1);
  };
  const value=await arbitrationOutput(f(x.d,1n),26n,x.context,def,{async reason(v){const n=rec(v,407n),k=key(f(n,1n)),span=uint(f(n,4n));return draw(words.get(k)!*span/spans.get(k)!,span,v);},async tie(leaders){return draw(tie*BigInt(leaders.length)/ties,BigInt(leaders.length));}},3);
  const out=result(value);expect(f(out,2n)).toEqual(f(x.data,2n));const winner=key(f(out,1n));winners.push(winner);counts[arm].set(winner,(counts[arm].get(winner)??0n)+1n);
 }
 if(winners[0]!==winners[1])changed++;
 }
 for(const[arm,x]of xs.entries())for(const c of x.candidates)expect(Q.of(counts[arm].get(key(c))??0n,total)).toEqual(x.effective(c));
 expect(changed).toBeGreaterThan(0n);console.info('M185 RESPONSE COUPLED '+json({total,changed,counts:counts.map((m,i)=>xs[i].candidates.map(c=>m.get(key(c))??0n))}));
}
it('final185 response same affect different response with exact coupled arbitration',async()=>{
 const high=await create(),low=await create(0);expect(high.b.s).toEqual(low.b.s);bytes(high.b.d.initialState,low.b.d.initialState);
 const a=items(decode(high.b.d.orderedInputs),'list'),b=items(decode(low.b.d.orderedInputs),'list');expect(a.filter((v,i)=>key(v)!==key(b[i]))).toHaveLength(1);
 for(let n=0;high.run.snapshot().clock<25n;n++){expect(n).toBeLessThan(96);for(const x of[high,low])expect(await x.run.settleNextInstant()).toBe(true);expect(high.run.snapshot().clock).toBe(low.run.snapshot().clock);bytes(high.run.snapshot().state,low.run.snapshot().state);bytes(high.run.snapshot().outputs,low.run.snapshot().outputs);}expect(high.run.snapshot().clock).toBe(25n);
 for(const x of[high,low])await through(x.run,26n);const h=projection(high),l=projection(low);
 expect(h.a).toEqual(l.a);for(const p of[reappraisalPath(C),personPath(C,target)])expect(state(high.run).read(p)).toEqual(state(low.run).read(p));
 expect(reports(high.run,AFFECT_RECALL)).toEqual(reports(low.run,AFFECT_RECALL));
 expect(h.operand[2]).toEqual(list([q(1,1)]));expect(l.operand[2]).toEqual(list([q(0,1)]));expect(h.operand[3]).not.toEqual(l.operand[3]);
 expect(h.base(high.competing)).toHaveLength(1);expect(l.base(low.competing)).toHaveLength(1);
 expect(h.candidates).toEqual(l.candidates);expect(h.candidates.some(c=>!h.effective(c).equals(l.effective(c)))).toBe(true);
 for(const x of[high,low]){const d=outputs(x.run.snapshot().outputs,409n).find(v=>at(f(v,2n))===26n)!;expect(outputs(x.run.snapshot().outputs,426n).some(e=>key(f(rec(f(e,2n),425n),2n))===key(d)),'actual expression consumes same decision').toBe(true);}
 await enumerate(high.b.s,[h,l]);
 const competingNucleus=h.ns.find(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(high.competing,371n),2n)))!;expect(competingNucleus,'live competing ground').toBeDefined();
 const alternative=f(rec(f(competingNucleus,1n),404n),1n);expect(h.effective(alternative).compare(Q.of(0n))).toBeGreaterThan(0);
 for(const x of[high,low])await finish(x.run);
 console.info('M185 RESPONSE PRIMARY PASS same positive complete appraisal/knowledge/memory, only competing current urgency changes actual reason and exact response mass; FearAsCommand/constant-affect-only response fail; full101.');
},540000);
it('final185 response denied urgency stays unknown and cannot change response',async()=>{
 const a=await create(1,false),b=await create(0,false);
 for(let n=0;a.run.snapshot().clock<26n;n++){expect(n).toBeLessThan(96);for(const x of[a,b])expect(await x.run.settleNextInstant()).toBe(true);expect(a.run.snapshot().clock).toBe(b.run.snapshot().clock);bytes(a.run.snapshot().state,b.run.snapshot().state);bytes(a.run.snapshot().outputs,b.run.snapshot().outputs);}expect(a.run.snapshot().clock).toBe(26n);const x=projection(a),y=projection(b);expect(x.operand[2]).toEqual(list([]));expect(y.operand[2]).toEqual(list([]));
 bytes(a.run.snapshot().state,b.run.snapshot().state);bytes(a.run.snapshot().outputs,b.run.snapshot().outputs);expect(x.d).toEqual(y.d);
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);bytes(a.run.snapshot().state,b.run.snapshot().state);bytes(a.run.snapshot().outputs,b.run.snapshot().outputs);if(!more)break;if(n===95)throw Error('M185 denied cap');}for(const r of[a.run,b.run]){expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}console.info('M185 RESPONSE DENIED PASS different unpermitted urgency displays, identical unknown evidence and actual response; full101.');
},540000);
it('final185 response privacy independent repeat and exact public continuation',async()=>{
 const a=await create(),repeat=await create(),hidden=await create(1,true,true);expect(key(decode(a.b.d.orderedInputs))).not.toBe(key(decode(hidden.b.d.orderedInputs)));
 for(let n=0;a.run.snapshot().clock<25n;n++){expect(n).toBeLessThan(96);for(const x of[a,repeat,hidden])expect(await x.run.settleNextInstant()).toBe(true);exact(a.run,repeat.run);bytes(a.run.snapshot().state,hidden.run.snapshot().state);bytes(a.run.snapshot().outputs,hidden.run.snapshot().outputs);}expect(a.run.snapshot().clock).toBe(25n);
 const restored=cachedMemory(await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);
 for(let n=0;n<96;n++){const more=await a.run.settleNextInstant();for(const p of[repeat.run,restored]){expect(await p.settleNextInstant()).toBe(more);exact(a.run,p);}expect(await hidden.run.settleNextInstant()).toBe(more);bytes(a.run.snapshot().state,hidden.run.snapshot().state);bytes(a.run.snapshot().outputs,hidden.run.snapshot().outputs);if(!more)break;if(n===95)throw Error('M185 RESPONSE queue cap');}
 expect(a.run.snapshot().clock).toBe(101n);for(const r of[a.run,repeat.run,restored,hidden.run])expect(r.diagnostic()).toBeUndefined();
 console.info('M185 RESPONSE PERSISTENCE PASS every remaining state/output/trace/save/run byte after25; hidden physical truth changes no safe state/output; complete101.');
},540000);
