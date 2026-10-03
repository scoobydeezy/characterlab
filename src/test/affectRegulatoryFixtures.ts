import {biologicalConfig,type BiologicalFrame} from '../campaign3/biologicalIntegration';
import {emptyPhysicalInput} from '../campaign3/biologicalDynamics';
export const REGULATORY_CASES=['NoHarm','FalseHarm','NoGoal','DeniedHarm','NoReceipt','NoImpulse','HiddenA','HiddenB'] as const;
export function regulatoryCase(name:typeof REGULATORY_CASES[number]){
 const config=biologicalConfig();config.constitution.fuelDrain=0;config.constitution.waterDrain=0;config.constitution.sleepAccumulation=0;config.constitution.nightDrive=0;config.constitution.healing=0;config.catalog.drug=emptyPhysicalInput();
 if(name==='HiddenB')config.initial.damage=200;
 const denied=['hunger','thirst','sleepiness','pain','intoxication','reward','pleasure','stress','arousal','withdrawalReward','withdrawalStress','withdrawalArousal'];
 const frames:BiologicalFrame[]=Array.from({length:12},(_,i)=>({available:i===0?['drug']:['withhold'],cue:true,practice:i===0?'drug':'withhold',adoptProtection:i===0&&name!=='NoGoal',adoptWork:false,reminder:i===0,support:true,load:0,interference:false,sensor:{resolution:10,denied:name.startsWith('Hidden')?denied:[]},receipt:!(i===0&&name==='NoReceipt'),external:emptyPhysicalInput(),...(i===0&&!name.startsWith('Hidden')?{consequenceSensor:{resolution:10,denied:name==='DeniedHarm'?['pain','intoxication']:[],bias:{pain:name==='NoHarm'?0:600}}}:{})}));
 return {law:name==='NoImpulse'?'NoAppraisalImpulse' as const:'Full' as const,config,frames};
}
