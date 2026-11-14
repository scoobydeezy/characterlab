/** M110 plan df526263: fixed19-opportunity mapping, no seed/key search. */
import {expect} from 'vitest';
import {canonicalDecode,RecordSchemaRegistry} from '../../substrate/canonicalEncoding';
import {cognitiveSupportedSchemas} from '../../assembled/codecs';
import plan from '../../../docs/planning/BIO_COMPARISON_PLAN_REV3.json';
import {fixture as prior,create,live,refold,learned,standing,ablation,rec,f,uint,items,key,decode,enc,list,text,signed,q,readQ,ZERO,signedValue,snap,through,finish,exact,bytes,qualificationParts,fraction,Q,formationSignals,enumerate,type Run,type CanonicalValue} from './assembledBiographyHistory';
import {changeDefinition} from './assembledCharacter';
import {header as oldHeader,draws} from './assembledTimedComparison';
import {OPPORTUNITY_CONTEXT_RULES,OPPORTUNITY_CONTEXT_REGISTRY} from '../../assembled/model';
import {compileTimedComparison,timedComparisonValue,type TimedEntry} from '../../assembled/timedComparison';
import {comparisonAddress} from '../../assembled/comparison';
import {coupledRandomKeyValue} from '../../substrate/random';
import {dataIdentity as id} from '../../campaign2/canonicalData';
import {sid} from '../../assembled/skill';
import {BODY_SAMPLE} from '../../assembled/body';
import {IDENTITY_CONTEXT} from '../../assembled/identityEligibility';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {taskA} from './assembledDecisionRegimes';
export const times=Array.from({length:19},(_,i)=>BigInt(10+2*i));
export const learning=(i:number)=>i<=4||i>=6&&i<=17;
export function header(arm:number){
 expect([plan.first,plan.second]).toContain(arm);
 const template=compileTimedComparison(oldHeader(0)).bind(10n,{kind:'typedIdentifier',namespaceId:1135n,payload:{kind:'unsigned',value:10n}}).entries;
 const entries:TimedEntry[]=times.flatMap((at,index)=>template.map(e=>{
  const i=index+1,phase=i<=4?'early':i>=6&&i<=17?'contrary':'probe',label=i<=4?arm:i>=6&&i<=17?plan.contrarySeeds[i-6]:plan.probeSeed;
  return {at,purposeId:e.localRandomAddress.purposeId,subjectBindings:e.localRandomAddress.subjectBindings,comparisonDrawKey:{keyId:sid(10006,'M110/'+phase+'/'+label+'/'+i+'/'+key(e.localRandomAddress.purposeId)+'/'+key(list(e.localRandomAddress.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId]))))),comparisonRoleId:e.comparisonDrawKey.comparisonRoleId}};
 }));
 return timedComparisonValue(entries);
}
const cache=new Map<number,ReturnType<typeof prior>>();
export function fixture(arm:number){
 let value=cache.get(arm);if(value)return value;
 const b=prior(0),rows=items(decode(b.d.orderedInputs),'list'),template=rows.filter(v=>signedValue(items(v,'list')[0])===12n&&key(items(v,'list')[2])!==key(BODY_SAMPLE)),kinds=new Set(template.map(v=>key(items(v,'list')[2])));
 const keep=rows.filter(v=>!(signedValue(items(v,'list')[0])>=10n&&kinds.has(key(items(v,'list')[2]))));
 const generated=times.flatMap((at,index)=>template.map(v=>{
  const x=[...items(v,'list')];x[0]=signed(at);
  if(key(x[2])===key(IDENTITY_CONTEXT)){const p=items(x[3],'list');x[3]=list([p[0],q(learning(index+1)?1:0,1),q(0,1),false]);}
  if(index===18&&key(x[2])===key(PRIORITY_DISPLAY)){const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];if(key(t[0])===key(taskA))t[3]=list([q(5,6)]);return list(t);}))]);}
  return list(x);
 }));
 let s=b.s;for(const n of ['definition/task-a','definition/task-b'])s=changeDefinition(s,n,6n,signed(60));
 value={s:{...s,rulesVersion:OPPORTUNITY_CONTEXT_RULES,registrySchemaVersion:OPPORTUNITY_CONTEXT_REGISTRY},d:{...b.d,runSeed:new Uint8Array(32),orderedInputs:enc(list([header(arm),...keep,...generated]))}};cache.set(arm,value);return value;
}
/** Trace-list validation is elementwise in assembled/codecs and its predecessors.
 * Only a byte-identical, previously fully validated prefix can reuse validation.
 * Private byte copies prevent input mutation; decoded objects are never cached across frames.
 * Full state/output/trace/save equality remains a separate native gate at every settlement. */
export function createTraceReader(){
 const registry=new RecordSchemaRegistry(cognitiveSupportedSchemas());let prior:{bytes:Uint8Array;count:number}|undefined;
 return (bytes:Uint8Array):CanonicalValue=>{
  let value:CanonicalValue;
  if(!prior)value=decode(bytes);
  else {
   const parsed=canonicalDecode(bytes,registry),rows=items(parsed,'list');
   const prefix=rows.length>=prior.count?enc(list(rows.slice(0,prior.count))):undefined;
   if(prefix&&prefix.length===prior.bytes.length&&prefix.every((v,i)=>v===prior!.bytes[i])){
    decode(enc(list(rows.slice(prior.count))));value=parsed;
   }else value=decode(bytes);
  }
  const count=items(value,'list').length;prior={bytes:bytes.slice(),count};return value;
 };
}
/** Read-only views belong to ONE snapshot. The optional per-run reader retains
 * validated prefix bytes only; state already has a snapshot-keyed cache. */
export function snapshotView(frame:Pick<ReturnType<Run['snapshot']>,'outputs'|'trace'>,readTrace:(bytes:Uint8Array)=>CanonicalValue=decode){
 let output:CanonicalValue|undefined,trace:CanonicalValue|undefined;
 return {get outputs(){return output??=decode(frame.outputs);},get trace(){return trace??=readTrace(frame.trace);}};
}
export function actualDraws(run:Run,at:bigint,arm:number,decodedTrace?:CanonicalValue){
 const schedule=compileTimedComparison(header(arm)),rows=draws(run,at,decodedTrace);expect(rows.length).toBeGreaterThanOrEqual(2);
 return rows.map(d=>{const a=comparisonAddress(f(d,1n)),expected=schedule.bind(at,a.causalRootId).resolve(a);expect(expected).toBeDefined();expect(f(d,2n)).toEqual(coupledRandomKeyValue(expected!));return {local:key(f(d,1n)),effective:key(f(d,2n)),span:String(uint(f(d,4n))),result:String(uint(f(d,3n))),attempts:key(f(d,7n))};});
}
export {create,live,refold,learned,standing,ablation,rec,f,uint,items,key,decode,enc,list,text,signed,q,readQ,ZERO,signedValue,snap,through,finish,exact,bytes,qualificationParts,fraction,Q,formationSignals,enumerate};
export type {Run,CanonicalValue};
