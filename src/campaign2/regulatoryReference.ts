/** Fixed regulatory-reference/0.5-candidate interpreter. Immutable model declarations only. */
import {CanonicalEncodingError,canonicalEncode,signed,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {INT64_MAX,LinearParameterRegistry,materializeLinear,simInstant,type LinearAnalyticalAnchor,type LinearRateParameters} from '../substrate/time';
import {decodeCampaign2} from './codecs';
import {dataField as f,dataRecord as rec,dataItems,dataIdentity as id,dataUnsigned as u,dataText,dataKey as key,invalidModel,type RecordValue} from './canonicalData';
import type {compileValDeclarations} from './valDeclarations';
type Content=Awaited<ReturnType<ReturnType<typeof compileValDeclarations>['compileContent']>>;
type MapValue=Extract<CanonicalValue,{kind:'map'}>;
export type RegulatoryReferenceFailureCode='REG_UNKNOWN_VARIABLE'|'REG_ADAPTED_REFERENCE_OUT_OF_RANGE';
export type ReferenceResult={kind:'ReferenceValue';value:ReturnType<typeof signed>}|{kind:'Failure';code:'REG_UNKNOWN_VARIABLE'};
export type AdaptedReferenceValidationResult={kind:'Valid'}|{kind:'Failure';code:RegulatoryReferenceFailureCode};
function integer(v:CanonicalValue):bigint {
  if(typeof v==='boolean'||v.kind!=='signed'||typeof v.value!=='bigint')throw new CanonicalEncodingError('requires canonical signed integer');
  return v.value;
}
function mapping(v:CanonicalValue):MapValue {
  if(typeof v==='boolean'||v.kind!=='map')return invalidModel('requires canonical map');return v;
}
function family(v:CanonicalValue,ns:bigint):TypedIdentifierValue {
  const value=id(v);if(value.namespaceId!==ns)return invalidModel('wrong regulatory identity family');return value;
}
function gcd(a:bigint,b:bigint):bigint {a=a<0n?-a:a;while(b){const r=a%b;a=b;b=r;}return a;}

/** Registry entries are a canonical set selected by the owning closed factory matrix.
 * Content is an internal compiled capability, never caller-provided executable authority.
 */
export function compileRegulatoryReferences(entryBytes:Uint8Array,content:Content){
  try{return compile(entryBytes,content);}catch(error){
    return invalidModel(error instanceof Error?error.message:String(error));
  }
}
function compile(entryBytes:Uint8Array,content:Content){
  const entries=dataItems(decodeCampaign2(entryBytes),'set');
  const roleBytes=content.recordRole(281n,1n);
  if(entries.length){
    if(!roleBytes)invalidModel('missing REG CharacterId role');
    const role=rec(decodeCampaign2(roleBytes!),263n);
    if(u(f(role,1n))!==1002n||key(f(role,2n))!==key({kind:'typedIdentifier',namespaceId:1021n,payload:{kind:'text',value:'validator/character-qualification'}}))invalidModel('wrong REG CharacterId role');
  }
  const characters=dataItems(decodeCampaign2(content.canonicalBytes),'set').map(v=>{
    const character=semanticReferentFromAuthoredContent(id(f(rec(v,170n),1n)));
    content.qualifyCharacter(character);return key(character);
  }).sort();
  const variables=new Map<string,{
    definition:RecordValue;minimum:bigint;maximum:bigint;
    rawCharacters:MapValue;rawParameters:MapValue;
    parameters:Map<string,LinearRateParameters>;anchors:Map<string,LinearAnalyticalAnchor>;
    registry?:LinearParameterRegistry;
  }>();
  // Closed entry dispatch precedes the eleven semantic passes.
  for(const v of entries){
    const entry=rec(v,171n),variable=family(f(entry,1n),1029n),kind=family(f(entry,2n),1023n);
    if(dataText(kind.payload)!=='registry/regulatory-variable'||dataText(f(entry,3n))!=='regulatory-reference/0.5-candidate')invalidModel('unadmitted REG registry kind/version');
    if(variables.has(key(variable)))invalidModel('duplicate regulatory variable');
    const registration=rec(f(entry,4n),283n),definition=rec(f(registration,1n),280n),reference=rec(f(registration,2n),282n);
    variables.set(key(variable),{definition,minimum:integer(f(definition,2n)),maximum:integer(f(definition,3n)),rawCharacters:mapping(f(reference,1n)),rawParameters:mapping(f(reference,2n)),parameters:new Map(),anchors:new Map()});
  }
  // Pass order is part of REG: complete each pass in canonical entry/key order.
  for(const v of variables.values())if(u(f(v.definition,1n))===0n||v.minimum>v.maximum)invalidModel('invalid regulatory interval/scale'); // 1
  for(const v of variables.values())for(const [k] of v.rawCharacters.entries){rec(k,281n);content.validateRecordRoles(canonicalEncode(k));} // 2
  for(const v of variables.values())for(const [k,value] of v.rawParameters.entries){ // 3
    id(k);const p=rec(value,120n);
    v.parameters.set(key(k),{parameterIdentity:id(f(p,1n)),rate:integer(f(p,2n)),scale:u(f(p,3n)),valueMinimum:integer(f(p,4n)),valueMaximum:integer(f(p,5n))});
  }
  for(const v of variables.values())for(const [k,p] of v.parameters)if(k!==key(p.parameterIdentity))invalidModel('parameter key/identity mismatch'); // 4
  for(const v of variables.values())for(const [k,value] of v.rawCharacters.entries){ // 5
    const a=rec(value,121n),governing=id(f(a,3n));
    if(!v.parameters.has(key(governing)))invalidModel('unresolved local parameter');
    v.anchors.set(key(f(rec(k,281n),1n)),{valueAtAnchor:integer(f(a,1n)),anchorInstant:u(f(a,2n)) as LinearAnalyticalAnchor['anchorInstant'],governingParameterIdentity:governing,exactBoundedRemainder:u(f(a,4n))});
  }
  for(const v of variables.values()){
    const used=new Set([...v.anchors.values()].map(a=>key(a.governingParameterIdentity)));
    if(used.size!==v.parameters.size)invalidModel('unused REG parameter'); // 6
  }
  for(const v of variables.values())for(const p of v.parameters.values())if(p.valueMinimum!==v.minimum||p.valueMaximum!==v.maximum)invalidModel('parameter/variable bounds differ'); // 7
  for(const v of variables.values())if(JSON.stringify([...v.anchors.keys()].sort())!==JSON.stringify(characters))invalidModel('REG character set is not exact committed content image'); // 8
  const owners=new Set<string>();
  for(const v of variables.values()){ // 9
    for(const [k,p] of v.parameters){family(p.parameterIdentity,1030n);if(owners.has(k))invalidModel('REG parameter has multiple variable owners');owners.add(k);}
    for(const a of v.anchors.values())family(a.governingParameterIdentity,1030n);
  }
  for(const v of variables.values()){ // 10
    v.registry=new LinearParameterRegistry([...v.parameters.values()]);
    for(const p of v.parameters.values())if((p.rate===0n&&p.scale!==1n)||(p.rate!==0n&&gcd(p.rate,p.scale)!==1n))invalidModel('noncanonical REG rate');
    for(const a of v.anchors.values())if(a.anchorInstant!==0n||a.exactBoundedRemainder!==0n)invalidModel('REG authored anchor must start at zero with zero remainder');
  }
  for(const v of variables.values())for(const a of v.anchors.values()){ // 11
    materializeLinear(a,simInstant(0n),v.registry!);materializeLinear(a,simInstant(INT64_MAX),v.registry!);
  }
  function resolve(character:CanonicalValue,variable:CanonicalValue){
    const v=variables.get(key(variable));if(!v)return undefined;
    content.qualifyCharacter(character);
    const anchor=v.anchors.get(key(character));if(!anchor)return invalidModel('missing qualifying REG character');
    return {v,anchor};
  }
  return Object.freeze({
    hasVariable(variable:CanonicalValue):boolean {return variables.has(key(variable));},
    referenceOperatingPoint(character:CanonicalValue,variable:CanonicalValue,at:bigint):ReferenceResult {
      const resolved=resolve(character,variable);if(!resolved)return {kind:'Failure',code:'REG_UNKNOWN_VARIABLE'};
      return {kind:'ReferenceValue',value:signed(materializeLinear(resolved.anchor,simInstant(at),resolved.v.registry!).value)};
    },
    validateAdaptedReference(character:CanonicalValue,variable:CanonicalValue,at:bigint,displacement:CanonicalValue):AdaptedReferenceValidationResult {
      const resolved=resolve(character,variable);if(!resolved)return {kind:'Failure',code:'REG_UNKNOWN_VARIABLE'};
      const d=integer(displacement),r0=materializeLinear(resolved.anchor,simInstant(at),resolved.v.registry!).value,total=r0+d;
      return total<resolved.v.minimum||total>resolved.v.maximum?{kind:'Failure',code:'REG_ADAPTED_REFERENCE_OUT_OF_RANGE'}:{kind:'Valid'};
    },
  });
}
