/** attention-public-declarations/0.1-candidate: closed frozen cohort and observer-only content. */
import freeze from '../../docs/planning/campaign3-attention-model-rev2/FREEZE.json';
import allocation from '../../docs/formal/ATTENTION_ALLOCATION_TABLE.json';
import {canonicalEncode as enc,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {compileGovernedContentManifest,type GovernedContentInput} from '../substrate/contentManifest';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {StateContractError,type StatePath} from '../substrate/state';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {compileOccurrenceIdentities} from '../campaign2/occurrenceIdentity';
import {snapshotMemorySource} from '../campaign2/memoryModel';
import type {Campaign2ModelSource} from '../campaign2/factory';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as text,dataKey as key,dataUnsigned as u,invalidModel as fail} from '../campaign2/canonicalData';
import {decodeAttention as decode,attentionSchema as schema} from './attentionCodecs';
export async function compileAttentionModel(input:Campaign2ModelSource){
 const source=snapshotMemorySource(input);for(const [k,v]of Object.entries(freeze.versions))if(source[k as keyof typeof freeze.versions]!==v)fail('attention version bundle');
 const registry=decode(source.registry),slots=items(registry,'list'),contentValue=decode(source.content),parameters=decode(source.parameters);
 const identity=await createModelIdentity({...source,registryManifest:await commitManifest(registry),contentManifest:await commitManifest(contentValue),parameterSet:await commitManifest(parameters)}),approved=freeze.models.find(m=>m.modelIdentity===key(identity.value));if(!approved)fail('model outside frozen attention cohort');
 const rows=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)),definitions=new Map(rows.filter(r=>{const p=id(f(r,1n)).payload;return typeof p!=='boolean'&&p.kind==='text';}).map(r=>[text(id(f(r,1n)).payload),f(r,4n)]));
 const definition=(name:string)=>decode(enc(definitions.get(name)??fail('missing attention definition')));
 const constraints=items(slots[5],'set').map(v=>rec(v,265n));
 function checkRole(value:CanonicalValue,role:CanonicalValue){const r=rec(role,263n);if(r.fields.has(2n))fail('attention has no role domain validators');if(id(value).namespaceId!==u(f(r,1n)))throw new StateContractError('CANONICAL_ROLE_VIOLATION','attention required namespace');if(id(value).namespaceId===1002n)validateSemanticReferent(value);}
 function recordRoles(value:CanonicalValue):void{if(typeof value==='boolean')return;if(value.kind==='record'){for(const constraint of constraints){const p=rec(f(constraint,1n),264n);if(u(f(p,1n))===1n&&u(f(p,2n))===value.schema.typeId){const operand=value.fields.get(u(f(p,4n)));if(operand!==undefined)checkRole(operand,f(constraint,2n));}}for(const v of value.fields.values())recordRoles(v);}else if(value.kind==='list'||value.kind==='set')value.items.forEach(recordRoles);else if(value.kind==='map')for(const [a,b]of value.entries){recordRoles(a);recordRoles(b);}}
 const roleAt=(tag:bigint,type:bigint,field:bigint)=>{const row=constraints.find(r=>{const p=rec(f(r,1n),264n);return u(f(p,1n))===tag&&u(f(p,tag===1n?2n:3n))===type&&u(f(p,4n))===field;});return row?enc(f(row,2n)):undefined;};
 const contentRows=items(contentValue,'set').map(v=>rec(v,170n));if(contentRows.length!==3)fail('three source objects required');
 const inputs:GovernedContentInput[]=contentRows.map(v=>{if(!['a','b','c'].some(p=>text(id(f(v,1n)).payload)==='content/attention-port-'+p)||text(id(f(v,2n)).payload)!=='semantic-kind/attention-scene-object')fail('scene object content');for(let n=3n;n<=16n;n++)if(items(f(v,n),'list').length)fail('closed empty scene object fields');return {stableId:id(f(v,1n)),semanticKind:id(f(v,2n)),declaredInputs:f(v,3n),declaredOutputs:f(v,4n),preconditions:f(v,5n),worldEffects:f(v,6n),unitsDomainsBounds:f(v,7n),epistemicVisibility:f(v,8n),observationAffordances:f(v,9n),lifecycle:f(v,10n),referencedRegistryIds:[],referencedContentIds:[],validationInvariants:f(v,13n),sourceProvenance:f(v,14n),changeHistory:f(v,15n),formalSeamMappings:f(v,16n)};});
 const commitment=await compileGovernedContentManifest(inputs,rows.map(r=>id(f(r,1n))),[{semanticKindId:inputs[0].semanticKind,validate:()=>{}}]);
 if(key(commitment.canonicalManifest)!==key(contentValue))fail('content commitment mismatch');
 const content=Object.freeze({...commitment,qualifyCharacter:(_value:CanonicalValue):never=>fail('attention has no character qualification'),validateRecordRoles:(bytes:Uint8Array)=>recordRoles(decode(bytes)),recordRole:(type:bigint,field:bigint)=>roleAt(1n,type,field),mapKeyRole:(root:bigint,field:bigint)=>roleAt(2n,root,field),validateRole:(value:Uint8Array,role:Uint8Array)=>checkRole(decode(value),decode(role))});
 recordRoles(registry);const state=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,{decode,schema}),occurrences=compileOccurrenceIdentities(enc(f(rec(definition('definition/transition-admission'),279n),3n)),content,{decode,schema});
 const registrations=rows.map(r=>f(r,4n)).filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===541n).map(v=>rec(v,541n));if(registrations.length!==10)fail('ten attention stages required');
 const stages=new Map(registrations.map(r=>[Number(u(f(r,1n))),r]));
 function validatePath(path:StatePath){if(![241n,242n].includes(path.rootStateTypeId)||![1n,2n].includes(path.fieldId))fail('attention state root/field');const selector=path.selectors[0];if(path.selectors.length!==1||selector.kind!=='mapKey')fail('attention map key');const observer=path.fieldId===1n?selector.key:f(rec(selector.key,path.rootStateTypeId===241n?212n:213n),1n);if(text(id(observer).payload)!=='observer/attention-subject')fail('foreign observer state');}
 return Object.freeze({source,modelIdentity:identity,name:approved.name,recipe:approved,content,state,occurrences,definition,stage:(n:number)=>decode(enc(stages.get(n)??fail('unknown stage'))),work:u(f(rec(items(parameters,'list')[0],133n),1n)),validateState(s:ReturnType<typeof state.restoreState>){state.validateState(s);for(const e of s.entries())validatePath(e.path);},initialState(bytes:Uint8Array){const s=state.restoreState(bytes);if(s.entries().length)fail('attention requires empty S0');return s;},allocation});
}
export type AttentionCompiledModel=Awaited<ReturnType<typeof compileAttentionModel>>;
