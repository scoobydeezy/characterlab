/** M215 frozen original20-case receiving map; one shared0.141 composition. */
import {rewardFixture,rewardStart} from '../assembledRewardExperience.test';
import {sleepCase,type SleepScenario} from '../sleepControlFixtures';
import {decode,items,key,enc,list,text,u,signed,C} from './assembledSleepAcquisition';
import {SLEEP_SOURCE} from '../../assembled/sleepControl';
import {CONTROL_SOURCE} from '../../assembled/control';
import {OPPORTUNITY,OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {set} from '../../substrate/canonicalEncoding';
export {rewardStart as start};
export * from './assembledSleepAcquisition';
export type Case={scenario:SleepScenario;law:'Full'|'NoControl';seed:number};
export const main=['Rested','Deprived','Recovered'] as const;
export const cases:Case[]=[...Array.from({length:4},(_,seed)=>main.map(scenario=>({scenario,law:'Full' as const,seed}))).flat(),...(['BlindRested','BlindDeprived','FalseRested','FailedExecution','Unmaintained'] as const).map(scenario=>({scenario,law:'Full' as const,seed:0})),...main.map(scenario=>({scenario,law:'NoControl' as const,seed:0}))];
export const caseKey=(c:Case)=>c.law+'/'+c.scenario+'/'+c.seed;
export function fixture(c:Case,blocked=false){
 const b=rewardFixture(),original=sleepCase(c.scenario,c.law,c.seed),slots=[...items(decode(b.s.registry),'list')],sleep=[...items(slots[55],'list')];sleep[7]=c.law==='Full';slots[55]=list(sleep);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],logical=Number((a[0] as {value:bigint}).value)-1;if(logical<1)return v;const frame=original.frames[logical-1];
  if(key(a[2])===key(SLEEP_SOURCE)){const p=[...items(a[3],'list')];p[1]=frame.external.asleep;p[2]=list([!frame.sensor.denied.includes('sleepiness'),true,true,true]);p[3]=list([signed(frame.sensor.bias?.sleepiness??0),signed(0),signed(0),signed(0)]);a[3]=list(p);}
  if(key(a[2])===key(CONTROL_SOURCE)){const p=[...items(a[3],'list')];p[3]=frame.support;a[3]=list(p);}return list(a);
 });
 const actions=items(items(slots[10],'list')[2],'set').map(v=>items(v,'list')[0]);
 for(const logical of [8,9,12])rows.push(list([signed(logical+1),u(100),OPPORTUNITY_SOURCE,list([text(OPPORTUNITY),C,set(actions.map(a=>list([a,!blocked&&!original.frames[logical-1].interference])))]),list([])]));
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32).fill(c.seed)}};
}
