/** M47: physical tasks; body20/rate0/width1; observed1/4, refill10 at3;
 * decisions2/5, retention2/recall2/workspace5, seed0; third task starts6; no initial learned state. */
import {list,text,unsigned,signed,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {source as priorSource,data as priorData,decode,items,key,enc} from './assembledBodyMemoryUse';
import {changeDefinition} from './assembledCharacter';
import {GOAL_MEANING_RULES,GOAL_MEANING_REGISTRY} from '../../assembled/model';
import {GOAL_MEANING} from '../../assembled/goalMeaning';
import {BODY_DELIVERY} from '../../assembled/body';
export type Goal='High'|'Low'|'Wide'|'Absent';
export function source(goal:Goal='High',capacity=2,workspace=5,activeFrom=1,law='BothDirections',originalTaskFocus=false){
 const base=priorSource('SignificanceFirst',capacity),focused=originalTaskFocus?base:changeDefinition(base,'definition/configurable-garden',5n,signed(6)),s=changeDefinition(focused,'definition/task-workspace',2n,unsigned(workspace)),a=[...items(decode(s.registry),'list')],body=[...items(a[6],'list')];body[2]=q(0,1);body[3]=q(1,1);a[6]=list(body);a[9]=list([items(a[9],'list')[0],unsigned(2)]);const bounds:Record<Goal,CanonicalValue[]>= {High:[q(30,1),q(31,1)],Low:[q(20,1),q(21,1)],Wide:[q(0,1),q(100,1)],Absent:[]};a.push(list([text(GOAL_MEANING),list(bounds[goal]),unsigned(activeFrom),text(law)]));return {...s,rulesVersion:GOAL_MEANING_RULES,registrySchemaVersion:GOAL_MEANING_REGISTRY,registry:enc(list(a))};
}
export function data(mode:'main'|'hidden'|'equal'='main'){const d=priorData(),initialState=enc(new AuthoritativeState(restoreAuthoritativeState(decode(d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[mode==='hidden'?q(41,2):q(20,1),signed(0)])}:e)).canonicalValue()),rows=items(decode(d.orderedInputs),'list').flatMap(v=>{const a=items(v,'list');if(key(a[2])!==key(BODY_DELIVERY))return [v];return mode==='equal'?[]:[list([...a.slice(0,3),list([items(a[3],'list')[0],q(10,1)]),a[4]])];});return {...d,initialState,orderedInputs:enc(list(rows))};}
export {decode,items,key,enc};
