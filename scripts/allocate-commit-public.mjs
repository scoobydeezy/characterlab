import fs from 'node:fs';import assert from 'node:assert/strict';const path='docs/formal/COMMIT_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const list=(type,max=2,min=0)=>({list:type,min,max}),enm=(...xs)=>({enum:xs});
const rows=[
 [952,'CommitProfile',[['Version','text'],['Law',enm(1,2,3,4)]]],
 [953,'CommitContent',[['Actor','id:1002'],['Observers',list('id:1000',2,2)],['Tasks',list('ref:371',3,3)],['Dice','ref:437'],['TrainingDice','ref:437']]],
 [954,'CommitOriginal',[['At','i'],['Training','bool'],['Command',enm(0,1,2,3)],['Communicate',enm(0,1,2)],['Recipients',{set:enm(1,2),min:0,max:2}],['Hidden','unitQ']]],
 [955,'CommitInstance',[['Task','ref:371'],['Version','u'],['Status',enm(1,2)],['Cause',enm(0,1,2)]]],
 [956,'CommitState',[['Instances',{map:['ref:371','ref:955'],min:0,max:2}]]],
 [957,'CommitTransition',[['Id','id:1162'],['Command',enm(1,2,3)],['Before',list('ref:955')],['After',list('ref:955')]]],
 [958,'CommitIdentityState',[['Histories',{map:['id:1002','ref:414'],min:0,max:1}]]],
 [959,'CommitProbe',[['Id','id:1162'],['At','i'],['Instances',list('ref:955')],['Identity','ref:414'],['Raw','ref:403'],['Reasons','ref:408']]],
 [960,'CommitIdentityApplication',[['Id','id:1162'],['Prior','ref:414'],['Next','ref:414'],['Qualification','ref:429']]],
 [961,'CommitCommunicationTruth',[['Id','id:1162'],['At','i'],['Task','ref:371'],['Status',enm(0,1,2)]]],
 [962,'CommitObservation',[['Id','id:1162'],['Observer','id:1000'],['At','i'],['Task','ref:371'],['Status',enm(0,1,2)]]],
 [963,'CommitEvidence',[['Id','id:1162'],['Observation','ref:962']]],
 [964,'CommitKnownClaim',[['Task','ref:371'],['Status',enm(0,1,2)],['Source','id:1162']]],
 [965,'CommitSocialState',[['Knowledge',{map:['ref:966','ref:967'],min:0,max:4}]]],
 [966,'CommitSocialKey',[['Observer','id:1000'],['Task','ref:371']]],
 [967,'CommitKnowledge',[['Status',enm(0,1,2)],['Source','id:1162']]],
 [968,'CommitSocialProbe',[['Id','id:1162'],['At','i'],['Observer','id:1000'],['Claims',list('ref:964')]]],
 [969,'CommitStage',[['Event','id:1001'],['Phase','u'],['Reads',list('ref:149',3)],['Writes',list('ref:149',2)],['Authority','id:1025']]],
 [970,'CommitSocialApplication',[['Id','id:1162'],['Observer','id:1000'],['Evidence','ref:963'],['Next','ref:967'],['Prior','ref:967',false]]]
];fs.writeFileSync(path,JSON.stringify({version:'commit-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',date:'2026-09-21',namespace:1162,records:rows.map(([typeId,name,fields])=>({typeId,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\n\n## Public COMMIT successor —2026-09-21\nCOMMIT_PUBLIC_ALLOCATION_TABLE.json accepts952..970/schema1,namespace1162.\nSeparate lifecycle956,identity958 and social965 owners. Counters970/19 before verdict.\n');
