/** multisource-selected-descriptions/0.1-candidate. Selected component evidence;
 * no source/adoption/model capability is granted by its detached result. */
import {canonicalEncode,cloneCanonicalValue,map,record,unsigned,typedIdentifier,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {consumeInteroceptiveSignals,type SignalSelectedView} from './interoceptiveSignalSelection';
import {LOCAL_RESERVE_OBSERVATION_VERSION} from './localReserveObservation';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {readQ,qValue,ZERO,ONE} from '../campaign2/cognitiveMath';
import {receivingRecord as r,receivingSchema} from './receivingCodecs';
import {deficitPressure} from './embodiedMath';
export const MULTISOURCE_SELECTED_DESCRIPTIONS_VERSION='multisource-selected-descriptions/0.1-candidate';
export interface SelectedDescription {readonly id:string;readonly signal:string;readonly channels:readonly string[];readonly threshold:Q;readonly direction:'FavorBelow'|'DisfavorBelow';}
export function produceSelectedDescriptions(view:SignalSelectedView<bigint|null>,observer:CanonicalValue,declarations:readonly SelectedDescription[]){
 if(!Array.isArray(declarations)||declarations.length<1||declarations.length>3)throw Error('MULTISOURCE_DESCRIPTION_DOMAIN');
 const seen=new Set<string>();
 const definitions=Array.from(declarations,d=>{
  if(!d||typeof d.id!=='string'||!/^[-a-zA-Z0-9_/]{1,80}$/.test(d.id)||seen.has(d.id)||typeof d.signal!=='string'||!d.signal.startsWith('interoceptive-signal/')||!Array.isArray(d.channels)||d.channels.length<1||d.channels.length>2||Array.from(d.channels,c=>typeof c==='string'&&/^channel\/[A-Za-z0-9_-]+$/.test(c)).some(ok=>!ok)||new Set(d.channels).size!==d.channels.length||!(d.threshold instanceof Q)||d.threshold.compare(ZERO)<=0||!['FavorBelow','DisfavorBelow'].includes(d.direction))throw Error('MULTISOURCE_DESCRIPTION_DECLARATION');
  seen.add(d.id);return {id:d.id,signal:d.signal,channels:[...d.channels].sort(),threshold:Q.of(d.threshold.numerator,d.threshold.denominator),direction:d.direction};
 }).sort((a,b)=>a.id<b.id?-1:1);
 const selected=consumeInteroceptiveSignals(view);
 if(key(selected.observer)!==key(observer))throw Error('MULTISOURCE_DESCRIPTION_OBSERVER');
 if(selected.groups.length>3||selected.groups.some(g=>g.samples.length>2))throw Error('MULTISOURCE_DESCRIPTION_VIEWS');
 for(const g of selected.groups)for(const s of g.samples){const v=f(rec(s,461n),6n);if(typeof v==='boolean'||v.kind!=='text'||v.value!==LOCAL_RESERVE_OBSERVATION_VERSION)throw Error('MULTISOURCE_DESCRIPTION_VERSION');}
 const assessments=definitions.map(d=>{
  if(d.channels.some(c=>selected.groups.some(g=>g.signal!==d.signal&&g.samples.some(s=>key(f(rec(s,461n),3n))===key(typedIdentifier(1005,text(c)))))))throw Error('MULTISOURCE_DESCRIPTION_SIGNAL');
  const group=selected.groups.find(g=>g.signal===d.signal);
  const samples=d.channels.map(c=>group?.samples.find(s=>key(f(rec(s,461n),3n))===key(typedIdentifier(1005,text(c)))));
  if(samples.some(s=>s===undefined))return {id:d.id,signal:d.signal,kind:'Unavailable' as const};
  const records=samples.map(s=>rec(s!,461n));
  const intervals=records.map(s=>{const interval=rec(f(s,5n),462n);return {lower:readQ(f(interval,1n)),upper:readQ(f(interval,2n))};});
  const lower=intervals.reduce((a,b)=>a.compare(b.lower)<0?a:b.lower,intervals[0].lower),upper=intervals.reduce((a,b)=>a.compare(b.upper)>0?a:b.upper,intervals[0].upper);
  const magnitude=deficitPressure(upper,d.threshold),strength=d.direction==='FavorBelow'?magnitude:ZERO.subtract(magnitude);
  const basis=r(400,[map(records.map(s=>[r(399,[unsigned(1),record(receivingSchema(237n),new Map([[1n,unsigned(1)],[2n,f(s,1n)]]))]),qValue(ONE)]))]);
  // Encoding validates the complete basis; nothing is dropped or keyed by truth.
  canonicalEncode(basis);
  return {id:d.id,signal:d.signal,kind:'Known' as const,lower,upper,strength,basis,samples:records.map(cloneCanonicalValue)};
 });
 return {version:MULTISOURCE_SELECTED_DESCRIPTIONS_VERSION,observer:cloneCanonicalValue(selected.observer),at:selected.at,opportunityId:selected.opportunityId,assessments};
}
