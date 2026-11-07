import {it,expect} from 'vitest';
import {fixture as oldFixture,decode,enc,items,key,uint,signedValue} from './fixtures/assembledMemoryReplay';
import {list,text,unsigned as u,type CanonicalValue,canonicalEncode,bytesToHex} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun,characterModelIdentity} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {isSocialEpisodePath,MEMORY_RECALL,MEMORY_PRESENTATION} from '../assembled/memory';
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
 const rows=items(a![4],'list').map(v=>items(v,'list'));expect(rows,'two retained candidates').toHaveLength(2);
 expect(rows.every(x=>order.has(uint(x[0])))).toBe(true);expect(frac(a![3])).toBe('1/1');expect(unpackAffectCue(a![2],t).carry).toBeNull();
 const sorted=[...rows].sort((x,y)=>order.get(uint(x[0]))!-order.get(uint(y[0]))!);
 const p={at:t,base:sorted.map(v=>frac(v[1])),pull:sorted.map(v=>frac(v[2])),score:sorted.map(v=>frac(v[3])),selected:items(a![5],'list').map(v=>order.get(uint(items(v,'list')[0]))),history:histories(r)};
 expect(p.pull).toEqual(t===4n?['1/1','0/1']:t===5n?['0/1','1/1']:['0/1','0/1']);return p;
}
function print(r:Run,t:bigint,label:string){const p=projection(r,t);console.info('M63 '+label+' '+json(p));return p;}
async function create(mode:Parameters<typeof fixture>[0]='main',k=1){const b=fixture(mode,k);const m=await prepareCharacterModel(b.s);return {b,m,r:await createCharacterRun(m,b.d)};}
function bytes(a:Uint8Array,b:Uint8Array){expect(a.byteLength).toBe(b.byteLength);expect(a.every((x,i)=>x===b[i])).toBe(true);}
function exact(a:Run,b:Run){const x=snap(a),y=snap(b);expect([x.clock,x.status]).toEqual([y.clock,y.status]);for(const k of ['state','outputs','trace'] as const)bytes(x[k],y[k]);bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());}
function traces(r:Run){return outputs(snap(r).trace,160n);}
function traceGate(r:Run,t:bigint){
 const a=reports(r).find(v=>signedValue(v[1])===t)!;
 const trace=traces(r).find(v=>key(f(rec(f(v,4n),130n),5n))===key(MEMORY_RECALL)&&signedValue(f(rec(f(v,4n),130n),2n))===t)!;
 expect(trace).toBeDefined();const reads=items(f(trace,11n),'list').map(v=>rec(v,147n));expect(reads).toHaveLength(2);
 const inputEpisodes=reads.map(v=>items(f(v,4n),'list'));
 expect(new Set(inputEpisodes.map(x=>key(x[1]))).size).toBe(2);
 const selected=items(a[5],'list').map(v=>items(v,'list')),ids=selected.map(v=>uint(v[0]));
 for(const [acq,pub] of selected){expect(uint(acq)).not.toBe(uint(pub));expect(inputEpisodes.some(x=>uint(id(x[1]).payload)===uint(acq))).toBe(true);}
 const writes=traces(r).filter(v=>key(f(rec(f(v,4n),130n),5n))===key(MEMORY_PRESENTATION)&&signedValue(f(rec(f(v,4n),130n),2n))===t);
 expect(writes).toHaveLength(selected.length);
 for(const w of writes){
  expect(uint(f(rec(f(w,4n),130n),3n))).toBe(140n);
  const ops=items(f(rec(f(w,16n),144n),1n),'list');expect(ops).toHaveLength(1);
  const op=rec(ops[0],145n),before=items(f(op,3n),'list'),after=items(f(op,4n),'list');
  expect(ids).toContain(uint(id(after[1]).payload));expect(after.filter((_x,i)=>i!==4)).toEqual(before.filter((_x,i)=>i!==4));
  expect(items(after[4],'list')).toEqual([...items(before[4],'list'),{kind:'signed',value:t}]);
  expect(items(f(w,17n),'list').length).toBeGreaterThan(0);

  expect(items(f(rec(f(w,4n),130n),8n),'list')).toContainEqual(f(rec(f(trace,4n),130n),1n));
 }
 for(const row of records(r)){const ep=items(row.value,'list'),before=inputEpisodes.find(x=>key(x[1])===key(ep[1]))!;
  expect(before).toBeDefined();
  expect(ep.filter((_x,i)=>i!==4)).toEqual(before.filter((_x,i)=>i!==4));
  expect(items(ep[4],'list')).toEqual(ids.includes(uint(id(ep[1]).payload))?[...items(before[4],'list'),{kind:'signed',value:t}]:items(before[4],'list'));
 }
 console.info('M63 TRACE '+json({at:t,actualReads:reads.length,selected:ids,publicationIds:selected.map(v=>uint(v[1])),writes:writes.length}));
}

import {vi} from 'vitest';
import * as publication from '../campaign3/recollectionProduction';
import {ExactRational as Q} from '../substrate/exactMath';
import {presentationAccessibility} from '../campaign3/encodingAccessMath';
import {settleEventPresentationHistory} from '../campaign3/eventPresentationSettlement';
import {ACQUISITION_RULES,ACQUISITION_REGISTRY,ACTION_MEMORY_REGISTRY} from '../assembled/model';
import {ACQUISITION_MEMORY_VERSION} from '../assembled/affectMemory';
function fixture(mode:Parameters<typeof oldFixture>[0]='main',k=1){
 const b=oldFixture(mode,k),slots=[...items(decode(b.s.registry),'list')],ret=[...items(slots[8],'list')];ret[3]=u(3);slots[8]=list(ret);
 return {...b,s:{...b.s,rulesVersion:ACQUISITION_RULES,registrySchemaVersion:ACQUISITION_REGISTRY,registry:enc(list(slots))}};
}
function originalMapping(r:Run,t:bigint){
 const trace=traces(r).find(v=>key(f(rec(f(v,4n),130n),5n))===key(MEMORY_RECALL)&&signedValue(f(rec(f(v,4n),130n),2n))===t)!;
 expect(txt(f(trace,6n))).toBe(ACQUISITION_MEMORY_VERSION);
 const read=items(f(trace,11n),'list').map(v=>items(f(rec(v,147n),4n),'list'));
 const audit=reports(r).find(v=>signedValue(v[1])===t)!;
 for(const a of read){
  const acq={id:uint(id(a[1]).payload),kind:'EventContinuant' as const,acquiredAt:signedValue(a[5])};
  let history=settleEventPresentationHistory({now:acq.acquiredAt,priorAcquisitions:[],formed:[acq],survivingAcquisitions:[acq.id],priorHistory:[],presentations:[]});
  for(const at of items(a[4],'list').map(signedValue))history=settleEventPresentationHistory({now:at,priorAcquisitions:[acq],formed:[],survivingAcquisitions:[acq.id],priorHistory:history,presentations:[{acquisition:acq.id,recollection:1000n+at}]});
  expect(history[0].instants).toEqual([acq.acquiredAt,...items(a[4],'list').map(signedValue)]);
  const score=items(audit[4],'list').map(v=>items(v,'list')).find(v=>uint(v[0])===acq.id)!;
  const expected=presentationAccessibility(history[0].instants,t,Q.of(1n),1);
  expect(frac(score[1])).toBe(expected.numerator+'/'+expected.denominator);
 }
}

it('M63 native acquisition recency and selected-only reinforcement',async()=>{
 const {b,m,r:a}=await create(),o=fixture('omitted');expect(o.s).toEqual(b.s);
 const c=await createCharacterRun(m,o.d);
 await through(a,3n);await through(c,3n);expect(histories(a)).toEqual([[],[]]);expect(episodes(a)).toEqual(episodes(c));
 await through(a,4n);expect(print(a,4n,'first')).toMatchObject({base:['1/4','1/3'],selected:[0],history:[[4n],[]]});traceGate(a,4n);originalMapping(a,4n);
 await through(a,5n);expect(print(a,5n,'reinforced')).toMatchObject({base:['7/10','1/4'],selected:[1],history:[[4n],[5n]]});
 await through(a,8n);await through(c,8n);
 expect(print(a,8n,'repeated')).toMatchObject({base:['13/40','61/84'],selected:[1],history:[[4n],[5n,6n,8n]]});
 expect(print(c,8n,'omitted')).toMatchObject({base:['13/40','11/28'],selected:[1],history:[[4n],[5n,8n]]});traceGate(a,8n);traceGate(c,8n);
 for(const r of [a,c])await finish(r);
 for(const k of [0,2]){const {r}=await create('main',k);await through(r,3n);expect(histories(r)).toEqual([[],[]]);await through(r,4n);
  const p=print(r,4n,'K'+k);expect(p.base).toEqual(['1/4','1/3']);expect(p.selected).toHaveLength(k);traceGate(r,4n);originalMapping(r,4n);
  await through(r,5n);expect(print(r,5n,'K'+k+' later').base).toEqual(k===0?['1/5','1/4']:['7/10','3/4']);await finish(r);
 }
 console.info('M63 NATIVE PASS acquisition-independent K0/K1/K2; later selected-only reinforcement; original kernel/formation correspondence; all calendars101');
},540000);

it('M63 epistemic hidden truth and exact continuation',async()=>{
 const {b,m,r:a}=await create(),hidden=fixture('hidden');expect(hidden.s).toEqual(b.s);
 const h=await createCharacterRun(m,hidden.d),repeat=await createCharacterRun(m,b.d);
 for(const r of [a,h,repeat])await through(r,3n);
 expect(episodes(h)).toEqual(episodes(a));exact(a,repeat);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 for(const r of [a,h,repeat,restored])await finish(r);
 exact(a,repeat);exact(a,restored);expect(episodes(h)).toEqual(episodes(a));expect(reports(h)).toEqual(reports(a));
 expect(projection(a,8n).base).toEqual(['13/40','61/84']);
 console.info('M63 PRIVACY/CONTINUATION PASS hidden truth cognition equal; exact repeat/restore3->101 state/output/trace/save/identities');
},540000);

it('M63 rollback after actual publication and admission boundaries',async()=>{
 const {b,m,r}=await create();await through(r,3n);const before=snap(r),saved=r.save(),publish=publication.publishRecollections;
 const spy=vi.spyOn(publication,'publishRecollections').mockImplementation((view,allocate)=>{publish(view,allocate);throw Error('M63 after-publication fault');});
 try{await expect(step(r)).rejects.toThrow('M63 after-publication fault');const after=r.snapshot();expect([after.clock,after.outputs,after.state,after.trace]).toEqual([before.clock,before.outputs,before.state,before.trace]);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await through(restored,4n);
 expect(projection(restored,4n).base).toEqual(['1/4','1/3']);traceGate(restored,4n);await finish(restored);
 await expect(prepareCharacterModel({...b.s,registrySchemaVersion:ACTION_MEMORY_REGISTRY})).rejects.toThrow('unsupported');
 // Current public admission <=8 sources is stricter than the successor31 safety bound.
 const rows=items(decode(b.d.orderedInputs),'list'),nine=Array.from({length:9},(_,i)=>{const row=[...items(rows[0],'list')];row[0]={kind:'signed',value:BigInt(i+1)};return list(row);});
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list(nine))})).rejects.toThrow('social source domain');
 const q=Q.of(1n),times=Array.from({length:32},(_,i)=>BigInt(i));
 expect(presentationAccessibility(times,32n,q,1).numerator).toBeGreaterThan(0n);
 expect(()=>presentationAccessibility([...times,32n],33n,q,1)).toThrow('bounded count');
 console.info('M63 ROLLBACK/BOUNDARY PASS actual publication rolled back; restored resumes; mixed version/9 public sources/33 history entries rejected');
},540000);
