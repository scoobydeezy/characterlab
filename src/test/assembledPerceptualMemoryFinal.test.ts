/** M174 cafbfba1. Current0.126; original perceptual scenarios, no new behavior. */
import {it,expect,vi} from 'vitest';
import {currentMemory,startMemory,cachedMemory,type MemoryRun} from './fixtures/assembledMemoryFinal';
import {fixture,items,decode,key,enc,list,text,signed,u,exact,bytes,outputs,rec,f,uint,C,target,type CanonicalValue,type Mode} from './fixtures/assembledFamiliarity';
import {fixture155,type Mode155} from './fixtures/assembledRecollection';
import {state,episodes,reports,report,through,finish} from './assembledFamiliarity.test';
import {recall155,recalls155,compareOriginal155,summaries155} from './assembledRecollection.test';
import {fixture156,report156,tagged156,original156,type Mode156} from './assembledVivid.test';
import {appearanceEpisode,FAMILIARITY,VIVID,fragmentAppearance} from '../assembled/familiarity';
import {summaryValue,RECOLLECTION} from '../assembled/recollection';
import {BODY_OBSERVER} from '../assembled/bodyIdentifiers';
import {recognize} from '../campaign3/familiarityMath';
import {familiarityRecord as fr} from '../campaign3/familiarityCodecs';
import {recollect} from '../campaign3/recollectionMath';
import {recollectionRecord as rr} from '../campaign3/recollectionCodecs';
import {sensoryPresentation} from '../campaign3/vividRecollection';
import {retainByRecency} from '../campaign3/recencyRetention';
import {typedIdentifier} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState} from '../substrate/state';
import * as memory from '../assembled/memory';
const fam=(mode:Mode='same',capacity=32)=>startMemory(currentMemory(fixture(mode,capacity)));
const reconstruction=(mode:Mode155='baseline')=>startMemory(currentMemory(fixture155(mode)));
const sensory=(mode:Mode156='clear')=>startMemory(currentMemory(fixture156(mode)));
const remap=(v:CanonicalValue,ns:number)=>typedIdentifier(ns,id(v).payload);
const contains=(trace:CanonicalValue,out:readonly CanonicalValue[])=>{const v=f(rec(trace,160n),13n);return typeof v!=='boolean'&&v.kind==='list'&&v.items.some(x=>key(x)===key(list(out)));};
function originalFamiliarity(run:MemoryRun,out:readonly CanonicalValue[]){
 const trace=outputs(run.snapshot().trace,160n).find(t=>contains(t,out));expect(trace,'actual familiarity producer').toBeDefined();
 const values=items(f(trace!,11n),'list').map(v=>rec(v,147n)).filter(v=>f(v,3n)===true).map(v=>f(v,4n));
 const reads=values.filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text('assembled-appearance-episode/0.1')));
 const p=items(out[2],'list'),obs=fr(1057,[remap(p[0],1167),BODY_OBSERVER,p[2],p[3],p[4],p[5],p[6]]);
 const mem=fr(1059,[list(reads.map(v=>{const a=appearanceEpisode(v);expect((a[5] as {value:bigint}).value).toBeLessThan((p[2] as {value:bigint}).value);return fr(1058,[remap(a[2],1167),a[5],a[4],a[6],a[7],a[8]]);}))]);
 const results=[1,2,3,4].map(law=>recognize(obs,mem,law,(p[2] as {value:bigint}).value,typedIdentifier(1167,u(1))));
 expect([4n,5n].map(n=>f(results[0],n))).toEqual(out.slice(3,5));
 expect(list(items(f(results[0],6n),'list').map(v=>remap(v,1115)))).toEqual(out[5]);
 expect(list(items(f(results[0],7n),'list').map(v=>list([1n,2n,3n,4n,5n,6n].map(n=>n===1n?remap(f(rec(v,1061n),n),1115):f(rec(v,1061n),n)))))).toEqual(out[6]);
 return results.map(v=>uint(f(v,4n)));
}
function onceOnly(run:MemoryRun){
 const known=reports(run).map(a=>items(a[2],'list')).filter(p=>items(p[6],'list').length===1&&uint(p[3])>0n);
 for(const row of summaries155(run)){
  const s=summaryValue(row.value),sources=known.filter(p=>key(p[3])===key(s[1]));
  expect(uint(s[2])).toBe(BigInt(sources.filter(p=>items(p[6],'list')[0]===false).length));
  expect(uint(s[3])).toBe(BigInt(sources.filter(p=>items(p[6],'list')[0]===true).length));
  expect(items(s[4],'list')).toEqual(sources.map(p=>p[0]));
  expect(new Set(items(s[4],'list').map(key)).size).toBe(sources.length);
 }
 expect(summaries155(run).length).toBe(new Set(known.map(p=>key(p[3]))).size);
}
async function full(run:MemoryRun){await finish(run);expect(run.diagnostic()).toBeUndefined();expect(run.snapshot().clock).toBe(101n);}
it('final174 familiarity: real loss leaves a familiar percept without importing truth or identity',async()=>{
 const x=await fam();await through(x.run,1n);const first=episodes(x.run)[0],a=appearanceEpisode(first.value);expect(a[8]).toEqual(list([true]));expect(uint(report(x.run,1)[3])).toBe(1n);
 const original=outputs(x.run.snapshot().outputs,227n).find(v=>items(f(v,8n),'set').some(v=>key(f(rec(v,216n),2n))===key(a[2])))!;expect(original).toBeDefined();
 await through(x.run,4n);const lost=appearanceEpisode(state(x.run).read(first.path).value!);expect(lost[8]).toEqual(list([]));expect(lost.slice(0,8)).toEqual(a.slice(0,8));
 await through(x.run,5n);const out=report(x.run,5);expect(uint(out[3])).toBe(4n);expect(items(out[5],'list')).toContainEqual(a[2]);expect(items(out[6],'list').map(v=>items(v,'list')[5])).toEqual([list([]),list([])]);
 expect(outputs(x.run.snapshot().outputs,227n)).toContainEqual(original);
 expect(state(x.run).entries().filter(e=>memory.isSocialEpisodePath(e.path))).toHaveLength(0);
 for(const out of reports(x.run))originalFamiliarity(x.run,out);await full(x.run);onceOnly(x.run);
 console.info('M174 familiarity PASS real true detail1 -> loss4 -> Familiar5, original PartialMax on traced prior imprints, immutable experience, no duplicate claim episode; full101.');
},540000);
it('final174 familiarity contrasts: missing false partial person place and separate capacity',async()=>{
 for(const [mode,status] of [['partial',5n],['novel',3n],['missing',2n],['place',4n],['crossCategory',1n],['denied',4n]] as const){
  const x=await fam(mode);await full(x.run);const out=report(x.run,5);expect(uint(out[3]),mode).toBe(status);
  for(const o of reports(x.run))originalFamiliarity(x.run,o);
  const alternatives=originalFamiliarity(x.run,out);
  if(mode==='partial'){expect(alternatives[1]).toBe(3n);expect(alternatives[2]).toBe(2n);}
  if(mode==='missing')expect(alternatives[3]).toBe(3n);
  if(mode==='denied')expect(uint(report(x.run,4)[3])).toBe(1n);
  onceOnly(x.run);console.info('M174 familiarity contrast PASS '+mode+' status'+status);
 }
 const x=await fam('same',2);await through(x.run,1n);const first=episodes(x.run)[0];
 await through(x.run,4n);expect(state(x.run).read(first.path).presence).toBe(true);expect(appearanceEpisode(state(x.run).read(first.path).value!)[8]).toEqual(list([]));expect(episodes(x.run)).toHaveLength(2);const before=episodes(x.run);
 await through(x.run,5n);expect(state(x.run).read(first.path).presence).toBe(false);expect(episodes(x.run).map(e=>(appearanceEpisode(e.value)[5] as {value:bigint}).value).sort()).toEqual([4n,5n]);
 const actual=[...before,...episodes(x.run).filter(e=>(appearanceEpisode(e.value)[5] as {value:bigint}).value===5n)],candidate=(e:typeof first)=>{const a=appearanceEpisode(e.value);return {id:uint(id(a[1]).payload),kind:'EventContinuant' as const,acquiredAt:(a[5] as {value:bigint}).value,units:[{key:'episode',views:[enc(e.value)]}]};};
 const expected=retainByRecency(actual.map(candidate),5n,{EventContinuant:2,Interoceptive:2}).acquisitions.map(v=>v.id).sort();expect(episodes(x.run).map(e=>candidate(e).id).sort()).toEqual(expected);await full(x.run);
 console.info('M174 capacity interaction PASS: separate event cap2 retains fragmented1 at4, evicts1 at5; latest4/5 retained, body separate; original pooled loss4 not imposed.');
},590000);
it('final174 reconstruction: original known truth becomes tagged wrong guess then evidence repairs summary',async()=>{
 const x=await reconstruction();await through(x.run,1n);const first=episodes(x.run)[0],a=appearanceEpisode(first.value);expect(a[8]).toEqual(list([true]));expect(uint(recall155(x.run,1)[2])).toBe(0n);
 const experience=outputs(x.run.snapshot().outputs,227n).find(v=>items(f(v,8n),'set').some(v=>key(f(rec(v,216n),2n))===key(a[2])))!;expect(experience).toBeDefined();
 await through(x.run,4n);const retained=recall155(x.run,4);expect(uint(retained[2])).toBe(1n);expect(retained[5]).toEqual(list([true]));expect(appearanceEpisode(state(x.run).read(first.path).value!)[8]).toEqual(list([]));
 const sums=summaries155(x.run).map(e=>e.value);expect(summaryValue(sums[0]).slice(2,4)).toEqual([u(2),u(1)]);
 await through(x.run,5n);const wrong=recall155(x.run,5);expect(uint(wrong[2])).toBe(3n);expect(wrong[5]).toEqual(list([false]));expect(wrong[3]).toEqual(list([a[2]]));expect(summaries155(x.run).map(e=>e.value)).toEqual(sums);
 const actual=compareOriginal155(x.run,wrong),fragment=recollect(actual.mem,actual.summary,2,5n,actual.query,typedIdentifier(1166,u(1000)));expect(uint(f(fragment,4n))).toBe(2n);
 await through(x.run,8n);const repaired=recall155(x.run,8);expect(uint(repaired[2])).toBe(3n);expect(repaired[5]).toEqual(list([true]));expect(repaired[3]).toEqual(list([a[2]]));expect(items(repaired[6],'list')).toHaveLength(5);
 expect(appearanceEpisode(state(x.run).read(first.path).value!)[8]).toEqual(list([]));expect(outputs(x.run.snapshot().outputs,227n)).toContainEqual(experience);
 for(const o of recalls155(x.run))compareOriginal155(x.run,o);onceOnly(x.run);await full(x.run);onceOnly(x.run);
 console.info('M174 reconstruction PASS retainedtrue -> lostdetail -> taggedfalse -> taggedtrue; immutable experience, original ModalFill/KeepFragmentary, exactly5 known source credits and no guess reencoding/full101.');
},540000);
it('final174 reconstruction controls: unknown tie category isolation eviction and denied history',async()=>{
 for(const [mode,status,detail] of [['missing',2,[]],['tie',2,[]],['otherCategory',3,[true]],['evicted',2,[]],['denied',3,[false]]] as const){
  const x=await reconstruction(mode);await full(x.run);const out=recall155(x.run,5);
  if(mode==='evicted'){expect(uint(recall155(x.run,4)[2])).toBe(0n);expect(summaries155(x.run).length).toBeGreaterThan(0);}
  else{expect(uint(out[2]),mode).toBe(BigInt(status));expect(out[5],mode).toEqual(list(detail));}
  if(mode==='denied')expect(uint(recall155(x.run,4)[2])).toBe(0n);
  for(const o of recalls155(x.run))compareOriginal155(x.run,o);onceOnly(x.run);
  console.info('M174 reconstruction control PASS '+mode+'; actual original-kernel correspondence and once-only known-source credit/full101.');
 }
},590000);
it('final174 sensory: same selected values different permitted clarity and actual three-to-one loss',async()=>{
 const a=await sensory(),b=await sensory('weak');await through(a.run,1n);await through(b.run,1n);const first=episodes(a.run)[0],original=appearanceEpisode(first.value);expect(original).toHaveLength(10);
 await through(a.run,2n);await through(b.run,2n);const clear=report156(a.run,2),weak=report156(b.run,2);expect(clear[4]).toEqual(text('Vivid'));expect(weak[4]).toEqual(text('Weak'));expect(clear[2]).toEqual(weak[2]);
 const values=(o:readonly CanonicalValue[])=>items(o[3],'list').map(v=>items(v,'list').slice(0,2));expect(values(clear)).toEqual(values(weak));expect(values(clear)).toHaveLength(3);expect(original156(weak).detail).toBe('Vivid');
 await through(a.run,4n);expect(report156(a.run,4)[4]).toEqual(text('Vivid'));const lost=appearanceEpisode(state(a.run).read(first.path).value!);expect(items(lost[9],'list')).toEqual([list([u(2)]),list([]),list([])]);expect(lost[8]).toEqual(list([]));expect(lost.slice(0,8)).toEqual(original.slice(0,8));
 await through(a.run,5n);const fragment=report156(a.run,5);expect(fragment[4]).toEqual(text('Fragmentary'));expect(items(fragment[3],'list')).toHaveLength(1);expect(original156(fragment).access).toBe('Vivid');
 const keepRich=items(clear[3],'list').map(v=>{const f=items(v,'list');return {kind:'visual' as const,value:f[1]===true,clarity:Number(uint(f[2]))};});expect(sensoryPresentation(keepRich,true,'KeepRich')).toBe('Vivid');expect(tagged156(a.run,VIVID).map(list)).toContainEqual(list(clear));
 await full(a.run);await full(b.run);expect(tagged156(a.run,FAMILIARITY)).toEqual(tagged156(b.run,FAMILIARITY));expect(tagged156(a.run,RECOLLECTION)).toEqual(tagged156(b.run,RECOLLECTION));
 for(const run of[a.run,b.run])for(const out of tagged156(run,VIVID))original156(out);
 console.info('M174 sensory PASS permitted clarity changes Vivid/Weak at same actual source/values; true3->1 retained fidelity loss; Fragmentary versus AccessOnly/KeepRich; semantic outputs unchanged/full101.');
},540000);
it('final174 sensory controls: missing partial and denied evidence remain distinct',async()=>{
 for(const [mode,band] of [['partial','Fragmentary'],['unspecified','Empty'],['deniedQuality','Empty'],['deniedEpisode','Unavailable']] as const){
  const x=await sensory(mode);await full(x.run);expect(report156(x.run,2)[4],mode).toEqual(text(band));for(const out of tagged156(x.run,VIVID))original156(out);
  console.info('M174 sensory control PASS '+mode+' '+band+'/full101.');
 }
},540000);
it('final174 privacy: hidden truth identity and denied quality preserve all safe bytes',async()=>{
 const pairs=[()=>Promise.all([fam(),fam('hidden')]),()=>Promise.all([reconstruction(),reconstruction('hidden')]),()=>Promise.all([sensory(),sensory('hidden')]),()=>Promise.all([sensory('deniedQuality'),sensory('hiddenDenied')])];
 for(const [i,pair]of pairs.entries()){
  // Model preparation is independent; transitions remain serial.
  const [a,b]=await pair();for(let n=0;n<96;n++){const next=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(next);bytes(a.run.snapshot().state,b.run.snapshot().state);bytes(a.run.snapshot().outputs,b.run.snapshot().outputs);if(!next)break;if(n===95)throw Error('M174 privacy full queue cap');}
  expect(a.run.snapshot().clock).toBe(101n);expect(b.run.snapshot().clock).toBe(101n);expect(a.run.diagnostic()).toBeUndefined();expect(b.run.diagnostic()).toBeUndefined();console.info('M174 privacy pair'+i+' PASS every safe state/output byte, full101.');
 }
},590000);
it('final174 continuation: independent repeat and saves on both sides of actual fragmentation',async()=>{
 const x=await sensory(),repeat=cachedMemory(await createCharacterRun(x.m,x.b.d));await through(x.run,1n);await through(repeat,1n);exact(x.run,repeat);
 const restore=async(save:Uint8Array)=>cachedMemory(await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save}));
 const before=await restore(x.run.save());exact(x.run,before);
 while(x.run.snapshot().clock<4n){expect(await x.run.settleNextInstant()).toBe(true);for(const p of[repeat,before]){expect(await p.settleNextInstant()).toBe(true);exact(x.run,p);}}
 const after=await restore(x.run.save());exact(x.run,after);await finish(x.run,[repeat,before,after]);expect(x.run.snapshot().clock).toBe(101n);expect(report156(x.run,5)[4]).toEqual(text('Fragmentary'));
 console.info('M174 continuation PASS independent repeat, public original-input save1/save4, every later complete state/output/trace/save/run byte/full101.');
},590000);
it('final174 rollback: actual post-loss fault and sole-owner immutable-content guards',async()=>{
 const x=await sensory();await through(x.run,1n);const first=episodes(x.run)[0],beforeValue=first.value,c=await compileCharacterState(await compileCharacterModel(x.b.s));
 const patch={operations:[{kind:'set' as const,path:first.path,expected:{presence:true as const,value:beforeValue},newValue:fragmentAppearance(beforeValue)}]};
 expect(()=>c.stateModel.applyPatch(state(x.run),patch,typedIdentifier(1025,text('authority/wrong')))).toThrow();
 const initial=c.initialState(x.b.d.initialState);await expect(createCharacterRun(x.m,{...x.b.d,initialState:enc(new AuthoritativeState([...initial.entries(),first]).canonicalValue())})).rejects.toThrow('initial');
 const make=memory.createEpisodicExtension;let reached=false,saved:Uint8Array|undefined;
 const spy=vi.spyOn(memory,'createEpisodicExtension').mockImplementation((...args)=>{const component=make(...args);return Object.freeze({...component,prepare(...xs){const stage=component.prepare(...xs);return {...stage,finish(s){const next=stage.finish(s);if(xs[0].some(e=>e.dueAt===4n)){const v=next.read(first.path);expect(v.presence).toBe(true);expect(items(appearanceEpisode(v.value!)[9],'list')).toEqual([list([u(2)]),list([]),list([])]);reached=true;throw Error('M174 actual fidelity rollback');}return next;}};}});});
 try{const fault=cachedMemory(await createCharacterRun(x.m,x.b.d));for(let n=0;n<96;n++){const before=fault.snapshot();saved=fault.save();try{await fault.settleNextInstant();}catch(error){expect(String(error)).toContain('M174 actual fidelity rollback');expect({...fault.snapshot(),status:before.status}).toEqual(before);break;}}expect(reached).toBe(true);}finally{spy.mockRestore();}
 const recovered=cachedMemory(await restoreCharacterRun(x.b.s,{initialState:x.b.d.initialState,orderedInputs:x.b.d.orderedInputs,save:saved!}));await full(x.run);await full(recovered);exact(x.run,recovered);
 const fragment=state(x.run).read(first.path);expect(()=>c.stateModel.applyPatch(state(x.run),{operations:[{kind:'set',path:first.path,expected:{presence:true,value:fragment.value!},newValue:beforeValue}]},memory.EPISODIC_OWNER)).toThrow('only peripheral');
 console.info('M174 rollback PASS actual fidelity removal reached then whole instant reverted; public recovery exact/full101; foreign owner, learned S0 and reintroduced content rejected.');
},590000);
