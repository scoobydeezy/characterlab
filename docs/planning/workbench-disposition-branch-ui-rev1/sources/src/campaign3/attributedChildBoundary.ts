/** attributed-child-boundary-component/0.1-candidate; supplied trusted result projection only. */
import {fragmentRetainedUnits,type RetainedAcquisition,type ChildLoss} from './retentionFragmentation';
import {canonicalEncode,list,unsigned,text} from '../substrate/canonicalEncoding';
const symbol=(x:string)=>{if(typeof x!=='string'||!x||x!==x.normalize('NFC')||new TextEncoder().encode(x).length>64)throw Error('ATTRIBUTED_TARGET_SYMBOL');};
const bytes=(x:ChildLoss)=>canonicalEncode(list([unsigned(x.acquisition),text(x.unit)]));
const compare=(a:Uint8Array,b:Uint8Array)=>{for(let i=0;i<Math.min(a.length,b.length);i++)if(a[i]!==b[i])return a[i]-b[i];return a.length-b.length;};
export function normalizeAttributedChildren(owner:{readonly observer:string;readonly character:string;readonly memory:readonly RetainedAcquisition[]},projection:{readonly observer:string;readonly character:string;readonly disposition:'Supported'|'Unavailable';readonly targets:readonly ChildLoss[]}){
 for(const s of [owner.observer,owner.character,projection.observer,projection.character])symbol(s);
 if(owner.observer!==projection.observer||owner.character!==projection.character)throw Error('ATTRIBUTED_TARGET_SUBJECT');
 const xs=projection.targets;if(!Array.isArray(xs)||xs.length>1024||Array.from({length:xs.length},(_,i)=>Object.hasOwn(xs,i)).some(x=>!x))throw Error('ATTRIBUTED_TARGET_BOUND');
 if(projection.disposition==='Supported'){if(!xs.length)throw Error('ATTRIBUTED_TARGET_MISSING');}
 else if(projection.disposition==='Unavailable'){if(xs.length)throw Error('ATTRIBUTED_TARGET_UNAVAILABLE');}
 else throw Error('ATTRIBUTED_TARGET_DISPOSITION');
 const unique=new Map<string,ChildLoss>();
 for(const x of xs){if(typeof x.acquisition!=='bigint'||x.acquisition<0n)throw Error('ATTRIBUTED_TARGET_ID');symbol(x.unit);unique.set(JSON.stringify([x.acquisition.toString(),x.unit]),{acquisition:x.acquisition,unit:x.unit});}
 const targets=[...unique.values()].sort((a,b)=>compare(bytes(a),bytes(b)));
 // Pure validator reuse only: discarded fragmentation result does not enact loss.
 fragmentRetainedUnits(owner.memory,targets,{EventContinuant:1024,Interoceptive:1024});
 return Object.freeze(targets.map(x=>Object.freeze(x)));
}
