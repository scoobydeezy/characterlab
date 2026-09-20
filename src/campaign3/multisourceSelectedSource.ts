/** multisource-selected-source/0.1-candidate. Trusted component join only;
 * public source, observer-holder and temporal authentication remain upstream. */
import {canonicalEncode,cloneCanonicalValue,map,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {consumeInteroceptiveSignals,type SignalSelectedView} from './interoceptiveSignalSelection';
import {receivingRecord as r,receivingSchema,decodeReceiving} from './receivingCodecs';
import {record} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {readQ,qValue,ZERO,ONE} from '../campaign2/cognitiveMath';
import {deficitPressure} from './embodiedMath';
import {LOCAL_RESERVE_OBSERVATION_VERSION} from './localReserveObservation';

export const MULTISOURCE_SELECTED_SOURCE_VERSION='multisource-selected-source/0.1-candidate';
export interface ReserveCriterion {readonly signal:string;readonly threshold:Q;}
export interface TaskReserveCriterion extends ReserveCriterion {readonly direction:'FavorBelow'|'DisfavorBelow';}
export interface SelectedSourceInput {
 readonly observer:CanonicalValue;
 readonly taskRaw:CanonicalValue;
 readonly taskKey:CanonicalValue;
 readonly option:CanonicalValue;
 readonly body:ReserveCriterion;
 readonly task:TaskReserveCriterion;
}
function criterion(c:ReserveCriterion){
 if(!c||typeof c.signal!=='string'||!c.signal.startsWith('interoceptive-signal/')||!(c.threshold instanceof Q)||c.threshold.compare(ZERO)<=0)throw Error('MULTISOURCE_CRITERION');
 return {signal:c.signal,threshold:Q.of(c.threshold.numerator,c.threshold.denominator)};
}
/** Returns assessments, never a new public raw/reason occurrence. */
export function produceMultisourceSelectedSource(view:SignalSelectedView<bigint|null>,input:SelectedSourceInput){
 const bodyCriterion=criterion(input.body),taskCriterion=criterion(input.task);
 if(!['FavorBelow','DisfavorBelow'].includes(input.task.direction))throw Error('MULTISOURCE_DIRECTION');
 const raw=rec(decodeReceiving(canonicalEncode(input.taskRaw)),403n);
 const option=rec(decodeReceiving(canonicalEncode(input.option)),395n),task=rec(decodeReceiving(canonicalEncode(input.taskKey)),371n);
 if(key(f(option,1n))!==key(f(task,1n)))throw Error('MULTISOURCE_HOLDER');
 const candidates=rec(f(raw,2n),398n);
 const origin=items(f(candidates,3n),'list').some(v=>{const c=rec(v,397n);return key(f(c,1n))===key(option)&&items(f(c,2n),'set').some(o=>key(f(rec(o,396n),1n))===key(task));});
 if(!origin)throw Error('MULTISOURCE_SELECTED_TASK');
 const taskSignals=items(f(raw,3n),'set').map(v=>rec(v,402n)).filter(v=>{const s=rec(f(v,1n),401n);return key(f(s,1n))===key(option)&&key(f(s,2n))===key(task);});
 if(taskSignals.some(s=>uint(f(rec(f(s,1n),401n),3n))!==1n))throw Error('MULTISOURCE_EXISTING_MODIFIER');
 if(taskSignals.length>1)throw Error('MULTISOURCE_DUPLICATE_BASE');
 const base=taskSignals[0];
 if(base){const basis=f(rec(f(base,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map'||basis.entries.length||readQ(f(base,2n)).compare(ZERO)<=0)throw Error('MULTISOURCE_COMMITMENT_BASE');}
 const selected=consumeInteroceptiveSignals(view);
 if(key(selected.observer)!==key(input.observer))throw Error('MULTISOURCE_OBSERVER');
 if(selected.groups.length>3||selected.groups.some(g=>g.samples.length!==1))throw Error('MULTISOURCE_SINGLE_VIEW_PROFILE');
 for(const g of selected.groups){const version=f(rec(g.samples[0],461n),6n);if(typeof version==='boolean'||version.kind!=='text'||version.value!==LOCAL_RESERVE_OBSERVATION_VERSION)throw Error('MULTISOURCE_SOURCE_VERSION');}
 function assess(c:ReserveCriterion,direction:1|-1){
  const group=selected.groups.find(g=>g.signal===c.signal);
  if(!group)return {kind:'Unavailable' as const,signal:c.signal};
  const sample=rec(group.samples[0],461n),interval=rec(f(sample,5n),462n),lower=readQ(f(interval,1n)),upper=readQ(f(interval,2n));
  const magnitude=deficitPressure(upper,c.threshold),strength=direction===1?magnitude:ZERO.subtract(magnitude);
  const ref=record(receivingSchema(237n),new Map([[1n,unsigned(1)],[2n,f(sample,1n)]]));
  const basis=r(400,[map([[r(399,[unsigned(1),ref]),qValue(ONE)]])]);
  return {kind:'Known' as const,signal:c.signal,sample:cloneCanonicalValue(sample),lower,upper,threshold:c.threshold,strength,basis};
 }
 return {version:MULTISOURCE_SELECTED_SOURCE_VERSION,observer:cloneCanonicalValue(selected.observer),at:selected.at,opportunityId:selected.opportunityId,
  option:cloneCanonicalValue(option),taskKey:cloneCanonicalValue(task),taskBase:base?cloneCanonicalValue(base):null,
  body:assess(bodyCriterion,1),task:assess(taskCriterion,input.task.direction==='FavorBelow'?1:-1)};
}
