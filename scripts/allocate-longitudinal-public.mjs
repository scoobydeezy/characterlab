import fs from 'node:fs';import assert from 'node:assert/strict';
const path='docs/formal/LONGITUDINAL_PUBLIC_ALLOCATION_TABLE.json';assert(!fs.existsSync(path));
const e=(...v)=>({enum:v}),l=(t,max)=>({list:t,min:0,max}),m=(a,b)=>({map:[a,b],min:0,max:1}),occ=['Occurrence','id:1157'],value={oneOf:['ref:414','ref:784','ref:851','ref:866','ref:869','ref:874']};
const rows=[
['LongitudinalProfile',[['Version','text'],['Representation',e(1,2,3,4)],['Family',e(0,1,2,3,4)],['Retention',e(1,2)],['Rust',e(0,1)],['Law',e(1,2)],['Standing','bool']]],
['LongitudinalOriginal',[['At','i'],['Kind',e(0,1,2,3,4)],['Physical','bool'],['Access','bool'],['Display',e(0,1,2)],['Participant','bool'],['Impairment','unitQ'],['Difficulty','unitQ'],['Interference','bool']]],
['LongitudinalEpisode',[occ,['At','i'],['Kind',e(2,3,4)],['Value','bool']]],
['LongitudinalJournal',[['Entries',l('ref:865',16)]]],
['LongitudinalEpisodeState',[['Actors',m('id:1002','ref:866')]]],
['LongitudinalRelationshipState',[['Actors',m('id:1002','ref:851')]]],
['LongitudinalPerson',[['Claim','bool']]],
['LongitudinalPersonState',[['Actors',m('id:1002','ref:869')]]],
['LongitudinalSkillState',[['Actors',m('id:1002','ref:784')]]],
['LongitudinalIdentityState',[['Actors',m('id:1002','ref:414')]]],
['LongitudinalDetailState',[['Actors',m('id:1002','ref:866')]]],
['LongitudinalSharedSlot',[['Family',e(0,1,2,3)],['Value',l({oneOf:['ref:414','ref:784','ref:851']},1)]]],
['LongitudinalSharedState',[['Actors',m('id:1002','ref:874')]]],
['LongitudinalProbe',[occ,['At','i'],['Identity','signedUnitQ'],['Skill','ref:784'],['Relationship','ref:851'],['Comfort','bool'],['Caution','bool'],['Person','ref:869',false]]],
['LongitudinalPractice',[occ,['At','i'],['Engaged','bool'],['Stage',e(1,2,3)]]],
['LongitudinalSource',[occ,['At','i'],['Kind',e(0,1,2,3,4)],['Practiced','bool'],['Success','bool'],['Physical','bool'],['Participant','bool'],['Interference','bool'],['Gap','u']]],
['LongitudinalObservation',[occ,['At','i'],['Kind',e(0,1,2,3,4)],['Admitted','bool'],['Participant','bool'],['Value','bool',false]]],
['LongitudinalUpdate',[occ,['Authority','id:1025'],['Prior',value],['Next',value],['Applied','bool']]],
['LongitudinalView',[['Observer','id:1000'],['Identity','signedUnitQ'],['Skill','ref:784'],['Relationship','ref:851'],['Episodes','ref:866'],['Person','ref:869',false],['RelationshipDetail','ref:866',false]]],
['LongitudinalStage',[['Event','id:1001'],['Phase','u'],['Reads',l('ref:149',6)],['Writes',l('ref:149',3)],['Authority','id:1025']]],
['LongitudinalContent',[['Observer','id:1000'],['Actor','id:1002'],['Target','id:1002'],['Tasks',l('ref:371',2)],['Options',l('ref:395',2)],['Dice','ref:437'],['IdentityK','positiveQ'],['EpisodeHorizon','u']]],
];
fs.writeFileSync(path,JSON.stringify({version:'longitudinal-public-allocation/0.1-candidate',status:'ACCEPTED before implementation',namespace:1157,records:rows.map(([name,fields],i)=>({typeId:863+i,name,schemaVersion:1,fields:fields.map(([name,type,required=true],i)=>({id:i+1,name,type,required}))})),unions:[]},null,2)+'\n',{flag:'wx'});
let codec=fs.readFileSync('src/campaign3/relationshipCodecs.ts','utf8').replaceAll('RELATIONSHIP','LONGITUDINAL').replaceAll('Relationship','Longitudinal').replaceAll('relationship','longitudinal').replaceAll("'./habitCodecs'","'./relationshipCodecs'").replaceAll('habitSupportedSchemas','relationshipSupportedSchemas').replaceAll('decodeHabit','decodeRelationship');
fs.writeFileSync('src/campaign3/longitudinalCodecs.ts',codec,{flag:'wx'});
fs.appendFileSync('docs/formal/CANONICAL_RECORD_REGISTRY.md','\n\n## LONGITUDINAL successor — 2026-09-21\n\nLONGITUDINAL_PUBLIC_ALLOCATION_TABLE.json accepts863..883/schema1, occurrence\nnamespace1157 under longitudinal-public/0.1-candidate. Separate roots867/868/870/\n871/872/873 preserve memory/relationship/person/skill/identity/detail ownership;\nroot875 is the explicitly destructive shared-slot diagnostic. Existing cognitive\noccurrence families retain their meanings. No old frozen bytes change. Counters883/21\nbefore qualification. See LONGITUDINAL_PUBLIC_CONTRACT.md.\n');
