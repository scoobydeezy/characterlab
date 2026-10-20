/** selected-encoding/0.1-candidate: consumes live selected evidence; no state authority. */
import {ExactRational as Q} from '../substrate/exactMath';
import {decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import {dataRecord as record,dataField as field,dataIdentity as identity,dataText as text,dataKey as key} from '../campaign2/canonicalData';
import {selectedReferences,consumeSelected,type SelectedView} from './attentionSelection';
import {encodingBudget,type EncodingBudget} from './encodingAccessMath';

export type SelectedAttentionLaw = 'role-calibrated' | 'disabled-attention';
const roleWeights = new Map([['causal-role/actor',Q.of(1n)],['causal-role/target',Q.of(9n,10n)],['causal-role/participant',Q.of(3n,5n)]]);

export function encodeSelectedEvidence(view: SelectedView, budgetLaw: EncodingBudget, attentionLaw: SelectedAttentionLaw) {
 const references = selectedReferences(view);
 const bytes = consumeSelected(view,references);
 if(!['independent','historical-shared','historical-hybrid','retired-flat'].includes(budgetLaw) ||
    !['role-calibrated','disabled-attention'].includes(attentionLaw)) throw new RangeError('selected encoding calibration');
 const evidence = references.map((ref,i)=>({ref,bytes:bytes[i]}));
 const rows = evidence.filter(e=>e.ref.kind === 'causal-role').map(e=>{
  const claim = record(decodeSemanticValue(e.bytes),240n),roleId = text(identity(field(claim,6n)).payload);
  const calibratedRole = roleWeights.get(roleId);
  if(!calibratedRole) throw new RangeError('unsupported selected role');
  const role = Q.of(calibratedRole.numerator,calibratedRole.denominator);
  const base = Q.of(3n,10n),attention = attentionLaw === 'disabled-attention' ? Q.of(1n) : Q.of(role.numerator,role.denominator);
  return {continuantKey:key(field(claim,5n)),claimRef:e.ref,roleId,base,role,attention,raw:base.multiply(role).multiply(attention)};
 }).sort((a,b)=>a.continuantKey < b.continuantKey ? -1 : a.continuantKey > b.continuantKey ? 1 : 0);
 if(new Set(rows.map(r=>r.continuantKey)).size !== rows.length) throw new RangeError('multiple selected roles per continuant');
 const strength = encodingBudget(rows.map(r=>r.continuantKey),rows.map(r=>r.raw),budgetLaw,Q.of(1n),Q.of(1n,4n));
 return {version:'selected-encoding/0.1-candidate' as const,budgetLaw,attentionLaw,
  homogeneousPrior:'calibration/three-tenths' as const,need:'Disabled' as const,surprise:'Disabled' as const,
  evidence,rows:rows.map((r,i)=>({...r,strength:strength[i]}))};
}
