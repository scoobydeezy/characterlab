/** Internal adaptation-settlement/0.2-candidate preparation. Runtime-owned
 * callbacks resolve complete owner groups against one B0. No caller data may
 * supply these callbacks; public admission remains in the runtime compiler. */
import {AuthoritativeState,statePathValue,patternMatches,type StatePatch,type ActualReadRecord,type StructuralMutationDiff} from '../substrate/state';
import {dataKey as key,invalidModel as fail} from '../campaign2/canonicalData';
import {generalRegistrationTemplates} from './generalRegistration';
import {generalStagePaths} from './generalBindingProfile';
import type {compileGeneralState} from './generalState';

export interface GeneralTerminalOwnerGroup {
 readonly stage:string;
 /** All operations targeting one owner leaf must already be folded here. */
 readonly prepare:(base:AuthoritativeState)=>{patch():StatePatch;actualReadRecords():readonly ActualReadRecord[]};
}
export function prepareGeneralTerminalBatch(model:ReturnType<typeof compileGeneralState>,base:AuthoritativeState,groups:readonly GeneralTerminalOwnerGroup[],protocol?:()=>StatePatch){
 model.validateState(base);
 const frozen=new AuthoritativeState(base.entries()),templates=generalRegistrationTemplates(),seen=new Set<string>();
 const ordered=[...groups].sort((a,b)=>(templates.find(t=>t.name===a.stage)?.ordinal??0)-(templates.find(t=>t.name===b.stage)?.ordinal??0));
 // Preflight declared targets, including no-op writers. A duplicate logical
 // owner group cannot escape the collision rule by returning an empty patch.
 for(const group of ordered){
  const template=templates.find(t=>t.name===group.stage),paths=generalStagePaths(group.stage).writes;
  if(!template||template.phase!==140||!paths.length)fail('GA terminal owner stage');
  if(seen.has(group.stage))fail('GA terminal duplicate owner group');seen.add(group.stage);
 }
 for(let i=0;i<ordered.length;i++)for(let j=0;j<i;j++){
  const a=generalStagePaths(ordered[i].stage).writes,b=generalStagePaths(ordered[j].stage).writes;
  // Terminal GA declarations are exact character-keyed owner leaves. Refuse
  // unknown wildcard shapes rather than silently weakening collision checks.
  for(const x of a)for(const y of b){
   if(x.selectors.some(s=>s.kind!=='exact')||y.selectors.some(s=>s.kind!=='exact'))fail('GA terminal unbounded target');
   const path={rootStateTypeId:x.rootStateTypeId,fieldId:x.fieldId,selectors:x.selectors.map(s=>{if(s.kind!=='exact')return fail('GA terminal target');return s.selector;})};
   if(patternMatches(y,path))fail('GA terminal target collision');
  }
 }
 const prepared=ordered.map(group=>{
  const result=group.prepare(frozen),patch=structuredClone(result.patch()),reads=structuredClone(result.actualReadRecords());
  // Check every owner independently against B0 before combining any mutation.
  model.applyStagePatch(group.stage,frozen,patch);
  return {stage:group.stage,patch,reads};
 });
 const protocolPatch=protocol?structuredClone(protocol()):{operations:[]};
 model.applyProtocolPatch(frozen,protocolPatch);
 const touched=new Set<string>();
 for(const patch of [...prepared.map(p=>p.patch),protocolPatch])for(const operation of patch.operations){const target=key(statePathValue(operation.path));if(touched.has(target))fail('GA terminal patch collision');touched.add(target);}
 let live=true;
 return Object.freeze({
  finish(){
   if(!live)fail('GA terminal batch lifecycle');live=false;
   let state=frozen;const records:{stage:string;patch:StatePatch;reads:readonly ActualReadRecord[];diffs:readonly StructuralMutationDiff[]}[]=[];
   for(const p of prepared){const result=model.applyStagePatch(p.stage,state,p.patch);state=result.state;records.push({...p,diffs:result.diffs});}
   const result=model.applyProtocolPatch(state,protocolPatch);
   return {state:result.state,records:structuredClone(records),protocolPatch:structuredClone(protocolPatch),protocolDiffs:result.diffs};
  },
  close(){live=false;},
 });
}
