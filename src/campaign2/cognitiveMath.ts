/** Pure components of reason-evidence-coverage/0.1-candidate, reason-dice/0.1-candidate
 * and task-identity-evidence/0.1-candidate. No state, registry, RNG or truth capability. */
import {ExactRational as Q,roundEven} from '../substrate/exactMath';
import {list,map,rational,signed,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SchedulerContractError} from '../substrate/scheduler';
import {dataRecord as rec,dataField as f,dataKey as key,dataUnsigned as uint,dataItems as items} from './canonicalData';
import {cognitiveRecord as r} from './cognitiveCodecs';

export const ZERO=Q.of(0n),ONE=Q.of(1n);
export const absolute=(x:Q)=>Q.of(x.numerator<0n?-x.numerator:x.numerator,x.denominator);
export const bounded=(x:Q)=>x.divide(ONE.add(absolute(x)));
export const qValue=(x:Q)=>rational(x.numerator,x.denominator);
export function readQ(value:CanonicalValue):Q {if(typeof value==='boolean'||value.kind!=='rational')bad('exact rational required');const q=value as Extract<CanonicalValue,{kind:'rational'}>;return Q.of(q.numerator,q.denominator);}
const sum=(xs:readonly Q[])=>xs.reduce((a,b)=>a.add(b),ZERO);
const min=(a:Q,b:Q)=>a.compare(b)<0?a:b;
const max=(a:Q,b:Q)=>a.compare(b)>0?a:b;
function bad(message:string):never {throw new SchedulerContractError('INPUT_NOT_ADMITTED',message);}
function pairs(v:CanonicalValue):readonly (readonly [CanonicalValue,CanonicalValue])[]{if(typeof v==='boolean'||v.kind!=='map')bad('map required');return (v as Extract<CanonicalValue,{kind:'map'}>).entries;}
function basisWeights(basis:CanonicalValue){const weights=new Map<string,Q>();for(const [atom,value] of pairs(f(rec(basis,400n),1n))){const k=key(atom),q=readQ(value);if(q.compare(ZERO)<=0||weights.has(k))bad('positive unique evidence weights required');weights.set(k,q);}if(weights.size>64)bad('evidence basis exceeds64');return weights;}

export interface CoverageOperand {readonly sourceKey:CanonicalValue;readonly magnitude:Q;readonly basis:CanonicalValue;}
/** Numerical kernel. The source owner separately authenticates atoms and partitions
 * by nucleus/role/sign; this function supplies no admission or evidence authority. */
export function consolidateCoverage(operands:readonly CoverageOperand[]){
 if(operands.length>6)bad('coverage operand limit');
 const seen=new Set<string>(),sorted=operands.map(o=>{rec(o.sourceKey,401n);if(o.magnitude.compare(ZERO)<0||seen.has(key(o.sourceKey)))bad('invalid/duplicate coverage source');seen.add(key(o.sourceKey));return {...o,weights:basisWeights(o.basis)};}).sort((a,b)=>b.magnitude.compare(a.magnitude)||(key(a.sourceKey)<key(b.sourceKey)?-1:1));
 const aggregate=new Map<string,Q>(),results:CanonicalValue[]=[];let total=ZERO;
 for(const o of sorted){let intersection=ZERO,union=ZERO;for(const k of new Set([...aggregate.keys(),...o.weights.keys()])){const a=aggregate.get(k)??ZERO,b=o.weights.get(k)??ZERO;intersection=intersection.add(min(a,b));union=union.add(max(a,b));}
  const overlap=union.equals(ZERO)?ZERO:intersection.divide(union),independent=ONE.subtract(overlap),effective=o.magnitude.multiply(independent);total=total.add(effective);
  results.push(r(405,[o.sourceKey,qValue(o.magnitude),qValue(overlap),qValue(independent),qValue(effective)]));
  // Even a fully discounted contribution retains its raw basis in prior coverage.
  for(const [k,w] of o.weights)aggregate.set(k,max(aggregate.get(k)??ZERO,w));
 }
 return {total,results};
}

function consolidateRole(signals:readonly CanonicalValue[]){
 const values=signals.map(s=>{const signal=rec(s,402n),strength=readQ(f(signal,2n));return {sourceKey:f(signal,1n),strength,basis:f(signal,3n)};});
 const positive=consolidateCoverage(values.filter(v=>v.strength.compare(ZERO)>0).map(v=>({...v,magnitude:v.strength}))),negative=consolidateCoverage(values.filter(v=>v.strength.compare(ZERO)<0).map(v=>({...v,magnitude:absolute(v.strength)})));
 return {net:bounded(positive.total.subtract(negative.total)),trace:[...positive.results,...negative.results]};
}
export type Distribution=ReadonlyMap<bigint,Q>;
export function convolve(a:Distribution,b:Distribution):Map<bigint,Q>{const out=new Map<bigint,Q>();for(const [x,p] of a)for(const [y,q] of b)out.set(x+y,(out.get(x+y)??ZERO).add(p.multiply(q)));return out;}
export const expectation=(d:Distribution)=>sum([...d].map(([x,p])=>Q.of(x).multiply(p)));
export function distributionValue(d:Distribution):CanonicalValue{return r(424,[map([...d].map(([x,p])=>[signed(x),qValue(p)]))]);}
export function readDistribution(value:CanonicalValue):Map<bigint,Q>{const out=new Map<bigint,Q>();let total=ZERO;for(const [score,weight] of pairs(f(rec(value,424n),1n))){if(typeof score==='boolean'||score.kind!=='signed')bad('signed score');const n=(score as {value:bigint}).value,p=readQ(weight);if(p.compare(ZERO)<=0||out.has(n))bad('positive unique score mass');out.set(n,p);total=total.add(p);}if(!total.equals(ONE))bad('distribution must have mass1');return out;}
function modifier(strength:Q,definition:CanonicalValue){const def=rec(definition,439n),unit=readQ(f(def,1n)),cap=uint(f(def,2n));if(unit.compare(ZERO)<=0||cap>3n)bad('invalid modifier calibration');const scaled=strength.divide(unit),raw=scaled.numerator/scaled.denominator;return raw>cap?cap:raw< -cap?-cap:raw;}

export function compileReasonNuclei(signals:readonly CanonicalValue[],definition:CanonicalValue):CanonicalValue[]{
 if(signals.length>6)bad('raw signal limit');
 const def=rec(definition,437n),threshold=readQ(f(def,2n)),bands=rec(f(def,1n),438n);if(threshold.compare(ZERO)<0||threshold.compare(Q.of(3n))>0)bad('activation threshold');
 const cutoffs=[1n,2n,3n,4n,5n].map(i=>readQ(f(bands,i)));if(cutoffs.some((x,i)=>x.compare(i?cutoffs[i-1]:ZERO)<=0||x.compare(ONE)>0))bad('ordered die cutoffs');
 const groups=new Map<string,{candidate:CanonicalValue;task:CanonicalValue;signals:CanonicalValue[]}>(),sources=new Set<string>();
 for(const value of signals){const signal=rec(value,402n),source=rec(f(signal,1n),401n),candidate=rec(f(source,1n),395n),task=rec(f(source,2n),371n),sourceKey=key(source),role=uint(f(source,3n));
  if(sources.has(sourceKey)||![1n,2n,3n].includes(role)||key(f(candidate,1n))!==key(f(task,1n)))bad('duplicate or incompatible raw source');sources.add(sourceKey);
  const groupKey=key(list([candidate,f(task,2n)])),group=groups.get(groupKey)??{candidate,task:f(task,2n),signals:[]};group.signals.push(signal);groups.set(groupKey,group);
 }
 const out:CanonicalValue[]=[];
 if(groups.size>2)bad('reason nucleus limit');
 for(const group of groups.values()){
  const forRole=(role:bigint)=>group.signals.filter(s=>uint(f(rec(f(rec(s,402n),1n),401n),3n))===role);
  const base=consolidateRole(forRole(1n));if(base.net.equals(ZERO))continue;
  const standing=consolidateRole(forRole(3n)),situation=consolidateRole(forRole(2n)),relevance=absolute(base.net).add(absolute(standing.net)).add(absolute(situation.net));if(relevance.compare(threshold)<0)continue;
  let die=4n;cutoffs.forEach((cutoff,i)=>{if(absolute(base.net).compare(cutoff)>=0)die=[4n,6n,8n,10n,12n][i];});
  const h=modifier(standing.net,f(def,3n)),x=modifier(situation.net,f(def,4n)),sign=base.net.compare(ZERO)<0?-1n:1n,dist=new Map<bigint,Q>();for(let face=1n;face<=die;face++)dist.set(sign*(face+h+x),Q.of(1n,die));
  const nucleusKey=r(404,[group.candidate,typedIdentifier(1040,text('Commitment')),group.task,u(sign>0n?1:2)]),roles=r(406,[qValue(base.net),qValue(standing.net),qValue(situation.net),list([...base.trace,...standing.trace,...situation.trace])]);
  out.push(r(407,[nucleusKey,roles,qValue(relevance),u(die),signed(h),signed(x),distributionValue(dist)]));
 }
 return out.sort((a,b)=>key(f(rec(a,407n),1n))<key(f(rec(b,407n),1n))?-1:1);
}

export interface AnalyticalOption {readonly key:CanonicalValue;readonly distribution:Distribution;readonly reasonMass:Q;}
/** Exact fair-tie analytical probabilities, separate from addressed random draws. */
export function analyzeOptions(options:readonly AnalyticalOption[],thetaRoll:Q,thetaPlayer:Q){
 if(options.length<1||options.length>2||new Set(options.map(o=>key(o.key))).size!==options.length)bad('one or two unique candidates required');
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

export function choiceAlignment(chosen:CanonicalValue,semantic:ReadonlyMap<string,Q>):Q {const own=semantic.get(key(chosen));if(!own)bad('chosen candidate missing from meaning map');return bounded(own!.subtract(sum([...semantic].filter(([k])=>k!==key(chosen)).map(([,v])=>v))));}

/** Structural history checks do not derive counters or create semantic fold rows. */
export function validateIdentityHistory(contributions:readonly CanonicalValue[]){
 if(contributions.length>64)throw new SchedulerContractError('IDENTITY_EVIDENCE_LIMIT_EXCEEDED','identity history exceeds64');
 let previous=0n;const qualifications=new Set<string>(),decisions=new Set<string>();
 for(const value of contributions){const row=rec(value,413n),qualification=f(row,1n),decision=f(row,2n),instant=f(row,3n),e=readQ(f(row,4n));
  if(qualifications.has(key(qualification))||decisions.has(key(decision)))throw new SchedulerContractError('IDENTITY_EVIDENCE_ALREADY_APPLIED','repeated identity source');
  if(typeof instant==='boolean'||instant.kind!=='signed'||instant.value<=previous)throw new SchedulerContractError('IDENTITY_EVIDENCE_ORDER_VIOLATION','identity history time order');
  if(e.equals(ZERO)||absolute(e).compare(ONE)>0)bad('nonzero bounded identity contribution');
  qualifications.add(key(qualification));decisions.add(key(decision));previous=(instant as {value:bigint}).value;
 }
}
export function foldIdentityHistory(contributions:readonly CanonicalValue[],k:Q){
 if(k.compare(ZERO)<=0)bad('positive identity K');validateIdentityHistory(contributions);
 let support=ZERO,opposition=ZERO;const operations:CanonicalValue[]=[];
 for(const value of contributions){const row=rec(value,413n),qualification=f(row,1n),e=readQ(f(row,4n));
  const quantize=(prior:Q,increment:Q,kind:bigint)=>{const input=prior.add(increment),integer=roundEven(input.numerator*1000000n,input.denominator),output=Q.of(integer,1000000n);operations.push(r(452,[qualification,u(kind),qValue(input),u(1000000),u(integer),qValue(output)]));return output;};
  support=quantize(support,max(ZERO,e),1n);opposition=quantize(opposition,max(ZERO,ZERO.subtract(e)),2n);
 }
 return {support,opposition,strength:support.subtract(opposition).divide(k.add(support).add(opposition)),operations};
}

/** Validated prior history is supplied by the owning state boundary. Check append
 * failure priority before folding the candidate exactly once for semantic use. */
export function appendIdentityContribution(prior:readonly CanonicalValue[],contribution:CanonicalValue,k:Q){
 const next=rec(contribution,413n),qualification=f(next,1n),decision=f(next,2n),instant=f(next,3n);
 if(prior.some(v=>{const old=rec(v,413n);return key(f(old,1n))===key(qualification)||key(f(old,2n))===key(decision);}))throw new SchedulerContractError('IDENTITY_EVIDENCE_ALREADY_APPLIED','repeated identity source');
 const previous=prior.length?f(rec(prior[prior.length-1],413n),3n):signed(0);
 if(typeof instant==='boolean'||instant.kind!=='signed'||typeof previous==='boolean'||previous.kind!=='signed'||instant.value<=previous.value)throw new SchedulerContractError('IDENTITY_EVIDENCE_ORDER_VIOLATION','identity append time order');
 if(prior.length>=64)throw new SchedulerContractError('IDENTITY_EVIDENCE_LIMIT_EXCEEDED','identity append exceeds64');
 const contributions=[...prior,contribution],fold=foldIdentityHistory(contributions,k);
 return {contributions,history:r(414,[list(contributions)]),...fold};
}
