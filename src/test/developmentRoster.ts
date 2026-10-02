import {profile,developmentFrames,simpleFrame} from './developmentFixtures';
import {type DevelopmentProfile,type DevelopmentFrame} from '../campaign3/developmentComponent';
export interface DevelopmentCase {name:string;profile:DevelopmentProfile;frames:DevelopmentFrame[];}
export function developmentRoster():DevelopmentCase[]{
 const rows:DevelopmentCase[]=[],add=(name:string,p:Partial<DevelopmentProfile>={},frames=developmentFrames())=>rows.push({name,profile:{...profile,...p},frames});
 add('Main');add('MatureMain',{},developmentFrames(false));
 for(let seed=0;seed<8;seed++){add('Young'+seed,{},developmentFrames(true,seed));add('Mature'+seed,{},developmentFrames(false,seed));}
 add('NoLearning',{learning:false});add('NoFormation',{formation:false});add('Neither',{learning:false,formation:false});
 for(const curve of ['Step','Ramp'] as const)add(curve+'Middle',{curve},developmentFrames().map((x,i)=>({...x,phase:i<5?2:4})));
 add('ConstantYoung',{},developmentFrames().map(x=>({...x,phase:0})));
 add('NoOpportunity',{},developmentFrames().map(x=>({...x,exercise:false})));
 add('DeniedPractice',{},developmentFrames().map(x=>({...x,permitted:false})));
 for(const difficulty of [0,8])add('Physical'+difficulty,{},developmentFrames().map(x=>({...x,difficulty})));
 add('Trivial',{},developmentFrames().map(x=>({...x,significance:0})));
 add('Pressure',{},developmentFrames().map(x=>({...x,pressure:4})));
 add('Forced',{},developmentFrames().map(x=>({...x,choice:x.choice==='Learn'?'Forced':x.choice})));
 add('AbsentReport',{},developmentFrames().map(x=>({...x,report:null})));
 for(const phase of [0,4])add('Saturation'+phase,{},Array.from({length:10},()=>simpleFrame({phase,exercise:true,practice:true,report:true})));
 for(const constitution of [-1,1] as const)add('Constitution'+constitution,{constitution});
 return rows;
}
