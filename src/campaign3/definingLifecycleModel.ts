/** defining-native-lifecycle/0.1-candidate. Internal candidate only; no public factory/save. */
import allocation from '../../docs/formal/DEFINING_LIFECYCLE_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,list,text,unsigned as u} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {compileGeneralModelCandidate,generalCandidateVersions} from './generalModelCandidate';
import {buildGeneralDeclarationPacket} from './generalDeclarations';
import {decodeDefiningLifecycle as decode} from './definingLifecycleCodecs';
import {createDefiningLifecycleRuntime} from './definingLifecycleRuntime';
import {orderingParametersValue} from '../substrate/scheduler';
import {statePathPatternValue} from '../substrate/state';
import {deriveGeneralWorkBudget} from './generalWorkBudget';
import {generalId as id} from './generalBindingProfile';
import {compileDefiningLifecycleState,definingLifecycleStages,definingLifecyclePhase,definingLifecyclePattern} from './definingLifecycleState';
import {definingContinuationProgramBytes,type DefiningContinuationProgram} from './definingContinuationProgram';
export async function createDefiningLifecycleModel(program:DefiningContinuationProgram){
 const predecessor=await compileGeneralModelCandidate(buildGeneralDeclarationPacket('credit-significance-first')),extension=compileDefiningLifecycleState(predecessor.model,program);
 const budget=deriveGeneralWorkBudget(),registration=list(definingLifecycleStages.map(stage=>list([text(stage),id(1001,'event/'+stage),u(definingLifecyclePhase(stage)),text('defining-native-lifecycle/0.1-candidate'),list((stage==='defining-adopt'?[1485]:stage==='defining-report'?[1485,1486]:[]).map(root=>statePathPatternValue(definingLifecyclePattern(root as 1485|1486)))),list((stage==='defining-adopt'?[1485]:stage==='defining-report'?[1486]:[]).map(root=>statePathPatternValue(definingLifecyclePattern(root as 1485|1486))))])));
 const modelIdentity=await createModelIdentity({...generalCandidateVersions,rulesVersion:'defining-native-lifecycle/0.1-candidate',contentManifest:await commitManifest(predecessor.model.contentCommitment().canonicalManifest),registryManifest:await commitManifest(list([decode(predecessor.registryBytes()),text(JSON.stringify(allocation)),registration,decode(extension.model.state.ownershipBytes()),text('only actual acquisition, interpretation adoption/report and inherited deadlines; no meaning/retention/recall continuation')])),parameterSet:await commitManifest(list([decode(predecessor.parameterBytes()),decode(definingContinuationProgramBytes(program)),orderingParametersValue(budget.work+1n),u(budget.outputs),u(budget.slots),extension.model.initial.build().canonicalValue()]))});
 const initialState=enc(extension.model.initial.build().canonicalValue()),originals=createDefiningLifecycleRuntime(predecessor.model,program).originalBytes();
 const runIdentity=await createRunIdentity({modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(originals)),runSeed:new Uint8Array(32)});
 return Object.freeze({modelIdentity,runIdentity,initialState,originals,runtime:createDefiningLifecycleRuntime(predecessor.model,program,{model:modelIdentity.value,run:runIdentity.value})});
}
