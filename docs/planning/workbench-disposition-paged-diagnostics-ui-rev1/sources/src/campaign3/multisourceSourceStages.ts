/** Internal transforms under multisource-public/0.1-candidate. The runtime owns
 * stage order, actual-parent admission, allocation and restricted state reads. */
import {list,map,record,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataIdentity as id,dataText as str,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {workspaceOutput,appraisalOutput,concernOutput,motiveOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {readQ,qValue,ZERO,ONE} from '../campaign2/cognitiveMath';
import {deficitPressure} from './embodiedMath';
import {receivingRecord as old,receivingSchema} from './receivingCodecs';
import {multisourceRecord as r} from './multisourcePublicCodecs';
import {msId} from './multisourceModelRecipe';
type Read=(root:bigint,selector:CanonicalValue,field?:bigint)=>CanonicalValue|undefined;
type Allocate=()=>bigint;
type Definition=(id:CanonicalValue)=>CanonicalValue;
const occurrence=(allocate:Allocate,ns=1149)=>typedIdentifier(ns,u(allocate()));
const forbidden=():never=>{throw Error('MULTISOURCE_FORBIDDEN_CHARACTER_READ');};
export function multisourceTaskStage(profile:CanonicalValue,selected:CanonicalValue,at:bigint,definition:Definition,read:Read,allocate:Allocate){
 const p=rec(profile,710n),holder=f(p,2n),self=read(268n,f(p,1n));if(!self||key(f(rec(self,267n),1n))!==key(holder))throw Error('MULTISOURCE_SELF');
 const tasks=items(f(p,3n),'list').map(v=>{
  const t=rec(v,708n),task=f(t,1n),spec=rec(definition(f(t,2n)),370n),status=read(373n,task),plan=read(373n,task,2n);
  const from=f(spec,5n),deadline=f(spec,6n);if(typeof from==='boolean'||from.kind!=='signed'||typeof deadline==='boolean'||deadline.kind!=='signed')throw Error('MULTISOURCE_WINDOW');
  const workspace=workspaceOutput(occurrence(allocate,1128),holder,msId(1027,'definition/task-workspace'),f(t,5n),[{key:task,specId:f(t,2n),activeFrom:from.value,deadline:deadline.value}],at,{status:()=>status,prediction:forbidden}).output;
  const appraisal=appraisalOutput(occurrence(allocate,1129),workspace,[{taskKey:task,specId:f(t,2n),minimum:readQ(f(spec,3n)),maximum:readQ(f(spec,4n))}]);
  const concern=concernOutput(occurrence(allocate,1130),appraisal,f(t,6n)),motive=motiveOutput(occurrence(allocate,1131),concern,f(t,4n));
  const candidates=candidateOutput(occurrence(allocate,1132),motive,true,()=>{if(!plan)return undefined;const instruction=f(rec(plan,390n),1n);return {instructionId:instruction,actionId:f(rec(definition(instruction),389n),1n)};});
  return rawSignalOutput(occurrence(allocate,1133),candidates,false,ONE,forbidden).output;
 });
 return r(717,[occurrence(allocate),selected,list(tasks)]);
}
export function multisourceAssessmentStage(profile:CanonicalValue,batch:CanonicalValue,read:Read,allocate:Allocate){
 const p=rec(profile,710n),b=rec(batch,717n),selected=rec(f(b,2n),716n),groups=items(f(selected,3n),'list').map(v=>rec(v,715n));
 const taskRaws=items(f(b,3n),'list').map(v=>rec(v,403n)),candidates=taskRaws.flatMap(v=>items(f(rec(f(v,2n),398n),3n),'list').map(c=>rec(c,397n)));
 const options=new Map(candidates.map(c=>[key(f(c,1n)),f(c,1n)]));
 const adoption=read(487n,f(p,2n));if(!adoption)throw Error('MULTISOURCE_BODY_ADOPTION');
 const adopted=items(f(rec(adoption,486n),1n),'set');
 const assessments=items(f(p,4n),'list').map(v=>rec(v,709n)).filter(d=>{
  const ground=rec(f(d,2n),494n);
  return uint(f(ground,1n))===2n?adopted.some(v=>key(v)===key(f(d,4n))):candidates.some(c=>key(f(c,1n))===key(old(395,[f(p,2n),f(d,3n)]))&&items(f(c,2n),'set').some(v=>{const origin=rec(v,396n);return key(f(origin,1n))===key(f(ground,2n))&&key(f(origin,2n))===key(f(d,4n));}));
 }).map(d=>{
  const group=groups.find(g=>key(f(g,1n))===key(f(d,5n))),samples=items(f(d,6n),'list').map(channel=>group&&items(f(group,2n),'list').find(v=>key(f(rec(v,461n),3n))===key(channel)));
  if(samples.some(v=>v===undefined))return r(718,[f(d,1n),u(1)]);
  const records=samples.map(v=>rec(v!,461n)),intervals=records.map(v=>rec(f(v,5n),462n));
  const lower=intervals.map(v=>readQ(f(v,1n))).reduce((a,b)=>a.compare(b)<0?a:b),upper=intervals.map(v=>readQ(f(v,2n))).reduce((a,b)=>a.compare(b)>0?a:b);
  const magnitude=deficitPressure(upper,readQ(f(d,7n))),strength=uint(f(d,8n))===1n?magnitude:ZERO.subtract(magnitude);
  const basis=old(400,[map(records.map(s=>[old(399,[u(1),record(receivingSchema(237n),new Map([[1n,u(1)],[2n,f(s,1n)]]))]),qValue(ONE)]))]);
  if(uint(f(rec(f(d,2n),494n),1n))===2n&&strength.compare(ZERO)>0){const option=old(395,[f(p,2n),f(d,3n)]);options.set(key(option),option);}
  return r(718,[f(d,1n),u(2),old(462,[qValue(lower),qValue(upper)]),qValue(strength),basis,list(records)]);
 });
 return r(719,[occurrence(allocate),batch,list(assessments),list([...options].sort(([a],[b])=>a<b?-1:1).map(([,v])=>v))]);
}
export function multisourceRawStage(profile:CanonicalValue,source:CanonicalValue,allocate:Allocate){
 const p=rec(profile,710n),s=rec(source,719n),signals:CanonicalValue[]=[];
 for(const raw of items(f(rec(f(s,2n),717n),3n),'list'))for(const value of items(f(rec(raw,403n),3n),'set')){
  const signal=rec(value,402n),k=rec(f(signal,1n),401n);if(uint(f(k,3n))!==1n)throw Error('MULTISOURCE_UNDECLARED_TASK_MODIFIER');
  signals.push(r(721,[r(720,[f(k,1n),old(494,[u(1),f(k,2n)]),u(1),u(1)]),f(signal,2n),f(signal,3n)]));
 }
 for(const value of items(f(s,3n),'list')){const a=rec(value,718n);if(uint(f(a,2n))===1n||readQ(f(a,4n)).equals(ZERO))continue;
  const d=rec(items(f(p,4n),'list').find(v=>key(f(rec(v,709n),1n))===key(f(a,1n)))!,709n),body=uint(f(rec(f(d,2n),494n),1n))===2n;
  signals.push(r(721,[r(720,[old(395,[f(p,2n),f(d,3n)]),f(d,2n),u(body?1:2),u(2),f(d,1n)]),f(a,4n),f(a,5n)]));
 }
 signals.sort((a,b)=>key(f(rec(a,721n),1n))<key(f(rec(b,721n),1n))?-1:1);
 return r(722,[occurrence(allocate),source,list(signals)]);
}
