import {it,expect} from 'vitest';
import {fixture,significant,create,capture,definition,legacy,oldData,coupling,drawSemantic,snap,finish,bytes,rec,f,items,key,uint,list,set,record,text,u,signed,q,replace,decode,outputs,type CanonicalValue,type Regime} from './fixtures/assembledDecisionReference';
import {addressed,original,current,projected,chosen,enumeration,decisionDraws} from './fixtures/assembledDecisionAlternatives';
import type {ArbitrationDraws} from '../campaign2/cognitiveArbitration';
import {restoreAuthoritativeState} from '../substrate/state';
import {relationshipPath,relationshipHistory,relationshipFold} from '../assembled/relationship';
import {target,other} from './fixtures/assembledDecisionSignificance';
import {C} from './fixtures/campaign2Cognitive';
const regimes:Regime[]=['settled','quiet','balanced'];
function bridge(oldNs:readonly CanonicalValue[],draws:ArbitrationDraws){
 return {async reason(n:CanonicalValue){const match=oldNs.find(v=>key(f(rec(v,407n),1n))===key(f(rec(n,407n),1n)));expect(match).toBeDefined();return draws.reason(match!);},tie:draws.tie,async rounding(){throw Error('M105 unexpected rounding');}};
}
it('M105 regimes and original alternatives retain exact receiving correspondence on0.85',async()=>{
 for(const regime of regimes){
  const x=await create(fixture(true,true,regime)),p=capture(x.run),def=definition(x.b.s),root=f(p.d,1n),compat=legacy(p.context),i=regimes.indexOf(regime);
  expect(f(rec(def,440n),1n)).toEqual(q(1,2));expect(f(rec(def,440n),2n)).toEqual(q(1,2));
  expect(uint(f(p.data,8n))).toBe(BigInt(i+1));expect(f(rec(items(f(p.data,2n),'list')[0],421n),2n)).toEqual([q(7,8),q(23,32),q(1,2)][i]);
  expect(p.ds).toHaveLength(i===0?0:2);
  for(const n of p.ns){expect(f(n,5n)).toEqual(signed(0));expect(f(n,8n)).toEqual(signed(0));}
  expect(p.ns.map(n=>f(n,6n))).toContainEqual(signed(2-i));
  const bad=replace(p.context,2n,replace(p.raw,5n,set([p.ns[0]])));expect(()=>legacy(bad)).toThrow('nonempty Values');
  expect(()=>legacy(replace(p.context,3n,list([replace(p.ns[0],10n,u(1)),p.ns[1]])))).toThrow('nonzero receiver extension');
  const before=x.run.save(),run=(law:number)=>addressed(compat.image,root,x.b.d.runSeed,draws=>original(compat.image,def,law,draws));
  const reference=await run(1);expect(await run(1)).toEqual(reference);expect(projected(reference.value)).toEqual(oldData(p.data));expect(decisionDraws(reference.value)).toEqual(p.transcript);
  const now=await addressed(compat.image,root,x.b.d.runSeed,draws=>current(p.context,def,root,bridge(compat.oldNs,draws)));
  expect(oldData(chosen(now.value))).toEqual(oldData(p.data));expect(now.addresses).toEqual(reference.addresses);
  for(const law of [2,3,4,5]){
   if(law===5&&regime==='quiet'){await expect(run(law)).rejects.toThrow('DECISION_OPAQUE_DOMAIN');continue;}
   const v=rec((await run(law)).value,935n);
   if(law===2&&i===0){expect(decisionDraws(v).length).toBeGreaterThanOrEqual(2);expect(uint(f(v,12n))).toBe(2n);}
   if(law===3){expect(decisionDraws(v)).toHaveLength(0);expect(uint(f(v,12n))).toBe(1n);}
   if(law===4)expect(decisionDraws(v)).toEqual(p.transcript);
   if(law===5&&i===2){expect(decisionDraws(v)).toHaveLength(1);expect(items(f(v,13n),'list')).toHaveLength(0);}
  }
  const candidates=items(f(rec(f(p.raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n)).sort((a,b)=>key(a)<key(b)?-1:1);
  const template=await addressed(compat.image,root,x.b.d.runSeed,async draws=>list([await draws.reason(compat.oldNs[0]),await draws.reason(compat.oldNs[1]),await draws.tie(candidates)]));
  const counts=new Map<number,number>();let decorative=0;
  for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let tie=0;tie<2;tie++){
   const provider=enumeration(compat.image,items(template.value,'list'),a,b,tie);
   const native=chosen(await current(p.context,def,root,bridge(compat.oldNs,provider.draws)));
   for(const law of [1,2,3,4,5]){
    if(law===5&&i===1)continue;
    const control=enumeration(compat.image,items(template.value,'list'),a,b,tie),v=rec(await original(compat.image,def,law,control.draws),935n);
    if(law===1){expect(projected(v)).toEqual(oldData(native));expect(control.used).toEqual(provider.used);}
    if(law===3)expect(control.used).toHaveLength(0);
    if(law===4){expect(decisionDraws(v)).toEqual(provider.used);if(key(f(v,5n))!==key(f(native,1n)))decorative++;}
    if(law===5&&i===2)expect(control.used).toHaveLength(1);
    counts.set(law,(counts.get(law)??0)+(key(f(v,5n))===key(candidates[0])?1:0));
   }
  }
  expect(counts.get(1)).toBe([32,23,16][i]);expect(counts.get(2)).toBe([28,23,16][i]);expect(decorative).toBe([0,9,16][i]);
  if(i===2)expect(counts.get(5)).toBe(16);
  bytes(before,x.run.save());await finish(x.run);
  console.info('M105 REGIME PASS '+JSON.stringify({regime,mode:i+1,AProbability:['7/8','23/32','1/2'][i],uniformCases:32,AWins:Object.fromEntries(counts),decorativeDifferences:decorative,authoritativeDraws:p.transcript.length,fullCalendar101:true}));
 }
},570000);
it('M105 significance preserves matched dice and winner while changing presentation mode',async()=>{
 const setup=[await create(significant(true)),await create(significant(false))],maps=setup.map(x=>coupling(capture(x.run)));
 const low=await create(significant(true,maps[0])),high=await create(significant(false,maps[1])),a=capture(low.run),b=capture(high.run);
 for(const [x,p,isLow] of [[low,a,true],[high,b,false]] as const){
  const state=restoreAuthoritativeState(decode(snap(x.run).state));
  const relation=outputs(snap(x.run).trace,160n).find(t=>{const v=f(t,13n);return typeof v!=='boolean'&&v.kind==='list'&&v.items.length===2&&typeof v.items[1]!=='boolean'&&v.items[1].kind==='list'&&key(v.items[1].items[0])===key(text('assembled-relationship-people/0.1/appraisal'))&&key(f(rec(f(t,4n),130n),2n))===key(signed(10));})!;
  expect(relation).toBeDefined();
  for(const person of [target,other]){const prior=state.read(relationshipPath(C,person)).value,history=relationshipHistory(prior);expect(history).toHaveLength(isLow?1:0);expect(relationshipFold(prior).rupture).toBe(isLow);for(const row of history)expect(items(f(relation,9n),'list')).toContainEqual(items(row,'list')[0]);}
  expect(items(f(p.data,2n),'list').map(v=>f(rec(v,421n),2n))).toEqual([q(1,2),q(1,2)]);
  expect(f(p.data,4n)).toEqual(q(1,1));expect(f(p.data,6n)).toEqual(isLow?q(1,3):q(5,7));expect(f(p.data,7n)).toEqual(f(p.data,6n));expect(uint(f(p.data,8n))).toBe(isLow?2n:3n);
  for(const n of p.ns){expect(f(n,5n)).toEqual(signed(isLow?-2:0));expect(f(n,9n)).toEqual(f(n,5n));}
 }
 expect(a.ds.map(d=>drawSemantic(f(d,5n)))).toEqual(b.ds.map(d=>drawSemantic(f(d,5n))));
 expect(a.ds.map(d=>f(d,6n))).toEqual(b.ds.map(d=>f(d,6n)));expect(f(a.data,1n)).toEqual(f(b.data,1n));
 const at=rec(f(a.data,10n),423n),bt=rec(f(b.data,10n),423n);expect(f(at,1n)).toEqual(f(bt,1n));
 if(uint(f(at,1n))===2n){expect(drawSemantic(f(at,3n))).toEqual(drawSemantic(f(bt,3n)));expect(f(at,4n)).toEqual(f(bt,4n));}
 for(const x of [...setup,low,high])await finish(x.run);
 console.info('M105 SIGNIFICANCE PASS acquired personal history vs witnessed;standing-2/0;P1/2 both;stake1/3 vs5/7;Quiet/Player;matched2 face draws and winner;no rounding;full calendars101');
},570000);
