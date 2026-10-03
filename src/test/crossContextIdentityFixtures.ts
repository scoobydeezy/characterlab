import type {Frame} from '../campaign3/crossContextIdentity';
export function crossContextFrames():Frame[]{return ['Custody','Disclosure','Custody','Disclosure','Appointment'].map((context,i)=>({at:i+1,context:context as Frame['context'],significance:4,pressure:0,admitted:true,meaningAvailable:true,accepted:true,contrary:false,permitted:true}));}
export function crossContextCases(){
 const cases={main:crossContextFrames(),hidden:crossContextFrames(),trivial:crossContextFrames(),partial:crossContextFrames(),pressured:crossContextFrames(),withheld:crossContextFrames(),absentMeaning:crossContextFrames(),unaccepted:crossContextFrames(),opposite:crossContextFrames(),oneContrary:crossContextFrames(),noProbeMeaning:crossContextFrames(),reversedProbe:crossContextFrames(),sameContextProbe:crossContextFrames()};
 cases.hidden.forEach(x=>x.permitted=false);
 for(let i=0;i<4;i++){cases.trivial[i].significance=0;cases.partial[i].significance=1;cases.pressured[i].pressure=4;cases.withheld[i].admitted=false;cases.absentMeaning[i].meaningAvailable=false;cases.unaccepted[i].accepted=false;cases.opposite[i].contrary=true;}
 cases.oneContrary[3].contrary=true;cases.noProbeMeaning[4].meaningAvailable=false;cases.reversedProbe[4].contrary=true;cases.sameContextProbe[4].context='Custody';return cases;
}
