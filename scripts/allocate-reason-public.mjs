import fs from 'node:fs';import assert from 'node:assert/strict';
const out='docs/formal/REASON_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(out));
const list=(type,max=6,min=0)=>({list:type,min,max}),enm=(...xs)=>({enum:xs}),set=(type,max=2)=>({set:type,min:0,max});
const rows=[
 [913,'ReasonProfile',[['Version','text'],['Law',enm(1,2,3,4,5)]]],
 [914,'ReasonContent',[['Observer','id:1000'],['Actor','id:1002'],['Contexts',list(list('ref:916'),32)],['Dice','ref:437'],['TrainingDice','ref:437']]],
 [915,'ReasonOriginal',[['At','i'],['Kind',enm(1,2)],['Context','u'],['Values',list('signedUnitQ',2,2)],['Visible','bool'],['Hidden','unitQ']]],
 [916,'ReasonDescription',[['Id','id:1027'],['Option','ref:395'],['Motive','id:1040'],['Referent','id:1002'],['Role',enm(1,2,3,4)],['Gain','signedUnitQ'],['Channels',set(enm(1,2))]]],
 [917,'ReasonObservation',[['Id','id:1115'],['Observer','id:1000'],['At','i'],['Channel',enm(1,2)],['Value','signedUnitQ']]],
 [918,'ReasonFrozen',[['Id','id:1160'],['Context','u'],['Samples',list('ref:917',2)],['Experience','ref:227',false]]],
 [919,'ReasonSignal',[['Description','ref:916'],['Strength','signedUnitQ'],['Basis','ref:400'],['Samples',list('ref:917',2)],['History','ref:414',false]]],
 [920,'ReasonRaw',[['Id','id:1160'],['Signals',list('ref:919')],['Rejected',list('ref:927')]]],
 [921,'ReasonCoverage',[['Description','ref:916'],['Magnitude','unitQ'],['Overlap','unitQ'],['Effective','unitQ'],['Sign',enm(1,2)],['Role',enm(1,2,3,4)]]],
 [922,'ReasonKey',[['Option','ref:395'],['Motive','id:1040'],['Referent','id:1002'],['Direction',enm(1,2)],['Description','id:1027',false]]],
 [923,'ReasonNucleus',[['Key','ref:922'],['Base','signedUnitQ'],['Standing','signedUnitQ'],['Situation','signedUnitQ'],['Context','signedUnitQ'],['Relevance','nonnegativeQ'],['Die','u'],['StandingModifier','i'],['SituationModifier','i'],['ContextModifier','i'],['Distribution','ref:424'],['Coverage',list('ref:921')]]],
 [924,'ReasonCompilation',[['Id','id:1160'],['Raw','ref:920'],['Nuclei',list('ref:923')],['Rejected',list('ref:928')]]],
 [925,'ReasonIdentityState',[['Histories',{map:['id:1002','ref:414'],min:0,max:1}]]],
 [926,'ReasonStage',[['Event','id:1001'],['Phase','u'],['Reads',list('ref:149',1)],['Writes',list('ref:149',1)],['Authority','id:1025']]],
 [927,'ReasonSourceRejection',[['Description','ref:916'],['Reason',enm(1,2,3)]]],
 [928,'ReasonGroupRejection',[['Key','ref:922'],['Reason',enm(1,2)],['Relevance','nonnegativeQ'],['Base','signedUnitQ'],['Coverage',list('ref:921')]]],
 [929,'ReasonIdentityApplication',[['Id','id:1160'],['Prior','ref:414'],['Next','ref:414'],['Qualification','ref:429']]]
];
fs.writeFileSync(out,JSON.stringify({version:'reason-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',date:'2026-09-21',namespace:1160,records:rows.map(([typeId,name,fields])=>({typeId,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\n\n## Joined REASON successor —2026-09-21\n\nREASON_PUBLIC_ALLOCATION_TABLE.json accepts913..929/schema1, namespace1160\nunder reason-public/0.1-candidate. Root925 owns the actual acquired identity history;\nnew source/nucleus records preserve governed semantic keys. Counters929/17 before verdict.\n');
