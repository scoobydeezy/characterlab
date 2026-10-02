import history from '../../docs/planning/DISPOSITION_EXPLORATION_REV1.json';
import {type DevelopmentFrame,type DevelopmentProfile} from '../campaign3/developmentComponent';
export const profile:DevelopmentProfile={curve:'Step',learning:true,formation:true,constitution:0};
export function developmentFrames(young=true,seed=255):DevelopmentFrame[]{return history.frames.map((x,i)=>({phase:young&&i<5?0:4,exercise:i===0||i===1||i===7,practice:i===0||i===7,permitted:true,difficulty:3,report:i===0?false:i===1?true:i===7?false:null,choice:x.stage==='Gap'?'None':x.stage as 'Learn'|'Probe',significance:4,pressure:0,setting:x.setting as 'Work'|'Home',seed:x.stage==='Probe'?seed:x.seed}));}
export const simpleFrame=(patch:Partial<DevelopmentFrame>={}):DevelopmentFrame=>({phase:0,exercise:false,practice:false,permitted:true,difficulty:3,report:null,choice:'None',significance:4,pressure:0,setting:'Work',seed:0,...patch});
