import {LEGACY_TIME_LIMIT,assertTimeLimit,type TimeLimit} from './timeDomain';
/** assembled-character-interference/0.1: direct evidence, episode means and prior appraisal. */
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {StatePath} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,invalidModel} from '../campaign2/canonicalData';
import {qValue} from '../campaign2/cognitiveMath';
import type {Strategy} from './strategy';
import {sid} from './skill';
export const INTERFERENCE='assembled-interference/0.1',INTERFERENCE_OBS=INTERFERENCE+'/observation',INTERFERENCE_QUERY=INTERFERENCE+'/context',INTERFERENCE_APPRAISAL=INTERFERENCE+'/appraisal',INTERFERENCE_VERSION='assembled-character-interference/0.1-candidate';
export const INTERFERENCE_SOURCE=sid(1001,'event/assembled-interference-source'),INTERFERENCE_CONTEXT=sid(1001,'event/assembled-interference-context'),INTERFERENCE_OBSERVE=sid(1001,'event/assembled-interference-observe'),INTERFERENCE_EVIDENCE=sid(1001,'event/assembled-interference-evidence'),INTERFERENCE_LEARN=sid(1001,'event/assembled-interference-learn');
export const INTERFERENCE_ACQUISITION='assembled-interference/acquisition/0.1',INTERFERENCE_ACQUISITION_VERSION='interference-acquisition/0.1-candidate';
export const INTERFERENCE_ACQUIRE=sid(1001,'event/assembled-interference-acquire'),INTERFERENCE_ACQUIRE_LEARN=sid(1001,'event/assembled-interference-acquire-learn');
export const INTERFERENCE_WITNESS='assembled-interference/observation/witness/0.1';
export const interferencePath=(task:CanonicalValue):StatePath=>({rootStateTypeId:1000n,fieldId:7n,selectors:[{kind:'mapKey',key:task}]});
const require=(b:boolean,s:string)=>{if(!b)invalidModel('interference '+s);};
const task=(v:CanonicalValue,routes:Strategy)=>require(routes.some(r=>key(r.task)===key(v)),'task');
export function interferenceSource(v:CanonicalValue,routes:Strategy,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);const a=items(v,'list');require(a.length===6&&txt(a[0])===INTERFERENCE&&typeof a[4]==='boolean'&&typeof a[5]==='boolean','source');task(a[1],routes);const ticket=uint(a[2]),receipt=uint(a[3]);require(ticket>=1n&&ticket<=timeLimit&&receipt>=1n&&receipt<=16n,'ticket/receipt');return {task:a[1],ticket,receipt,visible:a[4]===true,positive:a[5]===true};}
export function interferenceContext(v:CanonicalValue,routes:Strategy){const a=items(v,'list');require(a.length===4&&txt(a[0])===INTERFERENCE_QUERY,'context');task(a[1],routes);let route:bigint|null=null;if(typeof a[2]!=='boolean'&&a[2].kind==='list')require(a[2].items.length===0,'absent route');else {route=uint(a[2]);require(route<=1n,'route');}const goal=uint(a[3]);require(goal<=1n,'goal');return {task:a[1],route,goal};}
export function interferenceObservation(v:CanonicalValue,t:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT,witnessPeople?:readonly CanonicalValue[],acquired=false){
 assertTimeLimit(timeLimit);const a=items(v,'list'),acquisition=txt(a[0])===INTERFERENCE_ACQUISITION;
 if(acquisition){
  require(acquired&&a.length===5&&key(a[2])===key(t),'acquisition version/shape');
  const at=uint(a[1]),bound=items(a[3],'list');let scope:bigint|null=null;
  if(typeof a[4]!=='boolean'&&a[4].kind==='list')require(a[4].items.length===0,'absent acquisition context');else{scope=uint(a[4]);require(scope<=1n,'acquisition context');}
  require(at>=1n&&at<=timeLimit&&bound.length===8&&txt(bound[0])==='assembled-performance-observation/0.1'&&uint(bound[2])===at&&key(bound[3])===key(t)&&uint(bound[4])<=1n&&typeof bound[6]==='boolean'&&typeof bound[7]==='boolean','acquired outcome');
  return {at,ticket:at,receipt:0n,positive:false,outcome:a[3] as CanonicalValue|undefined,route:uint(bound[4]),acquisition:true,scope};
 }
 const direct=txt(a[0])===INTERFERENCE_WITNESS;
 require((direct?witnessPeople!==undefined&&a.length===8&&a[5]===true&&witnessPeople.some(p=>key(p)===key(a[7])):a.length===7&&txt(a[0])===INTERFERENCE_OBS)&&key(a[2])===key(t)&&typeof a[5]==='boolean','observation');
 const at=uint(a[1]),ticket=uint(a[3]),receipt=uint(a[4]),bound=items(a[6],'list');
 require(at>=1n&&at<=timeLimit&&ticket>=1n&&(direct?ticket===at&&receipt===0n:ticket<at&&receipt>=1n&&receipt<=16n),'observation domain');
 if(bound.length)require(bound.length===8&&txt(bound[0])==='assembled-performance-observation/0.1'&&uint(bound[2])===ticket&&key(bound[3])===key(t)&&uint(bound[4])<=1n&&typeof bound[6]==='boolean'&&typeof bound[7]==='boolean','bound outcome');
 return {at,ticket,receipt,positive:a[5]===true,outcome:bound.length?a[6]:undefined,route:bound.length?uint(bound[4]):null,acquisition:false,scope:null};
}
export function interferenceJournal(v:CanonicalValue|undefined,t:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT,witnessPeople?:readonly CanonicalValue[],acquired=false){
 assertTimeLimit(timeLimit);if(v===undefined)return [] as CanonicalValue[];
 const a=items(v,'list');require(a.length===2&&txt(a[0])===INTERFERENCE,'journal');const rows=[...items(a[1],'list')];
 require(rows.length>0&&rows.length<=(acquired?24:16),'capacity');let last=0n,lastAcquisition=false,n=0;
 const acquisitions=new Set<string>();
 for(const row of rows){const o=interferenceObservation(row,t,timeLimit,witnessPeople,acquired);
  require(o.at>last||acquired&&o.at===last&&lastAcquisition&&!o.acquisition,'order');
  if(o.acquisition){require(!acquisitions.has(key(o.outcome!))&&++n<=8,'unique acquisition/capacity');acquisitions.add(key(o.outcome!));}
  else if(acquired&&o.outcome)require(acquisitions.has(key(o.outcome)),'missing acquisition');
  last=o.at;lastAcquisition=o.acquisition;
 }
 require(rows.length-n<=16,'support capacity');return rows;
}
export function appendInterference(prior:CanonicalValue|undefined,o:CanonicalValue,t:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT,witnessPeople?:readonly CanonicalValue[],acquired=false){assertTimeLimit(timeLimit);const v=list([text(INTERFERENCE),list([...interferenceJournal(prior,t,timeLimit,witnessPeople,acquired),o])]);interferenceJournal(v,t,timeLimit,witnessPeople,acquired);return v;}
export type InterferenceLaw='AcrossEpisodeMean'|'LatestEpisode'|'EpisodeOnly'|'NoLearning';
export type Episode={context:string|null;support:readonly {source:string;positive:boolean}[]};
export function routeExpectation(episodes:readonly Episode[],context:string|null,goal:0|1,law:InterferenceLaw='AcrossEpisodeMean'){
 require(['AcrossEpisodeMean','LatestEpisode','EpisodeOnly','NoLearning'].includes(law)&&[0,1].includes(goal),'law/goal');
 const eligible=context===null?[]:episodes.filter(e=>e.context===context&&e.support.length),values=eligible.map(e=>{const seen=new Set<string>(),unique=e.support.filter(s=>{if(seen.has(s.source))return false;seen.add(s.source);return true;});return Q.of(BigInt(unique.filter(s=>s.positive).length),BigInt(unique.length));});
 const estimate=!values.length||law==='EpisodeOnly'||law==='NoLearning'?undefined:law==='LatestEpisode'?values.at(-1)!:values.reduce((a,b)=>a.add(b),Q.of(0n)).divide(Q.of(BigInt(values.length)));
 return {eligible:law==='NoLearning'?0:eligible.length,estimate,affect:compareAffectFactors({likelihood:estimate,severity:Q.of(BigInt(goal)),vulnerability:Q.of(1n),control:Q.of(0n)},'SplitExposure')};
}
export function interferenceAppraisal(history:readonly CanonicalValue[],t:CanonicalValue,route:bigint|null,goal:bigint,at:bigint,timeLimit:TimeLimit=LEGACY_TIME_LIMIT,witnessPeople?:readonly CanonicalValue[],acquired=false){assertTimeLimit(timeLimit);
 const episodes=new Map<string,{ticket:bigint;context:string|null;support:{source:string;positive:boolean}[]}>();
 for(const row of history){const o=interferenceObservation(row,t,timeLimit,witnessPeople,acquired);require(o.at<at,'same-instant evidence');if(!o.outcome)continue;const k=key(o.outcome);
 if(o.acquisition){require(!episodes.has(k),'rebound acquisition');episodes.set(k,{ticket:o.ticket,context:o.scope===null?null:String(o.scope),support:[]});continue;}
 const episode=episodes.get(k)??(acquired?undefined:{ticket:o.ticket,context:String(o.route),support:[]});require(!!episode,'missing appraisal acquisition');
 episode!.support.push({source:String(o.receipt),positive:o.positive});episodes.set(k,episode!);}
 const j=routeExpectation([...episodes.values()].sort((a,b)=>a.ticket<b.ticket?-1:1),route===null?null:String(route),Number(goal) as 0|1);
 return list([text(INTERFERENCE_APPRAISAL),unsigned(at),t,route===null?list([]):unsigned(route),unsigned(goal),unsigned(j.eligible),j.estimate?qValue(j.estimate):list([]),j.affect.status==='Known'?list(j.affect.coordinates.map(qValue)):list([]),list(history)]);
}
