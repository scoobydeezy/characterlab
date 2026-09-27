import {biologicalFrames,addictionConfig} from './biologicalIntegrationFixtures';
import type {Action,IntegrationLaw} from '../campaign3/biologicalIntegration';
/** Authored sensor interventions, never initialized synthetic learning/history. */
export function matchedBiology(law:IntegrationLaw='Full',cue=true){
 const config=addictionConfig();config.protectionImportance=50;config.workImportance=0;
 const before={resolution:10,denied:[],bias:{pleasure:-1000,withdrawalReward:1000,pain:-1000,intoxication:-1000}},after={resolution:10,denied:[],bias:{pleasure:-1000,withdrawalReward:-1000,pain:1000,intoxication:1000}};
 const frames=biologicalFrames(12).map((f,i)=>({...f,available:['drug','withhold'] as Action[],cue:i<8||cue,adoptProtection:i===8,adoptWork:false,reminder:i===8,load:i>=8?800:0,receipt:i<8,sensor:i<8?before:f.sensor,...(i<8?{consequenceSensor:after}:{})}));
 return {law,config,frames};
}
export function hiddenBiology(changed=false){
 const config=addictionConfig();if(changed){config.competence=0;config.initial.damage=900;config.constitution.healing=0;}
 const sensor={resolution:10,denied:['hunger','thirst','sleepiness','pain','intoxication','reward','pleasure','stress','arousal','withdrawalReward','withdrawalStress','withdrawalArousal']};
 return {law:'Full' as const,config,frames:biologicalFrames(12).map(f=>({...f,sensor}))};
}
