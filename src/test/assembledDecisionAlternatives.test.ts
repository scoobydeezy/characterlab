import {it,expect} from 'vitest';
import {list,set,record,signed,unsigned as u,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {fixture} from './fixtures/assembledDecisionHistory';
import type {Regime} from './fixtures/assembledDecisionRegimes';
import {snap,through,finish,exact,bytes,projection,probability} from './fixtures/assembledAffectReceiving';
import {legacyContext,projected,chosen,dataFields,transcript,addressed,original,current,enumeration,decisionDraws} from './fixtures/assembledDecisionAlternatives';
import {replace} from './fixtures/assembledCharacter';
import {receivingRecord as rec,decodeCognitive as decode} from '../assembled/codecs';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {sid} from '../assembled/skill';
import {ExactRational as Q} from '../substrate/exactMath';
const regimes:Regime[]=['settled','quiet','balanced'];
async function create(regime:Regime,at=10n){const b=fixture(true,true,regime),r=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(r,at);return {b,r};}
function capture(x:Awaited<ReturnType<typeof create>>,regime:Regime){
 const p=projection(x.r),i=regimes.indexOf(regime),context=f(p.d,3n),old=legacyContext(context);
 const definition=f(rec(items(items(decode(x.b.s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/task-arbitration')))!,171n),4n);
 expect(f(rec(definition,440n),1n)).toEqual(q(1,2));expect(f(rec(definition,440n),2n)).toEqual(q(1,2));
 expect(uint(f(p.data,8n))).toBe(BigInt(i+1));expect(probability(p.data,p.A)).toEqual([Q.of(7n,8n),Q.of(23n,32n),Q.of(1n,2n)][i]);
 for(const n of p.ns){expect(f(n,4n)).toEqual(u(4));expect(f(rec(f(n,2n),406n),1n)).toEqual(q(3,8));}
 // Zero/positive current affect is actually consumed by the inherited projection proof.
 expect(f(p.ns.find(n=>key(f(rec(f(n,1n),404n),1n))===key(p.A))!,6n)).toEqual(signed(2-i));
 const raw=rec(f(rec(context,408n),2n),403n),nonempty=record(raw.schema,new Map([...raw.fields,[5n,set([p.ns[0]])]]));
 expect(()=>legacyContext(replace(context,2n,nonempty))).toThrow('empty Values lane');
 return {p,context,old,definition,root:f(p.d,1n)};
}
async function matrix(x:Awaited<ReturnType<typeof create>>,regime:Regime){
 const c=capture(x,regime),before=x.r.save(),originalContext=key(c.context);
 const run=(law:number)=>addressed(c.old,c.root,x.b.d.runSeed,draws=>original(c.old,c.definition,law,draws));
 const reference=await run(1),repeat=await run(1),now=await addressed(c.old,c.root,x.b.d.runSeed,draws=>current(c.context,c.definition,c.root,draws));
 expect(repeat).toEqual(reference);expect(projected(reference.value)).toEqual(dataFields(c.p.data));expect(dataFields(chosen(now.value))).toEqual(dataFields(c.p.data));
 expect(decisionDraws(reference.value)).toEqual(transcript(c.p.data));expect(reference.addresses).toEqual(now.addresses);
 const alternative=[];
 for(const law of [2,3,4,5]){
  if(law===5&&regime==='quiet'){await expect(run(law)).rejects.toThrow('DECISION_OPAQUE_DOMAIN');continue;}
  const r=await run(law);expect(await run(law)).toEqual(r);alternative.push({law,draws:decisionDraws(r.value).length,mode:Number(uint(f(rec(r.value,935n),12n)))});
  if(law===2&&regime==='settled'){expect(decisionDraws(r.value).length).toBeGreaterThanOrEqual(2);expect(f(rec(r.value,935n),12n)).toEqual(u(2));}
  if(law===3){expect(decisionDraws(r.value)).toHaveLength(0);expect(f(rec(r.value,935n),12n)).toEqual(u(1));}
  if(law===4){expect(decisionDraws(r.value)).toEqual(decisionDraws(reference.value));expect(r.addresses).toEqual(reference.addresses);}
  if(law===5&&regime==='balanced'){expect(decisionDraws(r.value)).toHaveLength(1);expect(items(f(rec(r.value,935n),13n),'list')).toHaveLength(0);}
 }
 expect(key(c.context)).toBe(originalContext);bytes(before,x.r.save());
 console.info('M83 ADDRESSED '+JSON.stringify({regime,nativeMode:Number(uint(f(c.p.data,8n))),nativeDraws:transcript(c.p.data).length,exactReference:true,alternative}));
 return {c,reference};
}
async function enumerate(c:ReturnType<typeof capture>,seed:Uint8Array,regime:Regime){
 const ns=items(f(rec(c.old,408n),3n),'list'),candidates=[c.p.A,c.p.B].sort((a,b)=>key(a)<key(b)?-1:1);
 const templateResult=await addressed(c.old,c.root,seed,async draws=>list([await draws.reason(ns[0]),await draws.reason(ns[1]),await draws.tie(candidates)]));
 const templates=items(templateResult.value,'list'),counts=new Map<number,number>(),drawCounts=new Map<number,number>(),decorative={different:0};
 for(let a=0;a<4;a++)for(let b=0;b<4;b++)for(let t=0;t<2;t++){
  const provider=enumeration(c.old,templates,a,b,t),native=chosen(await current(c.context,c.definition,c.root,provider.draws));
  for(const law of [1,2,3,4,5]){
   if(law===5&&regime==='quiet')continue;
   const control=enumeration(c.old,templates,a,b,t),v=rec(await original(c.old,c.definition,law,control.draws),935n);
   if(law===1){expect(projected(v)).toEqual(dataFields(native));expect(control.used).toEqual(provider.used);}
   if(law===4){expect(decisionDraws(v)).toEqual(transcript(native));if(key(f(v,5n))!==key(f(native,1n)))decorative.different++;}
   if(law===5&&regime==='balanced'){expect(control.used).toHaveLength(1);expect(items(f(v,13n),'list')).toHaveLength(0);}
   counts.set(law,(counts.get(law)??0)+(key(f(v,5n))===key(c.p.A)?1:0));drawCounts.set(law,(drawCounts.get(law)??0)+control.used.length);
  }
 }
 expect(counts.get(1)).toBe(regime==='settled'?32:regime==='quiet'?23:16);
 expect(counts.get(2)).toBe(regime==='settled'?28:regime==='quiet'?23:16);
 expect(drawCounts.get(3)).toBe(0);
 if(regime!=='settled')expect(decorative.different).toBeGreaterThan(0);
 if(regime==='balanced')expect(counts.get(5)).toBe(16);
 console.info('M83 ENUMERATED '+JSON.stringify({regime,uniformCases:32,AWins:Object.fromEntries(counts),drawCalls:Object.fromEntries(drawCounts),decorativeDisagreements:decorative.different,diagnosticTokensNotSeedOutputs:true}));
}
it('M83 native operands: execute all original decision alternatives and exact outcome enumeration',async()=>{
 for(const regime of regimes){const x=await create(regime),m=await matrix(x,regime);await enumerate(m.c,x.b.d.runSeed,regime);await finish(x.r);}
 console.info('M83 COMPARISONS PASS original comparator code on live native inputs; no alternate production runtime or seed hunt.');
},570000);
it('M83 continuation: balanced source and original comparator replay exactly after restore',async()=>{
 const a=await create('balanced',9n),b=await create('balanced',9n);exact(a.r,b.r);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.r.save()});exact(a.r,restored);
 for(const at of [10n,11n]){for(const r of [a.r,b.r,restored])await through(r,at);exact(a.r,b.r);exact(a.r,restored);
  if(at===10n){const first=await matrix(a,'balanced'),after=await matrix({...a,r:restored},'balanced');expect(after.reference).toEqual(first.reference);}
 }
 for(const r of [a.r,b.r,restored])await finish(r);exact(a.r,b.r);exact(a.r,restored);
 console.info('M83 CONTINUATION PASS exact state/output/trace/save/run identity9->10->11->101 and original comparator replay; frozen controls untouched.');
},570000);
