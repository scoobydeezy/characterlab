import {list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {DISCLOSURE_RULES,DISCLOSURE_REGISTRY} from '../../assembled/model';
import {COMM_SOURCE,LEARNED_DISCLOSURE} from '../../assembled/communication';
import {peopleSource,peopleData,changeReports,target,other,decode,items,key,enc} from './assembledPersonHistory';
import type {Frame} from './assembledRecognitionCatalog';
export type Opportunity={at:number;delivery?:boolean;a?:boolean;b?:boolean};
export function learnedSource(topic:CanonicalValue=target){const source=peopleSource(),slots=[...items(decode(source.registry),'list')],old=items(slots[18],'list');slots[18]=list([text(LEARNED_DISCLOSURE),old[1],old[2],topic]);return {...source,rulesVersion:DISCLOSURE_RULES,registrySchemaVersion:DISCLOSURE_REGISTRY,registry:enc(list(slots))};}
export const encounters:Frame[]=[{at:1,signals:[['appearance/coat',true]]},{at:2,signals:[['appearance/plain',true]]}];
export const opportunities:Opportunity[]=[{at:3,a:true,b:false},{at:4,a:true,b:false}];
export function learnedData(seed=0,frames:Frame[]=encounters,ops:Opportunity[]=opportunities,claims:(at:number)=>boolean=at=>at===1){const d=changeReports(peopleData(false,seed,frames),(at,s)=>{s[3]=unsigned(claims(at)?3:4);});return {...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(COMM_SOURCE)),...ops.map(o=>list([signed(o.at),unsigned(10),COMM_SOURCE,list([text(LEARNED_DISCLOSURE),o.delivery??true,o.a??true,o.b??false]),list([])]))]))};}
export {target,other,decode,items,key,enc};
