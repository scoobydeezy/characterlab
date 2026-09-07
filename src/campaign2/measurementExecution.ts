/** measurement-evidence-carriage/0.1-candidate: detached, transient evidence only. */
import {canonicalEncode,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeMeasurement,measurementRecord} from './measurementModelSource';
export function executeMeasurementIntake(observation:CanonicalValue,unit:CanonicalValue,occurrence:CanonicalValue):CanonicalValue {
 return measurementRecord(337,[decodeMeasurement(canonicalEncode(occurrence)),decodeMeasurement(canonicalEncode(observation)),decodeMeasurement(canonicalEncode(unit)),text('measurement-evidence-carriage/0.1-candidate')]);
}
