/** assembled-character-model/0.1-candidate: invariant admission, no recipe lookup.
 * The imported declarations fix topology only; named numeric slots are open domains. */
import registryHex from '../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import contentHex from '../../docs/planning/campaign2-task-cognitive-model/content.cenc.hex?raw';
import {canonicalEncode as enc,list,set,record,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {createModelIdentity,commitManifest} from '../substrate/identity';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {snapshotMemorySource} from '../campaign2/memoryModel';
import {compileCognitiveDeclarations} from '../campaign2/cognitiveDeclarations';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {compileCampaign2Parameters} from '../campaign2/modelPackaging';
import {decodeCognitive,cognitiveSchemaByType} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataIdentity as id,dataText as txt,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import type {Campaign2ModelSource} from '../campaign2/factory';

import {decodeEmbodied} from '../campaign3/embodiedCodecs';
import {compileHorizon} from './horizon';
import {compilePriority} from './priority';
import {compileStrategy} from './strategy';
import {compileSkill} from './skill';
import {compileActionBody} from './actionBody';
import {compileRetrievalDeclaration} from './retrieval';
import {compileRetentionDeclaration} from './retention';
import {compileBodyDeclaration} from './body';
export const HORIZON_RULES='rules/assembled-character/0.14-candidate';
export const HORIZON_REGISTRY='assembled-character-registry/0.14-candidate';
export const PRIORITY_RULES='rules/assembled-character/0.13-candidate';
export const PRIORITY_REGISTRY='assembled-character-registry/0.13-candidate';
export const STRATEGY_RULES='rules/assembled-character/0.12-candidate';
export const STRATEGY_REGISTRY='assembled-character-registry/0.12-candidate';
export const SKILL_RULES='rules/assembled-character/0.11-candidate';
export const SKILL_REGISTRY='assembled-character-registry/0.11-candidate';
export const ACTION_BODY_RULES='rules/assembled-character/0.10-candidate';
export const ACTION_BODY_REGISTRY='assembled-character-registry/0.10-candidate';
export const MEMORY_CONTEXT_RULES='rules/assembled-character/0.9-candidate';
export const MEMORY_CONTEXT_REGISTRY='assembled-character-registry/0.9-candidate';
export const WORKSPACE_RULES='rules/assembled-character/0.8-candidate';
export const WORKSPACE_REGISTRY='assembled-character-registry/0.8-candidate';
export const RETRIEVAL_RULES='rules/assembled-character/0.7-candidate';
export const RETRIEVAL_REGISTRY='assembled-character-registry/0.7-candidate';
export const RETENTION_RULES='rules/assembled-character/0.6-candidate';
export const RETENTION_REGISTRY='assembled-character-registry/0.6-candidate';
export const MEMORY_RULES='rules/assembled-character/0.5-candidate';
export const MEMORY_REGISTRY='assembled-character-registry/0.5-candidate';
export const ATTENTION_RULES='rules/assembled-character/0.4-candidate';
export const ATTENTION_REGISTRY='assembled-character-registry/0.4-candidate';
export const CALIBRATED_RULES='rules/assembled-character/0.3-candidate';
export const CALIBRATED_REGISTRY='assembled-character-registry/0.3-candidate';
export const INTERACTION_RULES='rules/assembled-character/0.2-candidate';
export const INTERACTION_REGISTRY='assembled-character-registry/0.2-candidate';
export const CHARACTER_RULES='rules/assembled-character/0.1-candidate';
export const CHARACTER_REGISTRY='assembled-character-registry/0.1-candidate';
const hex=(s:string)=>Uint8Array.from(s.trim().match(/../g)!.map(v=>parseInt(v,16)));
const fields:Readonly<Record<string,readonly bigint[]>>={
 'definition/task-a':[3n,4n,5n,6n], 'definition/task-b':[3n,4n,5n,6n],
 'definition/task-workspace':[2n], 'definition/task-concern':[1n], 'definition/task-motive':[1n],
};
function rationalRange(v:CanonicalValue,name:string,lo:bigint,hi:bigint,strict=false){
 if(typeof v==='boolean'||v.kind!=='rational'||(strict?v.numerator<=lo*v.denominator:v.numerator<lo*v.denominator)||v.numerator>hi*v.denominator)invalidModel(name+' outside exact rational domain');
}
function topology(registry:CanonicalValue,calibrated=false,memoryContext=false){
 const slots=items(registry,'list');if(slots.length!==6)invalidModel('six assembled registry slots required');
 const normalized=items(slots[0],'set').map(v=>{
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;
  const stable=id(f(v,1n));if(stable.namespaceId!==1027n||typeof stable.payload==='boolean'||stable.payload.kind!=='text')return v;
  const name=txt(stable.payload),open=Object.hasOwn(fields,name)?fields[name]:undefined;
  if(calibrated&&name==='definition/task-reason-dice'){
   const dice=rec(f(v,4n),437n),context=rec(f(dice,4n),439n);
   if(key(f(context,1n))!==key(rational(1,10)))invalidModel('calibrated context unit must be exactly 1/10');
   // Comparison image only: the executed and committed registry retains 1/10.
   const normalizedContext=record(context.schema,new Map([...context.fields].map(([n,x])=>[n,n===1n?rational(1,1):x])));
   const normalizedDice=record(dice.schema,new Map([...dice.fields].map(([n,x])=>[n,n===4n?normalizedContext:x])));
   return record(v.schema,new Map([...v.fields].map(([n,x])=>[n,n===4n?normalizedDice:x])));
  }
  if(!open)return v;
  const d=rec(f(v,4n),name==='definition/task-workspace'?378n:name==='definition/task-concern'?385n:name==='definition/task-motive'?392n:370n);
  if(d.schema.typeId===370n){
   const lo=f(d,3n),hi=f(d,4n);rationalRange(lo,'task minimum',0n,10n);rationalRange(hi,'task maximum',0n,10n);
   if(typeof lo==='boolean'||lo.kind!=='rational'||typeof hi==='boolean'||hi.kind!=='rational')invalidModel('task rational required');
   if(lo.numerator*hi.denominator>hi.numerator*lo.denominator)invalidModel('task minimum exceeds maximum');
   const a=f(d,5n),b=f(d,6n);if(typeof a==='boolean'||a.kind!=='signed'||typeof b==='boolean'||b.kind!=='signed'||a.value<0n||b.value<=a.value)invalidModel('task window requires 0 <= activation < deadline');
  }else if(d.schema.typeId===378n){if(uint(f(d,2n))>(memoryContext?4n:3n))invalidModel('workspace capacity outside '+(memoryContext?'0..4':'0..3'));}
  else rationalRange(f(d,1n),d.schema.typeId===385n?'concern gain':'motive pressure',0n,1n,d.schema.typeId===392n);
  // This internal comparison image is never decoded/executed/committed: mask ONLY
  // the validated open slots; all remaining declared fields must match exactly.
  const body=record(d.schema,new Map([...d.fields].map(([n,x])=>[n,open.includes(n)?false:x])));
  return record(v.schema,new Map([...v.fields].map(([n,x])=>[n,n===4n?body:x])));
 });
 return list(slots.map((v,i)=>i===0?set(normalized):v));
}
export async function compileCharacterModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input);
 const horizon=source.rulesVersion===HORIZON_RULES,priority=horizon||source.rulesVersion===PRIORITY_RULES,strategyEnabled=priority||source.rulesVersion===STRATEGY_RULES,skill=strategyEnabled||source.rulesVersion===SKILL_RULES,actionBodyEnabled=skill||source.rulesVersion===ACTION_BODY_RULES,memoryContext=actionBodyEnabled||source.rulesVersion===MEMORY_CONTEXT_RULES,workspace=memoryContext||source.rulesVersion===WORKSPACE_RULES,retrievalEnabled=workspace||source.rulesVersion===RETRIEVAL_RULES,retained=retrievalEnabled||source.rulesVersion===RETENTION_RULES,memory=retained||source.rulesVersion===MEMORY_RULES,attention=memory||source.rulesVersion===ATTENTION_RULES,calibrated=attention||source.rulesVersion===CALIBRATED_RULES,interaction=calibrated||source.rulesVersion===INTERACTION_RULES;
 if((interaction?source.registrySchemaVersion!==(horizon?HORIZON_REGISTRY:priority?PRIORITY_REGISTRY:strategyEnabled?STRATEGY_REGISTRY:skill?SKILL_REGISTRY:actionBodyEnabled?ACTION_BODY_REGISTRY:memoryContext?MEMORY_CONTEXT_REGISTRY:workspace?WORKSPACE_REGISTRY:retrievalEnabled?RETRIEVAL_REGISTRY:retained?RETENTION_REGISTRY:memory?MEMORY_REGISTRY:attention?ATTENTION_REGISTRY:calibrated?CALIBRATED_REGISTRY:INTERACTION_REGISTRY):source.rulesVersion!==CHARACTER_RULES||source.registrySchemaVersion!==CHARACTER_REGISTRY)||source.contentSchemaVersion!=='content/0.2-candidate'||source.parameterSchemaVersion!=='campaign2-parameters/0.1-candidate'||source.numericProfileVersion!=='numeric/task-cognitive-exact/0.1-candidate'||source.randomAlgorithmVersion!==RANDOM_ALGORITHM_VERSION)invalidModel('unsupported assembled model version bundle');
 const registry=decodeEmbodied(source.registry),allSlots=items(registry,'list');
 if(allSlots.length!==(horizon?15:priority?14:strategyEnabled?13:skill?12:actionBodyEnabled?11:retrievalEnabled?10:retained?9:attention?8:interaction?7:6))invalidModel('assembled registry slot count');
 if(skill)compileSkill(allSlots[11]);
 if(priority)compilePriority(allSlots[13]);
 if(horizon)compileHorizon(allSlots[14]);
 const retrieval=retrievalEnabled?compileRetrievalDeclaration(allSlots[9]):undefined;
 const retention=retained?compileRetentionDeclaration(allSlots[8]):undefined;
 let selectionCapacity:number|undefined;
 if(attention){const declaration=items(allSlots[7],'list');if(declaration.length!==2||txt(declaration[0])!=='assembled-body-selection/0.1'||uint(declaration[1])>1n)invalidModel('body selection requires capacity0..1');selectionCapacity=Number(uint(declaration[1]));}
 const body=interaction?Object.freeze({...compileBodyDeclaration(allSlots[6]),selectionCapacity}):undefined,slots=allSlots.slice(0,6),baseRegistry=enc(list(slots));
 // Validate open slots before generic declarations, giving specific domain errors.
 const shape=topology(list(slots),calibrated,memoryContext);
 const content=await compileCognitiveDeclarations(source.content,baseRegistry);
 const structuralState=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,{decode:decodeCognitive,schema:cognitiveSchemaByType});
 compileCampaign2Parameters(source.parameterSchemaVersion,source.parameters);
 if(key(decodeCognitive(source.content))!==key(decodeCognitive(hex(contentHex))))invalidModel('content outside declared assembled holder/task topology');
 if(key(shape)!==key(topology(decodeCognitive(hex(registryHex)))))invalidModel('undeclared topology change: references, schemas, phases, ownership and producers are fixed');
 const strategy=strategyEnabled?compileStrategy(allSlots[12],items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decodeCognitive(source.content)):undefined;
 const actionBody=actionBodyEnabled?compileActionBody(allSlots[10],body!.capacity,items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,2n))===key({kind:'typedIdentifier',namespaceId:1023n,payload:{kind:'text',value:'registry/protocol-action'}})).map(v=>({action:f(rec(v,171n),1n),definition:f(rec(v,171n),4n)}))):undefined;
 const modelIdentity=await createModelIdentity({...source,contentManifest:await commitManifest(decodeCognitive(source.content)),registryManifest:await commitManifest(registry),parameterSet:await commitManifest(decodeCognitive(source.parameters))});
 return Object.freeze({source,modelIdentity,content,structuralState,body,baseRegistry,memory,retention,retrieval,workspace,memoryContext,actionBody,skill,strategy,priority,horizon});
}
