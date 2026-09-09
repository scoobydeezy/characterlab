// Actual observer/compiler boundary inspection; proposed projection is not installed.
import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {createServer} from 'vite';
const output='docs/planning/PROTOCOL_OBSERVATION_CUT_EXPLORATION_REV1.json';assert(!fs.existsSync(output));
const paths=['src/observation/observation.ts','src/campaign2/bridgeObservation.ts','scripts/explore-protocol-observation-cut.mjs'];
const hash=path=>({path,sha256:crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex')}),before=paths.map(hash);
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),{ExactRational:R}=await server.ssrLoadModule('/src/substrate/exactMath.ts'),obs=await server.ssrLoadModule('/src/observation/observation.ts'),{compileBridgeObservation}=await server.ssrLoadModule('/src/campaign2/bridgeObservation.ts');
 const q=n=>R.of(BigInt(n)),id=(n,s)=>c.typedIdentifier(n,c.text(s)),channel={observationChannelId:id(24002,'control/channel'),observerId:id(24000,'control/observer'),subjectId:id(24001,'control/subject'),modalityId:id(24003,'control/modality'),unitId:id(1039,'unit/fixture-pulse'),polarityId:1n,measurementModeId:1n,precision:q(1),visibleProvenanceSlotIds:[],missingnessRuleId:1n},truthId=id(24006,'control/execution'),observationId=id(24005,'control/observation');
 const truth=n=>({before:q(0),potentialEffect:q(n),applied:q(n),overflow:q(0),after:q(n),minimum:q(0),maximum:q(2),provenance:{slots:new Map()},truthRecordId:truthId});
 const cases=[];
 for(const count of [0,1,2]){
  const raw=obs.compilePermittedEvidence(truth(count),channel,observationId,1n);assert.equal(raw.kind,'present');
  assert(raw.measurementInterval.lower.equals(q(count)));assert.equal(raw.evidenceKindId,count===2?2n:1n);
  if(count===2)assert.equal(raw.measurementInterval.upper,undefined);else assert(raw.measurementInterval.upper.equals(q(count)));
  assert.deepEqual(raw.safeSourceReferences,[truthId]);
  if(count===1)compileBridgeObservation(truth(count),channel,observationId,1n);else assert.throws(()=>compileBridgeObservation(truth(count),channel,observationId,1n),/unexpected raw bridge measurement/);
  cases.push({completedCount:count,lower:count,upper:count===2?null:count,evidenceKind:count===2?'LowerBound':'Point',privateTruthReferencePresent:true,oldFixedPulseBridgeAdmitted:count===1});
 }
 assert.throws(()=>obs.compilePermittedEvidence({...truth(0),potentialEffect:q(1)},channel,observationId,1n),/Applied|applied/);
 assert.deepEqual(paths.map(hash),before);
 fs.writeFileSync(output,JSON.stringify({status:'EXECUTED OBSERVER COMPONENT INSPECTION; NOT NEW PROJECTION QUALIFICATION',sourceFingerprints:before,cases,blockedRequestedPotentialRejected:true,limitations:['The new version/projection and actual ExecutionOutcome source do not exist in canonical runtime yet.','Research observer/source IDs are test namespaces; no production namespace is allocated.','The existing fixed-pulse bridge remains unchanged and rejects0/2 as required.','Raw source references demonstrate why a separate safe projection is required; raw results must never be published to the character route.']},null,2)+'\n');
 console.log('PASS: actual0/1 points,2 lower bound; old bridge rejects0/2; invalid blocked potential rejected');
}finally{await server.close();}
