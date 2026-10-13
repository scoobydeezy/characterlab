import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-sem-renderer-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root+'/receipt.json'));
const paths=['src/workbench/semRendererControls.ts','src/workbench/semRendererFixture.ts','src/workbench/semNegativeRecorder.ts','src/workbench/canonical.ts','src/test/phenSem001Rendering.test.ts','src/test/fixtures/phenSem001Renderer.ts','src/test/fixtures/phenSem001.ts','src/test/workbenchSemRendererControls.test.ts','scripts/build-workbench-sem-renderer-fixture.mjs','scripts/check-workbench-sem-renderer.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const original=fs.readFileSync(paths[4],'utf8');
const transformed=original.slice(0,original.indexOf("describe('PHEN-SEM-001 viewpoint rendering'")).replace("import { describe, expect, it } from 'vitest';",'').replaceAll("'./fixtures/","'../test/fixtures/").replace("expect(second.tracksByLabel.get('glen/actor')).toEqual(actorTrack);","if (stringifyWithBigInts(second.tracksByLabel.get('glen/actor')) !== stringifyWithBigInts(actorTrack)) throw Error('CV-SEM-012 continuant changed');");
assert(fs.readFileSync(paths[1],'utf8').includes(transformed));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {runSemRendererControls}=await server.ssrLoadModule('/src/workbench/semRendererControls.ts');
 const {misrecognitionScenario,requestFor}=await server.ssrLoadModule('/src/workbench/semRendererFixture.ts');
 const {renderAllViewpoints}=await server.ssrLoadModule('/src/test/fixtures/phenSem001Renderer.ts');
 const r=await runSemRendererControls();assert.deepEqual(await runSemRendererControls(),r);assert.equal(r.source.sha256,sha(fs.readFileSync(r.source.path)));assert.equal(sha(r.evidence.exact),r.evidence.sha256);
 const native=renderAllViewpoints(requestFor(misrecognitionScenario()));
 for(const v of r.views){assert.deepEqual(v.plain,native.get(v.viewpoint));assert.deepEqual(v.plain,v.repeated);assert.deepEqual(v.plain.recordLines,v.reallocated.recordLines);assert.deepEqual(v.plain.recordLines,v.narrative.recordLines);assert.notDeepEqual(v.plain.displayLines,v.narrative.displayLines);}
 const e=JSON.parse(r.evidence.exact);assert.equal(e.requestBeforeRendering,e.requestAfterRendering);
 assert.notDeepEqual(e.request.projection.perceivedBindings.map(b=>b.perceivedBindingId),e.shiftedRequest.projection.perceivedBindings.map(b=>b.perceivedBindingId));
 assert.equal(r.views[1].plain.recordLines[1].includes('person.darius'),true);assert.equal(r.views[2].plain.recordLines[1].includes('person.mina'),true);
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED CV-SEM-012 DIAGNOSTIC',sources,report:r,scope:r.scope},null,2)+'\n',{flag:'wx'});
 console.log(JSON.stringify({status:'PASS',viewpoints:r.views.length,sourceCount:sources.length}));
}finally{await server.close();}
