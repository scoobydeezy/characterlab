/** M48: one holder,3 physical tasks; no social dependency. Body20/rate0/width1.
 * Pair: sample1/4, refill10@3, deliberate2/5. Broad:16 samples1..16, no refill,
 * one deliberation17, deadlines25,16 retained/recall. Seed0, empty learned state. */
import {list,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {source as priorSource,data as priorData,decode,items,key,enc,type Goal} from './assembledGoalMeaning';
import {changeDefinition} from './assembledCharacter';
import {WORKSPACE_DOMAIN_RULES,WORKSPACE_DOMAIN_REGISTRY} from '../../assembled/model';
import {BODY_SAMPLE} from '../../assembled/body';
import {sid} from '../../assembled/skill';
export function source(workspace=6,goal:Goal='High',broad=false,permitted=true){
 let s=priorSource(goal,broad?16:2,workspace,1,'BothDirections',true);
 if(broad)for(const name of ['definition/task-a','definition/task-b','definition/configurable-garden'])s=changeDefinition(s,name,6n,signed(25));
 const a=[...items(decode(s.registry),'list')],body=[...items(a[6],'list')];body[5]=permitted;a[6]=list(body);a[9]=list([items(a[9],'list')[0],unsigned(broad?16:2)]);
 return {...s,rulesVersion:WORKSPACE_DOMAIN_RULES,registrySchemaVersion:WORKSPACE_DOMAIN_REGISTRY,registry:enc(list(a))};
}
export function data(broad=false,hidden=false){
 const d=priorData(hidden?'hidden':broad?'equal':'main');if(!broad)return d;
 const rows=items(decode(d.orderedInputs),'list'),sample=items(rows.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list'),result:CanonicalValue[]=[];
 for(const v of rows){const a=items(v,'list');if(key(a[0])===key(signed(1))&&key(a[2])!==key(BODY_SAMPLE))result.push(v);
  if(key(a[0])===key(signed(5))&&(key(a[1])===key(unsigned(30))||key(a[2])===key(sid(1001,'event/deliberation-opportunity'))))result.push(list([signed(17),...a.slice(1)]));}
 for(let at=1;at<=16;at++)result.push(list([signed(at),...sample.slice(1)]));
 return {...d,orderedInputs:enc(list(result))};
}
export {decode,items,key,enc};
