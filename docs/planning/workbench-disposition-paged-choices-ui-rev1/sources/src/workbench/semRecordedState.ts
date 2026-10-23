import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec} from '../campaign2/canonicalData';
import {restorePerceptualContinuantFileState,restorePerceptualEventFileState} from '../semanticBinding/semanticCodecs';
import {perceptualStateEntries} from '../semanticBinding/semanticStateAuthority';
import {statePathValue} from '../substrate/state';
import {exactKey,exactText} from './canonical';
export function semRecordedState(state:CanonicalValue){
 const parts=items(state,'list');if(parts.length!==3||parts[2]!==true)throw Error('SEM committed state envelope');rec(parts[0],241n);rec(parts[1],242n);
 const fields=perceptualStateEntries(restorePerceptualContinuantFileState(parts[0]),restorePerceptualEventFileState(parts[1])).map(e=>({root:String(e.path.rootStateTypeId),path:exactKey(statePathValue(e.path)),exact:exactText(e.value)}));
 if(new Set(fields.map(f=>f.path)).size!==fields.length)throw Error('SEM duplicate registered state path');
 return {version:'sem-registered-state-inspection/0.1',fields,harnessValid:true,
  scope:'All registered leaves of the two stored perceptual-file roots241/242: observer counters and active-file membership. Boolean true is an existing membership marker, not a person/object value. The separate true validation flag belongs to the scheduler harness. Recognition and causal-role outputs are not stored roots243/244. Empty leaves do not imply absent perception or unused machinery.'};
}
