import {explainLongObserver} from './longExplanations';
import {fromHex} from './canonical';
export interface LongGoalSourceInput{prefix:number;rows:readonly {at:number;sourceView:string}[];}
/** This boundary intentionally accepts no goal ledger, receiving choice, seed or world state. */
export async function describeLongGoalSource(input:LongGoalSourceInput){
 const value=structuredClone(input);
 if(!Number.isInteger(value.prefix)||value.prefix<0||value.prefix>16||value.rows.length!==value.prefix)throw Error('Goal source observer prefix mismatch');
 const times=[1,2,3,4,5,6,7,8,14,15,16,17,18,19,20,21];
 if(value.rows.some((r,i)=>r.at!==times[i]||typeof r.sourceView!=='string'))throw Error('Goal source observer clock mismatch');
 if(value.prefix===0)return{version:'long-goal-source-description/0.1',status:'NO_RECORDED_SOURCE_OBSERVATION' as const,prefix:0,scope:'No source instant has committed. This is absence of a recorded view, not evidence of an empty character state.'};
 const row=value.rows[value.rows.length-1],description=await explainLongObserver(fromHex(row.sourceView));
 return{version:'long-goal-source-description/0.1',status:'RECORDED_NATIVE_OBSERVER' as const,prefix:value.prefix,sourceClock:row.at,observerHex:row.sourceView,description,scope:'Latest recorded native source observer only. Goal ledger, receiving choices, hidden world state and goal attainment are outside this description.'};
}
