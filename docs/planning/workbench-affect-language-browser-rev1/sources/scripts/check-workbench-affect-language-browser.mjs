import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-affect-language-browser-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(`${root}/receipt.json`),'immutable receipt exists');
const captures=['instant13.json','instant14.json','character-latest.json','historical.png','latest.png'];const inputs=captures.map(name=>({path:`${root}/${name}`,sha256:sha(fs.readFileSync(`${root}/${name}`))}));
const paths=['src/workbench/affectSupplementAdapter.ts','src/workbench/affectSupplementFixtures.json','src/workbench/affectExplanations.ts','src/workbench/beliefExplanations.ts','src/workbench/AffectExplanationView.tsx','src/workbench/AffectWorkbench.tsx','src/workbench/affectComparison.ts','src/workbench/experimentRegistry.ts','scripts/check-workbench-affect-language-browser.mjs'];const sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {AffectSupplementRun}=await server.ssrLoadModule('/src/workbench/affectSupplementAdapter.ts');const run=await AffectSupplementRun.create('interior/candidate-3-feedback-true');for(let i=0;i<14;i++)assert(await run.advance());const snapshot=run.snapshot();
 for(const [name,instant] of [['instant13',13],['instant14',14],['character-latest',14]]){
  const observed=JSON.parse(fs.readFileSync(`${root}/${name}.json`));assert.equal(observed.status,'Prefix 14 · instant 14 · Complete');
  assert.deepEqual(observed.cards,snapshot.explanations.filter(c=>c.at===String(instant)).map(c=>({caption:`Instant ${c.at} · ${c.kind}`,headline:c.headline,human:c.human,provenance:c.provenance})));
  for(const key of ['modelHash','runHash','saveHash','stateHash'])assert.equal(observed.hashes[key],snapshot[key]);assert.equal(observed.cards.length,2);
 }
 for(const source of sources){assert.equal(sha(fs.readFileSync(source.path)),source.sha256);const target=`${root}/sources/${source.path}`;fs.mkdirSync(target.slice(0,target.lastIndexOf('/')),{recursive:true});fs.writeFileSync(target,fs.readFileSync(source.path),{flag:'wx'});}
 for(const input of inputs)assert.equal(sha(fs.readFileSync(input.path)),input.sha256);
 fs.writeFileSync(`${root}/receipt.json`,JSON.stringify({status:'PASS AFFECT EVALUATION LANGUAGE BROWSER',renderer:'affect-evaluation-explanation/0.1',sources,inputs,program:snapshot.program,prefix:14,scope:'Latest and historical appraisal/decision descriptions and exact provenance equal native-backed detached explanations. Selecting instant13 and returning to Character latest14 preserves all four identity/state/save hashes. Screenshot layout inspected at default desktop width. Full corpus language qualification is separate; no general character narrative claim.'},null,2)+'\n',{flag:'wx'});console.log('PASS AFFECT browser language: historical13/latest14, exact provenance, unchanged hashes');
}finally{await server.close();}
