/** Controlled component operands, not observer-admitted source fixtures. */
import {list,set,map,typedIdentifier,unsigned as u,rational as q} from '../substrate/canonicalEncoding';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {compileReasonNuclei} from '../campaign2/cognitiveMath';
import {biographyContext} from '../campaign3/longitudinalMath';
import {TASKS,OPTIONS} from '../campaign3/longitudinalModel';
export const REGIMES=['settled','low','high'] as const;
export function decisionContext(regime:typeof REGIMES[number]){
 const occ=(n:number)=>typedIdentifier(n,u(1)),signals=TASKS.flatMap((task,i)=>[r(402,[r(401,[OPTIONS[i],task,u(1)]),q(1,10),r(400,[map([])])]),r(402,[r(401,[OPTIONS[i],task,u(2)]),q(regime==='high'||regime==='settled'&&i===0?3:0,1),r(400,[map([])])])]);
 const dice=r(437,[r(438,[1,2,3,4,5].map(n=>q(n,5))),q(0,1),r(439,[q(1,4),u(3)]),r(439,[q(1,4),u(3)])]);
 const raw=r(403,[occ(1133),biographyContext(1n,occ),set(signals),map(OPTIONS.map((o,i)=>[o,q(i===0?1:-1,2)]))]);
 return r(408,[occ(1134),raw,list(compileReasonNuclei(signals,dice))]);
}
