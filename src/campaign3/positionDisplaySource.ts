/** position-display-source-component/0.1-candidate; controlled source, no identity authority. */
export interface PositionDisplayFrame {readonly at:bigint;readonly x:bigint;readonly y:bigint;readonly glyph:bigint;readonly visible:boolean;readonly permitted:boolean}
declare const brand:unique symbol;export interface PositionDisplaySource {readonly [brand]:true}
const schedules=new WeakMap<object,readonly PositionDisplayFrame[]>();
const fail=():never=>{throw Error('POSITION_DISPLAY_SOURCE_DOMAIN');};
function plain(value:unknown,names:readonly string[]){
 if(!value||typeof value!=='object'||Object.getPrototypeOf(value)!==Object.prototype)fail();
 const d=Object.getOwnPropertyDescriptors(value);
 if(Reflect.ownKeys(d).length!==names.length||names.some(k=>!d[k])||Reflect.ownKeys(d).some(k=>typeof k!=='string'||!names.includes(k))||Object.values(d).some(x=>!('value'in x)))fail();
}
export function createPositionDisplaySource(frames:readonly PositionDisplayFrame[]):PositionDisplaySource{
 return createDisplay(frames,8);
}
/** nine-sweep-marker-component/0.1-candidate fixed display horizon. */
export function createNineFramePositionDisplaySource(frames:readonly PositionDisplayFrame[]):PositionDisplaySource{return createDisplay(frames,9);}
/** ten-sweep-marker-component/0.1-candidate; explicit tenth source frame. */
export function createTenFramePositionDisplaySource(frames:readonly PositionDisplayFrame[]):PositionDisplaySource{return createDisplay(frames,10);}
function createDisplay(frames:readonly PositionDisplayFrame[],horizon:8|9|10):PositionDisplaySource{
 if(!Array.isArray(frames)||Object.getPrototypeOf(frames)!==Array.prototype||frames.length>horizon)fail();
 const d=Object.getOwnPropertyDescriptors(frames);if(Reflect.ownKeys(d).length!==frames.length+1||Object.values(d).some(x=>!('value'in x))||Array.from({length:frames.length},(_,i)=>!d[String(i)]).some(Boolean))fail();
 let last=-1n;
 const copy=frames.map(f=>{plain(f,['at','x','y','glyph','visible','permitted']);if(typeof f.at!=='bigint'||f.at<0n||f.at<=last||[f.x,f.y,f.glyph].some(v=>typeof v!=='bigint'||v<0n||v>7n)||typeof f.visible!=='boolean'||typeof f.permitted!=='boolean')fail();last=f.at;return Object.freeze({...f});});
 const token=Object.freeze({}) as PositionDisplaySource;schedules.set(token,Object.freeze(copy));return token;
}
export function observePositionDisplay(source:PositionDisplaySource,at:bigint){
 const schedule=schedules.get(source)??fail();if(typeof at!=='bigint'||at<0n)fail();const frame=schedule.find(f=>f.at===at);
 return frame?.visible&&frame.permitted?Object.freeze({kind:'Present' as const,at,position:Object.freeze({x:frame.x,y:frame.y}),glyph:frame.glyph}):Object.freeze({kind:'Unavailable' as const,at});
}
