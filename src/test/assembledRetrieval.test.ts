import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {RETENTION_RULES,RETENTION_REGISTRY,RETRIEVAL_RULES,RETRIEVAL_REGISTRY} from '../assembled/model';
import {RETENTION} from '../assembled/retention';
import {RETRIEVAL,rankBodyEpisodes} from '../assembled/retrieval';
import {RECALL,ACCESS,EPISODE,MEMORY_RECALL,isBodyEpisodePath} from '../assembled/memory';
import {BODY_SAMPLE,BODY_CHANNEL,BODY_SELECTION_REPORT} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {recallBodyByAcquisitionRecency} from '../campaign3/bodyRecall';
import {canonicalEncode as enc,list,text,signed,unsigned,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState} from '../substrate/state';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {interactionSource,interactionData,outputs,withoutChoice} from './fixtures/assembledInteraction';
import {workLimit} from './fixtures/assembledCharacter';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
function source(slots=1,body=8,old=false,selected=1,permitted=true){const s=interactionSource(permitted),registry=[...items(decode(s.registry),'list'),list([text(BODY_SELECTION_REPORT),unsigned(selected)]),list([text(RETENTION),unsigned(8),unsigned(body),unsigned(2)])];if(!old)registry.push(list([text(RETRIEVAL),unsigned(slots)]));return {...s,rulesVersion:old?RETENTION_RULES:RETRIEVAL_RULES,registrySchemaVersion:old?RETENTION_REGISTRY:RETRIEVAL_REGISTRY,registry:enc(list(registry))};}
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const entries=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state)).entries();
const bodyEntries=(run:Run)=>entries(run).filter(e=>isBodyEpisodePath(e.path));
const traces=(run:Run)=>outputs(run.snapshot().trace,160n);
const event=(t:CanonicalValue)=>rec(f(rec(t,160n),4n),130n);
const draws=(run:Run)=>traces(run).flatMap(t=>items(f(t,14n),'list'));
const name=(t:CanonicalValue)=>txt(id(f(rec(t,160n),7n)).payload);
async function through(run:Run,at:bigint){for(let n=0;run.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(at);}
async function finish(run:Run){for(let n=0;await run.settleNextInstant();n++)expect(n).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
const exact=(a:Run,b:Run)=>{expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(b.runIdentity()).toEqual(a.runIdentity());};
function twoSamples(amount=10){const d=interactionData(0,0,7,amount),rows=items(decode(d.orderedInputs),'list'),sample=items(rows.find(row=>key(items(row,'list')[2])===key(BODY_SAMPLE))!,'list');return {...d,orderedInputs:enc(list([...rows,list([signed(4),...sample.slice(1)])]))};}
const nonRecall=(run:Run)=>enc(list(items(decode(run.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&[RECALL,ACCESS,RETRIEVAL].some(s=>key(v.items[0])===key(text(s)))))));
const mask=(v:CanonicalValue,fields:bigint[])=>{const r=rec(v,160n);return record(r.schema,new Map([...r.fields].map(([n,x])=>[n,fields.includes(n)?false:x])));};
describe('M7 body cue access over the same episodic owner',()=>{
 it('matches accepted recency rank, canonical ties, permutations and no-match; does not truncate65 candidates',()=>{
  const rows=[{acquisition:812n,acquiredAt:1n,channel:BODY_CHANNEL},{acquisition:900n,acquiredAt:1n,channel:BODY_CHANNEL},{acquisition:4n,acquiredAt:2n,channel:BODY_CHANNEL},{acquisition:5n,acquiredAt:3n,channel:text('other')}];
  for(const slots of [0,1,2,3,32]){const original=rows.map(r=>({id:r.acquisition,acquiredAt:r.acquiredAt,kind:'Interoceptive' as const,units:[{key:key(r.channel),views:[enc(unsigned(0))]}]}));
   // Kernel symbols are bounded stand-ins; use short exact channel correspondence.
   for(const a of original)a.units[0].key=a.id===5n?'other':'body';
   const control=recallBodyByAcquisitionRecency(original,{kind:'Present',signals:['body']},4n,slots),actual=rankBodyEpisodes(rows,BODY_CHANNEL,4n,slots);expect(actual).toEqual({eligible:[...control.eligible],selected:control.recalled.map(a=>a.id)});expect(rankBodyEpisodes([...rows].reverse(),BODY_CHANNEL,4n,slots)).toEqual(actual);
  }
  expect(rankBodyEpisodes(rows,BODY_CHANNEL,4n,3).selected).toEqual([4n,900n,812n]);expect(rankBodyEpisodes(rows,text('absent'),4n,1).selected).toEqual([]);
  const many=Array.from({length:65},(_,i)=>({acquisition:BigInt(i),acquiredAt:BigInt(i),channel:BODY_CHANNEL})),r=rankBodyEpisodes(many,BODY_CHANNEL,66n,32);expect(r.eligible).toHaveLength(65);expect(r.selected).toEqual(Array.from({length:32},(_,i)=>64n-BigInt(i)));expect(()=>rankBodyEpisodes([rows[0],rows[0]],BODY_CHANNEL,4n,1)).toThrow();expect(()=>rankBodyEpisodes(rows,BODY_CHANNEL,3n,1)).toThrow('non-prior');
 });
 it('preserves four singleton M3 cells: all state, non-recall outputs, actual draws and non-memory traces',async()=>{
  const prior=await prepareCharacterModel(source(1,8,true)),next=await prepareCharacterModel(source());
  for(const h of [0,1] as const)for(const b of [0,1] as const){const d=interactionData(h,b,7),a=await createCharacterRun(prior,d),n=await createCharacterRun(next,d);await finish(a);await finish(n);expect(n.snapshot().state).toEqual(a.snapshot().state);expect(nonRecall(n)).toEqual(nonRecall(a));expect(reports(n,RECALL)).toEqual(reports(a,RECALL));expect(draws(n)).toEqual(draws(a));
   const memory=(t:CanonicalValue)=>txt(id(f(rec(t,160n),5n)).payload)==='seam/assembled-episodic-memory';
   expect(traces(n).filter(t=>!memory(t)).map(t=>mask(t,[2n,3n]))).toEqual(traces(a).filter(t=>!memory(t)).map(t=>mask(t,[2n,3n])));
   const stable=(t:CanonicalValue)=>mask(t,[2n,3n,6n,...(name(t)==='event/assembled-memory-recall'?[4n,10n,11n,12n,13n]:name(t)==='event/assembled-memory-evidence'?[18n]:[])]);
   expect(traces(n).filter(memory).map(stable)).toEqual(traces(a).filter(memory).map(stable));
  }console.info('M7 four-cell correspondence: state/non-recall outputs/draws/non-memory trace exact; singleton recall bytes exact');
 },180000);
 it('channel cue retrieves newer competing memory, while slots0/1/2 change access without changing retention',async()=>{
  const runs:Run[]=[];
  for(const slots of [0,1,2]){const run=await createCharacterRun(await prepareCharacterModel(source(slots)),twoSamples());await through(run,4n);expect(bodyEntries(run)).toHaveLength(2);const before=bodyEntries(run),episodes=reports(run,EPISODE).map(list);await through(run,5n);expect(bodyEntries(run)).toEqual(before);
   const audit=reports(run,RETRIEVAL)[0];expect(items(audit[4],'list')).toHaveLength(2);expect(items(audit[5],'list')).toHaveLength(slots);expect(reports(run,RECALL).map(r=>r[2])).toEqual(slots===0?[]:slots===1?[episodes[1]]:[episodes[1],episodes[0]]);
   const t=traces(run).find(t=>name(t)==='event/assembled-memory-recall')!;expect(f(event(t),6n)).toEqual(BODY_CHANNEL);const reads=items(f(t,11n),'list');expect(reads).toHaveLength(2);expect(reads.map(r=>f(rec(r,147n),4n))).toEqual(before.map(e=>e.value));await finish(run);runs.push(run);
  }
  expect(runs[0].snapshot().state).toEqual(runs[1].snapshot().state);expect(runs[2].snapshot().state).toEqual(runs[1].snapshot().state);
  const old=await createCharacterRun(await prepareCharacterModel(source(1,8,true)),twoSamples());await through(old,5n);expect(reports(old,RECALL)[0][2]).toEqual(list(reports(old,EPISODE)[0]));
  const lost=await createCharacterRun(await prepareCharacterModel(source(1,1)),twoSamples());await through(lost,5n);expect(bodyEntries(lost)).toHaveLength(1);expect(reports(lost,RECALL)[0][2]).toEqual(bodyEntries(lost)[0].value);expect(items(reports(lost,RETRIEVAL)[0][4],'list')).toHaveLength(1);
  console.info('M7 two retained episodes: cue5 selects newer4; slots0/1/2 access0/1/2; lost3 cannot reappear');
 },150000);
 it('repeat/restore after4 agree at every later full boundary; hidden truth cannot enter recall',async()=>{
  const s=source(),m=await prepareCharacterModel(s),d=twoSamples(),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,4n);await through(b,4n);exact(a,b);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
  for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await a.settleNextInstant();for(const peer of [b,restored]){expect(await peer.settleNextInstant()).toBe(more);exact(a,peer);}if(!more)break;}
  const hidden=await createCharacterRun(m,twoSamples(11));await finish(hidden);expect(bodyEntries(hidden)).toEqual(bodyEntries(a));expect(reports(hidden,RECALL)).toEqual(reports(a,RECALL));expect(reports(hidden,RETRIEVAL)).toEqual(reports(a,RETRIEVAL));expect(hidden.snapshot().state).not.toEqual(a.snapshot().state);
 },150000);
 it('excluded/denied evidence has no cue, zero pressure can be recalled, and recall cannot replace current sensing',async()=>{
  for(const [selected,permitted]of [[0,true],[1,false]] as const){const run=await createCharacterRun(await prepareCharacterModel(source(1,8,false,selected,permitted)),interactionData(0,0));await finish(run);expect(reports(run,EPISODE)).toHaveLength(0);expect(reports(run,RETRIEVAL)).toHaveLength(0);}
  const d=interactionData(0,1,7);d.orderedInputs=enc(list(items(decode(d.orderedInputs),'list').map(row=>{const a=items(row,'list');return txt(id(a[2]).payload)==='event/deliberation-opportunity'?list([signed(5),...a.slice(1)]):row;})));
  const run=await createCharacterRun(await prepareCharacterModel(source()),d);await finish(run);expect(reports(run,RECALL)).toHaveLength(1);const joint=reports(run,JOINT_APPRAISAL)[0];expect(joint[2]).toEqual(list([]));expect(joint[3]).toEqual(list([]));for(const row of items(joint[4],'list'))expect(items(row,'list')[1]).toEqual(text('Unavailable'));
  const empty=await createCharacterRun(await prepareCharacterModel(source(1,0)),twoSamples());await finish(empty);expect(reports(empty,RECALL)).toHaveLength(0);for(const audit of reports(empty,RETRIEVAL))expect(audit[4]).toEqual(list([]));
 },90000);
 it('rolls back a late failing instant after retrieval has read and reported prior memory',async()=>{
  const d=withoutChoice(twoSamples()),rows=items(decode(d.orderedInputs),'list'),at4=rows.filter(row=>key(items(row,'list')[0])===key(signed(4)));d.orderedInputs=enc(list([...rows,...at4.map(row=>list([signed(5),...items(row,'list').slice(1)]))]));
  const s=source(),ok=await createCharacterRun(await prepareCharacterModel(s),d);await through(ok,5n);const instant=traces(ok).filter(t=>key(f(event(t),2n))===key(signed(5)));expect(instant.some(t=>name(t)==='event/assembled-memory-recall')).toBe(true);const count=new Set(instant.map(t=>key(f(event(t),1n)))).size;
  const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(count-1))),d);await through(failed,4n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(failed.diagnostic()).toBeDefined();console.info('M7 retrieval then joint formation: '+count+' events; cap'+(count-1)+' rolls back whole instant');
 },60000);
 it('rejects invalid limits, forged channel cues and mismatched model versions',async()=>{
  await expect(prepareCharacterModel(source(33))).rejects.toThrow('slots0..32');const s=source(),d=twoSamples(),m=await prepareCharacterModel(s);
  await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([list([signed(5),unsigned(20),MEMORY_RECALL,BODY_CHANNEL,list([])])]))})).rejects.toThrow();
  await expect(prepareCharacterModel({...s,registrySchemaVersion:RETENTION_REGISTRY})).rejects.toThrow('version bundle');
 });
});
