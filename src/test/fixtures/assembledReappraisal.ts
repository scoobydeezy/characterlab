/** M41: one holder, physical task declarations, interpreted safety task first.
 * No social tasks/encounters; reserve10 stays unsensed. Perceived strategy/goal,
 * conditional outcome and catalogue channels are live. Original eight frames,
 * seed0, no initial learned state. Other task goals0; no authored affect/frame. */
import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {source as previousSource,data as previousData,tasks as originalTasks,decode,items,key,enc} from './assembledDeliveryReward';
import {REAPPRAISAL_RULES,REAPPRAISAL_REGISTRY} from '../../assembled/model';
import {REAPPRAISAL,REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {PRIORITY,PRIORITY_DISPLAY} from '../../assembled/priority';
import {STRATEGY,DISPLAY} from '../../assembled/strategy';
import {PRACTICE_SETTING,sid} from '../../assembled/skill';
import {SELF,SELF_CONTEXT} from '../../assembled/selfBelief';
import {VALUES,VALUES_CONTEXT} from '../../assembled/values';
import {IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {context} from './assembledIdentityEligibility';
import {chosenFrames,type Scenario} from '../chosenReappraisalFixtures';
let cachedTasks:ReturnType<typeof originalTasks>|undefined,cachedSource:ReturnType<typeof previousSource>|undefined,cachedData:ReturnType<typeof previousData>|undefined;
const tasks=()=>cachedTasks??(cachedTasks=originalTasks());
export const task=()=>tasks()[0],action=sid(1027,'definition/protocol-contact-one');
export function source(law='BenefitRelative'){const s=cachedSource??(cachedSource=previousSource());return {...s,rulesVersion:REAPPRAISAL_RULES,registrySchemaVersion:REAPPRAISAL_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(REAPPRAISAL),task(),action,text(law)])]))};}
export function data(scenario:Scenario='SafetyOnly'){
 const d=cachedData??(cachedData=previousData()),old=items(decode(d.orderedInputs),'list'),frames=chosenFrames(scenario),op=items(old.find(v=>key(items(v,'list')[2])===key(sid(1001,'event/deliberation-opportunity')))!,'list')[3],practice=items(old.find(v=>key(items(v,'list')[2])===key(PRACTICE_SETTING))!,'list')[3];
 const rows:CanonicalValue[]=[],event=(at:number,phase:number,type:CanonicalValue,payload:CanonicalValue)=>rows.push(list([signed(at),unsigned(phase),type,payload,list([])]));
 for(const x of frames){const at=x.at;event(at,30,REAPPRAISAL_SOURCE,list([text(REAPPRAISAL),unsigned(x.condition),x.physical,x.display,x.observed,unsigned(x.catalogue),x.catalogueObserved,x.opportunity,x.complete]));event(at,40,sid(1001,'event/deliberation-opportunity'),op);event(at,30,IDENTITY_CONTEXT,context(false,q(0,1)));event(at,30,SELF_CONTEXT,list([text(SELF),false,signed(1)]));event(at,30,VALUES_CONTEXT,list([text(VALUES),false,signed(1)]));event(at,30,PRACTICE_SETTING,practice);
 event(at,10,PRIORITY_DISPLAY,list([text(PRIORITY),list(tasks().map((t,i)=>list([t,at===1?list([q(i===0?frames[0].safety:0,4)]):list([]),true,list([q(1,1)]),true])))]));
 }
 event(1,30,DISPLAY,list([text(STRATEGY),list(tasks().flatMap(t=>[0,1].map(r=>list([t,unsigned(r),unsigned(r+1),r===0,unsigned(1),unsigned(10),true]))))]));
 return {...d,runSeed:new Uint8Array(32),orderedInputs:enc(list(rows))};
}
export {decode,items,key,enc,tasks};
