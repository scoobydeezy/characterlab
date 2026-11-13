/** M99: training A, recurrence B/C, declared reappraisal task absent; seed0.
 * Body30/cap100/rate10, delivery90@9; no person-dependent task. */
import {expect} from 'vitest';
import {standingProbe} from './assembledReasonReference';
import {taskA,taskB} from './assembledDecisionRegimes';
import {RECURRENCE_RULES,RECURRENCE_REGISTRY} from '../../assembled/model';
import {PRIORITY_DISPLAY,PRIORITY_ADOPTION} from '../../assembled/priority';
import {COMMITMENT_REQUEST} from '../../assembled/commitment';
import {DISPLAY} from '../../assembled/strategy';
import {restoreAuthoritativeState,AuthoritativeState} from '../../substrate/state';
import {semanticReferentFromAuthoredContent as ref} from '../../substrate/referentOrigin';
import {walk} from './campaign2Cognitive';
import {replace} from './assembledCharacter';
import {list,set,text,signed,unsigned as u,rational as q,canonicalEncode as enc,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeCognitive as decode,receivingRecord as rec,cognitiveRecord as r} from '../../assembled/codecs';
import {dataField as f,dataKey as key,dataItems as items} from '../../campaign2/canonicalData';
import {sid} from '../../assembled/skill';
const newContent=sid(1038,'content/commit-recurrence'),newSpec=sid(1027,'definition/commit-recurrence');
export const taskC=r(371,[f(rec(taskB,371n),1n),ref(newContent)]);
export function recurrenceFixture(){
 const b=standingProbe(),slots=[...items(decode(b.s.registry),'list')],rows=items(slots[0],'set'),content=items(decode(b.s.content),'set'),oldContent=content.find(v=>key(f(rec(v,170n),1n))===key(sid(1038,'content/task-b')))!;
 const extraContent=walk(oldContent,v=>key(v)===key(sid(1038,'content/task-b'))?newContent:key(v)===key(sid(1027,'definition/task-b'))?newSpec:v),oldSpec=rows.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/task-b')))!;
 slots[0]=walk(set([...rows,replace(oldSpec,1n,newSpec)]),v=>typeof v!=='boolean'&&v.kind==='record'&&[374n,416n].includes(v.schema.typeId)?replace(v,2n,set([...items(f(v,2n),'set'),newSpec])):v);
 const strategy=items(slots[12],'list'),routes=items(strategy[1],'list'),bPlan=items(routes.find(v=>key(items(v,'list')[0])===key(taskB))!,'list');slots[12]=list([strategy[0],list([...routes,list([taskC,...bPlan.slice(1)])])]);
 const original=items(decode(b.d.orderedInputs),'list'),frame=original.filter(v=>key(items(v,'list')[0])===key(signed(12))),extra=[14,16,18,19].flatMap(at=>frame.map(v=>{const a=[...items(v,'list')];a[0]=signed(at);return list(a);})),replaced=new Set(extra.map(v=>{const a=items(v,'list');return key(a[0])+'/'+key(a[2]);}));
 const inputs=[...original.filter(v=>{const a=items(v,'list');return !replaced.has(key(a[0])+'/'+key(a[2]));}),...extra].map(v=>{const x=[...items(v,'list')],at=(x[0] as {value:bigint}).value;
  if(key(x[2])===key(PRIORITY_DISPLAY)){const p=items(x[3],'list'),oldRows=items(p[1],'list'),bRow=items(oldRows.find(v=>key(items(v,'list')[0])===key(taskB))!,'list'),sourceRows=[...oldRows,list([taskC,...bRow.slice(1)])],adopt=at===12n?taskB:at===16n?taskC:undefined;x[3]=list([adopt?text(PRIORITY_ADOPTION):p[0],list(sourceRows.map(v=>{const a=[...items(v,'list')],main=[taskB,taskC].some(t=>key(t)===key(a[0]));if(at===1n&&! (key(a[0])===key(taskA)))a[1]=list([]);if(main&&at>=12n){a[3]=list([q(1,1)]);a[4]=true;}if(adopt){a[1]=key(a[0])===key(adopt)?list([q(1,1)]):list([]);a[2]=true;a.push(key(a[0])===key(adopt)?list([bPlan[1]]):list([]));}return list(a);}))]);}
  if(key(x[2])===key(DISPLAY)){const p=items(x[3],'list'),rs=items(p[1],'list');x[3]=list([p[0],list([...rs,...rs.filter(v=>key(items(v,'list')[0])===key(taskB)).map(v=>list([taskC,...items(v,'list').slice(1)]))])]);}return list(x);
 });
 inputs.push(...[[10,taskA],[14,taskB]].map(([at,task])=>list([signed(at as number),u(30),COMMITMENT_REQUEST,list([task as CanonicalValue,true,false]),list([])])));
 const initial=restoreAuthoritativeState(decode(b.d.initialState)),entries=initial.entries().filter(e=>e.path.rootStateTypeId!==373n||![1n,2n].includes(e.path.fieldId)||e.path.selectors[0].kind==='mapKey'&&key(e.path.selectors[0].key)===key(taskA));
 expect(entries.filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n)).toHaveLength(1);
 return {s:{...b.s,rulesVersion:RECURRENCE_RULES,registrySchemaVersion:RECURRENCE_REGISTRY,content:enc(set([...content,extraContent])),registry:enc(list(slots))},d:{...b.d,initialState:enc(new AuthoritativeState(entries).canonicalValue()),orderedInputs:enc(list(inputs))}};
}
export {taskA,taskB,decode,rec,r,f,key,items,list,set,text,signed,u,q,enc,sid};
