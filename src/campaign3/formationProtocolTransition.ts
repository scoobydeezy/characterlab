/** formation-protocol-transition-component/0.1-candidate; operands require owner authentication upstream. */
import {extendFormationSourceDomain} from './formationSourceDomain';
import {reconcileFormationGovernance,type FormationSource,type FormationCommit,type GovernanceEntry} from './formationGovernance';
import {canonicalEncode,list,text,unsigned} from '../substrate/canonicalEncoding';
export type FormationProtocolValue=Readonly<{domain:readonly FormationSource[];successes:readonly GovernanceEntry[]}>;
const encode=(v:FormationProtocolValue)=>canonicalEncode(list([list(v.domain.map(s=>list([text(s.character),text(s.source),text(s.kind)]))),list(v.successes.map(s=>list([text(s.character),text(s.source),text(s.kind),unsigned(s.acquisition),unsigned(s.formedAt),s.completeLoss])))]));
export function validateFormationProtocolTransition(prior:FormationProtocolValue,incoming:readonly FormationSource[],formed:readonly FormationCommit[],survivors:readonly bigint[],now:bigint,limit:number,candidate:FormationProtocolValue):void{
 const shape=(v:FormationProtocolValue)=>{if(!v||typeof v!=='object'||Object.getPrototypeOf(v)!==Object.prototype||Object.keys(v).sort().join('|')!=='domain|successes')throw Error('FORMATION_PROTOCOL_SHAPE');};shape(prior);shape(candidate);
 reconcileFormationGovernance(prior.domain,prior.successes,[],prior.successes.filter(s=>!s.completeLoss).map(s=>s.acquisition),now);
 const domain=extendFormationSourceDomain(prior.domain,incoming,limit);
 const expected={domain,successes:reconcileFormationGovernance(domain,prior.successes,formed,survivors,now)};
 const canonicalDomain=extendFormationSourceDomain(candidate.domain,[],limit);
 const canonicalSuccesses=reconcileFormationGovernance(canonicalDomain,candidate.successes,[],candidate.successes.filter(s=>!s.completeLoss).map(s=>s.acquisition),now);
 const actual=encode({domain:canonicalDomain,successes:canonicalSuccesses}),wanted=encode(expected);
 if(actual.length!==wanted.length||actual.some((b,i)=>b!==wanted[i]))throw Error('FORMATION_PROTOCOL_TRANSITION_MISMATCH');
}
