import type {CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataRecord,dataField} from '../campaign2/canonicalData';
import {VERSION} from '../campaign3/dispositionPublicModel';
import {DISPOSITION_LAWS} from '../campaign3/dispositionAdaptation';
import {exactKey} from './canonical';
import type {DispositionInspectionSummary} from './dispositionPagedAdapter';
type Identity=Pick<DispositionInspectionSummary,'program'|'seamVersion'|'prefix'|'constitution'|'law'|'saveHash'>;
/** Trusted worker projection: identity and canonical state must belong to the same save. */
export function dispositionCanonicalStoredState(identity:Identity,state:CanonicalValue){
 if(identity.seamVersion!==VERSION||!Number.isInteger(identity.prefix)||identity.prefix<0||identity.prefix>18)throw Error('DISPOSITION stored-state revision mismatch');
 if(!DISPOSITION_LAWS.some(law=>law===identity.law))throw Error('DISPOSITION stored-state law mismatch');
 const entries=restoreAuthoritativeState(state).entries();
 const read=(root:bigint,type:bigint)=>{
  const found=entries.filter(e=>e.path.rootStateTypeId===root);
  if(found.length>1)throw Error('Ambiguous disposition stored-state leaf');
  if(!found.length)return null;
  const value=dataField(dataRecord(found[0].value,type),1n);
  if(typeof value==='boolean'||value.kind!=='rational'||value.denominator<=0n||value.numerator>value.denominator||value.numerator< -value.denominator)throw Error('DISPOSITION stored-state rational range mismatch');
  const exact=`${value.numerator}/${value.denominator}`,plot=Number(value.numerator)/Number(value.denominator);
  if(exact.length>256||!Number.isFinite(plot))throw Error('DISPOSITION stored-state plotting bound exceeded');
  return {exact,plot,path:exactKey(statePathValue(found[0].path))};
 };
 const constitution=read(1457n,1453n),plastic=read(1458n,1454n);
 if(!constitution||constitution.exact!==identity.constitution)throw Error('DISPOSITION stored-state constitution mismatch');
 if((identity.law==='Refold')!==(plastic===null))throw Error('DISPOSITION stored-state plastic ownership mismatch');
 return {version:'disposition-canonical-stored-state/0.1',identity:{...identity},constitution,plastic,
  scope:'Stored constitution and plastic contribution at this committed revision. Refold has no stored plastic leaf; absence is not zero. Plot coordinates are diagnostic and exact fractions and paths are authoritative. These two scalars are not a general personality vector, identity standing, effective disposition or character self-knowledge. The owning worker must bind this projection to the save revision; it does not authenticate state on its own.'};
}
