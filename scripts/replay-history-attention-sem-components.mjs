import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/ATTENTION_SEM_COMPONENT_REVIEW_REV1.json';const fp=p=>({path:p,sha256:createHash('sha256').update(fs.readFileSync(p)).digest('hex')}),checks=[];const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{const e=await server.ssrLoadModule('/src/semanticBinding/evidenceProvenance.ts'),p=await server.ssrLoadModule('/src/semanticBinding/perceptualEventFiles.ts'),{EventRoleId:R}=await server.ssrLoadModule('/src/semanticBinding/eventBindings.ts');
const observerId='observer/attention-component',event={observerId,observerEventSequence:0n},version='component/attention-inspection',roles=[R.Actor,R.Target,R.Participant],model=e.compileCausalRoleModel('component/attention-inspection',[e.INITIAL_CAUSAL_ROLE_RULE]);
const bindings=p.compilePerceivedBindings(roles.map((eventRoleId,i)=>({observerId,perceptualEventReferentId:event,perceptualReferentId:{observerId,observerTrackSequence:BigInt(i)},eventRoleEvidence:{kind:'exact',eventRoleId},supportingObservationIds:[{observerId,observationId:BigInt(i)}],occurredAt:1n,transformationVersion:version})),10n).bindings;
const experience=p.assemblePreRecognitionExperience({experienceId:20n,observerId,occurredAt:1n,perceptualEventReferentIds:[event],perceivedBindings:bindings,perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[0n,1n,2n].map(observationId=>({observerId,observationId})),transformationVersion:version});
const evidenceOccurrences=bindings.map(b=>({ref:{kind:'perceived-binding',perceivedBindingId:b.perceivedBindingId},observerId,occurredAt:1n,recordSchemaVersion:'perceived-binding/0.1-candidate',producingEpistemicSeamVersion:version,scope:{experienceId:20n,carrier:{kind:'continuant-in-event',perceptualEventReferentId:event,perceptualReferentId:b.perceptualReferentId}}})).sort((a,b)=>e.characterEvidenceRefKey(a.ref).localeCompare(e.characterEvidenceRefKey(b.ref)));
const readDomain={transitionKindId:'transition/derive-character-causal-role',permittedEvidenceSchemas:[{refKind:'perceived-binding',recordSchemaVersion:'perceived-binding/0.1-candidate',producingEpistemicSeamVersion:version}],temporalScope:'SameExperience'};
const claims=[];for(let i=0;i<3;i++){const request={experience,perceptualEventReferentId:event,perceptualReferentId:{observerId,observerTrackSequence:BigInt(i)},evidenceOccurrences,readDomain,transformationVersion:version},result=e.deriveCausalRoleEvidence(model,request,30n+BigInt(i));assert.equal(result.evidence.length,1);assert.equal(result.evidence[0].causalRoleId,[e.CausalRoleId.Actor,e.CausalRoleId.Target,e.CausalRoleId.Participant][i]);claims.push(result.evidence[0]);checks.push('actual component derives '+roles[i]);assert.throws(()=>e.deriveCausalRoleEvidence(model,{...request,evidenceOccurrences:evidenceOccurrences.map(v=>({...v,observerId:'foreign'}))},40n));checks.push('foreign observer rejected '+i);}
assert(!e.INITIAL_CAUSAL_ROLE_RULE.mappings.some(m=>[e.CausalRoleId.Cause,e.CausalRoleId.Incidental].includes(m.causalRoleId)));checks.push('accepted initial mappings contain neither Cause nor Incidental');assert.equal(experience.perceivedBindings.length,3);checks.push('actual experience assembler retains three units');
compareAudit(output,JSON.stringify({status:'SEM COMPONENT EXPRESSIBILITY CHECKED; NOT PUBLIC ATTENTION PRODUCTION OR QUALIFICATION',checks,claims:claims.map(c=>({role:c.causalRoleId,source:e.characterEvidenceRefKey(c.supportingEvidenceRefs[0])})),sources:['src/semanticBinding/evidenceProvenance.ts','src/semanticBinding/perceptualEventFiles.ts','src/semanticBinding/eventBindings.ts','docs/formal/EVENT_ORDERING.md','scripts/review-attention-sem-components.mjs'].map(fp),limits:['Inputs here are explicit component fixtures, not an admitted public source.','Small bigint counters are local component fixture values, not new permanent allocations.','Selection and attention transition code are not implemented.']},null,2)+'\n');console.log(checks.length+' checks');
}finally{await server.close();}


function compareAudit(original,json){
 const actual=JSON.parse(json),expected=JSON.parse(fs.readFileSync(original));
 const bindings=[];
 for(const f of expected.sources){
  let resolved=f.path;
  if(f.path==='src/campaign3/attentionSelection.ts')resolved='docs/planning/campaign3-history-attention-public-rev1/attentionSelection.original.ts';
  assert.equal(fp(resolved).sha256,f.sha256);
  bindings.push({originalPath:f.path,historical:fp(resolved),current:fp(f.path)});
 }
 const {sources:currentSources,...actualBehavior}=actual,{sources:oldSources,...expectedBehavior}=expected;
 assert.deepEqual(actualBehavior,expectedBehavior);
 assert.deepEqual(currentSources.map(f=>f.path),oldSources.map(f=>f.path));
 const receipt={status:'PASS',original,originalSha256:fp(original).sha256,comparison:'Whole original non-source result equal; source identities checked separately without relabeling current hashes',bindings,currentSources,checker:fp("scripts/replay-history-attention-sem-components.mjs")};
 const file="docs/planning/campaign3-history-attention-construction-rev1/sem-components.json"; if(fs.existsSync(file))assert.deepEqual(JSON.parse(fs.readFileSync(file)),receipt);else fs.writeFileSync(file,JSON.stringify(receipt,null,2)+'\n');
}
