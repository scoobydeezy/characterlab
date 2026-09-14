/** recall-partitions-component/0.1-candidate. Inputs are independently ranked, authenticated upstream. */
export interface RankedRecallPartitions {readonly EventContinuant:readonly bigint[];readonly Interoceptive:readonly bigint[]}
export function selectRecallPartitions(ranked:RankedRecallPartitions,slots:Readonly<{EventContinuant:number;Interoceptive:number}>){
 const seen=new Set<bigint>();
 for(const kind of ['EventContinuant','Interoceptive'] as const){
  const ids=ranked[kind],k=slots[kind];
  if(!Number.isInteger(k)||k<0||k>32)throw Error('RECALL_PARTITION_SLOTS');
  if(!Array.isArray(ids)||Object.getPrototypeOf(ids)!==Array.prototype||ids.length>32||Object.keys(ids).length!==ids.length)throw Error('RECALL_PARTITION_INPUT');
  for(const id of ids){if(typeof id!=='bigint'||id<0n||seen.has(id))throw Error('RECALL_PARTITION_IDENTITY');seen.add(id);}
 }
 return Object.freeze({EventContinuant:Object.freeze(ranked.EventContinuant.slice(0,slots.EventContinuant)),Interoceptive:Object.freeze(ranked.Interoceptive.slice(0,slots.Interoceptive))});
}
