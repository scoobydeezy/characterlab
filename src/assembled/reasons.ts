/** assembled-character-habit/0.1: two actions x two tasks, unchanged per-group mathematics. */
import {list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {SchedulerContractError} from '../substrate/scheduler';
import {compileReasonNuclei} from '../campaign2/cognitiveMath';
import {receivingRecord as rec} from './codecs';
import {dataField as f,dataKey as key} from '../campaign2/canonicalData';
export function compileAssembledReasons(signals:readonly CanonicalValue[],definition:CanonicalValue,maxDomain=2){
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','assembled reasons: '+s);};
 if(signals.length>3*maxDomain*maxDomain)fail('signal capacity');const groups=new Map<string,CanonicalValue[]>(),actions=new Set<string>(),tasks=new Set<string>();
 for(const signal of signals){const s=rec(f(rec(signal,402n),1n),401n),candidate=f(s,1n),task=f(s,2n),k=key(list([candidate,f(rec(task,371n),2n)]));actions.add(key(candidate));tasks.add(key(task));const g=groups.get(k)??[];g.push(signal);groups.set(k,g);}
 if(groups.size>maxDomain*maxDomain||actions.size>maxDomain||tasks.size>maxDomain)fail('action/task domain');
 return [...groups.values()].flatMap(group=>compileReasonNuclei(group,definition)).sort((a,b)=>key(f(rec(a,407n),1n))<key(f(rec(b,407n),1n))?-1:1);
}


/** M85: shared described-source receiving boundary; old compiler above is frozen. */
import {set,text,unsigned,signed,typedIdentifier,rational as rational} from '../substrate/canonicalEncoding';
import {dataItems as items,dataText as txt,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import {cognitiveRecord as r,receivingRecord,cloneCognitive} from './codecs';
import {ExactRational as Q} from '../substrate/exactMath';
import {ZERO,ONE,absolute,bounded,readQ,qValue,distributionValue} from '../campaign2/cognitiveMath';

export const SOURCE_COVERAGE_VERSION='assembled-character-reason-sources/0.3-candidate';
export const REASON_SOURCES='assembled-reason-sources/0.1';
export const REASON_SOURCES_VERSION='assembled-character-reason-sources/0.1-candidate';
export const REASON_SOURCE_REPORT=REASON_SOURCES+'/compilation';
const labelPattern=/^[A-Za-z][A-Za-z0-9_-]{0,63}$/;
const reject=(s:string):never=>invalidModel('reason descriptions: '+s);
export function compileReasonDescriptions(value:CanonicalValue){
 const v=items(value,'list');if(v.length!==2||txt(v[0])!==REASON_SOURCES)reject('declaration');
 const labels=items(v[1],'list').map(txt);
 if(labels.length>2||new Set(labels).size!==labels.length||labels.some(s=>s==='primary'||!labelPattern.test(s)))reject('additional labels');
 return Object.freeze([...labels].sort());
}
const motive=(value:boolean)=>typedIdentifier(1040,text(value?'Value':'Commitment'));
export function describedRaw(value:CanonicalValue,labels:readonly string[]){
 const raw=receivingRecord(value,403n);if(raw.schema.schemaVersion!==2n)reject('requires produced raw403/2');
 const described:CanonicalValue[]=[];
 for(const [field,isValue] of [[3n,false],[5n,true]] as const)for(const source of items(f(raw,field),'set')){
  const s=rec(source,402n),sk=rec(f(s,1n),401n);
  described.push(list([text('primary'),motive(isValue),source]));
  if(!isValue&&uint(f(sk,3n))===1n&&readQ(f(s,2n)).numerator!==0n&&labels.length){
   const basis=f(rec(f(s,3n),400n),1n);
   if(typeof basis==='boolean'||basis.kind!=='map'||!basis.entries.length)reject('cannot repeat empty evidence basis');
   for(const label of labels)described.push(list([text(label),motive(false),source]));
  }
 }
 described.sort((a,b)=>key(descriptionIdentity(a))<key(descriptionIdentity(b))?-1:1);
 return r(403,[...Array.from({length:5},(_,i)=>f(raw,BigInt(i+1))),list(described)],3);
}
export function descriptionIdentity(value:CanonicalValue){
 const d=items(value,'list');return list([d[0],d[1],f(rec(d[2],402n),1n)]);
}
const valueCalibration=()=>{const m=r(439,[rational(1,1),unsigned(3)]);return r(437,[r(438,[rational(1,10),rational(1,5),rational(3,5),rational(4,5),rational(9,10)]),rational(0,1),m,m]);};
const min=(a:Q,b:Q)=>a.compare(b)<0?a:b,max=(a:Q,b:Q)=>a.compare(b)>0?a:b;
/** Port of the accepted role/sign aggregate kernel with explicit description IDs.
 * No world/state/RNG reader. Only authenticated raw input arrives from execution. */
export function compileDescribedReasons(value:CanonicalValue,taskDice:CanonicalValue,maxDomain=3,coverageLaw:'Jaccard'|'SourceCoverage'='Jaccard',contextReasons=false){
 if(coverageLaw!=='Jaccard'&&coverageLaw!=='SourceCoverage')reject('coverage law');
 const raw=receivingRecord(cloneCognitive(value),403n);if(raw.schema.schemaVersion!==3n)reject('requires described raw403/3');
 const descriptions=items(f(raw,6n),'list'),actions=new Set<string>(),tasks=new Set<string>();
 const rows=descriptions.map(value=>{
  const d=items(value,'list'),signal=rec(d[2],402n),source=rec(f(signal,1n),401n),candidate=rec(f(source,1n),395n),task=rec(f(source,2n),371n);
  if(uint(f(source,3n))===4n&&!contextReasons)reject('context role requires successor');
  if(key(f(candidate,1n))!==key(f(task,1n)))reject('actor mismatch');
  actions.add(key(candidate));tasks.add(key(task));
  const b=f(rec(f(signal,3n),400n),1n);if(typeof b==='boolean'||b.kind!=='map'||b.entries.length>64)reject('basis domain');
  const weights=new Map<string,Q>();
  for(const [atom,weight] of (b as Extract<CanonicalValue,{kind:'map'}>).entries){const w=readQ(weight);if(w.compare(ZERO)<=0)reject('positive basis weights');weights.set(key(atom),w);}
  return {id:descriptionIdentity(value),source,signal,candidate,referent:f(task,2n),motive:d[1],role:uint(f(source,3n)),strength:readQ(f(signal,2n)),weights};
 });
 if(actions.size>maxDomain||tasks.size>maxDomain)reject('action/task domain');
 const groups=new Map<string,typeof rows>();
 for(const row of rows){const k=key(list([row.candidate,row.motive,row.referent])),g=groups.get(k)??[];g.push(row);groups.set(k,g);}
 if(groups.size>maxDomain*maxDomain+1)reject('group domain');
 const nuclei:CanonicalValue[]=[],reports:CanonicalValue[]=[];
 for(const group of groups.values()){
  if(group.length>6)reject('group description capacity');
  const coverage:CanonicalValue[]=[],first=group[0],isValue=key(first.motive)===key(motive(true));
  const def=rec(isValue?valueCalibration():taskDice,437n),threshold=readQ(f(def,2n)),bands=rec(f(def,1n),438n);
  const cutoffs=[1n,2n,3n,4n,5n].map(i=>readQ(f(bands,i)));
  if(threshold.compare(ZERO)<0||threshold.compare(Q.of(3n))>0||cutoffs.some((x,i)=>x.compare(i?cutoffs[i-1]:ZERO)<=0||x.compare(ONE)>0))reject('dice calibration');
  function role(n:bigint){
   let total=ZERO;const traces:CanonicalValue[]=[];
   for(const sign of [1,-1]){
    const selected=group.filter(x=>x.role===n&&x.strength.compare(ZERO)===sign).sort((a,b)=>absolute(b.strength).compare(absolute(a.strength))||(key(a.id)<key(b.id)?-1:1));
    const aggregate=new Map<string,Q>();
    for(const row of selected){
     let intersection=ZERO,union=ZERO;
     for(const k of new Set([...aggregate.keys(),...row.weights.keys()])){const a=aggregate.get(k)??ZERO,b=row.weights.get(k)??ZERO;intersection=intersection.add(min(a,b));union=union.add(max(a,b));}
     const denominator=coverageLaw==='SourceCoverage'?[...row.weights.values()].reduce((a,b)=>a.add(b),ZERO):union;
     const overlap=denominator.equals(ZERO)?ZERO:intersection.divide(denominator),independent=ONE.subtract(overlap),magnitude=absolute(row.strength),effective=magnitude.multiply(independent);
     total=total.add(effective.multiply(Q.of(BigInt(sign))));
     traces.push(r(405,[row.source,qValue(magnitude),qValue(overlap),qValue(independent),qValue(effective)]));
     coverage.push(list([row.id,unsigned(n),signed(sign),qValue(magnitude),qValue(overlap),qValue(independent),qValue(effective),f(row.signal,3n)]));
     for(const [k,w] of row.weights)aggregate.set(k,max(aggregate.get(k)??ZERO,w));
    }
   }
   return {net:bounded(total),traces};
  }
  const base=role(1n),standing=role(3n),situation=role(2n),context=contextReasons?role(4n):{net:ZERO,traces:[] as CanonicalValue[]},relevance=absolute(base.net).add(absolute(standing.net)).add(absolute(situation.net)).add(absolute(context.net));
  const direction=base.net.compare(ZERO)<0?-1n:1n,nk=r(404,[first.candidate,first.motive,first.referent,unsigned(direction>0n?1:2)],isValue?2:1);
  const status=base.net.equals(ZERO)?'ZeroBase':relevance.compare(threshold)<0?'BelowThreshold':'Active';
  reports.push(list([nk,text(status),qValue(relevance),list(coverage)]));
  if(status!=='Active')continue;
  const modifier=(v:Q,field:bigint)=>{const d=rec(f(def,field),439n),unit=readQ(f(d,1n)),cap=uint(f(d,2n));if(unit.compare(ZERO)<=0||cap>3n)reject('modifier calibration');const scaled=v.divide(unit),raw=scaled.numerator/scaled.denominator;return raw>cap?cap:raw< -cap?-cap:raw;};
  let die=4n;cutoffs.forEach((cutoff,i)=>{if(absolute(base.net).compare(cutoff)>=0)die=[4n,6n,8n,10n,12n][i];});
  const h=modifier(standing.net,3n),x=modifier(situation.net,4n),c=modifier(context.net,4n),distribution=new Map<bigint,Q>();
  for(let face=1n;face<=die;face++)distribution.set(direction*(face+h+x+c),Q.of(1n,die));
  nuclei.push(r(407,[nk,r(406,[qValue(base.net),qValue(standing.net),qValue(situation.net),list([...base.traces,...standing.traces,...situation.traces,...context.traces]),...(contextReasons?[qValue(context.net)]:[])],contextReasons?2:1),qValue(relevance),unsigned(die),signed(h),signed(x),distributionValue(distribution),...(contextReasons?[signed(c)]:[])],contextReasons?2:1));
 }
 nuclei.sort((a,b)=>key(f(rec(a,407n),1n))<key(f(rec(b,407n),1n))?-1:1);
 reports.sort((a,b)=>key(items(a,'list')[0])<key(items(b,'list')[0])?-1:1);
 return {nuclei,report:list([text(REASON_SOURCE_REPORT),list(reports),list(rows.filter(v=>v.strength.equals(ZERO)).map(v=>v.id)),...(coverageLaw==='SourceCoverage'?[text(coverageLaw)]:[])])};
}


import {map} from '../substrate/canonicalEncoding';
import {PRIORITY_MOTIVE,PRIORITY_OBS} from './priority';
import {HORIZON_EVAL,forecastValue} from './horizon';
/** Cite only observations already consumed by the authenticated priority producer.
 * The reappraisal-replaced task has a different causal producer and is excluded. */
export function prioritySourceBasis(value:CanonicalValue,report:CanonicalValue|undefined,excludedTask?:CanonicalValue){
 if(!report)return value;
 const raw=receivingRecord(value,403n),p=items(report,'list');
 if(p.length!==3||txt(p[0])!==PRIORITY_MOTIVE)reject('generated priority report required');
 const rows=items(p[2],'list').map(v=>items(v,'list'));
 const signals=items(f(raw,3n),'set').map(value=>{
  const signal=rec(value,402n),source=rec(f(signal,1n),401n),task=f(source,2n);
  if(uint(f(source,3n))!==1n||excludedTask&&key(task)===key(excludedTask))return value;
  const row=rows.find(v=>key(v[0])===key(task));if(!row)return value;
  if(key(row[3])!==key(f(signal,2n)))reject('priority source strength association');
  const observation=items(row[4],'list'),supports:CanonicalValue[]=[];
  if(typeof row[5]!=='boolean'&&row[5].kind==='typedIdentifier')supports.push(row[5]);
  if(observation.length){if(observation.length!==6||txt(observation[0])!==PRIORITY_OBS||key(observation[3])!==key(task))reject('priority observation association');supports.push(observation[1]);}
  if(row[6]){const horizon=items(row[6],'list');if(horizon.length!==7||txt(horizon[0])!==HORIZON_EVAL||key(horizon[2])!==key(task))reject('horizon association');if(items(horizon[3],'list').length)supports.push(forecastValue(horizon[3]).support);}
  const basis=f(rec(f(signal,3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')return reject('source evidence map');
  const merged=new Map(basis.entries.map(([a,w])=>[key(a),[a,w] as readonly [CanonicalValue,CanonicalValue]]));
  for(const support of supports){const atom=r(399,[unsigned(1),r(237,[unsigned(1),support])]);merged.set(key(atom),[atom,qValue(ONE)]);}
  return r(402,[source,f(signal,2n),r(400,[map([...merged.values()])])]);
 });
 return r(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n),f(raw,5n)],2);
}
