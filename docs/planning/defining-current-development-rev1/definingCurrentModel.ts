/** defining-native-current-assessment/0.1-candidate. Internal candidate only; no public factory/save. */
import lifecycleAllocation from '../../docs/formal/DEFINING_LIFECYCLE_ALLOCATION_TABLE.json';
import currentAllocation from '../../docs/formal/DEFINING_CURRENT_ASSESSMENT_ALLOCATION_TABLE.json';
import allocation from '../../docs/formal/DEFINING_MEMORY_OWNER_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,list,text,unsigned as u} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {compileGeneralModelCandidate,generalCandidateVersions} from './generalModelCandidate';
import {buildGeneralDeclarationPacket} from './generalDeclarations';
import {decodeDefiningCurrent as decode} from './definingCurrentCodecs';
import {createDefiningCurrentRuntime} from './definingCurrentRuntime';
import {orderingParametersValue} from '../substrate/scheduler';
import {definingMemoryPath} from './definingMemoryOwner';
import {statePathPatternValue} from '../substrate/state';
import {deriveGeneralWorkBudget} from './generalWorkBudget';
import {generalId as id,generalSubject} from './generalBindingProfile';
import {compileDefiningLifecycleState,definingLifecycleStages,definingLifecyclePhase,definingLifecyclePattern} from './definingLifecycleState';
import {definingContinuationProgramBytes,type DefiningContinuationProgram} from './definingContinuationProgram';
export async function createDefiningCurrentModel(program:DefiningContinuationProgram){
 const predecessor=await compileGeneralModelCandidate(buildGeneralDeclarationPacket('credit-significance-first')),extension=compileDefiningLifecycleState(predecessor.model,program);
 const budget=deriveGeneralWorkBudget(),registration=list(definingLifecycleStages.map(stage=>list([text(stage),id(1001,'event/'+stage),u(definingLifecyclePhase(stage)),text('defining-native-lifecycle/0.1-candidate'),list((stage==='defining-adopt'?[1485]:stage==='defining-report'?[1485,1486]:[]).map(root=>statePathPatternValue(definingLifecyclePattern(root as 1485|1486)))),list((stage==='defining-adopt'?[1485]:stage==='defining-report'?[1486]:[]).map(root=>statePathPatternValue(definingLifecyclePattern(root as 1485|1486))))])));
 const modelIdentity=await createModelIdentity({...generalCandidateVersions,rulesVersion:'defining-native-current-assessment/0.1-candidate',contentManifest:await commitManifest(predecessor.model.contentCommitment().canonicalManifest),registryManifest:await commitManifest(list([decode(predecessor.registryBytes()),text(JSON.stringify(allocation)),text(JSON.stringify(currentAllocation)),text(JSON.stringify(lifecycleAllocation)),registration,decode(extension.model.state.ownershipBytes()),text('actual attribution delivery37 to meaning38, credit38/140, retention42/140; actual meaning delivery43/125 and current assessment43/130; no rehearsal/final recall'),list([['defining-meaning-opportunity',0,[ ],[]],['defining-meaning',130,[1485,630],[]],['defining-credit',140,[630,632],[630,632]],['defining-retention',140,[630,632],[630,632]],['defining-current-delivery',125,[],[]],['defining-current-assessment',130,[1485,1486],[]]].map(([stage,phase,reads,writes])=>list([text(stage as string),u(phase as number),list((reads as number[]).map(root=>statePathPatternValue({...{rootStateTypeId:BigInt(root),fieldId:1n,selectors:[{kind:'mapKey' as const,key:generalSubject().character}]},selectors:[{kind:'mapKey' as const,key:generalSubject().character}].map(selector=>({kind:'exact',selector}))}))),list((writes as number[]).map(root=>u(root)))])))])),parameterSet:await commitManifest(list([decode(predecessor.parameterBytes()),decode(definingContinuationProgramBytes(program)),orderingParametersValue(budget.work+3n),u(budget.outputs+1n),u(budget.slots+1n),extension.model.initial.build().canonicalValue()]))});
 const initialState=enc(extension.model.initial.build().canonicalValue()),originals=createDefiningCurrentRuntime(predecessor.model,program).originalBytes();
 const runIdentity=await createRunIdentity({modelIdentity,initialState:await commitManifest(decode(initialState)),orderedInputSequence:await commitManifest(decode(originals)),runSeed:new Uint8Array(32)});
 return Object.freeze({modelIdentity,runIdentity,initialState,originals,runtime:createDefiningCurrentRuntime(predecessor.model,program,{model:modelIdentity.value,run:runIdentity.value})});
}
