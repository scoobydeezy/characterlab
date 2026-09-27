import exploration from '../../docs/planning/DISPOSITION_EXPLORATION_REV1.json';
import {DISPOSITION_LAWS,type DispositionLaw,type DispositionFrame,type DispositionProfile} from '../campaign3/dispositionAdaptation';
export const dispositionRoster=[...DISPOSITION_LAWS.map(law=>({name:'Main',law,constitution:0 as const})),...['NoEvidence','Pressure','FailedExecution','Seed0','InactiveProbes','NoContextChange'].map(name=>({name,law:'Plastic' as const,constitution:0 as const})),{name:'ConstitutionPositive',law:'Plastic' as const,constitution:1 as const},{name:'ConstitutionNegative',law:'Plastic' as const,constitution:-1 as const}];
export interface DispositionCase {name:string;law:DispositionLaw;constitution:-1|0|1;}
export function dispositionCase(row:DispositionCase=dispositionRoster[0]){
 const frames=structuredClone(exploration.frames) as DispositionFrame[];
 for(const frame of frames){if(row.name==='NoEvidence'&&frame.stage==='Learn')frame.significance=0;if(row.name==='Pressure'&&frame.stage==='Learn')frame.pressure=4;if(row.name==='FailedExecution')frame.permitted=false;if(row.name==='Seed0'&&frame.stage==='Learn')frame.seed=0;if(row.name==='InactiveProbes'&&frame.stage==='Probe')frame.active=false;}
 if(row.name==='NoContextChange')frames[16].setting='Work';
 return {profile:{law:row.law,constitution:row.constitution} as DispositionProfile,frames};
}
