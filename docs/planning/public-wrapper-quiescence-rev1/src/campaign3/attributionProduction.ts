/** attribution-production/0.1-candidate; source/PRJ and recalled-operand admission remain upstream. */
import {prepareFocalPositionPairAttributionUse} from './retainedAttributionUse';
import {canonicalEncode,text,typedIdentifier} from '../substrate/canonicalEncoding';
type Arguments=Parameters<typeof prepareFocalPositionPairAttributionUse>;
export interface AttributionProductionContext {readonly observer:string;readonly character:string;readonly at:bigint;readonly focal:{readonly observer:string;readonly consequence:bigint;readonly sourceAt:bigint}|null}
export interface AttributionProductionView {readonly opaque:'attribution-production-view'}
interface Result {readonly observer:string;readonly character:string;readonly consequence:bigint;readonly at:bigint;readonly transformationVersion:'attribution-production/0.1-candidate';readonly disposition:'Supported'|'Unavailable';readonly consumed:readonly {readonly acquisition:bigint;readonly unit:string}[];readonly targets:readonly {readonly acquisition:bigint;readonly unit:string}[]}
const results=new WeakMap<object,Result|null>();
/** Null operands mean actual incomplete grouping/recollection, never fabricated trials. */
export function prepareAttributionProduction(context:AttributionProductionContext,operands:()=>Arguments|null):AttributionProductionView{
 if(typeof context.at!=='bigint'||context.at<0n||typeof context.observer!=='string'||!context.observer||typeof context.character!=='string'||!context.character)throw Error('ATTRIBUTION_PRODUCTION_SUBJECT');
 canonicalEncode(typedIdentifier(1000,text(context.observer)));canonicalEncode(typedIdentifier(1002,text(context.character)));
 const token=Object.freeze({opaque:'attribution-production-view' as const});
 if(context.focal===null){results.set(token,null);return token;}
 if(context.focal.observer!==context.observer||typeof context.focal.consequence!=='bigint'||context.focal.consequence<0n||typeof context.focal.sourceAt!=='bigint'||context.focal.sourceAt<0n||context.focal.sourceAt>=context.at)throw Error('ATTRIBUTION_PRODUCTION_FOCAL');
 const holder={observer:context.observer,character:context.character,consequence:context.focal.consequence,at:context.at,transformationVersion:'attribution-production/0.1-candidate' as const},args=operands();
 let disposition:Result['disposition']='Unavailable',consumed:Result['consumed']=[],targets:Result['targets']=[];
 if(args!==null){if(args[0].now!==holder.at)throw Error('ATTRIBUTION_PRODUCTION_INSTANT');const target={...args[0].trials[args[0].focalTrial].motion.end.address},owner=prepareFocalPositionPairAttributionUse(...args);try{const value=owner.finish(owner.evaluate());disposition=value.assessment.kind;consumed=value.consumed;if(disposition==='Supported'){if(!consumed.some(c=>c.acquisition===target.acquisition&&c.unit===target.unit))throw Error('ATTRIBUTION_PRODUCTION_TARGET');targets=[{...target}];}}finally{owner.close();}}
 results.set(token,structuredClone({...holder,disposition,consumed,targets}));return token;
}
export function produceAttributionResult(view:AttributionProductionView,allocate:()=>bigint){const value=results.get(view);if(value===undefined)throw Error('ATTRIBUTION_PRODUCTION_VIEW');results.delete(view);if(value===null)return {kind:'NoConsequence' as const};const resultId=allocate();if(typeof resultId!=='bigint'||resultId<0n)throw Error('ATTRIBUTION_PRODUCTION_ALLOCATION');return {kind:'Result' as const,result:{resultId,...structuredClone(value)}};}
export const closeAttributionProduction=(view:AttributionProductionView)=>{results.delete(view);};
