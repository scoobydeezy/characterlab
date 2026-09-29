/** Sleep-control experiment: existing native identity/biology contracts, no new model law. */
import {biologicalConfig,type BiologicalFrame,type IntegrationLaw} from '../campaign3/biologicalIntegration';
import {emptyPhysicalInput} from '../campaign3/biologicalDynamics';
import {identityRecipe,biologyOrdered,contextValue} from '../campaign3/identityPublicModel';
import {initialBytes,orderedBytes} from '../campaign3/biologyPublicModel';
export type SleepScenario='Rested'|'Deprived'|'Recovered'|'BlindRested'|'BlindDeprived'|'FalseRested'|'FailedExecution'|'Unmaintained';
export function sleepCase(scenario:SleepScenario='Recovered',law:IntegrationLaw='Full',seed=0){
 const config=biologicalConfig();
 Object.assign(config.constitution,{fuelDrain:0,waterDrain:0,sleepAccumulation:100,sleepRecovery:1000,nightDrive:0});
 for(const p of Object.values(config.constitution.channels))Object.assign(p,{toleranceGain:0,sensitizationGain:0,displacementGain:0,satiationGain:0});
 config.catalog.drug={...emptyPhysicalInput(),stimuli:[{channel:'reward',exposure:'drug',dose:600,direction:1}]};
 config.controlThreshold=800;config.protectionImportance=600;config.workImportance=0;
 const frames:BiologicalFrame[]=Array.from({length:12},(_,i)=>{
  const at=i+1,probe=at===8||at===9||at===12;
  const asleep=at!==1&&(at===2||scenario==='Rested'||scenario==='BlindRested'||(at>=8&&!['Deprived','BlindDeprived','FalseRested'].includes(scenario)));
  return {available:at===1?['drug']:(probe||at===2)?['drug','withhold']:['withhold'],cue:true,practice:at===1?'drug':null,adoptProtection:at===2,adoptWork:false,reminder:at===2,support:!(scenario==='Unmaintained'&&at>=8),load:at===2?800:0,interference:scenario==='FailedExecution'&&probe,sensor:{resolution:10,denied:at>=3&&scenario.startsWith('Blind')?['sleepiness']:[],...(scenario==='FalseRested'&&at>=3?{bias:{sleepiness:-1000}}:{})},receipt:at===1,external:{...emptyPhysicalInput(),asleep}};
 });
 // Only the common second instant may add protective identity. Practice is instructed.
 const contexts=frames.map((_,i)=>contextValue({setting:'Work',significance:4,pressure:0,instructed:i===0,movement:'Chosen',permitted:true},i===1));
 return {source:identityRecipe('Biological','Threshold',law,config),initialState:initialBytes(config.initial),orderedInputs:biologyOrdered(orderedBytes(frames),contexts),runSeed:new Uint8Array(32).fill(seed),config,frames,scenario,law,seed};
}
