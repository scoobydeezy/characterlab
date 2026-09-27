/** Exact candidate packaging; no public activation or frozen-model admission.
 * All code-owned calibration, ownership, inherited declarations and budgets
 * participate in identity. Frozen prior model families are never modified. */
import {canonicalEncode as enc,list,text,unsigned as u} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {orderingParametersValue} from '../substrate/scheduler';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {generalBindingContext} from './generalBindingProfile';
import {compileGeneralDeclarations,type GeneralDeclarationPacket} from './generalDeclarations';
import {deriveGeneralWorkBudget} from './generalWorkBudget';
export const generalCandidateVersions=Object.freeze({rulesVersion:'rules/campaign3-general-attention/0.1-candidate',registrySchemaVersion:'registry/campaign3-general-attention/0.1-candidate',contentSchemaVersion:'content/0.2-candidate',parameterSchemaVersion:'parameters/campaign3-general-attention/0.1-candidate',numericProfileVersion:'numeric/campaign3-general-attention/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION});
export async function compileGeneralModelCandidate(packet:GeneralDeclarationPacket){
 const model=await compileGeneralDeclarations(packet),context=generalBindingContext(),budget=deriveGeneralWorkBudget();
 const registry=list([model.declarationBytes('definitions'),model.declarationBytes('roles'),model.declarationBytes('registrations'),model.inheritedSource.definitionBytes(),model.state.ownershipBytes()].map(b=>decode(b,context)));
 const parameters=list([orderingParametersValue(budget.work),u(budget.outputs),u(budget.slots),text('general-attention-trace-binding/0.1-candidate'),text('general-attention-complete-prefix/0.1-candidate'),list([text('required-initial-state'),model.initial.build().canonicalValue()])]);
 const identity=await createModelIdentity({...generalCandidateVersions,contentManifest:await commitManifest(model.contentCommitment().canonicalManifest),registryManifest:await commitManifest(registry),parameterSet:await commitManifest(parameters)});
 return Object.freeze({model,identity,registryBytes:()=>enc(registry),parameterBytes:()=>enc(parameters),
  async runIdentity(orderedInputs:Uint8Array,seed:Uint8Array){return createRunIdentity({modelIdentity:identity,initialState:await commitManifest(model.initial.build().canonicalValue()),orderedInputSequence:await commitManifest(decode(orderedInputs.slice(),context)),runSeed:seed.slice()});},
 });
}
