import {it,expect} from 'vitest';
import {fixture,decode,enc,items,key,uint,signedValue} from './fixtures/assembledMemoryCorrespondence';
import {list,text,unsigned as u,type CanonicalValue,canonicalEncode,bytesToHex} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {isSocialEpisodePath,MEMORY_RECALL,MEMORY_PRESENTATION,MEMORY_FORMATION} from '../assembled/memory';
import {AFFECT_RECALL,unpackAffectCue} from '../assembled/affectMemory';
import {outputs,type Run} from './fixtures/assembledComparison';
const frac=(v:CanonicalValue)=>{const q=readQ(v);return q.numerator+'/'+q.denominator;};
const json=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
const snapshots=new WeakMap<Run,ReturnType<Run['snapshot']>>();
const snap=(r:Run)=>{let s=snapshots.get(r);if(!s){s=r.snapshot();snapshots.set(r,s);}return s;};
async function step(r:Run){snapshots.delete(r);return r.settleNextInstant();}
async function through(r:Run,t:bigint){for(let n=0;snap(r).clock<t;n++){expect(n).toBeLessThan(24);expect(await step(r)).toBe(true);}expect(snap(r).clock).toBe(t);}
async function finish(r:Run){for(let n=0;await step(r);n++)expect(n).toBeLessThan(24);expect(snap(r).clock).toBe(101n);expect(r.diagnostic()).toBeUndefined();}
const records=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state)).entries().filter(e=>isSocialEpisodePath(e.path));
const episodes=(r:Run)=>records(r).map(e=>items(e.value,'list')).sort((a,b)=>Number(signedValue(a[5])-signedValue(b[5])));
const histories=(r:Run)=>episodes(r).map(a=>items(a[4],'list').map(signedValue));
const reports=(r:Run)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(AFFECT_RECALL))).map(v=>items(v,'list'));
function projection(r:Run,t:bigint){
 const a=reports(r).find(a=>signedValue(a[1])===t);expect(a,'live recall at '+t).toBeDefined();
 const es=episodes(r),order=new Map(es.map((a,i)=>[uint(id(a[1]).payload),i]));
 const rows=items(a![4],'list').map(v=>items(v,'list'));expect(rows,'two retained candidates').toHaveLength(episodes(r).length);
 expect(rows.every(x=>order.has(uint(x[0])))).toBe(true);expect(frac(a![3])).toBe('1/1');expect(unpackAffectCue(a![2],t).carry).toBeNull();
 const sorted=[...rows].sort((x,y)=>order.get(uint(x[0]))!-order.get(uint(y[0]))!);
 const p={at:t,base:sorted.map(v=>frac(v[1])),pull:sorted.map(v=>frac(v[2])),score:sorted.map(v=>frac(v[3])),selected:items(a![5],'list').map(v=>order.get(uint(items(v,'list')[0]))),history:histories(r)};
 expect(p.pull).toEqual(es.map(()=> '0/1'));return p;
}
function print(r:Run,t:bigint,label:string){const p=projection(r,t);console.info('M64 '+label+' '+json(p));return p;}
async function create(mode:Parameters<typeof fixture>[0]='main',k=2){const b=fixture(mode,k);const m=await prepareCharacterModel(b.s);return {b,m,r:await createCharacterRun(m,b.d)};}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.byteLength).toBe(b.byteLength);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
function traces(r:Run){return outputs(snap(r).trace,160n);}
function traceGate(r:Run,t:bigint){
 const a=reports(r).find(v=>signedValue(v[1])===t)!;
 const trace=traces(r).find(v=>key(f(rec(f(v,4n),130n),5n))===key(MEMORY_RECALL)&&signedValue(f(rec(f(v,4n),130n),2n))===t)!;
 expect(trace).toBeDefined();const reads=items(f(trace,11n),'list').map(v=>rec(v,147n));expect(reads).toHaveLength(episodes(r).length);
 const inputEpisodes=reads.map(v=>items(f(v,4n),'list'));
 expect(new Set(inputEpisodes.map(x=>key(x[1]))).size).toBe(episodes(r).length);
 const selected=items(a[5],'list').map(v=>items(v,'list')),ids=selected.map(v=>uint(v[0]));
 for(const [acq,pub] of selected){expect(uint(acq)).not.toBe(uint(pub));expect(inputEpisodes.some(x=>uint(id(x[1]).payload)===uint(acq))).toBe(true);}
 const writes=traces(r).filter(v=>key(f(rec(f(v,4n),130n),5n))===key(MEMORY_PRESENTATION)&&signedValue(f(rec(f(v,4n),130n),2n))===t);
 expect(writes).toHaveLength(selected.length);
 for(const w of writes){
  expect(uint(f(rec(f(w,4n),130n),3n))).toBe(140n);
  const ops=items(f(rec(f(w,16n),144n),1n),'list');expect(ops).toHaveLength(1);
  const op=rec(ops[0],145n),before=items(f(op,3n),'list'),after=items(f(op,4n),'list');
  expect(ids).toContain(uint(id(after[1]).payload));expect(after.filter((_x,i)=>i!==4&&i!==7)).toEqual(before.filter((_x,i)=>i!==4&&i!==7));
  expect(items(after[4],'list')).toEqual([...items(before[4],'list'),{kind:'signed',value:t}]);
  expect(items(f(w,17n),'list').length).toBeGreaterThan(0);

  expect(items(f(rec(f(w,4n),130n),8n),'list')).toContainEqual(f(rec(f(trace,4n),130n),1n));
 }
 for(const row of records(r)){const ep=items(row.value,'list'),before=inputEpisodes.find(x=>key(x[1])===key(ep[1]))!;
  expect(before).toBeDefined();
  expect(ep.filter((_x,i)=>i!==4&&i!==7)).toEqual(before.filter((_x,i)=>i!==4&&i!==7));
  if(!ids.includes(uint(id(ep[1]).payload)))expect(ep).toEqual(before);
  else expect(ep[7]===before[7]||before[7]===false&&ep[7]===true).toBe(true);
  expect(items(ep[4],'list')).toEqual(ids.includes(uint(id(ep[1]).payload))?[...items(before[4],'list'),{kind:'signed',value:t}]:items(before[4],'list'));
 }
 console.info('M64 TRACE '+json({at:t,actualReads:reads.length,selected:ids,publicationIds:selected.map(v=>uint(v[1])),writes:writes.length}));
}


import {ExactRational as Q} from '../substrate/exactMath';
import {presentationAccessibility} from '../campaign3/encodingAccessMath';
import {SOCIAL_SOURCE,SOCIAL_OBSERVE} from '../assembled/social';
import {WORKSPACE} from '../assembled/workspace';
const event=(v:ReturnType<typeof traces>[number])=>rec(f(v,4n),130n);
function canonicalOrder(ids:bigint[]){return [...ids].sort((a,b)=>{const x=canonicalEncode(u(a)),y=canonicalEncode(u(b));for(let n=0;n<Math.min(x.length,y.length);n++)if(x[n]!==y[n])return x[n]-y[n];return x.length-y.length;});}
function ancestry(r:Run,t:bigint){
 const ts=traces(r),index=new Map(ts.map(v=>[uint(f(event(v),1n)),event(v)]));
 const reaches=(start:bigint,target:bigint):boolean=>{const pending=[start],seen=new Set<bigint>();while(pending.length){const n=pending.pop()!;if(n===target)return true;if(seen.has(n))continue;seen.add(n);const e=index.get(n);if(e)pending.push(...items(f(e,8n),'list').map(uint));}return false;};
 for(const a of episodes(r)){
  const at=signedValue(a[5]),obs=items(a[2],'list'),experience=rec(a[3],227n);
  const source=ts.find(v=>key(f(event(v),5n))===key(SOCIAL_SOURCE)&&signedValue(f(event(v),2n))===at)!;
  const observed=ts.find(v=>key(f(event(v),5n))===key(SOCIAL_OBSERVE)&&signedValue(f(event(v),2n))===at)!;
  const observedOutput=items(items(f(observed,13n),'list')[0],'list');
  expect(items(observedOutput[1],'list')[0]).toEqual(obs[0]);
  expect(items(f(experience,8n),'set').map(v=>f(rec(v,216n),2n))).toContainEqual(obs[0]);
  expect(reaches(uint(f(event(observed),1n)),uint(f(event(source),1n)))).toBe(true);
  const formation=ts.find(v=>key(f(event(v),5n))===key(MEMORY_FORMATION)&&signedValue(f(event(v),2n))===at)!;
  expect(items(f(event(formation),6n),'list')[1]).toEqual(a[1]);
  expect(reaches(uint(f(event(formation),1n)),uint(f(event(observed),1n)))).toBe(true);
  expect(new Set([key(a[1]),key(obs[0]),key(f(experience,1n)),key(f(event(source),1n))]).size).toBe(4);
 }
 const recall=ts.find(v=>key(f(event(v),5n))===key(MEMORY_RECALL)&&signedValue(f(event(v),2n))===t)!;
 expect(items(f(recall,11n),'list')).toHaveLength(episodes(r).length);
 console.info('M64 ANCESTRY '+json({at:t,acquisitions:episodes(r).map(a=>uint(id(a[1]).payload)),sourceObservationExperienceJoins:episodes(r).length}));
}
function workspace(r:Run,t:bigint,k:number){
 const out=items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(WORKSPACE))).map(v=>items(v,'list')).find(a=>signedValue(a[1])===t);
 expect(out,'live workspace').toBeDefined();const selected=items(out![4],'list').map(v=>items(v,'list'));
 const recall=traces(r).find(v=>key(f(event(v),5n))===key(MEMORY_RECALL)&&signedValue(f(event(v),2n))===t)!;
 expect(selected).toHaveLength(k);for(const row of selected){expect(row[2]).toEqual(f(event(recall),1n));expect(items(row[1],'list')[1]).toEqual(row[0]);}
 console.info('M64 WORKSPACE '+json({at:t,count:selected.length,recallEvent:uint(f(event(recall),1n))}));
}
it('M64 mapped MEMORY recency reinforcement K and causal counterfactuals',async()=>{
 const measured=new Map<number,ReturnType<typeof projection>>();
 for(const k of [2,0,1]){
  const {r}=await create('main',k);await through(r,8n);expect(episodes(r).map(a=>signedValue(a[5]))).toEqual([5n,6n,7n,8n]);expect(histories(r)).toEqual([[],[],[],[]]);
  await through(r,9n);const first=print(r,9n,'first K'+k);expect(first.base).toEqual(['1/5','1/4','1/3','1/2']);expect(first.selected).toEqual(k===2?[3,2]:k===1?[3]:[]);
  traceGate(r,9n);ancestry(r,9n);workspace(r,9n,k);
  const es=episodes(r),ids=es.map(a=>uint(id(a[1]).payload));
  const importanceOnly=canonicalOrder(ids).slice(0,k);if(k===2)expect(importanceOnly).not.toEqual(first.selected.map(i=>ids[i!]));
  // Historical no-decay comparator on actual pre-retrieval acquisitions.
  const noDecay=es.map(a=>presentationAccessibility([signedValue(a[5])],9n,Q.of(0n),1));
  expect(noDecay.map(v=>v.numerator+'/'+v.denominator)).toEqual(['1/1','1/1','1/1','1/1']);
  await through(r,10n);const later=print(r,10n,'later K'+k);measured.set(k,later);traceGate(r,10n);
  expect(later.base[0]).toBe('1/6');
  if(k===2){expect(later.base[3]).toBe('5/6');expect(later.base[2]).toBe('3/4');
   const allReinforced=presentationAccessibility([5n,9n],10n,Q.of(1n),1);expect(allReinforced.numerator+'/'+allReinforced.denominator).toBe('2/3');expect(later.base[0]).not.toBe('2/3');
  }else if(k===0)expect(later.base[3]).toBe('1/3');
  await through(r,12n);traceGate(r,12n);await finish(r);
  expect(reports(r).map(a=>signedValue(a[1]))).toEqual([9n,10n,11n,12n,13n,14n,15n,16n]);
 }
 expect(measured.get(2)!.base[3]).not.toBe(measured.get(0)!.base[3]);
 console.info('M64 MEMORY :2/:3/:4/:5/:7/:8 mapped comparisons PASS; extra actual self-cues13..16 retained; historical no-decay is component-only');
},540000);
it('M64 encoding-time-only intervention and exact native reference-law tie',async()=>{
 const {b,m,r:a}=await create('recency',1),old=fixture('older',1);expect(old.s).toEqual(b.s);
 const c=await createCharacterRun(m,old.d);
 const x=items(decode(b.d.orderedInputs),'list'),y=items(decode(old.d.orderedInputs),'list');
 expect(x.filter((v,i)=>key(v)!==key(y[i]))).toHaveLength(1);const changed=x.findIndex((v,i)=>key(v)!==key(y[i]));expect(items(x[changed],'list').slice(1)).toEqual(items(y[changed],'list').slice(1));
 for(const r of [a,c])await through(r,6n);
 expect(print(a,6n,'recent').base).toEqual(['1/4','1/2']);expect(print(c,6n,'older').base).toEqual(['1/4','1/3']);traceGate(a,6n);traceGate(c,6n);
 for(const r of [a,c])await finish(r);
 const {r:t}=await create('tie',1);await through(t,7n);expect(histories(t)).toEqual([[6n],[]]);await through(t,8n);
 const p=print(t,8n,'native tie');expect(p.score).toEqual(['1/2','1/2']);
 const es=episodes(t),ids=es.map(a=>uint(id(a[1]).payload)),winner=canonicalOrder(ids)[0];expect(p.selected.map(i=>ids[i!])).toEqual([winner]);traceGate(t,8n);ancestry(t,8n);await finish(t);
 console.info('M64 RECENCY/TIE PASS only encoding timestamp changed; fixed lambda1 actual native tie, canonical winner, zero unselected mutation');
},540000);
it('M64 retained evidence privacy and full-calendar exact persistence',async()=>{
 const {b,m,r:a}=await create(),hidden=fixture('hidden');expect(hidden.s).toEqual(b.s);
 const h=await createCharacterRun(m,hidden.d),repeat=await createCharacterRun(m,b.d);
 for(const r of [a,h,repeat])await through(r,8n);exact(a,repeat);expect(episodes(a)).toEqual(episodes(h));
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 for(const r of [a,h,repeat,restored])await finish(r);exact(a,repeat);exact(a,restored);expect(episodes(a)).toEqual(episodes(h));expect(reports(a)).toEqual(reports(h));
 const sources=(r:Run)=>traces(r).filter(v=>key(f(event(v),5n))===key(SOCIAL_SOURCE)).map(v=>f(event(v),6n));
 expect(sources(a)).not.toEqual(sources(h));ancestry(a,12n);
 for(const r of [a,h]){
  const mismatches=episodes(r).filter(ep=>{const source=traces(r).find(t=>key(f(event(t),5n))===key(SOCIAL_SOURCE)&&signedValue(f(event(t),2n))===signedValue(ep[5]))!;
   const truth=items(items(f(event(source),6n),'list')[1],'list')[1],claim=items(items(ep[2],'list')[6],'list')[0];return key(truth)!==key(claim);});
  expect(mismatches).toHaveLength(2);
 }

 console.info('M64 PRIVACY/PERSISTENCE PASS physical truth differs, cognition/recall equal; exact repeat/restore8->101 all state/output/trace/save/identities; :6/:9');
},540000);
