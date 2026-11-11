/** assembled-decision-view/0.1-candidate. Closed projections, never a state owner.
 * Only character.ts exposes this over its own committed runtime records. */
import {list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataText as txt,invalidModel} from '../campaign2/canonicalData';
import {receivingRecord as rec} from './codecs';
import {PROTOCOL_OBSERVATION_VERSION,validatePermittedEvidenceRecordClosure} from '../observation/observation';
export const CONTEXT_DECISION_VIEW_VERSION='assembled-decision-view/0.2-candidate';
export const DECISION_VIEW_VERSION='assembled-decision-view/0.1-candidate';
const allowed=new Set([237n,371n,395n,399n,400n,401n,404n,424n,428n,203n,204n,205n]);
const fail=(message:string):never=>invalidModel('decision view: '+message);
const is=(v:CanonicalValue,t:bigint)=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t;
/** Closure applies also inside identifier payloads; an ID cannot smuggle a private tree. */
export function validateDecisionView(value:CanonicalValue):void {
 if(typeof value==='boolean')return;
 if(value.kind==='record'){
  if(!allowed.has(value.schema.typeId)||!(value.schema.schemaVersion===1n||[401n,404n].includes(value.schema.typeId)&&value.schema.schemaVersion===2n))fail('unsupported nested record');
  for(const v of value.fields.values())validateDecisionView(v);
 }else if(value.kind==='typedIdentifier')validateDecisionView(value.payload);
 else if(value.kind==='list'||value.kind==='set')value.items.forEach(validateDecisionView);
 else if(value.kind==='map')value.entries.forEach(([k,v])=>{validateDecisionView(k);validateDecisionView(v);});
}
function chosen(decision:CanonicalValue){
 const result=rec(f(rec(decision,409n),4n),419n);
 if(uint(f(result,1n))!==3n)fail('expression without chosen decision');
 return rec(f(result,2n),420n);
}
function expression(value:CanonicalValue){
 const e=rec(value,426n),intent=rec(f(e,2n),425n),d=rec(f(intent,2n),409n),data=chosen(d),context=rec(f(d,3n),408n),raw=rec(f(context,2n),403n);
 const reasons=items(f(raw,3n),'set').map(v=>{const r=rec(v,402n);return list([f(r,1n),f(r,2n),f(r,3n)]);});
 const nuclei=items(f(context,3n),'list').map(v=>{const n=rec(v,407n),roles=rec(f(n,2n),406n);return list([f(n,1n),list([f(roles,1n),f(roles,2n),f(roles,3n),...(n.schema.schemaVersion===2n?[f(roles,5n)]:[])]),f(n,4n),f(n,5n),f(n,6n),f(n,7n),...(n.schema.schemaVersion===2n?[f(n,8n)]:[])]);});
 const probabilities=items(f(data,2n),'list').map(v=>{const p=rec(v,421n);return list([f(p,1n),f(p,2n)]);});
 const channels=items(f(e,3n),'list').map(v=>{const c=rec(v,427n);return list([f(c,1n),f(c,2n)]);});
 return {e,intent,d,contextual:items(f(context,3n),'list').some(v=>rec(v,407n).schema.schemaVersion===2n),value:list([f(e,1n),f(data,1n),list(reasons),list(nuclei),list(probabilities),...([3n,4n,5n,6n,7n,8n].map(n=>f(data,n))),list(channels),f(e,4n)])};
}
const eventType=(name:string)=>key(typedIdentifier(1001,text('event/'+name)));
export function decisionHistoryView(outputs:readonly CanonicalValue[],traces:readonly CanonicalValue[]):CanonicalValue {
 const expressions=outputs.filter(v=>is(v,426n)).map(expression),byDecision=new Map<string,typeof expressions[number]>(),observed=new Map<string,CanonicalValue[]>();
 for(const e of expressions){const k=key(f(e.d,1n));if(byDecision.has(k))fail('ambiguous expression');byDecision.set(k,e);}
 // Index only the execution records, not other trace contributions sharing an event.
 const executions=new Map<string,ReturnType<typeof rec>[]>();
 const observations:ReturnType<typeof rec>[]=[];
 for(const value of traces){const t=rec(value,160n),event=rec(f(t,4n),130n),type=key(f(event,5n));
  if(type===eventType('protocol-execution')&&is(f(t,13n),433n)){
   if(uint(f(event,3n))!==110n)fail('execution phase');
   const k=key(f(event,1n));executions.set(k,[...(executions.get(k)??[]),t]);
  }
  if(type===eventType('protocol-observation'))observations.push(t);
 }
 const outputEvidence=new Set(outputs.filter(v=>is(v,203n)).map(key)),seen=new Set<string>();
 for(const t of observations){
  const event=rec(f(t,4n),130n),parents=items(f(event,8n),'list');
  if(uint(f(event,3n))!==120n||parents.length!==1||txt(f(t,6n))!==PROTOCOL_OBSERVATION_VERSION)fail('observation event binding');
  const matches=executions.get(key(parents[0]))??[];if(matches.length!==1)fail('missing or ambiguous execution parent');
  const parent=matches[0],pe=rec(f(parent,4n),130n);
  if(key(f(pe,2n))!==key(f(event,2n)))fail('execution instant');
  const execution=rec(f(parent,13n),433n),attempt=rec(f(execution,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n),d=rec(f(intent,2n),409n);
  const k=key(f(d,1n)),e=byDecision.get(k);
  if(!e||key(e.intent)!==key(intent)||key(f(d,2n))!==key(f(event,2n)))fail('foreign decision association');
  const evidence=rec(f(t,13n),203n);validatePermittedEvidenceRecordClosure(evidence);
  if(txt(f(evidence,11n))!==PROTOCOL_OBSERVATION_VERSION||key(f(evidence,5n))!==key(f(event,2n))||!outputEvidence.has(key(evidence)))fail('foreign observation');
  const ek=key(f(evidence,1n));if(seen.has(ek))fail('ambiguous observation');seen.add(ek);
  observed.set(k,[...(observed.get(k)??[]),evidence]);
 }
 const view=list([text((expressions.some(e=>e.contextual)?CONTEXT_DECISION_VIEW_VERSION:DECISION_VIEW_VERSION)+'/history'),list(expressions.map(e=>list([f(e.d,1n),f(e.d,2n),f(e.intent,1n),e.value,list(observed.get(key(f(e.d,1n)))??[])])))]);
 validateDecisionView(view);return view;
}
export function decisionPresentationView(outputs:readonly CanonicalValue[]):CanonicalValue {
 const rows:CanonicalValue[]=[];let contextual=false;
 for(const value of outputs.filter(v=>is(v,409n))){
  const decision=rec(value,409n),result=rec(f(decision,4n),419n);
  if(uint(f(result,1n))!==3n)continue;
  contextual ||= items(f(rec(f(decision,3n),408n),3n),'list').some(v=>rec(v,407n).schema.schemaVersion===2n);
  const data=chosen(decision);if(uint(f(data,8n))!==3n)continue;
  const faces=items(f(data,9n),'list').map(v=>{const d=rec(v,422n);return list([f(d,1n),f(d,2n),f(d,3n),f(d,4n),f(d,6n),f(d,7n),...(d.schema.schemaVersion===2n?[f(d,8n)]:[])]);});
  const tie=rec(f(data,10n),423n);
  rows.push(list([f(decision,1n),f(data,1n),list(faces),list(uint(f(tie,1n))===2n?[f(tie,4n)]:[])]));
 }
 const view=list([text((contextual?CONTEXT_DECISION_VIEW_VERSION:DECISION_VIEW_VERSION)+'/player'),list(rows)]);validateDecisionView(view);return view;
}
