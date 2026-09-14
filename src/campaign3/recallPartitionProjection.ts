/** recall-partition-projection/0.1-candidate; trusted, admitted B0 state projection.
 * Public PRJ/IDN, accessor admission and available-cue gating remain upstream. */
import {copySignificantMemory,type SignificantAcquisition} from './directionalSignificanceState';
import type {RetentionKind} from './retentionFragmentation';
import type {TimedAcquisition} from './recencyRetention';

export function projectRecallPartition(memory:readonly SignificantAcquisition[],kind:RetentionKind,now:bigint):readonly TimedAcquisition[]{
 if(kind!=='EventContinuant'&&kind!=='Interoceptive')throw Error('RECALL_PARTITION_KIND');
 const admitted=copySignificantMemory(memory,now);
 if(admitted.some(a=>a.acquiredAt>=now))throw Error('RECALL_PARTITION_PRIOR');
 // Validate the shared owner value before projection; never silently discard an
 // invalid sibling partition. No retention-policy operand crosses this boundary.
 return admitted.filter(a=>a.kind===kind).map(a=>({id:a.id,kind:a.kind,acquiredAt:a.acquiredAt,
  units:a.units.map(u=>({key:u.key,views:u.views.map(v=>v.slice())}))}));
}
