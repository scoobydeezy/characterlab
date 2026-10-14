import fs from 'node:fs';import assert from 'node:assert/strict';import{createHash}from'node:crypto';import{createServer}from'vite';
import{generatedAcceptance}from'./build-workbench-sem-acceptance-fixtures.mjs';
const root='docs/planning/workbench-sem-acceptance-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root+'/receipt.json'));
const paths=['src/workbench/semAcceptanceControls.ts','src/workbench/semAcceptanceRecorder.ts','src/workbench/semAcceptanceFixture.ts','src/workbench/semConsumerReplayFixture.ts','src/workbench/semNegativeRecorder.ts','src/workbench/canonical.ts','src/test/sem001AcceptanceGate.test.ts','src/test/phenSem001Integration.test.ts','src/test/semanticNegativeControls.test.ts','src/test/fixtures/phenSem001Run.ts','src/test/fixtures/phenSem001.ts','src/test/fixtures/phenSem001Renderer.ts','src/test/fixtures/namedNegativeControls.ts','src/test/workbenchSemAcceptanceControls.test.ts','docs/formal/CAMPAIGN1_SEMANTIC_BINDING_VECTORS.md','docs/formal/OPEN_DECISIONS.md','docs/formal/EVENT_SEMANTIC_NUMERIC_REGISTRY.md','scripts/build-workbench-sem-acceptance-fixtures.mjs','scripts/check-workbench-sem-acceptance.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
for(const [source,target]of [['sem001AcceptanceGate','semAcceptanceFixture'],['phenSem001Integration','semConsumerReplayFixture']])assert.equal(fs.readFileSync(`src/workbench/${target}.ts`,'utf8'),generatedAcceptance(`src/test/${source}.test.ts`));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {runSemAcceptanceControls}=await server.ssrLoadModule('/src/workbench/semAcceptanceControls.ts');const report=await runSemAcceptanceControls();assert.deepEqual(await runSemAcceptanceControls(),report);
 assert.deepEqual(report.groups.map(g=>g.cases.length),[11,2]);assert.deepEqual(report.conditions.map(c=>c.item),[1,2,3,4,5,6,7,8,9,10]);
 let assertions=0;for(const g of report.groups){assert.equal(g.source.sha256,sha(fs.readFileSync(g.source.path)));for(const c of g.cases){assert.equal(sha(c.evidence.exact),c.evidence.sha256);const p=JSON.parse(c.evidence.exact);assert.equal(p.assertions.length,c.assertions);assert(p.assertions.every(a=>a.passed));assert.deepEqual(p.failures,c.failures);assertions+=c.assertions;}}
 assert.deepEqual(report.groups[0].cases.map(c=>c.failures.length),[0,0,0,0,0,0,0,9,0,0,0]);assert(report.groups[0].cases[7].failures.every(f=>f.code==='FORBIDDEN_EMISSION_TARGET'));
 const replay=JSON.parse(report.groups[1].cases[0].evidence.exact),allocator=JSON.parse(report.groups[1].cases[1].evidence.exact);
 // The large operands retain actual save bytes, trace bytes and all outputs, not only a hash claim.
 const exactEqual=replay.assertions.filter(a=>a.actual.length>1000&&a.actual===a.expected);assert(exactEqual.length>=4);
 assert.equal(allocator.assertions.filter(a=>a.negated).length,1);assert(allocator.assertions.find(a=>a.negated).actual!==allocator.assertions.find(a=>a.negated).expected);
 assert.equal(report.conditions[2].kind,'Ledger reference');assert.equal(report.conditions[5].kind,'Reference plus executable supplement');assert.equal(report.conditions[6].kind,'Ledger reference');
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);const target=root+'/sources/'+s.path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
 const counts={gateItems:10,completenessCases:1,replayCases:2,assertions,codedFailures:9};fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED ACCEPTANCE AND EXECUTED CONSUMER REPLAY',sources,counts,report,scope:report.scope},null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:'PASS',...counts,reportCharacters:JSON.stringify(report,null,2).length}));
}finally{await server.close();}
