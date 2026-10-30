import {list,text,unsigned,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {OUTCOME_DISCLOSURE_RULES,OUTCOME_DISCLOSURE_REGISTRY} from '../../assembled/model';
import {OUTCOME_TOPIC,COMM_SOURCE,LEARNED_DISCLOSURE} from '../../assembled/communication';
import {compileStrategy} from '../../assembled/strategy';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
import {procedureSource,procedureData,A,decode,items,key,enc,type Options} from './assembledProcedures';
export function topic(other=false){const s=procedureSource(),x=items(decode(s.registry),'list'),routes=compileStrategy(x[12],items(x[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decode(s.content)),r=routes[0],a=r.plans.findIndex(p=>key(p.actionId)===key(A));return list([text(OUTCOME_TOPIC),r.task,unsigned(other?1-a:a)]);}
export function outcomeSource(t=topic()){const s=procedureSource(),slots=[...items(decode(s.registry),'list')],comm=items(slots[18],'list');slots[18]=list([...comm.slice(0,3),t]);return {...s,rulesVersion:OUTCOME_DISCLOSURE_RULES,registrySchemaVersion:OUTCOME_DISCLOSURE_REGISTRY,registry:enc(list(slots))};}
export function outcomeData(success=false,o:Options&{missingA?:boolean;delivery?:boolean;access?:boolean}={}){const d=procedureData(true,o),rows=items(decode(d.orderedInputs),'list').map(v=>{const row=[...items(v,'list')];if(key(row[2])===key(PERFORMANCE_SETTING)&&key(row[0])===key(signed(3))){const p=items(row[3],'list');row[3]=list([p[0],list(items(p[1],'list').map(r=>{const x=items(r,'list');return list([x[0],o.missingA?false:x[1],unsigned(success?2:0)]);}))]);}return list(row);});return {...d,orderedInputs:enc(list([...rows,...[3,5,7].map(at=>list([signed(at),unsigned(10),COMM_SOURCE,list([text(LEARNED_DISCLOSURE),o.delivery!==false,o.access!==false,false]),list([])]))]))};}
export {decode,items,key,enc};
