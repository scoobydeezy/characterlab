import {beforeAll,it,expect} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalId as id} from '../campaign3/generalBindingProfile';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {list,set,signed,unsigned as u,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {createLocalReserveSource} from '../campaign3/localReserveSource';
import {observeLocalReserveOpportunity} from '../campaign3/localReserveObservation';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {prepareGeneralTerminalBatch} from '../campaign3/generalTerminalBatch';
const who=generalSubject(),path=(root:bigint,key:CanonicalValue):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key}]}),goalPath=path(633n,who.character);
let model:Awaited<ReturnType<typeof compileGeneralDeclarations>>;
beforeAll(async()=>{model=await compileGeneralDeclarations(buildGeneralDeclarationPacket());});
const initial=()=>new AuthoritativeState([{path:path(268n,who.observer),value:r(267,[who.character])},{path:goalPath,value:r(560,[list([])])}]);
const command=(action:number)=>r(677,[who.observer,r(561,[d('goal'),u(action)])]);
it('preflights terminal owner collisions and gives independent owners the same B0',()=>{
 const state=model.initial.build(),seen:CanonicalValue[]=[],tx=model.outputSlots.beginInstant(()=>0n);
 const goal={stage:'goal-command-owner',prepare:(base:AuthoritativeState)=>{seen.push(base.read(goalPath).value!);return model.goals.command(base,command(1),1n);}};
 const graph={stage:'event-association-retention',prepare:(base:AuthoritativeState)=>{seen.push(base.read(goalPath).value!);return model.graphOwners.association(base,tx,undefined,1n);}};
 const prepared=prepareGeneralTerminalBatch(model.state,state,[graph,goal]);expect(seen).toEqual([r(560,[list([])]),r(560,[list([])])]);
 expect(state.read(goalPath).value).toEqual(r(560,[list([])]));const result=prepared.finish();expect(items(f(rec(result.state.read(goalPath).value!,560n),1n),'list')).toHaveLength(1);expect(()=>prepared.finish()).toThrow(/lifecycle/);
 let called=false;const noop=()=>{called=true;return {patch:()=>({operations:[]}),actualReadRecords:()=>[]};};
 expect(()=>prepareGeneralTerminalBatch(model.state,state,[{stage:'goal-command-owner',prepare:noop},{stage:'goal-deadline-owner',prepare:noop}])).toThrow(/collision/);expect(called).toBe(false);
 expect(()=>prepareGeneralTerminalBatch(model.state,state,[{stage:'current-track',prepare:noop}])).toThrow(/stage/);
 expect(()=>prepareGeneralTerminalBatch(model.state,state,[goal,{stage:'event-association-retention',prepare:()=>{throw Error('later owner rejected');}}])).toThrow(/later owner/);expect(state.read(goalPath).value).toEqual(r(560,[list([])]));tx.abort();
});
it('adopts the declared goal and expires it at its exact deadline',()=>{
 let state=initial();const adoption=model.goals.command(state,command(1),1n);expect(adoption.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual([268n,633n]);state=model.state.applyStagePatch('goal-command-owner',state,adoption.patch()).state;
 expect(()=>model.goals.command(state,command(1),1n)).toThrow(/DUPLICATE/);
 const deadline=r(678,[who.observer,d('goal'),signed(1)]);expect(()=>model.goals.deadline(state,deadline,99n)).toThrow(/TIME/);
 const expired=model.goals.deadline(state,deadline,100n);state=model.state.applyStagePatch('goal-deadline-owner',state,expired.patch()).state;
 expect(f(rec(items(f(rec(state.read(goalPath).value!,560n),1n),'list')[0],559n),3n)).toEqual(u(3));model.goals.validateLedger(state.read(goalPath).value!);
});
it('preserves withdrawal at the later deadline and rejects a different adoption association',()=>{
 let state=initial();state=model.state.applyStagePatch('goal-command-owner',state,model.goals.command(state,command(1),1n).patch()).state;
 state=model.state.applyStagePatch('goal-command-owner',state,model.goals.command(state,command(2),3n).patch()).state;
 expect(model.goals.deadline(state,r(678,[who.observer,d('goal'),signed(1)]),100n).patch().operations).toEqual([]);
 expect(()=>model.goals.deadline(state,r(678,[who.observer,d('goal'),signed(0)]),100n)).toThrow(/association/);
});
it('replenishes only its actual target and emits the existing capped exact result',()=>{
 const reserve=r(644,[who.character,id(1044,'local-reserve/A')]),reservePath=path(649n,reserve),state=new AuthoritativeState([{path:reservePath,value:r(454,[q(40,1),signed(0)])}]);
 const result=model.physical.replenish(state,r(651,[reserve,q(80,1)]),2n),output=rec(result.outputs()[0],652n),numeric=rec(f(output,5n),479n);
 expect(result.actualReadRecords().map(r=>r.path)).toEqual([reservePath]);expect(f(numeric,1n)).toEqual(q(38,1));expect(f(numeric,4n)).toEqual(q(18,1));expect(f(numeric,5n)).toEqual(q(100,1));
 const tx=model.outputSlots.beginInstant(()=>{throw Error('no occurrence');});tx.beginStage('local-reserve-replenishment').admit(result.outputs());tx.commit();
 const next=model.state.applyStagePatch('local-reserve-replenishment',state,result.patch()).state;expect(next.read(reservePath).value).toEqual(r(454,[q(100,1),signed(2)]));
 expect(()=>model.state.applyStagePatch('local-reserve-replenishment',next,result.patch())).toThrow();expect(()=>model.state.applyStagePatch('goal-command-owner',state,result.patch())).toThrow(/outside/);
});
it.each([true,false])('joins actual consequence presence=%s without inventing a missing retained baseline',available=>{
 const local=createLocalReserveSource(['A','B','C'].map(n=>({key:'local-reserve/'+n,capacity:Q.of(100n),rate:Q.of(0n),amount:Q.of(20n),anchoredAt:0n})),['A','B','C'].map(n=>({channel:'channel/'+n,physical:'local-reserve/'+n,signal:'interoceptive-signal/'+n,width:Q.of(1n),available,permitted:true})));
 let ordinal=0n;const actual=observeLocalReserveOpportunity(local,who.observer,3n,['channel/A'],'Consequence',()=>ordinal++),request=r(655,[who.observer,r(650,[who.observer,set([id(1005,'channel/A')])]),false,false]);
 const samples=r(656,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,signed(3)],[3n,request],[4n,r(654,[who.observer,signed(3),list(actual.samples),set(actual.declarations.map(d=>r(598,[d.channel,id(1045,d.signal)])))])],...(actual.opportunityId===null?[]:[[8n,typedIdentifier(1106,u(actual.opportunityId))] as [bigint,CanonicalValue]])]));
 const empty=initial(),state=available?model.state.applyStagePatch('goal-command-owner',empty,model.goals.command(empty,command(1),1n).patch()).state:new AuthoritativeState([{path:path(268n,who.observer),value:r(267,[who.character])}]),tx=model.outputSlots.beginInstant(()=>ordinal++),prepared=model.goals.assess(state,tx,{samples,tracking:{tracks:[],perceived:undefined},staged:actual.staged??undefined,claims:[]},[],3n);
 const stage=tx.beginStage('goal-outcome-assessment'),result=prepared.produce(()=>{if(!available)throw Error('no consequence allocation');return (stage.allocate(1146n).payload as {value:bigint}).value;}),receipt=stage.admit(result.outputs),delivery=available?model.outcomeDeliveries.goal(tx,receipt):undefined;tx.commit();
 expect(prepared.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual(available?[268n,633n]:[268n]);expect(result.outputs).toHaveLength(available?1:0);
 if(available){
  expect(f(rec(result.outputs[0],568n),8n)).toEqual(r(567,[u(5)]));expect(()=>delivery!.focal(u(4),3n)).toThrow(/strictly later/);
  const recallTx=model.outputSlots.beginInstant(()=>ordinal++),focus=recallTx.beginStage('focal-consequence-delivery').admit([delivery!.focal(u(4),4n)]),attribution=model.attribution.prepare(state,recallTx,focus,[],4n),attributionStage=recallTx.beginStage('retained-attribution'),outputs=attribution.produce(()=>(attributionStage.allocate(1147n).payload as {value:bigint}).value),attributionReceipt=attributionStage.admit(outputs),attributionDelivery=model.outcomeDeliveries.attribution(recallTx,attributionReceipt);recallTx.commit();
  expect(f(rec(outputs[0],575n),7n)).toEqual(u(2));expect(attribution.actualReadRecords().map(r=>r.path.rootStateTypeId)).toEqual([268n]);
  const joinTx=model.outputSlots.beginInstant(()=>ordinal++),qualification=joinTx.beginStage('goal-qualification-delivery').admit([delivery!.qualification(u(5),5n)]),resultReceipt=joinTx.beginStage('attribution-result-delivery').admit([attributionDelivery.delivery(u(5),5n)]);
  const join=model.outcomeDeliveries.significance(joinTx,qualification,resultReceipt,u(5),5n);expect(join.qualifies).toBe(false);joinTx.beginStage('significance-join').admit(join.outputs);joinTx.commit();
 }else expect(result.carry).toBeUndefined();
});
