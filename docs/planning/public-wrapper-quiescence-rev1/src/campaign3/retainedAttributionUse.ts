/** retained-attribution-use-component/0.1-candidate. Trusted component coordinator only. */
import {assessContrastiveAttribution,validateAttributionTrials,type AttributionTrial,type ContrastiveAttribution} from './contrastiveAttribution';
import {applyQualifiedUnitUse,type UseProtectedAcquisition} from './useProtectedRetention';
import type {ChildLoss} from './retentionFragmentation';
import {ExactRational as Q} from '../substrate/exactMath';
export type AttributionField=keyof AttributionTrial;
export type UseOperand<K extends AttributionField>={readonly kind:'Retained';readonly address:ChildLoss;readonly view:number}|{readonly kind:'Detached';readonly value:AttributionTrial[K]};
export type UseTrial={readonly [K in AttributionField]:UseOperand<K>};
export interface RetainedPositionAddress {readonly address:ChildLoss;readonly view:number}
export type PositionPairTrial=Omit<UseTrial,'motion'>&{readonly motion:{readonly kind:'RetainedPositionPair';readonly start:RetainedPositionAddress;readonly end:RetainedPositionAddress}};
export interface ObservedPosition {readonly at:bigint;readonly position:readonly [number,number]|null}
type Owner={readonly memory:readonly UseProtectedAcquisition[];readonly now:bigint;readonly admitted:readonly ChildLoss[]};
type Projection=<K extends AttributionField>(bytes:Uint8Array,field:K)=>AttributionTrial[K];
export interface AttributionUseResult {readonly opaque:'attribution-use-result'}
const key=(a:ChildLoss)=>JSON.stringify([a.acquisition.toString(),a.unit]);
export function prepareRetainedAttributionUse(input:Owner&{readonly trials:readonly UseTrial[]},project:Projection){return prepare(input,project);}
/** retained-position-pair-attribution/0.1-candidate; projection remains trusted. */
export function preparePositionPairAttributionUse(input:Owner&{readonly trials:readonly PositionPairTrial[]},project:Projection,projectPosition:(bytes:Uint8Array)=>ObservedPosition){return prepare(input,project,projectPosition);}
/** focal-position-pair-attribution/0.1-candidate; focal index is bound before evaluation. */
export function prepareFocalPositionPairAttributionUse(input:Owner&{readonly trials:readonly PositionPairTrial[];readonly focalTrial:number},project:Projection,projectPosition:(bytes:Uint8Array)=>ObservedPosition){if(!Number.isInteger(input.focalTrial)||input.focalTrial<0||input.focalTrial>=4)throw Error('ATTRIBUTION_FOCAL_TRIAL');return prepare(input,project,projectPosition,input.focalTrial);}
function prepare(input:Owner&{readonly trials:readonly (UseTrial|PositionPairTrial)[]},project:Projection,projectPosition?:((bytes:Uint8Array)=>ObservedPosition),focalTrial?:number){
 const memory=applyQualifiedUnitUse(input.memory,[],input.now),now=input.now;
 // Reuse extant/unique address validation without committing its computed bits.
 applyQualifiedUnitUse(memory,input.admitted,now);
 const admitted=new Set(input.admitted.map(key)),bound:Partial<Record<AttributionField,ChildLoss[]>>[]=[];
 if(!Array.isArray(input.trials)||input.trials.length!==4||Array.from({length:4},(_,i)=>Object.hasOwn(input.trials,i)).some(x=>!x))throw Error('ATTRIBUTION_USE_TRIALS');
 const trials=input.trials.map(t=>{const addresses:Partial<Record<AttributionField,ChildLoss[]>>={};bound.push(addresses);
  const resolve=<K extends AttributionField>(field:K):AttributionTrial[K]=>{const operand=t[field];let value:AttributionTrial[K];
   if(operand.kind==='Detached')value=operand.value;
   else if(operand.kind==='Retained'){
    if(!admitted.has(key(operand.address)))throw Error('ATTRIBUTION_USE_READ_DOMAIN');
    const acquisition=memory.find(a=>a.id===operand.address.acquisition);
    const child=acquisition?.units.find(u=>u.key===operand.address.unit);
    if(!acquisition||!child||acquisition.acquiredAt>=now)throw Error('ATTRIBUTION_USE_PRIOR_MEMORY');
    if(!Number.isInteger(operand.view)||operand.view<0||operand.view>=child.views.length)throw Error('ATTRIBUTION_USE_VIEW');
    value=project(child.views[operand.view].slice(),field);addresses[field]=[{...operand.address}];
   }else if(operand.kind==='RetainedPositionPair'&&field==='motion'&&projectPosition){
    const readPosition=(ref:RetainedPositionAddress)=>{if(!admitted.has(key(ref.address)))throw Error('ATTRIBUTION_USE_READ_DOMAIN');const a=memory.find(x=>x.id===ref.address.acquisition),u=a?.units.find(x=>x.key===ref.address.unit);if(!a||!u||a.kind!=='EventContinuant'||a.acquiredAt>=now)throw Error('ATTRIBUTION_POSITION_PRIOR_MEMORY');if(!Number.isInteger(ref.view)||ref.view<0||ref.view>=u.views.length)throw Error('ATTRIBUTION_USE_VIEW');const p=projectPosition(u.views[ref.view].slice());if(!p||typeof p.at!=='bigint'||p.at<0n||p.at>a.acquiredAt)throw Error('ATTRIBUTION_POSITION_TIME');if(p.position!==null&&(!Array.isArray(p.position)||p.position.length!==2||p.position.some(v=>!Number.isInteger(v)||v<0||v>7)||!Object.hasOwn(p.position,0)||!Object.hasOwn(p.position,1)))throw Error('ATTRIBUTION_POSITION_DOMAIN');return {at:p.at,position:p.position===null?null:[...p.position] as [number,number]};};
    const start=readPosition(operand.start),end=readPosition(operand.end);
    if(operand.start.address.acquisition===operand.end.address.acquisition||start.at>=end.at)throw Error('ATTRIBUTION_POSITION_ORDER');
    addresses.motion=[{...operand.start.address}];
    // Domain validation above is not semantic consumption. A missing/nonmatching
    // starting position stops this motion query before using the second position.
    if(start.position?.[0]===0&&start.position[1]===0)addresses.motion.push({...operand.end.address});
    value=(start.position&&end.position?[start.position,end.position]:null) as AttributionTrial[K];
   }else throw Error('ATTRIBUTION_USE_BINDING');
   if(value===null)return value;
   // Copy without structuredClone, which would discard ExactRational prototypes.
   return (field==='motion'?(value as AttributionTrial['motion'])!.map(p=>[...p]):{...(value as AttributionTrial['before'])}) as AttributionTrial[K];
  };
  return {motion:resolve('motion'),before:resolve('before'),after:resolve('after')};
 });
 // Eager domain validation is deliberately separate from semantic consumption.
 validateAttributionTrials(trials);
 for(const trial of trials)for(const field of ['before','after'] as const){const v=trial[field];if(v)trial[field]=Object.freeze({lower:Object.freeze(Q.of(v.lower.numerator,v.lower.denominator)),upper:Object.freeze(Q.of(v.upper.numerator,v.upper.denominator))});}
 let closed=false,evaluated=false,finished=false;
 const results=new WeakMap<object,{assessment:ContrastiveAttribution;consumed:ChildLoss[]}>();
 const open=()=>{if(closed)throw Error('ATTRIBUTION_USE_CLOSED');};
 return Object.freeze({
  evaluate():AttributionUseResult{open();if(evaluated)throw Error('ATTRIBUTION_USE_ALREADY_EVALUATED');evaluated=true;
   const consumed=new Map<string,ChildLoss>();
   const read=<K extends AttributionField>(i:number,field:K)=>{for(const address of bound[i][field]??[])consumed.set(key(address),address);return trials[i][field];};
   let assessment:ContrastiveAttribution=Object.freeze({kind:'Unavailable'}),complete=true;
   for(let i=0;i<4;i++){
    const motion=read(i,'motion');
    if(!motion||motion[0][0]!==0||motion[0][1]!==0||motion[1][1]!==0||![0,1].includes(motion[1][0])){complete=false;break;}
    if(!read(i,'before')||!read(i,'after')){complete=false;break;}
   }
   if(complete)assessment=assessContrastiveAttribution(trials);
   if(assessment.kind==='Supported'&&focalTrial!==undefined&&trials[focalTrial].motion![1][0]!==1)assessment=Object.freeze({kind:'Unavailable'});
   const token=Object.freeze({opaque:'attribution-use-result' as const});results.set(token,{assessment,consumed:[...consumed.values()]});return token;
  },
  finish(token:AttributionUseResult){open();const result=results.get(token);if(!result||finished)throw Error('ATTRIBUTION_USE_RESULT_BINDING');finished=true;results.delete(token);
   return {assessment:result.assessment,consumed:result.consumed.map(a=>({...a})),memory:applyQualifiedUnitUse(memory,result.consumed,now)};
  },
  close(){closed=true;}
 });
}
