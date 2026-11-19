import {simInstant} from '../substrate/time';
import type {ScheduledEvent,EventEmission} from '../substrate/scheduler';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {GOAL_MEANING} from '../assembled/goalMeaning';
import {it,expect,vi} from 'vitest';
import {fixture171,type ReportOptions} from './fixtures/assembledReportedMeaning';
import {items,key,list,decode,enc} from './fixtures/assembledDefiningControls';
import {text,signed,u,q,exact,bytes,rec,f,outputs,uint} from './fixtures/assembledDefining';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {state,through,finish,reports,report,focal,live17,type Run} from './assembledDefining.test';
import {isPositionEpisodePath,isBodyEpisodePath,MEMORY_FORMATION} from '../assembled/memory';
import {directions,named} from '../assembled/significance';
import {REPORTED_MEANING,REPORT_SOURCE,REPORT_ASSESS,REPORT_DELIVERY,REPORT_FREEZE,compileReportedMeaning} from '../assembled/reportedMeaning';
import * as reportedModule from '../assembled/reportedMeaning';
import {RETENTION,RETENTION_PRESSURE} from '../assembled/retention';
import {FINAL_RECALL} from '../assembled/rehearsal';
// Same real four trials, body30/rate10, seed0; Low original[20,21], no learnedS0.
// Declared passive stand-in report23 through Current perception; no social task.
// Genuine17 significance; pure pressure22 (no acquisition), final50, full5001.
async function start(o:ReportOptions={}){const b=fixture171(o),m=await prepareCharacterModel(b.s);return {b,m,run:await createCharacterRun(m,b.d)};}
function episodes(r:Run){return state(r).entries().filter(e=>e.path.rootStateTypeId===346n);}
function trained(r:Run){live17(r,'Low');const old=focal(r)!.value;expect(directions(items(old,'list')[7])).toEqual(['MovingFarther']);const es=episodes(r);expect(es.filter(e=>isPositionEpisodePath(e.path))).toHaveLength(8);expect(es.filter(e=>isBodyEpisodePath(e.path))).toHaveLength(8);return old;}
function current(r:Run,relation?:string){const row=report(r,REPORTED_MEANING,23),a=named(row[5],'assessment');expect(named(a,'kind')).toEqual(text(relation?'Assessed':'Unavailable'));if(relation)expect(named(a,'relation')).toEqual(text(relation));return row;}
function currentTrace(r:Run){const traces=outputs(r.snapshot().trace,160n),t=traces.filter(t=>key(f(rec(f(t,4n),130n),5n))===key(REPORT_ASSESS));expect(t).toHaveLength(1);const e=rec(f(t[0],4n),130n),parents=items(f(e,8n),'list');expect(parents.length).toBe(2);const parentTypes=traces.filter(t=>parents.some(p=>key(p)===key(f(rec(f(t,4n),130n),1n)))).map(t=>f(rec(f(t,4n),130n),5n));expect(parentTypes).toContainEqual(REPORT_FREEZE);expect(parentTypes).toContainEqual(REPORT_DELIVERY);const reads=items(f(t[0],11n),'list');expect(reads).toHaveLength(1);const path=rec(f(rec(reads[0],147n),2n),140n);expect(f(path,1n)).toEqual(u(373));expect(f(path,2n)).toEqual(u(5));expect(items(f(rec(f(t[0],16n),144n),1n),'list')).toEqual([]);return t[0];}
it('primary171: perceived contrary report changes current meaning without revising historical significance',async()=>{
 const a=await start(),b=await start({report:'contrary'});
 for(const x of [a,b]){await through(x.run,17n);trained(x.run);await through(x.run,22n);const es=episodes(x.run);expect(es.filter(e=>isPositionEpisodePath(e.path))).toHaveLength(1);expect(es.filter(e=>isBodyEpisodePath(e.path))).toHaveLength(8);expect(report(x.run,RETENTION,22)[8]).toEqual(u(1));const before=es;await through(x.run,23n);expect(episodes(x.run)).toEqual(before);current(x.run,x===a?'MovingFarther':'SameDistance');currentTrace(x.run);}
 expect(items(focal(a.run)!.value,'list')[7]).toEqual(items(focal(b.run)!.value,'list')[7]);
 for(const x of [a,b]){await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);}
 console.info('M171 PRIMARY PASS both genuine historical MovingFarther17; pure1 pressure22,8body remain; actual current reports23 yield MovingFarther vs SameDistance, exact memory bytes unchanged at23; goal-only read/support parents; full5001.');
},390000);
it('controls171: missing and denied evidence, diagnostic truth and pure0/8 capacities',async()=>{
 const a=await start({report:'missing',capacity:0}),b=await start({permitted:false,capacity:8,concurrentBody:true}),c=await start({report:'contrary',worldAfter:20,capacity:8}),d=await start({report:'contrary',worldAfter:30,capacity:8});
 const projected:unknown[]=[];
 for(const x of [a,b,c,d]){
  await through(x.run,17n);trained(x.run);await through(x.run,22n);const before=episodes(x.run),events=before.filter(e=>isPositionEpisodePath(e.path));expect(events).toHaveLength(x===a?0:8);expect(before.filter(e=>isBodyEpisodePath(e.path))).toHaveLength(8);
  if(x===b){const ts=outputs(x.run.snapshot().trace,160n).filter(t=>key(f(rec(f(t,4n),130n),2n))===key(signed(22))&&key(f(rec(f(t,4n),130n),3n))===key(u(140))),events=ts.map(t=>rec(f(t,4n),130n));expect(events.some(e=>key(f(e,5n))===key(RETENTION_PRESSURE))).toBe(true);expect(events.some(e=>key(f(e,5n))===key(MEMORY_FORMATION))).toBe(true);expect(events.map(e=>(f(e,4n) as {value:bigint}).value)).toEqual(events.map(e=>(f(e,4n) as {value:bigint}).value).sort((a,b)=>a<b?-1:a>b?1:0));expect(reports(x.run,RETENTION).filter(r=>key(r[1])===key(signed(22)))).toHaveLength(1);}

  await through(x.run,23n);expect(episodes(x.run)).toEqual(before);const row=current(x.run,x===a||x===b?undefined:'SameDistance');if(x===a||x===b)expect(items(items(row[4],'list')[2],'list')).toHaveLength(0);else projected.push([row[3],row[4],row[5],before]);
  await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);if(x===a)expect(items(report(x.run,FINAL_RECALL,50)[5],'list')).toHaveLength(0);
 }
 expect(projected[0]).toEqual(projected[1]);
 console.info('M171 CONTROLS PASS actual acquired event0 loss/body8 retained; pure8 preserves all8 positions; missing/denied -> Unavailable without fallback, historical memory unchanged; diagnostic20/30 gives exact equal baseline/perceived report/current assessment/memory; full5001.');
},540000);
it('recovery171: authentic carried baseline restores every boundary and actual assessment fault rolls back',async()=>{
 const a=await start({report:'contrary',capacity:0});await through(a.run,17n);trained(a.run);
 const b=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,b);await finish(a.run,[b]);expect(a.run.snapshot().clock).toBe(5001n);current(a.run,'SameDistance');current(b,'SameDistance');
 const original=reportedModule.createReportedMeaning;let hit=false,captured:Parameters<typeof original>|undefined,priorState:ReturnType<typeof state>|undefined;const spy=vi.spyOn(reportedModule,'createReportedMeaning').mockImplementation((...args)=>{captured=args;const handler=original(...args);return {...handler,execute(c){const result=handler.execute(c);if(key(c.event.eventTypeId)===key(REPORT_ASSESS)){expect(result.outputs).toHaveLength(1);hit=true;throw Error('171 after actual current assessment');}return result;}};});
 try{const f=await start({report:'contrary'});await through(f.run,22n);priorState=state(f.run);const before=f.run.snapshot();await expect(f.run.settleNextInstant()).rejects.toThrow('171 after actual current assessment');expect(hit).toBe(true);const after=f.run.snapshot();expect(after.clock).toBe(before.clock);for(const k of ['state','outputs','trace'] as const)bytes(after[k],before[k]);}finally{spy.mockRestore();}

 // Component negative uses an ACTUAL later native appraisal with an unknown Before.
 // Known current report still cannot fill that earlier gap; not a new native scenario.
 const actual=report(a.run,GOAL_MEANING,50);expect(items(actual[4],'list')).toHaveLength(0);
 const tr=outputs(a.run.snapshot().trace,160n).find(t=>{const e=rec(f(t,4n),130n);return key(f(e,2n))===key(signed(50))&&key(f(e,5n))===key({kind:'typedIdentifier',namespaceId:1001n,payload:text('event/task-appraisal')});})!,e=rec(f(tr,4n),130n);
 const parent:ScheduledEvent={eventId:uint(f(e,1n)),dueAt:simInstant(50n),phase:50n,eventSequence:uint(f(e,4n)),eventTypeId:id(f(e,5n)),payload:f(e,6n),dependencies:f(e,7n),causalParentEventIds:items(f(e,8n),'list').map(uint)};
 const args=[...captured!] as Parameters<typeof original>,source={...args[4][0],dueAt:simInstant(51n)};args[0]={...args[0],anchor:50n,at:51n};args[4]=[source];const h=original(...args);let ordinal=1000000n;
 const allocated=(p:ScheduledEvent,emissions:readonly EventEmission[])=>emissions.map(em=>({...em,eventId:ordinal++,eventSequence:ordinal++,causalParentEventIds:[...new Set([p.eventId,...(em.additionalCausalParentEventIds??[])])].sort((a,b)=>a<b?-1:1)}));
 h.begin(50n);const carried=h.observe(parent,[list(actual)])!,delivery=allocated(parent,carried.emissions);carried.bind(delivery);h.prepareCommit();h.commit();h.close();
 h.begin(51n);const invoke=(event:ScheduledEvent)=>{const result=h.execute({event,state:priorState!,instant:simInstant(51n),allocateRuntimeId:()=>ordinal++}),children=allocated(event,result.emittedEvents);result.traceFactory(children);return {result,children};};
 const sensed=invoke(source);invoke(sensed.children[0]);const delivered=invoke(delivery[0]),assessed=invoke(delivered.children[0]);
 expect(named(named(items(assessed.result.outputs[0],'list')[5],'assessment'),'kind')).toEqual(text('Unavailable'));expect(assessed.result.nextState).toBe(priorState);h.prepareCommit();h.commit();h.close();
 const expired=fixture171(),slots=[...items(decode(expired.s.registry),'list')],decl=[...items(slots[53],'list')];decl[2]=signed(5001);slots[53]=list(decl);await expect(prepareCharacterModel({...expired.s,registry:enc(list(slots))})).rejects.toThrow('goal expiry');
 expect(()=>compileReportedMeaning(list([text(REPORTED_MEANING),signed(23),signed(17),text('reporter')]))).toThrow();
 expect(()=>compileReportedMeaning(list([text(REPORTED_MEANING),signed(17),signed(23),text('bad reporter')]))).toThrow();
 for(const type of [REPORT_DELIVERY,REPORT_ASSESS,RETENTION_PRESSURE]){const forged={...a.b.d,orderedInputs:enc(list([...items(decode(a.b.d.orderedInputs),'list'),list([signed(22),u(140),type,list([]),list([])])]))};await expect(createCharacterRun(a.m,forged)).rejects.toThrow();}
 const malformed=fixture171(),rows=[...items(decode(malformed.d.orderedInputs),'list')],i=rows.findIndex(v=>key(items(v,'list')[2])===key(REPORT_SOURCE)),r=items(rows[i],'list'),payload=[...items(r[3],'list')];payload[2]=list([q(101,1),q(102,1)]);rows[i]=list([...r.slice(0,3),list(payload),r[4]]);await expect(createCharacterRun(a.m,{...malformed.d,orderedInputs:enc(list(rows))})).rejects.toThrow();
 console.info('M171 RECOVERY PASS original-input save17 and EVERY later canonical state/output/trace/save/run byte through5001 including assessment after actual event loss; actual post-assessment rollback, illegal reports and forged delivery/assessment/pressure rejected.');
},540000);
