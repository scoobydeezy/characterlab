import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-learn-language-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const priorPath='docs/planning/workbench-learn-parity-rev1/receipt.json',prior=JSON.parse(fs.readFileSync(priorPath));
const paths=['src/workbench/learnAdapter.ts','src/workbench/learnExplanations.ts','src/workbench/LearnWorkbench.tsx','src/workbench/learnComparison.ts','src/workbench/experimentRegistry.ts','scripts/check-workbench-learn-language.mjs'];const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {LearnWorkbenchRun}=await server.ssrLoadModule('/src/workbench/learnAdapter.ts');const results=[],rendered=new Map();let prefixes=0;
 for(const original of prior.results){const run=await LearnWorkbenchRun.create(original.id);let old=[];
  do{const s=run.snapshot();assert.equal(s.saveHash,original.prefixes[s.prefix].saveHash);prefixes++;
   for(const card of old)assert.deepEqual(s.explanations.find(e=>e.id===card.id),card,'Historical evaluation wording changed');
   if(s.program.endsWith('/missing')&&s.prefix<=6)assert.deepEqual(s.explanations,[]);
   old=s.explanations;
  }while(await run.advance());
  const s=run.snapshot();rendered.set(s.program,s.explanations);results.push({program:s.program,saveHash:s.saveHash,explanations:s.explanations});
 }
 for(const law of [1,2,3])for(const numeric of [1,2]){
  assert.deepEqual(rendered.get(`${law}/${numeric}/repeated`),rendered.get(`${law}/${numeric}/hidden`));
  const zero=rendered.get(`${law}/${numeric}/zero`)[0];assert.equal(zero.measurement,'0/1');assert.equal(zero.posteriorKnown,law===2);assert.equal(zero.applied,law===2);
 }
 assert.equal(prefixes,580);for(const source of sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256);
 fs.mkdirSync(root,{recursive:true});for(const source of sources){const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/rendered.json`,JSON.stringify(results,null,2)+'\n',{flag:'wx'});
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS BOUNDED LEARN APPLICATION LANGUAGE AUDIT',sources,reference:{path:priorPath,sha256:sha(fs.readFileSync(priorPath))},programs:results.length,prefixes,explanations:results.reduce((n,r)=>n+r.explanations.length,0),limits:['Application descriptions only; not decision reasons or full corpus narrative qualification.','Consumes native Record892, nested admitted evidence887/891 and estimate889 only; no general trace redaction claim.','Candidate/control status remains explicit. Missing prior and raw zero reference remain distinct.']},null,2)+'\n',{flag:'wx'});console.log(`PASS ${results.length} programs/${prefixes} prefixes; ${results.reduce((n,r)=>n+r.explanations.length,0)} frozen learning descriptions`);
}finally{await server.close();}
