import fs from 'node:fs';import assert from 'node:assert/strict';
const path='docs/formal/DECISION_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const list=(type,max=8,min=0)=>({list:type,min,max}),enm=(...xs)=>({enum:xs});
const rows=[
 [930,'DecisionProfile',[['Version','text'],['Law',enm(1,2,3,4,5,6)]]],
 [931,'DecisionContent',[['Observer','id:1000'],['Actor','id:1002'],['Dice','ref:437'],['Arbitration','ref:440']]],
 [932,'DecisionOriginal',[['At','i'],['Regime',enm(1,2,3)],['Permitted','bool'],['OutcomeVisible','bool'],['Hidden','unitQ'],['CurrentVisible','bool']]],
 [933,'DecisionObservation',[['Id','id:1115'],['Observer','id:1000'],['At','i'],['Option',enm(1,2)],['Value','nonnegativeQ']]],
 [934,'DecisionFrozen',[['Id','id:1161'],['Samples',list('ref:933',2)],['Experience','ref:227',false]]],
 [935,'DecisionResolution',[['Id','id:1161'],['At','i'],['Context','ref:408'],['Law',enm(1,2,3,4,5,6)],['Chosen','ref:395'],['Probabilities',list('ref:421',2,2)],['Margin','unitQ'],['Contest','unitQ'],['ConflictMass','nonnegativeQ'],['Stake','unitQ'],['Authorship','unitQ'],['Mode',enm(1,2,3)],['ReasonDraws',list('ref:422',2)],['Tie','ref:423'],['OpaqueDraw','ref:411',false]]],
 [936,'DecisionIntent',[['Id','id:1161'],['Resolution','ref:935']]],
 [937,'DecisionExpression',[['Id','id:1161'],['Intent','ref:936'],['Channels',list('ref:427',1)]]],
 [938,'DecisionPlan',[['Id','id:1161'],['Intent','ref:936'],['Count',enm(1)]]],
 [939,'DecisionAttempt',[['Id','id:1161'],['Plan','ref:938']]],
 [940,'DecisionOutcome',[['Id','id:1161'],['Attempt','ref:939'],['Completed','bool']]],
 [941,'DecisionConsequenceObservation',[['Id','id:1115'],['Observer','id:1000'],['At','i'],['Completed','bool']]],
 [942,'DecisionStagedConsequence',[['Id','id:1161'],['Expression','ref:937'],['Observation','ref:941',false],['Experience','ref:227',false]]],
 [943,'DecisionSafeIntent',[['Id','id:1161'],['Chosen','ref:395']]],
 [944,'DecisionSafeExpression',[['Id','id:1161'],['Intent','ref:943'],['Context','ref:408'],['Probabilities',list('ref:421',2,2)],['Margin','unitQ'],['Contest','unitQ'],['ConflictMass','nonnegativeQ'],['Stake','unitQ'],['Authorship','unitQ'],['Mode',enm(1,2,3)],['Channels',list('ref:427',1)]]],
 [945,'DecisionEpisode',[['Id','id:1161'],['Expression','ref:944',false],['Observation','ref:941',false],['Experience','ref:227',false]]],
 [946,'DecisionHistoryState',[['Histories',{map:['id:1002','ref:951'],min:0,max:1}]]],
 [947,'DecisionStage',[['Event','id:1001'],['Phase','u'],['Reads',list('ref:149',1)],['Writes',list('ref:149',1)],['Authority','id:1025']]],
 [948,'DecisionHistoryApplication',[['Id','id:1161'],['Prior','ref:951'],['Next','ref:951'],['Episode','ref:945']]],
 [949,'DecisionPlayerDisplay',[['Chosen','ref:395'],['Faces',list('ref:950',2)],['TieWinner','ref:395',false]]],
 [950,'DecisionPlayerFace',[['Reason','ref:404'],['Die','u'],['Standing','i'],['Situation','i'],['Face','u'],['Contribution','i']]],
 [951,'DecisionHistory',[['Episodes',list('ref:945')]]]
];
fs.writeFileSync(path,JSON.stringify({version:'decision-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',date:'2026-09-21',namespace:1161,records:rows.map(([typeId,name,fields])=>({typeId,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\n\n## Public DECISION successor —2026-09-21\n\nDECISION_PUBLIC_ALLOCATION_TABLE.json accepts930..951/schema1,namespace1161\nunder decision-public/0.1-candidate. Root946 owns safe historical episodes.\nCounters951/22 before verdict. Existing contracts and allocations remain unchanged.\n');
