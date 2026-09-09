/** Closed ADAPT E resolver/evaluator, adaptation-input/0.31-candidate.
 * Batch preparation admits every capability and detects all targets before projection reads.
 */
import {canonicalEncode,record,set,signed,unsigned,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,ContractReadProjection,actualReadRecordValue,statePathValue,statePatchValue,createStatePatch,mutationDiffValue,type StatePath,type StatePatch,type PatchOperation,type ProjectionBinding,type ActualReadRecord,type StructuralMutationDiff} from '../substrate/state';
import {SchedulerContractError} from '../substrate/scheduler';
import {decodeCampaign2,campaign2Record as r,campaign2SchemaByType} from './codecs';
import {admittedInputFacts,type AdmittedTransitionInput} from './admittedInput';
import {dataRecord as rec,dataField as f,dataUnsigned as u,dataItems as items,dataIdentity as id,dataKey as key} from './canonicalData';
import {decodeStatePattern,type compileCampaign2StateModel} from './stateModel';
import type {compileAdaptationTransitions} from './adaptationTransitions';
import type {compileAdaptationDomains} from './adaptationDomains';

const VERSION='adaptation-input/0.31-candidate';
const accessor=(name:string)=>typedIdentifier(1028n,text(`accessor/adaptation-${name}-prior`));
const completedExecutions=new WeakMap<object,{token:AdmittedTransitionInput;outputs:readonly CanonicalValue[];diffs:readonly StructuralMutationDiff[]}>();
/** Internal fixed-adapter result, authenticated by execution rather than output-shaped data. */
export function adaptationExecutionFacts(result:object){
  const facts=completedExecutions.get(result);if(!facts)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','missing closed ADAPT execution result');
  admittedInputFacts(facts.token);return {token:facts.token,outputs:facts.outputs.map(v=>decodeCampaign2(canonicalEncode(v)))};
}
/** Trace-side evidence from the actual WRT application, available only after the batch succeeds. */
export function adaptationExecutionDiffs(result:object):readonly StructuralMutationDiff[]{
  const facts=completedExecutions.get(result);if(!facts)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','missing completed ADAPT mutation evidence');
  admittedInputFacts(facts.token);return structuredClone(facts.diffs);
}
/** No state, identity, time, registry or trace capability enters the arithmetic function. */
export function countStepWithBaselineGate(count:bigint,step:bigint,prior:bigint,gatePrior?:bigint):bigint {
  return prior+(gatePrior===undefined||gatePrior===0n?count*step:0n);
}
export function compileAdaptationEvaluator(transitions:ReturnType<typeof compileAdaptationTransitions>,domains:ReturnType<typeof compileAdaptationDomains>,stateModel:ReturnType<typeof compileCampaign2StateModel>){
  const registrations=items(decodeCampaign2(transitions.registrationBytes()),'set').map(v=>f(rec(v,171n),4n)).map(key);
  function target(leaf:CanonicalValue,derivation:CanonicalValue,basis:ReturnType<typeof rec>):StatePath {
    const spec=domains.leaf(leaf);if(!spec)throw new SchedulerContractError('INVALID_CONFIGURATION','unknown target leaf');
    const d=rec(derivation,313n),fields=new Map<bigint,CanonicalValue>([[1n,f(basis,1n)]]);
    if(spec.key===292n||spec.key===293n){fields.set(2n,f(basis,2n));fields.set(3n,f(d,2n));}
    else fields.set(2n,spec.key===294n?f(d,2n):spec.key===295n?f(d,3n):f(basis,2n));
    const path:StatePath={rootStateTypeId:spec.root,fieldId:spec.field,selectors:[{kind:'mapKey',key:record(campaign2SchemaByType(spec.key),fields)}]};
    stateModel.validatePath(path);return path;
  }
  return Object.freeze({
    prepare(tokens:readonly AdmittedTransitionInput[],instant:bigint){
      const targets=new Set<string>();
      const executions=tokens.map(token=>{
        const admitted=admittedInputFacts(token),registration=rec(decodeCampaign2(admitted.registration),318n);
        if(!registrations.includes(key(registration))||admitted.event.phase!==140n||admitted.event.dueAt!==instant)throw new SchedulerContractError('INPUT_NOT_ADMITTED','wrong ADAPT execution');
        const input=rec(admitted.payload,307n),extension=rec(f(registration,5n),317n),basis=rec(f(input,2n),u(f(extension,1n))===1n?305n:306n);
        const at=f(input,3n);if(typeof at==='boolean'||at.kind!=='signed'||at.value!==instant)throw new SchedulerContractError('INPUT_NOT_ADMITTED','delayed adaptation input');
        const rules=items(f(rec(f(extension,2n),316n),1n),'set').map(ruleId=>{
          const definition=transitions.ruleDefinition(ruleId);if(!definition)throw new SchedulerContractError('INVALID_CONFIGURATION','missing committed rule');
          const rule=rec(definition,311n),match=rec(f(rule,1n),312n);
          if(key(f(match,u(f(match,1n))===1n?2n:3n))!==key(f(basis,2n)))return undefined;
          const path=target(f(rule,3n),f(rule,4n),basis),gate=rec(f(rule,5n),314n);
          const source=u(f(gate,1n))===2n?rec(f(gate,2n),315n):undefined;
          const gatePath=source?target(f(source,2n),f(source,3n),basis):undefined;
          const pathKey=key(statePathValue(path));if(targets.has(pathKey))throw new SchedulerContractError('ADAPTATION_TARGET_COLLISION','duplicate target across complete phase-140 batch');targets.add(pathKey);
          return {ruleId,rule,path,gatePath};
        }).filter(v=>v!==undefined).sort((a,b)=>key(a.ruleId)<key(b.ruleId)?-1:1);
        return {token,admitted,registration,input,basis,rules};
      }).sort((a,b)=>a.admitted.event.eventSequence<b.admitted.event.eventSequence?-1:1);
      let evaluated=false;
      function begin(frozen:AuthoritativeState){
          if(evaluated)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','batch evaluated twice');evaluated=true;
          const snapshot=new AuthoritativeState(frozen.entries());domains.validateStatic(snapshot);domains.validateReferences(snapshot,instant);
          let candidate=new AuthoritativeState(snapshot.entries());
          let cursor=0,closed=false,active=false;
          const results:ReturnType<typeof executeNext>[]=[];
          const expectations=new Map<object,{paths:StatePath[];roots:bigint[];outputs:Uint8Array[];diffs:string[];reads:string[]}>();
          function executeNext(token:AdmittedTransitionInput,allocator:{allocateRuntimeId():bigint}){
            const execution=executions[cursor];
            if(closed||!execution||execution.token!==token)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','batch event order or multiplicity differs');
            cursor++;
            admittedInputFacts(execution.token); // Recheck liveness before any output allocation or read.
            const definition=rec(f(execution.registration,3n),319n),readDomain=items(f(definition,2n),'set').map(decodeStatePattern);
            const authority=id(f(rec(f(definition,4n),322n),2n)),dispatchId=typedIdentifier(1119n,unsigned(allocator.allocateRuntimeId()));
            const dispatch=r('AdaptationDispatchRecord',{DispatchId:dispatchId,Input:execution.input,ApplicableRules:set(execution.rules.map(v=>v.ruleId)),TransformationVersion:text(VERSION)});
            const reads:ActualReadRecord[]=[],operations:PatchOperation[]=[];
            const evaluations=execution.rules.map(({ruleId,rule,path,gatePath})=>{
              const bindings:Record<string,ProjectionBinding>={target:{kind:'direct',accessorId:accessor('target'),path}};
              if(gatePath)bindings.gate={kind:'direct',accessorId:accessor('gate'),path:gatePath};
              const projection=new ContractReadProjection(snapshot,readDomain,bindings);
              const magnitude=(value:CanonicalValue|undefined)=>value===undefined?0n:(f(rec(value,(value as Extract<CanonicalValue,{kind:'record'}>).schema.typeId),1n) as {value:bigint}).value;
              const prior=projection.read('target'),p=magnitude(prior);domains.validateMagnitude(path,p,instant);
              const gate=gatePath?projection.read('gate'):undefined,g=gatePath?magnitude(gate):undefined;
              if(gatePath)domains.validateMagnitude(gatePath,g!,instant);
              const segment=projection.actualReadRecords();
              const expectedRead=(name:string,path:StatePath,value:CanonicalValue|undefined)=>actualReadRecordValue({accessorId:accessor(name),path,presence:value!==undefined,value,derivedSources:[]});
              const expectedSegment=[expectedRead('target',path,prior),...(gatePath?[expectedRead('gate',gatePath,gate)]:[])].map(key);
              if(JSON.stringify(segment.map(v=>key(actualReadRecordValue(v))))!==JSON.stringify(expectedSegment))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','ADAPT rule read instrumentation differs from target/gate segment');
              reads.push(...segment);
              const step=f(rule,6n) as {value:bigint},q=countStepWithBaselineGate(u(f(execution.basis,3n)),step.value,p,g);
              domains.validateMagnitude(path,q,instant);
              let patch:StatePatch={operations:[]};
              if(q!==p){
                if(q===0n){if(prior===undefined)throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','remove requires a present prior');patch={operations:[{kind:'remove',path,expectedOldValue:prior}]};}
                else{
                  const spec=domains.leaf(f(rule,3n))!;
                  const value=record(campaign2SchemaByType(spec.value),new Map([[1n,spec.value===299n?signed(q):unsigned(q)]]));
                  patch={operations:[{kind:'set',path,expected:prior===undefined?{presence:false}:{presence:true,value:prior},newValue:value}]};
                }
              }
              operations.push(...patch.operations);
              return r('AdaptationEvaluationResult',{EvaluationId:typedIdentifier(1120n,unsigned(allocator.allocateRuntimeId())),DispatchId:dispatchId,RuleId:ruleId,TargetPath:statePathValue(path),
                Prior:r('AdaptationPrior',prior===undefined?{VariantTag:unsigned(1)}:{VariantTag:unsigned(2),Value:prior}),
                Result:r('AdaptationResult',patch.operations.length?{VariantTag:unsigned(2),Patch:statePatchValue(patch)}:{VariantTag:unsigned(1)}),TransformationVersion:text(VERSION)});
            });
            const patch={operations};
            const result={token:execution.token,event:execution.admitted.event,outputs:[dispatch,...evaluations],actualReads:reads.map(actualReadRecordValue),actualReadRecords:reads,readDomain,patch,authority};
            const writable=items(f(rec(f(definition,4n),322n),3n),'set');
            // Construction already resolves these exact two materialized families.
            const roots=writable.map(v=>key(v)===key(typedIdentifier(1031n,text('regulatory-adaptation')))?302n:303n);
            const expectedDiffs=createStatePatch(patch.operations).operations.map(op=>key(mutationDiffValue(op.kind==='set'
              ?{path:op.path,oldPresence:op.expected.presence,oldValue:op.expected.presence?op.expected.value:undefined,newPresence:true,newValue:op.newValue,mutationAuthorityId:authority}
              :{path:op.path,oldPresence:true,oldValue:op.expectedOldValue,newPresence:false,mutationAuthorityId:authority})));
            expectations.set(result,{paths:structuredClone(execution.rules.map(v=>v.path)),roots,outputs:result.outputs.map(canonicalEncode),diffs:expectedDiffs,reads:reads.map(v=>key(actualReadRecordValue(v)))});
            return result;
          }
          return Object.freeze({
            execute(token:AdmittedTransitionInput,allocator:{allocateRuntimeId():bigint}){
              if(active)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','nested ADAPT execution');
              active=true;
              try{const result=executeNext(token,allocator);results.push(result);return result;}
              finally{active=false;}
            },
            finish(){
          if(active||closed||cursor!==executions.length)throw new SchedulerContractError('ADAPTATION_STAGE_VIOLATION','unfinished or repeated batch barrier');closed=true;
          // Barrier: every read/evaluation completed against the unchanged common snapshot.
          const diffs=new Map<object,readonly StructuralMutationDiff[]>();
          for(const result of results){
            const expected=expectations.get(result)!;
            const applied=stateModel.applyPatch(candidate,result.patch,result.authority,{writableRoots:expected.roots,targetPaths:expected.paths});
            if(JSON.stringify(applied.diffs.map(d=>key(mutationDiffValue(d))))!==JSON.stringify(expected.diffs))throw new SchedulerContractError('ADAPTATION_MUTATION_DIFF_VIOLATION','actual diffs differ from staged effective changes');
            if(result.outputs.length!==expected.outputs.length||result.outputs.some((v,i)=>key(v)!==key(decodeCampaign2(expected.outputs[i]))))throw new SchedulerContractError('TRANSITION_OUTPUT_VIOLATION','outputs differ from staged evaluations');
            if(JSON.stringify(result.actualReadRecords.map(v=>key(actualReadRecordValue(v))))!==JSON.stringify(expected.reads)||JSON.stringify(result.actualReads.map(key))!==JSON.stringify(expected.reads))throw new SchedulerContractError('TRACE_VALIDATION_FAILURE','ADAPT read evidence differs from staged rule segments');
            candidate=applied.state;diffs.set(result,applied.diffs);
          }
          try{domains.validateStatic(candidate);}catch(error){throw new SchedulerContractError('STATE_VALIDATION_FAILURE',error instanceof Error?error.message:String(error));}
          domains.validateReferences(candidate,instant);
          for(const result of results)completedExecutions.set(result,{token:result.token,outputs:result.outputs.map(v=>decodeCampaign2(canonicalEncode(v))),diffs:structuredClone(diffs.get(result)!)});
          return {state:candidate,executions:results};
            },
          });
        }
      return Object.freeze({begin, evaluate(frozen:AuthoritativeState,allocator:{allocateRuntimeId():bigint}){
        const batch=begin(frozen);for(const e of executions)batch.execute(e.token,allocator);return batch.finish();
      }});
    },
  });
}
