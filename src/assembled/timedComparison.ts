import {LEGACY_TIME_LIMIT,assertTimeLimit,type TimeLimit} from './timeDomain';
/** assembled-timed-comparison/0.1: committed experimental correspondence, never evidence. */
import {list,text,signed,unsigned,typedIdentifier,type CanonicalValue,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {ComparisonDrawMap,randomAddressValue,type RandomAddress,type ComparisonDrawMapEntry} from '../substrate/random';
import {dataItems as items,dataIdentity as id,dataKey as key,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import {comparisonAddress,comparisonRoles,compileComparison} from './comparison';
export const TIMED_COMPARISON='assembled-timed-comparison/0.1';
export type TimedEntry={at:bigint;purposeId:TypedIdentifierValue;subjectBindings:RandomAddress['subjectBindings'];comparisonDrawKey:ComparisonDrawMapEntry['comparisonDrawKey']};
export const isTimedComparison=(v:CanonicalValue|undefined)=>typeof v!=='boolean'&&v?.kind==='list'&&v.items.length>0&&key(v.items[0])===key(text(TIMED_COMPARISON));
function canonical(entries:readonly TimedEntry[],timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 if(entries.length>1000)invalidModel('timed comparison capacity1000');
 const mapped=entries.map(e=>{if(typeof e.at!=='bigint'||e.at<1n||e.at>timeLimit)invalidModel('timed comparison instant1..'+timeLimit);const address=comparisonAddress(randomAddressValue({causalRootId:typedIdentifier(1135,unsigned(e.at)),purposeId:e.purposeId,subjectBindings:e.subjectBindings,drawIndex:0n}));return {localRandomAddress:address,comparisonDrawKey:e.comparisonDrawKey};});
 return compileComparison(new ComparisonDrawMap(mapped,comparisonRoles).canonicalValue);
}
function valueOf(map:ComparisonDrawMap){return list([text(TIMED_COMPARISON),list(map.entries.map(e=>list([signed(uint(e.localRandomAddress.causalRootId.payload)),e.localRandomAddress.purposeId,list(e.localRandomAddress.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId]))),e.comparisonDrawKey.keyId,e.comparisonDrawKey.comparisonRoleId])))]);}
export function timedComparisonValue(entries:readonly TimedEntry[],timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);return valueOf(canonical(entries,timeLimit));}
export function compileTimedComparison(value:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 const v=items(value,'list');if(v.length!==2||key(v[0])!==key(text(TIMED_COMPARISON)))invalidModel('timed comparison header');
 const entries=items(v[1],'list').map(row=>{const a=items(row,'list'),at=a[0];if(a.length!==5||typeof at==='boolean'||at.kind!=='signed')invalidModel('timed comparison entry');
  return {at:(at as Extract<CanonicalValue,{kind:'signed'}>).value,purposeId:id(a[1]),subjectBindings:items(a[2],'list').map(b=>{const x=items(b,'list');if(x.length!==2)invalidModel('timed comparison binding');return {subjectRoleId:id(x[0]),subjectId:id(x[1])};}),comparisonDrawKey:{keyId:id(a[3]),comparisonRoleId:id(a[4])}};
 });
 const map=canonical(entries,timeLimit),normalized=valueOf(map);if(key(value)!==key(normalized))invalidModel('timed comparison canonical order');
 const frozen=structuredClone(map.entries),instants=Object.freeze([...new Set(frozen.map(e=>uint(e.localRandomAddress.causalRootId.payload)))]);
 return Object.freeze({canonicalValue:structuredClone(normalized),instants,
  bind(at:bigint,root:TypedIdentifierValue){if(root.namespaceId!==1135n)invalidModel('timed comparison resolution root');uint(root.payload);
   return new ComparisonDrawMap(frozen.filter(e=>uint(e.localRandomAddress.causalRootId.payload)===at).map(e=>({localRandomAddress:{...structuredClone(e.localRandomAddress),causalRootId:structuredClone(root)},comparisonDrawKey:structuredClone(e.comparisonDrawKey)})),comparisonRoles);
  }
 });
}
export type TimedComparison=ReturnType<typeof compileTimedComparison>;
