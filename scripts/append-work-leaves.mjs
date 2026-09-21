import fs from 'node:fs';
const p='docs/formal/WORKSPACE_CONTROL_ALLOCATION_TABLE.json',a=JSON.parse(fs.readFileSync(p));
if(a.records.length!==14)throw Error('already appended');
a.records.push({typeId:780,name:'WorkJournal',schemaVersion:1,fields:[{id:1,name:'Frames',type:{list:'ref:769',min:0,max:8},required:true}]},{typeId:781,name:'WorkCache',schemaVersion:1,fields:[{id:1,name:'Items',type:{list:{enum:[1,2,3]},min:0,max:3},required:true}]});
a.records[5].fields[0].type={map:['id:1002','ref:780'],min:0,max:1};a.records[6].fields[0].type={map:['id:1002','ref:781'],min:0,max:1};
fs.writeFileSync(p,JSON.stringify(a,null,2)+'\n');
