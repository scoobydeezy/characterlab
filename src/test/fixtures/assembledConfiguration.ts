import {canonicalEncode as enc,list,set,text,signed,unsigned,record,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent as ref} from '../../substrate/referentOrigin';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id} from '../../campaign2/canonicalData';
import {cognitiveRecord as r} from '../../campaign2/cognitiveCodecs';
import {decodeCognitive as decode} from '../../assembled/codecs';
import {relationshipSource,relationshipData} from './assembledRelationship';
import {walk,C} from './campaign2Cognitive';
import {replace,changeDefinition} from './assembledCharacter';
import {sid} from '../../assembled/skill';
import {STRATEGY,DISPLAY} from '../../assembled/strategy';
import {PRIORITY,PRIORITY_DISPLAY} from '../../assembled/priority';
export const newTask=sid(1038,'content/configurable-garden'),newSpec=sid(1027,'definition/configurable-garden'),newAction=sid(1027,'definition/configurable-water'),newInstruction=sid(1027,'definition/configurable-watering');
export const thirdKey=r(371,[C,ref(newTask)]);
export function configurationSource(){
 let s=changeDefinition(relationshipSource(),'definition/task-workspace',2n,unsigned(5));
 const slots=[...items(decode(s.registry),'list')],rows=items(slots[0],'set'),row=(name:string)=>rec(rows.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/'+name)))!,171n);
 const spec=replace(row('task-a'),1n,newSpec),content=items(decode(s.content),'set'),task=rec(content.find(v=>key(f(rec(v,170n),1n))===key(sid(1038,'content/task-a')))!,170n);
 const extraContent=walk(task,v=>key(v)===key(f(task,1n))?newTask:key(v)===key(sid(1027,'definition/task-a'))?newSpec:v);
 const extraSpec=replace(spec,4n,replace(replace(f(rec(spec,171n),4n),3n,q(0,1)),4n,q(0,1)));
 const instruction=replace(replace(row('task-instruction-one'),1n,newInstruction),4n,r(389,[newAction])),action=replace(row('protocol-contact-one'),1n,newAction);
 slots[0]=walk(set([...rows,extraSpec,instruction,action]),v=>typeof v!=='boolean'&&v.kind==='record'&&[374n,416n].includes(v.schema.typeId)?replace(v,2n,set([...items(f(v,2n),'set'),newSpec])):v);
 const taskContent=[...content,extraContent],tasks=taskContent.map(v=>rec(v,170n)).filter(v=>key(f(v,2n))===key(sid(1004,'semantic-kind/task-commitment'))).map(v=>r(371,[C,ref(id(f(v,1n)))]));
 const instructions=[sid(1027,'definition/task-instruction-one'),sid(1027,'definition/task-instruction-two'),newInstruction];
 slots[12]=list([text(STRATEGY),list(tasks.map((task,i)=>list([task,instructions[i],instructions[(i+1)%3]])))]);
 const body=items(slots[10],'list');slots[10]=list([body[0],body[1],set([...items(body[2],'set'),list([newAction,q(0,1)])])]);
 const social=items(slots[19],'list');slots[19]=list([social[0],social[1],list([...items(social[2],'list'),list([thirdKey,true])])]);
 return {...s,rulesVersion:'rules/assembled-character/0.22-candidate',registrySchemaVersion:'assembled-character-registry/0.22-candidate',numericProfileVersion:'numeric/assembled-task-exact/0.1-candidate',content:enc(set(taskContent)),registry:enc(list(slots))};
}
export function configurationData(participant=true,seed=0){
 const base=relationshipData(true,seed,[{at:1,kind:1,participant},{at:2,kind:1,participant}]),state=restoreAuthoritativeState(decode(base.initialState));
 const initial=new AuthoritativeState([...state.entries(),{path:{rootStateTypeId:373n,fieldId:1n,selectors:[{kind:'mapKey' as const,key:thirdKey}]},value:r(372,[unsigned(1)])},{path:{rootStateTypeId:373n,fieldId:2n,selectors:[{kind:'mapKey' as const,key:thirdKey}]},value:r(390,[newInstruction])}]);
 const tasks=initial.entries().filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n).map(e=>(e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key);
 const rows=items(decode(base.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(DISPLAY)).map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list'),values=items(p[1],'list');a[3]=list([text(PRIORITY),list([...values,list([thirdKey,...items(values[0],'list').slice(1)])])]);}return list(a);});
 rows.push(list([signed(1),unsigned(30),DISPLAY,list([text(STRATEGY),list(tasks.flatMap(t=>[0,1].map(route=>list([t,unsigned(route),unsigned(route+1),route===0,unsigned(1),unsigned(8),true]))))]),list([])]));
 return {...base,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))};
}
export const baseRegistry=(s:ReturnType<typeof configurationSource>)=>enc(list(items(decode(s.registry),'list').slice(0,6)));
export {decode,items,rec,f,key,enc,list,set,replace,walk};

export function reducedSource(){
 const s=configurationSource(),slots=[...items(decode(s.registry),'list')],keepTask=sid(1038,'content/task-a'),keepSpec=sid(1027,'definition/task-a'),keepAction=sid(1027,'definition/protocol-contact-one');
 const rows=items(slots[0],'set').filter(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)return true;const kind=key(f(v,2n)),stable=key(f(v,1n));return kind===key(sid(1023,'registry/task-commitment-spec'))?stable===key(keepSpec):kind===key(sid(1023,'registry/protocol-action'))?stable===key(keepAction):stable!==key(newInstruction);});
 slots[0]=walk(set(rows),v=>typeof v!=='boolean'&&v.kind==='record'?[374n,416n].includes(v.schema.typeId)?replace(v,2n,set([keepSpec])):v.schema.typeId===389n?replace(v,1n,keepAction):v:v);
 const task=r(371,[C,ref(keepTask)]),strategy=items(slots[12],'list');slots[12]=list([strategy[0],list([list([task,sid(1027,'definition/task-instruction-one'),sid(1027,'definition/task-instruction-two')])])]);
 const body=items(slots[10],'list');slots[10]=list([body[0],body[1],set(items(body[2],'set').filter(v=>key(items(v,'list')[0])===key(keepAction)))]);
 const social=items(slots[19],'list');slots[19]=list([social[0],social[1],list([list([task,true])])]);
 return {...s,content:enc(set(items(decode(s.content),'set').filter(v=>key(f(rec(v,170n),1n))===key(keepTask)||key(f(rec(v,170n),2n))===key(sid(1004,'semantic-kind/character'))))),registry:enc(list(slots))};
}
