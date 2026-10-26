import {canonicalEncode as enc,list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataIdentity as id,dataText as txt,dataKey as key} from '../../campaign2/canonicalData';
import {MEMORY_CONTEXT_RULES,MEMORY_CONTEXT_REGISTRY,WORKSPACE_RULES,WORKSPACE_REGISTRY} from '../../assembled/model';
import {RETENTION} from '../../assembled/retention';
import {RETRIEVAL} from '../../assembled/retrieval';
import {BODY_SELECTION_REPORT,BODY_SAMPLE,BODY_DELIVERY} from '../../assembled/body';
import {interactionSource,interactionData} from './assembledInteraction';
import {changeDefinition} from './assembledCharacter';
export function contextSource(capacity=4,old=false,selection=1,permitted=true){
 let s=changeDefinition(interactionSource(permitted),'definition/task-workspace',2n,unsigned(capacity));
 return {...s,rulesVersion:old?WORKSPACE_RULES:MEMORY_CONTEXT_RULES,registrySchemaVersion:old?WORKSPACE_REGISTRY:MEMORY_CONTEXT_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(BODY_SELECTION_REPORT),unsigned(selection)]),list([text(RETENTION),unsigned(8),unsigned(8),unsigned(2)]),list([text(RETRIEVAL),unsigned(1)])]))};
}
export function contextData(body:0|1,seed=7,amount=10,second=false){
 const d=interactionData(0,body,seed,amount),rows=items(decode(d.orderedInputs),'list').map(row=>{const a=items(row,'list');return txt(id(a[2]).payload)==='event/deliberation-opportunity'?list([signed(5),...a.slice(1)]):row;});
 if(second){const choice=items(rows.find(row=>txt(id(items(row,'list')[2]).payload)==='event/deliberation-opportunity')!,'list');rows.push(list([signed(6),...choice.slice(1)]));}
 return {...d,orderedInputs:enc(list(rows))};
}
/** Genuine same-channel sources, not authored body evidence or recalled contents. */
export function addCurrentSense(d:ReturnType<typeof contextData>,refill=false){
 const rows=items(decode(d.orderedInputs),'list'),sample=items(rows.find(row=>key(items(row,'list')[2])===key(BODY_SAMPLE))!,'list');
 const extra:CanonicalValue[]=[list([signed(5),...sample.slice(1)])];
 if(refill){const delivery=items(rows.find(row=>key(items(row,'list')[2])===key(BODY_DELIVERY))!,'list'),payload=items(delivery[3],'list');extra.push(list([signed(4),...delivery.slice(1,3),list([payload[0],{kind:'rational',numerator:80n,denominator:1n}]),delivery[4]]));}
 return {...d,orderedInputs:enc(list([...rows,...extra]))};
}
