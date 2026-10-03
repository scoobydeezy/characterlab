import type {Frame} from '../campaign3/importanceUrgency';
export function importanceFrames(importance:number|null=1000,initialUrgency=1000):Frame[]{return [initialUrgency,0,null,1000,0,0].map((urgency,i)=>({at:i+1,adopt:i===0?importance:null,adoptionVisible:true,urgency,urgencyVisible:true,hiddenUrgency:1000}));}
