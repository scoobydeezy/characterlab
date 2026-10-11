/** ADAPT F: fixed topology/domain construction and timeless stored-state validation.
 * adaptation-input/0.31-candidate. Does not evaluate rules or REG references.
 */
import {canonicalEncode,typedIdentifier,text,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SchedulerContractError} from '../substrate/scheduler';
import {AuthoritativeState,StateContractError,statePathPatternValue,statePathValue,type StatePathPattern,type StatePath} from '../substrate/state';
import {decodeCampaign2} from './codecs';
import {dataRecord as rec,dataField as f,dataUnsigned as u,dataIdentity as id,dataText as txt,dataItems as items,dataKey as key,invalidModel} from './canonicalData';
import type {compileCampaign2StateModel} from './stateModel';
import type {compileRegulatoryReferences} from './regulatoryReference';
import type {compileValDeclarations} from './valDeclarations';
const VERSION='adaptation-input/0.31-candidate';
const atom=(ns:bigint,name:string)=>typedIdentifier(ns,text(name));
const familyNames=['belief-expectation','episodic-memory','associations','values','procedural-skill','habits','person-model','relationships','regulatory-adaptation','identity-disposition'];
const leafSpecs=[
 {name:'leaf/tolerance',root:302n,field:1n,key:292n,value:297n,domain:1n,owner:'authority/regulatory-adaptation'},
 {name:'leaf/sensitization',root:302n,field:2n,key:293n,value:298n,domain:1n,owner:'authority/regulatory-adaptation'},
 {name:'leaf/regulatory-displacement',root:302n,field:3n,key:294n,value:299n,domain:2n,owner:'authority/regulatory-adaptation'},
 {name:'leaf/accumulated-load',root:302n,field:4n,key:295n,value:300n,domain:3n,owner:'authority/regulatory-adaptation'},
 {name:'leaf/procedural-competence',root:303n,field:1n,key:296n,value:301n,domain:4n,owner:'authority/procedural-skill'},
] as const;
function entries(value:CanonicalValue){if(typeof value==='boolean'||value.kind!=='map')return invalidModel('expected canonical map');return value.entries;}
function family(value:CanonicalValue,ns:bigint){const v=id(value);if(v.namespaceId!==ns)invalidModel('wrong adaptation identity family');return v;}
const bad=(message:string):never=>{throw new StateContractError('INVALID_VALUE',message);};
export function compileAdaptationDomains(declarationBytes:Uint8Array,stateModel:ReturnType<typeof compileCampaign2StateModel>,reg:ReturnType<typeof compileRegulatoryReferences>,content:Awaited<ReturnType<ReturnType<typeof compileValDeclarations>['compileContent']>>){
  const definitions=new Map<string,CanonicalValue>(),loads=new Map<string,{scale:bigint;maximum?:bigint}>(),procedures=new Map<string,bigint>(),scales=new Map<string,bigint>();
  let topology:CanonicalValue|undefined;
  for(const raw of items(decodeCampaign2(declarationBytes),'set')){
    const e=rec(raw,171n),stable=id(f(e,1n)),kind=txt(family(f(e,2n),1023n).payload),definition=f(e,4n);
    if(txt(f(e,3n))!==VERSION||definitions.has(key(stable)))invalidModel('wrong version or duplicate adaptation definition');definitions.set(key(stable),definition);
    if(kind==='registry/campaign2-state-family'){
      if(topology||key(stable)!==key(atom(1027n,'definition/campaign2-state-families')))invalidModel('wrong/duplicate topology singleton');topology=rec(definition,284n);
    }else if(kind==='registry/adaptation-leaf-family'){
      const spec=leafSpecs.find(s=>key(atom(1032n,s.name))===key(stable));if(!spec)invalidModel('unknown adaptation leaf');
      const domain=rec(f(rec(definition,290n),1n),291n);
      if(u(f(domain,1n))!==spec!.domain)invalidModel('wrong leaf domain source');
      if(spec!.domain===1n){const scale=u(f(domain,2n));if(scale===0n)invalidModel('zero local scale');scales.set(spec!.name,scale);}
    }else if(kind==='registry/load-domain'){
      family(stable,1033n);const d=rec(definition,287n),scale=u(f(d,1n)),capacity=rec(f(d,2n),288n),maximum=u(f(capacity,1n))===2n?u(f(capacity,2n)):undefined;
      if(scale===0n||maximum===0n)invalidModel('load domain requires positive scale/capacity');loads.set(key(stable),{scale,maximum});
    }else if(kind==='registry/procedure'){
      family(stable,1034n);const scale=u(f(rec(definition,289n),1n));if(scale===0n)invalidModel('procedure requires positive scale');procedures.set(key(stable),scale);
    }else invalidModel('entry outside ADAPT topology/domain compiler');
  }
  if(!topology)invalidModel('missing state-family singleton');
  const physical=stateModel.declaredFamilies().filter(v=>v.pattern.rootStateTypeId===302n||v.pattern.rootStateTypeId===303n);
  if(physical.length!==5)invalidModel('ADAPT roots require exactly five physical families');
  const families=entries(f(rec(topology!,284n),1n));
  const actual=families.map(([v])=>key(v)).sort(),expected=familyNames.map(n=>key(atom(1031n,n))).sort();
  if(JSON.stringify(actual)!==JSON.stringify(expected))invalidModel('requires exact ten logical state families');
  for(const [familyId,value] of families){
    const name=txt(family(familyId,1031n).payload),d=rec(value,285n),storage=rec(f(d,2n),286n),materialized=['regulatory-adaptation','procedural-skill'].includes(name);
    if(key(f(d,1n))!==key(atom(1026n,materialized?'route/automatic-adaptation':'route/character-learning'))||u(f(storage,1n))!==(materialized?2n:1n))invalidModel('wrong family route/storage');
    if(!materialized)continue;
    const root=name==='regulatory-adaptation'?302n:303n,specs=leafSpecs.filter(s=>s.root===root);
    if(u(f(storage,2n))!==root)invalidModel('wrong materialized root');
    const fields=entries(f(storage,3n));
    if(fields.length!==specs.length)invalidModel('missing/extra materialized leaf');
    for(const spec of specs){
      if(!fields.some(([leaf,field])=>key(leaf)===key(atom(1032n,spec.name))&&u(field)===spec.field))invalidModel('wrong leaf/field mapping');
      if(!definitions.has(key(atom(1032n,spec.name))))invalidModel('missing leaf domain definition');
      const pattern:StatePathPattern={rootStateTypeId:spec.root,fieldId:spec.field,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]};
      const declared=stateModel.family(canonicalEncode(statePathPatternValue(pattern)));
      if(!declared||declared.readonly||!declared.removalAllowed||declared.owner!==spec.owner||declared.keyGrammar?.tag!==2n||declared.keyGrammar.typeId!==spec.key||declared.grammar.kind!=='canonical-record'||declared.grammar.recordTypeId!==spec.value)
        invalidModel('ADAPT topology disagrees with owning state/key/value/removal declaration');
      const namespaces=spec.key===292n||spec.key===293n?[1002n,1002n,1029n]:[1002n,spec.key===294n?1029n:spec.key===295n?1033n:1034n];
      namespaces.forEach((namespace,index)=>{
        const roleBytes=content.recordRole(spec.key,BigInt(index+1));if(!roleBytes)invalidModel('missing ADAPT key role');
        const role=rec(decodeCampaign2(roleBytes!),263n),validator=role.fields.get(2n);
        if(u(f(role,1n))!==namespace||(index===0?validator===undefined||key(validator)!==key(atom(1021n,'validator/character-qualification')):validator!==undefined))invalidModel('wrong ADAPT key role');
      });
    }
  }
  return Object.freeze({
    hasLoad(value:CanonicalValue):boolean{return loads.has(key(value));},
    hasProcedure(value:CanonicalValue):boolean{return procedures.has(key(value));},
    /** Internal construction lookup; no independently supplied domain metadata. */
    leaf(value:CanonicalValue){const spec=leafSpecs.find(s=>key(atom(1032n,s.name))===key(value));return spec?{...spec,scale:scales.get(spec.name)}:undefined;},
    validateMagnitude(path:StatePath,magnitude:bigint,at:bigint):void {
      stateModel.validatePath(path);
      const spec=leafSpecs.find(s=>s.root===path.rootStateTypeId&&s.field===path.fieldId);
      if(!spec||path.selectors.length!==1||path.selectors[0].kind!=='mapKey')bad('unknown magnitude path');
      const selector=path.selectors[0] as Extract<typeof path.selectors[number],{kind:'mapKey'}>,k=rec(selector.key,spec!.key);
      if(spec!.domain===2n){
        const result=reg.validateAdaptedReference(f(k,1n),f(k,2n),at,signed(magnitude));
        if(result.kind==='Failure')throw new SchedulerContractError(result.code==='REG_UNKNOWN_VARIABLE'?'ADAPTATION_REFERENCE_UNKNOWN_VARIABLE':'ADAPTATION_REFERENCE_OUT_OF_RANGE',result.code);
      }else{
        const maximum=spec!.value===297n?scales.get(spec!.name):spec!.domain===3n?loads.get(key(f(k,2n)))?.maximum:undefined;
        if(magnitude<0n||(maximum!==undefined&&magnitude>maximum))throw new SchedulerContractError('ADAPTATION_MAGNITUDE_OUT_OF_RANGE','magnitude lies outside its declared lattice domain');
      }
    },
    validateReferences(state:AuthoritativeState,at:bigint):void {
      for(const entry of state.entries().filter(e=>e.path.rootStateTypeId===302n&&e.path.fieldId===3n).sort((a,b)=>pathKey(a.path)<pathKey(b.path)?-1:1)){
        stateModel.validatePath(entry.path);
        const selector=entry.path.selectors[0];if(selector.kind!=='mapKey')bad('invalid displacement key');
        const k=rec((selector as Extract<typeof selector,{kind:'mapKey'}>).key,294n);
        const result=reg.validateAdaptedReference(f(k,1n),f(k,2n),at,f(rec(entry.value,299n),1n));
        if(result.kind==='Failure')throw new SchedulerContractError(result.code==='REG_UNKNOWN_VARIABLE'?'ADAPTATION_REFERENCE_UNKNOWN_VARIABLE':'ADAPTATION_REFERENCE_OUT_OF_RANGE',result.code);
      }
    },
    validateStatic(state:AuthoritativeState):void {
      const stored=state.entries().filter(e=>e.path.rootStateTypeId===302n||e.path.rootStateTypeId===303n);
      // Authoritative ordering uses full canonical StatePath bytes below, never family names.
      stored.sort((a,b)=>pathKey(a.path)<pathKey(b.path)?-1:pathKey(a.path)>pathKey(b.path)?1:0);
      for(const entry of stored){
        stateModel.validatePath(entry.path);
        const spec=leafSpecs.find(s=>s.root===entry.path.rootStateTypeId&&s.field===entry.path.fieldId);
        if(!spec||entry.path.selectors.length!==1||entry.path.selectors[0].kind!=='mapKey')throw new StateContractError('INVALID_PATH','foreign ADAPT state path');
        const selector=entry.path.selectors[0] as Extract<typeof entry.path.selectors[number],{kind:'mapKey'}>;
        const k=rec(selector.key,spec!.key),domain=f(k,spec!.key===292n||spec!.key===293n?3n:2n);
        if(spec!.domain===1n||spec!.domain===2n){if(!reg.hasVariable(domain))bad('unknown regulatory variable');}
        else if(spec!.domain===3n){if(!loads.has(key(domain)))bad('unknown load domain');}
        else if(!procedures.has(key(domain)))bad('unknown procedure');
        // State model owns exact value schema and recursive role checks after path validation.
        stateModel.read(state,entry.path);
        const v=entry.value;if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==spec!.value)bad('wrong ADAPT value schema');
        const magnitude=f(rec(v,spec!.value),1n);
        if(typeof magnitude==='boolean'||(magnitude.kind!=='signed'&&magnitude.kind!=='unsigned'))bad('wrong magnitude grammar');
        const n=(magnitude as {value:bigint}).value;
        if(n===0n)bad('explicit baseline entry');
        if(spec!.value!==299n&&n<0n)bad('negative unsigned magnitude');
        if(spec!.name==='leaf/tolerance'&&n>scales.get(spec!.name)!)bad('tolerance exceeds scale');
        const maximum=spec!.domain===3n?loads.get(key(domain))!.maximum:undefined;
        if(maximum!==undefined&&n>maximum)bad('load exceeds capacity');
      }
    },
  });
}
function pathKey(path:StatePath){return key(statePathValue(path));}
