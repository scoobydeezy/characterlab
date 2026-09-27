/** Closed declaration admission beneath general-attention-carrier/0.1-candidate.
 * This is not a runnable model, ingress capability or source authentication token.
 * The compiler owns the implementation profile; callers supply canonical data only. */
import {canonicalEncode as enc,list,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {compileGovernedContentManifest,type GovernedContentInput} from '../substrate/contentManifest';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {statePathValue,patternMatches,type StatePath} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataItems as items,dataKey as key,dataUnsigned as uint,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {buildGeneralRegistrations,buildGeneralRoles,generalBindingContext,generalStagePaths,generalStageAccessors,generalSubject,generalDefinitionId as d,generalContentId as c,generalId,generalRecord as r,generalPurposeDefinitions,generalPurposes} from './generalBindingProfile';
import {buildGeneralDefinitionEntries,buildGeneralContent,generalRecipe,isGeneralCreditRecipe} from './generalDefinitionProfile';
import {compileGeneralStageRegistrations} from './generalRegistration';
import {compileGeneralAccessors} from './generalAccessors';
import {compileGeneralSourceDeclarations} from './generalSourceDeclarations';
import {compileGeneralProtocolDeclarations} from './generalProtocolDeclarations';
import {compileGeneralWorkspace} from './generalWorkspace';
import {compileGeneralPhysicalReads} from './generalPhysicalReads';
import {compileGeneralSemanticReads} from './generalSemanticReads';
import {compileGeneralOutputSlots} from './generalOutputSlots';
import {compileGeneralState} from './generalState';
import {compileGeneralTrackingStage} from './generalTrackingStage';
import {compileGeneralSensing} from './generalSensing';
import {compileGeneralSelectionProduction} from './generalSelectionProduction';
import {compileGeneralMemoryOwner} from './generalMemoryOwner';
import {compileGeneralGraphOwners} from './generalGraphOwners';
import {compileGeneralRecallProduction} from './generalRecallProduction';
import {compileGeneralConcernProduction} from './generalConcernProduction';
import {compileGeneralInheritedSource} from './generalInheritedSource';
import {compileGeneralGoalOwner} from './generalGoalOwner';
import {compileGeneralAttributionProduction} from './generalAttributionProduction';
import {compileGeneralOutcomeDeliveries} from './generalOutcomeDeliveries';
import {compileGeneralInitialState} from './generalInitialState';
import {compileGeneralQuiescentState} from './generalQuiescentState';
import {compileGeneralTaskOwner} from './generalTaskOwner';

export interface GeneralDeclarationPacket {
 readonly recipe:string;readonly content:Uint8Array;readonly definitions:Uint8Array;
 readonly roles:Uint8Array;readonly registrations:Uint8Array;
}
const equal=(a:CanonicalValue,b:CanonicalValue,message:string)=>{if(key(a)!==key(b))fail('GA '+message);};
const rational=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')return fail('GA rational');return v;};
const instant=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed'||v.value<0n)return fail('GA instant');return v.value;};
const le=(a:CanonicalValue,b:CanonicalValue)=>{const x=rational(a),y=rational(b);return x.numerator*y.denominator<=y.numerator*x.denominator;};
function unique(values:readonly CanonicalValue[],type:bigint,label:string){
 const result=new Map<string,RecordValue>();for(const value of values){const r=rec(value,type),k=key(f(r,1n));if(result.has(k))fail('GA duplicate '+label);result.set(k,r);}return result;
}
export function buildGeneralDeclarationPacket(recipe='baseline'):GeneralDeclarationPacket {
 const context=generalBindingContext();generalRecipe(recipe);
 return {recipe,content:enc(buildGeneralContent()),definitions:enc(buildGeneralDefinitionEntries(recipe)),roles:enc(buildGeneralRoles()),registrations:enc(set([...buildGeneralRegistrations(generalRecipe(recipe).encoding.allocation).values()].map(b=>decode(b,context))))};
}

/** Content identity and role predicates are checked from the admitted packet;
 * exact candidate comparison additionally prevents undeclared profile expansion. */
export async function compileGeneralDeclarations(input:GeneralDeclarationPacket){
 const packet={recipe:input.recipe,content:input.content.slice(),definitions:input.definitions.slice(),roles:input.roles.slice(),registrations:input.registrations.slice()};
 generalRecipe(packet.recipe);
 const context=generalBindingContext(),contentValue=decode(packet.content,context),definitionValue=decode(packet.definitions,context),roleValue=decode(packet.roles,context);
 const contents=unique(items(contentValue,'set'),170n,'content identity'),definitions=unique(items(definitionValue,'set'),171n,'definition identity');
 const required=(name:string,type:bigint)=>{const row=definitions.get(key(d(name)));if(!row)fail('GA missing definition '+name);return rec(f(row,4n),type);};
 const content=(name:string)=>contents.get(key(c(name)))??fail('GA missing content '+name);
 const kind=(name:string)=>generalId(1004,'semantic-kind/'+name);
 const who=generalSubject();
 function qualify(value:CanonicalValue,semanticKind:CanonicalValue){
  validateSemanticReferent(value);const origin=id(id(value).payload);
  if(origin.namespaceId!==1037n)fail('GA qualification requires authored content');
  const row=contents.get(key(origin.payload));if(!row)fail('GA uncommitted referent');equal(f(row,2n),semanticKind,'wrong committed kind');
 }
 qualify(who.character,kind('character'));
 const task=required('task',370n),prediction=required('prediction',359n);
 equal(f(task,1n),c('subject'),'task holder content');equal(f(task,2n),d('prediction'),'task prediction');equal(f(prediction,2n),who.character,'prediction holder');
 if(!le(f(task,3n),f(task,4n))||instant(f(task,5n))>=instant(f(task,6n)))fail('GA task interval/window');
 const goal=required('goal',558n),goalKey=rec(f(goal,2n),557n),desired=rec(f(goal,4n),556n),signalDomain=required('signal-domain-A',556n);
 equal(f(goal,1n),d('goal'),'goal specification self identity');equal(f(goalKey,1n),who.character,'goal holder');qualify(f(goalKey,2n),kind('bodily-maintenance-goal'));
 const goalOrigin=id(id(f(goalKey,2n)).payload);equal(goalOrigin.payload,c('goal'),'goal content/referent coupling');
 equal(f(goal,3n),generalId(1045,'interoceptive-signal/A'),'goal signal');
 if(!le(f(desired,1n),f(desired,2n))||!le(f(signalDomain,1n),f(desired,1n))||!le(f(desired,2n),f(signalDomain,2n)))fail('GA goal desired interval outside signal domain');
 if(instant(f(goal,5n))>=instant(f(goal,6n)))fail('GA goal active/expiry window');
 for(const [name,semanticKind] of [['task','task-commitment'],['goal','bodily-maintenance-goal']] as const){
  const row=content(name);equal(f(row,2n),kind(semanticKind),'delegated content kind');
  for(const field of [3,7,8,10,11,13,16])equal(f(row,BigInt(field)),list([d(name)]),'content/spec delegation');
  equal(f(row,12n),list([c('subject')]),'content/spec holder coupling');
  for(const field of [4,5,6,9,14,15])equal(f(row,BigInt(field)),list([]),'unexpected delegated content field');
 }
 // Cross-definition closure: profile keys, observer, physical keys and parameter
 // references are validated independently of their scalar grammar.
 const physical=new Set<string>();
 for(const value of items(f(required('body',646n),1n),'set')){
  const binding=rec(value,645n),k=rec(f(binding,1n),644n);qualify(f(k,1n),kind('character'));equal(f(k,1n),who.character,'body holder');
  if(physical.has(key(k)))fail('GA duplicate physical key');physical.add(key(k));
  const parameters=definitions.get(key(f(binding,2n)));if(!parameters)fail('GA missing reserve parameters');rec(f(parameters,4n),453n);
 }
 const channels=new Set<string>(),signals=new Set<string>();
 for(const value of items(f(required('channels',648n),1n),'set')){
  const channel=rec(value,647n);equal(f(channel,2n),who.observer,'channel observer');
  if(!physical.has(key(f(channel,3n))))fail('GA channel physical key');
  if(channels.has(key(f(channel,1n)))||signals.has(key(f(channel,4n))))fail('GA channel/signal bijection');
  channels.add(key(f(channel,1n)));signals.add(key(f(channel,4n)));
 }
 if(!signals.has(key(f(goal,3n))))fail('GA goal unbound signal');
 const spatial=required('spatial',687n);if(uint(f(spatial,1n))>uint(f(spatial,2n))||uint(f(spatial,3n))>uint(f(spatial,4n)))fail('GA spatial bounds');
 const graph=required('association',689n),access=required('event-recall',690n);if(uint(f(graph,1n))!==uint(f(access,2n))||uint(f(graph,1n))!==context.graphScale)fail('GA graph scale disagreement');
 const source=compileGeneralSourceDeclarations(definitions,v=>qualify(v,kind('attention-scene-object')));
 const registrations=compileGeneralStageRegistrations(packet.registrations,buildGeneralRegistrations(generalRecipe(packet.recipe).encoding.allocation),context);
 const registrationRows=new Map(registrations.stageNames.map(stage=>[stage,rec(decode(registrations.registrationBytes(stage),context),706n)]));
 const protocol=compileGeneralProtocolDeclarations(definitions,registrationRows,source.counts.qualifiedSelectionSlots);
 // Fixed first-profile declarations remain exact, including definition versions,
 // unrelated references and otherwise codec-valid changes to calibration values.
 equal(contentValue,buildGeneralContent(),'content differs from concrete profile');
 equal(definitionValue,buildGeneralDefinitionEntries(packet.recipe),'definitions differ from concrete recipe');
 equal(roleValue,buildGeneralRoles(),'canonical role coverage/predicate mismatch');
 const roles=items(roleValue,'set').map(v=>{const row=rec(v,265n);return {position:rec(f(row,1n),264n),role:rec(f(row,2n),263n)};});
 function checkRole(value:CanonicalValue,role:RecordValue){
  if(id(value).namespaceId!==uint(f(role,1n)))fail('GA role namespace');
  const validator=role.fields.get(2n);if(validator!==undefined){
   const predicates=['character','task','maintenance-goal'] as const;
   const predicate=predicates.find(n=>key(validator)===key(generalId(1021,'validator/'+n+'-qualification')));
   if(!predicate)fail('GA unknown role predicate');qualify(value,kind(predicate==='maintenance-goal'?'bodily-maintenance-goal':predicate==='task'?'task-commitment':'character'));
  }
 }
 function recordRoles(value:CanonicalValue):void {
  if(typeof value==='boolean')return;
  if(value.kind==='record'){
   for(const {position,role} of roles){
    const tag=uint(f(position,1n)),type=uint(f(position,tag===1n?2n:3n));if(type!==value.schema.typeId)continue;
    const child=value.fields.get(uint(f(position,4n)));if(child===undefined)continue;
    if(tag===1n)checkRole(child,role);
    else {if(typeof child==='boolean'||child.kind!=='map')fail('GA map role on non-map');for(const [k] of child.entries)checkRole(k,role);}
   }
   for(const child of value.fields.values())recordRoles(child);
  }else if(value.kind==='list'||value.kind==='set')value.items.forEach(recordRoles);
  else if(value.kind==='map')for(const [k,v] of value.entries){recordRoles(k);recordRoles(v);}
 }
 recordRoles(definitionValue);
 const outputSlots=compileGeneralOutputSlots({
  recordRole(type,field){const found=roles.find(({position})=>uint(f(position,1n))===1n&&uint(f(position,2n))===type&&uint(f(position,4n))===field);return found?enc(found.role):undefined;},
  validateRole(bytes,roleBytes){checkRole(decode(bytes,context),rec(decode(roleBytes,context),263n));},
 },recordRoles);
 const accessors=new Map<string,ReturnType<typeof compileGeneralAccessors>>();
 for(const stage of registrations.stageNames){
  const registration=rec(decode(registrations.registrationBytes(stage),context),706n);
  for(const value of items(f(registration,11n),'list')){
   const binding=rec(value,702n),purpose=generalPurposes[Number(uint(f(binding,1n)))-1],expected=generalPurposeDefinitions[purpose];
   const row=definitions.get(key(f(binding,2n)));if(!row)fail('GA dangling stage definition');rec(f(row,4n),BigInt(expected[0]));
  }
  const paths=generalStagePaths(stage);
  // Sampling's conditional physical subject read belongs to the sampling adapter;
  // every unconditional PRJ applies even when the stage reads no owner ledger.
  accessors.set(stage,compileGeneralAccessors(stage,generalStageAccessors(stage),paths.reads,who,context,paths.projection&&!stage.endsWith('-sample')));
 }
 const goalOwner=compileGeneralGoalOwner(definitions,accessors);
 /** The GA stage domain, including exact subjects beneath SEM wildcards. This
  * does not admit inherited-only or runtime protocol roots of a whole model. */
 function validateStatePath(path:StatePath){
  statePathValue(path);
  if(path.rootStateTypeId===302n){
   if(path.fieldId!==3n||path.selectors.length!==1||path.selectors[0].kind!=='mapKey')fail('GA inherited regulatory path');
   equal(path.selectors[0].key,r(294,[who.character,generalId(1029,'variable/fixture-regulation')]),'inherited regulatory subject/variable');return;
  }
  if(!registrations.stageNames.some(stage=>generalStagePaths(stage).reads.some(p=>patternMatches(p,path))))fail('GA state path outside declared stage domains');
  if(path.selectors.length!==1||path.selectors[0].kind!=='mapKey')fail('GA state selector');
  const k=path.selectors[0].key;recordRoles(decode(enc(k),context));
  if(path.rootStateTypeId===268n||[634n,635n].includes(path.rootStateTypeId))equal(k,who.observer,'state observer');
  else if([241n,242n].includes(path.rootStateTypeId)){
   if(path.fieldId===1n)equal(k,who.observer,'SEM counter observer');
   else equal(f(rec(k,path.rootStateTypeId===241n?212n:213n),1n),who.observer,'SEM file observer');
  }
 }
 function validateStateLeaf(path:StatePath,value:CanonicalValue){
  validateStatePath(path);const admitted=decode(enc(value),context);recordRoles(admitted);
  if(path.rootStateTypeId===302n){const displacement=f(rec(admitted,299n),1n);if(typeof displacement==='boolean'||displacement.kind!=='signed'||displacement.value< -50n||displacement.value>50n)fail('GA inherited displacement domain');return;}
  if([241n,242n].includes(path.rootStateTypeId)){
   if(path.fieldId===1n)uint(admitted);else if(admitted!==true)fail('GA SEM membership marker');return;
  }
  const types:Readonly<Record<string,bigint>>={'268':267n,'362':361n,'373':372n,'630':555n,'631':625n,'632':595n,'633':560n,'634':627n,'635':629n,'649':454n};
  const type=types[String(path.rootStateTypeId)];if(type===undefined)fail('GA unknown state leaf grammar');rec(admitted,type);
  if(path.rootStateTypeId===268n)equal(f(rec(admitted,267n),1n),who.character,'roster holder');
  if(path.rootStateTypeId===633n)goalOwner.validateLedger(admitted);
  if(path.rootStateTypeId===649n){
   const selector=path.selectors[0];if(selector.kind!=='mapKey')fail('GA physical selector');
   const body=rec(f(definitions.get(key(d('body')))!,4n),646n),binding=items(f(body,1n),'set').map(v=>rec(v,645n)).find(v=>key(f(v,1n))===key(selector.key));if(!binding)fail('GA physical state binding');
   const parameters=rec(f(definitions.get(key(f(binding,2n)))!,4n),453n),anchor=rec(admitted,454n),amount=rational(f(anchor,1n)),capacity=rational(f(parameters,2n));
   if(amount.numerator<0n||amount.numerator*capacity.denominator>capacity.numerator*amount.denominator)fail('GA physical anchor capacity');
  }
  if(path.rootStateTypeId===362n){
   const prediction=rec(admitted,361n),mean=f(prediction,1n),basis=items(f(prediction,2n),'set'),count=BigInt(basis.length);
   if(count<1n||count>16n||typeof mean==='boolean'||mean.kind!=='rational'||mean.numerator<0n||mean.numerator>10n*mean.denominator||(10n*count)%mean.denominator!==0n)fail('GA prediction mean/support domain');
   for(const ref of basis){const row=rec(ref,237n);if(uint(f(row,1n))!==1n)fail('GA prediction observation support');}
  }
 }
 const inputs:GovernedContentInput[]=[...contents.values()].map(r=>({stableId:id(f(r,1n)),semanticKind:id(f(r,2n)),declaredInputs:f(r,3n),declaredOutputs:f(r,4n),preconditions:f(r,5n),worldEffects:f(r,6n),unitsDomainsBounds:f(r,7n),epistemicVisibility:f(r,8n),observationAffordances:f(r,9n),lifecycle:f(r,10n),referencedRegistryIds:items(f(r,11n),'list').map(id),referencedContentIds:items(f(r,12n),'list').map(id),validationInvariants:f(r,13n),sourceProvenance:f(r,14n),changeHistory:f(r,15n),formalSeamMappings:f(r,16n)}));
 const commitment=await compileGovernedContentManifest(inputs,[...definitions.values()].map(r=>id(f(r,1n))),['character','task-commitment','bodily-maintenance-goal','attention-scene-object'].map(n=>({semanticKindId:kind(n),validate:()=>{}})));
 const semantic=compileGeneralSemanticReads(validateStateLeaf);
 const physicalReads=compileGeneralPhysicalReads(definitions,validateStateLeaf);
 const memoryOwner=compileGeneralMemoryOwner(definitions,accessors.get('ordinary-memory-formation')!);
 const stateModel=compileGeneralState(registrations.registrationBytes,validateStateLeaf);
 const inheritedSource=compileGeneralInheritedSource(packet.recipe,{qualifyCharacter:(v:CanonicalValue)=>qualify(v,kind('character')),validateRecordRoles:(bytes:Uint8Array)=>recordRoles(decode(bytes,context))});
 const initial=compileGeneralInitialState(inheritedSource,stateModel,isGeneralCreditRecipe(packet.recipe)),validateQuiescent=compileGeneralQuiescentState(definitions,stateModel,initial.build().entries().map(e=>e.path));
 validateQuiescent(initial.build(),0n,0n);
 return Object.freeze({
  ...registrations,recipe:packet.recipe,source,protocol,workspace:compileGeneralWorkspace(definitions,validateStateLeaf),
  physical:physicalReads,semantic,tracking:compileGeneralTrackingStage(semantic,validateStateLeaf),sensing:compileGeneralSensing(source,physicalReads),outputSlots,
  state:stateModel,initial,validateQuiescent,contentCommitment:()=>structuredClone(commitment),
  selection:compileGeneralSelectionProduction(definitions,generalRecipe(packet.recipe).encoding.allocation),
  memory:memoryOwner,graphOwners:compileGeneralGraphOwners(definitions,accessors,memoryOwner),
  recall:compileGeneralRecallProduction(definitions,accessors),
  concern:compileGeneralConcernProduction(definitions),
  goals:goalOwner,
  attribution:compileGeneralAttributionProduction(definitions,accessors.get('retained-attribution')!),
  outcomeDeliveries:compileGeneralOutcomeDeliveries(),
  inheritedSource,
  task:compileGeneralTaskOwner(definitions),
  declarationBytes:(part:'content'|'definitions'|'roles'|'registrations')=>packet[part].slice(),
  qualifyCharacter:(v:CanonicalValue)=>qualify(v,kind('character')),
  qualifyGoal:(v:CanonicalValue)=>qualify(v,kind('bodily-maintenance-goal')),
  validateRecordRoles:(bytes:Uint8Array)=>recordRoles(decode(bytes,context)),
  validateStatePath,validateStateLeaf,
  /** Internal accessor binding only. Runtime must authenticate the producing
   * stage before exposing a completed operand to construct(). */
  accessorBinding(stage:string){return accessors.get(stage)??fail('GA unknown accessor stage');},
 });
}
