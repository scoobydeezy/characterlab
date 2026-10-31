import {list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {EXPECTATION_RULES,EXPECTATION_REGISTRY} from '../../assembled/model';
import {EXPECTATION,EXPECTATION_TOPIC} from '../../assembled/performanceExpectation';
import {COMM_SOURCE} from '../../assembled/communication';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {PRACTICE_SETTING,sid} from '../../assembled/skill';
import {DISPLAY} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {outcomeSource,outcomeData,topic,decode,items,key,enc} from './assembledOutcomeDisclosure';
export const expectationTopic=(other=false)=>list([text(EXPECTATION_TOPIC),...items(topic(other),'list').slice(1)]);
export function expectationSource(t:CanonicalValue=expectationTopic()){const s=outcomeSource(),slots=[...items(decode(s.registry),'list')],comm=items(slots[18],'list');slots[15]=list([text(EXPECTATION)]);slots[18]=list([...comm.slice(0,3),t]);return {...s,rulesVersion:EXPECTATION_RULES,registrySchemaVersion:EXPECTATION_REGISTRY,registry:enc(list(slots))};}
export function expectationData(success=false,o:Parameters<typeof outcomeData>[1]={}){const d=outcomeData(success,o),rows=items(decode(d.orderedInputs),'list').map(v=>{const x=[...items(v,'list')];if(key(x[2])===key(DISPLAY)){const a=items(x[3],'list');x[3]=list([a[0],list(items(a[1],'list').map(row=>{const r=[...items(row,'list')];r[5]=unsigned(10);return list(r);}))]);}return list(x);});const clone=[sid(1001,'event/deliberation-opportunity'),PRACTICE_SETTING,PERFORMANCE_SETTING,COMM_SOURCE,PRIORITY_DISPLAY];return {...d,orderedInputs:enc(list([...rows,...rows.filter(v=>{const x=items(v,'list');return key(x[0])===key(signed(7))&&clone.some(t=>key(t)===key(x[2]));}).map(v=>list([signed(9),...items(v,'list').slice(1)]))]))};}
export {decode,items,key,enc};
