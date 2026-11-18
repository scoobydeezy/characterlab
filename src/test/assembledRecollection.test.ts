import {SOCIAL_SOURCE} from '../assembled/social';
import {PerceptualFeatureId as CF} from '../semanticBinding/perceptualClassification';
import {it,expect} from 'vitest';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {RECOLLECTION,isSummaryPath,summaryValue} from '../assembled/recollection';
import {appearanceEpisode,isAppearancePath,FAMILIARITY} from '../assembled/familiarity';
import {fixture155,items,decode,key,enc,list,text,signed,u,type Mode155,type CanonicalValue} from './fixtures/assembledRecollection';
import {exact,bytes,outputs,rec,f,uint,C} from './fixtures/assembledFamiliarity';
import {recollect} from '../campaign3/recollectionMath';
import {recollectionRecord as r} from '../campaign3/recollectionCodecs';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
export type Run155=Awaited<ReturnType<typeof createCharacterRun>>;
export async function start155(mode:Mode155='baseline'){const b=fixture155(mode),m=await prepareCharacterModel(b.s),run=await createCharacterRun(m,b.d);return {b,m,run};}
export const state155=(run:Run155)=>restoreAuthoritativeState(decode(run.snapshot().state));
export const memories155=(run:Run155)=>state155(run).entries().filter(e=>isAppearancePath(e.path));
export const summaries155=(run:Run155)=>state155(run).entries().filter(e=>isSummaryPath(e.path));
export const recalls155=(run:Run155)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(RECOLLECTION))).map(v=>items(v,'list'));
export function recall155(run:Run155,at:number){const rows=recalls155(run).filter(a=>key(a[1])===key(signed(at)));expect(rows,'actual live recollection').toHaveLength(1);return rows[0];}
export async function through155(run:Run155,at:bigint){for(let i=0;run.snapshot().clock<at;i++){expect(i).toBeLessThan(96);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(at);}
export async function finish155(run:Run155,peers:Run155[]=[]){for(let i=0;i<96;i++){const more=await run.settleNextInstant();for(const p of peers){expect(await p.settleNextInstant()).toBe(more);exact(run,p);}if(!more)return;}throw Error('M155 full queue cap');}
const remap=(v:CanonicalValue,ns:number)=>typedIdentifier(ns,id(v).payload);
export function compareOriginal155(run:Run155,out:readonly CanonicalValue[]){
 const trace=outputs(run.snapshot().trace,160n).find(t=>{const projection=f(t,13n);return typeof projection!=='boolean'&&projection.kind==='list'&&projection.items.some(v=>key(v)===key(list(out)));});expect(trace).toBeDefined();
 const reads=items(f(trace!,11n),'list').map(v=>rec(v,147n)),values=reads.filter(v=>f(v,3n)===true).map(v=>f(v,4n));
 const episodes=values.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-appearance-episode/0.1'))).map(appearanceEpisode);
 const selected=items(out[3],'list')[0],chosen=episodes.find(e=>selected&&key(e[2])===key(selected));
 const query=chosen?uint(id(chosen[1]).payload):0n;
 const mem=r(1044,[list(episodes.map(e=>r(1043,[remap(e[2],1166),e[5],u(uint(id(e[1]).payload)),e[4],e[8]])))]);
 const sums=values.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-appearance-summary/0.1'))).map(summaryValue);
 const summary=r(1047,[list(sums.map(s=>r(1046,[s[1],s[2],s[3],list(items(s[4],'list').map(v=>remap(v,1166)))])))]);
 const original=recollect(mem,summary,1,(out[1] as {value:bigint}).value,query,typedIdentifier(1166,u(999)));
 expect(f(original,4n)).toEqual(out[2]);expect(f(original,5n)).toEqual(out[4]);expect(f(original,6n)).toEqual(out[5]);
 expect(list(items(f(original,7n),'list').map(v=>remap(v,1115)))).toEqual(out[3]);expect(list(items(f(original,8n),'list').map(v=>remap(v,1115)))).toEqual(out[6]);
 return {mem,summary,query,original,chosen};
}
it('primary155: real detail loss produces wrong tagged reconstruction then new evidence repairs it without double credit',async()=>{
 const x=await start155();await through155(x.run,1n);const first=memories155(x.run)[0];expect(first).toBeDefined();const source=appearanceEpisode(first.value)[2],original=outputs(x.run.snapshot().outputs,227n).find(v=>items(f(v,8n),'set').some(s=>key(f(rec(s,216n),2n))===key(source)))!;expect(original).toBeDefined();
 const sourceRow=items(decode(x.b.d.orderedInputs),'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(signed(1))&&key(a[2])===key(SOCIAL_SOURCE))!;
 const sourceTrace=outputs(x.run.snapshot().trace,160n).find(t=>key(f(t,12n))===key(sourceRow[3]));expect(sourceTrace,'actual display event in source trace').toBeDefined();
 const display=items(items(items(f(sourceTrace!,12n),'list')[4],'list')[0],'list').map(v=>items(v,'list')).find(a=>key(a[0])===key(text(CF.ObservedBluntForm)))!;expect(display.slice(1)).toEqual([true,true]);
 expect(uint(recall155(x.run,1)[2])).toBe(0n);
 await through155(x.run,4n);const a=recall155(x.run,4);expect(a[5]).toEqual(list([true]));expect(uint(a[2])).toBe(1n);expect(appearanceEpisode(state155(x.run).read(first.path).value!)[8]).toEqual(list([]));
 const summary4=summaries155(x.run).map(e=>e.value);expect(summaryValue(summary4[0]).slice(2,4)).toEqual([u(2),u(1)]);
 await through155(x.run,5n);const b=recall155(x.run,5);expect(uint(b[2])).toBe(3n);expect(b[5]).toEqual(list([false]));expect(items(b[5],'list')[0]).not.toEqual(display[1]);expect(b[3]).toEqual(list([source]));expect(summaries155(x.run).map(e=>e.value)).toEqual(summary4);
 const controls=compareOriginal155(x.run,b),fragment=recollect(controls.mem,controls.summary,2,5n,controls.query,typedIdentifier(1166,u(1000)));expect(uint(f(fragment,4n))).toBe(2n);
 await through155(x.run,8n);const c=recall155(x.run,8);expect(uint(c[2])).toBe(3n);expect(c[5]).toEqual(list([true]));expect(c[3]).toEqual(list([source]));expect(items(c[6],'list')).toHaveLength(5);
 expect(appearanceEpisode(state155(x.run).read(first.path).value!)[8]).toEqual(list([]));expect(outputs(x.run.snapshot().outputs,227n)).toContainEqual(original);
 for(const out of recalls155(x.run))compareOriginal155(x.run,out);
 await finish155(x.run);console.info('M155 PRIMARY PASS actual C1/attention->summary; retainedtrue->fragment->reconstructedfalse->reconstructedtrue; exactly5 observation credits/no recall credits; original ModalFill correspondence');
},540000);
it('continuation155: repeat and saves before and after fragmentation match every later settled byte',async()=>{
 const x=await start155(),repeat=await createCharacterRun(x.m,x.b.d);await through155(x.run,1n);await through155(repeat,1n);exact(x.run,repeat);const saved1=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.run.save()});
 while(x.run.snapshot().clock<4n){expect(await x.run.settleNextInstant()).toBe(true);for(const p of[repeat,saved1]){expect(await p.settleNextInstant()).toBe(true);exact(x.run,p);}}
 const saved4=await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:x.run.save()});exact(x.run,saved4);await finish155(x.run,[repeat,saved1,saved4]);expect(uint(recall155(x.run,5)[2])).toBe(3n);
 console.info('M155 CONTINUATION PASS repeat/save1/save4 every later state/output/trace/save/identity through natural queue exhaustion');
},540000);
it('contrasts155: missing tie other category eviction and denied history remain distinct',async()=>{
 for(const [mode,status,detail] of [['missing',2,[]],['tie',2,[]],['otherCategory',3,[true]],['evicted',2,[]],['denied',3,[false]]] as const){
  const x=await start155(mode);await finish155(x.run);const out=recall155(x.run,5);if(mode==='evicted'){expect(uint(recall155(x.run,4)[2]),'summary alone cannot invent an evicted episode').toBe(0n);expect(summaries155(x.run).length).toBeGreaterThan(0);}else{expect(uint(out[2]),mode).toBe(BigInt(status));expect(out[5],mode).toEqual(list(detail));}
  if(mode==='denied')expect(uint(recall155(x.run,4)[2])).toBe(0n);
  for(const a of recalls155(x.run))compareOriginal155(x.run,a);
 }
 console.info('M155 CONTRASTS PASS absent/false/tie/category isolation/eviction/denied source; actual-input ModalFill correspondence');
},540000);
it('privacy155: hidden truth and target identity cannot change any safe state or output',async()=>{
 const a=await start155(),b=await start155('hidden');for(let i=0;i<96;i++){const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);bytes(a.run.snapshot().state,b.run.snapshot().state);bytes(a.run.snapshot().outputs,b.run.snapshot().outputs);if(!more){console.info('M155 PRIVACY PASS full safe state/output equality throughout both complete queues');return;}}throw Error('privacy queue cap');
},540000);
