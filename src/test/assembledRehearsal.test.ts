import {it,expect,vi} from 'vitest';
import {simInstant} from '../substrate/time';
import {changeDefinition} from './fixtures/assembledCharacter';
import {BODY_SAMPLE} from '../assembled/body';
import {current,items,key,enc,list,decode} from './fixtures/assembledDefiningControls';
import {C,text,signed,u,exact,rec,f,outputs,type CanonicalValue} from './fixtures/assembledDefining';
import {REHEARSAL_RULES,REHEARSAL_REGISTRY,compileCharacterModel} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {state,through,finish,reports,report,type Run} from './assembledDefining.test';
import {SPATIAL_MEANING} from '../assembled/goalMeaning';
import {named,directions} from '../assembled/significance';
import {RETAINED_ATTRIBUTION,deriveRetainedAttribution,validateAttributionCue} from '../assembled/retainedAttribution';
import {REHEARSAL,REHEARSAL_USE,compileRehearsal,rehearsalOperands,isCarriedCue} from '../assembled/rehearsal';
import {WORKSPACE,type BodyRecallDelivery} from '../assembled/workspace';
import {RECALL,MEMORY_PRESENTATION,MEMORY_RECALL,POSITION_EPISODE,EPISODE,isPositionEpisodePath,isBodyEpisodePath} from '../assembled/memory';
import * as memoryModule from '../assembled/memory';
import {positionHistory} from '../assembled/positionPresentation';
import {scheduledEventValue} from '../substrate/persistence';
import {sid} from '../assembled/skill';
import {applyQualifiedUnitUse} from '../campaign3/useProtectedRetention';
import type {ScheduledEvent} from '../substrate/scheduler';
// Actual original four physical trials1..16, no social dependencies, body30/rate10,
// seed0; no reserve goal, spatial goal4000. Both have opportunities17/19/20/21/4000.
// Same pressure22..34 and late observations3998/3999; only carried schedule3/0 differs.
function fixture(rehearsals=true){
 const b=current('Absent'),slots=[...items(decode(b.s.registry),'list')],spatial=[...items(slots[37],'list')];spatial[2]=u(4000);slots[37]=list(spatial);
 slots[9]=list([...items(slots[9],'list'),text('PresentationFrequency')]);
 slots.push(list([text(REHEARSAL),signed(17),list((rehearsals?[19,20,21]:[]).map(signed))]));
 const original=items(decode(b.d.orderedInputs),'list'),rows=original.map(v=>{const a=[...items(v,'list')],t=(a[0] as {value:bigint}).value;if(t>=18n&&t<=30n)a[0]=signed(t+4n);return list(a);});
 const frame=original.filter(v=>key(items(v,'list')[0])===key(signed(17))&&(key(items(v,'list')[1])===key(u(30))||key(items(v,'list')[2])===key(sid(1001,'event/deliberation-opportunity'))));
 if(!frame.length)throw Error('167 original opportunity frame');
 for(const t of [19,20,21])rows.push(...frame.map(v=>list([signed(t),...items(v,'list').slice(1)])));
 return {...b,s:{...b.s,rulesVersion:REHEARSAL_RULES,registrySchemaVersion:REHEARSAL_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
async function start(on=true){const b=fixture(on),m=await prepareCharacterModel(b.s);return {b,m,run:await createCharacterRun(m,b.d)};}
const episodes=(r:Run)=>state(r).entries().filter(e=>isPositionEpisodePath(e.path)||isBodyEpisodePath(e.path));
const positions=(r:Run)=>episodes(r).filter(e=>isPositionEpisodePath(e.path));
const at=(r:Run,t:number)=>positions(r).find(e=>key(items(e.value,'list')[5])===key(signed(t)));
const occurrence=(v:CanonicalValue)=>(items(v,'list')[1] as {payload:{value:bigint}}).payload.value;
const used=(v:CanonicalValue)=>{const a=items(v,'list');return a[key(a[0])===key(text(POSITION_EPISODE))?9:6];};
function rehearsal(r:Run,t:number){
 const a=report(r,RETAINED_ATTRIBUTION,t),result=named(a[4],'result');
 expect(named(result,'disposition')).toEqual(text('Supported'));expect(items(a[2],'list')[3]).toEqual(signed(16));expect(isCarriedCue(a[2])).toBe(true);
 const receipts=reports(r,REHEARSAL_USE).filter(v=>key(v[1])===key(signed(t))),consumed=items(named(result,'consumed'),'list');
 expect(receipts).toHaveLength(16);expect(consumed).toHaveLength(16);
 expect(new Set(receipts.map(v=>key(v[2]))).size).toBe(16);
 for(const v of receipts){expect(v[4]).toEqual(list(a));expect(consumed.some(c=>key(named(c,'acquisition'))===key(signed(occurrence(v[5]))))).toBe(true);
  expect(reports(r,RECALL).some(x=>key(x[1])===key(signed(t))&&key(x[2])===key(v[5]))).toBe(true);
  expect(used(episodes(r).find(e=>occurrence(e.value)===occurrence(v[5]))!.value)).toBe(true);
 }
 return receipts;
}
function live(r:Run,on:boolean){
 const a=report(r,SPATIAL_MEANING,4000),assessment=named(a[5],'assessment');expect(named(assessment,'kind')).toEqual(text('Assessed'));
 expect(named(assessment,'relation')).toEqual(text(on?'MovingFarther':'SameDistance'));
 const operands=items(a[4],'list').map(v=>items(v,'list')[1]);expect(operands.map(v=>items(v,'list')[5])).toEqual(on?[signed(2),signed(15)]:[signed(3998),signed(3999)]);
 for(const v of operands)expect(reports(r,RECALL).some(x=>key(x[1])===key(signed(4000))&&key(x[2])===key(v))).toBe(true);
}
it('primary167: authentic carried rehearsal protects consumed memories and changes live late appraisal',async()=>{
 const a=await start(),b=await start(false);for(const x of [a,b])await through(x.run,17n);
 for(const x of [a,b]){expect(named(named(report(x.run,RETAINED_ATTRIBUTION,17)[4],'result'),'disposition')).toEqual(text('Supported'));expect(reports(x.run,REHEARSAL_USE)).toHaveLength(0);expect(positions(x.run).every(e=>used(e.value)===false)).toBe(true);}
 const old=positions(a.run).map(e=>e.value);expect(old).toHaveLength(8);
 expect(items(report(a.run,REHEARSAL,17)[6],'list')).toEqual([19,20,21].map(signed));expect(items(report(b.run,REHEARSAL,17)[6],'list')).toEqual([]);
 for(const t of [19,20,21]){await through(a.run,BigInt(t));rehearsal(a.run,t);await through(b.run,BigInt(t));expect(named(report(b.run,RETAINED_ATTRIBUTION,t)[4],'kind')).toEqual(text('NoConsequence'));}
 expect(reports(b.run,REHEARSAL_USE)).toHaveLength(0);
 // Exact original monotone consumed-child algebra on actual receipts/content.
 const consumed=reports(a.run,REHEARSAL_USE).filter(v=>key(v[1])===key(signed(19))).map(v=>v[5]);
 const original=applyQualifiedUnitUse(consumed.map(v=>({id:occurrence(v),acquiredAt:(items(v,'list')[5] as {value:bigint}).value,kind:(key(items(v,'list')[0])===key(text(EPISODE))?'Interoceptive':'EventContinuant') as 'Interoceptive'|'EventContinuant',units:[{key:'episode',views:[enc(v)],useProtection:used(v) as boolean}]})),consumed.map(v=>({acquisition:occurrence(v),unit:'episode'})),19n);
 expect(original.every(x=>x.units[0].useProtection)).toBe(true);
 for(const x of [a,b])await through(x.run,4000n);live(a.run,true);live(b.run,false);
 for(const v of old){const retained=positions(a.run).find(e=>occurrence(e.value)===occurrence(v))!;expect(items(retained.value,'list').slice(0,9)).toEqual(items(v,'list').slice(0,9));expect(directions(items(retained.value,'list')[7])).toEqual([]);expect(at(b.run,Number((items(v,'list')[5] as {value:bigint}).value))).toBeUndefined();}
 expect(at(a.run,3998)).toBeUndefined();expect(at(a.run,3999)).toBeUndefined();
 expect(state(a.run).entries().filter(e=>e.path.rootStateTypeId===455n)).toEqual(state(b.run).entries().filter(e=>e.path.rootStateTypeId===455n));
 for(const x of [a,b]){await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);}
 console.info('M167 PRIMARY PASS actual cue16 carried from17 into19/20/21; Supported16 consumed children/use receipts per rehearsal; original use algebra; old memories survive, late fresh memories rejected by protected saturation; live2/15 Farther vs3998/3999 Same at4000/equal body; full queues5001.');
},590000);
it('boundary167: authentic pending cues restore exactly and rehearsal writes roll back',async()=>{
 let fault=false,hit=false,forgery=false,capture:{event:ScheduledEvent;workspace:CanonicalValue;attribution:CanonicalValue;deliveries:readonly BodyRecallDelivery[]}|undefined;
 const make=memoryModule.createEpisodicExtension,spy=vi.spyOn(memoryModule,'createEpisodicExtension').mockImplementation((...args)=>{const x=make(...args);let ws:CanonicalValue,attr:CanonicalValue;return {...x,
  observeRehearsal(event,results){const p=x.observeRehearsal(event,results);if(event.dueAt===19n&&event.phase===40n){ws=results.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(WORKSPACE)))!;attr=results.find(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(RETAINED_ATTRIBUTION)))!;}
   if(event.dueAt===19n&&event.phase===50n&&key(event.eventTypeId)===key(sid(1001,'event/task-appraisal'))){capture={event,workspace:ws,attribution:attr,deliveries:x.currentRecalls()};expect(()=>x.observeRehearsal(event,results)).toThrow('duplicate');}return p;},
  prepare(events,B0){const event=events.find(e=>e.dueAt===19n&&key(e.eventTypeId)===key(MEMORY_PRESENTATION));
   if(event&&!forgery){expect(()=>x.prepare([{...event,eventId:event.eventId+100000n}],B0)).toThrow('unassociated');forgery=true;}
   const p=x.prepare(events,B0);return {...p,finish(s){const next=p.finish(s);if(fault&&event){const old=next.entries().find(e=>isPositionEpisodePath(e.path)&&key(items(e.value,'list')[5])===key(signed(2)))!;expect(used(old.value)).toBe(true);expect(positionHistory(old.value).at(-1)).toBe(19n);hit=true;throw Error('167 after rehearsal use write');}return next;}};
  }};});
 try{
  const a=await start();await through(a.run,19n);rehearsal(a.run,19);expect(forgery).toBe(true);const c=capture!;
  expect(rehearsalOperands(c.event,c.workspace,c.attribution,c.deliveries,C)).toHaveLength(16);
  expect(()=>rehearsalOperands({...c.event,dueAt:simInstant(20n)},c.workspace,c.attribution,c.deliveries,C)).toThrow();
  expect(()=>rehearsalOperands(c.event,c.workspace,c.attribution,[],C)).toThrow('delivery');
  expect(()=>rehearsalOperands(c.event,c.workspace,c.attribution,c.deliveries,sid(1002,'foreign'))).toThrow();
  const cue=items(c.attribution,'list')[2];expect(()=>validateAttributionCue(cue,C,16n)).toThrow();
  const input=list(c.deliveries.map(d=>list([d.character,scheduledEventValue(d.event),list(d.episodes)]))),w=[...items(c.workspace,'list')];w[4]=list(items(w[4],'list').slice(1));
  const incomplete=deriveRetainedAttribution(list(w),input,19n,()=>999999n,true);expect(named(named(items(incomplete,'list')[4],'result'),'disposition')).toEqual(text('Unavailable'));expect(rehearsalOperands(c.event,list(w),incomplete,c.deliveries,C)).toEqual([]);
  const ambiguous=deriveRetainedAttribution(c.workspace,list([...items(input,'list'),items(input,'list')[0]]),19n,()=>999999n,true);expect(named(items(ambiguous,'list')[4],'kind')).toEqual(text('AmbiguousConsequences'));expect(rehearsalOperands(c.event,c.workspace,ambiguous,c.deliveries,C)).toEqual([]);
  expect(()=>deriveRetainedAttribution(c.workspace,list([...items(input,'list'),items(input,'list')[0]]),19n,()=>999999n)).toThrow('multiple');
  for(const ds of [[17],[20,19],[19,19],[19,20,21,22],[1000001]])expect(()=>compileRehearsal(list([text(REHEARSAL),signed(17),list(ds.map(signed))]))).toThrow();
  expect(compileRehearsal(list([text(REHEARSAL),signed(17),list([signed(999999),signed(1000000)])])).destinations).toEqual([999999n,1000000n]);
  const slots=[...items(decode(a.b.s.registry),'list')];slots[52]=list([text(REHEARSAL),signed(17),list([signed(18),signed(23)])]);expect((await compileCharacterModel({...a.b.s,registry:enc(list(slots))})).rehearsal!.destinations).toEqual([18n,23n]);
  const forged={...a.b.d,orderedInputs:enc(list([...items(decode(a.b.d.orderedInputs),'list'),list([signed(19),u(20),MEMORY_RECALL,cue,list([])])]))};await expect(createCharacterRun(a.m,forged)).rejects.toThrow();
  fault=true;const broken=await createCharacterRun(a.m,a.b.d);await through(broken,17n);const before=broken.snapshot(),save=broken.save();
  await expect(broken.settleNextInstant()).rejects.toThrow('167 after rehearsal use write');expect(hit).toBe(true);expect({...broken.snapshot(),status:before.status}).toEqual(before);fault=false;
  const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save});await through(restored,19n);exact(a.run,restored);
  await finish(a.run,[restored]);expect(a.run.snapshot().clock).toBe(5001n);live(a.run,true);live(restored,true);
  console.info('M167 BOUNDARY PASS authenticated/foreign/stale/duplicate/forged-source guards; actual incomplete/ambiguous component attribution no use; generalized schedule; post-write use/history rollback; public save17 reconstructs pending queries and every later canonical boundary through5001 exactly.');
 }finally{spy.mockRestore();}
},590000);

it('overlap167: attribution consumes authentic operands from the shared recall union',async()=>{
 const b=fixture(),slots=[...items(decode(b.s.registry),'list')],retention=[...items(slots[8],'list')];retention[2]=u(17);slots[8]=list(retention);
 let s={...b.s,registry:enc(list(slots))};s=changeDefinition(s,'definition/task-workspace',2n,u(32));
 const rows=items(decode(b.d.orderedInputs),'list'),sample=items(rows.find(v=>key(items(v,'list')[0])===key(signed(22))&&key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 const d={...b.d,orderedInputs:enc(list([...rows,list([signed(18),...sample.slice(1)])]))};
 let captured:readonly BodyRecallDelivery[]=[];
 const make=memoryModule.createEpisodicExtension,spy=vi.spyOn(memoryModule,'createEpisodicExtension').mockImplementation((...args)=>{const x=make(...args);return {...x,observeRehearsal(e,o){if(e.dueAt===19n&&e.phase===40n)captured=x.currentRecalls();return x.observeRehearsal(e,o);}};});
 try{
  const r=await createCharacterRun(await prepareCharacterModel(s),d);await through(r,19n);
  const usedRows=rehearsal(r,19),carried=captured.find(d=>isCarriedCue(d.event.payload))!,others=captured.filter(d=>!isCarriedCue(d.event.payload));
  const borrowed=usedRows.filter(v=>!carried.episodes.some(e=>key(e)===key(v[5])));
  expect(borrowed).toHaveLength(1);expect(items(borrowed[0][5],'list')[5]).toEqual(signed(1));
  expect(others.some(d=>d.episodes.some(v=>key(v)===key(borrowed[0][5])))).toBe(true);
  expect(usedRows.some(v=>key(items(v[5],'list')[5])===key(signed(18)))).toBe(false);
  console.info('M167 OVERLAP PASS same character/workspace: genuine ordinary body recall supplies old1 omitted by carried top8; Supported attribution consumes16 original children, receipt join admits their current delivery union; ordinary new18 earns no rehearsal credit. Native overlap prefix19 only, no final-family capacity claim.');
 }finally{spy.mockRestore();}
},240000);
