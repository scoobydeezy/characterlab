/** general-attention-primitive-grammar/0.1-candidate; decoded canonical values.
 * Identity, record, contextual field and public source admission are separate. */
import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {INT64_MAX} from '../substrate/time';
const ranges={Glyph:[0n,7n],Cell:[0n,7n],ViewOrdinal:[0n,2n],ViewCount:[0n,3n],SourceBound:[32n,32n],
 GraphScale:[1n,1000n],DecayExponent:[1n,16n],RecallCount:[0n,32n],MemorySlotCount:[0n,1024n],
 GraphNodeCount:[0n,30n],GraphEdgeCount:[0n,870n],SignalLimit:[1n,3n],SignalViewLimit:[1n,3n],SignalByteLimit:[1n,65536n],SignalCount:[0n,3n],OutputCount:[0n,32n]} as const;
const phases=new Set([0n,10n,11n,12n,13n,14n,15n,40n,50n,110n,120n,121n,122n,123n,124n,125n,130n,140n]);
export type GeneralPrimitive=keyof typeof ranges|'Instant'|'OriginalAddress'|'FieldOrdinal'|'PhaseOrdinal'|'LatticeMass'|'VersionText'|'Boolean'|'False'|'Rational'|'NonnegativeRational'|'PositiveRational'|'UnitRational'|'PositiveUnitRational'|'OneToTwoRational';
export interface GeneralPrimitiveContext {readonly graphScale?:bigint;readonly admittedVersions?:readonly string[]}
function fail(name:string):never{throw Error('GENERAL_PRIMITIVE_'+name);}
export function validateGeneralPrimitive(name:GeneralPrimitive,value:CanonicalValue,context:GeneralPrimitiveContext={}):void{
 canonicalEncode(value);
 if(name==='Boolean'){if(typeof value!=='boolean')fail(name);return;}
 if(name==='False'){if(value!==false)fail(name);return;}
 if(typeof value==='boolean')fail(name);
 if(name==='VersionText'){
  if(value.kind!=='text'||!value.value||!context.admittedVersions?.includes(value.value))fail(name);return;
 }
 if(name==='Instant'){if(value.kind!=='signed'||value.value<0n||value.value>INT64_MAX)fail(name);return;}
 if(['Rational','NonnegativeRational','PositiveRational','UnitRational','PositiveUnitRational','OneToTwoRational'].includes(name)){
  if(value.kind!=='rational')fail(name);const {numerator:n,denominator:d}=value;
  if(name==='Rational')return;
  if(name==='OneToTwoRational'){if(n<d||n>2n*d)fail(name);return;}
  if(n<0n||(['PositiveRational','PositiveUnitRational'].includes(name)&&n===0n)||(['UnitRational','PositiveUnitRational'].includes(name)&&n>d))fail(name);return;
 }
 if(value.kind!=='unsigned')fail(name);
 if(Object.hasOwn(ranges,name)){const [lo,hi]=ranges[name as keyof typeof ranges];if(value.value<lo||value.value>hi)fail(name);return;}
 if(name==='OriginalAddress')return;
 if(name==='FieldOrdinal'){if(value.value===0n)fail(name);return;}
 if(name==='PhaseOrdinal'){if(!phases.has(value.value))fail(name);return;}
 if(name==='LatticeMass'){const scale=context.graphScale;if(typeof scale!=='bigint'||scale<1n||scale>1000n||value.value>scale)fail(name);return;}
 fail(name);
}
