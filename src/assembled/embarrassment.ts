import {LEGACY_TIME_LIMIT,assertTimeLimit,timeDomainVersion,type TimeLimit} from './timeDomain';
/** Contextual self-relevant social appraisal; one person's admitted evidence, no mood store. */
import {list,map,set,text,unsigned,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataText as txt,dataField as f,dataUnsigned as uint,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {ONE,ZERO,qValue,readQ,bounded} from '../campaign2/cognitiveMath';
import {compareAffectFactors} from '../campaign3/affectFactorComparison';
import {receivingRecord as rec,cognitiveRecord as r} from './codecs';
import {personPath,personHistory} from './social';
import {importancePath,importanceValue} from './priority';
import {sid,pattern} from './skill';
import type {Strategy} from './strategy';
import type {AuthoritativeState,StatePath,ActualReadRecord} from '../substrate/state';
import {SchedulerContractError,type ScheduledEvent} from '../substrate/scheduler';
import {traceRecordValue} from '../substrate/trace';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
export const EMBARRASSMENT='assembled-embarrassment/0.1',EMBARRASSMENT_VERSION='assembled-character-embarrassment/0.1-candidate';
const require=(b:boolean,s:string)=>{if(!b)invalidModel('embarrassment '+s);};
export function evaluationSource(v:CanonicalValue){const a=items(v,'list');require(a.length===3,'report source');return list(a.map(v=>{const t=items(v,'list');require(t.length===3&&t.every(x=>typeof x==='boolean'),'report triple');return list(t[1]===true?[t[0]]:[]);}));}
export function evaluationTuple(v:CanonicalValue){const a=items(v,'list');require(a.length===3,'report tuple');return a.map(v=>{const x=items(v,'list');require(x.length<=1&&x.every(v=>typeof v==='boolean'),'optional report');return x[0] as boolean|undefined;});}
export function compileEmbarrassment(v:CanonicalValue,targets:readonly CanonicalValue[],strategy:Strategy){const a=items(v,'list');require(a.length===4&&txt(a[0])===EMBARRASSMENT,'declaration');require(targets.some(t=>key(t)===key(a[1]))&&strategy.some(t=>key(t.task)===key(a[2]))&&strategy.some(t=>t.plans.some(p=>key(p.actionId)===key(a[3]))),'references');return {target:a[1],task:a[2],action:a[3]};}
export function evaluationFold(rows:readonly CanonicalValue[]){
 const groups:[{value:boolean;source:CanonicalValue}[],{value:boolean;source:CanonicalValue}[],{value:boolean;source:CanonicalValue}[]]=[[],[],[]];
 for(const row of rows){const a=items(row,'list');if(a.length!==10)continue;for(const [i,value]of evaluationTuple(a[9]).entries())if(value!==undefined)groups[i].push({value,source:a[0]});}
 const mismatch=groups[0].at(-1)?.value,seen=groups[1].at(-1)?.value,judgment=groups[2].length?Q.of(BigInt(groups[2].filter(x=>x.value).length),BigInt(groups[2].length)):undefined;
 const likelihood=mismatch===undefined||seen===undefined||judgment===undefined?undefined:mismatch&&seen?judgment:ZERO;
 const sources=[...new Map([...(groups[0].slice(-1)),...(groups[1].slice(-1)),...groups[2]].map(x=>[key(x.source),x.source])).values()];
 return {mismatch,seen,judgment,likelihood,sources};
}
export function createEmbarrassment(config:ReturnType<typeof compileEmbarrassment>,C:CanonicalValue,stateModel:ReturnType<typeof compileCampaign2StateModel>,model:CanonicalValue,run:CanonicalValue,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 let current:{at:bigint;report:CanonicalValue;amount:Q|undefined;sources:CanonicalValue[];event:bigint}|undefined;
 const fail=(s:string):never=>{throw new SchedulerContractError('INPUT_NOT_ADMITTED','embarrassment '+s);};
 const trace=(e:ScheduledEvent,input:CanonicalValue,output:CanonicalValue,sources:CanonicalValue[],reads:ActualReadRecord[]=[])=>traceRecordValue({traceSchemaVersion:'trace/0.2-candidate',modelIdentity:model,runIdentity:run,event:e,seamId:sid(1036,'seam/assembled-embarrassment'),seamVersion:timeDomainVersion(EMBARRASSMENT_VERSION,timeLimit),recordKind:e.eventTypeId,subjectIds:[id(C),id(config.target)],sourceRecordIds:sources.map(id),registeredReadDomain:reads.map(x=>pattern(x.path)),actualReadRecords:reads,inputProjection:input,outputProjection:output,randomDrawRecords:[],quantizationOperations:[],statePatch:{operations:[]},structuralMutationDiffs:[],emittedEvents:[],invariantResults:[]});
 return {reset(){current=undefined;},
 appraise(e:ScheduledEvent,state:AuthoritativeState){if(e.phase!==50n||current)fail('appraisal lifecycle');const reads:ActualReadRecord[]=[];
 const read=(path:StatePath)=>{const v=stateModel.read(state,path);reads.push({accessorId:sid(1028,'accessor/embarrassment'),path,presence:v.presence,value:v.value,derivedSources:[]});return v.value;};
 const history=read(personPath(C,config.target)),importance=read(importancePath(config.task)),rows=personHistory(history);
 for(const row of rows){const at=items(row,'list')[3];if(typeof at==='boolean'||at.kind!=='signed'||at.value>=e.dueAt)fail('prior-only knowledge');}
 const estimate=evaluationFold(rows),severity=importance?importanceValue(importance,true,timeLimit).I:ZERO,affect=compareAffectFactors({likelihood:estimate.likelihood,severity,vulnerability:ONE,control:ZERO},'SplitExposure');
 const report=list([text(EMBARRASSMENT+'/appraisal'),unsigned(e.dueAt),config.target,...[estimate.mismatch,estimate.seen].map(x=>list(x===undefined?[]:[x])),list(estimate.judgment?[qValue(estimate.judgment)]:[]),list(estimate.likelihood?[qValue(estimate.likelihood)]:[]),qValue(severity),text(affect.status),list(affect.status==='Known'?affect.coordinates.map(qValue):[]),list(estimate.sources)]);
 current={at:e.dueAt,report,amount:affect.status==='Known'?affect.coordinates.at(-1):undefined,sources:estimate.sources,event:e.eventId};
 return {report,trace:()=>trace(e,list([history??list([]),importance??list([])]),report,estimate.sources,reads)};
 },
 raw(e:ScheduledEvent,input:CanonicalValue){if(e.phase!==80n||!current||current.at!==e.dueAt)fail('raw lifecycle');const app=current!,raw=rec(input,403n),signals=[...items(f(raw,3n),'set')],joined:CanonicalValue[]=[];
 for(const candidate of items(f(rec(f(raw,2n),398n),3n),'list')){const option=rec(candidate,397n),c=f(option,1n);if(key(f(rec(c,395n),2n))!==key(config.action))continue;
 for(const origin of items(f(option,2n),'set')){const task=f(rec(origin,396n),1n),sk=r(401,[c,task,unsigned(2)]),base=signals.find(v=>{const k=rec(f(rec(v,402n),1n),401n);return key(f(k,1n))===key(c)&&key(f(k,2n))===key(task)&&uint(f(k,3n))===1n&&readQ(f(rec(v,402n),2n)).compare(ZERO)>0;});
 if(!base||app.amount===undefined)continue;
 const index=signals.findIndex(v=>key(f(rec(v,402n),1n))===key(sk)),old=index<0?undefined:rec(signals[index],402n),oldBasis=old?f(rec(f(old,3n),400n),1n):map([]);require(typeof oldBasis!=='boolean'&&oldBasis.kind==='map','basis');
 const basis=new Map((oldBasis as Extract<CanonicalValue,{kind:'map'}>).entries.map(([a,w])=>[key(a),[a,w] as const]));for(const source of app.sources){const a=r(399,[unsigned(1),r(237,[unsigned(1),source])]);basis.set(key(a),[a,qValue(ONE)]);}
 const before=old?readQ(f(old,2n)):ZERO,after=before.add(app.amount);joined.push(list([sk,qValue(before),qValue(app.amount),qValue(after)]));
 if(!app.amount.equals(ZERO)){const next=r(402,[sk,qValue(after),r(400,[map([...basis.values()])])]);if(index<0)signals.push(next);else signals[index]=next;}
 }}
 const oldMeaning=f(raw,4n);require(typeof oldMeaning!=='boolean'&&oldMeaning.kind==='map','meaning');
 const meaning=map((oldMeaning as Extract<CanonicalValue,{kind:'map'}>).entries.map(([c,v])=>{if(!joined.some(j=>key(f(rec(items(j,'list')[0],401n),1n))===key(c)))return [c,v] as const;const pressure=signals.reduce((sum,s)=>{const a=rec(s,402n),k=rec(f(a,1n),401n);return key(f(k,1n))===key(c)&&uint(f(k,3n))!==3n?sum.add(readQ(f(a,2n))):sum;},ZERO);return [c,qValue(bounded(pressure))] as const;}));
 const output=record(raw.schema,new Map([...raw.fields].map(([n,v])=>[n,n===3n?set(signals):n===4n?meaning:v]))),report=list([text(EMBARRASSMENT+'/reasons'),unsigned(e.dueAt),app.report,list(joined)]);
 return {output,report,trace:()=>trace(e,list([input,app.report,unsigned(app.event)]),list([output,report]),app.sources)};
 }};
}
