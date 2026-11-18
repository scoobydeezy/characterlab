import {it,expect,vi} from 'vitest';
import {current,items,key,enc,list,decode} from './fixtures/assembledDefiningControls';
import {C,text,signed,u,exact,rec,f} from './fixtures/assembledDefining';
import {POSITION_USE_RULES,POSITION_USE_REGISTRY,LONG_CLOCK_RULES,LONG_CLOCK_REGISTRY,compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {state,through,finish,reports,report,type Run} from './assembledDefining.test';
import {SPATIAL_MEANING} from '../assembled/goalMeaning';
import {named,directions,SIGNIFICANCE} from '../assembled/significance';
import {POSITION_USE,RECALL,EPISODIC_OWNER,isPositionEpisodePath,assertPositionUseUpdate,creditPositionUse,assertPositionUseConsumer} from '../assembled/memory';
import * as memoryModule from '../assembled/memory';
import {BODY_SAMPLE,BODY_OWNER} from '../assembled/body';
import {POSITION_SOURCE} from '../assembled/positionPerception';
import {RETENTION,retainedEpisodeIds} from '../assembled/retention';
import {retainSignificanceFirst} from '../campaign3/significanceFirstRetention';
import {applyQualifiedUnitUse} from '../campaign3/useProtectedRetention';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent} from '../substrate/scheduler';
// Physical tasks/no people; body30/rate10/width1, seed0. Original four trials,
// goal17, pressure18..30, appearances3998/3999, appraisal4000, full expiry5001.
// Main arms reserve goal Absent, spatial[0,0], only activeFrom1/18 differs.
function fixture(active=1,high=false,barrier=false){
 const b=current(high?'High':'Absent'),slots=[...items(decode(b.s.registry),'list')],spatial=[...items(slots[37],'list')];spatial[2]=u(active);slots[37]=list(spatial);
 const rows=[...items(decode(b.d.orderedInputs),'list')];
 if(barrier)for(const kind of [BODY_SAMPLE,POSITION_SOURCE]){
  const v=rows.find(v=>key(items(v,'list')[2])===key(kind)&&(key(kind)!==key(POSITION_SOURCE)||key(items(v,'list')[0])===key(signed(3998))))!;
  if(!v)throw Error('165 barrier source');rows.push(list([signed(17),...items(v,'list').slice(1)]));
 }
 return {...b,s:{...b.s,rulesVersion:POSITION_USE_RULES,registrySchemaVersion:POSITION_USE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
async function start(active=1,high=false,barrier=false){const b=fixture(active,high,barrier),m=await prepareCharacterModel(b.s);return {b,m,run:await createCharacterRun(m,b.d)};}
const positions=(r:Run)=>state(r).entries().filter(e=>isPositionEpisodePath(e.path));
const at=(r:Run,t:number)=>positions(r).find(e=>key(items(e.value,'list')[5])===key(signed(t)));
const assessment=(r:Run,t:number)=>named(report(r,SPATIAL_MEANING,t)[5],'assessment');
function live4000(r:Run,used:boolean){
 expect(named(assessment(r,4000),'kind')).toEqual(text('Assessed'));
 expect(named(assessment(r,4000),'relation')).toEqual(text(used?'MovingFarther':'SameDistance'));
 const operands=items(report(r,SPATIAL_MEANING,4000)[4],'list').map(v=>items(v,'list')[1]);
 expect(operands.map(v=>items(v,'list')[5])).toEqual([signed(used?2:3998),signed(3999)]);
 for(const v of operands)expect(reports(r,RECALL).some(x=>key(x[1])===key(signed(4000))&&key(x[2])===key(v))).toBe(true);
}
it('use165: actual spatial consumption protects otherwise nonsignificant old memory and changes later appraisal',async()=>{
 const a=await start(),b=await start(18);
 for(const x of [a,b])await through(x.run,17n);
 expect(named(assessment(a.run,17),'kind')).toEqual(text('Assessed'));expect(named(assessment(b.run,17),'kind')).toEqual(text('Unavailable'));
 const old=at(a.run,2)!;
 for(const t of [2,15]){expect(items(at(a.run,t)!.value,'list')[9]).toBe(true);expect(items(at(b.run,t)!.value,'list')[9]).toBe(false);}
 for(const r of [a.run,b.run])for(const t of [2,15])expect(directions(items(at(r,t)!.value,'list')[7])).toEqual([]);
 const used=reports(a.run,POSITION_USE).filter(r=>key(r[1])===key(signed(17)));expect(used).toHaveLength(2);
 expect(reports(b.run,POSITION_USE).filter(r=>key(r[1])===key(signed(17)))).toHaveLength(0);
 for(const row of used){expect(row[4]).toEqual(list(report(a.run,SPATIAL_MEANING,17)));expect(items(row[5],'list')[9]).toBe(false);}
 console.info('M165 LIVE17 active spatial appraisal consumes2/15 -> actual-use receipts; inactive assessment unavailable -> no use; both no significance');
 for(const x of [a,b])await through(x.run,4000n);live4000(a.run,true);live4000(b.run,false);
 expect(items(at(a.run,2)!.value,'list').slice(0,9)).toEqual(items(old.value,'list').slice(0,9));expect(at(b.run,2)).toBeUndefined();expect(at(b.run,15)).toBeUndefined();
 expect(state(a.run).entries().filter(e=>e.path.rootStateTypeId===455n)).toEqual(state(b.run).entries().filter(e=>e.path.rootStateTypeId===455n));
 for(const x of [a,b]){await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);}
 console.info('M165 USE PASS early genuine use -> old2 survives -> actual2/3999 appraisal4000 MovingFarther vs3998/3999 SameDistance; immutable content/equal body; full queues5001');
},590000);
it('continuation165: new positional use survives exact public save17 continuation',async()=>{
 const a=await start();await through(a.run,17n);expect(items(at(a.run,2)!.value,'list')[9]).toBe(true);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 let saw=false;
 for(let n=0;n<192;n++){const more=await a.run.settleNextInstant();expect(await restored.settleNextInstant()).toBe(more);exact(a.run,restored);expect(a.run.runIdentity()).toEqual(restored.runIdentity());
  if(a.run.snapshot().clock===4000n){live4000(a.run,true);live4000(restored,true);saw=true;}
  if(!more){expect(saw).toBe(true);expect(a.run.snapshot().clock).toBe(5001n);console.info('M165 CONTINUATION PASS every later canonical state/output/trace/save/identity through5001');return;}
 }throw Error('165 continuation cap');
},590000);
it('boundaries165: exact original policies, coalesced significance/use, B0 retention and rollback',async()=>{
 // Detached mathematical controls: homogeneous sensory partition maps to the
 // original event partition; no authored metadata is a native qualification.
 for(let sig=0;sig<8;sig++)for(let used=0;used<8;used++)for(let cap=0;cap<=3;cap++){
  const rows=Array.from({length:3},(_,i)=>({acquisition:BigInt(i+1),acquiredAt:1n,kind:'body' as const,significant:!!(sig&(1<<i)),useProtection:!!(used&(1<<i))}));
  const original=rows.map(x=>({id:x.acquisition,acquiredAt:x.acquiredAt,kind:'EventContinuant' as const,units:[{key:'episode',views:[enc(list([]))],useProtection:x.useProtection,outcomeSignificanceDirections:x.significant?['MovingCloser' as const]:[]}]}));
  expect(retainedEpisodeIds(rows,2n,{body:cap,diagnostic:0},'SignificanceFirst')).toEqual(retainSignificanceFirst(original,2n,{EventContinuant:cap,Interoceptive:0}).acquisitions.map(x=>x.id));
 }
 expect(applyQualifiedUnitUse([{id:1n,acquiredAt:1n,kind:'EventContinuant',units:[{key:'episode',views:[enc(list([]))],useProtection:false}]}],[{acquisition:1n,unit:'episode'}],2n)[0].units[0].useProtection).toBe(true);
 let fault=false,hit=false,capture:{event:ScheduledEvent;operands:readonly CanonicalValue[];report:CanonicalValue}|undefined,owner:ReturnType<typeof memoryModule.createEpisodicExtension>|undefined;
 const make=memoryModule.createEpisodicExtension,spy=vi.spyOn(memoryModule,'createEpisodicExtension').mockImplementation((...args)=>{
  const x=make(...args);owner=x;return {...x,qualifyUse(event,operands,report){
   if(operands.some(v=>key(items(v,'list')[0])===key(text('assembled-position-episode/0.1'))))capture=structuredClone({event,operands,report});
   return x.qualifyUse(event,operands,report);
  },prepare(events,B0){const prepared=x.prepare(events,B0);return {...prepared,finish(s){const next=prepared.finish(s);
   if(fault&&events.some(e=>e.dueAt===17n)){const old=next.entries().find(e=>isPositionEpisodePath(e.path)&&key(items(e.value,'list')[5])===key(signed(2)))!,focal=next.entries().find(e=>isPositionEpisodePath(e.path)&&key(items(e.value,'list')[5])===key(signed(15)))!;
    expect(items(old.value,'list')[9]).toBe(true);expect(items(focal.value,'list')[9]).toBe(true);expect(directions(items(focal.value,'list')[7])).toEqual(['MovingCloser']);hit=true;throw Error('165 after coalesced use');
   }return next;}};}};
 });
 try{
  const a=await start(1,true,true);await through(a.run,16n);expect(positions(a.run).every(e=>items(e.value,'list')[9]===false)).toBe(true);
  await through(a.run,17n);const c=capture!;expect(c).toBeDefined();assertPositionUseConsumer(c.event,c.operands,c.report,C);
  const focal=at(a.run,15)!;expect(items(focal.value,'list')[9]).toBe(true);expect(directions(items(focal.value,'list')[7])).toEqual(['MovingCloser']);
  expect(at(a.run,2)).toBeUndefined();
  const oldOperand=c.operands.find(v=>key(items(v,'list')[5])===key(signed(2)))!,oldId=items(oldOperand,'list')[1];
  const retention=report(a.run,RETENTION,17),metadata=items(retention[7],'list').map(v=>items(v,'list'));
  expect(metadata.find(row=>key(row[0])===key((oldId as Extract<CanonicalValue,{kind:'typedIdentifier'}>).payload))?.[1]).toBe(false);
  expect(reports(a.run,SIGNIFICANCE).filter(r=>key(r[1])===key(signed(17)))).toHaveLength(1);
  expect(reports(a.run,POSITION_USE).filter(r=>key(r[1])===key(signed(17)))).toHaveLength(2);
  for(const event of [{...c.event,phase:40n},{...c.event,dueAt:simInstant(18n)}])expect(()=>assertPositionUseConsumer(event,c.operands,c.report,C)).toThrow();
  expect(()=>assertPositionUseConsumer(c.event,c.operands,c.report,typedIdentifier(1002,text('foreign')))).toThrow();
  expect(()=>assertPositionUseConsumer(c.event,c.operands.slice(1),c.report,C)).toThrow();
  expect(()=>assertPositionUseConsumer(c.event,[c.operands[0],c.operands[0]],c.report,C)).toThrow();
  const unconsumed=positions(a.run).find(e=>!c.operands.some(v=>key(items(v,'list')[1])===key(items(e.value,'list')[1])))!;
  expect(()=>assertPositionUseConsumer(c.event,[c.operands[0],unconsumed.value],c.report,C)).toThrow();
  expect(()=>owner!.qualifyUse(c.event,c.operands,c.report)).toThrow('lifecycle');
  const fields=[...items(focal.value,'list')];fields[9]=false;expect(()=>assertPositionUseUpdate(focal.value,list(fields))).toThrow();
  fields[9]=true;fields[5]=signed(14);expect(()=>assertPositionUseUpdate(focal.value,list(fields))).toThrow();
  const cm=await compileCharacterModel(a.b.s),component=await compileCharacterState(cm),foreign=positions(a.run).find(e=>items(e.value,'list')[9]===false)!;
  expect(()=>component.stateModel.applyPatch(state(a.run),{operations:[{kind:'set',path:foreign.path,expected:{presence:true,value:foreign.value},newValue:creditPositionUse(foreign.value)}]},BODY_OWNER)).toThrow();
  const learned=new AuthoritativeState([...restoreAuthoritativeState(decode(a.b.d.initialState)).entries(),focal]);expect(()=>component.initialState(enc(learned.canonicalValue()))).toThrow();
  const old=await compileCharacterState(await compileCharacterModel({...a.b.s,rulesVersion:LONG_CLOCK_RULES,registrySchemaVersion:LONG_CLOCK_REGISTRY}));expect(()=>old.stateModel.validateState(state(a.run))).toThrow('version');
  fault=true;const failed=await createCharacterRun(a.m,a.b.d);await through(failed,16n);const before=failed.snapshot(),save=failed.save();
  await expect(failed.settleNextInstant()).rejects.toThrow('165 after coalesced use');expect(hit).toBe(true);expect({...failed.snapshot(),status:before.status}).toEqual(before);fault=false;
  const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save});await through(restored,17n);exact(a.run,restored);await finish(a.run,[restored]);expect(a.run.snapshot().clock).toBe(5001n);
  console.info('M165 BOUNDARIES PASS256 original policy comparisons, actual coalesced use/significance, B0 loses newly used2, valid source/owner/version negatives, post-write rollback and exact recovered full tail5001');
 }finally{spy.mockRestore();}
},590000);
