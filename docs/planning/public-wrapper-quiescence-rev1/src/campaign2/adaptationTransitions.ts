/** ADAPT-owned V06 construction refinements, not another input authentication mechanism.
 * transition-admission-extension/0.6-candidate + adaptation-input/0.31-candidate.
 */
import {canonicalEncode,list,set,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {statePathPatternValue,type StatePathPattern} from '../substrate/state';
import {decodeCampaign2,campaign2Record} from './codecs';
import {dataRecord as rec,dataField as f,dataUnsigned as u,dataIdentity as id,dataText as txt,dataItems as items,dataKey as key,invalidModel} from './canonicalData';
import type {compileAdaptationDomains} from './adaptationDomains';
import type {compileRegulatoryReferences} from './regulatoryReference';
import type {compileValDeclarations} from './valDeclarations';
type Content=Awaited<ReturnType<ReturnType<typeof compileValDeclarations>['compileContent']>>;
const atom=(ns:bigint,name:string)=>typedIdentifier(ns,text(name));
const VERSION='adaptation-input/0.31-candidate';
function exact(value:CanonicalValue,ns:bigint,name?:string){const v=id(value);if(v.namespaceId!==ns||(name!==undefined&&txt(v.payload)!==name))invalidModel('wrong ADAPT declaration identity');return v;}
function schema(value:CanonicalValue,type:bigint){const r=rec(value,254n);if(u(f(r,1n))!==type||u(f(r,2n))!==1n)invalidModel('wrong ADAPT schema');}
export function compileAdaptationTransitions(registrationBytes:Uint8Array,ruleBytes:Uint8Array,producerBytes:Uint8Array,settlementBytes:Uint8Array,
  domains:ReturnType<typeof compileAdaptationDomains>,reg:ReturnType<typeof compileRegulatoryReferences>,content:Content){
  const producer=rec(decodeCampaign2(producerBytes),171n);exact(f(producer,1n),1027n,'definition/authored-adaptation-facts');exact(f(producer,2n),1023n,'registry/authored-adaptation-facts');
  if(txt(f(producer,3n))!==VERSION)invalidModel('wrong authored producer version');
  const source=rec(f(producer,4n),308n);exact(f(source,1n),1001n,'event/authored-adaptation-fact');schema(f(source,2n),304n);schema(f(source,3n),307n);if(u(f(source,4n))!==110n)invalidModel('authored producer must execute at 110');
  const rules=new Map<string,{definition:CanonicalValue;match:CanonicalValue;target:CanonicalValue;pattern:StatePathPattern;gatePattern?:StatePathPattern;basis:bigint}>();
  function target(family:CanonicalValue,leaf:CanonicalValue,derivation:CanonicalValue,basis:bigint){
    const spec=domains.leaf(leaf);if(!spec)invalidModel('unresolved target leaf');
    exact(family,1031n,spec!.root===302n?'regulatory-adaptation':'procedural-skill');
    if((spec!.root===302n?1n:2n)!==basis)invalidModel('cross-basis target or gate');
    const d=rec(derivation,313n),tag=u(f(d,1n)),required=spec!.key===292n||spec!.key===293n?1n:spec!.key===294n?2n:spec!.key===295n?3n:4n;
    if(tag!==required)invalidModel('wrong target key derivation');
    if(tag===1n||tag===2n){if(!reg.hasVariable(exact(f(d,2n),1029n)))invalidModel('unresolved rule regulatory variable');}
    if(tag===3n&&!domains.hasLoad(exact(f(d,3n),1033n)))invalidModel('unresolved rule load domain');
    return {rootStateTypeId:spec!.root,fieldId:spec!.field,selectors:[{kind:'wildcard' as const,selectorKind:'mapKey' as const}]};
  }
  for(const value of items(decodeCampaign2(ruleBytes),'set')){
    const e=rec(value,171n),ruleId=exact(f(e,1n),1035n);exact(f(e,2n),1023n,'registry/adaptation-rule');
    if(txt(f(e,3n))!==VERSION||rules.has(key(ruleId)))invalidModel('wrong rule version or duplicate rule');
    const r=rec(f(e,4n),311n),match=rec(f(r,1n),312n),basis=u(f(match,1n)),step=f(r,6n);
    if(typeof step==='boolean'||step.kind!=='signed'||step.value===0n)invalidModel('rule step must be signed nonzero');
    content.validateRecordRoles(canonicalEncode(r));
    if(basis===1n){const exposure=exact(f(match,2n),1002n);content.validateRole(canonicalEncode(exposure),canonicalEncode(recRole(1002n)));}
    else if(!domains.hasProcedure(exact(f(match,3n),1034n)))invalidModel('unresolved match procedure');
    const pattern=target(f(r,2n),f(r,3n),f(r,4n),basis),gate=rec(f(r,5n),314n);
    let gatePattern:StatePathPattern|undefined;
    if(u(f(gate,1n))===2n){const source=rec(f(gate,2n),315n);gatePattern=target(f(source,1n),f(source,2n),f(source,3n),basis);}
    rules.set(key(ruleId),{definition:r,match,target:recTarget(f(r,2n),f(r,3n),f(r,4n)),pattern,gatePattern,basis});
  }
  const registrations=items(decodeCampaign2(registrationBytes),'set');if(registrations.length!==2)invalidModel('requires exactly two ADAPT consumers');
  const assigned=new Set<string>(),consumerKeys=new Set<string>();
  for(const value of registrations){
    const e=rec(value,171n),transition=exact(f(e,1n),1009n),name=txt(transition.payload),procedural=name==='transition/procedural-adaptation';
    if(!procedural&&name!=='transition/regulatory-adaptation')invalidModel('unknown ADAPT consumer');
    if(consumerKeys.has(key(transition)))invalidModel('duplicate ADAPT consumer');consumerKeys.add(key(transition));
    exact(f(e,2n),1023n,'registry/transition-registration');if(txt(f(e,3n))!=='transition-admission-extension/0.6-candidate')invalidModel('wrong V06 registration version');
    const r=rec(f(e,4n),318n);exact(f(r,1n),1036n,'seam/automatic-adaptation');if(txt(f(r,2n))!==VERSION)invalidModel('wrong ADAPT executing version');
    const definition=rec(f(r,3n),319n),admission=rec(f(definition,1n),320n),p=rec(f(admission,2n),321n);
    schema(f(admission,1n),307n);if(u(f(p,1n))!==3n)invalidModel('ADAPT requires authored-fact producer');exact(f(p,6n),1027n,'definition/authored-adaptation-facts');
    const ingress=rec(f(r,4n),276n);if(u(f(ingress,3n))!==140n)invalidModel('ADAPT consumer must execute at 140');exact(f(ingress,1n),1001n,procedural?'event/procedural-adaptation':'event/regulatory-adaptation');
    const capability=rec(f(definition,4n),322n);if(u(f(capability,1n))!==2n)invalidModel('ADAPT requires StateWrites');
    exact(f(capability,2n),1025n,procedural?'authority/procedural-skill':'authority/regulatory-adaptation');
    const writable=items(f(capability,3n),'set');if(writable.length!==1)invalidModel('one ADAPT authority/family per consumer');exact(writable[0],1031n,procedural?'procedural-skill':'regulatory-adaptation');
    const extension=rec(f(r,5n),317n),basis=u(f(extension,1n));if(basis!==(procedural?2n:1n))invalidModel('wrong AcceptedBasis');
    const output=rec(f(extension,3n),323n);schema(f(output,1n),324n);schema(f(output,2n),325n);
    const genericOutputs=items(f(definition,3n),'set');if(genericOutputs.length!==1)invalidModel('ADAPT requires dispatch singleton');schema(f(rec(genericOutputs[0],277n),1n),324n);
    const selected=items(f(rec(f(extension,2n),316n),1n),'set').map(v=>{
      exact(v,1035n);const rule=rules.get(key(v));if(!rule||assigned.has(key(v)))invalidModel('unresolved or multiply assigned rule');assigned.add(key(v));
      if(rule!.basis!==basis)invalidModel('rule match disagrees with AcceptedBasis');return rule!;
    });
    const patterns=new Set(selected.flatMap(rule=>[rule.pattern,...(rule.gatePattern?[rule.gatePattern]:[])].map(p=>key(statePathPatternValue(p)))));
    const declared=items(f(definition,2n),'set').map(key);
    if(JSON.stringify([...patterns].sort())!==JSON.stringify(declared.sort()))invalidModel('ReadDomain must equal exact rule target/gate family union');
    for(let i=0;i<selected.length;i++)for(let j=i+1;j<selected.length;j++)if(key(selected[i].match)===key(selected[j].match)&&key(selected[i].target)===key(selected[j].target))invalidModel('guaranteed overlapping rule target collision');
  }
  if(assigned.size!==rules.size)invalidModel('orphan adaptation rule');
  const settlement=rec(decodeCampaign2(settlementBytes),171n);exact(f(settlement,1n),1027n,'definition/adaptation-settlement');exact(f(settlement,2n),1023n,'registry/adaptation-settlement');if(txt(f(settlement,3n))!=='adaptation-settlement/0.2-candidate')invalidModel('wrong settlement version');
  const stage=rec(f(settlement,4n),328n),consumers=items(f(stage,1n),'set').map(key).sort();
  if(JSON.stringify(consumers)!==JSON.stringify([...consumerKeys].sort()))invalidModel('wrong exclusive stage consumer set');
  const snapshot=canonicalEncode(set(registrations));
  return Object.freeze({registrationBytes:()=>snapshot.slice(),ruleCount:rules.size,
    ruleDefinition(rule:CanonicalValue):CanonicalValue|undefined {const v=rules.get(key(rule));return v?decodeCampaign2(canonicalEncode(v.definition)):undefined;}});
}
function recRole(namespace:bigint){return campaign2Record('CanonicalIdentityRole',{RequiredNamespace:{kind:'unsigned',value:namespace}});}
function recTarget(family:CanonicalValue,leaf:CanonicalValue,derivation:CanonicalValue){return list([family,leaf,derivation]);}
