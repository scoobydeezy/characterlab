import {PROPOSITIONS,beliefPath,TASKS,taskPath} from '../campaign3/affectModel';
import {statePathValue} from '../substrate/state';
import {exactKey} from './canonical';
import profiles from './affectProfileSources.json';
import {stateParticipation} from './participation';
import type {AffectSnapshot} from './affectSession';
const registered=[...PROPOSITIONS.map((p,i)=>({path:exactKey(statePathValue(beliefPath(p))),root:'753',box:'Beliefs',label:['Current cue estimate','Baseline estimate','Mitigation estimate'][i]})),...TASKS.map((t,i)=>({path:exactKey(statePathValue(taskPath(t))),root:'373',box:'Prospection',label:['Safety task status','Obligation task status'][i]}))];
export function affectArchitecture(snapshot:AffectSnapshot){
 if(!profiles.models.some(m=>m.modelHash===snapshot.modelHash))throw Error('Unknown AFFECT architecture model');
 const rows=stateParticipation(snapshot.timeline,snapshot.fields);
 if(new Set(snapshot.fields.map(f=>f.path)).size!==snapshot.fields.length)throw Error('Duplicate architecture state path');
 const mapped=registered.map(source=>{const activity=rows.find(r=>r.path===source.path),field=snapshot.fields.find(f=>f.path===source.path);if(field&&field.root!==source.root)throw Error('Architecture root/path mismatch');return{...source,present:!!field,exact:field?.exact??'Absent',reads:activity?.reads??0,mutations:activity?.mutations??0,changes:activity?.changes??0,events:activity?.events??[]};});
 const boxes=[{id:'Beliefs',label:'Predictive / Causal Beliefs',basis:'AFFECT public contract root753 contains learned estimates; the full registered character/proposition keys identify these three leaves.'},{id:'Prospection',label:'Prospection / Goal Management',basis:'AFFECT public contract root373 contains two adopted task statuses. This maps the retained commitment state, not all prospection capabilities.'}].map(box=>({...box,paths:mapped.filter(r=>r.box===box.id)}));
 return{version:'affect-canonical-state-correspondence/0.1',identity:{modelHash:snapshot.modelHash,runHash:snapshot.runHash,saveHash:snapshot.saveHash,stateHash:snapshot.stateHash,prefix:snapshot.prefix},authority:'CHARACTER_ARCHITECTURE.md, canonical main topology; docs/formal/AFFECT_PUBLIC_CONTRACT.md, affect-public/0.1-candidate',boxes,unmapped:rows.filter(r=>!registered.some(s=>s.path===r.path)),scope:'Exact registered state paths mapped to two existing canonical boxes. Counts are selected-prefix recorded reads and structural mutations; presence is only at this revision. Zero activity does not prove irrelevance or permit removal. Payload dependencies, evaluation contributions, causal necessity and complete subsystem participation are not established. Appraisal/affect coordinates are derived outputs and are not assigned independent stored-state leaves. No canonical edge is added or removed.'};
}
