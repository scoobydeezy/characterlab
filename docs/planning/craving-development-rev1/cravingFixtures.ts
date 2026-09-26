import {type Frame} from '../campaign3/craving';
export type BodyPacket={observer:string;pressures:(string|null)[]};
export function cravingCases(bodies:Record<string,BodyPacket>){
 const base=(body='depleted'):Frame[]=>Array.from({length:4},(_,i)=>({body:i<2?null:bodies[body].pressures[i-2],report:i===0?0:i===1?1:null,reportVisible:true,cue:i>=2,deliberateRecall:false,available:true,restrained:false,privateTruth:true}));
 const mixed=base(),change=(fn:(f:Frame,i:number)=>Frame,body='depleted')=>base(body).map(fn);
 return {mixed,reliable:change((f,i)=>({...f,report:i<2?1:null})),ineffective:change((f,i)=>({...f,report:i<2?0:null})),unknown:change(f=>({...f,report:null})),withheld:change(f=>({...f,reportVisible:false})),denied:base('denied'),full:base('full'),noCue:change(f=>({...f,cue:false})),recall:change((f,i)=>({...f,cue:false,deliberateRecall:i>=2})),unavailable:change(f=>({...f,available:false})),restrained:change(f=>({...f,restrained:true})),correction:change((f,i)=>({...f,report:i===2?0:f.report})),hidden6:base('hidden6'),hidden9:base('hidden9'),falseReports:change(f=>({...f,privateTruth:false}))};
}
