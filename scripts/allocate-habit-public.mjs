import fs from 'node:fs';import assert from 'node:assert/strict';
const path='docs/formal/HABIT_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const e=(...v)=>({enum:v}),l=(t,max)=>({list:t,min:0,max}),m=(a,b,max)=>({map:[a,b],min:0,max}),occ=['Occurrence','id:1155'];
const rows=[
['HabitProfile',[['Version','text'],['Candidate',e(1,2,3,4)],['Law',e(1,2,3)]]],
['HabitOriginal',[['At','i'],['Mode',e(1,2,3)],['Reward','bool'],['Visible','bool'],['Report',e(0,1,2)],['Cue','bool']]],
['HabitHistoryEntry',[occ,['At','i'],['Cue','bool'],['Reward','bool']]],
['HabitJournal',[['Entries',l('ref:819',16)]]],
['HabitHistoryState',[['Actors',m('id:1002','ref:820',1)]]],
['HabitExpectation',[['Value','bool'],['Source','id:1155']]],
['HabitBeliefState',[['Actors',m('id:1002','ref:822',1)]]],
['HabitSummary',[['FalseCue','unitQ'],['TrueCue','unitQ'],['Count','u']]],
['HabitSummaryState',[['Actors',m('id:1002','ref:824',1)]]],
['HabitAppraisal',[occ,['At','i'],['Cue','bool'],['Mode',e(1,2,3)],['Tendency','unitQ'],['Belief','ref:822',false],['TruthControl','bool',false]]],
['HabitOptions',[occ,['Appraisal','ref:826'],['Candidates',l('ref:395',2)]]],
['HabitRaw',[occ,['Options','ref:827'],['Signals',l('ref:402',1)]]],
['HabitReasons',[occ,['Raw','ref:828'],['Nuclei',l('ref:407',1)]]],
['HabitDecision',[occ,['At','i'],['Reasons','ref:829'],['Probabilities',l('ref:421',2)],['Mode',e(1,2,3)],['Draws',l('ref:411',3)],['Chosen','ref:395']]],
['HabitIntent',[occ,['Decision','ref:830']]],
['HabitExpression',[occ,['Intent','ref:831'],['Alignment',l('signedUnitQ',2)]]],
['HabitPlan',[occ,['Expression','ref:832'],['Action','id:1027']]],
['HabitAttempt',[occ,['Plan','ref:833']]],
['HabitOutcome',[occ,['Attempt','ref:834'],['Performed','bool'],['Reward','bool']]],
['HabitObservation',[occ,['At','i'],['Cue','bool'],['Performed','bool'],['Reward','bool',false]]],
['HabitHistoryUpdate',[occ,['Observation','ref:836'],['Applied','bool'],['Prior','ref:820'],['Next','ref:820']]],
['HabitBeliefUpdate',[occ,['Observation','ref:836'],['Applied','bool'],['Prior','ref:822',false],['Next','ref:822',false]]],
['HabitCacheUpdate',[occ,['Prior','ref:824',false],['Next','ref:824',false]]],
['HabitContent',[['Observer','id:1000'],['Character','id:1002'],['Task','ref:371'],['Options',l('ref:395',2)],['Dice','ref:437'],['Skill','unitQ'],['Identity','unitQ'],['BodyAdaptation','unitQ']]],
['HabitStage',[['Event','id:1001'],['Phase','u'],['Reads',l('ref:149',2)],['Writes',l('ref:149',1)],['Authority','id:1025']]],
];
fs.writeFileSync(path,JSON.stringify({version:'habit-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',namespace:1155,records:rows.map(([name,fields],i)=>({typeId:817+i,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
