import {it,expect,vi} from 'vitest';
import {canonicalEncode as enc,list,set,record,signed,unsigned,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import * as probeModule from '../campaign2/probeExecution';
import {probeModelReviewSource} from '../campaign2/probeModelReview';
import {PROBE_SUCCESSOR_RULES} from '../campaign2/probeSuccessorReview';
import {prepareCampaign2Model,createCampaign2Run,restoreCampaign2Run} from '../campaign2/factory';
import {probeRecord,decodeProbeReview} from '../campaign2/probeCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {campaign2Record as r} from '../campaign2/codecs';
import {PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';

it.each(['extra-learning','replace-with-learning','raw-observation-freeze','truth-freeze'])('PROBE-L output closure rejects %s with no commit',async(mode)=>{
 const compile=probeModule.compileProbeExecution;let reached=false;
 const inject=vi.spyOn(probeModule,'compileProbeExecution').mockImplementation((...args)=>{
  const model=compile(...args);return {...model,begin(instant){const execution=model.begin(instant);let truth:CanonicalValue|undefined,observation:CanonicalValue|undefined;
   return {...execution,execute(...args){const result=execution.execute(...args);
    if(args[0].phase===110n)truth=result.outputs[0];if(args[0].phase===120n)observation=result.outputs[0];
    if(!result.freeze)return result;reached=true;
    if(mode==='raw-observation-freeze'||mode==='truth-freeze')return {...result,freeze:mode==='truth-freeze'?truth:observation};
    const evaluation=r('OutcomeEvaluation',{OutcomeEvaluationId:typedIdentifier(1116,unsigned(999)),ConsequenceExperience:result.freeze,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
    const learning=r('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:typedIdentifier(1117,unsigned(999)),Evaluation:evaluation,TransformationVersion:text('character-learning-evidence/0.5-candidate')});
    return {...result,outputs:mode==='extra-learning'?[...result.outputs,learning]:[learning]};
   }};
  }};
 });
 try{
  const model=await prepareCampaign2Model({...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES}),run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs:enc(list([list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])])),runSeed:new Uint8Array(32)}),before=run.snapshot();
  await expect(run.settleNextInstant()).rejects.toThrow();expect(reached).toBe(true);
  const after=run.snapshot();for(const k of ['clock','state','outputs','trace'] as const)expect(after[k]).toEqual(before[k]);
 }finally{inject.mockRestore();}
});

it('PROBE-L/K archive cannot add untraced learning or assign it to the probe freeze producer',async()=>{
 const source={...probeModelReviewSource(),rulesVersion:PROBE_SUCCESSOR_RULES},model=await prepareCampaign2Model(source);
 const orderedInputs=enc(list([list([signed(4),unsigned(110),PROBE_SOURCE_EVENT,probeRecord(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])]));
 const run=await createCampaign2Run(model,{initialState:enc(set([])),orderedInputs,runSeed:new Uint8Array(32)});await run.settleNextInstant();
 const save=rec(decodeProbeReview(run.save()),132n),outputs=items(f(save,12n),'list'),traces=items(f(save,11n),'list'),learning=outputs.at(-1)!;
 const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('fixture');return record(v.schema,new Map([...v.fields,[n,x]]));};
 await expect(restoreCampaign2Run(source,{orderedInputs,save:enc(replace(save,12n,list([...outputs,learning])))})).rejects.toThrow();
 const changed=traces.map(t=>{const trace=rec(t,160n),event=rec(f(trace,4n),130n),phase=f(event,3n);return typeof phase!=='boolean'&&phase.kind==='unsigned'&&phase.value===124n?replace(trace,13n,learning):trace;});
 const changedOutputs=changed.flatMap(t=>{const v=f(rec(t,160n),13n);return typeof v!=='boolean'&&v.kind==='list'?[...v.items]:[v];});
 await expect(restoreCampaign2Run(source,{orderedInputs,save:enc(replace(replace(save,11n,list(changed)),12n,list(changedOutputs)))})).rejects.toThrow();
 const restored=await restoreCampaign2Run(source,{orderedInputs,save:run.save()});expect(restored.save()).toEqual(run.save());
});
