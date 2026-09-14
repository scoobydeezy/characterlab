/** selected-encoding/0.2-candidate: explicit denominator controls over the same selected content. */
import {ExactRational as Q} from '../substrate/exactMath';
import type {SelectedView} from './attentionSelection';
import {encodeSelectedEvidence,type SelectedAttentionLaw} from './selectedEncoding';
import {encodingBudget,type EncodingBudget} from './encodingAccessMath';
export type SelectedBudgetCalibration = 'UnitBudget' | 'SmallBudget';
export function encodeSelectedBudgetControl(view:SelectedView,law:EncodingBudget,attention:SelectedAttentionLaw,calibration:SelectedBudgetCalibration) {
 const result=encodeSelectedEvidence(view,law,attention);
 if(calibration!=='UnitBudget'&&calibration!=='SmallBudget') throw new RangeError('selected budget calibration');
 const budget=calibration==='UnitBudget'?Q.of(1n):Q.of(1n,5n);
 const strengths=encodingBudget(result.rows.map(r=>r.continuantKey),result.rows.map(r=>r.raw),law,budget,Q.of(1n,4n));
 return {...result,version:'selected-encoding/0.2-candidate' as const,budgetCalibration:calibration,
  rows:result.rows.map((r,i)=>({...r,strength:strengths[i]}))};
}
