/** Closed VAL definition compiler; not a model factory or character-origin resolver. */
import {canonicalEncode,bytesToHex,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SchedulerContractError} from '../substrate/scheduler';
import {ContentValidationError,compileGovernedContentManifest,type GovernedContentInput} from '../substrate/contentManifest';
import {decodeCampaign2,campaign2SchemaByType} from './codecs';
import {validateSemanticReferent} from '../substrate/referentOrigin';
import {StateContractError} from '../substrate/state';

type R = Extract<CanonicalValue,{kind:'record'}>;
type Id = Extract<CanonicalValue,{kind:'typedIdentifier'}>;
const key=(v:CanonicalValue)=>bytesToHex(canonicalEncode(v));
const invalid=(message:string):never=>{throw new SchedulerContractError('INVALID_CONFIGURATION',message);};
function declarationValue(bytes:Uint8Array):CanonicalValue {
  try{return decodeCampaign2(bytes);}catch(error){return invalid(error instanceof Error?error.message:String(error));}
}
function asRecord(v:CanonicalValue,id:bigint):R {
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==id||v.schema.schemaVersion!==1n)invalid(`requires ${id}/1`);
  return v as R;
}
function field(r:R,n:bigint):CanonicalValue {return r.fields.get(n)??invalid(`missing field ${n}`);}
function asId(v:CanonicalValue):Id {if(typeof v==='boolean'||v.kind!=='typedIdentifier')invalid('requires typed ID');return v as Id;}
function asText(v:CanonicalValue):string {if(typeof v==='boolean'||v.kind!=='text')invalid('requires text');return (v as {value:string}).value;}
function asUnsigned(v:CanonicalValue):bigint {if(typeof v==='boolean'||v.kind!=='unsigned')invalid('requires unsigned');return (v as {value:bigint}).value;}
function exactId(v:CanonicalValue,ns:bigint,payload:string):void {
  const id=asId(v);if(id.namespaceId!==ns||asText(id.payload)!==payload)invalid('unadmitted identity');
}
function collection(v:CanonicalValue,kind:'list'|'set'):readonly CanonicalValue[] {
  if(typeof v==='boolean'||v.kind!==kind)invalid(`requires ${kind}`);
  return (v as {items:readonly CanonicalValue[]}).items;
}

/** These inputs are the VAL entries and complete role-bearing declarations selected by the
 * owning factory's closed registry matrix. No callback or origin namespace option is accepted.
 * Coverage is computed from actual declared role positions, not an external list of validator IDs.
 */
export function compileValDeclarations(entryBytes:Uint8Array,declarationBytes:Uint8Array,
  codec={decode:decodeCampaign2,schema:campaign2SchemaByType}) {
  // Internal version-specific schema context, never supplied by a public factory caller.
  const declarationValue=(bytes:Uint8Array):CanonicalValue=>{try{return codec.decode(bytes);}catch(error){return invalid(error instanceof Error?error.message:String(error));}};
  const entries=collection(declarationValue(entryBytes),'set');
  const declarations=declarationValue(declarationBytes);
  let characterKind:Id|undefined,characterValidator:Id|undefined;
  const ids=new Set<string>();
  for(const raw of entries){
    const e=asRecord(raw,171n),id=asId(field(e,1n)),kind=asId(field(e,2n)),version=asText(field(e,3n)),d=field(e,4n);
    if(ids.has(key(id)))invalid('duplicate StableId');ids.add(key(id));
    if(kind.namespaceId!==1023n)invalid('wrong RegistryKind namespace');
    switch(asText(kind.payload)){
      case 'registry/semantic-kind': {
        exactId(id,1004n,'semantic-kind/character');if(version!=='content-kind/0.1-candidate')invalid('unsupported kind version');
        const ref=asRecord(field(asRecord(d,329n),1n),254n);
        if(asUnsigned(field(ref,1n))!==170n||asUnsigned(field(ref,2n))!==1n)invalid('unsupported content schema');
        characterKind=id;break;
      }
      case 'registry/domain-validator': {
        exactId(id,1021n,'validator/character-qualification');if(version!=='governed-domain-validator/0.1-candidate')invalid('unsupported domain version');
        exactId(field(asRecord(d,330n),1n),1004n,'semantic-kind/character');characterValidator=id;break;
      }
      default:invalid('entry is outside the VAL definition compiler');
    }
  }
  const referenced=new Set<string>();
  const constraints=new Map<string,{position:R;role:R}>();
  function role(v:CanonicalValue){
    const r=asRecord(v,263n),validator=r.fields.get(2n);
    if(validator!==undefined){exactId(validator,1021n,'validator/character-qualification');
      if(asUnsigned(field(r,1n))!==1002n)invalid('character validator requires namespace 1002');referenced.add(key(validator));}
  }
  function visit(v:CanonicalValue):void{
    if(typeof v==='boolean')return;
    if(v.kind==='record'){
      const position=({265:2n,266:4n,278:2n} as Record<number,bigint>)[Number(v.schema.typeId)];
      if(position!==undefined)role(field(v,position));
      if(v.schema.typeId===265n){
        const p=asRecord(field(v,1n),264n),pkey=key(p);
        if(constraints.has(pkey))invalid('duplicate canonical role position');
        const tag=asUnsigned(field(p,1n));
        const typeId=asUnsigned(field(p,tag===1n?2n:3n)),fieldId=asUnsigned(field(p,4n));
        let schema;try{schema=codec.schema(typeId);}catch{invalid('unknown role position record type');}
        if(!schema!.fields.some(f=>f.id===fieldId))invalid('unknown role position field');
        constraints.set(pkey,{position:p,role:asRecord(field(v,2n),263n)});
      }
      for(const x of v.fields.values())visit(x);
    }else if(v.kind==='list'||v.kind==='set')v.items.forEach(visit);
    else if(v.kind==='map')for(const [k,x] of v.entries){visit(k);visit(x);}
    // Typed identifier payloads are not role-declaration containers.
  }
  visit(declarations);
  if(referenced.size!==(characterValidator?1:0)||(characterValidator&&!referenced.has(key(characterValidator))))invalid('referenced/declared validator mismatch');
  if(characterValidator&&!characterKind)invalid('missing required semantic-kind definition');

  // Only detached canonical entry values leave this component. Its executable decisions are fixed.
  const canonicalEntries=canonicalEncode(set(entries));
  return Object.freeze({
    entryBytes:()=>canonicalEntries.slice(),
    async compileContent(contentBytes:Uint8Array,completeRegistryBytes:Uint8Array){
      const registryValues=collection(declarationValue(completeRegistryBytes),'set');
      const registryIds:Id[]=[];const registered=new Map<string,CanonicalValue>();
      for(const v of registryValues){
        if(typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===172n)continue;
        const e=asRecord(v,171n),id=asId(field(e,1n));if(registered.has(key(id)))invalid('duplicate registry ID');registered.set(key(id),v);registryIds.push(id);
      }
      for(const e of entries){const expected=asRecord(e,171n),found=registered.get(key(field(expected,1n)));
        if(found===undefined||key(found)!==key(e))invalid('VAL declarations differ from complete registry');}
      const values=collection(codec.decode(contentBytes),'set');
      const inputs:GovernedContentInput[]=values.map(v=>{
        const r=asRecord(v,170n);const kind=asId(field(r,2n));
        if(!characterKind||key(kind)!==key(characterKind))throw new ContentValidationError('unsupported content semantic kind');
        return {stableId:asId(field(r,1n)),semanticKind:kind,declaredInputs:field(r,3n),declaredOutputs:field(r,4n),preconditions:field(r,5n),worldEffects:field(r,6n),unitsDomainsBounds:field(r,7n),epistemicVisibility:field(r,8n),observationAffordances:field(r,9n),lifecycle:field(r,10n),referencedRegistryIds:collection(field(r,11n),'list').map(asId),referencedContentIds:collection(field(r,12n),'list').map(asId),validationInvariants:field(r,13n),sourceProvenance:field(r,14n),changeHistory:field(r,15n),formalSeamMappings:field(r,16n)};
      });
      // Generic CONTENT checks are reused. The sole internal predicate has no extra character
      // fields: exact canonical schema, kind and reference closure have already been checked.
      const commitment=await compileGovernedContentManifest(inputs,registryIds,characterKind?[{semanticKindId:characterKind,validate:()=>{}}]:[]);
      // Content is already detached and duplicate-free. Resolve the complete typed StableId;
      // this is a content index, not an origin binding registry.
      const contentKinds=new Map(inputs.map(d=>[key(d.stableId),key(d.semanticKind)]));
      function qualifyCharacter(value:CanonicalValue):void {
          validateSemanticReferent(value); // Structural failure precedes the narrower role.
          if(!characterValidator||!characterKind)invalid('character validator is not declared');
          const origin=asId(value.payload);
          if(origin.namespaceId!==1037n||contentKinds.get(key(origin.payload))!==key(characterKind!))
            throw new StateContractError('CANONICAL_ROLE_VIOLATION','referent is not an authored character in committed content');
      }
      function checkRole(value:CanonicalValue,role:R):void {
        if(typeof value==='boolean'||value.kind!=='typedIdentifier'||value.namespaceId!==asUnsigned(field(role,1n)))
          throw new StateContractError('CANONICAL_ROLE_VIOLATION','identity does not satisfy required namespace');
        if(role.fields.has(2n))qualifyCharacter(value);
      }
      function recordRoles(value:CanonicalValue):void {
        if(typeof value==='boolean')return;
        if(value.kind==='record'){
          for(const c of constraints.values()){
            if(asUnsigned(field(c.position,1n))!==1n||asUnsigned(field(c.position,2n))!==value.schema.typeId)continue;
            const v=value.fields.get(asUnsigned(field(c.position,4n)));
            if(v!==undefined){
              try{checkRole(v,c.role);}catch(error){
                if(error instanceof StateContractError){
                  const name=value.schema.fields.find(f=>f.id===asUnsigned(field(c.position,4n)))!.name;
                  throw new StateContractError(error.code,`${value.schema.name}.${name}: ${error.message}`);
                }
                throw error;
              }
            }
          }
          for(const v of value.fields.values())recordRoles(v);
        }else if(value.kind==='list'||value.kind==='set')value.items.forEach(recordRoles);
        else if(value.kind==='map')for(const [k,v] of value.entries){recordRoles(k);recordRoles(v);}
      }
      return Object.freeze({...commitment,qualifyCharacter,
        /** FCT-3 component only: recursive record positions. StateMapKey checks must follow
         * the owning family's StateKeyGrammar check in the state/projection compiler.
         */
        validateRecordRoles(bytes:Uint8Array):void {recordRoles(codec.decode(bytes));},
        recordRole(typeId:bigint,fieldId:bigint):Uint8Array|undefined {
          const found=[...constraints.values()].find(c=>asUnsigned(field(c.position,1n))===1n&&asUnsigned(field(c.position,2n))===typeId&&asUnsigned(field(c.position,4n))===fieldId);
          return found===undefined?undefined:canonicalEncode(found.role);
        },
        mapKeyRole(root:bigint,fieldId:bigint):Uint8Array|undefined {
          const found=[...constraints.values()].find(c=>asUnsigned(field(c.position,1n))===2n&&asUnsigned(field(c.position,3n))===root&&asUnsigned(field(c.position,4n))===fieldId);
          return found===undefined?undefined:canonicalEncode(found.role);
        },
        validateRole(valueBytes:Uint8Array,roleBytes:Uint8Array):void {
          const r=asRecord(declarationValue(roleBytes),263n);
          if(r.fields.has(2n)){
            exactId(field(r,2n),1021n,'validator/character-qualification');
            if(asUnsigned(field(r,1n))!==1002n||!characterValidator)invalid('unadmitted role validator');
          }
          checkRole(codec.decode(valueBytes),r);
        },
      });
    },
  });
}
