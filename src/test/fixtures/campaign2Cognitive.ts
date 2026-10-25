// Unchanged fixture bodies from campaign2CognitiveFactory.test.ts at 788e1a89.
import registryHex from '../../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import contentHex from '../../../docs/planning/campaign2-task-cognitive-model/content.cenc.hex?raw';
import parameterHex from '../../../docs/planning/campaign2-task-cognitive-model/parameters.cenc.hex?raw';
import {canonicalEncode as enc,list,set,map,record,text,bytes,typedIdentifier,unsigned as u,signed,rational,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {AuthoritativeState} from '../../substrate/state';
import {semanticReferentFromAuthoredContent} from '../../substrate/referentOrigin';
import {governedContentDefinitionId} from '../../substrate/contentDefinitionId';
import {taskModelReviewSource} from '../../campaign2/taskModelReview';
import {cognitiveRecord as r,decodeCognitive as decode} from '../../campaign2/cognitiveCodecs';
import {dataField as f,dataRecord as rec,dataItems as items} from '../../campaign2/canonicalData';
const hex=(s:string)=>Uint8Array.from(s.trim().match(/../g)!.map(v=>parseInt(v,16)));
export const source=()=>({...taskModelReviewSource(),rulesVersion:'rules/campaign2-task-cognitive/0.1-candidate',registrySchemaVersion:'campaign2-task-cognitive-registry/0.1-candidate',numericProfileVersion:'numeric/task-cognitive-exact/0.1-candidate',content:hex(contentHex),registry:hex(registryHex),parameters:hex(parameterHex)});
export function equalCriteriaSource(){const s=source(),slots=items(decode(s.registry),'list');return {...s,registry:enc(list(slots.map((slot,i)=>i?slot:set(items(slot,'set').map(v=>{
 if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;const body=f(v,4n);if(typeof body==='boolean'||body.kind!=='record'||body.schema.typeId!==370n)return v;
 const next=record(body.schema,new Map([...body.fields].map(([k,v])=>[k,k===3n?rational(4,1):k===4n?rational(6,1):v])));return record(v.schema,new Map([...v.fields].map(([k,v])=>[k,k===4n?next:v])));
 }))))) };}
export const id=(n:number,s:string)=>typedIdentifier(n,text(s)),C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
export function data(){const state=new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:id(1000,'observer/bridge-subject')}]},value:r(267,[C])},{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r(294,[C,id(1029,'variable/fixture-regulation')])}]},value:r(299,[signed(-50)])},...['a','b'].flatMap((n,i)=>{const key=r(371,[C,semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-'+n))]);return [{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key}]},value:r(372,[u(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey' as const,key}]},value:r(390,[id(1027,'definition/task-instruction-'+(i?'two':'one'))])}];})]);
 return {initialState:enc(state.canonicalValue()),orderedInputs:enc(list([1,2,3,4,5,6].map(t=>{const probe=t===1||t===5;return list([signed(t),u(probe?110:40),id(1001,probe?'event/regulatory-diagnostic-probe':'event/deliberation-opportunity'),probe?r(333,[id(1027,'definition/regulatory-diagnostic-probe')]):r(377,[id(1000,'observer/bridge-subject'),id(1027,'definition/task-workspace')]),list([])]);}))),runSeed:new Uint8Array(32)};
}
export function walk(v:CanonicalValue,change:(v:CanonicalValue)=>CanonicalValue):CanonicalValue {
 const changed=change(v);if(changed!==v)return changed;if(typeof v==='boolean')return v;
 if(v.kind==='record')return record(v.schema,new Map([...v.fields].map(([k,v])=>[k,walk(v,change)])));
 if(v.kind==='list'||v.kind==='set')return (v.kind==='list'?list:set)(v.items.map(v=>walk(v,change)));
 if(v.kind==='map')return map(v.entries.map(([k,v])=>[walk(k,change),walk(v,change)]));
 return v;
}
export function deadlineSource(){const s=source();return {...s,registry:enc(walk(decode(s.registry),v=>{
 if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return v;const name=f(v,1n);if(typeof name==='boolean'||name.kind!=='typedIdentifier'||typeof name.payload==='boolean'||name.payload.kind!=='text'||!['definition/task-a','definition/task-b'].includes(name.payload.value))return v;
 const deadline=name.payload.value==='definition/task-a'?2:3,body=rec(f(v,4n),370n),next=record(body.schema,new Map([...body.fields].map(([k,v])=>[k,k===6n?signed(deadline):v])));return record(v.schema,new Map([...v.fields].map(([k,v])=>[k,k===4n?next:v])));
 }))};}
