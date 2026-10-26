import {canonicalEncode as enc,list,set,text,signed,rational,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {dataItems as items,dataIdentity as id,dataText as txt,dataKey as key} from '../../campaign2/canonicalData';
import {ACTION_BODY_RULES,ACTION_BODY_REGISTRY} from '../../assembled/model';
import {ACTION_BODY} from '../../assembled/actionBody';
import {BODY_SAMPLE,bodyId} from '../../assembled/body';
import {contextSource} from './assembledMemoryContext';
import {interactionData} from './assembledInteraction';
export function actionSource(allowed=true,one=0,two=80,capacity=4){const s=contextSource(capacity);return {...s,rulesVersion:ACTION_BODY_RULES,registrySchemaVersion:ACTION_BODY_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(ACTION_BODY),allowed,set([list([bodyId(1027,'definition/protocol-contact-one'),rational(one,1)]),list([bodyId(1027,'definition/protocol-contact-two'),rational(two,1)])])])]))};}
export function actionData(seed=7,laterSense=true,amount=10){
 const d=interactionData(0,0,seed,amount),rows=items(decode(d.orderedInputs),'list').filter(row=>key(items(row,'list')[0])!==key(signed(4)));
 const choice=items(rows.find(row=>txt(id(items(row,'list')[2]).payload)==='event/deliberation-opportunity')!,'list');rows.push(list([signed(5),...choice.slice(1)]));
 if(laterSense){const sample=items(rows.find(row=>key(items(row,'list')[2])===key(BODY_SAMPLE))!,'list');rows.push(list([signed(5),...sample.slice(1)]));}
 return {...d,orderedInputs:enc(list(rows))};
}
export function replaceActuator(s:ReturnType<typeof actionSource>,value:CanonicalValue){const slots=items(decode(s.registry),'list');return {...s,registry:enc(list([...slots.slice(0,10),value]))};}
