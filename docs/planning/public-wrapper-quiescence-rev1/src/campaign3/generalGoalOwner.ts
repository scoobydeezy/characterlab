/** Exact canonical owner adapter for bodily-maintenance-goal-component/0.1-candidate.
 * Original command/deadline authentication is supplied by the runtime. */
import {canonicalEncode as enc,list,signed,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath,type StatePatch} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as uint,dataIdentity as identity,dataText as txt,dataKey as key,invalidModel as fail,type RecordValue} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalBindingContext} from './generalBindingProfile';
import {decodeGeneralAttention as decode} from './generalAttentionCodecs';
import {adoptMaintenanceGoal,settleMaintenanceGoal,settleMaintenanceGoalDeadline,readMaintenanceConcern,type MaintenanceGoal} from './bodilyMaintenanceGoal';
import {exact,atom} from './embodiedMath';
import {perceptualEventReferentIdValue} from '../semanticBinding/semanticCodecs';
import {prepareGoalAssessment,produceGoalAssessment,closeGoalAssessment} from './goalAssessmentProduction';
import type {GeneralSelectionSource} from './generalSelectionProduction';
import type {compileGeneralOutputSlots,GeneralOutputReceipt} from './generalOutputSlots';
import type {compileGeneralAccessors} from './generalAccessors';
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')return fail('GA goal instant');return v.value;};
type Instant=ReturnType<ReturnType<typeof compileGeneralOutputSlots>['beginInstant']>;
export function compileGeneralGoalOwner(definitions:ReadonlyMap<string,RecordValue>,accessors:ReadonlyMap<string,ReturnType<typeof compileGeneralAccessors>>){
 const context=generalBindingContext(),who=generalSubject(),spec=rec(f(definitions.get(key(d('goal')))!,4n),558n),desired=rec(f(spec,4n),556n),signal=txt(identity(f(spec,3n)).payload);
 const domain=rec(f(definitions.get(key(d('signal-domain-A')))!,4n),556n),domains=new Map([[signal,{lower:exact(f(domain,1n)),upper:exact(f(domain,2n))}]]);
 const path:StatePath={rootStateTypeId:633n,fieldId:1n,selectors:[{kind:'mapKey',key:who.character}]};
 function decodeLedger(value:CanonicalValue):MaintenanceGoal[]{return items(f(rec(value,560n),1n),'list').map(v=>{const row=rec(v,559n);if(key(f(row,1n))!==key(f(spec,1n)))fail('GA goal ledger spec');return {character:'holder',goal:'maintenance',signal,desired:{lower:exact(f(desired,1n)),upper:exact(f(desired,2n))},adoptedAt:time(f(row,2n)),activeFrom:time(f(spec,5n)),expiresAt:time(f(spec,6n)),status:(['Open','Withdrawn','Expired'] as const)[Number(uint(f(row,3n)))-1],changedAt:time(f(row,4n))};});}
 function owner(state:AuthoritativeState,stage:string,input:CanonicalValue,now:bigint){
  const source=rec(decode(enc(input),context),stage==='goal-command-owner'?677n:678n);if(key(f(source,1n))!==key(who.observer))fail('GA goal original observer');
  const command=stage==='goal-command-owner'?rec(f(source,2n),561n):undefined;
  if(key(command?f(command,1n):f(source,2n))!==key(f(spec,1n)))fail('GA goal original spec');
  const read=accessors.get(stage)!.construct(state,who.observer,now),prior=read.read('accessor/general-attention-goals-prior'),goals=decodeLedger(prior);
  let next:readonly MaintenanceGoal[];
  if(command){next=uint(f(command,2n))===1n?adoptMaintenanceGoal(goals,{character:'holder',goal:'maintenance',signal,desired:{lower:exact(f(desired,1n)),upper:exact(f(desired,2n))},adoptedAt:now,activeFrom:time(f(spec,5n)),expiresAt:time(f(spec,6n))},domains):settleMaintenanceGoal(goals,'holder','maintenance',now,'Withdraw',domains);}
  else {if(goals.length!==1||goals[0].adoptedAt!==time(f(source,3n)))fail('GA goal deadline adoption association');next=settleMaintenanceGoalDeadline(goals,'holder','maintenance',now,domains).state;}
  const value=decode(enc(r(560,[list(next.map(g=>r(559,[f(spec,1n),signed(g.adoptedAt),u(['Open','Withdrawn','Expired'].indexOf(g.status)+1),signed(g.changedAt)])))])),context);
  const patch:StatePatch={operations:key(value)===key(prior)?[]:[{kind:'set',path,expected:{presence:true,value:prior},newValue:value}]};
  return Object.freeze({patch:()=>structuredClone(patch),actualReadRecords:()=>read.actualReadRecords()});
 }
 return Object.freeze({command:(state:AuthoritativeState,input:CanonicalValue,now:bigint)=>owner(state,'goal-command-owner',input,now),deadline:(state:AuthoritativeState,input:CanonicalValue,now:bigint)=>owner(state,'goal-deadline-owner',input,now),
  validateLedger(value:CanonicalValue){const rows=decodeLedger(value);for(const g of rows)readMaintenanceConcern(rows,'holder','maintenance',g.changedAt,domains);},
  assess(state:AuthoritativeState,tx:Instant,source:GeneralSelectionSource,baselineReceipts:readonly GeneralOutputReceipt[],now:bigint){
   tx.assertActive();const samples=rec(decode(enc(source.samples),context),656n);if(key(f(samples,1n))!==key(who.observer)||time(f(samples,2n))!==now)fail('GA goal consequence source');
   const read=accessors.get('goal-outcome-assessment')!.construct(state,who.observer,now,undefined,!source.staged),observer=txt(who.observer.payload);
   const interval=(value:CanonicalValue)=>{const v=rec(value,462n);return {lower:exact(f(v,1n)),upper:exact(f(v,2n))};};
   const prepared=prepareGoalAssessment(source.staged??null,observer,now,()=>{
    const goals=decodeLedger(read.read('accessor/general-attention-goals-prior')),contextFile=source.tracking.perceived?.context,body=samples.fields.get(4n),afterCandidates:CanonicalValue[]=[],beforeCandidates:CanonicalValue[]=[];
    if(body){const b=rec(body,654n),channels=items(f(b,4n),'set').map(v=>rec(v,598n)).filter(v=>key(f(v,2n))===key(f(spec,3n))).map(v=>key(f(v,1n)));
     for(const v of items(f(b,3n),'list')){const sample=rec(v,(v as RecordValue).schema.typeId);if(sample.schema.typeId===461n&&channels.includes(key(f(sample,3n))))afterCandidates.push(f(sample,5n));}}
    for(const receipt of baselineReceipts)for(const bytes of tx.outputsFrom(receipt,['goal-baseline-recollection']).bytes){
     const publication=rec(decode(bytes,context),590n);if(key(f(publication,2n))!==key(who.character)||time(f(publication,3n))!==now)fail('GA goal baseline publication subject/time');
     const acquisition=rec(f(rec(f(publication,4n),589n),1n),587n);if(time(f(acquisition,3n))>=now)fail('GA goal baseline must precede consequence');
     const content=rec(f(acquisition,6n),548n);
     for(const childValue of items(f(content,1n),'list')){const child=rec(childValue,546n);if(key(f(child,1n))!==key(f(spec,3n)))continue;
      for(const viewValue of items(f(child,2n),'list')){const view=rec(viewValue,545n),companion=view.fields.get(2n);if(!companion||!contextFile)continue;
       const c=rec(companion,543n),panel=rec(f(c,3n),542n);if(key(f(c,2n))!==key(perceptualEventReferentIdValue(contextFile))||uint(f(panel,5n))!==1n)continue;
       const sample=rec(f(view,1n),461n);if(key(f(sample,2n))!==key(who.observer)||time(f(sample,4n))>=now)fail('GA goal baseline safe sample');beforeCandidates.push(f(sample,5n));
      }
     }
    }
    // The accepted bounded join requires exactly one retained Before companion.
    // Multiple views remain separate evidence; no integration or precision choice.
    return {state:goals,character:'holder',goal:'maintenance',signal,now,before:beforeCandidates.length===1?interval(beforeCandidates[0]):null,after:afterCandidates.length===1?interval(afterCandidates[0]):null,domains:new Map([[signal,{kind:'MetricInterval' as const,bounds:domains.get(signal)!}]])};
   });
   return Object.freeze({actualReadRecords:()=>read.actualReadRecords(),close:()=>closeGoalAssessment(prepared),produce(allocate:()=>bigint){
    const result=produceGoalAssessment(prepared,allocate);if(result.kind==='NoConsequence')return {outputs:[] as CanonicalValue[],carry:undefined};
    const a=result.assessment,q=a.result,assessment=q.assessment,causes=['Absent','Pending','Withdrawn','Expired','MissingEvidence'];
    const range=(x:{lower:ReturnType<typeof exact>;upper:ReturnType<typeof exact>})=>r(556,[atom(x.lower),atom(x.upper)]);
    const value=assessment.kind==='Unavailable'?r(562,[u(causes.indexOf(assessment.reason)+1)]):r(563,[range(assessment.before),range(assessment.after),u(['BelowGoal','WithinGoal','AboveGoal','AmbiguousPosition'].indexOf(assessment.beforePosition)+1),u(['BelowGoal','WithinGoal','AboveGoal','AmbiguousPosition'].indexOf(assessment.afterPosition)+1),u(['MovingCloser','MovingFarther','SameDistance','IndeterminateRelation'].indexOf(assessment.relation)+1),u(['Attainment','Violation','NoBoundaryChange','IndeterminateBoundary'].indexOf(assessment.boundary)+1)]);
    const qualification=q.kind==='Qualifies'?r(564,[u(q.direction==='MovingCloser'?1:2)]):q.kind==='DoesNotQualify'?r(565,[u(q.reason==='SameDistance'?1:2)]):assessment.kind==='Unavailable'?r(567,[u(causes.indexOf(assessment.reason)+1)]):r(566,[u(1)]);
    const occurrence=typedIdentifier(1146,u(a.assessmentId)),consequence=typedIdentifier(1106,u(a.consequence)),goal=f(spec,2n),version=text(a.transformationVersion);
    const output=decode(enc(r(568,[occurrence,who.observer,goal,consequence,signed(now),version,value,qualification])),context),carry=decode(enc(r(569,[occurrence,who.observer,goal,consequence,signed(now),qualification,version])),context);
    return {outputs:[output],carry};
   }});
  },
 });
}
