/** defining-native-lifecycle/0.1-candidate. Internal candidate only; no public factory/save. */
import allocation from '../../docs/formal/DEFINING_LIFECYCLE_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,list,text} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {compileGeneralModelCandidate,generalCandidateVersions} from './generalModelCandidate';
import {buildGeneralDeclarationPacket} from './generalDeclarations';
import {decodeDefiningLifecycle as decode} from './definingLifecycleCodecs';
import {createDefiningLifecycleRuntime} from './definingLifecycleRuntime';
import {compileDefiningLifecycleState} from './definingLifecycleState';
import {definingContinuationProgramBytes,type DefiningContinuationProgram} from './definingContinuationProgram';
export async function createDefiningLifecycleModel(program:DefiningContinuationProgram){
 const predecessor=await compileGeneralModelCandidate(buildGeneralDeclarationPacket('credit-significance-first')),extension=compileDefiningLifecycleState(predecessor.model,program);
 const modelIdentity=await createModelIdentity({...generalCandidateVersions,rulesVersion:'defining-native-lifecycle/0.1-candidate',contentManifest:await commitManifest(predecessor.model.contentCommitment().canonicalManifest),registryManifest:await commitManifest(list([decode(predecessor.registryBytes()),text(JSON.stringify(allocation)),decode(extension.model.state.ownershipBytes()),text('only actual acquisition, interpretation adoption/report and inherited deadlines; no meaning/retention/recall continuation')])),parameterSet:await commitManifest(list([decode(predecessor.parameterBytes()),decode(definingContinuationProgramBytes(program))]))});
 const initialState=enc(extension.model.initial.build().canonicalValue()),originals=createDefiningLifecycleRuntime(predecessor.model,program).originalBytes();
 const runIdentity=await createRunIdentity({modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(originals)),runSeed:new Uint8Array(32)});
 return Object.freeze({modelIdentity,runIdentity,initialState,originals,runtime:createDefiningLifecycleRuntime(predecessor.model,program,{model:modelIdentity.value,run:runIdentity.value})});
}
