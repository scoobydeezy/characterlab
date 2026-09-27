import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,signed,unsigned,text,typedIdentifier} from '../substrate/canonicalEncoding';
import * as probeModule from '../campaign2/probeExecution';
import * as runtimeModule from '../campaign2/adaptationRuntime';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {probeRecord} from '../campaign2/probeCodecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
const cases=([false,true] as const).flatMap(a=>([false,true] as const).flatMap(p=>Array.from({length:a&&p?3:5},(_,ordinal)=>({a,p,ordinal}))));
it.each(cases)('PROBE-K allocation $ordinal throws after advance; available=$a permitted=$p',async({a,p,ordinal})=>{
 const compile=probeModule.compileProbeExecution,original=runtimeModule.createAdaptationRuntime;
 let captured:ReturnType<typeof original>|undefined,advances=0;
 const capture=vi.spyOn(runtimeModule,'createAdaptationRuntime').mockImplementation((...args)=>{captured=original(...args);return captured;});
 const inject=vi.spyOn(probeModule,'compileProbeExecution').mockImplementation((...args)=>{
  const model=compile(...args);return {...model,begin(instant){const execution=model.begin(instant);return {...execution,execute(event,state,allocator){return execution.execute(event,state,{allocateRuntimeId(){const value=allocator.allocateRuntimeId();if(advances++===ordinal)throw Error('injected failure after working allocator advance');return value;}});}};}};
 });
 const source={...probeModelReviewSource(a,p),rulesVersion:PROBE_SUCCESSOR_RULES};
 const orderedInputs=enc(list([list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])]));
 let checkpoint:Uint8Array|undefined;
 try{
  const model=await prepareCampaign2Model(source),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)}),before=captured!.snapshot();checkpoint=run.save();
  await expect(run.settleNextInstant()).rejects.toThrow();expect(advances).toBe(ordinal+1);
  const after=captured!.snapshot();expect(after.status).toBe('Failed');
  for(const k of ['clock','queue','allocators','outputs','committedTrace'] as const)expect(after[k]).toEqual(before[k]);
  expect(enc(after.state.canonicalValue())).toEqual(enc(before.state.canonicalValue()));expect(()=>run.save()).toThrow();
 }finally{inject.mockRestore();capture.mockRestore();}
 const recovered=await restoreCampaign2Run(source,{orderedInputs,save:checkpoint!}),clean=await createCampaign2Run(await prepareCampaign2Model(source),{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});
 await recovered.settleNextInstant();await clean.settleNextInstant();expect(recovered.save()).toEqual(clean.save());
});
