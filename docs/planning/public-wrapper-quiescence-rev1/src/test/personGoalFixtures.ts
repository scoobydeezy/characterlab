import {canonicalEncode as enc,list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {personGoalRecord as r} from '../campaign3/personGoalCodecs';
export const initialState=enc(set([])),seed=new Uint8Array(32).fill(13);
export type Row={desired:number;routing:number;success:boolean;actionA:boolean;actionB:boolean;outcomeA:boolean;outcomeB:boolean;mirrorA:boolean;mirrorB:boolean};
const row=(routing:number,x:Partial<Row>={}):Row=>({desired:1,routing,success:true,actionA:true,actionB:true,outcomeA:true,outcomeB:true,mirrorA:false,mirrorB:false,...x});
export function cases(){
 const main=[row(0),row(1),row(2,{success:false,mirrorA:true}),row(3),row(1)];
 const change=(fn:(r:Row,i:number)=>Row)=>main.map((r,i)=>fn({...r},i));
 const privacy=change((r,i)=>i===2||i===3?{...r,actionA:false,actionB:false,outcomeA:false,outcomeB:false}:r);
 return {main,privacy,hiddenGoal:privacy.map(r=>({...r,desired:2})),alternate:change((r,i)=>i===2?{...r,routing:3}:i===3?{...r,routing:2}:r),accurate:change(r=>({...r,mirrorA:false})),failed:change(r=>({...r,success:false})),noAction:change(r=>({...r,actionA:false,actionB:false})),noOutcome:change(r=>({...r,outcomeA:false,outcomeB:false})),unknown:change(r=>({...r,actionA:false,actionB:false,outcomeA:false,outcomeB:false})),noA:change(r=>({...r,actionA:false,outcomeA:false})),noB:change(r=>({...r,actionB:false,outcomeB:false})),otherMirror:change(r=>({...r,mirrorB:true})),unavailable:change(r=>({...r,routing:0})),deniedMirror:privacy.map(r=>({...r,mirrorA:false,mirrorB:true}))};
}
export const ordered=(rows:Row[])=>enc(list(rows.map((x,i)=>r(1179,[signed(i+1),u(x.desired),u(x.routing),x.success,x.actionA,x.actionB,x.outcomeA,x.outcomeB,x.mirrorA,x.mirrorB]))));
export const records=(xs:readonly CanonicalValue[],type:bigint)=>xs.filter(x=>typeof x!=='boolean'&&x.kind==='record'&&x.schema.typeId===type);
