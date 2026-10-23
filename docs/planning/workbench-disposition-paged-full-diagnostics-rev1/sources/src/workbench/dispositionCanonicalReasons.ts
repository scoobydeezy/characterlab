import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {equalBytes,exactText} from './canonical';
import type {TimelineEvent} from './contracts';
const rational=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='rational')throw Error('DISPOSITION exact rational expected');return `${v.numerator}/${v.denominator}`;};
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||!['signed','unsigned'].includes(v.kind))throw Error('DISPOSITION exact integer expected');return exactText(v).slice(1,-1);};
/** Same qualified factor result, from admitted canonical output rather than whole-output JSON. */
export function inspectDispositionCanonicalReasons(event:Pick<TimelineEvent,'id'|'instant'|'stage'|'phase'>,value:CanonicalValue){
 if(event.stage!=='reasons'||event.phase!=='52')throw Error('DISPOSITION reasons-stage event required');
 const output=items(value,'list'),identity={eventId:event.id,instant:event.instant,phase:event.phase};
 if(output.length===0)return {version:'disposition-reason-diagnostics/0.1',...identity,emitted:false as const,scope:'No operand record was emitted at this native stage. No motive or choice is inferred.'};
 if(output.length!==2)throw Error('DISPOSITION reasons output envelope mismatch');
 const operands=rec(output[0],1455n),reasons=rec(output[1],1430n);
 if(!equalBytes(canonicalEncode(f(operands,8n)),canonicalEncode(reasons)))throw Error('DISPOSITION operand/result lineage mismatch');
 const constitution=rec(f(operands,2n),1453n),history=rec(f(operands,7n),1435n),context=rec(f(reasons,5n),408n);
 const nuclei=items(f(context,3n),'list').map(value=>{
  const nucleus=rec(value,407n),roles=rec(f(nucleus,2n),406n);rec(f(nucleus,1n),404n);rec(f(nucleus,7n),424n);items(f(roles,4n),'list');
  return {key:exactText(f(nucleus,1n)),baseNet:rational(f(roles,1n)),standingNet:rational(f(roles,2n)),situationalNet:rational(f(roles,3n)),relevance:rational(f(nucleus,3n)),baseDie:integer(f(nucleus,4n)),standingModifier:integer(f(nucleus,5n)),situationalModifier:integer(f(nucleus,6n)),coverage:exactText(f(roles,4n)),distribution:exactText(f(nucleus,7n))};
 });
 return {version:'disposition-reason-diagnostics/0.1',...identity,emitted:true as const,constitution:rational(f(constitution,1n)),plastic:rational(f(operands,3n)),standing:rational(f(operands,4n)),effective:rational(f(operands,5n)),feedback:rational(f(operands,6n)),qualifiedEntries:items(f(history,1n),'list').length,nuclei,
  scope:'Recorded reasons-stage operands and compiled nuclei only. Constitution, plastic adaptation, identity standing, effective disposition and selected feedback remain separate. Qualified entries are not independent corroboration. Mechanical dice/distributions are not character uncertainty. This diagnostic reader grants no represented self-knowledge, character narration, independent causal contribution or complete choice explanation.'};
}
