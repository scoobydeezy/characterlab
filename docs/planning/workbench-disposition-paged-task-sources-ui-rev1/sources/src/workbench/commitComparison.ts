import plan from '../../docs/planning/COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import {bytesToHex,canonicalEncode,set} from '../substrate/canonicalEncoding';
import type {CommitSnapshot} from './commitAdapter';
export interface CommitContrast {id:string;label:string;kind:'input'|'model';changed:string;a:string;b:string;}
export const COMMIT_CONTRASTS:CommitContrast[]=[
 {id:'hidden',label:'Hidden scalar',kind:'input',changed:'Inert hidden scalar across the original calendar; lifecycle and communication are fixed.',a:'1/main',b:'1/hidden'},
 {id:'private-lifecycle',label:'Private lifecycle / absent',kind:'input',changed:'Private lifecycle commands differ with no communication admitted to either observer.',a:'1/private',b:'1/absent'},
 {id:'withheld',label:'Selective messages / no messages',kind:'input',changed:'Communication commands differ; private lifecycle is fixed.',a:'1/main',b:'1/private'},
 {id:'both',label:'Selective / both recipients',kind:'input',changed:'Recipient sets differ; communicated instances and private lifecycle are fixed.',a:'1/main',b:'1/both'},
 {id:'swapped',label:'Swapped recipients',kind:'input',changed:'Recipient sets are swapped; communicated instances and private lifecycle are fixed.',a:'1/main',b:'1/swapped'},
 {id:'retired',label:'Permitted retirement report',kind:'input',changed:'Adds a permitted report of retired A to observer A; communication command and recipient set change together.',a:'1/main',b:'1/retired'},
 ...[2,3,4].map(law=>({id:`law/${law}`,label:`Lifecycle / ${['','','CoreNeed','Immortal','ReusedId'][law]}`,kind:'model' as const,changed:'Frozen lifecycle/source law only; original input calendar and training seed are identical.',a:'1/main',b:`${law}/main`}))];
/** Explicit content correspondence only; exact evidence/occurrence identities remain in observer hashes. */
export function commitReportContent(exact:string){
 const values=JSON.parse(exact);if(!Array.isArray(values))throw Error('COMMIT observer projection must be a list');
 return values.filter(v=>v?.record==='CommitObservation#962/1').map(v=>({observer:v['Observer [2]'],at:v['At [3]'],task:v['Task [4]'],status:v['Status [5]']}));
}
export function compareCommit(id:string,a:CommitSnapshot,b:CommitSnapshot){
 const contrast=COMMIT_CONTRASTS.find(c=>c.id===id);if(!contrast||a.program!==contrast.a||b.program!==contrast.b)throw Error('COMMIT requires its declared ordered pair');
 if(a.seamVersion!=='commit-public/0.1-candidate'||b.seamVersion!==a.seamVersion)throw Error('COMMIT seam mismatch');
 const originals=[a,b].map(s=>plan.runs.find(r=>`${r.law}/${r.name}`===s.program)!);if(contrast.kind==='input'&&a.modelHash!==b.modelHash)throw Error('Input contrast requires one model');if(contrast.kind==='model'&&(a.modelHash===b.modelHash||originals[0].orderedInputs!==originals[1].orderedInputs))throw Error('Model contrast requires distinct models and identical originals');
 const aligned=a.prefix===b.prefix&&a.clock===b.clock,summary=(s:CommitSnapshot)=>({program:s.program,prefix:s.prefix,clock:s.clock,complete:s.complete,modelHash:s.modelHash,runHash:s.runHash,stateHash:s.stateHash,saveHash:s.saveHash,outputsHash:s.outputsHash,observerHashes:s.observerViews.map(o=>o.hash)});
 return {version:'commit-contrast-inspection/0.1',contrast:structuredClone(contrast),aligned,originals:structuredClone(originals),initialState:bytesToHex(canonicalEncode(set([]))),runSeed:'07'.repeat(32),
  alignment:'Equal committed prefix and instant only; unequal horizons withhold results. Observer A/B retain their public identity ordering, never merged knowledge.',randomPolicy:'Original repeated-byte seed7; actual training precedes all lifecycle probes. Shared seed alone is not a general stochastic coupling claim.',
  contentProjection:'commit-admitted-report-content/0.1: ordered native962 observer/time/task/status only; occurrence IDs, evidence wrappers, probes and knowledge updates omitted explicitly. This is report-content correspondence, not exact evidence or knowledge equality.',
  admittedReportContentEqual:[0,1].map(i=>aligned?JSON.stringify(commitReportContent(a.observerViews[i].exact))===JSON.stringify(commitReportContent(b.observerViews[i].exact)):null),
  modelIdentityEqual:a.modelHash===b.modelHash,runIdentityEqual:a.runHash===b.runHash,observerEqual:[0,1].map(i=>aligned?a.observerViews[i].hash===b.observerViews[i].hash:null),researchOutputsEqual:aligned?a.outputsHash===b.outputsHash:null,stateEqual:aligned?a.stateHash===b.stateHash:null,exactSaveEqual:aligned?a.saveHash===b.saveHash:null,a:summary(a),b:summary(b),scope:'Bounded native observer projections and researcher state. Full trace bodies omitted; replay originals to inspect them. Equality does not establish general commitment theory or causal necessity. All four models remain retained.'};
}
