/** configuration0.1: exact predecessor equations; candidate domain extended to3. */
import {ExactRational as Q} from '../substrate/exactMath';
import {SchedulerContractError} from '../substrate/scheduler';
import {dataKey as key} from '../campaign2/canonicalData';
import {ZERO,ONE,bounded,type AnalyticalOption} from '../campaign2/cognitiveMath';
const sum=(xs:readonly Q[])=>xs.reduce((a,b)=>a.add(b),ZERO);
const min=(a:Q,b:Q)=>a.compare(b)<0?a:b;
const bad=(message:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);};
export function analyzeOptions(options:readonly AnalyticalOption[],thetaRoll:Q,thetaPlayer:Q,maxCandidates=2){
 if(options.length<1||options.length>maxCandidates||new Set(options.map(o=>key(o.key))).size!==options.length)bad('candidate domain or duplicate');
 if(thetaRoll.compare(ZERO)<=0||thetaRoll.compare(ONE)>0||thetaPlayer.compare(ZERO)<0||thetaPlayer.compare(ONE)>0)bad('arbitration thresholds');
 for(const o of options){if(o.reasonMass.compare(ZERO)<0||!sum([...o.distribution.values()]).equals(ONE)||[...o.distribution.values()].some(p=>p.compare(ZERO)<=0))bad('invalid option distribution');}
 const probabilities=options.map(()=>ZERO);
 function enumerate(i:number,scores:bigint[],mass:Q):void {if(i<options.length){for(const [x,p] of options[i].distribution)enumerate(i+1,[...scores,x],mass.multiply(p));return;}const highest=scores.reduce((a,b)=>a>b?a:b),leaders=scores.map((s,j)=>s===highest?j:-1).filter(j=>j>=0),share=mass.divide(Q.of(BigInt(leaders.length)));for(const j of leaders)probabilities[j]=probabilities[j].add(share);}
 enumerate(0,[],ONE);
 const ranked=options.map((o,i)=>({...o,probability:probabilities[i]})).sort((a,b)=>b.probability.compare(a.probability)||(key(a.key)<key(b.key)?-1:1));
 const margin=ranked[0].probability.subtract(ranked[1]?.probability??ZERO),contest=ONE.subtract(margin),conflictMass=ranked.length===1?ZERO:min(ranked[0].reasonMass,ranked[1].reasonMass),stake=bounded(conflictMass),authorshipPotential=contest.multiply(stake);
 const mode=contest.compare(thetaRoll)<0?'Auto':authorshipPotential.compare(thetaPlayer)>=0?'PlayerFacingRoll':'QuietRoll';
 return {probabilities:options.map((o,i)=>({key:o.key,probability:probabilities[i]})),ranked,margin,contest,conflictMass,stake,authorshipPotential,mode};
}
