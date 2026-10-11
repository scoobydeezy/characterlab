import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-belief-comparisons-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root+'/receipt.json'),'immutable receipt exists');
const priorPath='docs/planning/workbench-belief-parity-rev1/receipt.json',prior=JSON.parse(fs.readFileSync(priorPath));
const paths=['src/workbench/beliefAdapter.ts','src/workbench/beliefComparison.ts','scripts/check-workbench-belief-comparisons.mjs'],sources=paths.map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {BeliefWorkbenchRun}=await server.ssrLoadModule('/src/workbench/beliefAdapter.ts'),{BELIEF_CONTRASTS,compareBelief}=await server.ssrLoadModule('/src/workbench/beliefComparison.ts');
 const {decodeBelief}=await server.ssrLoadModule('/src/campaign3/beliefCodecs.ts'),{exactKey}=await server.ssrLoadModule('/src/workbench/canonical.ts');
 const views=new Map();let prefixes=0;
 for(const name of new Set(BELIEF_CONTRASTS.flatMap(c=>[c.a,c.b]))){const run=await BeliefWorkbenchRun.create(name),old=prior.results.find(r=>r.id===name);do{const s=run.snapshot();assert.equal(s.saveHash,old.prefixes[s.prefix].saveHash);prefixes++;}while(await run.advance());views.set(name,run.snapshot());}
 const comparisons=BELIEF_CONTRASTS.map(c=>compareBelief(c.id,views.get(c.a),views.get(c.b)));
 for(const c of comparisons){assert.equal(c.aligned,true);assert.equal(c.exactSaveEqual,false);
  if(c.contrast.id.startsWith('hidden/')){assert.equal(c.admittedOutputsEqual,true);assert.equal(c.beliefStateEqual,true);}
  if(c.contrast.id.startsWith('display/')){assert.equal(c.admittedOutputsEqual,false);assert.equal(c.beliefStateEqual,c.contrast.id==='display/3');}
  if(c.contrast.id.startsWith('goal/'))assert.equal(c.beliefStateEqual,true);
  if(c.contrast.id.startsWith('law/'))assert.equal(c.beliefStateEqual,false);
  if(c.contrast.kind==='input'){
   const [a,b]=c.originals.map(r=>decodeBelief(Uint8Array.from(Buffer.from(r.orderedInputs,'hex'))).items);assert.equal(a.length,b.length);
   let changes=0;for(let i=0;i<a.length;i++){assert.equal(exactKey(a[i].fields.get(1n)),exactKey(b[i].fields.get(1n)));const af=a[i].fields.get(2n).items,bf=b[i].fields.get(2n).items;assert.equal(af.length,bf.length);for(let j=0;j<af.length;j++)for(let k=1n;k<=7n;k++){const equal=exactKey(af[j].fields.get(k))===exactKey(bf[j].fields.get(k));if(!equal){changes++;assert((c.contrast.id.startsWith('hidden/')?[2n,3n]:[7n]).includes(k),'undeclared original field changed');}}}assert(changes>0);
  }
 }
 for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);const path=root+'/sources/'+s.path;fs.mkdirSync(path.slice(0,path.lastIndexOf('/')),{recursive:true});fs.writeFileSync(path,fs.readFileSync(s.path),{flag:'wx'});}
 fs.writeFileSync(root+'/comparisons.json',JSON.stringify(comparisons,null,2)+'\n',{flag:'wx'});fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS DECLARED BELIEF COMPARISONS',sources,reference:{path:priorPath,sha256:sha(fs.readFileSync(priorPath))},comparisons:comparisons.length,programs:views.size,prefixes,scope:'Fourteen declared hidden-world/display/goal/law contrasts; original-field differences audited. Native parity preserved; browser and language qualification remain separate.'},null,2)+'\n',{flag:'wx'});console.log(`PASS ${comparisons.length} contrasts/${views.size} programs/${prefixes} prefixes`);
}finally{await server.close();}
