/** Binary actual-use metadata; no independent owner or memory store. */
import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataText as txt,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {assertPresentationUpdate} from './affectMemory';
import type {ScheduledEvent} from '../substrate/scheduler';
export const MEMORY_USE='assembled-memory-use/0.1',MEMORY_USE_VERSION='assembled-character-memory-use/0.1-candidate';
export type MemoryUseLaw='SignificanceFirst'|'AgeOnly';
export type MemoryUseConsumer=(event:ScheduledEvent,operands:readonly CanonicalValue[],report:CanonicalValue)=>void;
export function compileMemoryUse(v:CanonicalValue):MemoryUseLaw{
 const a=items(v,'list');if(a.length!==2||txt(a[0])!==MEMORY_USE||!['SignificanceFirst','AgeOnly'].includes(txt(a[1])))invalidModel('memory use requires named retention law');
 return txt(a[1]) as MemoryUseLaw;
}
/** Called only after the extension authenticates the real consumer and operand. */
export function creditPresentedEpisode(before:CanonicalValue,presented:CanonicalValue){
 assertPresentationUpdate(before,presented);const a=[...items(presented,'list')];
 if(a.length!==8||typeof a[7]!=='boolean')invalidModel('versioned binary use metadata required');
 a[7]=true;const after=list(a);assertPresentationUpdate(before,after,true);return after;
}

export const BODY_MEMORY_USE='assembled-body-memory-use/0.1',BODY_MEMORY_USE_VERSION='assembled-character-body-memory-use/0.1-candidate';
/** Actual-use metadata only: the six original body fields are immutable. */
export function assertBodyUseUpdate(before:CanonicalValue,after:CanonicalValue){
 const a=items(before,'list'),b=items(after,'list');
 if(a.length!==7||b.length!==7||txt(a[0])!=='assembled-body-episode/0.1'||a.slice(0,6).some((v,i)=>key(v)!==key(b[i]))||typeof a[6]!=='boolean'||typeof b[6]!=='boolean'||a[6]===true&&b[6]!==true)invalidModel('immutable body episode/binary use');
}
export function creditBodyEpisode(before:CanonicalValue){const a=[...items(before,'list')];a[6]=true;const after=list(a);assertBodyUseUpdate(before,after);return after;}
