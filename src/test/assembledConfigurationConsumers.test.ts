import {describe,it,expect} from 'vitest';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {compileStrategy,display,DISPLAY} from '../assembled/strategy';
import {compileActionBody} from '../assembled/actionBody';
import {compileSocial} from '../assembled/social';
import {priorityDisplay,PRIORITY,PRIORITY_DISPLAY} from '../assembled/priority';
import {horizonDisplay,HORIZON,HORIZON_DISPLAY} from '../assembled/horizon';
import {performanceSetting,PERFORMANCE} from '../assembled/performance';
import {createStrategyExecution} from '../assembled/strategyExecution';
import {createPriorityExecution} from '../assembled/priorityExecution';
import {createHorizonExecution} from '../assembled/horizonExecution';
import {ExactRational as Q} from '../substrate/exactMath';
import {unsigned,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';
import type {ScheduledEvent,EventHandlerContext} from '../substrate/scheduler';
import type {AuthoritativeState} from '../substrate/state';
import {source,data} from './fixtures/assembledComparison';
import {configurationSource,configurationData,decode,items,rec,f,key,list,replace} from './fixtures/assembledConfiguration';
import {C} from './fixtures/campaign2Cognitive';
const declaration=()=>{const s=configurationSource(),slots=items(decode(s.registry),'list'),rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),routes=compileStrategy(slots[12],rows,decode(s.content));return {s,slots,rows,routes,tasks:routes.map(r=>r.task)};};
describe('M21b complete consumer domains',()=>{
 it('requires complete strategy/body mappings and admits three-task priority/horizon/feedback/social',()=>{
  const {s,slots,rows,routes,tasks}=declaration();expect(routes).toHaveLength(3);
  expect(()=>compileStrategy(list([items(slots[12],'list')[0],list(items(items(slots[12],'list')[1],'list').slice(0,2))]),rows,decode(s.content))).toThrow('complete');
  const actions=rows.filter(v=>key(f(rec(v,171n),2n))===key({kind:'typedIdentifier',namespaceId:1023n,payload:text('registry/protocol-action')})).map(v=>({action:f(rec(v,171n),1n),definition:f(rec(v,171n),4n)}));
  expect(compileActionBody(slots[10],Q.of(100n),actions).entries).toHaveLength(3);
  expect(()=>compileActionBody(slots[10],Q.of(100n),actions.slice(0,2))).toThrow('coverage');
  expect(compileSocial(slots[19],routes).tasks).toHaveLength(3);
  const frames=items(decode(configurationData().orderedInputs),'list');expect(display(items(frames.find(v=>key(items(v,'list')[2])===key(DISPLAY))!,'list')[3],1n,routes)).toHaveLength(6);
  expect(priorityDisplay(list([text(PRIORITY),list(tasks.map(t=>list([t,list([]),false,list([]),false])))]),1n,tasks)).toHaveLength(3);
  expect(horizonDisplay(list([text(HORIZON),list(tasks.map(t=>list([t,list([]),false])))]),1n,tasks)).toHaveLength(3);
  expect(performanceSetting(list([text(PERFORMANCE),list(tasks.map(t=>list([t,false,unsigned(0)])))]),routes)).toHaveLength(3);
 });
 it('reserves all declared projection slots regardless of visibility or absent rows',async()=>{
  const {routes,tasks}=declaration(),m=await compileCharacterModel(source()),c=await compileCharacterState(m),d=data(true,0),inputs=await compileCharacterInputs(m,c,d),state=c.initialState(d.initialState);
  const strategy=items(decode(configurationData().orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(DISPLAY))!;
  for(const kind of ['strategy','priority','horizon'] as const)for(const variant of ['visible','hidden','absent'] as const){
   const payload=kind==='strategy'?items(strategy,'list')[3]:kind==='priority'?list([text(PRIORITY),list(tasks.map(t=>list([t,list([]),true,list([]),true])))]):list([text(HORIZON),list(tasks.map(t=>list([t,list([]),true])))]);
   const x=items(payload,'list'),rows=items(x[1],'list'),changed=list([x[0],list(variant==='absent'?[]:rows.map(v=>{const r=[...items(v,'list')];if(variant==='hidden'){if(kind==='strategy')r[6]=false;else if(kind==='priority'){r[2]=false;r[4]=false;}else r[2]=false;}return list(r);} ))]);
   const event:ScheduledEvent={eventId:1n,eventSequence:1n,dueAt:simInstant(1n),phase:kind==='strategy'?30n:10n,eventTypeId:kind==='strategy'?DISPLAY:kind==='priority'?PRIORITY_DISPLAY:HORIZON_DISPLAY,payload:changed,dependencies:list([]),causalParentEventIds:[]};
   const adapter=kind==='strategy'?createStrategyExecution(C,routes,c.stateModel,[event],m.modelIdentity.value,inputs.runIdentity.value):kind==='priority'?createPriorityExecution(C,tasks,c.stateModel,[event],m.modelIdentity.value,inputs.runIdentity.value):createHorizonExecution(C,tasks,c.stateModel,[event],m.modelIdentity.value,inputs.runIdentity.value);
   let allocated=0;const context=(event:ScheduledEvent)=>({event,state,instant:simInstant(1n),allocateRuntimeId:()=>BigInt(100+allocated++)}) as EventHandlerContext<AuthoritativeState>;
   adapter.begin(1n);const first=adapter.execute(context(event)),child={...first.emittedEvents[0],eventId:2n,eventSequence:2n,causalParentEventIds:[1n]};first.traceFactory([child]);const projected=adapter.execute(context(child));
   expect(allocated).toBe(kind==='strategy'?6:3);expect(projected.outputs).toHaveLength(variant==='absent'||kind==='strategy'&&variant==='hidden'?0:kind==='strategy'?6:3);adapter.close();
  }
 },30000);
});
