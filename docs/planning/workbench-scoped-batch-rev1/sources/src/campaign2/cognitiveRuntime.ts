/** Trusted composition for task-cognitive-path/0.1-candidate.
 * No public factory or save/restore qualification is implied by this constructor.
 */
import {compileCampaign2Parameters} from './modelPackaging';
import {compileCognitiveIngress} from './cognitiveIngress';
import {createCognitiveExecution} from './cognitiveExecution';
import {createAdaptationRuntime} from './adaptationRuntime';
import type {compileCognitiveModel} from './cognitiveModel';
import type {compileCognitiveState} from './cognitiveState';
import type {compileOrderedInputProfile} from './orderedInputs';
import type {AuthoritativeState} from '../substrate/state';

export function createCognitiveRuntime(model:Awaited<ReturnType<typeof compileCognitiveModel>>,component:Awaited<ReturnType<typeof compileCognitiveState>>,inputs:Awaited<ReturnType<ReturnType<typeof compileOrderedInputProfile>['create']>>,initialState:AuthoritativeState){
 const base=component.prior.base,ingress=compileCognitiveIngress(model,component),stateModel=component.stateModel,content=model.content;
 const memory=Object.freeze({...component.prior.memoryComponent,stateModel,content});
 const prediction=Object.freeze({...component.prior,stateModel,content,memoryComponent:memory});
 const task=Object.freeze({base,content,stateModel,tasks:component.tasks,measurement:component.measurement,deadline:component.deadline,predictionComponent:prediction});
 const parameters=compileCampaign2Parameters(model.source.parameterSchemaVersion,model.source.parameters);
 const cognitive=createCognitiveExecution(model,component,inputs);
 const runtime=createAdaptationRuntime(inputs,initialState,ingress.admission,ingress.evaluator,base.domains,stateModel,parameters.maxWork,undefined,undefined,base.probe,base.measurement,memory,[],prediction,[],task,[],cognitive);
 return Object.freeze({...runtime,committedRandomAddressKeys:()=>cognitive.committedRandomAddressKeys()});
}
