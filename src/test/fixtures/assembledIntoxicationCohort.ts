/** M217 fixed original20-case cohort and bounded epistemic controls. */
import {fixture as prior,start} from './assembledIntoxication';
import type {IntoxicationScenario} from '../intoxicationControlFixtures';
import {REWARD_EVIDENCE_RULES,REWARD_EVIDENCE_REGISTRY} from '../../assembled/model';
import {REWARD_EVIDENCE,REWARD_SOURCE} from '../../assembled/rewardExperience';
import {OPPORTUNITY,OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {set} from '../../substrate/canonicalEncoding';
import {decode,items,enc,list,text,key,u,signed,C} from './assembledIntoxication';
export * from './assembledIntoxication';
export type Case={scenario:IntoxicationScenario;law:'Full'|'NoControl';seed:number};
export const main=['Sober','Slow','Fast'] as const;
export const cases:Case[]=[...Array.from({length:4},(_,seed)=>main.map(scenario=>({scenario,law:'Full' as const,seed}))).flat(),...(['BlindSober','BlindSlow','FalseSober','Interference'] as const).map(scenario=>({scenario,law:'Full' as const,seed:0})),{scenario:'HighCompetence',law:'Full',seed:1},...main.map(scenario=>({scenario,law:'NoControl' as const,seed:0}))];
export const caseKey=(c:Case)=>c.law+'/'+c.scenario+'/'+c.seed;
export function cohort(c:Case,options:{legacy?:boolean;saturated?:boolean}={}){
 const b=prior(c.scenario,c.seed),slots=[...items(decode(b.s.registry),'list')],sleep=[...items(slots[55],'list')],reward=[...items(slots[57],'list')];sleep[7]=c.law==='Full';slots[55]=list(sleep);if(!options.legacy)reward[0]=text(REWARD_EVIDENCE);slots[57]=list(reward);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(options.saturated&&key(a[2])===key(REWARD_SOURCE)&&(a[0] as {value:bigint}).value===9n){const p=[...items(a[3],'list')];p[1]=true;p[2]=signed(1000);p[3]=true;a[3]=list(p);}return list(a);});
 const actions=items(items(slots[10],'list')[2],'set').map(v=>items(v,'list')[0]);for(const logical of [8,9,10,11,12])rows.push(list([signed(logical+1),u(100),OPPORTUNITY_SOURCE,list([text(OPPORTUNITY),C,set(actions.map(a=>list([a,c.scenario!=='Interference'])))]),list([])]));
 return {s:{...b.s,...(!options.legacy?{rulesVersion:REWARD_EVIDENCE_RULES,registrySchemaVersion:REWARD_EVIDENCE_REGISTRY}:{}),registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {start};
