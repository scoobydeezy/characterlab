import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-epi-language-rev1',sha=b=>createHash('sha256').update(b).digest('hex');
assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const priorPath='docs/planning/workbench-epi-parity-rev1/receipt.json',prior=JSON.parse(fs.readFileSync(priorPath));
const paths=['src/workbench/epiAdapter.ts','src/workbench/epiExplanations.ts','src/workbench/EpiWorkbench.tsx','scripts/check-workbench-epi-language.mjs'];const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const {EpiWorkbenchRun}=await server.ssrLoadModule('/src/workbench/epiAdapter.ts');const results=[];const rendered=new Map();let prefixes=0;
 for(const original of prior.results){const run=await EpiWorkbenchRun.create(original.id);let old=[];
  do{const s=run.snapshot();assert.equal(s.saveHash,original.prefixes[s.prefix].saveHash);prefixes++;
   for(const card of old)assert.deepEqual(s.explanations.find(e=>e.id===card.id),card,'Historical evaluation wording changed');
   if(!s.lawfulCharacterAccess)assert.deepEqual(s.explanations,[]);
   old=s.explanations;
  }while(await run.advance());
  const s=run.snapshot();rendered.set(s.program,s.explanations);results.push({program:s.program,lawful:s.lawfulCharacterAccess,saveHash:s.saveHash,explanations:s.explanations});
 }
 for(const numeric of [1,2])for(const name of ['established','informative','fresh','missing'])assert.deepEqual(rendered.get(`1/${numeric}/${name}A`),rendered.get(`1/${numeric}/${name}B`));
 for(const numeric of [1,2]){assert.deepEqual(rendered.get(`1/${numeric}/missingA`),[]);assert.equal(rendered.get(`1/${numeric}/zero`)[0].measurement,'0/1');}
 assert.equal(prefixes,240);for(const source of sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256);
 fs.mkdirSync(root,{recursive:true});for(const source of sources){const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 fs.writeFileSync(`${root}/rendered.json`,JSON.stringify(results,null,2)+'\n',{flag:'wx'});
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS BOUNDED EPI ENCODING LANGUAGE AUDIT',sources,reference:{path:priorPath,sha256:sha(fs.readFileSync(priorPath))},programs:results.length,prefixes,explanations:results.reduce((n,r)=>n+r.explanations.length,0),limits:['Encoding descriptions only; not decision reasons or full corpus narrative qualification.','Frozen native EPI evidence only; no general trace redaction claim.','Violating controls have no character narrative.']},null,2)+'\n',{flag:'wx'});console.log(`PASS ${results.length} programs/${prefixes} prefixes; ${results.reduce((n,r)=>n+r.explanations.length,0)} frozen encoding descriptions`);
}finally{await server.close();}
