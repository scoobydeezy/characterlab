/** M190 planadae0aba: current reference factors, original source semantics. */
import {it,expect} from 'vitest';
import {fixture as memory} from './fixtures/assembledAffectMemoryCurrent';
import {startMemory,cachedMemory,type MemoryRun as Run} from './fixtures/assembledMemoryFinal';
import {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,u,type CanonicalValue} from './fixtures/assembledFamiliarity';
import {taskA,taskB} from './fixtures/assembledGroundedAffect';
import {readQ} from '../campaign2/cognitiveMath';
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import {restoreAuthoritativeState} from '../substrate/state';
import {restoreCharacterRun} from '../assembled/character';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {validateMitigationPacket} from '../assembled/mitigation';
import {reappraisalPath,reappraisalKnowledge,SHARED_AFFECT_APPRAISAL} from '../assembled/reappraisal';
import {POSITION_SOURCE} from '../assembled/positionPerception';
import {SOCIAL_SOURCE} from '../assembled/social';
import {BODY_DELIVERY} from '../assembled/body';
import {DISPLAY} from '../assembled/strategy';
import {PRIORITY_DISPLAY} from '../assembled/priority';
import {sid} from '../assembled/skill';
import {STRESS,stressPath,stressAnchor} from '../assembled/regulatoryStress';
let base:ReturnType<typeof memory>|undefined;
type Cell={p:0|1;s:0|1;v:0|1;c:0|1};
type Control='normal'|'hidden'|'denied';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M190 time');return v.value;};
const fraction=(v:Q)=>v.numerator+'/'+v.denominator;
const normalized=(v:Q)=>{const n=v.divide(Q.of(1n).add(Q.of(v.numerator<0n?-v.numerator:v.numerator,v.denominator)));return q(n.numerator,n.denominator);};
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const knowledge=(r:Run)=>reappraisalKnowledge(state(r).read(reappraisalPath(C)).value,C,true,true,true,true);
const bits=[0,1] as const;
const cells:Cell[]=bits.flatMap(p=>bits.flatMap(s=>bits.flatMap(v=>bits.map(c=>({p,s,v,c})))));
function factorFixture(cell:Cell,control:Control='normal'){
 const b=structuredClone(base??(base=memory())),slots=[...items(decode(b.s.registry),'list')],affect=[...items(slots[28],'list')],social=items(slots[19],'list');affect[5]=q(cell.s,1);slots[28]=list(affect);
 slots[19]=list([social[0],list(items(social[1],'list').map(v=>list([items(v,'list')[0],list([])])))]);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE)).map(v=>{
  const a=[...items(v,'list')],t=at(a[0]);if(![POSITION_SOURCE,DISPLAY,PRIORITY_DISPLAY].some(v=>key(v)===key(a[2])))return v;const p=[...items(a[3],'list')];
  if(key(a[2])===key(POSITION_SOURCE)){
   const annex=[...items(p[3],'list')];if(t===6n)annex[7]=!cell.c;if(t===9n)annex[7]=!!cell.p;
   if(control==='hidden')annex[1]=!annex[1];
   if(control==='denied'&&t===5n){const panel=[...items(p[2],'list')];panel[3]=false;p[2]=list(panel);}
   p[3]=list(annex);
  }else if(key(a[2])===key(DISPLAY)){
   p[1]=list(items(p[1],'list').map(v=>{const route=[...items(v,'list')];route[3]=uint(route[1])===(key(route[0])===key(taskB)?1n:0n);return list(route);}));
  }else if(key(a[2])===key(PRIORITY_DISPLAY)){
   p[1]=list(items(p[1],'list').map(v=>{const r=[...items(v,'list')],main=[taskA,taskB].some(t=>key(t)===key(r[0]));
    if(t===1n)r[1]=list([q(main?1:0,1)]);else r[3]=list([q(main?1:0,1)]);return list(r);}));
  }
  a[3]=list(p);return list(a);
 });
 rows.push(list([signed(9),u(110),BODY_DELIVERY,list([C,q(cell.v?90:0,1),false]),list([])]));
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}

const chosenCell:Cell={p:1,s:1,v:1,c:0};
function fixture(noGround=false){
 const b=factorFixture(chosenCell);if(!noGround)return b;let changed=0;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(at(a[0])!==1n||key(a[2])!==key(PRIORITY_DISPLAY))return v;
  const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(taskA)){expect(r[1]).toEqual(list([q(1,1)]));r[1]=list([q(0,1)]);changed++;}return list(r);}))]);return list(a);
 });expect(changed).toBe(1);return {...b,d:{...b.d,orderedInputs:enc(list(rows))}};
}
const reports=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const event=(v:ReturnType<typeof rec>)=>rec(f(v,4n),130n);
async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){expect(n).toBeLessThan(96);expect(await r.settleNextInstant()).toBe(true);}expect(r.snapshot().clock).toBe(t);}
async function finish(r:Run){for(let n=0;await r.settleNextInstant();n++)expect(n).toBeLessThan(96);expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
function live(r:Run,absent=false){
 const a=reports(r,SHARED_AFFECT_APPRAISAL).find(v=>uint(v[1])===10n)!;expect(a,'live positive threat').toBeDefined();expect(a[5]).toEqual(text('Known'));expect(a[6]).toEqual(list([q(119,200),q(119,200)]));
 const d=outputs(r.snapshot().outputs,409n).find(v=>at(f(v,2n))===10n)!;expect(d).toBeDefined();const status=rec(f(d,4n),419n);expect(uint(f(status,1n))).toBe(3n);const data=rec(f(status,2n),420n),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n),ns=items(f(context,3n),'list').map(v=>rec(v,407n)),signals=items(f(raw,3n),'set').map(v=>rec(v,402n));
 const own=(task:CanonicalValue,role:bigint)=>signals.filter(v=>key(f(rec(f(v,1n),401n),2n))===key(task)&&uint(f(rec(f(v,1n),401n),3n))===role);
 const nucleus=(task:CanonicalValue)=>ns.filter(n=>key(f(rec(f(n,1n),404n),3n))===key(f(rec(task,371n),2n)));
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));expect(candidates).toHaveLength(2);
 expect(own(taskB,1n)).toHaveLength(1);expect(readQ(f(own(taskB,1n)[0],2n)).compare(Q.of(0n))).toBeGreaterThan(0);expect(nucleus(taskB)).toHaveLength(1);
 const traces=outputs(r.snapshot().trace,160n),consumer=traces.find(t=>at(f(event(t),2n))===10n&&uint(f(event(t),3n))===80n&&typeof f(t,13n)!=='boolean'&&(f(t,13n)as any).schema?.typeId===403n&&typeof f(t,12n)!=='boolean'&&(f(t,12n)as any).kind==='list'&&key(items(f(t,12n),'list')[1])===key(list(a)))!;
 expect(consumer,'actual affect receiver').toBeDefined();const packet=items(f(consumer,12n),'list');expect(traces.some(t=>uint(f(event(t),1n))===uint(packet[2])&&key(f(t,13n))===key(list(a)))).toBe(true);
 expect(outputs(r.snapshot().outputs,426n).some(e=>key(f(rec(f(e,2n),425n),2n))===key(d))).toBe(true);
 expect(outputs(r.snapshot().outputs,433n).some(o=>key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(d))).toBe(true);
 expect(ns).toHaveLength(absent?1:2);expect(own(taskA,1n)).toHaveLength(absent?0:1);expect(own(taskA,2n)).toHaveLength(absent?0:1);expect(nucleus(taskA)).toHaveLength(absent?0:1);
 const B=f(rec(f(nucleus(taskB)[0],1n),404n),1n),A=candidates.find(v=>key(v)!==key(B))!;expect(A).toBeDefined();
 const probability=items(f(data,2n),'list').find(v=>key(f(rec(v,421n),1n))===key(A))!;expect(probability).toBeDefined();
 if(absent){expect(f(rec(probability,421n),2n)).toEqual(q(0,1));expect(f(data,1n)).toEqual(B);const produced=items(f(rec(f(consumer,13n),403n),3n),'set').map(v=>rec(v,402n));expect(produced.filter(v=>key(f(rec(f(v,1n),401n),2n))===key(taskA)&&uint(f(rec(f(v,1n),401n),3n))===2n)).toHaveLength(0);}
 return {a,data,ns,A,B,own,nucleus};
}
it('current190 orphan affect cannot invent a motive and exact continuation',async()=>{
 const normal=await startMemory(fixture()),no=await startMemory(fixture(true));expect(normal.b.s).toEqual(no.b.s);bytes(normal.b.d.initialState,no.b.d.initialState);
 const inputs=items(decode(normal.b.d.orderedInputs),'list'),other=items(decode(no.b.d.orderedInputs),'list');expect(inputs.filter((v,i)=>key(v)!==key(other[i]))).toHaveLength(1);
 await through(normal.run,10n);await through(no.run,9n);const repeat=await startMemory(fixture(true));await through(repeat.run,9n);exact(no.run,repeat.run);
 const restored=cachedMemory(await restoreCharacterRun(no.b.s,{initialState:no.b.d.initialState,orderedInputs:no.b.d.orderedInputs,save:no.run.save()}));exact(no.run,restored);
 const n=live(normal.run);let reached=false;
 for(let i=0;i<96;i++){const more=await no.run.settleNextInstant();for(const r of[repeat.run,restored]){expect(await r.settleNextInstant()).toBe(more);exact(no.run,r);}
  if(more&&no.run.snapshot().clock===10n){reached=true;const x=live(no.run,true);expect(x.a[6]).toEqual(n.a[6]);expect(state(no.run).read(reappraisalPath(C))).toEqual(state(normal.run).read(reappraisalPath(C)));expect(x.nucleus(taskB)).toEqual(n.nucleus(taskB));
   const bn=x.nucleus(taskB)[0],die=uint(f(bn,4n));expect(die).toBe(6n);expect([5n,6n].map(k=>at(f(bn,k)))).toEqual([0n,1n]);if(bn.schema.schemaVersion===3n)expect(uint(f(bn,10n))).toBe(0n);
   // Preserved FearAsExtraDie violation: a detached fear d4, not a new native law.
   let wins=0n;for(let fear=1n;fear<=4n;fear++)for(let b=1n;b<=die;b++){const score=b+at(f(bn,5n))+at(f(bn,6n));wins+=fear>score?2n:fear===score?1n:0n;}
   expect(wins).toBe(9n);expect(Q.of(wins,8n*die)).toEqual(Q.of(3n,16n));
   console.info('M190 ORPHAN PASS positive E/U119/200 retained; actual A base/situation/nucleus absent, probability0, actual B choice/expression/attempt. Detached fear d4 on captured d6+1 gives9/48; original d6+0 oracle16/48 remains version-scoped.');
  }if(!more)break;if(i===95)throw Error('M190 queue cap');
 }
 expect(reached).toBe(true);for(const r of[no.run,repeat.run,restored]){expect(r.snapshot().clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}await finish(normal.run);
 console.info('M190 ORPHAN CONTINUATION PASS same model/initial, one importance field changed; repeat/public save9 every later full byte through101.');
},550000);
