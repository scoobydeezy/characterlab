/** Construction/role components only; these tests do not qualify task runtime TC-A..L. */
import {describe,it,expect} from 'vitest';
import {canonicalEncode as enc,list,set,record,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {taskModelReviewSource,type TaskSpecimen} from '../campaign2/taskModelReview';
import {predictionModelReviewSource} from '../campaign2/predictionModelReview';
import {compileTaskDeclarations} from '../campaign2/taskDeclarations';
import {decodeTask,taskRecord as r,taskNamed as named,taskSupportedSchemas} from '../campaign2/taskCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as num} from '../campaign2/canonicalData';
const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
const T=semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-a'));
const replace=(value:CanonicalValue,field:number,next:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='record')throw Error('record');return record(value.schema,new Map([...value.fields].map(([i,v])=>[i,i===BigInt(field)?next:v])));};
const withRoles=(source:ReturnType<typeof taskModelReviewSource>,change:(roles:readonly CanonicalValue[])=>readonly CanonicalValue[])=>{const slots=items(decodeTask(source.registry),'list');return enc(list(slots.map((v,i)=>i===5?set(change(items(v,'set'))):v)));};

describe('task successor declaration components',()=>{
 it.each(['overlapping','coincident','recurrence'] as TaskSpecimen[])('constructs two-kind declarations and the exact prior character image: %s',async specimen=>{
  const source=taskModelReviewSource(specimen),content=await compileTaskDeclarations(source.content,source.registry);
  content.validateRecordRoles(source.registry);
  expect(content.characterContentBytes()).toEqual(predictionModelReviewSource().content);
  expect(()=>content.qualifyCharacter(C)).not.toThrow();expect(()=>content.qualifyTask(T)).not.toThrow();
  expect(()=>content.qualifyCharacter(T)).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
  expect(()=>content.qualifyTask(C)).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
 });
 it('uses actual state key grammar and RecordField roles before lookup',async()=>{
  const source=taskModelReviewSource(),slots=items(decodeTask(source.registry),'list'),content=await compileTaskDeclarations(source.content,source.registry),schemas=taskSupportedSchemas();
  const model=compileCampaign2StateModel(enc(slots[2]),enc(slots[3]),enc(slots[4]),content,{decode:decodeTask,schema:type=>{const s=schemas.find(s=>s.typeId===type);if(!s)throw Error('schema');return s;}});
  const path=(key:CanonicalValue):StatePath=>({rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey',key}]});
  const good=path(r(371,[C,T])),state=new AuthoritativeState([{path:good,value:r(372,[u(1)])}]);
  expect(()=>model.validateState(state)).not.toThrow();expect(model.read(state,good).presence).toBe(true);
  for(const wrong of [r(371,[T,T]),r(371,[C,C])])expect(()=>model.read(new AuthoritativeState([]),path(wrong))).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
  expect(()=>model.read(new AuthoritativeState([]),path(C))).toThrowError(expect.objectContaining({code:'INVALID_PATH'}));
 });
 it.each([1,2])('rejects mistaken StateMapKey373/%s instead of reinterpreting it',async field=>{
  const source=taskModelReviewSource(),bad=named(265,{Position:named(264,{VariantTag:u(2),RootStateTypeId:u(373),FieldId:u(field)}),Role:named(263,{RequiredNamespace:u(1002),DomainValidatorId:typedIdentifier(1021,text(field===1?'validator/character-qualification':'validator/task-qualification'))})});
  await expect(compileTaskDeclarations(source.content,withRoles(source,rs=>[...rs,bad]))).rejects.toThrow('RecordField');
 });
 it.each([1,2])('rejects missing TaskKey RecordField371/%s',async field=>{
  const source=taskModelReviewSource(),changed=withRoles(source,rs=>rs.filter(v=>{const p=rec(f(rec(v,265n),1n),264n);return !(num(f(p,1n))===1n&&num(f(p,2n))===371n&&num(f(p,4n))===BigInt(field));}));
  await expect(compileTaskDeclarations(source.content,changed)).rejects.toThrow('role coverage');
 });
 it.each([3,7,8,10,11,13,16])('rejects omitted spec delegation field%s',async field=>{
  const source=taskModelReviewSource(),values=items(decodeTask(source.content),'set'),changed=values.map(v=>{
   const row=rec(v,170n),stable=f(row,1n);return typeof stable!=='boolean'&&stable.kind==='typedIdentifier'&&typeof stable.payload!=='boolean'&&stable.payload.kind==='text'&&stable.payload.value==='content/task-a'?replace(v,field,list([])):v;
  });
  await expect(compileTaskDeclarations(enc(set(changed)),source.registry)).rejects.toThrow();
 });
 it('enforces status union presence without a new occurrence identity',()=>{
  expect(()=>r(372,[u(1)])).not.toThrow();expect(()=>r(372,[u(3)])).not.toThrow();
  expect(()=>r(372,[u(2)])).toThrow('union payload');expect(()=>r(372,[u(4)])).toThrow('union payload');
 });
 it('rejects a second otherwise well-formed prediction criterion',async()=>{
  const source=taskModelReviewSource(),slots=items(decodeTask(source.registry),'list'),rows=items(slots[0],'set');
  const definitions=rows.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n);
  const prediction=definitions.find(v=>{const d=f(rec(v,171n),4n);return typeof d!=='boolean'&&d.kind==='record'&&d.schema.typeId===359n;})!;
  const task=definitions.find(v=>{const d=f(rec(v,171n),4n);return typeof d!=='boolean'&&d.kind==='record'&&d.schema.typeId===370n;})!;
  const second=typedIdentifier(1027,text('definition/second-prediction')),changed=replace(task,4,replace(f(rec(task,171n),4n),2,second));
  const registry=enc(list(slots.map((v,i)=>i===0?set([...rows.map(r=>r===task?changed:r),replace(prediction,1,second)]):v)));
  await expect(compileTaskDeclarations(source.content,registry)).rejects.toThrow('shared prediction criterion');
 });
});
