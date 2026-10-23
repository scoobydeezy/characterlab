import type {LongSnapshot} from './longAdapter';
import {canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreStatePath} from '../substrate/state';
import {longitudinalSupportedSchemas} from '../campaign3/longitudinalCodecs';
import catalog from './longCatalog.json';
import {fromHex} from './canonical';
import {participationReport} from './participation';

export const LONG_ARCHITECTURE_VERSION='long-canonical-participation/0.1';
/** Existing canonical boxes; these correspondences do not add causal edges. */
export const LONG_ARCHITECTURE_BINDINGS=[
 {root:'867',schema:'LongitudinalEpisodeState',box:'Episodic',label:'Episodic Imprints',authority:'authority/longitudinal-memory',basis:'Admitted recent safe episodes; expiry and learned projection retention remain distinct.'},
 {root:'868',schema:'LongitudinalRelationshipState',box:'Relationships',label:'Directional Relationship State',authority:'authority/longitudinal-relationship',basis:'Incremental summary of admitted own interactions; not a person claim.'},
 {root:'870',schema:'LongitudinalPersonState',box:'Person',label:'Observer-specific Person Models',authority:'authority/longitudinal-person',basis:'Current admitted person claim, potentially false; never authoritative target truth.'},
 {root:'871',schema:'LongitudinalSkillState',box:'Skill',label:'Skill / Procedural Competence',authority:'authority/longitudinal-skill',basis:'Attempted practice, interference and event-sampled rust; competence is distinct from observed success.'},
 {root:'872',schema:'LongitudinalIdentityState',box:'IdentityEvidence',label:'Identity Evidence',authority:'authority/longitudinal-identity',basis:'Retained qualified biography contributions; not a general consolidated self-concept or personality law.'},
 {root:'873',schema:'LongitudinalDetailState',box:'Relationships',label:'Directional Relationship State',authority:'authority/longitudinal-relationship',basis:'FullHistory relationship detail journal under the relationship owner; distinct from expiring root867 episodes and compact root868 summary.'},
] as const;
export const LONG_ARCHITECTURE_CONTROL={root:'875',schema:'LongitudinalSharedState',authority:'authority/longitudinal-shared',label:'Destructive shared-slot comparator',basis:'One diagnostic slot overwrites learned families. The accepted contract explicitly excludes it from the safe ownership architecture; never count it under three canonical boxes.'} as const;
const schemas=longitudinalSupportedSchemas(),registry=new RecordSchemaRegistry(schemas);
for(const b of [...LONG_ARCHITECTURE_BINDINGS,LONG_ARCHITECTURE_CONTROL])if(!schemas.some(s=>String(s.typeId)===b.root&&s.name===b.schema))throw Error('LONG architecture allocation mismatch');
export function longArchitectureFromParticipation(program:string,seamVersion:string,participation:ReturnType<typeof participationReport>){
 if(seamVersion!==catalog.contract||!catalog.programs.some(p=>p.name===program))throw Error('LONG architecture requires an original source profile');
 if(participation.rows.length>10000||participation.rows.reduce((n,r)=>n+r.events.length,0)>50000)throw Error('LONG architecture diagnostic limit');
 if(new Set(participation.rows.map(r=>r.path)).size!==participation.rows.length)throw Error('LONG architecture duplicate path');
 const rows=participation.rows.map(original=>{
  if(original.path.length>100000)throw Error('LONG architecture path limit');
  const row=structuredClone(original),root=String(restoreStatePath(canonicalDecode(fromHex(row.path),registry)).rootStateTypeId);
  if(row.root!==null&&row.root!==root)throw Error('LONG architecture root/path mismatch');
  const binding=LONG_ARCHITECTURE_BINDINGS.find(b=>b.root===root);
  return {...row,root,binding:binding?{...binding}:null,control:root===LONG_ARCHITECTURE_CONTROL.root?{...LONG_ARCHITECTURE_CONTROL}:null};
 });
 const boxes=[...new Set(LONG_ARCHITECTURE_BINDINGS.map(b=>b.box))].map(box=>{
  const paths=rows.filter(r=>r.binding?.box===box);
  return {box,label:LONG_ARCHITECTURE_BINDINGS.find(b=>b.box===box)!.label,observedPaths:paths.length,reads:paths.reduce((n,r)=>n+r.reads,0),mutations:paths.reduce((n,r)=>n+r.mutations,0),changes:paths.reduce((n,r)=>n+r.changes,0),currentlyPresent:paths.filter(r=>r.presentAtRevision).length,eventIds:[...new Set(paths.flatMap(r=>r.events.map(e=>e.id)))],paths:paths.map(r=>r.path)};
 });
 return {version:LONG_ARCHITECTURE_VERSION,identity:{program,seamVersion,...participation.identity},authority:{architecture:'CHARACTER_ARCHITECTURE.md §3.2, §8.4, §13, §15',contract:'docs/formal/LONGITUDINAL_PUBLIC_CONTRACT_REV2.md',allocation:'docs/formal/LONGITUDINAL_PUBLIC_ALLOCATION_TABLE.json',enforcement:'src/campaign3/longitudinalModel.ts'},boxes,rows,controlPaths:rows.filter(r=>r.control).map(r=>r.path),unclassifiedPaths:rows.filter(r=>!r.binding&&!r.control).map(r=>r.path),scope:'Six state-root correspondences to five existing canonical boxes in the original LONG source. Recorded reads, mutations and changes are distinct from evaluation contribution or causal necessity. The destructive shared-slot comparator is outside canonical-box totals. Historical paths are decoded even when absent now. An empty correspondence means no recorded path in this prefix, not absent machinery or a retirement recommendation. Goal, habit, loss and routine successors remain separate.'};
}
export function longArchitectureParticipation(snapshot:LongSnapshot){
 return longArchitectureFromParticipation(snapshot.program,snapshot.seamVersion,participationReport({modelHash:snapshot.modelHash,runHash:snapshot.runHash,stateHash:snapshot.stateHash,saveHash:snapshot.saveHash,prefix:snapshot.prefix},snapshot.timeline,snapshot.fields));
}
