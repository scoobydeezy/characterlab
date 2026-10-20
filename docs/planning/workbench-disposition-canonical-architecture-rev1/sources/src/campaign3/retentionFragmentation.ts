/** retention-fragmentation-component/0.1-candidate: mechanics only, no survival policy or public admission. */
export type RetentionKind='EventContinuant'|'Interoceptive';
export interface RetainedChild {readonly key:string;readonly views:readonly Uint8Array[]}
export interface RetainedAcquisition {readonly id:bigint;readonly kind:RetentionKind;readonly units:readonly RetainedChild[]}
export interface ChildLoss {readonly acquisition:bigint;readonly unit:string}
const fail=(why:string):never=>{throw new RangeError('retention fragmentation: '+why);};
function dense(xs:readonly unknown[],max:number){if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length>max||Array.from({length:xs.length},(_,i)=>Object.hasOwn(xs,i)).some(v=>!v))fail('dense bounded array');}
function symbol(key:string){if(typeof key!=='string'||!key||key!==key.normalize('NFC')||new TextEncoder().encode(key).length>64)fail('unit key');}
function ordinal(id:bigint){if(typeof id!=='bigint'||id<0n)fail('acquisition identity');}
export function fragmentRetainedUnits(input:readonly RetainedAcquisition[],losses:readonly ChildLoss[],capacity:Readonly<Record<RetentionKind,number>>){
 dense(input,32);dense(losses,1024);
 for(const k of ['EventContinuant','Interoceptive'] as const)if(!Number.isSafeInteger(capacity[k])||capacity[k]<0||capacity[k]>1024)fail('capacity');
 const indexed=new Map<bigint,Map<string,RetainedChild>>();
 for(const a of input){
  ordinal(a.id);if(indexed.has(a.id))fail('duplicate acquisition');if(a.kind!=='EventContinuant'&&a.kind!=='Interoceptive')fail('kind');
  dense(a.units,32);if(!a.units.length)fail('empty acquisition');const units=new Map<string,RetainedChild>();
  for(const unit of a.units){symbol(unit.key);if(units.has(unit.key))fail('duplicate unit');dense(unit.views,16);if(!unit.views.length)fail('empty evidence basis');
   for(const bytes of unit.views)if(!(bytes instanceof Uint8Array)||bytes.length===0||bytes.length>65536)fail('view bytes');units.set(unit.key,unit);
  }indexed.set(a.id,units);
 }
 const removed=new Map<bigint,Set<string>>();
 for(const loss of losses){ordinal(loss.acquisition);symbol(loss.unit);if(!indexed.get(loss.acquisition)?.has(loss.unit))fail('unknown loss');
  const set=removed.get(loss.acquisition)??new Set<string>();if(set.has(loss.unit))fail('duplicate loss');set.add(loss.unit);removed.set(loss.acquisition,set);
 }
 const usage:Record<RetentionKind,number>={EventContinuant:0,Interoceptive:0};const acquisitions:RetainedAcquisition[]=[];
 for(const a of input){const units=a.units.filter(u=>!removed.get(a.id)?.has(u.key)).map(u=>({key:u.key,views:u.views.map(b=>b.slice())}));
  usage[a.kind]+=units.length;if(units.length)acquisitions.push({id:a.id,kind:a.kind,units});
 }
 for(const k of ['EventContinuant','Interoceptive'] as const)if(usage[k]>capacity[k])fail('insufficient loss plan');
 return {acquisitions,usage};
}
