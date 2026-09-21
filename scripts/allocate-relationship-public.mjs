import fs from 'node:fs';import assert from 'node:assert/strict';
const path='docs/formal/RELATIONSHIP_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const e=(...v)=>({enum:v}),l=(t,max)=>({list:t,min:0,max}),m=(a,b,max)=>({map:[a,b],min:0,max}),occ=['Occurrence','id:1156'];
const rows=[
['RelationshipProfile',[['Version','text'],['Candidate',e(1,2,3,4,5)],['Law',e(1,2)],['Reverse','bool']]],
['RelationshipOriginal',[['At','i'],['Kind',e(0,1,2,3)],['Participants',e(0,1,2,3)],['AccessA','bool'],['AccessB','bool'],['Display',e(0,1,2,3)],['Claim',e(0,1,2)],['ContactA','bool'],['ContactB','bool']]],
['RelationshipTruth',[occ,['At','i'],['Kind',e(0,1,2,3)],['Participants',e(0,1,2,3)]]],
['RelationshipObservation',[occ,['Observer','id:1000'],['LocalTarget','id:1002'],['At','i'],['Admitted','bool'],['Participant','bool'],['Kind',e(0,1,2,3)],['Claim','bool',false]]],
['RelationshipEntry',[occ,['At','i'],['Kind',e(1,2)]]],
['RelationshipJournal',[['Entries',l('ref:846',12)]]],
['RelationshipHistoryState',[['Dyads',m('ref:808','ref:847',2)]]],
['RelationshipPersonEstimate',[['Value','bool'],['Source','id:1156']]],
['RelationshipPersonState',[['Dyads',m('ref:808','ref:849',2)]]],
['RelationshipSummary',[['CooperationCount','u'],['Rupture','bool']]],
['RelationshipSummaryState',[['Dyads',m('ref:808','ref:851',2)]]],
['RelationshipAppraisal',[occ,['At','i'],['Observer','id:1000'],['LocalTarget','id:1002'],['Contact','bool'],['Summary','ref:851'],['Comfort','bool'],['Caution','bool'],['MissingContact','bool'],['Person','ref:849',false]]],
['RelationshipRaw',[occ,['Appraisal','ref:853'],['Signals',l('ref:402',4)]]],
['RelationshipReasons',[occ,['Raw','ref:854'],['Nuclei',l('ref:407',2)]]],
['RelationshipResponse',[occ,['At','i'],['Observer','id:1000'],['LocalTarget','id:1002'],['Reasons','ref:855'],['Probabilities',l('ref:421',2)],['Mode',e(1,2,3)],['Draws',l('ref:411',3)],['Chosen','ref:395']]],
['RelationshipHistoryUpdate',[occ,['Observation','ref:845'],['Applied','bool'],['Prior','ref:847'],['Next','ref:847']]],
['RelationshipPersonUpdate',[occ,['Observation','ref:845'],['Applied','bool'],['Prior','ref:849',false],['Next','ref:849',false]]],
['RelationshipCacheUpdate',[occ,['Observer','id:1000'],['Prior','ref:851',false],['Next','ref:851',false]]],
['RelationshipView',[['Observer','id:1000'],['LocalTarget','id:1002'],['Observations',l('ref:845',12)],['Appraisals',l('ref:853',12)],['Responses',l('ref:856',12)],['Journal','ref:847'],['Person','ref:849',false]]],
['RelationshipContent',[['Observers',l('id:1000',2)],['Actors',l('id:1002',2)],['Targets',l('id:1002',2)],['Tasks',l('ref:371',4)],['Options',l('ref:395',4)],['Dice','ref:437'],['Identity','unitQ'],['Body','unitQ'],['Skill','unitQ'],['ProbeRoots',l('id:1038',48)]]],
['RelationshipStage',[['Event','id:1001'],['Phase','u'],['Reads',l('ref:149',3)],['Writes',l('ref:149',2)],['Authority','id:1025']]],
];
fs.writeFileSync(path,JSON.stringify({version:'relationship-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',namespace:1156,records:rows.map(([name,fields],i)=>({typeId:842+i,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
