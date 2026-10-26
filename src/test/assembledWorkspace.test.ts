import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {RETRIEVAL_RULES,RETRIEVAL_REGISTRY,WORKSPACE_RULES,WORKSPACE_REGISTRY} from '../assembled/model';
import {RETENTION} from '../assembled/retention';
import {RETRIEVAL} from '../assembled/retrieval';
import {WORKSPACE,sharedWorkspace,type BodyRecallDelivery} from '../assembled/workspace';
import {RECALL,EPISODE,MEMORY_RECALL,isBodyEpisodePath} from '../assembled/memory';
import {BODY_SAMPLE,BODY_CHANNEL,BODY_SELECTION_REPORT,bodyId} from '../assembled/body';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {canonicalEncode as enc,list,text,signed,unsigned,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {restoreAuthoritativeState} from '../substrate/state';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {interactionSource,interactionData,outputs} from './fixtures/assembledInteraction';
import {changeDefinition,workLimit} from './fixtures/assembledCharacter';
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
function source(capacity=3,oneTask=false,old=false,selected=1,permitted=true){let s=interactionSource(permitted);s=changeDefinition(s,'definition/task-workspace',2n,unsigned(capacity));if(oneTask)s=changeDefinition(s,'definition/task-b',5n,signed(8));const registry=[...items(decode(s.registry),'list'),list([text(BODY_SELECTION_REPORT),unsigned(selected)]),list([text(RETENTION),unsigned(8),unsigned(8),unsigned(2)]),list([text(RETRIEVAL),unsigned(1)])];return {...s,rulesVersion:old?RETRIEVAL_RULES:WORKSPACE_RULES,registrySchemaVersion:old?RETRIEVAL_REGISTRY:WORKSPACE_REGISTRY,registry:enc(list(registry))};}
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
function laterChoice(amount=10,body:0|1=0,second=false){const d=interactionData(0,body,7,amount);const rows=items(decode(d.orderedInputs),'list').map(row=>{const a=items(row,'list');return txt(id(a[2]).payload)==='event/deliberation-opportunity'?list([signed(5),...a.slice(1)]):row;});if(second){const choice=items(rows.find(row=>txt(id(items(row,'list')[2]).payload)==='event/deliberation-opportunity')!,'list');rows.push(list([signed(6),...choice.slice(1)]));}return {...d,orderedInputs:enc(list(rows))};}
const priorOutputs=(run:Run)=>enc(list(items(decode(run.snapshot().outputs),'list').filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(WORKSPACE))))));
const mask=(v:CanonicalValue,fields:bigint[])=>{const r=rec(v,160n);return record(r.schema,new Map([...r.fields].map(([n,x])=>[n,fields.includes(n)?false:x])));};
const selected=(run:Run,index=0)=>items(reports(run,WORKSPACE)[index][4],'list').map(v=>items(v,'list'));
function delivery(run:Run):BodyRecallDelivery {const t=traces(run).find(t=>name(t)==='event/assembled-memory-recall')!,e=event(t),at=f(e,2n);if(typeof at==='boolean'||at.kind!=='signed')throw Error('time');return {character:f(rec(reports(run,WORKSPACE)[0][3],381n),2n),event:{eventId:uint(f(e,1n)),dueAt:simInstant(at.value),phase:uint(f(e,3n)),eventSequence:uint(f(e,4n)),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(uint)},episodes:reports(run,RECALL).map(r=>r[2])};}
describe('M8 recalled content shares the existing workspace capacity',()=>{
 it('preserves four original M3 cells and every non-workspace trace field modulo identities',async()=>{
  const old=await prepareCharacterModel(source(3,false,true)),next=await prepareCharacterModel(source());
  for(const h of [0,1] as const)for(const b of [0,1] as const){const d=interactionData(h,b,7),a=await createCharacterRun(old,d),n=await createCharacterRun(next,d);await finish(a);await finish(n);expect(n.snapshot().state).toEqual(a.snapshot().state);expect(priorOutputs(n)).toEqual(a.snapshot().outputs);expect(draws(n)).toEqual(draws(a));expect(reports(n,WORKSPACE)).toHaveLength(1);expect(selected(n)).toEqual([]);
   const stable=(t:CanonicalValue)=>mask(t,[2n,3n,...(name(t)==='event/deliberation-opportunity'?[6n,9n,12n,13n]:[])]);expect(traces(n).map(stable)).toEqual(traces(a).map(stable));
  }console.info('M8 four-cell correspondence: full state, prior outputs, draws, non-workspace trace exact');
 },180000);
 it('one task plus forecast admits recall only in the third shared slot; two tasks exclude it without erasure',async()=>{
  const runs:Run[]=[];for(const capacity of [0,1,2,3]){const run=await createCharacterRun(await prepareCharacterModel(source(capacity,true)),laterChoice());await through(run,5n);const report=reports(run,WORKSPACE)[0],w=rec(report[3],381n),used=items(f(w,4n),'list').length+(uint(f(rec(f(w,5n),380n),1n))===2n?1:0),memory=selected(run);expect(used).toBe(capacity===0?0:capacity===1?1:2);expect(items(f(w,4n),'list')).toHaveLength(capacity===0?0:1);expect(used+memory.length).toBeLessThanOrEqual(capacity);expect(memory).toHaveLength(capacity===3?1:0);expect(reports(run,RECALL)).toHaveLength(1);expect(bodyEntries(run)).toHaveLength(1);
   if(memory.length){expect(memory[0][1]).toEqual(reports(run,RECALL)[0][2]);expect(memory[0][1]).toEqual(bodyEntries(run)[0].value);expect(memory[0][0]).toEqual(items(bodyEntries(run)[0].value,'list')[1]);const recall=traces(run).find(t=>name(t)==='event/assembled-memory-recall')!;expect(memory[0][2]).toEqual(f(event(recall),1n));}
   await finish(run);runs.push(run);
  }expect(bodyEntries(runs[2])).toEqual(bodyEntries(runs[3]));expect(runs[2].snapshot().state).toEqual(runs[3].snapshot().state);expect(draws(runs[2])).toEqual(draws(runs[3]));
  const full=await createCharacterRun(await prepareCharacterModel(source()),laterChoice());await through(full,5n);expect(items(f(rec(reports(full,WORKSPACE)[0][3],381n),4n),'list')).toHaveLength(2);expect(uint(f(rec(f(rec(reports(full,WORKSPACE)[0][3],381n),5n),380n),1n))).toBe(2n);expect(selected(full)).toHaveLength(0);expect(reports(full,RECALL)).toHaveLength(1);expect(bodyEntries(full)).toHaveLength(1);
  const old=await createCharacterRun(await prepareCharacterModel(source(3,true,true)),laterChoice());await finish(old);expect(runs[3].snapshot().state).toEqual(old.snapshot().state);expect(priorOutputs(runs[3])).toEqual(old.snapshot().outputs);expect(draws(runs[3])).toEqual(draws(old));
  console.info('M8 slots0..3 shared occupancy PASS; one task+forecast admits memory at3, two tasks+forecast excludes it');
 },150000);
 it('workspace traces actual delivery and has no memory/archive read, then the delivery expires',async()=>{
  const run=await createCharacterRun(await prepareCharacterModel(source(3,true)),laterChoice(10,0,true));await through(run,5n);expect(selected(run)).toHaveLength(1);const t=traces(run).find(t=>name(t)==='event/deliberation-opportunity')!,input=items(f(t,12n),'list'),supplied=items(input[1],'list');expect(supplied).toHaveLength(1);const d=items(supplied[0],'list'),recall=traces(run).find(t=>name(t)==='event/assembled-memory-recall')!;expect(d[1]).toEqual(event(recall));expect(items(d[2],'list')).toEqual(reports(run,RECALL).map(r=>r[2]));expect(items(f(t,9n),'list')).toEqual([selected(run)[0][0]]);
  const roots=items(f(t,11n),'list').map(v=>uint(f(rec(f(rec(v,147n),2n),140n),1n)));expect(roots.every(root=>[268n,373n,362n].includes(root))).toBe(true);expect(roots).not.toContain(346n);
  await through(run,6n);expect(selected(run,1)).toEqual([]);expect(bodyEntries(run)).toHaveLength(1);expect(reports(run,RECALL)).toHaveLength(1);const last=traces(run).filter(t=>name(t)==='event/deliberation-opportunity').at(-1)!;expect(items(f(last,12n),'list')[1]).toEqual(list([]));await finish(run);
 },60000);
 it('repeat and restore after4 match every later boundary, including selected memory at5',async()=>{
  const s=source(3,true),m=await prepareCharacterModel(s),d=laterChoice(),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,4n);await through(b,4n);exact(a,b);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
  for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await a.settleNextInstant();for(const peer of [b,restored]){expect(await peer.settleNextInstant()).toBe(more);exact(a,peer);}if(!more)break;}expect(selected(a)).toHaveLength(1);
 },150000);
 it('hidden truth stays out, excluded/denied samples supply no recall, zero pressure remains content',async()=>{
  const m=await prepareCharacterModel(source(3,true)),a=await createCharacterRun(m,laterChoice(10)),b=await createCharacterRun(m,laterChoice(11));await finish(a);await finish(b);expect(reports(a,WORKSPACE)).toEqual(reports(b,WORKSPACE));expect(a.snapshot().state).not.toEqual(b.snapshot().state);
  for(const [selection,permitted]of [[0,true],[1,false]] as const){const run=await createCharacterRun(await prepareCharacterModel(source(3,true,false,selection,permitted)),laterChoice());await finish(run);expect(reports(run,RECALL)).toHaveLength(0);expect(selected(run)).toEqual([]);}
  const zero=await createCharacterRun(m,laterChoice(10,1));await finish(zero);expect(selected(zero)).toHaveLength(1);const sample=rec(items(selected(zero)[0][1],'list')[2],461n),hi=f(rec(f(sample,5n),462n),2n);expect(typeof hi!=='boolean'&&hi.kind==='rational'&&hi.numerator>=60n*hi.denominator).toBe(true);const joint=reports(zero,JOINT_APPRAISAL)[0];expect(joint[2]).toEqual(list([]));expect(joint[3]).toEqual(list([]));
 },120000);
 it('late failure after the workspace handoff rolls back the whole instant',async()=>{
  const s=source(3,true),d=laterChoice(),rows=items(decode(d.orderedInputs),'list'),sample=items(rows.find(row=>key(items(row,'list')[2])===key(BODY_SAMPLE))!,'list');d.orderedInputs=enc(list([...rows,list([signed(5),...sample.slice(1)])]));const ok=await createCharacterRun(await prepareCharacterModel(s),d);await through(ok,5n);expect(selected(ok)).toHaveLength(1);const instant=traces(ok).filter(t=>key(f(event(t),2n))===key(signed(5))),count=new Set(instant.map(t=>key(f(event(t),1n)))).size;
  const failed=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(count-1))),d);await through(failed,4n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow();expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(failed.diagnostic()).toBeDefined();console.info('M8 workspace then execution: '+count+' events, cap'+(count-1)+' entire instant rolls back');
 },60000);
 it('rejects stale/foreign/future handoffs and forged public recall; deduplicates repeated acquisitions without double charging',async()=>{
  const s=source(3,true),d=laterChoice(),m=await prepareCharacterModel(s),run=await createCharacterRun(m,d);await through(run,5n);const w=reports(run,WORKSPACE)[0][3],live=delivery(run);expect(sharedWorkspace(w,3,5n,[live]).report).toEqual(list(reports(run,WORKSPACE)[0]));
  for(const changed of [{...live,character:bodyId(1002,'foreign')},{...live,event:{...live.event,dueAt:simInstant(4n)}},{...live,event:{...live.event,phase:120n}},{...live,event:{...live.event,payload:list([])}}])expect(()=>sharedWorkspace(w,3,5n,[changed])).toThrow();
  const a=items(live.episodes[0],'list');expect(()=>sharedWorkspace(w,3,5n,[{...live,episodes:[list(a.map((v,i)=>i===5?signed(5):v))]}])).toThrow('future');
  expect(sharedWorkspace(w,3,5n,[{...live,episodes:[...live.episodes,...live.episodes]}]).report).toEqual(sharedWorkspace(w,3,5n,[live]).report);
  const copy=sharedWorkspace(w,3,5n,[live]);(items(copy.report,'list') as CanonicalValue[])[4]=list([]);expect(sharedWorkspace(w,3,5n,[live]).report).toEqual(list(reports(run,WORKSPACE)[0]));
  await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([list([signed(5),unsigned(20),MEMORY_RECALL,BODY_CHANNEL,list([])])]))})).rejects.toThrow();await expect(prepareCharacterModel({...s,registrySchemaVersion:RETRIEVAL_REGISTRY})).rejects.toThrow('version bundle');
 });
});
