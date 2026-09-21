// Accepted successor allocation; one-shot and deliberately before runtime construction.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const path='docs/formal/AFFECT_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const e=(...enumValues)=>({enum:enumValues}),l=(type,max)=>({list:type,min:0,max}),m=(a,b,max)=>({map:[a,b],min:0,max});
const rows=[
 ['AffectProfile',[['Version','text'],['Candidate',e(1,2,3)],['ControlLaw',e(1,2)],['LearningLaw',e(1,2,3)],['Feedback','bool'],['Severity','unitQ'],['Obligation','nonnegativeQ'],['Safety','nonnegativeQ'],['ExecutionAllowed','bool']]],
 ['AffectPhysicalFrame',[['Glyph',e(0,1)],['Stage',e(1,2,3)],['PanelVisible','bool'],['Permitted','bool'],['ActionVisible','bool'],['Action',e(1,2)],['OutcomeVisible','bool'],['Opportunity','bool'],['MonitoringComplete','bool'],['ReportedOutcome','bool'],['TruthOutcome','bool'],['TruthAction',e(1,2)],['ReserveVisible','bool'],['DisplayedReserve','unitQ'],['TruthReserve','unitQ'],['Catalogue',e(0,1,2)]]],
 ['AffectOriginal',[['At','i'],['Frame','ref:748',false]]],
 ['AffectSafeObservation',[['Observation','id:1115'],['At','i'],['PanelStage',e(0,1,2,3)],['Glyph',e(0,1)],['ObservedAction',e(0,1,2)],['Opportunity','bool'],['MonitoringComplete','bool'],['ReportedOutcome','bool'],['Catalogue',e(0,1,2)],['Reserve','unitQ',false],['Context','ref:213',false]]],
 ['AffectFrozenObservation',[['Occurrence','id:1151'],['Observation','ref:750'],['Experience','ref:227']]],
 ['AffectConditionalEvidence',[['Occurrence','id:1151'],['Current','ref:751'],['EpisodeBasis',l('ref:751',3)],['Sample','ref:737',false]]],
 ['AffectBeliefState',[['Estimates',m('ref:765','ref:739',3)]]],
 ['AffectAppraisal',[['Occurrence','id:1151'],['At','i'],['Beliefs',m('ref:765','ref:739',3)],['Severity','unitQ'],['RawCoordinates',l('unitQ',2)],['Coordinates',l('unitQ',2)],['Context','ref:750',false],['Likelihood','unitQ',false],['Vulnerability','unitQ',false],['Control','unitQ',false],['PreviousAffect','id:1151',false],['PreviousAt','i',false],['FeedbackOperand','unitQ',false],['Efficacy','unitQ',false]]],
 ['AffectRawReasons',[['Occurrence','id:1151'],['Appraisal','ref:754'],['Signals',l('ref:402',3)]]],
 ['AffectReasons',[['Occurrence','id:1151'],['Raw','ref:755'],['Nuclei',l('ref:407',2)]]],
 ['AffectDecision',[['Occurrence','id:1151'],['At','i'],['Reasons','ref:756'],['Probabilities',l('ref:421',2)],['Mode',e(1,2,3)],['Draws',l('ref:411',3)],['Scores',m('ref:395','i',2)],['Chosen','ref:395',false]]],
 ['AffectIntent',[['Occurrence','id:1151'],['Decision','ref:757']]],
 ['AffectExpression',[['Occurrence','id:1151'],['Intent','ref:758'],['Alignments',l('signedUnitQ',2)]]],
 ['AffectExecutionPlan',[['Occurrence','id:1151'],['Expression','ref:759'],['Action','id:1027',false]]],
 ['AffectExecutionAttempt',[['Occurrence','id:1151'],['Plan','ref:760']]],
 ['AffectPhysicalOutcome',[['Occurrence','id:1151'],['Attempt','ref:761'],['Succeeded','bool'],['Action','id:1027',false]]],
 ['AffectStageRegistration',[['EventType','id:1001'],['Phase','u'],['Reads',l('ref:149',3)],['Writes',l('ref:149',3)],['Authority','id:1025']]],
 ['AffectContent',[['Observer','id:1000'],['Character','id:1002'],['Propositions',l('id:1027',3)],['Tasks',l('ref:371',2)],['Options',l('ref:395',2)],['Dice','ref:437'],['Arbitration','ref:440']]],
 ['AffectBeliefKey',[['Character','id:1002'],['Proposition','id:1027']]],
];
fs.writeFileSync(path,JSON.stringify({version:'affect-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',date:'2026-09-21',namespace:1151,records:rows.map(([name,fields],i)=>({typeId:747+i,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
