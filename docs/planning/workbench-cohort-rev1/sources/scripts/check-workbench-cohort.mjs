import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const root='docs/planning/workbench-cohort-rev1', sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const paths=['src/workbench/participationCohort.ts','src/workbench/AuditCohortInspector.tsx','src/workbench/participation.ts','src/workbench/GeneralWorkbench.tsx','src/workbench/generalAdapter.ts','scripts/check-workbench-cohort.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const baselinePath='docs/planning/workbench-participation-rev1/report.json';
const baseline=JSON.parse(fs.readFileSync(baselinePath,'utf8'));
const prior=JSON.parse(fs.readFileSync('docs/planning/workbench-general-parity-rev1/receipt.json','utf8')).results.find(r=>r.recipe==='association-decay');
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try {
 const {GeneralWorkbenchRun}=await server.ssrLoadModule('/src/workbench/generalAdapter.ts');
 const {participationReport}=await server.ssrLoadModule('/src/workbench/participation.ts');
 const {aggregateParticipation}=await server.ssrLoadModule('/src/workbench/participationCohort.ts');
 const run=await GeneralWorkbenchRun.create('association-decay');let checked=0;
 do {assert.equal(run.snapshot().saveHash,prior.prefixes[run.snapshot().prefix].saveHash);checked++;} while(await run.advance());
 const s=run.snapshot(),identity=Object.fromEntries(['modelHash','runHash','saveHash','stateHash','prefix'].map(k=>[k,s[k]]));
 const report=participationReport(identity,s.timeline,s.fields);
 const cohort=aggregateParticipation([{name:'baseline',seamVersion:s.seamVersion,report:baseline},{name:'association-decay',seamVersion:s.seamVersion,report}]);
 assert.equal(cohort.members.length,2);assert.equal(cohort.groups.length,2);assert.equal(checked,12);
 for(const source of sources) assert.equal(sha(fs.readFileSync(source.path)),source.sha256);
 fs.mkdirSync(root,{recursive:true});for(const source of sources){const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/cohort.json`,JSON.stringify(cohort,null,2)+'\n',{flag:'wx'});
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS BOUNDED NAMED-RUN AGGREGATION',sources,baseline:{path:baselinePath,sha256:sha(fs.readFileSync(baselinePath))},associationDecayPrefixes:checked,runs:2,modelGroups:2,limitations:['Two General attention recipes only; no full corpus acceptance','Cross-model path equivalence intentionally not inferred; causal contribution unknown']},null,2)+'\n',{flag:'wx'});
 console.log('PASS two named runs in separate exact model groups;12 association-decay prefixes');
} finally {await server.close();}
