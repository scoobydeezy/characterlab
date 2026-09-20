/** Frozen first-profile public GA ingress. No caller resolver, state adapter,
 * stage callback, forged original or unfrozen calibration crosses this surface. */
import freeze from '../../docs/planning/campaign3-general-attention-model-rev2/FREEZE.json';
import {dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {SaveContractError} from '../substrate/persistence';
import {buildGeneralDeclarationPacket,type GeneralDeclarationPacket} from './generalDeclarations';
import {compileGeneralModelCandidate,generalCandidateVersions} from './generalModelCandidate';
import {createGeneralSourceRuntime} from './generalSourceRuntime';
import {createGeneralCandidateRun,restoreGeneralCandidateRun} from './generalCandidateRun';
import {generalDataFields,generalDataBytes} from './generalDataOnly';
declare const brand:unique symbol;
export interface GeneralAttentionModel {readonly [brand]:true;}
type Candidate=Awaited<ReturnType<typeof compileGeneralModelCandidate>>;
const prepared=new WeakMap<object,Candidate>();
const same=(a:Uint8Array,b:Uint8Array)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
function candidate(token:GeneralAttentionModel){return prepared.get(token)??fail('GA prepared frozen model required');}
export function generalAttentionModelSource(recipe:string):GeneralDeclarationPacket{
 if(!freeze.models.some(m=>m.name===recipe))fail('GA model outside frozen cohort');return buildGeneralDeclarationPacket(recipe);
}
export async function prepareGeneralAttentionModel(input:GeneralDeclarationPacket):Promise<GeneralAttentionModel>{
 const fields=generalDataFields(input,['recipe','content','definitions','roles','registrations']),recipe=fields.recipe.value;
 if(typeof recipe!=='string'||!freeze.models.some(m=>m.name===recipe))fail('GA model outside frozen cohort');
 const packet={recipe,content:generalDataBytes(fields.content.value),definitions:generalDataBytes(fields.definitions.value),roles:generalDataBytes(fields.roles.value),registrations:generalDataBytes(fields.registrations.value)};
 for(const [name,value] of Object.entries(freeze.versions))if(generalCandidateVersions[name as keyof typeof generalCandidateVersions]!==value)fail('GA frozen version bundle');
 const model=await compileGeneralModelCandidate(packet),image=freeze.models.find(m=>m.name===recipe)!;
 if(key(model.identity.value)!==image.modelIdentity)fail('GA model commitment outside frozen cohort');
 const token=Object.freeze({}) as GeneralAttentionModel;prepared.set(token,model);return token;
}
export const generalAttentionModelIdentity=(token:GeneralAttentionModel)=>candidate(token).identity.canonicalBytes.slice();
export const generalAttentionInitialState=(token:GeneralAttentionModel)=>candidate(token).model.initial.bytes();
export const generalAttentionOrderedInputs=(token:GeneralAttentionModel)=>createGeneralSourceRuntime(candidate(token).model).originalBytes();
function runData(input:unknown,last:'runSeed'|'save'){
 const fields=generalDataFields(input,['initialState','orderedInputs',last]);return {initialState:generalDataBytes(fields.initialState.value),orderedInputs:generalDataBytes(fields.orderedInputs.value),last:generalDataBytes(fields[last].value)};
}
function admitOriginals(model:Candidate,data:ReturnType<typeof runData>){
 if(!same(data.initialState,model.model.initial.bytes()))fail('GA required original S0 differs');
 if(!same(data.orderedInputs,createGeneralSourceRuntime(model.model).originalBytes()))fail('GA ordered original calendar differs');
}
export async function createGeneralAttentionRun(token:GeneralAttentionModel,input:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}){
 const model=candidate(token),data=runData(input,'runSeed');admitOriginals(model,data);return createGeneralCandidateRun(model,data.last);
}
export async function restoreGeneralAttentionRun(source:GeneralDeclarationPacket,input:{initialState:Uint8Array;orderedInputs:Uint8Array;save:Uint8Array}){
 try{const data=runData(input,'save'),token=await prepareGeneralAttentionModel(source),model=candidate(token);admitOriginals(model,data);return await restoreGeneralCandidateRun(model,data.last);}
 catch(error){if(error instanceof SaveContractError)throw error;throw new SaveContractError(error instanceof Error?error.message:String(error));}
}
