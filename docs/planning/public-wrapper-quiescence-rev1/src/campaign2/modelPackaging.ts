/** C2-MODEL-PACK-001: campaign2-registry/0.1-candidate and campaign2-parameters/0.1-candidate.
 * Internal preparation only. No scheduler, source admission, allocator or activation facade.
 */
import {canonicalEncode,list,set,record,unsigned,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {commitManifest,createModelIdentity} from '../substrate/identity';
import {contentRegistrySchemas} from '../substrate/contentManifest';
import {orderingPhaseRegistryValue} from '../substrate/scheduler';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {SEMANTIC_UNION_VARIANT_ENTRIES} from '../semanticBinding/semanticSchemaRegistry';
import {campaign2SupportedSchemas,campaign2UnionEntries,decodeCampaign2} from './codecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataText as txt,dataUnsigned as u,dataIdentity as id,dataKey as key,invalidModel} from './canonicalData';
import {compileFirstCampaign2Content} from './contentProfile';
import {compileCampaign2StateModel} from './stateModel';
import {compileRegulatoryReferences} from './regulatoryReference';
import {compileAdaptationDomains} from './adaptationDomains';
import {compileAdaptationTransitions} from './adaptationTransitions';
import {compileTransitionAdmissionV06} from './transitionAdmissionV04';
import {compileFirstCampaign2Bridge} from './consequenceBridge';
import {validateEvidRegistrations} from './transitionIngressV04';
import {TRACE_RULES,TRACE_PROFILE,compileTraceBinding,supportsTraceProfile} from './traceBinding';

export const REGISTRY_PROFILE='campaign2-registry/0.1-candidate';
export const PARAMETER_PROFILE='campaign2-parameters/0.1-candidate';
export const BOUNDED_RULES='rules/campaign2-bounded-bridge/0.1-candidate';
export const BOUNDED_SEMANTIC_BUNDLE=Object.freeze([
  'substrate/0.2-candidate','cenc/1','content/0.2-candidate','content-kind/0.1-candidate',
  'governed-domain-validator/0.1-candidate','governed-execution/0.1-candidate',
  'ordering/0.2-candidate','ordering-phases/2-candidate',
  'mutation-authority/0.1-candidate#TRC-001-002-addendum','state/0.3-candidate-addendum',
  'projection/0.3-candidate-addendum','identity-binding/0.5-candidate',
  'observation/0.1-candidate','authored-fact-observation/0.1-candidate',
  'observation-unit-identity/0.1-candidate','referent-origin/0.1-candidate','content-definition-id/0.1-candidate',
  'semantic-binding/0.1-candidate#SEM-001H','character-learning-evidence/0.5-candidate',
  'transition-admission/0.4-candidate','transition-admission-extension/0.6-candidate',
  'adaptation-input/0.31-candidate','adaptation-settlement/0.2-candidate','regulatory-reference/0.5-candidate',
]);
export function boundedRunProfiles(rulesVersion:string){
  if(rulesVersion===TRACE_RULES){
    if(typeof compileTraceBinding!=='function'||!supportsTraceProfile(TRACE_PROFILE))invalidModel('exact trace-profile implementation unavailable');
    return Object.freeze({orderedInput:'campaign2-ordered-input/0.1-candidate',persistence:'campaign2-persistence/0.1-candidate',trace:TRACE_PROFILE});
  }
  if(rulesVersion!==BOUNDED_RULES)invalidModel('unsupported bounded RulesVersion');
  return Object.freeze({orderedInput:'campaign2-ordered-input/0.1-candidate',persistence:'campaign2-persistence/0.1-candidate'});
}
export function trustedSchemaDescriptors(){return campaign2SupportedSchemas().map(s=>record(contentRegistrySchemas.recordSchemaDescriptor,new Map([
  [1n,unsigned(s.typeId)],[2n,unsigned(s.schemaVersion)],[3n,text(s.name)],
  [4n,list(s.fields.map(f=>record(contentRegistrySchemas.recordFieldDescriptor,new Map([[1n,unsigned(f.id)],[2n,text(f.name)],[3n,f.required]]))))],
])));}
export function trustedUnionEntries(){return [...SEMANTIC_UNION_VARIANT_ENTRIES,...campaign2UnionEntries()].map(e=>record(contentRegistrySchemas.semanticRegistryEntry,new Map([[1n,e.stableId],[2n,e.registryKind],[3n,text(e.definitionVersion)],[4n,e.definition]])));}

export function compileCampaign2Parameters(version:string,bytes:Uint8Array){
  if(version!==PARAMETER_PROFILE)invalidModel('unsupported parameter profile');
  const value=decodeCampaign2(bytes),values=items(value,'list');
  if(values.length!==1)invalidModel('parameter manifest requires exactly one slot');
  const limit=u(f(rec(values[0],133n),1n));if(limit===0n)invalidModel('work limit must be positive');
  const canonical=canonicalEncode(value);
  return Object.freeze({maxWork:limit,bytes:()=>canonical.slice()});
}

export function decodeCampaign2Registry(version:string,bytes:Uint8Array){
  if(version!==REGISTRY_PROFILE)invalidModel('unsupported registry profile');
  const value=decodeCampaign2(bytes),slots=items(value,'list');if(slots.length!==6)invalidModel('registry manifest requires exactly six slots');
  const carrier=items(slots[0],'set'),descriptors:CanonicalValue[]=[],entries:CanonicalValue[]=[];
  const ids=new Set<string>();
  for(const v of carrier){
    if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===172n){descriptors.push(v);continue;}
    const entry=rec(v,171n),stable=key(id(f(entry,1n)));if(ids.has(stable))invalidModel('duplicate semantic StableId');ids.add(stable);entries.push(v);
  }
  if(key(set(descriptors))!==key(set(trustedSchemaDescriptors())))invalidModel('schema descriptors differ from complete trusted inventory');
  if(key(rec(slots[1],134n))!==key(orderingPhaseRegistryValue()))invalidModel('phase registry differs from accepted topology');
  rec(slots[2],155n);
  for(const [slot,type] of [[3,262n],[4,261n],[5,265n]] as const)for(const v of items(slots[slot],'set'))rec(v,type);
  const snapshot=canonicalEncode(value);
  return Object.freeze({bytes:()=>snapshot.slice(),slots:()=>items(decodeCampaign2(snapshot),'list'),entries:()=>entries.map(v=>decodeCampaign2(canonicalEncode(v)))});
}

/** Full committed manifest is the VAL traversal operand, including nested 278/266 roles. */
export async function compileCampaign2Registry(version:string,bytes:Uint8Array,contentBytes:Uint8Array){
  const decoded=decodeCampaign2Registry(version,bytes),slots=decoded.slots(),entries=decoded.entries();
  const group=(kind:string)=>entries.filter(v=>{const k=id(f(rec(v,171n),2n));if(k.namespaceId!==1023n)invalidModel('wrong registry kind namespace');return txt(k.payload)===kind;});
  const union=group('registry/union-variant-definition');
  if(key(set(union))!==key(set(trustedUnionEntries())))invalidModel('union entries differ from trusted inventory');
  const val=[...group('registry/semantic-kind'),...group('registry/domain-validator')];
  // This snapshot precedes the first await: caller mutation cannot swap any component.
  const contentSnapshot=canonicalEncode(decodeCampaign2(contentBytes));
  const content=await compileFirstCampaign2Content(contentSnapshot,canonicalEncode(set(val)),decoded.bytes(),canonicalEncode(slots[0]));
  // One cross-slot pass: owned + read-only patterns determine exact grammar coverage.
  const stateModel=compileCampaign2StateModel(canonicalEncode(slots[2]),canonicalEncode(slots[3]),canonicalEncode(slots[4]),content);
  content.validateRecordRoles(decoded.bytes());
  return Object.freeze({content,stateModel,bytes:decoded.bytes,slots:decoded.slots,entries:decoded.entries});
}

/** Internal preparation under the accepted bounded bundle; concrete specimen frozen separately. */
export async function compileBoundedModelDeclarations(source:{rulesVersion:string;contentSchemaVersion:string;registrySchemaVersion:string;parameterSchemaVersion:string;numericProfileVersion:string;randomAlgorithmVersion:string;content:Uint8Array;registry:Uint8Array;parameters:Uint8Array}){
  if(Object.keys(source).sort().join('|')!==['rulesVersion','contentSchemaVersion','registrySchemaVersion','parameterSchemaVersion','numericProfileVersion','randomAlgorithmVersion','content','registry','parameters'].sort().join('|'))invalidModel('unknown/missing model source field');
  if(![BOUNDED_RULES,TRACE_RULES].includes(source.rulesVersion)||source.contentSchemaVersion!=='content/0.2-candidate'||source.registrySchemaVersion!==REGISTRY_PROFILE||source.parameterSchemaVersion!==PARAMETER_PROFILE)invalidModel('incompatible bounded RulesVersion bundle');
  // BOUNDED_NUMERIC_PROFILE.md fixes numeric/exact-1 independently of RulesVersion.
  if(source.numericProfileVersion!=='numeric/exact-1'||source.randomAlgorithmVersion!==RANDOM_ALGORITHM_VERSION)invalidModel('unsupported candidate numeric/random profile');
  const versions={rulesVersion:source.rulesVersion,contentSchemaVersion:source.contentSchemaVersion,registrySchemaVersion:source.registrySchemaVersion,parameterSchemaVersion:source.parameterSchemaVersion,numericProfileVersion:source.numericProfileVersion,randomAlgorithmVersion:source.randomAlgorithmVersion};
  const profiles=boundedRunProfiles(versions.rulesVersion);
  const parameters=compileCampaign2Parameters(source.parameterSchemaVersion,source.parameters);
  const compiled=await compileCampaign2Registry(source.registrySchemaVersion,source.registry,source.content);
  const entries=compiled.entries(),group=(kind:string)=>entries.filter(v=>txt(id(f(rec(v,171n),2n)).payload)===kind);
  for(const kind of ['registry/semantic-kind','registry/domain-validator','registry/regulatory-variable','registry/procedure','registry/load-domain'])if(group(kind).length!==1)invalidModel(`bounded specimen requires exactly one ${kind}`);
  if(items(decodeCampaign2(compiled.content.canonicalBytes),'set').length!==1||items(compiled.slots()[3],'set').length!==0||compiled.stateModel.declaredFamilies().length!==5)invalidModel('bounded specimen requires one character, five writable maps and no read-only state');
  const one=(kind:string)=>{const values=group(kind);if(values.length!==1)invalidModel(`requires one ${kind}`);return canonicalEncode(values[0]);};
  const domainKinds=['registry/campaign2-state-family','registry/adaptation-leaf-family','registry/load-domain','registry/procedure'];
  const admitted=new Set([...domainKinds,'registry/semantic-kind','registry/domain-validator','registry/regulatory-variable','registry/adaptation-rule','registry/authored-adaptation-facts','registry/authored-fact-consequence-bridge','registry/transition-registration','registry/transition-admission','registry/adaptation-settlement','registry/union-variant-definition']);
  for(const e of entries)if(!admitted.has(txt(id(f(rec(e,171n),2n)).payload)))invalidModel('unadmitted bounded-model entry');
  const reg=compileRegulatoryReferences(canonicalEncode(set(group('registry/regulatory-variable'))),compiled.content);
  const domains=compileAdaptationDomains(canonicalEncode(set(domainKinds.flatMap(group))),compiled.stateModel,reg,compiled.content);
  const registrations=group('registry/transition-registration'),v04=registrations.filter(v=>txt(f(rec(v,171n),3n))==='transition-admission/0.4-candidate'),v06=registrations.filter(v=>txt(f(rec(v,171n),3n))==='transition-admission-extension/0.6-candidate');
  if(v04.length!==2||v06.length!==2||registrations.length!==4)invalidModel('bounded bundle requires exactly four fixed consumers');
  const adaptation=compileAdaptationTransitions(canonicalEncode(set(v06)),canonicalEncode(set(group('registry/adaptation-rule'))),one('registry/authored-adaptation-facts'),one('registry/adaptation-settlement'),domains,reg,compiled.content);
  const admission=compileTransitionAdmissionV06(canonicalEncode(set(v04)),one('registry/transition-admission'),compiled.content,adaptation);
  const evidNames=v04.map(v=>txt(id(f(rec(v,171n),1n)).payload)).sort();
  if(evidNames.join('|')!=='OutcomeEvaluationTransition|OutcomeLearningEvidenceTransition')invalidModel('unadmitted V04 consumer');
  validateEvidRegistrations(admission);
  const bridge=compileFirstCampaign2Bridge(one('registry/authored-fact-consequence-bridge'),compiled.content);
  const registryManifest=await commitManifest(decodeCampaign2(compiled.bytes())),parameterSet=await commitManifest(decodeCampaign2(parameters.bytes()));
  const modelIdentity=await createModelIdentity({...versions,contentManifest:compiled.content,registryManifest,parameterSet});
  return Object.freeze({compiled,reg,domains,adaptation,admission,bridge,parameters,registryManifest,parameterSet,modelIdentity,profiles});
}
