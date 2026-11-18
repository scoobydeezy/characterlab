import {LEGACY_TIME_LIMIT,assertTimeLimit,type TimeLimit} from './timeDomain';
/** Approved L5 filter over permitted, engaged, context-specific reports. */
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {StatePath} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {developmentalGain} from '../campaign3/developmentComponent';
import {exact} from '../campaign3/embodiedMath';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {q} from './skill';
export const EXPECTATION='assembled-performance-expectation/0.1',EXPECTATION_TOPIC='assembled-expectation-topic/0.1';
export const expectationPath=(task:CanonicalValue,route:bigint):StatePath=>({rootStateTypeId:1000n,fieldId:4n,selectors:[{kind:'mapKey',key:list([task,unsigned(route)])}]});
const require=(b:boolean,s:string)=>{if(!b)invalidModel('performance expectation '+s);};
export function updateExpectation(prior:Q|undefined,report:boolean,phase:number){const gain=developmentalGain('Ramp',phase),x=Q.of(report?1n:0n);return {gain,mean:prior===undefined?x:prior.add(x.subtract(prior).multiply(gain.divide(Q.of(8n))))};}
export function expectationValue(v:CanonicalValue|undefined,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);
 if(v===undefined)return {mean:undefined as Q|undefined,supports:[] as CanonicalValue[]};
 const a=items(v,'list');require(a.length===3&&txt(a[0])===EXPECTATION,'grammar');const supports=items(a[2],'list');require(supports.length>=1&&supports.length<=8,'capacity');let mean:Q|undefined,last=0n,phase=0n;const seen=new Set<string>();
 for(const entry of supports){const x=items(entry,'list');require(x.length===3,'support');const o=items(x[0],'list');require(o.length===8&&txt(o[0])==='assembled-performance-observation/0.1'&&typeof o[6]==='boolean'&&o[7]===true,'engaged observation');const occurrence=id(o[1]);require(occurrence.namespaceId===1164n&&!seen.has(key(o[1])),'occurrence');uint(occurrence.payload);seen.add(key(o[1]));const time=uint(o[2]),d=uint(x[1]);require(time>last&&time<=timeLimit&&d>=phase&&d<=4n,'time/phase');const update=updateExpectation(mean,o[6]===true,Number(d));require(key(q(update.gain))===key(x[2]),'event gain');mean=update.mean;last=time;phase=d;
 }
 require(key(q(mean!))===key(a[1]),'fold');return {mean:exact(a[1]) as Q|undefined,supports:[...supports]};
}
export function appendExpectation(prior:CanonicalValue|undefined,observation:CanonicalValue,phase:number,timeLimit:TimeLimit=LEGACY_TIME_LIMIT){assertTimeLimit(timeLimit);const before=expectationValue(prior,timeLimit),o=items(observation,'list'),update=updateExpectation(before.mean,o[6]===true,phase),value=list([text(EXPECTATION),q(update.mean),list([...before.supports,list([observation,unsigned(phase),q(update.gain)])])]);expectationValue(value,timeLimit);return value;}
