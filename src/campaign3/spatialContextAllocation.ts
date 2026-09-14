/** spatial-context-allocation/0.1-candidate. Pure geometry/allocation; no causal-role authority. */
import {ExactRational as Q} from '../substrate/exactMath';

export interface ObservedPosition {readonly x: bigint; readonly y: bigint;}
export interface SpatialDetection {readonly detectionId: bigint; readonly position?: ObservedPosition;}
export interface SpatialCalibration {
 readonly minX: bigint; readonly maxX: bigint; readonly minY: bigint; readonly maxY: bigint;
 readonly focalWeight: Q; readonly residualPool: Q;
}
export type SpatialAllocation = {
 readonly detectionId: bigint;
 readonly spatialClass: 'SpatialFocal' | 'SpatialPeripheral';
 readonly position: ObservedPosition;
 readonly allocation: Q;
} | {readonly detectionId: bigint; readonly spatialClass: 'SpatialUnknown';};

function fail(message: string): never {throw new RangeError('spatial context: '+message);}
function own(value: unknown, required: readonly string[], optional: readonly string[] = []): void {
 if(!value || typeof value !== 'object' || Object.getPrototypeOf(value) !== Object.prototype) fail('plain data required');
 const descriptors = Object.getOwnPropertyDescriptors(value);
 if(Reflect.ownKeys(descriptors).some(k => typeof k !== 'string' || !required.includes(k) && !optional.includes(k)) ||
    required.some(k => !Object.hasOwn(descriptors,k)) || Object.values(descriptors).some(d => !('value' in d))) fail('exact data fields required');
}
function cell(value: bigint): void {if(typeof value !== 'bigint' || value < 0n || value > 7n) fail('cell domain');}
function unit(value: Q): Q {
 if(!(value instanceof Q) || typeof value.numerator !== 'bigint' || typeof value.denominator !== 'bigint' ||
    value.denominator <= 0n || value.numerator < 0n || value.numerator > value.denominator) fail('unit rational');
 return Q.of(value.numerator,value.denominator);
}

export function allocateSpatialContext(input: readonly SpatialDetection[], calibration: SpatialCalibration): readonly SpatialAllocation[] {
 own(calibration,['minX','maxX','minY','maxY','focalWeight','residualPool']);
 for(const bound of [calibration.minX,calibration.maxX,calibration.minY,calibration.maxY]) cell(bound);
 if(calibration.minX > calibration.maxX || calibration.minY > calibration.maxY) fail('empty rectangle');
 const focal = unit(calibration.focalWeight), pool = unit(calibration.residualPool);
 if(!Array.isArray(input) || Object.getPrototypeOf(input) !== Array.prototype || input.length > 8) fail('bounded plain list');
 const descriptors = Object.getOwnPropertyDescriptors(input);
 if(Reflect.ownKeys(descriptors).some(k => k !== 'length' && (typeof k !== 'string' || !/^(0|[1-9][0-9]*)$/.test(k))) ||
    Object.values(descriptors).some(d => !('value' in d)) || Object.keys(descriptors).length !== input.length+1) fail('dense data list');
 let previous = -1n;
 const rows = input.map(d => {
  own(d,['detectionId'],['position']);
  if(typeof d.detectionId !== 'bigint' || d.detectionId <= previous) fail('ordered nonnegative detections');
  previous = d.detectionId;
  if(!Object.hasOwn(d,'position')) return {detectionId:d.detectionId,spatialClass:'SpatialUnknown' as const};
  own(d.position,['x','y']);
  const {x,y} = d.position!; cell(x); cell(y);
  const inside = x >= calibration.minX && x <= calibration.maxX && y >= calibration.minY && y <= calibration.maxY;
  return {detectionId:d.detectionId,position:{x,y},spatialClass:inside ? 'SpatialFocal' as const : 'SpatialPeripheral' as const};
 });
 const peripheralCount = rows.filter(r => r.spatialClass === 'SpatialPeripheral').length;
 const residual = peripheralCount === 0 ? Q.of(0n) : pool.divide(Q.of(BigInt(peripheralCount)));
 return rows.map(r => r.spatialClass === 'SpatialUnknown' ? r : {
  detectionId:r.detectionId,position:r.position!,spatialClass:r.spatialClass,
  allocation:r.spatialClass === 'SpatialFocal' ? focal : residual,
 });
}
