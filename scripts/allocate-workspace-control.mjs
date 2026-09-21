import fs from 'node:fs';
import assert from 'node:assert/strict';
const path='docs/formal/WORKSPACE_CONTROL_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const e=(...v)=>({enum:v}),l=(t,max)=>({list:t,min:0,max}),m=(a,b,max)=>({map:[a,b],min:0,max});
const rows=[
 ['WorkProfile',[['Version','text'],['Candidate',e(1,2,3,4,5,6)],['Capacity',e(0,1,2,3)],['Support','bool']]],
 ['WorkPhysicalCard',[['Item',e(1,2,3)],['Visible','bool'],['Priority',e(0,1,2,3)]]],
 ['WorkOriginal',[['At','i'],['Cards',l('ref:767',3)],['BoardVisible','bool'],['ReminderLamp','bool'],['PrivateTruth','bool']]],
 ['WorkSafeDisplay',[['Occurrence','id:1152'],['At','i'],['Items',l('ref:770',3)],['Reminder','bool']]],
 ['WorkAvailableItem',[['Item',e(1,2,3)],['Priority',e(0,1,2,3)]]],
 ['WorkObservationState',[['Journal',m('id:1002','ref:780',1)]]],
 ['WorkActiveState',[['Active',m('id:1002','ref:781',1)]]],
 ['WorkSelection',[['Occurrence','id:1152'],['At','i'],['Candidates',l('ref:770',3)],['Selected',l(e(1,2,3),3)],['Control',e(0,1,2)],['Prior',l(e(1,2,3),3)],['Reminder','bool'],['Statuses',l('ref:372',2)],['Access',l(e(1,2),2)],['Source','ref:769',false]]],
 ['WorkRaw',[['Occurrence','id:1152'],['Workspace','ref:773'],['Signals',l('ref:402',2)]]],
 ['WorkReasons',[['Occurrence','id:1152'],['Raw','ref:774'],['Nuclei',l('ref:407',2)]]],
 ['WorkDecision',[['Occurrence','id:1152'],['At','i'],['Reasons','ref:775'],['Probabilities',l('ref:421',2)],['Mode',e(1,2,3)],['Draws',l('ref:411',3)],['Scores',m('ref:395','i',2)],['Chosen','ref:395',false]]],
 ['WorkIntent',[['Occurrence','id:1152'],['Decision','ref:776']]],
 ['WorkContent',[['Observer','id:1000'],['Character','id:1002'],['Tasks',l('ref:371',2)],['Options',l('ref:395',2)],['Dice','ref:437'],['Arbitration','ref:440'],['Deadline','i']]],
 ['WorkStage',[['Event','id:1001'],['Phase','u'],['Reads',l('ref:149',4)],['Writes',l('ref:149',2)],['Authority','id:1025']]],
 ['WorkJournal',[['Frames',l('ref:769',8)]]],
 ['WorkCache',[['Items',l(e(1,2,3),3)]]],
];
fs.writeFileSync(path,JSON.stringify({version:'workspace-control-allocation/0.1-candidate',status:'ACCEPTED before implementation',date:'2026-09-21',namespace:1152,records:rows.map(([name,fields],i)=>({typeId:766+i,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
