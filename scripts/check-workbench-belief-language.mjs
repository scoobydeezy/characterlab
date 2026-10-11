import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-belief-language-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root+'/receipt.json'),'immutable receipt exists');
const priorPath='docs/planning/workbench-belief-parity-rev1/receipt.json',prior=JSON.parse(fs.readFileSync(priorPath));
const paths=['src/workbench/beliefAdapter.ts','src/workbench/beliefExplanations.ts','src/workbench/BeliefWorkbench.tsx','src/workbench/beliefComparison.ts','src/workbench/experimentRegistry.ts','scripts/check-workbench-belief-language.mjs'],sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const {BeliefWorkbenchRun}=await server.ssrLoadModule('/src/workbench/beliefAdapter.ts');const results=[],rendered=new Map();let prefixes=0;
 for(const original of prior.results){const run=await BeliefWorkbenchRun.create(original.id);let old=[];
  do{const s=run.snapshot();assert.equal(s.saveHash,original.prefixes[s.prefix].saveHash);prefixes++;assert.deepEqual(s.explanations.slice(0,old.length),old,'Historical description changed');old=s.explanations;}while(await run.advance());
  const s=run.snapshot();rendered.set(s.program,s.explanations);results.push({program:s.program,saveHash:s.saveHash,explanations:s.explanations});
 }
 for(const law of [1,2,3]){
  const a=rendered.get(`misleading-law-${law}`);assert.deepEqual(a,rendered.get(`hidden-law-${law}`));
  for(const goal of [0,1])assert.deepEqual(a.filter(c=>c.kind==='Learning'),rendered.get(`goal-${goal}-law-${law}`).filter(c=>c.kind==='Learning'));
  assert.deepEqual(rendered.get(`independent-law-${law}`),rendered.get(`permuted-law-${law}`));
  assert(rendered.get(`unknown-law-${law}`).every(c=>c.kind==='Appraisal'&&!c.known));
 }
 assert.equal(prefixes,381);
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);const path=root+'/sources/'+s.path;fs.mkdirSync(path.slice(0,path.lastIndexOf('/')),{recursive:true});fs.writeFileSync(path,fs.readFileSync(s.path),{flag:'wx'});}
 fs.writeFileSync(root+'/rendered.json',JSON.stringify(results,null,2)+'\n',{flag:'wx'});const count=results.reduce((n,r)=>n+r.explanations.length,0);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED BELIEF EVALUATION LANGUAGE AUDIT',sources,reference:{path:priorPath,sha256:sha(fs.readFileSync(priorPath))},programs:results.length,prefixes,descriptions:count,scope:'Learning742 and appraisal743 only, closed admitted output roster. All hidden-world descriptions equal; goal changes leave learning descriptions equal. No current-state reconstruction, invented appraisal timestamp, calibrated-confidence or full decision narrative claim.'},null,2)+'\n',{flag:'wx'});console.log(`PASS48 programs/381 prefixes/${count} descriptions`);
}finally{await server.close();}
