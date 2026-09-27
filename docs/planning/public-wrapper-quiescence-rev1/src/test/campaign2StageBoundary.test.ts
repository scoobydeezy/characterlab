import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned} from '../substrate/canonicalEncoding';
import {AuthoritativeState,ContractReadProjection} from '../substrate/state';
import * as schedulerModule from '../substrate/scheduler';
import {firstTraceModel} from '../campaign2/firstTraceModel';
import {candidateId as id} from '../campaign2/firstModelCandidate';
import {prepareCampaign2Model,createCampaign2Run} from '../campaign2/factory';
import {campaign2Record as r} from '../campaign2/codecs';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {AUTHORED_FACT_EVENT} from '../campaign2/orderedInputs';

it.each(['ordinary-event','forged-consumer','late-child','input-only-emission','skip-execute','duplicate-execute','valid'])('AC-I phase140 stage boundary: %s',async mode=>{
 const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
 const orderedInputs=enc(list([list([signed(2),unsigned(110),AUTHORED_FACT_EVENT,r('AuthoredActualAdaptationFact',{Fact:r('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:unsigned(1)})}),list([])])]));
 const Original=schedulerModule.DeterministicScheduler;
 let captured:schedulerModule.DeterministicScheduler<AuthoritativeState>|undefined;
 const prepared:bigint[][]=[],executed:bigint[]=[];let finishes=0;
 const spy=vi.spyOn(schedulerModule,'DeterministicScheduler').mockImplementation(function(config:schedulerModule.SchedulerConfiguration<AuthoritativeState>){
  const adapter=config.adaptationSettlement!;let changed=config;
  if(mode==='ordinary-event'||mode==='forged-consumer'){
   const a=config.initialAllocators!,source=config.initialQueue![0];
   const injected={...source,eventId:a.nextEventId,eventSequence:a.nextEventSequence,phase:140n,
    eventTypeId:id(1001,mode==='ordinary-event'?'test/ordinary-phase140':'event/regulatory-adaptation'),payload:unsigned(0)};
   changed={...config,initialQueue:[...config.initialQueue!,injected],initialAllocators:{...a,nextEventId:a.nextEventId+1n,nextEventSequence:a.nextEventSequence+1n}};
  }
  if(mode==='input-only-emission')changed={...changed,handlers:new Map([...config.handlers].map(([name,handler])=>[name,async context=>{
   const result=await handler(context);
   return context.event.phase===110n?{...result,emittedEvents:[...result.emittedEvents,{dueAt:context.instant,phase:110n,eventTypeId:AUTHORED_FACT_EVENT,payload:context.event.payload,dependencies:list([])}]}:result;
  }]))};
  captured=new Original({...changed,adaptationSettlement:{...adapter,prepare(events,state,instant){
   prepared.push(events.map(e=>e.eventId));const batch=adapter.prepare(events,state,instant);
   return {...batch,async execute(context){executed.push(context.event.eventId);
    if(mode==='skip-execute')return {nextState:context.state,outputs:[],emittedEvents:[],traceContributions:[]};
    const result=await batch.execute(context);if(mode==='duplicate-execute')await batch.execute(context);
    return mode==='late-child'?{...result,emittedEvents:[{dueAt:context.instant,phase:140n,eventTypeId:context.event.eventTypeId,payload:context.event.payload,dependencies:list([])}]}:result;
   },finish(){finishes++;return batch.finish();}};
  }}});return captured;
 } as never);
 const reads=vi.spyOn(ContractReadProjection.prototype,'read');
 try{
  const run=await createCampaign2Run(await prepareCampaign2Model(firstTraceModel()),{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),before=captured!.exportQuiescentSnapshot();
  if(mode==='valid'){
   await run.settleNextInstant();expect(prepared).toHaveLength(1);expect(prepared[0]).toHaveLength(1);expect(executed).toEqual(prepared[0]);expect(finishes).toBe(1);expect(reads).toHaveBeenCalledTimes(4);
  }else{
   await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:mode==='forged-consumer'?'INPUT_NOT_ADMITTED':mode==='input-only-emission'?'INPUT_ONLY_EVENT_ORIGIN_VIOLATION':'ADAPTATION_STAGE_VIOLATION'}));
   expect(prepared).toHaveLength(mode==='input-only-emission'?0:1);expect(finishes).toBe(mode==='skip-execute'?1:0);
   if(mode==='late-child'||mode==='duplicate-execute'){expect(executed).toHaveLength(1);expect(reads).toHaveBeenCalledTimes(4);}else{expect(executed).toHaveLength(mode==='skip-execute'?1:0);expect(reads).not.toHaveBeenCalled();}
   const after=captured!.exportQuiescentSnapshot();expect(after.status).toBe('Failed');expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));
   for(const k of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[k]).toEqual(before[k]);
  }
 }finally{reads.mockRestore();spy.mockRestore();}
});
