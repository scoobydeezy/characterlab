import type {CanonicalValue} from '../substrate/canonicalEncoding';
import type {DispositionInspectionSummary} from './dispositionPagedAdapter';
import {canonicalActivityIndex} from './canonicalActivityIndex';
import {dispositionArchitectureFromActivity} from './dispositionArchitecture';
/** Trusted native diagnostics; the owning worker must bind identity, state and trace to one save revision. */
export function dispositionCanonicalArchitecture(identity:Pick<DispositionInspectionSummary,'program'|'seamVersion'|'modelHash'|'runHash'|'stateHash'|'saveHash'|'prefix'>,state:CanonicalValue,trace:readonly CanonicalValue[]){
 return dispositionArchitectureFromActivity(identity,canonicalActivityIndex(state,trace));
}
