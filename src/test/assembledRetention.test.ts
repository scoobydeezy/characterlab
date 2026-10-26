import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,MEMORY_RULES,MEMORY_REGISTRY,RETENTION_RULES,RETENTION_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {RETENTION,retainedEpisodeIds,type UncreditedEpisode} from '../assembled/retention';
import {EPISODE,RECALL,ACCESS,EPISODIC_OWNER,MEMORY_RECALL,isBodyEpisodePath} from '../assembled/memory';
import {BODY_SAMPLE,BODY_SELECTION_REPORT,bodyId} from '../assembled/body';
import {retainSignificanceFirst} from '../campaign3/significanceFirstRetention';
import {canonicalEncode as enc,list,text,signed,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {interactionSource,interactionData,outputs,withoutChoice} from './fixtures/assembledInteraction';
import {workLimit} from './fixtures/assembledCharacter';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const source=(diagnostic=8,body=8,delay=2,old=false,selected=1,permitted=true)=>{
 const s=interactionSource(permitted),slots=[...items(decode(s.registry),'list'),list([text(BODY_SELECTION_REPORT),unsigned(selected)])];
 if(!old)slots.push(list([text(RETENTION),unsigned(diagnostic),unsigned(body),unsigned(delay)]));
 return {...s,rulesVersion:old?MEMORY_RULES:RETENTION_RULES,registrySchemaVersion:old?MEMORY_REGISTRY:RETENTION_REGISTRY,registry:enc(list(slots))};
};
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const entries=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state)).entries();
const bodyEntries=(run:Run)=>entries(run).filter(e=>isBodyEpisodePath(e.path));
const trace=(run:Run)=>outputs(run.snapshot().trace,160n);
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const draws=(run:Run)=>trace(run).flatMap(t=>items(f(t,14n),'list'));
const name=(t:CanonicalValue)=>txt(id(f(rec(t,160n),7n)).payload);
async function through(run:Run,at:bigint){for(let n=0;run.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(at);}
async function finish(run:Run){for(let n=0;await run.settleNextInstant();n++)expect(n).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
const exact=(a:Run,b:Run)=>{expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(b.runIdentity()).toEqual(a.runIdentity());};
function twoSamples(amount=10){const d=interactionData(0,0,7,amount),rows=items(decode(d.orderedInputs),'list'),sample=items(rows.find(row=>key(items(row,'list')[2])===key(BODY_SAMPLE))!,'list');return {...d,orderedInputs:enc(list([...rows,list([signed(4),...sample.slice(1)])]))};}
const withoutAudits=(run:Run)=>enc(list(items(decode(run.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&[RETENTION,ACCESS].some(s=>key(v.items[0])===key(text(s)))))));
describe('M6 finite retention in one episodic owner',()=>{
 it('ports the unprotected reference tier without merging its partitions or changing canonical ties',()=>{
  const rows:UncreditedEpisode[]=[{acquisition:812n,acquiredAt:1n,kind:'diagnostic'},{acquisition:900n,acquiredAt:1n,kind:'diagnostic'},{acquisition:7n,acquiredAt:2n,kind:'body'},{acquisition:8n,acquiredAt:9n,kind:'body'}];
  const control=rows.map(r=>({id:r.acquisition,acquiredAt:r.acquiredAt,kind:r.kind==='body'?'Interoceptive' as const:'EventContinuant' as const,units:[{key:'episode',views:[new Uint8Array([42])],useProtection:false,outcomeSignificanceDirections:[]}]}));
  for(const diagnostic of [0,1,2])for(const body of [0,1,2]){const expected=retainSignificanceFirst(control,10n,{EventContinuant:diagnostic,Interoceptive:body}).acquisitions.map(a=>a.id);expect(retainedEpisodeIds(rows,10n,{diagnostic,body})).toEqual(expected);expect(retainedEpisodeIds([...rows].reverse(),10n,{diagnostic,body})).toEqual(expected);}
  expect(retainedEpisodeIds(rows,10n,{diagnostic:1,body:0})).toEqual([900n]);expect(()=>retainedEpisodeIds([rows[0],rows[0]],10n,{diagnostic:1,body:1})).toThrow('duplicate');
 });
 it('capacity8 delay1 preserves the four M3 cells against M5 exactly except the two declared audits',async()=>{
  const prior=await prepareCharacterModel(source(8,8,1,true)),model=await prepareCharacterModel(source(8,8,1));
  for(const h of [0,1] as const)for(const b of [0,1] as const){const d=interactionData(h,b,7),a=await createCharacterRun(prior,d),n=await createCharacterRun(model,d);await finish(a);await finish(n);expect(n.snapshot().state).toEqual(a.snapshot().state);expect(withoutAudits(n)).toEqual(a.snapshot().outputs);expect(draws(n)).toEqual(draws(a));}
  console.info('M6 four-cell M5 correspondence: full state/existing outputs/actual draws PASS');
 },180000);
 it('actual loss prevents delayed exact recall; a surviving episode retains its bytes and budgets never borrow',async()=>{
  for(const capacity of [1,2]){const run=await createCharacterRun(await prepareCharacterModel(source(8,capacity)),twoSamples());await through(run,4n);expect(bodyEntries(run)).toHaveLength(capacity);const acquisitions=reports(run,EPISODE);expect(acquisitions).toHaveLength(2);const survivor=list(acquisitions[1]);
   expect(bodyEntries(run).some(e=>key(e.value)===key(survivor))).toBe(true);await through(run,5n);const first=reports(run,ACCESS)[0];expect(first[3]).toBe(capacity===2);expect(reports(run,RECALL)).toHaveLength(capacity===2?1:0);
   await through(run,6n);expect(reports(run,ACCESS)[1][3]).toBe(true);expect(reports(run,RECALL).at(-1)![2]).toEqual(survivor);await finish(run);
   const read=items(f(trace(run).find(t=>name(t)==='event/assembled-memory-recall'&&key(f(event(t),2n))===key(signed(5)))!,11n),'list')[0];expect(f(rec(read,147n),3n)).toBe(capacity===2);
   expect(entries(run).filter(e=>e.path.rootStateTypeId===346n&&!isBodyEpisodePath(e.path))).toHaveLength(2);
  }
  const d=interactionData(0,0),sample=items(items(decode(d.orderedInputs),'list').find(row=>key(items(row,'list')[2])===key(BODY_SAMPLE))!,'list');d.orderedInputs=enc(list(Array.from({length:9},(_,i)=>list([signed(i+1),...sample.slice(1)]))));
  const reference=await createCharacterRun(await prepareCharacterModel(source()),d);await through(reference,9n);expect(bodyEntries(reference)).toHaveLength(8);expect(reports(reference,RETENTION).at(-1)![4]).not.toEqual(list([]));expect(bodyEntries(reference).some(e=>key(items(e.value,'list')[5])===key(signed(1)))).toBe(false);
  console.info('M6 delayed access: capacity1 misses first/retains second, capacity2 recalls both; reference8 evicts ninth-source oldest');
 },90000);
 it('diagnostic episode loss does not erase learned predictions or change the existing choice',async()=>{
  const d=interactionData(0,0,7),a=await createCharacterRun(await prepareCharacterModel(source()),d),b=await createCharacterRun(await prepareCharacterModel(source(0,8)),d);await finish(a);await finish(b);
  expect(entries(b).filter(e=>e.path.rootStateTypeId===346n&&!isBodyEpisodePath(e.path))).toHaveLength(0);const nonmemory=(run:Run)=>entries(run).filter(e=>e.path.rootStateTypeId!==346n);expect(nonmemory(b)).toEqual(nonmemory(a));expect(outputs(b.snapshot().outputs,409n)).toEqual(outputs(a.snapshot().outputs,409n));expect(draws(b)).toEqual(draws(a));expect(outputs(b.snapshot().outputs,352n)).toHaveLength(0);
  const recalls=trace(b).filter(t=>name(t)==='event/measurement-exact-recall');expect(recalls).toHaveLength(2);for(const t of recalls){const reads=items(f(t,11n),'list').map(v=>rec(v,147n));expect(reads.some(r=>key(f(rec(f(r,2n),140n),1n))===key(unsigned(346))&&f(r,3n)===false)).toBe(true);}
 },60000);
 it('repeat and restore after loss preserve pending cues and every full later boundary; hidden truth stays outside retention',async()=>{
  const s=source(8,1),m=await prepareCharacterModel(s),d=twoSamples(),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,4n);await through(b,4n);exact(a,b);expect(bodyEntries(a)).toHaveLength(1);
  const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
  for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await a.settleNextInstant();for(const peer of [b,restored]){expect(await peer.settleNextInstant()).toBe(more);exact(a,peer);}if(!more)break;}
  const hidden=await createCharacterRun(m,twoSamples(11));await finish(hidden);expect(bodyEntries(hidden)).toEqual(bodyEntries(a));expect(reports(hidden,RETENTION)).toEqual(reports(a,RETENTION));expect(reports(hidden,ACCESS)).toEqual(reports(a,ACCESS));expect(reports(hidden,RECALL)).toEqual(reports(a,RECALL));expect(hidden.snapshot().state).not.toEqual(a.snapshot().state);
 },180000);
 it('exclusion/denial cannot be replaced by retention and zero capacity creates an absent recall, not a zero measurement',async()=>{
  for(const [selected,permitted]of [[0,true],[1,false]] as const){const run=await createCharacterRun(await prepareCharacterModel(source(8,8,2,false,selected,permitted)),interactionData(0,0));await finish(run);expect(reports(run,EPISODE)).toHaveLength(0);expect(reports(run,ACCESS)).toHaveLength(0);}
  const run=await createCharacterRun(await prepareCharacterModel(source(8,0)),interactionData(1,1));await finish(run);expect(outputs(run.snapshot().outputs,461n)).toHaveLength(1);expect(reports(run,EPISODE)).toHaveLength(1);expect(reports(run,ACCESS)[0][3]).toBe(false);expect(reports(run,RECALL)).toHaveLength(0);expect(bodyEntries(run)).toHaveLength(0);
 },90000);
 it('keeps joint diagnostic/body formation and removal atomic on a late failing instant',async()=>{
  const d=withoutChoice(interactionData(0,0));d.orderedInputs=enc(list(items(decode(d.orderedInputs),'list').filter(row=>key(items(row,'list')[2])===key(BODY_SAMPLE)||key(items(row,'list')[0])===key(signed(4))).map(row=>list([signed(3),...items(row,'list').slice(1)]))));const s=source(0,0),run=await createCharacterRun(await prepareCharacterModel(s),d);await through(run,3n);
  expect(entries(run).filter(e=>e.path.rootStateTypeId===346n)).toHaveLength(0);expect(items(reports(run,RETENTION)[0][4],'list')).toHaveLength(2);expect(entries(run).some(e=>e.path.rootStateTypeId===362n)).toBe(true);
  const ids=new Set(trace(run).map(t=>key(f(event(t),1n)))),failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(ids.size-1))),d),before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(failed.diagnostic()).toBeDefined();
  console.info('M6 joint formation/removal '+ids.size+' events; cap '+(ids.size-1)+' full rollback');
 },60000);
 it('rejects malformed limits, wrong-owner/stale removal, authored cues and learned initial state',async()=>{
  for(const [diagnostic,body,delay]of [[1025,1,2],[1,1025,2],[1,1,0],[1,1,101]])await expect(prepareCharacterModel(source(diagnostic,body,delay))).rejects.toThrow('retention requires');
  const s=source(),d=interactionData(0,0),model=await prepareCharacterModel(s),run=await createCharacterRun(model,d);await through(run,3n);const e=bodyEntries(run)[0],compiled=await compileCharacterModel(s),component=await compileCharacterState(compiled),state=restoreAuthoritativeState(decode(run.snapshot().state)),patch={operations:[{kind:'remove' as const,path:e.path,expectedOldValue:e.value}]};
  expect(()=>component.stateModel.applyPatch(state,patch,bodyId(1025,'authority/belief-expectation'))).toThrow();expect(()=>component.stateModel.applyPatch(state,{operations:[{...patch.operations[0],expectedOldValue:list([])}]},EPISODIC_OWNER)).toThrow();
  const wrong={...e.path,fieldId:2n};expect(()=>component.stateModel.applyPatch(state,{operations:[{...patch.operations[0],path:wrong}]},EPISODIC_OWNER)).toThrow();
  await expect(createCharacterRun(model,{...d,orderedInputs:enc(list([list([signed(5),unsigned(20),MEMORY_RECALL,(e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key,list([])])]))})).rejects.toThrow();
  const initial=component.initialState(d.initialState);await expect(createCharacterRun(model,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),e]).canonicalValue())})).rejects.toThrow('initial learned');
  const oldComponent=await compileCharacterState(await compileCharacterModel(source(8,8,1,true)));expect(()=>oldComponent.stateModel.applyPatch(state,patch,EPISODIC_OWNER)).toThrow();
  await expect(prepareCharacterModel({...s,registrySchemaVersion:MEMORY_REGISTRY})).rejects.toThrow('version bundle');
 },60000);
});
