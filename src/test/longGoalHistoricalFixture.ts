import plan from '../../docs/planning/LONGITUDINAL_GOAL_PLAN_REV1.json';
import {digest,fromHex} from '../workbench/canonical';
import type {LongGoalSnapshot} from '../workbench/longGoalAdapter';
const originals=import.meta.glob('../../docs/planning/longitudinal-goal-execution-rev1/*.json',{query:'?raw',import:'default',eager:true}) as Record<string,string>;
/** Historical fixture projection only; current adapter replay is checked separately. */
export async function historicalLongGoalSnapshot(index:number):Promise<LongGoalSnapshot>{
 const p=plan.runs[index];if(!p)throw Error('Unknown original goal fixture');
 const text=originals[`../../docs/planning/longitudinal-goal-execution-rev1/${String(index).padStart(3,'0')}.json`];if(!text)throw Error('Missing original goal fixture');
 const r=JSON.parse(text) as {modelIdentity:string;runIdentity:string;prefixHashes:string[];nativeHashes:string[];state:LongGoalSnapshot['state']};
 if(r.modelIdentity!==p.modelIdentity||r.runIdentity!==p.runIdentity||r.state.prefix!==16||r.prefixHashes.length!==17||r.nativeHashes.length!==17)throw Error('Historical goal fixture identity/prefix mismatch');
 return{index,law:p.law,mode:p.mode,seed:p.seed,keepEpisodes:p.keepEpisodes,seamVersion:'longitudinal-goal-component/0.1-candidate',boundary:'native-source-plus-component-receiver',prefix:16,complete:true,modelHash:await digest(fromHex(p.modelIdentity)),runHash:await digest(fromHex(p.runIdentity)),saveHash:r.prefixHashes[16],nativeSaveHash:r.nativeHashes[16],state:r.state,scope:'Historical fixture; not current adapter parity'};
}
