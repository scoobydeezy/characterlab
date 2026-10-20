/** FCT-3: projection/0.3-candidate-addendum and the accepted WRT validation prefix.
 * Internal compiler over committed declaration fragments; not an activation facade.
 */
import {canonicalEncode,list,record,unsigned,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,StateContractError,applyStatePatch,patternMatches,patternsIntersect,
  restoreStatePath,restoreAuthoritativeState,statePathValue,statePathPatternValue,stateSchemas,type StatePath,type StatePathPattern,type StatePatch} from '../substrate/state';
import {compileMutationAuthorityRegistry,leafValueValidator,MUTATION_AUTHORITY_CONTRACT_VERSION,
  type LeafValueGrammar,type MutationAuthorityDefinition} from '../substrate/mutationAuthority';
import {decodeCampaign2,campaign2SchemaByType} from './codecs';
import {SchedulerContractError} from '../substrate/scheduler';
import type {compileValDeclarations} from './valDeclarations';
import {dataRecord as rec,dataField as field,dataUnsigned as u,dataText as txt,dataIdentity as id,dataItems as items,dataKey as key,invalidModel} from './canonicalData';

type ContentContext=Awaited<ReturnType<ReturnType<typeof compileValDeclarations>['compileContent']>>;
interface Family {pattern:StatePathPattern;grammar:LeafValueGrammar;readonly:boolean;owner?:string;removalAllowed?:boolean;keyGrammar?:{tag:bigint;typeId?:bigint};}

export function decodeStatePattern(value:CanonicalValue):StatePathPattern {
  const r=rec(value,149n),root=u(field(r,1n)),fieldId=u(field(r,2n));
  const selectors=items(field(r,3n),'list').map(value=>{
    if(typeof value!=='boolean'&&value.kind==='record'&&value.schema.typeId===150n){
      const kind=txt(field(rec(value,150n),1n));
      if(!['mapKey','typedEntity','stableListItem'].includes(kind))invalidModel('unknown selector wildcard');
      return {kind:'wildcard' as const,selectorKind:kind as 'mapKey'|'typedEntity'|'stableListItem'};
    }
    const path=restoreStatePath(record(stateSchemas.statePath,new Map([[1n,unsigned(root)],[2n,unsigned(fieldId)],[3n,list([value])]])));
    return {kind:'exact' as const,selector:path.selectors[0]};
  });
  const result={rootStateTypeId:root,fieldId,selectors};statePathPatternValue(result);return result;
}
function valueGrammar(value:CanonicalValue,schema=campaign2SchemaByType):LeafValueGrammar {
  const r=rec(value,152n),tag=u(field(r,1n));
  if(tag===3n){const typeId=u(field(r,2n));schema(typeId);return {kind:'canonical-record',recordTypeId:typeId};}
  if(r.fields.has(2n))invalidModel('unexpected value grammar record operand');
  if(tag===1n)return {kind:'unsigned-counter'};
  if(tag===2n)return {kind:'membership-marker'};
  return invalidModel('unsupported leaf value grammar');
}
const hasMapKey=(p:StatePathPattern)=>p.selectors.some(s=>s.kind==='wildcard'?s.selectorKind==='mapKey':s.selector.kind==='mapKey');
const patternKey=(p:StatePathPattern)=>key(statePathPatternValue(p));

export function compileCampaign2StateModel(
  ownershipBytes:Uint8Array,readOnlyBytes:Uint8Array,keyGrammarBytes:Uint8Array,content:ContentContext,
  codec={decode:decodeCampaign2,schema:campaign2SchemaByType},
){
  const ownership=rec(codec.decode(ownershipBytes),155n);
  if(txt(field(ownership,1n))!==MUTATION_AUTHORITY_CONTRACT_VERSION)invalidModel('unsupported ownership version');
  const definitions:MutationAuthorityDefinition[]=items(field(ownership,2n),'set').map(value=>{
    const r=rec(value,154n),authority=id(field(r,1n));
    if(authority.namespaceId!==1025n)invalidModel('wrong mutation authority namespace');
    return {authorityName:txt(authority.payload),ownedLeaves:items(field(r,2n),'set').map(value=>{
      const leaf=rec(value,153n),removal=field(leaf,3n);
      if(typeof removal!=='boolean')invalidModel('removal permission must be boolean');
      return {pattern:decodeStatePattern(field(leaf,1n)),valueGrammar:valueGrammar(field(leaf,2n),codec.schema),removalAllowed:removal as boolean};
    })};
  });
  const owned=compileMutationAuthorityRegistry(definitions);
  const families:Family[]=definitions.flatMap(d=>d.ownedLeaves.map(l=>({pattern:l.pattern,grammar:l.valueGrammar,readonly:false,owner:d.authorityName,removalAllowed:l.removalAllowed})));
  for(const value of items(codec.decode(readOnlyBytes),'set')){
    const r=rec(value,262n),family={pattern:decodeStatePattern(field(r,1n)),grammar:valueGrammar(field(r,2n),codec.schema),readonly:true};
    if(families.some(f=>patternsIntersect(f.pattern,family.pattern)))invalidModel('read-only family overlaps another family');
    families.push(family);
  }
  const grammars=new Map<string,{tag:bigint;typeId?:bigint}>();
  for(const value of items(codec.decode(keyGrammarBytes),'set')){
    const r=rec(value,261n),pattern=decodeStatePattern(field(r,1n)),g=rec(field(r,2n),260n),pkey=patternKey(pattern);
    if(grammars.has(pkey))invalidModel('duplicate key grammar pattern');
    const tag=u(field(g,1n)),typeId=tag===2n?u(field(g,2n)):undefined;
    if(typeId!==undefined)codec.schema(typeId);
    grammars.set(pkey,{tag,typeId});
  }
  const keyed=families.filter(f=>hasMapKey(f.pattern));
  if(keyed.length!==grammars.size)invalidModel('key grammar/family coverage mismatch');
  for(const family of keyed){
    family.keyGrammar=grammars.get(patternKey(family.pattern));
    if(!family.keyGrammar)invalidModel('missing keyed-family grammar');
  }
  // IDN owns the meaning of its one optional materialized family. Presence does not create
  // observers/characters; when declared, its immutable shape and both exact roles are mandatory.
  for(const family of families.filter(f=>f.pattern.rootStateTypeId===268n)){
    const p=family.pattern,s=p.selectors[0];
    if(p.fieldId!==1n||p.selectors.length!==1||s.kind!=='wildcard'||s.selectorKind!=='mapKey'
      ||!family.readonly||family.grammar.kind!=='canonical-record'||family.grammar.recordTypeId!==267n||family.keyGrammar?.tag!==1n)
      invalidModel('IDN binding family requires its exact immutable identity-key/record-value shape');
    const mapRole=content.mapKeyRole(268n,1n),characterRole=content.recordRole(267n,1n);
    if(!mapRole||!characterRole)invalidModel('IDN requires both canonical roles');
    const observer=rec(codec.decode(mapRole!),263n),character=rec(codec.decode(characterRole!),263n);
    if(u(field(observer,1n))!==1000n||observer.fields.has(2n)||u(field(character,1n))!==1002n||!character.fields.has(2n))invalidModel('IDN role declaration mismatch');
    const validator=id(field(character,2n));
    if(validator.namespaceId!==1021n||txt(validator.payload)!=='validator/character-qualification')invalidModel('IDN character validator mismatch');
  }
  function validatePath(path:StatePath):void {
    statePathValue(path); // WRT syntax remains the first boundary.
    const family=families.find(f=>patternMatches(f.pattern,path));
    for(const selector of path.selectors){
      if(selector.kind!=='mapKey')continue;
      const value=selector.key,g=family?.keyGrammar;
      if(g){
        if(g.tag===1n&&(typeof value==='boolean'||value.kind!=='typedIdentifier'))throw new StateContractError('INVALID_PATH','key requires an identity atom');
        if(g.tag===2n&&(typeof value==='boolean'||value.kind!=='record'||value.schema.typeId!==g.typeId))throw new StateContractError('INVALID_PATH','key requires its exact record type');
      }
    }
    // All key shapes precede role interpretation; no invalid key becomes an absent lookup.
    for(const selector of path.selectors){
      if(selector.kind!=='mapKey')continue;
      const value=selector.key;
      if(typeof value!=='boolean'&&value.kind==='typedIdentifier'){
        const role=content.mapKeyRole(path.rootStateTypeId,path.fieldId);
        if(role)content.validateRole(canonicalEncode(value),role);
      }else content.validateRecordRoles(canonicalEncode(value));
    }
  }
  function validateValue(family:Family,value:CanonicalValue):void {
    try{leafValueValidator(family.grammar)(value);}catch(error){throw new StateContractError('INVALID_VALUE',String(error));}
    content.validateRecordRoles(canonicalEncode(value));
  }
  class PrjAuthorityRegistry extends StateAuthorityRegistry {
    override resolveWritableLeaf(path:StatePath){validatePath(path);return super.resolveWritableLeaf(path);}
  }
  const writable=owned.writableLeaves.map(leaf=>({...leaf,validateValue:(value:CanonicalValue)=>{
    const family=families.find(f=>patternKey(f.pattern)===patternKey(leaf.pattern))!;validateValue(family,value);
  }}));
  const authority=new PrjAuthorityRegistry(writable,owned.authorities);
  function validateState(state:AuthoritativeState):void {
    for(const entry of state.entries()){
      validatePath(entry.path);
      const family=families.find(f=>patternMatches(f.pattern,entry.path));
      if(!family)throw new StateContractError('INVALID_PATH','state leaf has no declared family');
      validateValue(family,entry.value);
    }
  }
  return Object.freeze({
    declaredFamilies(){return structuredClone(families);},
    validatePath,
    validateState,
    restorePath(bytes:Uint8Array):StatePath {const path=restoreStatePath(codec.decode(bytes));validatePath(path);return path;},
    restoreState(bytes:Uint8Array):AuthoritativeState {const state=restoreAuthoritativeState(codec.decode(bytes));validateState(state);return state;},
    read(state:AuthoritativeState,path:StatePath){
      validatePath(path);const result=state.read(path);
      if(result.presence){const family=families.find(f=>patternMatches(f.pattern,path));if(family)validateValue(family,result.value!);}
      return result;
    },
    applyPatch(state:AuthoritativeState,patch:StatePatch,authorityId:TypedIdentifierValue,scope?:{readonly writableRoots:readonly bigint[];readonly targetPaths:readonly StatePath[]}){
      if(!scope)return applyStatePatch(state,patch,authorityId,authority);
      // ADAPT B inserts data-derived checks after the existing PRJ/WRT prefix,
      // before expected-old/removal/value validation. No executor callback.
      const roots=[...scope.writableRoots],targets=new Set(scope.targetPaths.map(p=>key(statePathValue(p))));
      class ScopedAuthority extends PrjAuthorityRegistry {
        override validateAuthority(owner:TypedIdentifierValue,path:StatePath){
          super.validateAuthority(owner,path);
          if(!roots.includes(path.rootStateTypeId))throw new SchedulerContractError('TRANSITION_WRITE_SCOPE_VIOLATION','write is outside transition families');
          if(!targets.has(key(statePathValue(path))))throw new SchedulerContractError('ADAPTATION_TARGET_PATH_VIOLATION','write differs from resolved rule target');
        }
      }
      return applyStatePatch(state,patch,authorityId,new ScopedAuthority(writable,owned.authorities));
    },
    family(patternBytes:Uint8Array){
      const p=decodeStatePattern(codec.decode(patternBytes)),f=families.find(f=>patternKey(f.pattern)===patternKey(p));
      return f?structuredClone(f):undefined;
    },
  });
}
