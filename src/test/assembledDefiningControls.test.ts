import {it,expect,vi} from 'vitest';
import {fixture,foundation,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,u} from './fixtures/assembledDefining';
import {foundationRun,goalStatus,episodes,start,through,finish,state,focal,report,reports,live17,live4000,type Run} from './assembledDefining.test';
import {createCharacterRun,prepareCharacterModel,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,VIVID_RULES,VIVID_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileGoalMeaning,readGoalValue,validateGoalChange,goalBootstrap,GOAL_MEANING,SPATIAL_MEANING,GOAL_EXPIRE,goalMeaningPath} from '../assembled/goalMeaning';
import * as meaning from '../assembled/goalMeaning';
import {ExactRational as Q} from '../substrate/exactMath';
import {named,directions,SIGNIFICANCE} from '../assembled/significance';
import {RECALL,isPositionEpisodePath} from '../assembled/memory';
import {fixture as legacy} from './fixtures/assembledFamiliarity';
import {MAINTENANCE_HORIZON_RULES,MAINTENANCE_HORIZON_REGISTRY} from '../assembled/model';
it('admission157: expiry is explicit versioned configuration and existing deadlines remain101',async()=>{
 for(const spatial of [false,true]){
  const tag=spatial?SPATIAL_MEANING:GOAL_MEANING,a=[text(tag),list([q(0,1),q(1,1)]),u(1),text('BothDirections'),...(spatial?[u(1)]:[])],old=compileGoalMeaning(list(a),Q.of(100n),tag);
  expect(old.expiresAt).toBe(101n);expect(goalBootstrap(old,1n,1n).map(e=>e.dueAt)).toEqual([1n,101n]);
  expect(()=>compileGoalMeaning(list([...a,u(5001)]),Q.of(100n),tag)).toThrow('declaration');
  for(const expiry of [0,1,1000001])expect(()=>compileGoalMeaning(list([...a,u(expiry)]),Q.of(100n),tag,true)).toThrow('expiry');
  const extended=compileGoalMeaning(list([...a,u(5001)]),Q.of(100n),tag,true);expect(goalBootstrap(extended,1n,1n).map(e=>e.dueAt)).toEqual([1n,5001n]);
  const open=list([text(tag),C,q(0,1),q(1,1),u(1),u(1),u(5001),text('Open'),u(1)]),expired=list([text(tag),C,q(0,1),q(1,1),u(1),u(1),u(5001),text('Expired'),u(5001)]);expect(readGoalValue(open,C,extended).status).toBe('Open');expect(()=>readGoalValue(list(items(open,'list').map((v,i)=>i===6?u(101):v)),C,extended)).toThrow('immutable');expect(()=>validateGoalChange(expired,open,C,extended)).toThrow('lifecycle');
 }
 const b=fixture();await expect(compileCharacterModel({...b.s,rulesVersion:VIVID_RULES,registrySchemaVersion:VIVID_REGISTRY})).rejects.toThrow('declaration');
 console.info('M157 ADMISSION PASS old-version rejection, expiry bounds, both bootstrap deadlines, omitted default101.');
});
it('preservation157: default horizon retains predecessor state and outputs at every settlement',async()=>{
 const b=legacy(),s={...b.s,rulesVersion:VIVID_RULES,registrySchemaVersion:VIVID_REGISTRY},next={...s,rulesVersion:MAINTENANCE_HORIZON_RULES,registrySchemaVersion:MAINTENANCE_HORIZON_REGISTRY};
 const a=await createCharacterRun(await prepareCharacterModel(s),b.d),z=await createCharacterRun(await prepareCharacterModel(next),b.d);
 for(let n=0;n<192;n++){const more=await a.settleNextInstant();expect(await z.settleNextInstant()).toBe(more);const x=a.snapshot(),y=z.snapshot();expect(x.clock).toBe(y.clock);bytes(x.state,y.state);bytes(x.outputs,y.outputs);if(!more){expect(x.clock).toBeGreaterThanOrEqual(101n);console.info('M157 PRESERVATION PASS0.116/0.117 default101 every settled state/output through full queues.');return;}}throw Error('M157 preservation cap');
},540000);
it('continuation157: repeat and both early/late saves preserve each later canonical boundary',async()=>{
 const a=await foundationRun(),repeat=await createCharacterRun(a.model,a.b.d);await through(a.run,5n);await through(repeat,5n);exact(a.run,repeat);
 const early=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,early);
 for(let n=0;a.run.snapshot().clock<101n;n++){expect(n).toBeLessThan(192);const more=await a.run.settleNextInstant();expect(more).toBe(true);for(const p of [repeat,early]){expect(await p.settleNextInstant()).toBe(more);exact(a.run,p);}}
 expect(a.run.snapshot().clock).toBe(101n);const late=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,late);
 await finish(a.run,[repeat,early,late]);expect(goalStatus(a.run)).toEqual(text('Expired'));expect(a.run.snapshot().clock).toBe(5001n);
 console.info('M157 CONTINUATION PASS independent repeat/save5/save101 every later state/output/trace/save/identity through expiry5001.');
},540000);
it('rollback157: real extended deadline transition is atomic and old history survives expiry',async()=>{
 const b=foundation(),model=await prepareCharacterModel(b.s),make=meaning.createGoalMeaning;let hit=false;
 const spy=vi.spyOn(meaning,'createGoalMeaning').mockImplementation((...args)=>{const owner=make(...args);return {...owner,extend(base){const composed=owner.extend(base);return {...composed,prepare(events,B0){const stage=composed.prepare(events,B0);return {...stage,finish(s){const next=stage.finish(s);if(events.some(e=>e.dueAt===5001n&&key(e.eventTypeId)===key(GOAL_EXPIRE))){const row=next.read(goalMeaningPath(C));expect(row.presence).toBe(true);expect(items(row.value!,'list')[7]).toEqual(text('Expired'));hit=true;throw Error('M157 after actual expiry');}return next;}};}};}};});
 let save:Uint8Array|undefined;let source:Run|undefined;
 try{source=await createCharacterRun(model,b.d);for(let n=0;n<192;n++){const before=source.snapshot();save=source.save();try{const more=await source.settleNextInstant();if(!more)break;}catch(e){expect(String(e)).toContain('M157 after actual expiry');expect(hit).toBe(true);expect({...source.snapshot(),status:before.status}).toEqual(before);break;}}expect(hit).toBe(true);}finally{spy.mockRestore();}
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:save!}),old=episodes(restored);await finish(restored);expect(episodes(restored)).toEqual(old);expect(items(state(restored).read(goalMeaningPath(C)).value!,'list')[7]).toEqual(text('Expired'));expect(items(state(restored).read(goalMeaningPath(C,true)).value!,'list')[7]).toEqual(text('Expired'));
 const clean=await createCharacterRun(model,b.d);await finish(clean);exact(clean,restored);
 console.info('M157 ROLLBACK PASS after actual extended expiry whole instant restored; acquired history unchanged by deadline; recovery reaches both Expired goals.');
},540000);
