/** trial-panel-source-component/0.1-candidate; controlled physical display only. */
export type TrialPanelStage='Before'|'Motion'|'After';
export interface TrialPanelFrame {readonly at:bigint;readonly glyph:number;readonly stage:TrialPanelStage;readonly visible:boolean;readonly permitted:boolean;}
declare const brand:unique symbol;
export interface TrialPanelSource {readonly [brand]:true;}
const schedules=new WeakMap<object,readonly TrialPanelFrame[]>();
const fail=():never=>{throw Error('TRIAL_PANEL_SOURCE_DOMAIN');};
function plain(value:unknown,names:readonly string[]){
 if(!value||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype)fail();
 const d=Object.getOwnPropertyDescriptors(value);
 if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!d[k])||Reflect.ownKeys(d).some(k=>typeof k!=='string'||!names.includes(k))||Object.values(d).some(x=>!('value' in x)))fail();
}
export function createTrialPanelSource(frames:readonly TrialPanelFrame[]):TrialPanelSource{
 if(!Array.isArray(frames)||Object.getPrototypeOf(frames)!==Array.prototype||frames.length>16)fail();
 const d=Object.getOwnPropertyDescriptors(frames);
 if(Reflect.ownKeys(d).length!==frames.length+1||Object.values(d).some(x=>!('value' in x))||Array.from({length:frames.length},(_,i)=>!d[String(i)]).some(Boolean))fail();
 let last=-1n;
 const copy=frames.map(f=>{plain(f,['at','glyph','stage','visible','permitted']);if(typeof f.at!=='bigint'||f.at<0n||f.at<=last||!Number.isInteger(f.glyph)||f.glyph<0||f.glyph>7||!['Before','Motion','After'].includes(f.stage)||typeof f.visible!=='boolean'||typeof f.permitted!=='boolean')fail();last=f.at;return Object.freeze({...f});});
 const token=Object.freeze({}) as TrialPanelSource;schedules.set(token,Object.freeze(copy));return token;
}
export function observeTrialPanel(source:TrialPanelSource,at:bigint){
 const schedule=schedules.get(source)??fail();if(typeof at!=='bigint'||at<0n)fail();
 const frame=schedule.find(f=>f.at===at);
 return frame?.visible&&frame.permitted?Object.freeze({kind:'Present' as const,at,glyph:frame.glyph,stage:frame.stage}):Object.freeze({kind:'Unavailable' as const,at});
}
