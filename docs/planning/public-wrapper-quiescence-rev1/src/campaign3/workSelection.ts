/** Exact controlled-source projection and two representations of maintenance. */
import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint} from '../campaign2/canonicalData';
import {workRecord as r} from './workCodecs';
import type {WorkSettings} from './workModel';
export function observeWork(original:CanonicalValue,occurrence:CanonicalValue){
 const o=rec(original,768n),visible=f(o,3n)===true;
 return r(769,[occurrence,f(o,1n),list(visible?items(f(o,2n),'list').filter(v=>f(rec(v,767n),2n)===true).map(v=>r(770,[f(rec(v,767n),1n),f(rec(v,767n),3n)])).sort((a,b)=>Number(uint(f(a,1n))-uint(f(b,1n)))):[]),visible&&f(o,4n)===true]);
}
export function selectWork(settings:WorkSettings,frame:CanonicalValue|undefined,prior:readonly number[],at:bigint,open:readonly boolean[]){
 const active=(n:number)=>n===3||settings.candidate===6||open[n-1]&&at>=1n&&at<6n;
 const source=frame?rec(frame,769n):undefined,candidates=source?items(f(source,3n),'list').filter(v=>active(Number(uint(f(rec(v,770n),1n))))):[];
 const cue=source?f(source,4n)===true:false,ids=candidates.map(v=>Number(uint(f(rec(v,770n),1n))));
 const protectedA=settings.candidate!==3&&settings.support&&prior.includes(1)&&ids.includes(1),capacity=settings.candidate===4?3:settings.capacity;
 const priority=(v:CanonicalValue)=>{const item=rec(v,770n),n=Number(uint(f(item,1n)));return cue&&n===1?4:Number(uint(f(item,2n)));};
 const ranked=[...candidates].sort((a,b)=>priority(b)-priority(a)||Number(uint(f(rec(a,770n),1n))-uint(f(rec(b,770n),1n)))).map(v=>Number(uint(f(rec(v,770n),1n))));
 const selected=(protectedA?[1,...ranked.filter(n=>n!==1)]:ranked).slice(0,capacity),access=(settings.candidate===5?ids:selected).filter(n=>n<3);
 return {candidates,selected,access,cue,control:capacity===0?0:protectedA?1:cue&&ids.includes(1)?2:0};
}
export function indexedPrior(settings:WorkSettings,frames:readonly CanonicalValue[]){
 let prior:number[]=[];
 for(let i=0;i+1<frames.length;i++){const t=f(rec(frames[i+1],769n),2n);if(typeof t==='boolean'||t.kind!=='signed')throw Error('WORK_TIME');prior=selectWork(settings,frames[i],prior,t.value,[true,true]).selected;}
 return prior;
}
export function workspaceOutput(settings:WorkSettings,at:bigint,occurrence:CanonicalValue,frames:readonly CanonicalValue[],statuses:readonly CanonicalValue[],cached:readonly number[]){
 const prior=settings.candidate===1?cached:settings.candidate===3?[]:indexedPrior(settings,frames),source=frames.at(-1),s=selectWork(settings,source,prior,at,statuses.map(v=>uint(f(rec(v,372n),1n))===1n));
 return r(773,[occurrence,signed(at),list(s.candidates),list(s.selected.map(u)),u(s.control),list(prior.map(u)),s.cue,list(statuses),list(s.access.map(u)),...(source?[source]:[])]);
}
