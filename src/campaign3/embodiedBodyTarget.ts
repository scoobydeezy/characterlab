/** Exact binding equality under embodied-reserve/0.1-candidate. Qualification of
 * the character and state-family grammar are separately owned by VAL/WRT/PRJ. */
import {type CanonicalValue} from '../substrate/canonicalEncoding';
import {type StatePath} from '../substrate/state';
import {SchedulerContractError} from '../substrate/scheduler';
import {dataKey} from '../campaign2/canonicalData';
export function verifyEmbodiedBodyTarget(path:StatePath,subject:CanonicalValue):void{
 const selector=path.selectors[0];
 if(path.rootStateTypeId!==455n||path.fieldId!==1n||path.selectors.length!==1||selector.kind!=='mapKey'||dataKey(selector.key)!==dataKey(subject))throw new SchedulerContractError('EMBODIED_TARGET_PATH_VIOLATION','selected anchor is not the exact projected/bound body');
}
