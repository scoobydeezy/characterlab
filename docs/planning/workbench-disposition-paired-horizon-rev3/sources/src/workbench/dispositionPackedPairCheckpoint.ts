import {DISPOSITION_CONTRASTS} from './dispositionComparison';
import {restoreDispositionPackedByReplay,type DispositionReplayRun} from './dispositionPackedReplay';
import type {DispositionCheckpoint} from './dispositionAdapter';
import {packDispositionCheckpoint,unpackDispositionCheckpoint,type DispositionPackedCheckpoint} from './dispositionPackedCheckpoint';
export interface DispositionPackedPairCheckpoint{version:'disposition-packed-pair/0.1';comparison:string;a:DispositionPackedCheckpoint;b:DispositionPackedCheckpoint;}
interface Source{checkpoint():DispositionCheckpoint|Promise<DispositionCheckpoint>}
function declaration(c:DispositionPackedPairCheckpoint){const spec=DISPOSITION_CONTRASTS.find(s=>s.id===c?.comparison);if(c?.version!=='disposition-packed-pair/0.1'||!spec||c.a?.program!==spec.a||c.b?.program!==spec.b)throw Error('Packed pair declaration mismatch');return {version:c.version,comparison:c.comparison,a:{...c.a},b:{...c.b}};}
export async function capturePackedDispositionPair(comparison:string,pair:readonly [Source,Source]):Promise<DispositionPackedPairCheckpoint>{const a=await packDispositionCheckpoint(await pair[0].checkpoint());const b=await packDispositionCheckpoint(await pair[1].checkpoint());return declaration({version:'disposition-packed-pair/0.1',comparison,a,b});}
export async function restorePackedDispositionPair<T>(input:DispositionPackedPairCheckpoint,restore:(c:DispositionCheckpoint)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{const c=declaration(input),fresh:T[]=[];try{fresh.push(await restore(await unpackDispositionCheckpoint(c.a)));fresh.push(await restore(await unpackDispositionCheckpoint(c.b)));return[fresh[0],fresh[1]];}catch(error){fresh.forEach(dispose);throw error;}}
/** Sequential reconstruction with exact streamed whole-save comparison. The
 * failing branch is disposed by the branch helper; completed branches here. */
export async function restorePackedDispositionPairByReplay<T extends DispositionReplayRun>(input:DispositionPackedPairCheckpoint,create:(program:string)=>Promise<T>,dispose:(c:T)=>void):Promise<[T,T]>{
 const c=declaration(input),fresh:T[]=[];
 try{fresh.push(await restoreDispositionPackedByReplay(c.a,create,dispose));fresh.push(await restoreDispositionPackedByReplay(c.b,create,dispose));return[fresh[0],fresh[1]];}
 catch(error){fresh.forEach(dispose);throw error;}
}
