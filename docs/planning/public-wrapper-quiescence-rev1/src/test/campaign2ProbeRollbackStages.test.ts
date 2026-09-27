import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import * as traceModule from '../substrate/trace';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {probeRecord} from '../campaign2/probeCodecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';

const cases=([false,true] as const).flatMap(a=>([false,true] as const).flatMap(p=>Array.from({length:8},(_,slot)=>({a,p,slot}))));
it.each(cases)('PROBE-K stage $slot rollback; available=$a permitted=$p',async({a,p,slot})=>{
 const source={...probeModelReviewSource(a,p),rulesVersion:PROBE_SUCCESSOR_RULES},model=await prepareCampaign2Model(source);
 const orderedInputs=enc(list([list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])]));
 const original=runtimeModule.createAdaptationRuntime,trace=traceModule.traceRecordValue;
 let captured:ReturnType<typeof original>|undefined,visited=0;
 const capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{captured=original(...args);return captured;});
 const inject=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(value=>{if(visited++===slot)throw Error('injected probe stage trace failure');return trace(value);});
 let saveBefore:Uint8Array|undefined;
 try{
  const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),before=captured!.snapshot();saveBefore=run.save();
  await expect(run.settleNextInstant()).rejects.toMatchObject({code:'TRACE_VALIDATION_FAILURE'});
  expect(visited).toBe(slot+1);const after=captured!.snapshot();expect(after.status).toBe('Failed');
  for(const k of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[k]).toEqual(before[k]);
  expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(()=>run.save()).toThrow();
 }finally{inject.mockRestore();capture.mockRestore();}
 // A pre-failure save still admits the entire original opportunity, with no burned identities.
 const resumed=await restoreCampaign2Run(source,{orderedInputs,save:saveBefore!});
 const clean=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});
 await resumed.settleNextInstant();await clean.settleNextInstant();expect(resumed.save()).toEqual(clean.save());
});
