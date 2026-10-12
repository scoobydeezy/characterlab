import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-commit-language-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const paths=['src/workbench/commitExplanations.ts','src/workbench/commitAdapter.ts','src/workbench/CommitWorkbench.tsx','src/test/workbenchCommitExplanations.test.ts','scripts/check-workbench-commit-language.mjs','docs/planning/workbench-commit-parity-rev1/receipt.json'],sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const parity=JSON.parse(fs.readFileSync(paths[5]));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {CommitWorkbenchRun,COMMIT_PROGRAMS}=await server.ssrLoadModule('/src/workbench/commitAdapter.ts'),{explainCommitObserver}=await server.ssrLoadModule('/src/workbench/commitExplanations.ts');
 const results=[];let prefixes=0,descriptions=0;const statuses=new Set();
 for(const row of COMMIT_PROGRAMS){const run=await CommitWorkbenchRun.create(row.id),checks=[];let previous=[[],[]];
  do{const s=run.snapshot(),prior=parity.results.find(r=>r.id===row.id).prefixes[s.prefix];assert.equal(s.saveHash,prior.saveHash);assert.deepEqual(s.observerViews.map(o=>o.hash),prior.observerHashes);
   const observers=s.observerViews.map(o=>{const input=JSON.parse(o.exact),language=explainCommitObserver(o.exact,o.observer),native=input.map((v,index)=>({v,index})).filter(x=>x.v.record==='CommitObservation#962/1');assert.equal(language.reports.length,native.length);assert.deepEqual(language,explainCommitObserver(o.exact,o.observer));assert.deepEqual(language.reports.slice(0,previous[o.observer].length),previous[o.observer]);previous[o.observer]=language.reports;
    language.reports.forEach((r,i)=>{assert.equal(r.sourceIndex,native[i].index);assert.deepEqual(JSON.parse(r.exact),native[i].v);assert.equal(r.status,{'0':'absent','1':'active','2':'retired'}[native[i].v['Status [5]']]);assert.deepEqual(r.task,native[i].v['Task [4]']);assert.deepEqual(r.occurrence,native[i].v['Id [1]']);statuses.add(r.status);descriptions++;});return {observer:o.observer,projectionHash:o.hash,languageHash:sha(JSON.stringify(language)),reports:language.reports.length};});
   assert.deepEqual(run.snapshot(),s);checks.push({prefix:s.prefix,saveHash:s.saveHash,observers});prefixes++;if(!await run.advance())break;
  }while(true);results.push({id:row.id,prefixes:checks});console.log(`COMMIT language ${results.length}/10`);
 }
 assert.equal(prefixes,70);assert.deepEqual([...statuses].sort(),['absent','active','retired']);
 const get=id=>results.find(r=>r.id===id).prefixes.map(p=>p.observers.map(o=>o.languageHash));assert.deepEqual(get('1/main'),get('1/hidden'));assert.deepEqual(get('1/private'),get('1/absent'));
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);const target=`${root}/sources/${s.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(s.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS BOUNDED COMMIT ADMITTED REPORT LANGUAGE',sources,programs:results.length,prefixes,observerProjections:prefixes*2,descriptions,statuses:[...statuses].sort(),results,scope:'Native-parity-bound observer projections only. Each description preserves exact observation, concrete task, occurrence, instant and status. Determinism, prior-report stability, inert hidden control, private/absent control and snapshot nonmutation pass. Knowledge updates/probes are not narrated. Browser rendering remains separately due. No current private truth or complete character narrative claim.'},null,2)+'\n',{flag:'wx'});console.log(`PASS ${prefixes} prefixes/${descriptions} descriptions`);
}finally{await server.close();}
