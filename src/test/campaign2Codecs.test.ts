import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {describe,it,expect} from 'vitest';
import table from '../../docs/formal/CAMPAIGN2_ALLOCATION_TABLE.json';
import valTable from '../../docs/formal/VAL_ALLOCATION_TABLE.json';
import {campaign2Record,campaign2Schema,campaign2Schemas,campaign2Identifier,campaign2UnionEntries,decodeCampaign2,encodeCampaign2} from '../campaign2/codecs';
import {canonicalEncode,record,unsigned,signed,text,map,set,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SEMANTIC_TYPED_ID_NAMESPACES} from '../semanticBinding/semanticSchemaRegistry';

const definitions=[...table.records,...valTable.records];
const namespaces=new Map([...Object.entries(SEMANTIC_TYPED_ID_NAMESPACES).map(([n,id])=>[n,Number(id)] as const),...table.namespaces.map(n=>[n.name,n.namespace] as const),['CharacterId',1002],['ExposureReferentId',1002],['MutationAuthorityId',1025]]);
function witness(type:string):CanonicalValue {
  if(type==='u')return unsigned(1);if(type==='i')return signed(-1);if(type==='text')return text('test');
  if(type.startsWith('map<'))return map([]);if(type.startsWith('set<'))return set([]);
  if(type==='FactUnion')return value('RegulatoryExposureFact');if(type==='AdaptationLeafValue')return value('ToleranceValue');
  const ns=namespaces.get(type);
  if(ns===1002)return semanticReferentFromAuthoredContent(typedIdentifier(20,text('test')));
  if(ns!==undefined)return typedIdentifier(ns,ns>=1116&&ns<=1121?unsigned(0):text('test'));
  if(definitions.some(d=>d.name===type))return value(type);
  const s=campaign2Schema(type);return record(s,new Map(s.fields.filter(f=>f.required).map(f=>[f.id,unsigned(0)])));
}
function fields(name:string,tag?:number):Record<string,CanonicalValue> {
  const d=definitions.find(d=>d.name===name)!;
  const u=table.unionVariants.find(u=>u.record===name&&(tag===undefined||tag===u.tag));
  const f:Record<string,CanonicalValue>={};
  for(const field of d.fields.filter(f=>u?u.requiredFields.includes(f.id):f.required)) {
    const options=table.finiteValues.find(x=>x.position===name+'.'+field.name);
    f[field.name]=field.name==='VariantTag'?unsigned(u!.tag):options?unsigned(options.value):field.name==='TransformationVersion'?text([269,270].includes(d.typeId)?'character-learning-evidence/0.5-candidate':'adaptation-input/0.31-candidate'):witness(field.type);
  }
  return f;
}
function value(name:string):CanonicalValue{return campaign2Record(name,fields(name));}

describe('FCT-1 frozen allocation codecs (structural, not domain admission)',()=>{
  it('rejects object/proxy byte impostors without executing getters, slice or iteration hooks',()=>{
    let calls=0;
    const impostor={get slice(){calls++;return ()=>canonicalEncode(unsigned(1));}};
    expect(()=>decodeCampaign2(impostor as unknown as Uint8Array)).toThrow();
    const bytes=canonicalEncode(unsigned(1));
    const proxy=new Proxy(bytes,{get(){calls++;throw Error('getter executed');}});
    expect(()=>decodeCampaign2(proxy)).toThrow();
    Object.defineProperty(bytes,'slice',{get(){calls++;throw Error('slice hook');}});
    Object.defineProperty(bytes,Symbol.iterator,{get(){calls++;throw Error('iterator hook');}});
    Object.defineProperty(bytes,'constructor',{get(){calls++;throw Error('species hook');}});
    expect(decodeCampaign2(bytes)).toEqual(unsigned(1));
    expect(calls).toBe(0);
  });
  it('integrates all 71 allocated records, detached round trips and required fields',()=>{
    expect(campaign2Schemas().map(s=>Number(s.typeId))).toEqual(Array.from({length:71},(_,i)=>i+260));
    for(const d of definitions){
      const v=value(d.name),bytes=encodeCampaign2(v);
      expect(encodeCampaign2(decodeCampaign2(bytes))).toEqual(bytes);
      for(const f of d.fields.filter(f=>f.required)){
        const bad=fields(d.name);delete bad[f.name];expect(()=>campaign2Record(d.name,bad)).toThrow();
      }
    }
  });
  it('rejects every forbidden union field and unknown tag, through decode too',()=>{
    for(const u of table.unionVariants){
      const f=fields(u.record,u.tag);expect(()=>campaign2Record(u.record,f)).not.toThrow();
      for(const id of u.forbiddenFields){const field=definitions.find(d=>d.name===u.record)!.fields.find(f=>f.id===id)!;
        expect(()=>campaign2Record(u.record,{...f,[field.name]:witness(field.type)})).toThrow();}
      expect(()=>campaign2Record(u.record,{...f,VariantTag:unsigned(999)})).toThrow();
      const schema=campaign2Schema(u.record);
      const raw=record(schema,new Map(Object.entries({...f,VariantTag:unsigned(999)}).map(([n,v])=>[schema.fields.find(f=>f.name===n)!.id,v])));
      expect(()=>decodeCampaign2(canonicalEncode(raw))).toThrow();
    }
    expect(campaign2UnionEntries()).toHaveLength(32);
  });
  it('rejects schema impersonation, unknown fields, nested schema and primitive substitutions',()=>{
    expect(()=>campaign2Record('ToleranceValue',{Magnitude:text('1')})).toThrow();
    expect(()=>campaign2Record('ToleranceValue',{Magnitude:unsigned(1),HiddenTruth:unsigned(1)})).toThrow();
    const forged={...campaign2Schema('ToleranceValue'),fields:[{id:2n,name:'Magnitude',required:true}]};
    expect(()=>decodeCampaign2(canonicalEncode(record(forged,new Map([[2n,unsigned(1)]]))))).toThrow();
    expect(()=>campaign2Record('GovernedContentKindDefinition',{ContentSchema:value('ToleranceValue')})).toThrow();
    expect(()=>campaign2Record('TransitionInputAdmissionV04',{...fields('TransitionInputAdmissionV04'),RequiredSourceRelation:unsigned(2)})).toThrow();
    expect(()=>campaign2Record('AutomaticAdaptationInput',{...fields('AutomaticAdaptationInput'),TransformationVersion:text('other')})).toThrow();
  });
  it('detaches nested values and incoming byte buffers',()=>{
    const original=unsigned(4) as {kind:'unsigned';value:bigint};
    const v=campaign2Record('ToleranceValue',{Magnitude:original});original.value=8n;
    expect(encodeCampaign2(v)).toEqual(encodeCampaign2(campaign2Record('ToleranceValue',{Magnitude:unsigned(4)})));
    const bytes=encodeCampaign2(v),decoded=decodeCampaign2(bytes);bytes.fill(0);
    expect(encodeCampaign2(decoded)).toEqual(encodeCampaign2(v));
  });
  it('keeps occurrence identities distinct and text IDs exact',()=>{
    expect(canonicalEncode(campaign2Identifier('OutcomeEvaluationId',0n))).not.toEqual(canonicalEncode(campaign2Identifier('OutcomeLearningEvidenceId',0n)));
    for(const bad of ['', 'e\u0301'])expect(()=>campaign2Identifier('SeamId',bad)).toThrow();
    expect(()=>campaign2Identifier('OutcomeEvaluationId',-1n)).toThrow();
    expect(()=>campaign2Identifier('SeamId',1n)).toThrow();
    // Physical typed-atom decoding does not own this declaration's namespace predicate.
    // campaign2ValDeclarations.test proves INVALID_CONFIGURATION at the VAL interpreter.
    expect(()=>campaign2Record('SemanticKindRoleValidatorDefinition',{RequiredSemanticKind:typedIdentifier(23001,text('semantic-kind/character'))})).not.toThrow();
  });
});
