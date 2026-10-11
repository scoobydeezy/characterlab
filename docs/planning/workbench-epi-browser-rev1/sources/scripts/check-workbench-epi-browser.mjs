import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-epi-browser-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const paths=['src/workbench/epiAdapter.ts','src/workbench/epiWorker.ts','src/workbench/epiWorkerClient.ts','src/workbench/epiComparison.ts','src/workbench/EpiWorkbench.tsx','src/workbench/experimentRegistry.ts','src/workbench/WorkbenchApp.tsx','scripts/check-workbench-epi-browser.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const {EpiWorkbenchRun}=await server.ssrLoadModule('/src/workbench/epiAdapter.ts');const {compareEpi}=await server.ssrLoadModule('/src/workbench/epiComparison.ts');
const results=[];for(const file of ['safe-comparison.json','violating-comparison.json']){
 const bytes=fs.readFileSync(`${root}/${file}`),actual=JSON.parse(bytes),runs=[];
 for(const s of [actual.a,actual.b]){const run=await EpiWorkbenchRun.create(s.program);for(let i=0;i<s.prefix;i++)assert.equal(await run.advance(),true);runs.push(run.snapshot());}
 assert.deepEqual(actual,compareEpi(runs[0],runs[1]));assert.equal(actual.aligned,true);assert.equal(actual.a.complete,true);assert.equal(actual.b.complete,true);
 results.push({file,sha256:sha(bytes),programs:actual.programs,prefix:actual.a.prefix,lawful:actual.lawfulCharacterAccess,characterOutputsEqual:actual.characterOutputsEqual});
}
assert.equal(results[0].lawful,true);assert.equal(results[0].characterOutputsEqual,true);assert.equal(results[1].lawful,false);assert.equal(results[1].characterOutputsEqual,false);
for(const source of sources){assert.equal(sha(fs.readFileSync(source.path)),source.sha256);const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS BOUNDED EPI BROWSER COMPARISONS',sources,results,scope:'Two established pairs, exact numeric profile; full72-program native adapter receipt remains separate. No narrative renderer or all-program browser claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS complete safe and violating browser comparisons match independent native execution');
}finally{await server.close();}
