import {it,expect} from 'vitest';
import {admitObservationLane,validateSuccessfulExperienceSettlement} from '../semanticBinding/phaseOrdering';
import {DeterministicScheduler,type EventHandler,type StateAdapter} from '../substrate/scheduler';
import {bytesToHex,canonicalEncode,list,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {simInstant} from '../substrate/time';

it('distinguishes the retained assertion false-positive from an orphan-envelope rollback',async()=>{
 interface State{readonly value:bigint}
 const adapter:StateAdapter<State>={clone:s=>({...s}),validate:s=>{if(typeof s.value!=='bigint')throw Error('invalid phase fixture state');},canonicalValue:s=>list([text(String(s.value))])};
 const outcomes=[];
 for(const expectedId of [8950n,70n]){
  let reachedValidation=false,validationCode:string|undefined,allocated:bigint|undefined;
  const eventType=typedIdentifier(33002n,text('event/reservation-failure'));
  const handler:EventHandler<State>=({state,allocateRuntimeId})=>{
   const reservation=admitObservationLane({observerId:'observer/mina',lane:'Current',dueAt:1n,emitsCharacterAccessibleEvidence:true},allocateRuntimeId).reservation!;
   allocated=reservation.experienceId;
   // Literal original assertion retained in the8950 arm to expose the old false positive.
   expect(reservation.experienceId).toBe(expectedId);
   reachedValidation=true;
   try{validateSuccessfulExperienceSettlement([reservation],[]);}catch(e){validationCode=(e as {code?:string}).code;throw e;}
   return {nextState:state,emittedEvents:[],traceContributions:[],outputs:[]};
  };
  const scheduler=new DeterministicScheduler({initialState:{value:0n},stateAdapter:adapter,handlers:new Map([[bytesToHex(canonicalEncode(eventType)),handler]]),maxSettlementWorkPerSimulationInstant:20n,initialAllocators:{nextRuntimeId:70n,nextEventId:0n,nextEventSequence:0n}});
  scheduler.schedule({dueAt:simInstant(1n),phase:10n,eventTypeId:eventType,payload:list([]),dependencies:list([])});
  const before=scheduler.exportQuiescentSnapshot();let failure:{code:string;message:string}|undefined;try{await scheduler.settleNextInstant();}catch(e){failure={code:(e as {code:string}).code,message:(e as Error).message};}
  const after=scheduler.exportQuiescentSnapshot();expect(failure?.code).toBe('TRANSITION_FAILURE');expect(after.state).toEqual(before.state);expect(after.allocators).toEqual(before.allocators);expect(after.committedTrace).toEqual(before.committedTrace);expect(after.outputs).toEqual(before.outputs);expect(after.status).toBe('Failed');outcomes.push({expectedId,allocated,reachedValidation,validationCode,failure});
 }
 expect(outcomes[0]).toMatchObject({allocated:70n,reachedValidation:false,validationCode:undefined});expect(outcomes[0].failure?.message).toContain('8950n');
 expect(outcomes[1]).toMatchObject({allocated:70n,reachedValidation:true,validationCode:'ORPHAN_EXPERIENCE_RESERVATION',failure:{code:'TRANSITION_FAILURE',message:'successful instant contains a reservation without exactly one experience envelope'}});
});
