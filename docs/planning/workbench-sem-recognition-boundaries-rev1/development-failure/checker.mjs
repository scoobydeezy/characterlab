import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-sem-recognition-boundaries-rev1';
const sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root+'/receipt.json'));
const paths=['src/workbench/semRecognitionBoundaryControls.ts','src/workbench/semRecognitionFixture.ts','src/workbench/semRecognitionControls.ts','src/workbench/canonical.ts','src/test/workbenchSemRecognitionBoundaryControls.test.ts','src/test/recognition.test.ts','src/test/fixtures/referentOrigin.ts','src/semanticBinding/recognition.ts','src/substrate/scheduler.ts','scripts/build-workbench-sem-recognition-fixture.mjs','scripts/check-workbench-sem-recognition-boundaries.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const original=fs.readFileSync('src/test/recognition.test.ts','utf8');
const prefix=original.slice(0,original.indexOf("describe('SEM-001F")).replace("import { describe, expect, it } from 'vitest';",'').replace("from './fixtures/referentOrigin'","from '../test/fixtures/referentOrigin'");
assert(fs.readFileSync('src/workbench/semRecognitionFixture.ts','utf8').includes(prefix));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {runSemRecognitionBoundaryControls}=await server.ssrLoadModule('/src/workbench/semRecognitionBoundaryControls.ts');
 const r=await runSemRecognitionBoundaryControls();assert.deepEqual(await runSemRecognitionBoundaryControls(),r);assert.equal(r.source.sha256,sha(fs.readFileSync(r.source.path)));
 const parse=e=>JSON.parse(e.exact);let diagnostics=0;
 const check=value=>{if(!value||typeof value!=='object')return;if(value.encoding){assert.equal(value.encoding,'recognition-component-diagnostic-json/0.1');assert.equal(sha(value.exact),value.sha256);parse(value);diagnostics++;}for(const v of Object.values(value))check(v);};check(r);
 assert.equal(r.mapping.missing.code,'INVALID_SYMBOL_MAPPING');assert.equal(r.mapping.truthGuard.code,'FORBIDDEN_TRUTH_FIELD');
 const mapped=parse(r.mapping.mapped),mappedResult=parse(r.mapping.result);assert.equal(mapped.identitySymbolMappings[0].observerSymbolCandidateMappingId.$bigint,'4200');assert.equal(mapped.candidateCatalog.find(c=>c.candidateSemanticReferentId===mappedResult.resolutionRecord.resolution.semanticReferentId)?.candidateDomain,'DiscreteObject');
 assert.deepEqual([r.continuity.sameTrackAfterReplacement,r.continuity.changedRecognition,r.continuity.splitTrack,r.continuity.sameRecognitionAcrossSplit],[true,true,true,true]);
 const cases=r.continuity.cases.map(c=>parse(c.result).resolutionRecord);assert.deepEqual(cases[0].perceptualReferentId,cases[1].perceptualReferentId);assert.notDeepEqual(cases[0].perceptualReferentId,cases[2].perceptualReferentId);assert.deepEqual(cases[0].resolution,cases[2].resolution);assert.notDeepEqual(cases[0].resolution,cases[1].resolution);
 assert.deepEqual(r.authority.guards.map(g=>g.code),['MISSING_RECOGNITION_AUTHORITY','DUPLICATE_RECOGNITION_AUTHORITY','CARRIER_TYPE_MISMATCH','UNKNOWN_DERIVATION']);assert.equal(r.authority.alternativeModel,'model/alternative');
 assert.deepEqual([r.allocation.exactReplay,r.allocation.sameSemanticView,r.allocation.differentResolutionId],[true,true,true]);assert.deepEqual(parse(r.allocation.low),parse(r.allocation.replay));assert.deepEqual(parse(r.allocation.low).resolutionRecord.resolution,parse(r.allocation.shifted).resolutionRecord.resolution);assert.equal(parse(r.allocation.low).resolutionRecord.recognitionResolutionId.$bigint,'5');assert.equal(parse(r.allocation.shifted).resolutionRecord.recognitionResolutionId.$bigint,'901');assert.equal(r.allocation.historyGuard.code,'INVALID_RESOLUTION_HISTORY');
 assert.equal(r.rollback.allocatedEvaluation,'50');assert.equal(r.rollback.failure,'injected recognition commit failure');assert.equal(r.rollback.before.status,'Active');assert.equal(r.rollback.after.status,'Failed');for(const key of ['state','allocators','trace','outputs']){assert.equal(r.rollback.before[key],r.rollback.after[key]);assert.equal(r.rollback.preserved[key],true);}
 assert.equal(r.emission.targets[0].target,'recognition-resolution-log');assert.equal(r.emission.targets[0].accepted,true);assert.deepEqual(r.emission.targets.slice(1).map(t=>t.failure.code),Array(12).fill('FORBIDDEN_EMISSION_TARGET'));assert.equal(r.emission.resolutionEmitted,false);assert.deepEqual(r.emission.result,{kind:'no-update',reason:'SameCandidateMaintained'});
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS ORIGINAL RECOGNITION BOUNDARY CONTROLS',sources,diagnostics,report:r,scope:'CV-SEM-064/066/068/069/070 retained component witnesses. Original helper source binding, complete report replay, diagnostic hashes and scoped outcomes verified. No browser, integrated-run rollback or full SEM coverage claim.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS recognition mapping/continuity/authority/allocation/rollback/emission; '+diagnostics+' exact diagnostics');
}finally{await server.close();}
