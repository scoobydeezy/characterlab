import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const output='docs/planning/GA_STATE_ROOT_KEY_INVENTORY_REV1.json';assert(!fs.existsSync(output));
const ref=name=>({kind:'ref',name}),optional=name=>({kind:'optional',value:ref(name)}),list=(name,min,max)=>({kind:'list',element:ref(name),min,max}),map=(key,value)=>({kind:'map',key:ref(key),value:ref(value),min:1,max:1});
const records=[],record=(name,fields)=>records.push({name,fields:Object.entries(fields).map(([name,type])=>({name,type:typeof type==='string'?ref(type):type}))});
record('AssociationMassRow',{Masses:list('LatticeMass',0,27)});
record('AssociationGraph',{Nodes:list('PerceptualReferentId',0,27),Rows:list('AssociationMassRow',0,27),LastUpdatedAt:'Instant'});
record('TrackingWindowItem',{File:'PerceptualReferentId',Glyph:optional('Glyph')});
record('TrackingWindow',{At:'Instant',Observation:optional('ObservationId'),Items:list('TrackingWindowItem',0,3)});
record('ActivePanelContext',{Glyph:'Glyph',Context:'PerceptualEventReferentId'});
record('TrialPanelWindow',{At:'Instant',Active:optional('ActivePanelContext')});
const roots=[
 ['GeneralEpisodeState','SurvivingEpisodeLedger','CharacterId','episodic-memory','ordinary-memory-settlement'],
 ['GeneralAssociationState','AssociationGraph','CharacterId','associations','association-settlement'],
 ['GeneralPresentationState','PresentationLedger','CharacterId','episodic-memory','presentation-settlement'],
 ['MaintenanceGoalState','MaintenanceGoalLedger','CharacterId','prospective-commitments','maintenance-goal-lifecycle'],
 ['GeneralTrackingState','TrackingWindow','ObserverId','Perception','authority/perception'],
 ['TrialPanelContextState','TrialPanelWindow','ObserverId','Perception','authority/perception']
].map(([root,value,key,classification,owner])=>{record(root,{Value:map(key,value)});return {root,field:'Value',value,key,classification,owner,removalAllowed:false,initial:'present empty owner value; time0 where applicable',selectors:[{kind:'mapKey',type:key}]};});
roots.push({root:'FormationGovernanceState',field:'Value',value:'FormationGovernanceValue',key:null,classification:'RuntimeProtocol',owner:'authority/formation-governance',removalAllowed:false,initial:'present empty maps',selectors:[]});
const stateMapKeyRoles=roots.filter(r=>r.key).map(r=>({root:r.root,field:r.field,role:'StateMapKey',requiredNamespace:r.key==='CharacterId'?1002:1000,...(r.key==='CharacterId'?{domainValidator:'validator/character-qualification'}:{})}));
const external={LatticeMass:'unsigned0..committed scale',Instant:'nonnegative SimInstant; only empty initial windows/graph use0',Glyph:'unsigned0..7',ObservationId:'existing1115',ObserverId:'existing1000',CharacterId:'existing1002 plus character qualification',PerceptualReferentId:'existing212',PerceptualEventReferentId:'existing213',SurvivingEpisodeLedger:'GA_SURVIVING_CHILD_CARRIER_REV3',PresentationLedger:'GA_RECOLLECTION_CARRIER_REV3',MaintenanceGoalLedger:'GA_GOAL_RESULT_CARRIER_REV2',FormationGovernanceState:'GA_FORMATION_PROTOCOL_CARRIER_REV2',FormationGovernanceValue:'GA_FORMATION_PROTOCOL_CARRIER_REV2'};
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
fs.writeFileSync(output,JSON.stringify({version:'ga-state-root-key-inventory/0.1-draft',status:'SYMBOLIC ROOT/KEY INVENTORY; PUBLIC COMPILER OPEN',records,roots,stateMapKeyRoles,external,invariants:{cohort:'Exactly one compiled character/observer; key and every nested holder agree.',graph:'Canonical unique keys, square rows, zero diagonal, nonnegative bounded lattice and row sums.',perception:'No new1031 perception member; no copied SEM counter or full observation history.',protocol:'No map selector or cognitive role/read/family on singleton.',empty:'Initialized owner values remain present after complete loss; old roots unchanged.'},sources:['docs/planning/GA_STATE_ROOT_KEY_INVENTORY_REV1.md','docs/planning/GA_SURVIVING_CHILD_CARRIER_REV3.json','docs/planning/GA_GOAL_RESULT_CARRIER_REV2.json','docs/planning/GA_RECOLLECTION_CARRIER_REV3.json','docs/planning/GA_FORMATION_PROTOCOL_CARRIER_REV2.json'].map(fp)},null,2)+'\n');
