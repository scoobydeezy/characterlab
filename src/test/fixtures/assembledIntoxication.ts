/** M216: original exposure/clearance, genuine common acquired prelude, no learned S0. */
import {rewardFixture,rewardStart} from '../assembledRewardExperience.test';
import {intoxicationCase,type IntoxicationScenario} from '../intoxicationControlFixtures';
import {INTOXICATION_RULES,INTOXICATION_REGISTRY} from '../../assembled/model';
import {INTOXICATION,SLEEP_SOURCE} from '../../assembled/sleepControl';
import {REWARD_SOURCE} from '../../assembled/rewardExperience';
import {DISPLAY} from '../../assembled/strategy';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {rational} from '../../substrate/canonicalEncoding';
import {decode,items,key,enc,list,text,u,signed} from './assembledSleepAcquisition';
export * from './assembledSleepAcquisition';
export {rewardStart as start};
export function fixture(scenario:IntoxicationScenario='Slow',seed=0,skillBlocked=false){
 const b=rewardFixture(),original=intoxicationCase(scenario,'Full',seed),slots=[...items(decode(b.s.registry),'list')],sleep=[...items(slots[55],'list')];
 sleep[0]=text(INTOXICATION);sleep[2]=u(0);sleep[4]=u(0);sleep.push(u(original.config.constitution.clearance),u(original.config.competence));slots[55]=list(sleep);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return !(key(a[2])===key(DISPLAY)&&[10n,12n].includes((a[0] as {value:bigint}).value));}).map(v=>{
  const a=[...items(v,'list')],native=Number((a[0] as {value:bigint}).value),frame=original.frames[native-2];
  if(key(a[2])===key(SLEEP_SOURCE)){const blind=!!frame?.sensor.denied.includes('intoxication'),bias=frame?.sensor.bias?.intoxication??0;a[3]=list([text(INTOXICATION),false,list([true,true,!blind,true]),list([signed(0),signed(0),signed(bias),signed(0)]),u(frame?.external.intoxicant??0)]);}
  if(key(a[2])===key(REWARD_SOURCE)&&frame?.sensor.denied.includes('pleasure')){const p=[...items(a[3],'list')];p[1]=false;a[3]=list(p);}
  if(key(a[2])===key(DISPLAY)&&native===8){const p=[...items(a[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const row=[...items(v,'list')];row[5]=u(13);return list(row);}));a[3]=list(p);}
  if(key(a[2])===key(PRACTICE_SETTING)&&skillBlocked&&native>=9){const p=[...items(a[3],'list')];p[3]=rational(1,1);a[3]=list(p);}return list(a);
 });
 return {s:{...b.s,rulesVersion:INTOXICATION_RULES,registrySchemaVersion:INTOXICATION_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32).fill(seed)}};
}
