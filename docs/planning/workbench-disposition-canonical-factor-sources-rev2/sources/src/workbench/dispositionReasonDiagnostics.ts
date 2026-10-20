import type {TimelineEvent} from './contracts';
const object=(value:unknown):Record<string,unknown>=>{if(!value||typeof value!=='object'||Array.isArray(value))throw Error('DISPOSITION diagnostic record expected');return value as Record<string,unknown>;};
const record=(value:unknown,type:string)=>{const r=object(value);if(r.record!==type)throw Error('DISPOSITION diagnostic record version mismatch');return r;};
const rational=(value:unknown)=>{if(typeof value!=='string'||! /^-?\d+\/[1-9]\d*$/.test(value))throw Error('DISPOSITION exact rational expected');return value;};
const integer=(value:unknown)=>{if(typeof value!=='string'||! /^-?\d+$/.test(value))throw Error('DISPOSITION exact integer expected');return value;};
const array=(value:unknown)=>{if(!Array.isArray(value))throw Error('DISPOSITION diagnostic list expected');return value;};
/** Reads recorded diagnostics only. No character testimony or counterfactual attribution. */
export function inspectDispositionReasons(event:TimelineEvent){
 if(event.stage!=='reasons'||event.phase!=='52')throw Error('DISPOSITION reasons-stage event required');
 const output=array(JSON.parse(event.output));
 const identity={eventId:event.id,instant:event.instant,phase:event.phase};
 if(output.length===0)return {version:'disposition-reason-diagnostics/0.1',...identity,emitted:false as const,scope:'No operand record was emitted at this native stage. No motive or choice is inferred.'};
 if(output.length!==2)throw Error('DISPOSITION reasons output envelope mismatch');
 const operands=record(output[0],'DispositionOperands#1455/1'),reasons=record(output[1],'IdentityTaskReasons#1430/1');
 if(JSON.stringify(operands['Reasons [8]'])!==JSON.stringify(reasons))throw Error('DISPOSITION operand/result lineage mismatch');
 const constitution=record(operands['Constitution [2]'],'ImmutableConstitution#1453/1'),history=record(operands['QualifiedHistory [7]'],'IdentityQualificationJournal#1435/1'),context=record(reasons['Reasons [5]'],'TaskReasonContext#408/1');
 const nuclei=array(context['ActiveNuclei [3]']).map(value=>{
  const nucleus=record(value,'CompiledReasonNucleus#407/1'),roles=record(nucleus['RoleSummary [2]'],'ReasonRoleSummary#406/1');
  record(nucleus['Key [1]'],'ReasonNucleusKey#404/1');record(nucleus['Distribution [7]'],'ExactScoreDistribution#424/1');
  return {key:JSON.stringify(nucleus['Key [1]'],null,2),baseNet:rational(roles['BaseNet [1]']),standingNet:rational(roles['StandingNet [2]']),situationalNet:rational(roles['SituationalNet [3]']),relevance:rational(nucleus['Relevance [3]']),baseDie:integer(nucleus['BaseDie [4]']),standingModifier:integer(nucleus['StandingModifier [5]']),situationalModifier:integer(nucleus['SituationalModifier [6]']),coverage:JSON.stringify(array(roles['CoverageResults [4]']),null,2),distribution:JSON.stringify(nucleus['Distribution [7]'],null,2)};
 });
 return {version:'disposition-reason-diagnostics/0.1',...identity,emitted:true as const,constitution:rational(constitution['Value [1]']),plastic:rational(operands['Plastic [3]']),standing:rational(operands['Standing [4]']),effective:rational(operands['Effective [5]']),feedback:rational(operands['Feedback [6]']),qualifiedEntries:array(history['Qualifications [1]']).length,nuclei,
  scope:'Recorded reasons-stage operands and compiled nuclei only. Constitution, plastic adaptation, identity standing, effective disposition and selected feedback remain separate. Qualified entries are not independent corroboration. Mechanical dice/distributions are not character uncertainty. This diagnostic reader grants no represented self-knowledge, character narration, independent causal contribution or complete choice explanation.'};
}
