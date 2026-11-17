/** Receipt reasons/0.1: read-only Commitment producer over acquired performance. */
import {list,set,map,text,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {type AuthoritativeState,type ActualReadRecord} from '../substrate/state';
import type {ScheduledEvent} from '../substrate/scheduler';
import {dataItems as items,dataField as f,dataKey as key,dataText as txt,dataUnsigned as uint,invalidModel} from '../campaign2/canonicalData';
import {readQ,qValue,ZERO,ONE} from '../campaign2/cognitiveMath';
import type {compileCampaign2StateModel} from '../campaign2/stateModel';
import {cognitiveRecord as r,receivingRecord as rec} from './codecs';
import {outcomePath,outcomeJournal} from './performance';
import {sid} from './skill';
import type {Strategy} from './strategy';
export const RECEIPT_REASONS='assembled-receipt-reasons/0.1';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const bad=(s:string):never=>invalidModel('receipt reasons: '+s);
export function compileReceiptReasonSources(value:CanonicalValue,strategy:Strategy,otherLabels:readonly string[]){
 const a=items(value,'list');if(a.length!==2||txt(a[0])!==RECEIPT_REASONS)bad('declaration');
 const rows=items(a[1],'list'),labels=new Set(['primary',...otherLabels]);if(rows.length>3)bad('capacity');
 return rows.map(value=>{const d=items(value,'list');if(d.length!==7)bad('shape');const label=txt(d[0]),role=uint(d[6]),gain=readQ(d[5]),positions=items(d[4],'set').map(uint);
  if(!/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(label)||labels.has(label))bad('label');labels.add(label);
  if(!strategy.some(t=>eq(t.task,d[2]))||!strategy.some(t=>eq(t.task,d[3]))||!strategy.some(t=>t.plans.some(p=>eq(p.actionId,d[1]))))bad('task/action');
  if(!positions.length||positions.length>2||positions.some(p=>p>7n)||gain.compare(ZERO.subtract(ONE))<0||gain.compare(ONE)>0||![1n,4n].includes(role))bad('domain');
  return {value,label,action:d[1],task:d[2],sourceTask:d[3],positions,gain,role};
 });
}
export function receiptReasonSources(settings:ReturnType<typeof compileReceiptReasonSources>,event:ScheduledEvent,input:CanonicalValue,state:AuthoritativeState,stateModel:ReturnType<typeof compileCampaign2StateModel>,strategy:Strategy){
 const raw=rec(input,403n);if(raw.schema.schemaVersion!==3n||event.phase!==80n)bad('raw boundary');
 const descriptions=[...items(f(raw,6n),'list')],signals=[...items(f(raw,3n),'set')],originalSignals=[...signals],produced:CanonicalValue[]=[],rejected:CanonicalValue[]=[],reads:ActualReadRecord[]=[];
 const candidates=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));
 const journals=new Map<string,CanonicalValue[]>();
 for(const d of settings){const candidate=r(395,[f(rec(d.task,371n),1n),d.action]);
  if(!candidates.some(c=>eq(c,candidate))||!originalSignals.some(s=>eq(f(rec(f(rec(s,402n),1n),401n),2n),d.task))){rejected.push(list([d.value,text('NotSelected')]));continue;}
  let journal=journals.get(key(d.sourceTask));if(!journal){const path=outcomePath(d.sourceTask),read=stateModel.read(state,path);reads.push({accessorId:sid(1028,'accessor/receipt-reasons'),path,presence:read.presence,value:read.value,derivedSources:[]});journal=outcomeJournal(read.value,d.sourceTask,strategy,true).filter(v=>uint(items(v,'list')[2])<event.dueAt);journals.set(key(d.sourceTask),journal);}
  const support=d.positions.map(p=>journal![Number(p)]);if(support.some(v=>!v)){rejected.push(list([d.value,text('MissingEvidence')]));continue;}
  const strength=d.gain.multiply(support.map(v=>items(v,'list')[6]===true?ONE:ZERO.subtract(ONE)).reduce((a,b)=>a.compare(b)<0?a:b));
  if(strength.equals(ZERO)){rejected.push(list([d.value,text('Zero')]));continue;}
  const basis=r(400,[map(support.map(v=>[r(399,[u(3),items(v,'list')[1]],2),qValue(ONE)]))]);
  const signal=r(402,[r(401,[candidate,d.task,u(d.role)],d.role===4n?2:1),qValue(strength),basis]),description=list([text(d.label),sid(1040,'Commitment'),signal]);
  descriptions.push(description);signals.push(signal);produced.push(list([d.value,description,list(support)]));
 }
 return {output:r(403,[f(raw,1n),f(raw,2n),set(signals),f(raw,4n),f(raw,5n),list(descriptions)],3),report:list([text(RECEIPT_REASONS),signed(event.dueAt),list(produced),list(rejected)]),reads};
}
