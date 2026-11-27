/** M293: original eight reinforcement opportunities shifted to4..11.
 * Social TASK/body10/rate0; common acquisition, five fixed-reward free opportunities. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,cachedMemory,type CanonicalValue} from './assembledSatisfierCurrent';
import {REWARD_SOURCE} from '../../assembled/rewardExperience';
import {HABIT_SOURCE} from '../../assembled/habit';
import {DISPLAY} from '../../assembled/strategy';
import {OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {CONTROL,CONTROL_SOURCE} from '../../assembled/control';
import {INTOXICATION,SLEEP_SOURCE} from '../../assembled/sleepControl';
import {timedComparisonValue,type TimedEntry} from '../../assembled/timedComparison';
import {dataIdentity as id} from '../../campaign2/canonicalData';
import {sid} from '../../assembled/skill';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
export type Arm='full'|'withheld';
export function fixture(seed:number,arm:Arm){
 const b=prior('diversified'),original=items(decode(b.d.orderedInputs),'list');
 const special=[REWARD_SOURCE,HABIT_SOURCE,OPPORTUNITY_SOURCE,CONTROL_SOURCE,SLEEP_SOURCE,DISPLAY];
 const template=original.filter(v=>at(items(v,'list')[0])===9n&&!special.some(s=>key(s)===key(items(v,'list')[2])));
 const rows=[...original,...template.map(v=>list([signed(8),...items(v,'list').slice(1)]))]
 .filter(v=>{const a=items(v,'list');return ![CONTROL_SOURCE,SLEEP_SOURCE].some(s=>key(s)===key(a[2]))&&(at(a[0])!==4n||[REWARD_SOURCE,HABIT_SOURCE,OPPORTUNITY_SOURCE].some(s=>key(s)===key(a[2])));})
 .map(v=>{const a=[...items(v,'list')],t=at(a[0]);
  if(key(a[2])===key(REWARD_SOURCE)){const p=[...items(a[3],'list')];p[1]=arm==='full'||t<7n;p[2]=list([signed(0),signed(0)]);p[3]=true;p[4]=list(t===5n?[b.actions[0]]:t===6n?[b.actions[1]]:[]);p[5]=list(t===4n?b.actions.map(a=>list([a,u(0)])):[]);a[3]=list(p);}
  if(key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=true;return list(r);}))]);}
  return list(a);
 });
 for(const t of[6,7,8,9,10,11])rows.push(list([signed(t),u(10),SLEEP_SOURCE,list([text(INTOXICATION),t===6,list([true,true,true,true]),list([signed(0),signed(0),signed(0),signed(0)]),u(0)]),list([])]));
 for(const t of[7,8,9,10,11])rows.push(list([signed(t),u(10),CONTROL_SOURCE,list([text(CONTROL),u(0),true,true,false,true,u(0)]),list([])]));
 const entries:TimedEntry[]=[];
 for(const t of[7,8,9,10,11])for(const purpose of['task-reason-face','task-standing-rounding','task-decision-tie'])for(const action of purpose==='task-decision-tie'?[undefined]:b.actions){
  const bindings=[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(C)},...(action?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(action)},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(rec(b.task,371n),2n))}]:[])];
  entries.push({at:BigInt(t),purposeId:sid(1042,'purpose/'+purpose),subjectBindings:bindings,comparisonDrawKey:{keyId:sid(10006,'M293/shared/'+t+'/'+purpose+'/'+key(list(bindings.map(v=>list([v.subjectRoleId,v.subjectId]))))),comparisonRoleId:sid(10005,'assembled/'+purpose)}});
 }
 const header=timedComparisonValue(entries);
 return {...b,d:{...b.d,runSeed:new Uint8Array(32).fill(seed),orderedInputs:enc(list([header,...rows]))},header,seed,arm};
}
let model:ReturnType<typeof prepareCharacterModel>|undefined;
export async function start(seed:number,arm:Arm){const b=fixture(seed,arm),m=await(model??(model=prepareCharacterModel(b.s)));return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,at,cachedMemory};
export type {CanonicalValue};
