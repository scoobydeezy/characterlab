/** M109: immutable timed correspondence; no seed/key/outcome search. */
import {expect} from 'vitest';
import {fixture as prior,create,live,learned,snap,through,finish,exact,bytes,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,signedValue,type Run,type CanonicalValue} from './assembledBiographyHistory';
import {TIMED_COMPARISON_RULES,TIMED_COMPARISON_REGISTRY} from '../../assembled/model';
import {timedComparisonValue,compileTimedComparison,type TimedEntry} from '../../assembled/timedComparison';
import {taskA,taskB} from './assembledDecisionRegimes';
import {C} from './campaign2Cognitive';
import {sid} from '../../assembled/skill';
import {dataIdentity as id} from '../../campaign2/canonicalData';
import {comparisonAddress} from '../../assembled/comparison';
import {coupledRandomKeyValue} from '../../substrate/random';
import {randomDrawRecord} from '../../assembled/codecs';
export const times=[10n,12n,14n,16n,18n,20n,22n,24n,26n];
const cache=new Map<number,ReturnType<typeof prior>>();
export function header(lane:number){const entries:TimedEntry[]=[];
 for(const at of times)for(const purpose of ['task-reason-face','task-standing-rounding','task-decision-tie']){
  const domains=purpose==='task-decision-tie'?[undefined]:[taskA,taskB];
  for(const [i,task]of domains.entries()){
   const subjectBindings=[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(C)},...(task?[{subjectRoleId:sid(1043,'subject/action'),subjectId:sid(1027,'definition/protocol-contact-'+(i?'two':'one'))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(rec(task,371n),2n))}]:[])];
   entries.push({at,purposeId:sid(1042,'purpose/'+purpose),subjectBindings,comparisonDrawKey:{keyId:sid(10006,'M109/'+(at<=12n?'early/'+lane:'shared')+'/'+at+'/'+purpose+'/'+key(list(subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId]))))),comparisonRoleId:sid(10005,'assembled/'+purpose)}});
  }
 }
 return timedComparisonValue(entries);
}
export function fixture(lane=0){let value=cache.get(lane);if(!value){const b=prior(0);value={s:{...b.s,rulesVersion:TIMED_COMPARISON_RULES,registrySchemaVersion:TIMED_COMPARISON_REGISTRY},d:{...b.d,orderedInputs:enc(list([header(lane),...items(decode(b.d.orderedInputs),'list')]))}};cache.set(lane,value);}return value;}
export function draws(run:Run,at:bigint,decodedTrace?:CanonicalValue){return outputs(decodedTrace??snap(run).trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===at&&uint(f(rec(f(t,4n),130n),3n))===80n).flatMap(t=>items(f(t,14n),'list')).map(randomDrawRecord);}
export function bound(run:Run,at:bigint,lane:number){const rows=draws(run,at),schedule=compileTimedComparison(header(lane));expect(rows.length).toBeGreaterThanOrEqual(2);
 for(const d of rows){const address=comparisonAddress(f(d,1n)),expected=schedule.bind(at,address.causalRootId).resolve(address);expect(expected,'actual draw has predeclared mapping').toBeDefined();expect(f(d,2n)).toEqual(coupledRandomKeyValue(expected!));}
 return rows;
}
export {create,live,learned,snap,through,finish,exact,bytes,rec,f,uint,items,key,decode,enc,list,text,signed,q,id,sid};
export type {Run,CanonicalValue};
