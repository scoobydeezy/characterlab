// Existing SEM component expressibility probe, not a new public model or EMB proof.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const output='docs/planning/CAMPAIGN3_SUPPORT_ONLY_SEM_COMPONENT_REV1.json';
assert(!fs.existsSync(output),'preserve receipt; use a new revision');
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const paths=['src/semanticBinding/phaseOrdering.ts','src/semanticBinding/perceptualEventFiles.ts','src/campaign2/probeExecution.ts','scripts/review-campaign3-support-only-sem.mjs'];
const before=paths.map(path=>({path,sha256:hash(path)}));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const phase=await server.ssrLoadModule('/src/semanticBinding/phaseOrdering.ts');
 const {assemblePreRecognitionExperience:assemble}=await server.ssrLoadModule('/src/semanticBinding/perceptualEventFiles.ts');
 let allocations=0;
 const {reservation}=phase.admitObservationLane({observerId:'observer/component',lane:'Current',dueAt:10n,emitsCharacterAccessibleEvidence:true},()=>{allocations++;return 17n;});
 const source={experienceId:17n,observerId:'observer/component',occurredAt:10n,perceptualEventReferentIds:[],perceivedBindings:[],perceptualClassifications:[],perceptualEventClassifications:[],supportingObservationIds:[{observerId:'observer/component',observationId:16n}],transformationVersion:phase.SEMANTIC_PHASE_CONTRACT_VERSION};
 const experience=assemble(source),staged=phase.freezeAndStageSemanticExperience(reservation,experience,14n);
 phase.validateSuccessfulExperienceSettlement([reservation],[staged]);
 assert.equal(allocations,1);assert.equal(staged.experience.supportingObservationIds.length,1);
 assert.equal(staged.experience.perceivedBindings.length,0);
 const checks=['current support-only assembly/freeze/settlement succeeds','one reservation allocation; no fabricated binding'];
 function reject(name,fn){assert.throws(fn);checks.push(name);}
 reject('empty support rejects',()=>assemble({...source,supportingObservationIds:[]}));
 reject('cross-observer support rejects',()=>assemble({...source,supportingObservationIds:[{observerId:'other',observationId:16n}]}));
 reject('wrong freeze phase rejects',()=>phase.freezeAndStageSemanticExperience(reservation,experience,124n));
 reject('mismatched reservation identity rejects',()=>phase.freezeAndStageSemanticExperience({...reservation,experienceId:18n},experience,14n));
 reject('orphan reservation rejects',()=>phase.validateSuccessfulExperienceSettlement([reservation],[]));
 reject('duplicate envelope rejects',()=>phase.validateSuccessfulExperienceSettlement([reservation],[staged,staged]));
 const absent=phase.admitObservationLane({observerId:'observer/component',lane:'Current',dueAt:10n,emitsCharacterAccessibleEvidence:false},()=>{throw Error('must not allocate');});
 assert.equal(absent.reservation,undefined);checks.push('no present evidence requests no reservation');
 assert.deepEqual(paths.map(path=>({path,sha256:hash(path)})),before);
 fs.writeFileSync(output,JSON.stringify({status:'EXISTING SEM SUPPORT-ONLY COMPONENT EXPRESSIBLE',checks,scope:'Direct existing component invocation only. Does not admit a new observation schema, unavailable-marker semantics, public producer, PRJ registration or EMB runtime vector.',sourceFingerprints:before},null,2)+'\n');
 console.log(JSON.stringify({status:'COMPONENT EXPRESSIBILITY CONFIRMED',checks:checks.length}));
}finally{await server.close();}
