/** general-attention-registration-write-scope/0.1-candidate.
 * Fixed stage/owner boundary; exact model selectors and PRJ remain upstream. */
import shape from '../../docs/formal/GENERAL_ATTENTION_WRITE_SCOPE_POLICY.json';
import members from '../../docs/formal/GENERAL_ATTENTION_REGISTRY_MEMBER_ALLOCATION_TABLE.json';
import {canonicalEncode,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeGeneralAttention,generalAttentionSchema} from './generalAttentionCodecs';
import {decodeStatePattern} from '../campaign2/stateModel';
import {dataRecord as rec,dataField as f,dataItems as items,dataUnsigned as u,dataIdentity as id,dataText as text} from '../campaign2/canonicalData';
function fail():never{throw Error('GENERAL_STAGE_WRITE_SCOPE');}
const authorityByRoot:Readonly<Record<string,string>>={GeneralEpisodeState:'authority/general-attention-ordinary-memory',GeneralAssociationState:'authority/general-attention-association',GeneralPresentationState:'authority/general-attention-presentation',MaintenanceGoalState:'authority/general-attention-goal-lifecycle'};
const familyByRoot:Readonly<Record<string,string>>={GeneralEpisodeState:'episodic-memory',GeneralAssociationState:'associations',GeneralPresentationState:'episodic-memory'};
function authority(value:CanonicalValue,expected:string){const v=id(value);if(v.namespaceId!==1025n||text(v.payload)!==expected)fail();if(expected!=='authority/perception'&&!members.members.some(m=>m.namespace===1025&&m.payload===expected))fail();}
export function validateGeneralWriteScope(stageName:string,input:CanonicalValue):void{
 const stage=shape.stages.find(s=>s.name===stageName);if(!stage)fail();const value=decodeGeneralAttention(canonicalEncode(input));
 if(stage.writeMode==='ReadOnly'){if(u(f(rec(value,322n),1n))!==1n)fail();return;}
 if(stage.writeMode==='LearningFamilies'){
  const r=rec(value,322n);if(u(f(r,1n))!==2n)fail();const root=stage.roots[0];authority(f(r,2n),authorityByRoot[root]);
  const families=items(f(r,3n),'set');if(families.length!==1)fail();const family=id(families[0]);if(family.namespaceId!==1031n||text(family.payload)!==familyByRoot[root])fail();return;
 }
 const r=rec(value,705n),perception=stageName==='current-track'||stageName==='consequence-track',physical=stageName==='local-reserve-replenishment';
 authority(f(r,1n),perception?'authority/perception':physical?'authority/general-attention-local-reserve':'authority/general-attention-goal-lifecycle');
 const allowed=perception?[241n,242n,generalAttentionSchema('GeneralTrackingState').typeId,generalAttentionSchema('TrialPanelContextState').typeId]:[generalAttentionSchema(physical?'LocalReserveState':'MaintenanceGoalState').typeId];
 for(const v of items(f(r,2n),'set')){
  const p=decodeStatePattern(v);if(!allowed.includes(p.rootStateTypeId))fail();
  if(p.fieldId!==1n&&(![241n,242n].includes(p.rootStateTypeId)||p.fieldId!==2n))fail();
  if(p.selectors.length!==1)fail();const selector=p.selectors[0];
  if(selector.kind==='wildcard'?selector.selectorKind!=='mapKey':selector.selector.kind!=='mapKey')fail();
 }
}
