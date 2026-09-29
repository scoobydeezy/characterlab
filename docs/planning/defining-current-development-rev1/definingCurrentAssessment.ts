/** defining-native-current-assessment/0.1-candidate. Read-only current judgment.
 * The runtime authenticates the actual historical receipt carried from38 to43.
 * No event content is recovered from a current report or from hidden world truth.
 */
import {canonicalEncode as enc,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import type {AuthoritativeState,ActualReadRecord} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {generalSubject,generalId as id,generalRecord as gr} from './generalBindingProfile';
import {definingLifecyclePath} from './definingLifecycleState';
import {decodeDefiningCurrent as decode,definingCurrentRecord as r} from './definingCurrentCodecs';
import {qualifyGoalOutcome} from './goalOutcomeQualification';
import type {MaintenanceGoal} from './bodilyMaintenanceGoal';
function fail(why:string):never{throw Error('DEFINING_CURRENT_ASSESSMENT: '+why);}
const time=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='signed'?v.value:fail('time');
const rational=(v:CanonicalValue)=>typeof v!=='boolean'&&v.kind==='rational'?Q.of(v.numerator,v.denominator):fail('rational');
const interval=(v:CanonicalValue)=>{const value=rec(v,556n);return {lower:rational(f(value,1n)),upper:rational(f(value,2n))};};
export function prepareDefiningCurrentAssessment(state:AuthoritativeState,historical:CanonicalValue,now:bigint,occurrence:bigint){
 if(now!==43n)fail('current clock');const who=generalSubject(),h=rec(decode(enc(historical)),1489n);
 if(time(f(h,3n))!==38n||key(f(h,2n))!==key(who.observer))fail('historical receipt');
 const reads:ActualReadRecord[]=([1485,1486] as const).map(root=>{const path=definingLifecyclePath(root),value=state.read(path);if(!value.presence)fail('missing owner');return {accessorId:id(1028,'accessor/defining-current/'+root),path,presence:true,value:value.value,derivedSources:[]};});
 const g=rec(reads[0].value!,1485n),report=rec(reads[1].value!,1486n);
 if(f(g,2n)!==true||time(f(g,3n))!==37n||key(g)!==key(f(h,4n)))fail('interpretation goal binding');
 const reportKind=uint(f(report,1n));if(![1n,2n].includes(reportKind)||time(f(report,2n))!==now)fail('report before assessment');
 const goals:MaintenanceGoal[]=uint(f(g,1n))===0n?[]:[{character:'holder',goal:'defining-interpretation',signal:'A',desired:interval(f(g,6n)),adoptedAt:37n,activeFrom:time(f(g,4n)),expiresAt:time(f(g,5n)),status:'Open',changedAt:37n}];
 const result=qualifyGoalOutcome({state:goals,character:'holder',goal:'defining-interpretation',signal:'A',now,before:interval(f(h,5n)),after:reportKind===1n?null:interval(f(report,3n)),domains:new Map([['A',{kind:'MetricInterval',bounds:{lower:Q.of(0n),upper:Q.of(100n)}}]])});
 const qualification=result.kind==='Qualifies'?gr(564,[u(result.direction==='MovingCloser'?1:2)]):result.kind==='DoesNotQualify'?gr(565,[u(result.reason==='SameDistance'?1:2)]):result.assessment.kind==='Unavailable'?gr(567,[u(['Absent','Pending','Withdrawn','Expired','MissingEvidence'].indexOf(result.assessment.reason)+1)]):gr(566,[u(1)]);
 return {output:r(1490,[typedIdentifier(1146,u(occurrence)),who.observer,signed(now),g,h,report,qualification]),reads,result};
}
