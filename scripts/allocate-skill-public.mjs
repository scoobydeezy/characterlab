import fs from 'node:fs';import assert from 'node:assert/strict';
const path='docs/formal/SKILL_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const e=(...v)=>({enum:v}),l=(t,max)=>({list:t,min:0,max}),m=(a,b,max)=>({map:[a,b],min:0,max}),s=(t,max)=>({set:t,min:0,max});
const rows=[
 ['SkillProfile',[['Version','text'],['InitialCompetence','unitQ'],['PracticeLaw',e(1,2,3)],['ExecutionLaw',e(1,2,3,4)],['PermanentImpairment','bool'],['BeliefLaw',e(1,2,3)]]],
 ['SkillOriginal',[['At','i'],['Impairment','unitQ'],['Difficulty','unitQ'],['Permitted','bool'],['Practice','bool'],['Visible','bool'],['Report',e(0,1,2)]]],
 ['SkillValue',[['Competence','unitQ'],['PracticeCount','u']]],
 ['SkillState',[['Skills',m('id:1002','ref:784',1)]]],
 ['SkillBeliefValue',[['Mean','unitQ'],['Count','u'],['Support',s('id:1153',8)]]],
 ['SkillBeliefState',[['Beliefs',m('id:1002','ref:786',1)]]],
 ['SkillAppraisal',[['Occurrence','id:1153'],['At','i'],['Belief','ref:786',false]]],
 ['SkillRaw',[['Occurrence','id:1153'],['Appraisal','ref:788'],['Signals',l('ref:402',1)]]],
 ['SkillReasons',[['Occurrence','id:1153'],['Raw','ref:789'],['Nuclei',l('ref:407',1)]]],
 ['SkillDecision',[['Occurrence','id:1153'],['Reasons','ref:790'],['Probabilities',l('ref:421',1)],['Chosen','ref:395',false]]],
 ['SkillIntent',[['Occurrence','id:1153'],['Decision','ref:791']]],
 ['SkillExpression',[['Occurrence','id:1153'],['Intent','ref:792'],['Alignments',l('signedUnitQ',1)]]],
 ['SkillPlan',[['Occurrence','id:1153'],['Expression','ref:793'],['Action','id:1027',false]]],
 ['SkillAttempt',[['Occurrence','id:1153'],['Plan','ref:794']]],
 ['SkillOutcome',[['Occurrence','id:1153'],['Attempt','ref:795'],['Competence','ref:784'],['Impairment','unitQ'],['Difficulty','unitQ'],['Engaged','bool'],['Succeeded','bool'],['Practice','bool'],['Effective','unitQ']]],
 ['SkillObservation',[['Occurrence','id:1153'],['At','i'],['ObservedOpportunity','bool'],['ReportedSuccess','bool',false]]],
 ['SkillPractice',[['Occurrence','id:1153'],['Attempt','id:1153'],['Engaged','bool'],['Practice','bool'],['Impairment','unitQ']]],
 ['SkillAdaptation',[['Occurrence','id:1153'],['Practice','ref:798'],['Prior','ref:784'],['Next','ref:784'],['Applied','bool']]],
 ['SkillLearning',[['Occurrence','id:1153'],['Observation','ref:797'],['Applied','bool'],['Prior','ref:786',false],['Next','ref:786',false]]],
 ['SkillContent',[['Observer','id:1000'],['Character','id:1002'],['Task','ref:371'],['Option','ref:395'],['Dice','ref:437']]],
 ['SkillStage',[['Event','id:1001'],['Phase','u'],['Reads',l('ref:149',2)],['Writes',l('ref:149',1)],['Authority','id:1025']]],
];
fs.writeFileSync(path,JSON.stringify({version:'skill-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',namespace:1153,records:rows.map(([name,fields],i)=>({typeId:782+i,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
