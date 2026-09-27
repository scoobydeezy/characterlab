/** contextual-body-selection/0.1-candidate. Safe companion binding, actual source admission upstream. */
import {bindPerceivedTrialContext,type PerceivedTrialContext} from './perceivedTrialContext';
import {selectBodyOccurrence,consumeBodySelection,closeBodySelection,type BodySelectionView} from './bodySelectionOccurrence';
import type {SignalGateLimits,SignalSelectionInput} from './interoceptiveSignalSelection';
import type {observeGeneralSourceOpportunity} from './generalSourceOpportunity';
type Opportunity=ReturnType<typeof observeGeneralSourceOpportunity>;
export type BodyContext=PerceivedTrialContext;
export type ContextualBodyInput=SignalSelectionInput<bigint|null>&{readonly staged?:Opportunity['staged'];readonly context?:BodyContext};
declare const brand:unique symbol;export interface ContextualBodyView {readonly [brand]:true}
const views=new WeakMap<object,{selected:BodySelectionView;context?:BodyContext}>();
export function selectContextualBody(input:ContextualBodyInput,limits:SignalGateLimits,allocate:()=>bigint){
 let context:BodyContext|undefined;
 if(input.context!==undefined){
  const e=input.staged?.experience;
  if(!e||input.opportunityId!==e.experienceId||e.occurredAt!==input.at)throw Error('BODY_CONTEXT_BINDING');
  const observer=input.observer.payload;if(typeof observer==='boolean'||observer.kind!=='text'||observer.value!==e.observerId)throw Error('BODY_CONTEXT_OBSERVER');
  context=bindPerceivedTrialContext(input.context,e);
 }
 const selected=selectBodyOccurrence(input,limits,allocate),view=Object.freeze({}) as ContextualBodyView;
 views.set(view,{selected:selected.view,context});return {selectionId:selected.selectionId,audit:selected.audit,view};
}
export function consumeContextualBody(view:ContextualBodyView){const stored=views.get(view);if(!stored)throw Error('BODY_CONTEXT_VIEW');views.delete(view);return {...consumeBodySelection(stored.selected),context:structuredClone(stored.context)};}
export function closeContextualBody(view:ContextualBodyView){const stored=views.get(view);if(stored)closeBodySelection(stored.selected);views.delete(view);}
