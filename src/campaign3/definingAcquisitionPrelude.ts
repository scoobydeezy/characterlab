/** defining-acquisition-prelude/0.1-candidate. Internal, empty-S0 acquisition only. */
import {canonicalEncode as enc,list,text,unsigned as u} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {compileGeneralModelCandidate,generalCandidateVersions} from './generalModelCandidate';
import {buildGeneralDeclarationPacket} from './generalDeclarations';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {generalBindingContext} from './generalBindingProfile';
import {createDefiningAcquisitionRuntime} from './definingAcquisitionRuntime';
export async function createDefiningAcquisitionPrelude(){
 const predecessor=await compileGeneralModelCandidate(buildGeneralDeclarationPacket('credit-significance-first')),context=generalBindingContext();
 const modelIdentity=await createModelIdentity({...generalCandidateVersions,rulesVersion:'defining-acquisition-prelude/0.1-candidate',
  contentManifest:await commitManifest(predecessor.model.contentCommitment().canonicalManifest),
  registryManifest:await commitManifest(decode(predecessor.registryBytes(),context)),
  parameterSet:await commitManifest(list([decode(predecessor.parameterBytes(),context),text('native source cutoff; no future emissions past37'),u(37)]))});
 const initialState=enc(predecessor.model.initial.build().canonicalValue()),originals=createDefiningAcquisitionRuntime(predecessor.model).originalBytes();
 const runIdentity=await createRunIdentity({modelIdentity,initialState:await commitManifest(decode(initialState,context)),orderedInputSequence:await commitManifest(decode(originals,context)),runSeed:new Uint8Array(32)});
 const runtime=createDefiningAcquisitionRuntime(predecessor.model,{model:modelIdentity.value,run:runIdentity.value});
 return Object.freeze({modelIdentity,runIdentity,initialState:initialState.slice(),originals:originals.slice(),runtime});
}
