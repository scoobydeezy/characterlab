import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,signed,unsigned,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import * as probeModule from '../campaign2/probeExecution';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {probeRecord,decodeProbeReview} from '../campaign2/probeCodecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
const entry=(at:number)=>list([signed(at),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])]);
function replace(v:CanonicalValue,n:bigint,x:CanonicalValue){const r=rec(v,typeof v!=='boolean'&&v.kind==='record'?v.schema.typeId:0n);return record(r.schema,new Map([...r.fields,[n,x]]));}

it('PROBE-P public restore requires exact original future probes; no schedule/cancel surface',async()=>{
 const source={...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES},model=await prepareCampaign2Model(source),orderedInputs=enc(list([entry(4),entry(8)]));
 const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});
 for(const name of ['schedule','scheduleEvent','cancel','cancelEvent','allocateRuntimeId'])expect(Object.hasOwn(run,name)).toBe(false);
 await run.settleNextInstant();const bytes=run.save(),save=rec(decodeProbeReview(bytes),132n),queue=items(f(save,7n),'list');expect(queue).toHaveLength(1);
 const future=queue[0];
 for(const altered of [list([]),list([future,future]),list([replace(future,2n,signed(9))]),list([replace(future,4n,unsigned(90))]),list([replace(future,8n,list([unsigned(0)]))]),list([replace(future,6n,probeRecord(333,[typedIdentifier(1027,text('definition/forged'))]))])]){
  await expect(restoreCampaign2Run(source,{orderedInputs,save:enc(replace(save,7n,altered))})).rejects.toThrow();
 }
 await expect(restoreCampaign2Run(source,{orderedInputs:enc(list([entry(4),entry(9)])),save:bytes})).rejects.toThrow();
 const restored=await restoreCampaign2Run(source,{orderedInputs,save:bytes});await restored.settleNextInstant();await run.settleNextInstant();expect(restored.save()).toEqual(run.save());
});

it('PROBE-P handler cannot emit another InputOnly source; rejection precedes commit',async()=>{
 const compile=probeModule.compileProbeExecution;
 const inject=vi.spyOn(probeModule,'compileProbeExecution').mockImplementation((...args)=>{
  const model=compile(...args);return {...model,begin(instant){const execution=model.begin(instant);return {...execution,execute(...args){const result=execution.execute(...args);return {...result,plan:{...result.plan,emissions:()=>[{dueAt:args[0].dueAt,phase:110n,eventTypeId:PROBE_SOURCE_EVENT,payload:probeRecord(333,[model.definitionId]),dependencies:list([])}]}};}};}};
 });
 try{
  const model=await prepareCampaign2Model({...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES}),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([entry(4)])),runSeed:new Uint8Array(32)}),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toMatchObject({code:'INPUT_ONLY_EVENT_ORIGIN_VIOLATION'});
  const after=run.snapshot();for(const k of ['clock','state','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);
 }finally{inject.mockRestore();}
});
