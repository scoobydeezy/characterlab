/** focal-attribution-component/0.1-candidate; supplied admitted focus, not a public focus producer. */
import {prepareRetainedAttributionUse} from './retainedAttributionUse';
import {normalizeAttributedChildren} from './attributedChildBoundary';
import type {ChildLoss} from './retentionFragmentation';
type Input=Parameters<typeof prepareRetainedAttributionUse>[0];
type Project=Parameters<typeof prepareRetainedAttributionUse>[1];
export function prepareFocalAttribution(owner:Input&{readonly observer:string;readonly character:string},opportunity:{readonly observer:string;readonly character:string;readonly consequence:string;readonly focal:ChildLoss},project:Project){
 const focus=normalizeAttributedChildren(owner,{...opportunity,disposition:'Supported',targets:[opportunity.focal]})[0];
 if(owner.memory.find(a=>a.id===focus.acquisition)!.acquiredAt>=owner.now)throw Error('FOCAL_PRIOR_MEMORY_REQUIRED');
 const consequence=opportunity.consequence;
 if(typeof consequence!=='string'||!consequence||consequence!==consequence.normalize('NFC')||new TextEncoder().encode(consequence).length>128)throw Error('FOCAL_CONSEQUENCE_REFERENCE');
 const observer=opportunity.observer,character=opportunity.character,tx=prepareRetainedAttributionUse(owner,project);
 return Object.freeze({evaluate:tx.evaluate,close:tx.close,finish(token:Parameters<typeof tx.finish>[0]){
  const result=tx.finish(token);
  return {...result,focus:Object.freeze({observer,character,consequence,focal:focus}),attributedTargets:Object.freeze(result.assessment.kind==='Supported'?[focus]:[])};
 }});
}
