import fs from 'node:fs';import assert from 'node:assert/strict';
const path='docs/formal/SOCIAL_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const e=(...v)=>({enum:v}),l=(t,max)=>({list:t,min:0,max}),m=(a,b,max)=>({map:[a,b],min:0,max}),s=(t,max)=>({set:t,min:0,max});
const rows=[
 ['SocialProfile',[['Version','text'],['PrivateCommitment','bool'],['LearningLaw',e(1,2,3)],['Control',e(1,2,3,4)],['ReverseOrder','bool']]],
 ['SocialOriginal',[['At','i'],['Kind',e(1,2)],['Mode',e(0,1,2,3,4)],['Receipt',e(0,1,2,3,4,5,6,7,8)],['AccessA','bool'],['AccessB','bool'],['Delivered','bool']]],
 ['SocialTargetTruth',[['Occurrence','id:1154'],['At','i'],['Committed','bool'],['Delivered','bool'],['Claim','bool',false]]],
 ['SocialEvidenceKey',[['Kind',e(1,2)],['Receipt',e(1,2,3,4,5,6,7,8)]]],
 ['SocialObservation',[['Occurrence','id:1154'],['Observer','id:1000'],['LocalTarget','id:1002'],['At','i'],['Kind',e(1,2)],['Receipt',e(0,1,2,3,4,5,6,7,8)],['Permitted','bool'],['Delivered','bool',false],['Claim','bool',false]]],
 ['SocialPersonKey',[['Holder','id:1002'],['LocalTarget','id:1002']]],
 ['SocialEstimate',[['Mean','unitQ'],['Count','u'],['Support',s('ref:806',8)]]],
 ['SocialPersonState',[['Models',m('ref:808','ref:809',2)]]],
 ['SocialProbe',[['Occurrence','id:1154'],['At','i'],['Observer','id:1000'],['LocalTarget','id:1002'],['Classification',e(0,1,2,3)],['Belief','ref:809',false]]],
 ['SocialEvidence',[['Occurrence','id:1154'],['Observation','ref:807'],['Source','ref:806',false],['Value','bool',false]]],
 ['SocialUpdate',[['Occurrence','id:1154'],['Observer','id:1000'],['Evidence','ref:812'],['Applied','bool'],['Prior','ref:809',false],['Next','ref:809',false]]],
 ['SocialObserverView',[['Observer','id:1000'],['LocalTarget','id:1002'],['Observations',l('ref:807',8)],['Probes',l('ref:811',8)],['Belief','ref:809',false]]],
 ['SocialContent',[['Observers',l('id:1000',2)],['Characters',l('id:1002',2)],['LocalTargets',l('id:1002',2)],['TargetTask','ref:371']]],
 ['SocialStage',[['Event','id:1001'],['Phase','u'],['Reads',l('ref:149',3)],['Writes',l('ref:149',2)],['Authority','id:1025']]],
];
fs.writeFileSync(path,JSON.stringify({version:'social-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',namespace:1154,records:rows.map(([name,fields],i)=>({typeId:803+i,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
