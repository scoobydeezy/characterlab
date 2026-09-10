import {beforeAll,describe,it,expect,vi} from 'vitest';
import registryHex from '../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import contentHex from '../../docs/planning/campaign2-task-cognitive-model/content.cenc.hex?raw';
import parameterHex from '../../docs/planning/campaign2-task-cognitive-model/parameters.cenc.hex?raw';
import {canonicalEncode as enc,list,set,map,record,text,bytes,typedIdentifier,unsigned as u,signed,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {taskModelReviewSource} from '../campaign2/taskModelReview';
import {cognitiveRecord as r,decodeCognitive as decode} from '../campaign2/cognitiveCodecs';
import {prepareCognitiveModel,createCognitiveRun,restoreCognitiveRun,type CognitiveModel} from '../campaign2/cognitiveFactory';
import * as runtimeModule from '../campaign2/cognitiveRuntime';
import * as traceModule from '../substrate/trace';
import * as schedulerModule from '../substrate/scheduler';
import {dataField as f,dataRecord as rec,dataItems as items} from '../campaign2/canonicalData';
const hex=(s:string)=>Uint8Array.from(s.trim().match(/../g)!.map(v=>parseInt(v,16)));
const source=()=>({...taskModelReviewSource(),rulesVersion:'rules/campaign2-task-cognitive/0.1-candidate',registrySchemaVersion:'campaign2-task-cognitive-registry/0.1-candidate',numericProfileVersion:'numeric/task-cognitive-exact/0.1-candidate',content:hex(contentHex),registry:hex(registryHex),parameters:hex(parameterHex)});
function equalCriteriaSource(){const s=source(),slots=items(decode(s.registry),'list');return {...s,registry:enc(list(slots.map((slot,i)=>i?slot:set(items(slot,'set').map(v=>{
 if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;const body=f(v,4n);if(typeof body==='boolean'||body.kind!=='record'||body.schema.typeId!==370n)return v;
 const next=record(body.schema,new Map([...body.fields].map(([k,v])=>[k,k===3n?rational(4,1):k===4n?rational(6,1):v])));return record(v.schema,new Map([...v.fields].map(([k,v])=>[k,k===4n?next:v])));
 }))))) };}
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
function data(){const state=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])},{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(-50)])},...['a','b'].flatMap((n,i)=>{const key=r(371,[C,semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-'+n))]);return [{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key}]},value:r(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey' as const,key}]},value:r(390,[id(1027,'definition/task-instruction-'+(i?'two':'one'))])}];})]);
 return {initialState:enc(state.canonicalValue()),orderedInputs:enc(list([1,2,3,4,5,6].map(t=>{const probe=t===1||t===5;return list([signed(t),u(probe?110:40),id(1001,probe?'event/regulatory-diagnostic-probe':'event/deliberation-opportunity'),probe?r(333,[id(1027,'definition/regulatory-diagnostic-probe')]):r(377,[id(1000,'observer/bridge-subject'),id(1027,'definition/task-workspace')]),list([])]);}))),runSeed:new Uint8Array(32)};
}
function replace(v:CanonicalValue,n:bigint,next:CanonicalValue){const x=rec(v,132n);return record(x.schema,new Map([...x.fields].map(([k,v])=>[k,k===n?next:v])));}
function walk(v:CanonicalValue,change:(v:CanonicalValue)=>CanonicalValue):CanonicalValue {
 const changed=change(v);if(changed!==v)return changed;if(typeof v==='boolean')return v;
 if(v.kind==='record')return record(v.schema,new Map([...v.fields].map(([k,v])=>[k,walk(v,change)])));
 if(v.kind==='list'||v.kind==='set')return (v.kind==='list'?list:set)(v.items.map(v=>walk(v,change)));
 if(v.kind==='map')return map(v.entries.map(([k,v])=>[walk(k,change),walk(v,change)]));
 return v;
}
describe('cognitive history provenance qualification',()=>{
 it('binds trace reads, draws, quantization and identity diffs to the genuine prefix',async()=>{
  const d=data(),run=await createCognitiveRun(await prepareCognitiveModel(source()),d);await run.settleNextInstant();await run.settleNextInstant();
  const save=rec(decode(run.save()),132n),rows=items(f(save,11n),'list').map(v=>rec(v,160n));
  const resolution=rows.find(v=>typeof f(v,13n)!=='boolean'&&(f(v,13n) as {schema?:{typeId:bigint}}).schema?.typeId===409n)!;
  const chosen=rec(f(rec(f(rec(f(resolution,13n),409n),4n),419n),2n),420n),draws=items(f(chosen,9n),'list').map(v=>f(rec(v,422n),5n)),tie=rec(f(chosen,10n),423n);
  if((f(tie,1n) as {value:bigint}).value===2n)draws.push(f(tie,3n));expect(f(resolution,14n)).toEqual(list(draws));expect(draws.length).toBeGreaterThan(0);
  const identity=rows.find(v=>f(v,7n)&&enc(f(v,7n)).toString()===enc(id(1001,'event/task-identity-application')).toString())!;
  expect(items(f(identity,15n),'list').length).toBeGreaterThan(0);expect(items(f(identity,17n),'list').length).toBeGreaterThan(0);
  const readRow=rows.find(v=>items(f(v,11n),'list').length>0)!,emptyRow=rows.find(v=>items(f(v,11n),'list').length===0)!;
  const substitutions:[CanonicalValue,bigint,CanonicalValue][]=[
   [resolution,14n,list([])],[emptyRow,14n,list(draws)],
   [readRow,11n,list([])],[emptyRow,11n,f(readRow,11n)],
   [identity,15n,list([])],[identity,17n,list([])],
   [resolution,8n,list([typedIdentifier(1000,text('observer/forged'))])],
  ];
  for(const [target,field,value]of substitutions){const changed=record(rec(target,160n).schema,new Map([...rec(target,160n).fields].map(([k,x])=>[k,k===field?value:x])));expect(enc(changed)).not.toEqual(enc(target));
   await expect(restoreCognitiveRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:enc(replace(save,11n,list(rows.map(row=>row===target?changed:row))))})).rejects.toThrow('whole-save');
  }
 },60000);
 it('rejects changed qualification provenance with exactly unchanged numerical identity strength',async()=>{
  const d=data(),run=await createCognitiveRun(await prepareCognitiveModel(source()),d);await run.settleNextInstant();await run.settleNextInstant();
  const save=rec(decode(run.save()),132n),state=f(save,5n);let changed=0;
  const substituted=walk(state,v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==413n)return v;changed++;return record(v.schema,new Map([...v.fields].map(([k,x])=>[k,k===1n?typedIdentifier(1138,u(999)):x])));});
  expect(changed).toBeGreaterThan(0);expect(enc(substituted)).not.toEqual(enc(state));
  // e, time, decision and entry order are identical. Only the authenticated
  // qualification source changed; this cannot change the numerical fold.
  await expect(restoreCognitiveRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save:enc(replace(save,5n,substituted))})).rejects.toThrow('whole-save');
 },30000);
});
