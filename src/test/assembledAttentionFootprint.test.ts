import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {associationPath,associationGraph,associationUnits,ASSOCIATION} from '../assembled/learnedAssociation';
import {AFFECT_RECALL,unpackAffectCue} from '../assembled/affectMemory';
import {BUDGET_ENCODING,validateEncoding} from '../assembled/encoding';
import {isSocialEpisodePath,MEMORY_RECALL} from '../assembled/memory';
import {personPath,personMean,personHistory} from '../assembled/social';
import {restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {unsigned as u} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {canonicalOperationKeyIndex} from '../campaign3/canonicalChildKeys';
import {settleEventAssociation} from '../campaign3/eventAssociationSettlement';
import {recallCanonicalEventAcquisitions} from '../campaign3/canonicalEventRecall';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue,type EncodingBudget} from './fixtures/assembledAttentionFootprint';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue;trace?:ReturnType<typeof outputs>}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs),trace=(r:Run)=>view(r).trace??=outputs(snap(r).trace,160n);
const report=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
const settings={nodes:30,edges:870},graph=(r:Run)=>associationGraph(state(r).read(associationPath(C)).value,settings);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(64);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<64;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('full queue did not exhaust');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
const j=(v:unknown)=>JSON.stringify(v,(_,x)=>typeof x==='bigint'?String(x):x);
function formation(r:Run,count:number,capacity=2){
 const es=episodes(r);expect(es).toHaveLength(capacity?2:0);
 const rows=report(r,BUDGET_ENCODING).filter(a=>items(a[8],'list').length||capacity===0).slice(0,2);expect(rows).toHaveLength(2);
 for(const a of rows){const audit=items(a[6],'list').map(v=>items(v,'list'));expect(audit).toHaveLength(count);expect(audit.every(v=>key(v[2])===key(text('Eligible')))).toBe(true);expect(audit.filter(v=>v[3]===true)).toHaveLength(Math.min(count,capacity));expect(validateEncoding(list(a),a[4])).toBe(capacity>0);}
 for(const e of es)expect(rows.map(a=>key(list(a)))).toContain(key(e[6]));
 // Recompute actual committed graph from source strengths, using original settlement.
 let g={keys:[] as CanonicalValue[],weights:[] as Q[][],lastUpdatedAt:0n};
 for(const e of es){
  const units=associationUnits(e[6],e[3]),index=canonicalOperationKeyIndex([...g.keys,...units.map(x=>x.key)]);
  const next=settleEventAssociation({prior:{...g,keys:g.keys.map(index.label)},now:(e[5] as {value:bigint}).value,formation:units.map(x=>({key:index.label(x.key),strength:x.strength})),calibration:{scale:1000n,eta:Q.of(1n),lambda:Q.of(1n)},capacity:settings});
  g={...next,keys:next.keys.map(index.original),weights:next.weights.map(row=>[...row])};
 }
 expect(graph(r)).toEqual(g);expect(report(r,ASSOCIATION)).toHaveLength(es.length);
 const belief=state(r).read(personPath(C,target)).value;expect(personHistory(belief)).toHaveLength(2);expect(personMean(belief)).toEqual({numerator:1n,denominator:2n});
 if(capacity===0)return [];
 return rows.map(a=>items(a[8],'list').map(v=>items(v,'list')).find(v=>key(v[1])===key(text('causal-role/actor')))!.at(6)!);
}
function probe(r:Run){
 const audit=report(r,AFFECT_RECALL).find(a=>key(a[1])===key(signed(21)))!;expect(audit).toBeDefined();expect(audit[3]).toEqual(q(1,1));
 const t=trace(r).find(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(21))&&key(f(e,5n))===key(MEMORY_RECALL);})!;
 expect(t).toBeDefined();const reads=items(f(t,11n),'list').map(v=>rec(v,147n)),gr=reads.find(v=>uint(f(rec(f(v,2n),140n),1n))===631n)!;expect(gr).toBeDefined();
 const g=associationGraph(f(gr,4n),settings),mem=reads.filter(v=>uint(f(rec(f(v,2n),140n),1n))===346n).map(v=>items(f(v,4n),'list')).filter(a=>key(a[0])===key(text('assembled-social-episode/0.1')));expect(mem).toHaveLength(2);
 const cue=unpackAffectCue(audit[2],21n);expect(cue.track).toBeDefined();
 const kernel=recallCanonicalEventAcquisitions({cue:{kind:'Present',key:cue.track!},now:21n,graph:g,memory:mem.map(a=>({id:uint(id(a[1]).payload),acquiredAt:(a[5] as {value:bigint}).value,units:associationUnits(a[6],a[3]).map(x=>({key:x.key,views:[enc(list(a))]}))})),presentations:new Map(mem.map(a=>[uint(id(a[1]).payload),[(a[5] as {value:bigint}).value,...items(a[4],'list').map(v=>(v as {value:bigint}).value)]])),calibration:{beta:Q.of(1n,2n),scale:1000n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:readQ(audit[3]),k:1}});
 expect(list(kernel.scores.map(s=>list([u(s.acquisition),qValue(s.base),qValue(s.pull),qValue(s.score)])))).toEqual(audit[4]);expect(items(audit[5],'list').map(v=>uint(items(v,'list')[0]))).toEqual(kernel.recalled.map(w=>w.id));expect(kernel.recalled).toHaveLength(1);
 const scores=episodes(r).map(e=>kernel.scores.find(s=>s.acquisition===uint(id(e[1]).payload))!);expect(scores.map(s=>qValue(s.base))).toEqual([q(1,21),q(1,20)]);
 const social=report(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;expect(items(social[4],'list')).toHaveLength(1);
 return {pulls:scores.map(s=>qValue(s.pull)),scores:scores.map(s=>qValue(s.score)),winnerAt:mem.find(a=>uint(id(a[1]).payload)===kernel.recalled[0].id)![5],judgment:social[4]};
}
it('primary124: four footprint competitors and shared denominator reach actual learned recall',async()=>{
 const cases:[EncodingBudget,string,CanonicalValue,CanonicalValue][]=[
 ['historical-shared','UnitBudget',q(3,10),q(3,10)],['independent','UnitBudget',q(3,13),q(3,13)],
 ['historical-hybrid','UnitBudget',q(3,13),q(3,13)],['retired-flat','UnitBudget',q(1,1),q(1,1)],
 ['historical-shared','SmallBudget',q(1,1),q(25,34)]];
 for(const [law,cal,sp,de]of cases){
  const results=[];for(const [mode,expected]of [['sparse',sp],['dense',de]] as const){
   const x=await create(mode,law,cal);await through(x.r,2n);expect(formation(x.r,mode==='sparse'?1:3)).toEqual([expected,expected]);
   const g=graph(x.r);expect(g.keys).toHaveLength(mode==='sparse'?0:3);
   await through(x.r,21n);const p=probe(x.r);results.push(p);await finish(x.r);
   console.info('M124 ROW',law,cal,mode,j({strength:expected,graph:g.weights,probe:p}));
  }
  expect(results[0].pulls).not.toEqual(results[1].pulls);expect(results[0].scores).not.toEqual(results[1].scores);
 }
},550000);
it('controls124: hidden and excluded evidence cannot set learned attention while K and modulation remain separate',async()=>{
 const a=await create(),hidden=await create('hidden'),denied=await create('denied'),sparse=await create('sparse'),one=await create('dense','historical-shared','UnitBudget',1),zero=await create('dense','historical-shared','UnitBudget',0),disabled=await create('dense','historical-shared','UnitBudget',2,'disabled-attention');
 for(const x of[a,hidden,denied,sparse,one,zero,disabled])await through(x.r,2n);
 for(const x of[a,hidden,disabled])formation(x.r,3);for(const x of[denied,sparse])formation(x.r,1);formation(one.r,3,1);formation(zero.r,3,0);
 for(const [x,y]of[[a,hidden],[denied,sparse]]){bytes(snap(x.r).state,snap(y.r).state);bytes(snap(x.r).outputs,snap(y.r).outputs);}
 expect(graph(one.r).keys).toHaveLength(0);expect(graph(zero.r).keys).toHaveLength(0);
 const participant=items(report(disabled.r,BUDGET_ENCODING)[0][8],'list').map(v=>items(v,'list')).find(v=>key(v[1])===key(text('causal-role/participant')))!;expect(participant[6]).toEqual(q(9,50));
 for(const x of[a,hidden,denied,sparse,one,disabled]){await through(x.r,21n);probe(x.r);await finish(x.r);}await finish(zero.r);
 bytes(snap(a.r).state,snap(hidden.r).state);bytes(snap(a.r).outputs,snap(hidden.r).outputs);bytes(snap(denied.r).state,snap(sparse.r).state);bytes(snap(denied.r).outputs,snap(sparse.r).outputs);
 console.info('M124 CONTROLS hidden==main; denied==sparse through full cognitive queues; K0/K1 graph empty; disabled attention participant9/50 independently changes magnitude');
},500000);
it('continuation124: reference dense footprint exact duplicate and save2 full continuation',async()=>{
 const {b,m,r}=await create(),duplicate=await createCharacterRun(m,b.d);await through(r,2n);await through(duplicate,2n);exact(r,duplicate);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:r.save()});exact(r,restored);await finish(r,[duplicate,restored]);
 console.info('M124 CONTINUATION exact duplicate/save2/restored at every settled boundary through exhaustion');
},300000);
