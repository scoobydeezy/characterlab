/** body-selection-occurrence-component/0.1-candidate. Completed-source authentication upstream. */
import {cloneCanonicalValue,typedIdentifier,unsigned,type TypedIdentifierValue} from '../substrate/canonicalEncoding';
import {selectLocalReserveSignals,consumeInteroceptiveSignals,closeInteroceptiveSignals,type SignalGateLimits,type SignalSelectionInput,type SignalSelectedView} from './interoceptiveSignalSelection';
declare const brand:unique symbol;
export interface BodySelectionView {readonly [brand]:true}
const views=new WeakMap<object,{selectionId:bigint;view:SignalSelectedView<bigint|null>}>();
/** One actual selector occurrence, even when capacity or observation excludes every group. */
export function selectBodyOccurrence(input:SignalSelectionInput<bigint|null>,limits:SignalGateLimits,allocate:()=>bigint){
 if(input.at<1n||limits.maxSignals>3||limits.maxViewsPerSignal>3||!Array.isArray(input.declarations)||input.declarations.length<1||input.declarations.length>9||!Array.isArray(input.samples)||input.samples.length!==input.declarations.length)throw Error('BODY_SELECTION_PROFILE');
 const selected=selectLocalReserveSignals(input,limits);
 try{
  const selectionId=allocate();if(typeof selectionId!=='bigint'||selectionId<0n)throw Error('BODY_SELECTION_ALLOCATION');
  const selection=typedIdentifier(1143,unsigned(selectionId));
  const audit={selection:cloneCanonicalValue(selection) as TypedIdentifierValue,observer:cloneCanonicalValue(input.observer) as TypedIdentifierValue,at:input.at,opportunity:input.opportunityId,rows:selected.audit.map(r=>({...r}))};
  const view=Object.freeze({}) as BodySelectionView;views.set(view,{selectionId,view:selected.view});return {selectionId,audit,view};
 }catch(error){closeInteroceptiveSignals(selected.view);throw error;}
}
export function consumeBodySelection(view:BodySelectionView){
 const stored=views.get(view);if(!stored)throw Error('BODY_SELECTION_VIEW');views.delete(view);
 return {selectionId:stored.selectionId,selection:typedIdentifier(1143,unsigned(stored.selectionId)),...consumeInteroceptiveSignals(stored.view)};
}
export function closeBodySelection(view:BodySelectionView){const stored=views.get(view);if(stored)closeInteroceptiveSignals(stored.view);views.delete(view);}
