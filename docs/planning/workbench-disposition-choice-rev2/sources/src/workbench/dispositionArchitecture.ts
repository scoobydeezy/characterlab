import type {DispositionSnapshot} from './dispositionAdapter';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {restoreStatePath} from '../substrate/state';
import {fromHex} from './canonical';
import {participationReport} from './participation';
export const DISPOSITION_ARCHITECTURE_BINDINGS=[
 {root:'1457',box:'Psych0',label:'Psychological Baseline',authority:'No writer',basis:'Candidate immutable task-fidelity baseline. Correspondence does not establish irreducibility or a general personality dimension.'},
 {root:'1458',box:'Disp',label:'Learned Dispositional Adaptation',authority:'authority/disposition/adapt',basis:'Stored plastic contribution, distinct from constitution and identity evidence. Refold has no stored leaf; absence is not zero adaptation.'},
 {root:'1436',box:'IdentityEvidence',label:'Identity Evidence',authority:'authority/disposition/identity',basis:'Qualified contextual expression journal. Not private represented identity belief or a general consolidated self-concept.'},
] as const;
export function dispositionArchitecture(snapshot:DispositionSnapshot){
 if(snapshot.seamVersion!=='disposition-public/0.1-candidate')throw Error('Unqualified disposition architecture seam');
 const participation=participationReport({modelHash:snapshot.modelHash,runHash:snapshot.runHash,stateHash:snapshot.stateHash,saveHash:snapshot.saveHash,prefix:snapshot.prefix},snapshot.timeline,snapshot.fields);
 if(participation.rows.length>100||snapshot.timeline.length>180)throw Error('Disposition participation bound');
 const rows=participation.rows.map(r=>{
  const root=String(restoreStatePath(decodeDispositionPublic(fromHex(r.path))).rootStateTypeId);
  if(r.root!==null&&r.root!==root)throw Error('Disposition root/path mismatch');
  const binding=DISPOSITION_ARCHITECTURE_BINDINGS.find(b=>b.root===root);
  return {...r,root,binding:binding?{...binding}:null,support:root==='1441'?{label:'Truth-side execution count',authority:'authority/disposition/execution',basis:'Physical execution outcome counter, outside character-owned canonical-box totals.'}:null};
 });
 const boxes=DISPOSITION_ARCHITECTURE_BINDINGS.map(b=>{
  const paths=rows.filter(r=>r.binding?.box===b.box);
  return {...b,paths:paths.map(r=>r.path),present:paths.filter(r=>r.presentAtRevision).length,reads:paths.reduce((n,r)=>n+r.reads,0),mutations:paths.reduce((n,r)=>n+r.mutations,0),changes:paths.reduce((n,r)=>n+r.changes,0),eventIds:[...new Set(paths.flatMap(r=>r.events.map(e=>e.id)))]};
 });
 return {version:'disposition-canonical-participation/0.1',identity:{program:snapshot.program,seamVersion:snapshot.seamVersion,...participation.identity},authority:{architecture:'CHARACTER_ARCHITECTURE.md §3.2, §6, §15',contract:'docs/formal/DISPOSITION_PUBLIC_CONTRACT.md',ownership:'src/campaign3/dispositionPublicModel.ts'},boxes,rows,unclassifiedPaths:rows.filter(r=>!r.binding&&!r.support).map(r=>r.path),
 scope:'Scoped state correspondence to three existing canonical boxes; no new edges or topology. Truth-side execution remains separate. Derived effective disposition and Refold computation are not stored-state boxes here. Reads, structural mutations and changed values remain distinct from evaluation contributions or causal necessity. Zero recorded activity does not justify retirement. Trusted adapter diagnostics only, not standalone authentication or character self-knowledge.'};
}
