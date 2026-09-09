import {it,expect,vi} from 'vitest';
import * as schedulerModule from '../substrate/scheduler';
import {AuthoritativeState} from '../substrate/state';
import {canonicalEncode as enc,list,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {predictionModelReviewSource} from '../campaign2/predictionModelReview';
import {predictionRecord as r} from '../campaign2/predictionCodecs';
import {preparePredictionModel,createPredictionRun} from '../campaign2/predictionFactory';
const id=(n:number,s:string)=>typedIdentifier(n,text(s));
it.each(['valid','premature-finish','reentrant-finish','skip','duplicate','late','mixed','unmatched'] as const)('PRED-I/N actual pair lifecycle: %s',async mode=>{
 const Original=schedulerModule.DeterministicScheduler;let captured:schedulerModule.DeterministicScheduler<AuthoritativeState>|undefined;
 const spy=vi.spyOn(schedulerModule,'DeterministicScheduler').mockImplementation(function(config:schedulerModule.SchedulerConfiguration<AuthoritativeState>){
  const adapter=config.adaptationSettlement!;
  captured=new Original({...config,adaptationSettlement:{...adapter,prepare(events,state,instant){
   const batch=adapter.prepare(mode==='mixed'?[...events,{...events[0],eventId:999n,eventTypeId:id(1001,'event/regulatory-adaptation')}]:mode==='unmatched'?[events[0]]:events,state,instant);
   if(mode==='premature-finish')batch.finish();
   return {...batch,async execute(context){
    if(mode==='skip')return {nextState:context.state,outputs:[],emittedEvents:[],traceContributions:[]};
    const read=mode==='reentrant-finish'?vi.spyOn(AuthoritativeState.prototype,'read').mockImplementationOnce(()=>{batch.finish();throw Error('reentrant finish was accepted');}):undefined;
    try{const result=await batch.execute(context);if(mode==='duplicate')await batch.execute(context);return mode==='late'?{...result,emittedEvents:[{dueAt:context.instant,phase:140n,eventTypeId:context.event.eventTypeId,payload:context.event.payload,dependencies:list([])}]}:result;}finally{read?.mockRestore();}
   }};
  }}});return captured;
 } as never);
 try{const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject')),initial=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])}]);
  const run=await createPredictionRun(await preparePredictionModel(predictionModelReviewSource()),{initialState:enc(initial.canonicalValue()),orderedInputs:enc(list([list([signed(4),unsigned(110),id(1001,'event/regulatory-diagnostic-probe'),r(333,[id(1027,'definition/regulatory-diagnostic-probe')]),list([])])])),runSeed:new Uint8Array(32)}),before=captured!.exportQuiescentSnapshot();
  if(mode==='valid'){await run.settleNextInstant();expect(captured!.exportQuiescentSnapshot().state.entries()).toHaveLength(3);}
  else{await expect(run.settleNextInstant()).rejects.toThrowError(expect.objectContaining({code:mode==='late'?'ADAPTATION_STAGE_VIOLATION':'PREDICTION_STAGE_VIOLATION'}));const after=captured!.exportQuiescentSnapshot();expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));for(const k of ['allocators','queue','outputs','committedTrace','clock'] as const)expect(after[k]).toEqual(before[k]);}
 }finally{spy.mockRestore();}
},20000);
