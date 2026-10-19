/** character-learning-evidence/0.5-candidate semantic transformation.
 * Scheduler state, events, admission tokens and registry objects remain host-side.
 */
import {text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {StateContractError} from '../substrate/state';
import {campaign2Record} from './codecs';

type EvidOperands=Readonly<{evaluation:boolean;payload:CanonicalValue;occurrence:CanonicalValue}>;

/** Internal adapter boundary: only detached admitted data and its allocated output ID enter. */
export function evidOperands(evaluation:boolean,payload:CanonicalValue,occurrence:CanonicalValue):EvidOperands {
 const data=Object.freeze(Object.assign(Object.create(null) as EvidOperands,{evaluation,payload,occurrence}));
 return new Proxy(data,{get(target,property){
  if(!Object.hasOwn(target,property))throw new StateContractError('ILLEGAL_READ','EVID operand capability does not expose the requested field');
  return Reflect.get(target,property);
 }});
}

export function executeEvid(input:EvidOperands):CanonicalValue {
 const version=text('character-learning-evidence/0.5-candidate');
 return input.evaluation
  ?campaign2Record('OutcomeEvaluation',{OutcomeEvaluationId:input.occurrence,ConsequenceExperience:input.payload,TransformationVersion:version})
  :campaign2Record('OutcomeLearningEvidence',{OutcomeLearningEvidenceId:input.occurrence,Evaluation:input.payload,TransformationVersion:version});
}
