/** assembled-character-tolerance/0.1-candidate: consume existing physical ADAPT,
 * never create a second adaptation owner or expose its magnitude to cognition. */
import {list,text,signed,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ContractReadProjection,type AuthoritativeState,type StatePath,type StatePathPattern} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {campaign2Record} from '../campaign2/codecs';
import {dataItems as items,dataText as txt,dataIdentity as id,dataRecord as rec,dataField as f,dataUnsigned as u,invalidModel} from '../campaign2/canonicalData';
import {tolerancePotential,LAWS,type ToleranceLaw} from '../campaign3/toleranceEffect';
import {atom} from '../campaign3/embodiedMath';
export const TOLERANCE_VERSION='assembled-character-tolerance/0.1-candidate';
export const TOLERANCE_DECLARATION='assembled-tolerance/0.1';
export const TOLERANCE_EFFECT='assembled-tolerance-effect/0.1';
export function compileTolerance(v:CanonicalValue){
 const a=items(v,'list');if(a.length!==3||txt(a[0])!==TOLERANCE_DECLARATION)invalidModel('tolerance declaration requires three fields');
 const variable=id(a[1]),law=txt(a[2]);if(variable.namespaceId!==1029n||!LAWS.includes(law as ToleranceLaw))invalidModel('tolerance variable namespace/law');
 return Object.freeze({variable,law:law as ToleranceLaw});
}
export type ToleranceDeclaration=ReturnType<typeof compileTolerance>;
export function tolerancePath(C:CanonicalValue,variable:CanonicalValue):StatePath{return {rootStateTypeId:302n,fieldId:1n,selectors:[{kind:'mapKey',key:campaign2Record('ToleranceKey',{CharacterId:C,ExposureReferentId:C,RegulatoryVariableId:variable})}]};}
export function deliveredPotential(state:AuthoritativeState,C:CanonicalValue,d:ToleranceDeclaration,capacity:Q,amount:Q,at:bigint){
 const path=tolerancePath(C,d.variable),domain:StatePathPattern={...path,selectors:path.selectors.map(selector=>({kind:'exact',selector}))};
 const projection=new ContractReadProjection(state,[domain],{value:{kind:'direct',accessorId:typedIdentifier(1028,text('accessor/assembled-delivery-tolerance')),path}}),value=projection.read('value');
 const t=value===undefined?0n:u(f(rec(value,297n),1n));
 if(capacity.compare(Q.of(0n))<=0)invalidModel('tolerance body capacity');
 const potential=tolerancePotential(d.law,t,amount.multiply(Q.of(10n)).divide(capacity)).multiply(capacity).divide(Q.of(10n));
 const target=path.selectors[0];if(target.kind!=='mapKey')throw new Error('tolerance key');
 return {potential,domain,reads:projection.actualReadRecords(),output:list([text(TOLERANCE_EFFECT),signed(at),target.key,text(d.law),unsigned(t),atom(amount),atom(potential)])};
}
