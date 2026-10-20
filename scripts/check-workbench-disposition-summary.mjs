import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {gunzipSync,gzipSync} from 'node:zlib';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-summary-rev2',prior='docs/planning/workbench-disposition-comparison-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const sources=['src/workbench/dispositionComparisonSummary.ts','src/workbench/DispositionComparisonSummaryPanel.tsx','src/workbench/DispositionComparisonPanel.tsx','src/workbench/dispositionDivergenceHistory.ts','scripts/check-workbench-disposition-summary.mjs',prior+'/receipt.json'].map(path=>{
 const b=fs.readFileSync(path),target=root+'/sources/'+path;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,b,{flag:'wx'});return{path,sha256:sha(b)};
});
fs.writeFileSync(root+'/freeze.json',JSON.stringify({sources},null,2)+'\n',{flag:'wx'});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {dispositionComparisonSummary:summary}=await server.ssrLoadModule('/src/workbench/dispositionComparisonSummary.ts');
 const priorReceipt=JSON.parse(fs.readFileSync(prior+'/receipt.json')),groups=new Map(),results=[];
 for(const a of priorReceipt.artifacts.filter(a=>a.path.startsWith('comparison-'))){
  const bytes=fs.readFileSync(prior+'/'+a.path);assert.equal(sha(bytes),a.sha256);const r=JSON.parse(gunzipSync(bytes));
  const group=groups.get(r.contrast.id)??[];group.push(r);groups.set(r.contrast.id,group);
 }
 let count=0,maxCharacters=0;
 for(const [id,reports] of groups){
  reports.sort((a,b)=>a.a.prefix-b.a.prefix);assert.equal(reports.length,19);const history=[];
  for(const r of reports){
   history.push(r);const before=JSON.stringify(history),s=summary(r,history);
   assert.equal(JSON.stringify(history),before);assert.deepEqual(s.artifact.comparison,r);assert.deepEqual(s.artifact.history,history.map(x=>({prefix:x.a.prefix,a:x.a,b:x.b,stateEqual:x.stateEqual,saveEqual:x.saveEqual,mechanismProjectionEqual:x.mechanismProjectionEqual,changedPaths:x.fields.filter(f=>!f.equal).map(f=>f.path)})));
   assert.deepEqual(s.artifact.branches,{a:r.a,b:r.b});assert.deepEqual(s.artifact.declaredChange.inputs,r.inputDifferences);
   assert.deepEqual(s,summary(structuredClone(r),structuredClone(history)));
   assert.deepEqual(JSON.parse(s.text.split('\nExact report:\n')[1]),s.artifact);
   assert.deepEqual(s.artifact.divergence.missingPrefixes,[]);maxCharacters=Math.max(maxCharacters,s.text.length);count++;
   const state=history.find(x=>!x.stateEqual),projection=history.find(x=>!x.mechanismProjectionEqual);
   assert.equal(s.artifact.divergence.firstStateDifference?.prefix,state?.a.prefix);assert.equal(s.artifact.divergence.firstMechanismProjectionDifference?.prefix,projection?.a.prefix);
   if(r.a.prefix===18){const path=id.replaceAll('/','-')+'.txt.gz',b=gzipSync(s.text);fs.writeFileSync(root+'/'+path,b,{flag:'wx'});results.push({id,path,sha256:sha(b)});}
  }
  const sparse=summary(reports[2],[reports[2]]);assert.deepEqual(sparse.artifact.divergence.missingPrefixes,[0,1]);
  assert.throws(()=>summary(reports[1],reports.slice(0,3)),/older/);
  const conflict=structuredClone(reports[1]);conflict.a.saveHash='different';
  assert.throws(()=>summary(conflict,reports.slice(0,2)));
  const detached=summary(reports[0],[reports[0]]);detached.artifact.comparison.a.program='changed';assert.notEqual(reports[0].a.program,'changed');
 }
 assert.equal(groups.size,30);assert.equal(count,570);
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DISPOSITION COMPARISON SUMMARY',sources,counts:{contrasts:groups.size,reports:count,maxCharacters},results,scope:'All30 declared contrasts at19 archived prefixes:570 deterministic summaries preserve source reports, input changes, exact branch identities and retained history. Sparse history remains explicit; conflicting/stale history rejects. Detached output and exact embedded JSON verified. Summary is researcher evidence, not a save, player disclosure or meaningful-character-divergence claim. Browser clipboard transport remains separate.'},null,2)+'\n',{flag:'wx'});console.log(`PASS ${count} summaries; max ${maxCharacters} characters`);
}finally{await server.close();}
