import {canonicalEncode as enc,list,unsigned as u,signed} from '../substrate/canonicalEncoding';
import {workRecord as r} from '../campaign3/workCodecs';
export interface Board {at:number;priorities?:number[];visible?:boolean[];board?:boolean;cue?:boolean;hidden?:boolean;order?:number[];}
export function workInputs(boards:readonly Board[]){return enc(list(boards.map(b=>r(768,[signed(b.at),list((b.order??[1,2,3]).map(i=>r(767,[u(i),b.visible?.[i-1]??true,u(b.priorities?.[i-1]??0)]))),b.board??true,b.cue??false,b.hidden??false]))));}
export function workScenario(change:Partial<Board>={}):Board[]{return [
 {at:1,priorities:[3,1,0]},
 {at:2,priorities:[1,3,2],...change},
 {at:3,priorities:[1,3,2]},
 {at:4,priorities:[1,3,2],cue:true},
 {at:5,priorities:[1,3,2]},
 {at:6,priorities:[1,3,2],cue:true},
 {at:7,priorities:[1,3,2],cue:true},
 ];}
