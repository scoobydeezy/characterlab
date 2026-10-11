import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-learn-browser-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const paths=['src/workbench/learnAdapter.ts','src/workbench/learnWorker.ts','src/workbench/learnWorkerClient.ts','src/workbench/learnComparison.ts','src/workbench/LearnWorkbench.tsx','src/workbench/experimentRegistry.ts','src/workbench/WorkbenchApp.tsx','scripts/check-workbench-learn-browser.mjs'];
const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {LearnWorkbenchRun}=await server.ssrLoadModule('/src/workbench/learnAdapter.ts');const {compareLearn}=await server.ssrLoadModule('/src/workbench/learnComparison.ts');
 const actual=JSON.parse(fs.readFileSync(`${root}/comparison.json`)),runs=[];
 for(const s of [actual.a,actual.b]){const run=await LearnWorkbenchRun.create(s.program);for(let i=0;i<s.prefix;i++)assert.equal(await run.advance(),true);runs.push(run.snapshot());}
 assert.deepEqual(actual,compareLearn(runs[0],runs[1]));assert.equal(actual.aligned,true);assert.equal(actual.a.complete,true);assert.equal(actual.b.complete,true);assert.equal(actual.outputsEqual,true);assert.equal(actual.stateEqual,true);assert.equal(actual.exactSaveEqual,false);
 const checkpoint=JSON.parse(fs.readFileSync(`${root}/checkpoint.json`)),restored=await LearnWorkbenchRun.restore(checkpoint);while(await restored.advance()){}
 assert.deepEqual(restored.snapshot(),actual.a);
 const browserRestored=JSON.parse(fs.readFileSync(`${root}/restored-final.json`));assert.deepEqual(browserRestored,restored.checkpoint());
 for(const source of sources){assert.equal(sha(fs.readFileSync(source.path)),source.sha256);const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS BOUNDED LEARN BROWSER PAIR AND REPLAY',sources,artifacts:['checkpoint.json','comparison.json','restored-final.json'].map(path=>({path,sha256:sha(fs.readFileSync(`${root}/${path}`))})),programs:actual.programs,prefix:actual.a.prefix,scope:'Gated exact repeated/hidden pair; complete browser export equals native adapter output, replay from prefix1 to terminal8. Separate39-program native cohort retained; no all-program browser or language claim.'},null,2)+'\n',{flag:'wx'});
 console.log('PASS LEARN browser comparison and complete checkpoint continuation match native execution');
}finally{await server.close();}
