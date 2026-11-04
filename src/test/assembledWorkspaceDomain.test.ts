import {it,expect,vi} from 'vitest';
import {list,text,unsigned,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {GOAL_MEANING_RULES,GOAL_MEANING_REGISTRY} from '../assembled/model';
import {GOAL_MEANING} from '../assembled/goalMeaning';
import {WORKSPACE,sharedWorkspace} from '../assembled/workspace';
import {controlAllocation} from '../assembled/control';
import {RECALL,isBodyEpisodePath} from '../assembled/memory';
import * as use from '../assembled/memoryUse';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {source,data,decode,items,key,enc} from './fixtures/assembledWorkspaceDomain';
import {through,outputs,signedValue,type Run} from './fixtures/assembledComparison';
const reports=(r:Run,label:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const meaning=(r:Run)=>reports(r,GOAL_MEANING).at(-1)!;
const field=(v:CanonicalValue,k:string)=>items(items(v,'list').find(x=>key(items(x,'list')[0])===key(text(k)))!,'list')[1];
const assessment=(r:Run)=>field(meaning(r)[5],'assessment');
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
function occupancy(r:Run,count:number){const w=reports(r,WORKSPACE).at(-1)!,task=rec(w[3],381n);expect(items(f(task,4n),'list')).toHaveLength(3);expect(uint(f(rec(f(task,5n),380n),1n))).toBe(2n);const selected=items(w[4],'list');expect(selected).toHaveLength(count);expect(4+count).toBeLessThanOrEqual(Number(uint(w[2])));return selected;}
async function run(capacity=6,goal:Parameters<typeof source>[1]='High',broad=false,hidden=false,permitted=true,at=broad?17n:5n){const r=await createCharacterRun(await prepareCharacterModel(source(capacity,goal,broad,permitted)),data(broad,hidden));await through(r,at);return r;}
function live(r:Run){expect(field(assessment(r),'kind')).toEqual(text('Assessed'));expect(field(field(assessment(r),'concern'),'status')).toEqual(text('Open'));expect(items(meaning(r)[4],'list')).toHaveLength(2);return assessment(r);}
it('admission and reservations: versioned bounds and one unchanged shared budget',async()=>{
 for(const cap of [0,5,6,20,32])await expect(prepareCharacterModel(source(cap))).resolves.toBeDefined();
 await expect(prepareCharacterModel(source(33))).rejects.toThrow('capacity');
 const wide=source(6);await expect(prepareCharacterModel({...wide,rulesVersion:GOAL_MEANING_RULES,registrySchemaVersion:GOAL_MEANING_REGISTRY})).rejects.toThrow('capacity');
 await expect(prepareCharacterModel({...wide,registrySchemaVersion:GOAL_MEANING_REGISTRY})).rejects.toThrow('version bundle');
 for(const cap of [5,6,20,32])for(const used of [0,4,cap]){const a=controlAllocation(cap,used,true,true,true,true,true,32);expect(a.reserved+a.spare+used).toBe(cap);expect(a.maintained).toBe(used<cap);expect(a.card).toBe(used+Number(a.maintained)<cap);}
 for(const cap of [-1,1.5,33])expect(()=>controlAllocation(cap,0,false,false,false,false,false,32)).toThrow();
 expect(()=>controlAllocation(6,0,false,false,false,false,false)).toThrow();
 console.info('M48 DOMAIN capacity0..32 version0.49 only; old0.48 rejects6; reservations consume same capacity, no new task slots.');
},600000);
it('connection: all three tasks coexist with live recalled goal meaning at6 and20',async()=>{
 const high=await run(6),low=await run(6,'Low'),wide=await run(20),blocked=await run(5);
 for(const r of [high,low,wide]){occupancy(r,2);live(r);expect(items(meaning(r)[4],'list').map(v=>signedValue(items(items(v,'list')[1],'list')[5]))).toEqual([1n,4n]);}
 expect(field(assessment(high),'relation')).toEqual(text('MovingCloser'));expect(field(assessment(high),'boundary')).toEqual(text('Attainment'));
 expect(field(assessment(low),'relation')).toEqual(text('MovingFarther'));expect(field(assessment(low),'boundary')).toEqual(text('Violation'));
 expect(meaning(wide)[4]).toEqual(meaning(high)[4]);expect(meaning(wide)[5]).toEqual(meaning(high)[5]);occupancy(blocked,1);expect(field(assessment(blocked),'reason')).toEqual(text('MissingEvidence'));
 console.info('M48 CONNECTION 3 tasks+forecast+2 actual recalls:6/20 High closer/attainment,6 Low farther/violation;5 remains one recall/MissingEvidence. Seed0, no choice claim.');
},600000);
it('broad access: sixteen real publications, consumed use only, repeat and restore16->17',async()=>{
 const s=source(20,'High',true),d=data(true),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),repeat=await createCharacterRun(m,d);
 await through(a,16n);await through(repeat,16n);expect(repeat.snapshot()).toEqual(a.snapshot());expect(repeat.save()).toEqual(a.save());
 const b=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});expect(b.snapshot()).toEqual(a.snapshot());
 for(const r of [a,b,repeat])await through(r,17n);expect(b.snapshot()).toEqual(a.snapshot());expect(b.save()).toEqual(a.save());expect(repeat.snapshot()).toEqual(a.snapshot());expect(repeat.save()).toEqual(a.save());
 const selected=occupancy(a,16);live(a);expect(field(assessment(a),'relation')).toEqual(text('IndeterminateRelation'));
 expect(items(meaning(a)[4],'list').map(v=>signedValue(items(items(v,'list')[1],'list')[5]))).toEqual([15n,16n]);
 const ws=outputs(a.snapshot().trace,160n).find(t=>key(f(t,6n))===key(text('assembled-character-workspace/0.6-candidate')))!;expect(ws).toBeDefined();
 const supplied=items(items(f(ws,12n),'list')[1],'list');expect(supplied).toHaveLength(1);
 const delivery=items(supplied[0],'list'),recallEvent=rec(delivery[1],130n),published=items(delivery[2],'list');expect(published).toHaveLength(16);
 for(const v of selected){const a=items(v,'list');expect(published).toContainEqual(a[1]);expect(a[2]).toEqual(f(recallEvent,1n));}
 expect(items(f(ws,11n),'list').every(r=>uint(f(rec(f(rec(r,147n),2n),140n),1n))!==346n)).toBe(true);
 const credits=reports(a,use.BODY_MEMORY_USE).filter(v=>signedValue(v[1])===17n);expect(credits).toHaveLength(2);
 expect(credits.every(v=>key(v[4])===key(list(meaning(a))))).toBe(true);
 const stored=state(a).entries().filter(e=>isBodyEpisodePath(e.path));expect(stored).toHaveLength(16);expect(stored.filter(e=>items(e.value,'list')[6]===true)).toHaveLength(2);
 // Same authenticated handoff; full/current/future/duplicate checks on widened path.
 const event={eventId:uint(f(recallEvent,1n)),dueAt:simInstant(signedValue(f(recallEvent,2n))),phase:uint(f(recallEvent,3n)),eventSequence:uint(f(recallEvent,4n)),eventTypeId:id(f(recallEvent,5n)),payload:f(recallEvent,6n),dependencies:f(recallEvent,7n),causalParentEventIds:items(f(recallEvent,8n),'list').map(uint)};
 const raw={character:delivery[0],event,episodes:published};
 expect(raw.event.dueAt).toBe(17n);expect(reports(a,RECALL).length).toBeGreaterThanOrEqual(16);
 const task=reports(a,WORKSPACE).at(-1)![3];expect(sharedWorkspace(task,20,17n,[raw],0,32).report).toEqual(list(reports(a,WORKSPACE).at(-1)!));
 expect(()=>sharedWorkspace(task,20,18n,[raw],0,32)).toThrow('stale');
 const future=items(published[0],'list');expect(()=>sharedWorkspace(task,20,17n,[{...raw,episodes:[list(future.map((v,i)=>i===5?signed(17):v))]}],0,32)).toThrow('future');
 expect(sharedWorkspace(task,20,17n,[{...raw,episodes:[...published,...published]}],0,32).report).toEqual(list(reports(a,WORKSPACE).at(-1)!));
 expect(sharedWorkspace(task,20,17n,[raw],1,32).sourceIds).toHaveLength(15);
 const narrow=await run(19,'High',true);occupancy(narrow,15);expect(state(narrow).entries().filter(e=>isBodyEpisodePath(e.path))).toHaveLength(16);
 console.info('M48 BROAD 3+1+16 actual recalled at20;3+1+15 at19 without erasure; actual current publication joins; latest15/16 uncertain pair, only2 used; full repeat/save/restore16->17 exact.');
},600000);
it('epistemic and rollback: equal evidence, denied channel and late failure',async()=>{
 const a=await run(),b=await run(6,'High',false,true);live(a);live(b);expect(meaning(a)).toEqual(meaning(b));expect(a.snapshot().state).not.toEqual(b.snapshot().state);
 const denied=await run(6,'High',false,false,false);occupancy(denied,0);expect(field(assessment(denied),'reason')).toEqual(text('MissingEvidence'));expect(state(denied).entries().filter(e=>isBodyEpisodePath(e.path))).toHaveLength(0);
 const failed=await run(6,'High',false,false,true,4n),before=failed.snapshot(),original=use.creditBodyEpisode;let reached=false;
 const spy=vi.spyOn(use,'creditBodyEpisode').mockImplementation(v=>{original(v);reached=true;throw Error('M48 late use');});try{await expect(failed.settleNextInstant()).rejects.toThrow('M48 late use');expect(reached).toBe(true);expect({...failed.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 console.info('M48 BOUNDARIES hidden20/20.5 same meaning, denied -> no recall/use; late actual-use failure rolls back complete instant.');
},600000);
