import {it,expect} from 'vitest';
import {fixture,decode,enc,items,key,uint,signedValue} from './fixtures/assembledMemoryReplay';
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
 expect(p.pull).toEqual(['0/1','0/1']);return p;
}
function print(r:Run,t:bigint,label:string){const p=projection(r,t);console.info('M62 '+label+' '+json(p));return p;}
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
 console.info('M62 TRACE '+json({at:t,actualReads:reads.length,selected:ids,publicationIds:selected.map(v=>uint(v[1])),writes:writes.length}));
}
it('M62 native: recency selective reinforcement decay capacity and canonical tie',async()=>{
 const {b,m,r:a}=await create(),other=fixture('omitted');expect(other.s).toEqual(b.s);
 const slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(44);expect(txt(items(slots[29],'list')[1])).toBe('UncontrolledGain');expect(txt(items(slots[31],'list')[1])).toBe('SignificanceFirst');
 console.info('M62 REFERENCE '+json({rules:b.s.rulesVersion,registry:b.s.registrySchemaVersion,model:bytesToHex(characterModelIdentity(m)),slots:44,retention:items(slots[8],'list').map(key),retrieval:items(slots[9],'list').map(key),affect:items(slots[29],'list').map(key),seed:bytesToHex(b.d.runSeed)}));
 const c=await createCharacterRun(m,other.d);await through(a,3n);await through(c,3n);
 expect(histories(a)).toEqual([[2n],[3n]]);expect(episodes(a)).toEqual(episodes(c));
 await through(a,4n);expect(print(a,4n,'initial')).toMatchObject({base:['1/3','1/2'],selected:[1],history:[[2n],[3n,4n]]});traceGate(a,4n);
 await through(a,6n);await through(c,6n);
 expect(print(a,6n,'repeated')).toMatchObject({base:['1/5','7/12'],selected:[1],history:[[2n],[3n,4n,6n]]});
 expect(print(c,6n,'unretrieved')).toMatchObject({base:['1/5','1/4'],selected:[1],history:[[2n],[3n,6n]]});
 for(const r of [a,c])await finish(r);
 for(const k of [0,2]){const {r}=await create('main',k);await through(r,4n);const p=print(r,4n,'K'+k);expect(p.selected).toHaveLength(k);traceGate(r,4n);await finish(r);}
 const {r:t}=await create('tie');await through(t,7n);expect(histories(t)).toEqual([[3n,6n],[7n]]);await through(t,8n);const p=print(t,8n,'tie');expect(p.base).toEqual(['1/2','1/2']);
 const es=episodes(t),ordered=es.map((e,i)=>({i,bytes:canonicalEncode(u(uint(id(e[1]).payload)))})).sort((a,b)=>{for(let n=0;n<Math.min(a.bytes.length,b.bytes.length);n++)if(a.bytes[n]!==b.bytes[n])return a.bytes[n]-b.bytes[n];return a.bytes.length-b.bytes.length;});
 expect(p.selected).toEqual([ordered[0].i]);traceGate(t,8n);await finish(t);
 const draws=[a,c,t].map(r=>traces(r).flatMap(v=>items(f(v,14n),'list')).length);expect(draws).toEqual([0,0,0]);
 console.info('M62 NATIVE PASS recency/reinforcement/idle-decay/K0/K1/K2/tie; all calendars to101; no dice; neutral importance cannot explain distinct histories');
},530000);
it('M62 epistemic: hidden truth leaves retained cognition and recall unchanged',async()=>{
 const {b,m,r:a}=await create(),hidden=fixture('hidden');expect(hidden.s).toEqual(b.s);const h=await createCharacterRun(m,hidden.d);
 await through(a,6n);await through(h,6n);expect(episodes(h)).toEqual(episodes(a));expect(reports(h)).toEqual(reports(a));traceGate(a,6n);traceGate(h,6n);
 for(const r of [a,h])await finish(r);expect(episodes(h)).toEqual(episodes(a));expect(reports(h)).toEqual(reports(a));
 console.info('M62 EPISTEMIC PASS same displayed evidence/different hidden truth; original observations and retained/recollection identity joins preserved');
},490000);
it('M62 persistence: exact repeat and complete-prefix continuation after presentation history',async()=>{
 const {b,m,r:a}=await create(),bRun=await createCharacterRun(m,b.d);await through(a,3n);await through(bRun,3n);exact(a,bRun);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);
 for(const r of [a,bRun,restored])await finish(r);exact(a,bRun);exact(a,restored);
 expect(projection(a,6n).base).toEqual(['1/5','7/12']);
 console.info('M62 PERSISTENCE PASS exact3 and terminal101 state/output/trace/save/run identity across fresh repeat and restored continuation');
},490000);
