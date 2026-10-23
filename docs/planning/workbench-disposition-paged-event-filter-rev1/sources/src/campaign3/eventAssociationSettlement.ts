/** event-association-settlement/0.1-candidate; actual event formation and canonical key projection remain upstream. */
import {ExactRational as Q} from '../substrate/exactMath';
import {associationCandidate} from './encodingAccessMath';
import {retainGraphByStrength} from './strengthGraphRetention';
import {normalizeGraphZeroState} from './graphZeroState';
import {canonicalEncode,text} from '../substrate/canonicalEncoding';
export interface EventAssociationState {readonly keys:readonly string[];readonly weights:readonly (readonly Q[])[];readonly lastUpdatedAt:bigint}
export interface EventAssociationSettlementInput {
 readonly prior:EventAssociationState;readonly now:bigint;
 /** Exactly one actual event acquisition in the first bounded source profile; null means retention only. */
 readonly formation:readonly {readonly key:string;readonly strength:Q}[]|null;
 readonly calibration:Readonly<{scale:bigint;eta:Q;lambda:Q}>;
 readonly capacity:Readonly<{nodes:number;edges:number}>;
}
function fail():never{throw Error('EVENT_ASSOCIATION_SETTLEMENT');}
export function settleEventAssociation(input:EventAssociationSettlementInput):EventAssociationState{
 const {prior,now,formation,calibration:p,capacity}=input;
 if(typeof now!=='bigint'||now<0n||typeof prior.lastUpdatedAt!=='bigint'||prior.lastUpdatedAt<0n||prior.lastUpdatedAt>=now)fail();
 if(typeof p.scale!=='bigint'||p.scale<1n||p.scale>1000n||!Number.isInteger(capacity.nodes)||capacity.nodes<0||capacity.nodes>30||!Number.isInteger(capacity.edges)||capacity.edges<0||capacity.edges>capacity.nodes*(capacity.nodes-1))fail();
 const normalized=normalizeGraphZeroState(prior.keys,prior.weights,p.scale);
 if(normalized.keys.length!==prior.keys.length||prior.keys.length>30)fail();
 // Validate both numerical parameters even on the no-update control path.
 associationCandidate([],[],[],{...p,elapsed:Q.of(now-prior.lastUpdatedAt)});
 let keys=prior.keys,weights=prior.weights,lastUpdatedAt=prior.lastUpdatedAt;
 if(formation!==null){
  if(!Array.isArray(formation)||Object.getPrototypeOf(formation)!==Array.prototype||formation.length<1||formation.length>3||Array.from({length:formation.length},(_,i)=>Object.hasOwn(formation,i)).some(x=>!x))fail();
  const activation=new Map<string,Q>();
  for(const a of formation){if(typeof a.key!=='string'||!a.key||a.key!==a.key.normalize('NFC')||activation.has(a.key)||!(a.strength instanceof Q)||a.strength.compare(Q.of(0n))<=0||a.strength.compare(Q.of(1n))>0)fail();activation.set(a.key,a.strength);}
  keys=[...new Set([...prior.keys,...activation.keys()])];if(keys.length>30)fail();
  const expanded=keys.map(a=>keys.map(b=>{const i=prior.keys.indexOf(a),j=prior.keys.indexOf(b);return i<0||j<0?Q.of(0n):prior.weights[i][j];}));
  weights=associationCandidate(keys,expanded,keys.map(k=>activation.get(k)??Q.of(0n)),{...p,elapsed:Q.of(now-prior.lastUpdatedAt)}).values;lastUpdatedAt=now;
 }
 const result=retainGraphByStrength(keys,weights,p.scale,capacity);
 const order=result.keys.map((key,index)=>({key,index,bytes:canonicalEncode(text(key))})).sort((a,b)=>{for(let i=0;i<Math.min(a.bytes.length,b.bytes.length);i++)if(a.bytes[i]!==b.bytes[i])return a.bytes[i]-b.bytes[i];return a.bytes.length-b.bytes.length;});
 return {keys:order.map(x=>x.key),weights:order.map(a=>order.map(b=>{const q=result.weights[a.index][b.index];return Q.of(q.numerator,q.denominator);})),lastUpdatedAt};
}
