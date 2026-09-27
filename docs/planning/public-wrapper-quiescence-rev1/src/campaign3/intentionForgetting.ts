/** intention-forgetting-component/0.1-candidate; explicit component boundaries. */
import {canonicalEncode as enc,list,text,unsigned as u,map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {ExactRational as Q} from '../substrate/exactMath';
import {retainCanonicalSignificantChildren,type CanonicalSignificantAcquisition} from './canonicalChildKeys';
import {recallCanonicalEventAcquisitions} from './canonicalEventRecall';
import {ONE,compileReasonNuclei,readDistribution,analyzeOptions,absolute,expectation} from '../campaign2/cognitiveMath';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {receivingRecord as old} from './receivingCodecs';
import {multisourceBase} from './multisourceModelRecipe';
import {ACTOR,sid} from './longitudinalModel';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
const TASK=old(371,[ACTOR,semanticReferentFromAuthoredContent(sid(1038,'content/intention/delivery-goal'))]);
export const VERSION='intention-forgetting-component/0.1-candidate';
export const LAWS=['RetainedCue','NoLoss','PersistentAccess'] as const;
export type Law=typeof LAWS[number];
export type Frame={at:number;instruction:number;visible:boolean;neutral:boolean;cue:number;opportunity:boolean;cancel:boolean;capacity:number;execution:boolean;receipt:boolean;report:number;privateBit:boolean};
const fields=['at','instruction','visible','neutral','cue','opportunity','cancel','capacity','execution','receipt','report','privateBit'];
export function validateFrames(input:readonly Frame[]){
 if(!Array.isArray(input)||Object.getPrototypeOf(input)!==Array.prototype||input.length!==8||Reflect.ownKeys(input).length!==9||Object.values(Object.getOwnPropertyDescriptors(input)).some(d=>!('value'in d)))throw Error('INTENTION_FRAMES');
 let report:number|undefined;
 for(const [i,x] of input.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('INTENTION_DATA');const ds=Object.getOwnPropertyDescriptors(x);
  if(Reflect.ownKeys(ds).length!==fields.length||fields.some(k=>!ds[k]||!('value'in ds[k])))throw Error('INTENTION_DATA');
  if(x.at!==i+1||![0,1,2].includes(x.instruction)||x.at!==1&&x.instruction!==0||x.neutral&&x.at!==2||![0,1,2].includes(x.cue)||![1,2].includes(x.capacity)||![0,1,2].includes(x.report))throw Error('INTENTION_DOMAIN');
  for(const k of ['visible','neutral','opportunity','cancel','execution','receipt','privateBit'] as const)if(typeof x[k]!=='boolean')throw Error('INTENTION_BOOL');
  if(report!==undefined&&report!==x.report)throw Error('INTENTION_RECEIPT_CONVENTION');report=x.report;
 }
}
const hex=(v:CanonicalValue)=>key(v),route=(n:number)=>old(395,[ACTOR,sid(1027,'action/intention/'+n)]);
const unit=(id:number,at:number,action:number):CanonicalSignificantAcquisition=>({id:BigInt(id),kind:'EventContinuant',acquiredAt:BigInt(at),units:[{key:u(id),views:[enc(u(action))],useProtection:false,outcomeSignificanceDirections:[]}]});
export function runIntention(law:Law,input:readonly Frame[],prefix=8){
 if(!LAWS.includes(law))throw Error('INTENTION_LAW');validateFrames(input);if(!Number.isInteger(prefix)||prefix<0||prefix>8)throw Error('INTENTION_PREFIX');
 let memory:readonly CanonicalSignificantAcquisition[]=[],goal:'Absent'|'Open'|'Fulfilled'|'Cancelled'|'Expired'='Absent',cue=0,opportunity=false;
 const dice=multisourceBase().get('task-reason-dice');
 const rows:Record<string,unknown>[]=[],world:Record<string,unknown>[]=[];
 for(const original of input.slice(0,prefix)){
  const at=original.at,before=goal,actualCue=law==='PersistentAccess'?1:cue;
  const recalled=recallCanonicalEventAcquisitions({cue:actualCue?{kind:'Present',key:u(actualCue)}:{kind:'Absent'},memory,graph:{keys:[],weights:[]},presentations:new Map(),now:BigInt(at),calibration:{beta:Q.of(1n,2n),scale:1000n,lambda:ONE,exponent:1,omegaB:Q.of(0n),omegaA:ONE,k:1}});
  const winner=recalled.recalled.find(a=>a.units.some(c=>key(c.key)===key(u(1))));
  // Decode only the surviving view, never the original input/history or model catalogue.
  const action=winner?decodeAction(winner.units.find(c=>key(c.key)===key(u(1)))!.views[0]):0;
  const candidates:CanonicalValue[]=goal==='Open'&&at<7&&opportunity&&action?[route(action)]:[];
  const raw=candidates.map(option=>old(402,[old(401,[option,TASK,u(1)]),{kind:'rational' as const,numerator:1n,denominator:1n},old(400,[map([])])]));
  const nuclei=compileReasonNuclei(raw,dice);
  const analysis:ReturnType<typeof analyzeOptions>|undefined=candidates.length?analyzeOptions(candidates.map(option=>{const n=rec(nuclei[0],407n),distribution=readDistribution(f(n,7n));return {key:option,distribution,reasonMass:absolute(expectation(distribution))};}),ONE,ONE):undefined;
  const intent:number=analysis?action:0,expression={at,goal:before,accessible:action,opportunity,raw:raw.map(hex),nuclei:nuclei.map(hex),mode:analysis?.mode??'None',intent};
  const success=intent>0&&original.execution,seen=intent>0&&original.receipt,received=seen?(original.report===0?success:original.report===1):null;
  world.push({at,intent,success,privateBit:original.privateBit});
  const observation={instruction:original.visible?original.instruction:0,neutral:original.visible&&original.neutral,cue:original.visible?original.cue:0,opportunity:original.visible&&original.opportunity,cancel:original.visible&&original.cancel,received};
  if(observation.instruction){goal='Open';memory=[...memory,unit(1,at,observation.instruction)];}
  if(observation.neutral)memory=[...memory,unit(2,at,0)];
  const retained=retainCanonicalSignificantChildren(memory,BigInt(at),{EventContinuant:law==='NoLoss'?2:original.capacity,Interoceptive:0});memory=retained.acquisitions;
  if(goal==='Open'){if(received===true)goal='Fulfilled';else if(observation.cancel)goal='Cancelled';else if(at>=7)goal='Expired';}
  cue=observation.cue;opportunity=observation.opportunity;
  rows.push({at,expression,recall:recalled.recalled.map(a=>Number(a.id)),cueDisposition:recalled.disposition,retained:memory.map(a=>({id:Number(a.id),at:Number(a.acquiredAt),views:a.units.flatMap(c=>c.views.map(b=>Array.from(b)))})),observation,goal,losses:retained.losses.map(l=>({acquisition:Number(l.acquisition),key:hex(l.unit)}))});
 }
 return {law,prefix,rows,world,state:{goal,cue,opportunity,memory:memory.map(a=>({id:Number(a.id),at:Number(a.acquiredAt),views:a.units.flatMap(c=>c.views.map(b=>Array.from(b)))}))}};
}
import {canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
function decodeAction(bytes:Uint8Array){const v=canonicalDecode(bytes,new RecordSchemaRegistry([]));if(typeof v==='boolean'||v.kind!=='unsigned'||![1n,2n].includes(v.value))throw Error('INTENTION_CONTENT');return Number(v.value);}
export const intentionSafeView=(s:ReturnType<typeof runIntention>)=>({rows:s.rows,state:s.state});
export const intentionBytes=(v:unknown)=>enc(text(JSON.stringify(v)));

export const intentionContent=()=>list([TASK,list([route(1),route(2)]),multisourceBase().get('task-reason-dice'),list([u(1),u(2),u(1000),u(1),u(1),u(0),u(1),u(1),u(7)])]);
