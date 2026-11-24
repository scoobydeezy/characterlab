/** M242: original scenario data through current owners, fixed laws and seed7. */
import {fixture as current,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination,type CanonicalValue} from './assembledItemCompetence';
import {cases} from '../goalStrategyFixtures';
import {STRATEGY,DISPLAY} from '../../assembled/strategy';
import {PRIORITY,PRIORITY_ADOPTION,PRIORITY_DISPLAY} from '../../assembled/priority';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../../assembled/performance';
import {OPPORTUNITY,OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {BODY_SAMPLE,BODY_OBSERVER,BODY_DEFINITION} from '../../assembled/body';
import {IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {SELF_CONTEXT} from '../../assembled/selfBelief';
import {VALUES_CONTEXT} from '../../assembled/values';
import {SKILL,PRACTICE_SETTING} from '../../assembled/skill';
import {ITEM_WORLD,ITEM_SOURCE} from '../../assembled/itemWorld';
import {PROBE_SOURCE_EVENT,DELIBERATION_EVENT} from '../../campaign2/orderedInputs';
import {CRITERION_VERSION} from '../../assembled/criterionSensing';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const names=['main','noOutcome','hiddenSuccess','expiry','denied','noDisplay','duplicate','noAdoption'] as const;
export type Case=typeof names[number];
let base:ReturnType<typeof current>|undefined;
export function fixture(name:Case){
 const b=base??(base=current('capable')),slots=items(decode(b.s.registry),'list'),frames=cases()[name];
 const allActions=items(items(slots[10],'list')[2],'set').map(v=>items(v,'list')[0]);
 const contexts=items(decode(b.d.orderedInputs),'list').filter(v=>at(items(v,'list')[0])===2n&&[IDENTITY_CONTEXT,SELF_CONTEXT,VALUES_CONTEXT].some(k=>key(k)===key(items(v,'list')[2])));
 if(contexts.length!==3)throw Error('M242 required contexts');
 const inputs:CanonicalValue[]=[],probe=r(333,[sid(1027,'definition/regulatory-diagnostic-probe')]);
 const emit=(t:number,phase:number,event:CanonicalValue,payload:CanonicalValue)=>inputs.push(list([signed(t),u(phase),event,payload,list([])]));
 emit(1,120,PROBE_SOURCE_EVENT,probe);
 for(const frame of frames){const o=rec(frame,992n),t=Number(at(f(o,1n)))+1,adopt=f(o,2n)===true;
  for(const v of contexts)inputs.push(list([signed(t),...items(v,'list').slice(1)]));
  emit(t,10,PRIORITY_DISPLAY,list([text(adopt?PRIORITY_ADOPTION:PRIORITY),list([list([b.task,list(adopt?[q(1,1)]:[]),true,list([q(1,1)]),true,...(adopt?[list([b.instruction])]:[])])])]));
  emit(t,10,BODY_SAMPLE,r(459,[BODY_OBSERVER,BODY_DEFINITION]));
  emit(t,30,DISPLAY,list([text(STRATEGY),list(items(f(o,3n),'list').map(v=>{const d=rec(v,991n);return list([b.task,u(uint(f(d,2n))-1n),f(d,1n),f(d,3n),u(at(f(d,4n))+1n),u(at(f(d,5n))+1n),f(d,6n)]);}))]));
  emit(t,30,PRACTICE_SETTING,list([text(SKILL),u(4),q(0,1),q(f(o,7n)===true?0:1,1),true,false]));
  emit(t,30,PERFORMANCE_SETTING,list([text(PERFORMANCE),list([list([b.task,f(o,9n),u(0)])])]));
  emit(t,40,DELIBERATION_EVENT,r(377,[BODY_OBSERVER,sid(1027,'definition/task-workspace')]));
  emit(t,100,OPPORTUNITY_SOURCE,list([text(OPPORTUNITY),C,set(allActions.map(action=>{const i=b.actions.findIndex(a=>key(a)===key(action));return list([action,i<0||f(o,BigInt(i+4))===true&&f(o,6n)===false]);}))]));
  emit(t,100,ITEM_SOURCE,list([text(ITEM_WORLD),target,f(o,8n)===true?destination:origin]));
  const criterion=uint(f(o,10n));if(criterion)emit(t,120,PROBE_SOURCE_EVENT,criterion===2n?list([text(CRITERION_VERSION),probe,signed(10)]):probe);
 }
 return {...b,name,frames,last:frames.length+1,d:{...b.d,orderedInputs:enc(list(inputs))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination};
export type {CanonicalValue};
