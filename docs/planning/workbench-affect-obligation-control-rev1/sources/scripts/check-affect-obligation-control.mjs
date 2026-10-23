import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-affect-obligation-control-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});const write=(name,value)=>fs.writeFileSync(root+'/'+name,JSON.stringify(value,null,2)+'\n',{flag:'wx'});
const paths=['src/workbench/affectComparison.ts','src/workbench/affectChoiceComparison.ts','src/workbench/AffectPairedWorkbench.tsx','src/workbench/AffectAppraisalComparisonPanel.tsx','src/workbench/affectPairSession.ts','src/test/workbenchAffectObligationControl.test.ts','src/test/workbenchAffectChoiceComparison.test.ts','scripts/check-affect-obligation-control.mjs'];
const sources=paths.map(path=>{const bytes=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});return{path,copy,sha256:sha(bytes)};});
const references=['docs/planning/workbench-affect-parity-rev1/receipt.json','docs/planning/workbench-affect-obligation-preflight-rev1/receipt.json','docs/planning/workbench-batch-parity-rev8/manifest.json'].map(path=>({path,sha256:sha(fs.readFileSync(path))}));
const [parity,preflight,batch]=references.map(r=>JSON.parse(fs.readFileSync(r.path)));for(const s of batch.sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);write('freeze.json',{sources,references,sharedSources:batch.sources});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'}),results=[];
try{
 const {AffectPairSession}=await server.ssrLoadModule('/src/workbench/affectPairSession.ts'),{createAffectInspection,restoreAffectInspection}=await server.ssrLoadModule('/src/workbench/affectSession.ts'),{AFFECT_OBLIGATION_CONTRASTS,summarizeAffectComparison}=await server.ssrLoadModule('/src/workbench/affectComparison.ts'),{compareAffectChoices}=await server.ssrLoadModule('/src/workbench/affectChoiceComparison.ts');const factory={create:createAffectInspection,restore:restoreAffectInspection};
 for(const [index,c] of AFFECT_OBLIGATION_CONTRASTS.entries()){
  const pair=await AffectPairSession.create(c.id,factory),prefixes=[];let priorRows=[];
  do{const report=pair.snapshot().comparison;assert(report.aligned);for(const branch of ['a','b']){const s=report[branch],p=parity.results.find(r=>r.id===s.program).prefixes[s.prefix];for(const key of ['stateHash','outputsHash','saveHash'])assert.equal(s[key],p[key]);}
   const choices=compareAffectChoices(report.a.explanations,report.b.explanations);assert.deepEqual(choices.rows.slice(0,priorRows.length),priorRows);priorRows=choices.rows;
   prefixes.push({prefix:report.a.prefix,summary:summarizeAffectComparison(report),choices});
   if(index===0&&[0,3].includes(report.a.prefix))write(`browser-oracle-${report.a.prefix}.json`,report);
  }while(await pair.advance());
  const terminal=pair.snapshot();assert(terminal.comparison.a.complete&&terminal.comparison.b.complete);assert.equal(prefixes.length,11);assert.equal(prefixes.at(-1).choices.firstDifferentChoice,preflight.results[index].firstDifferentChoice);
  const checkpoint=await pair.checkpoint(),restored=await AffectPairSession.restore(checkpoint,factory);assert.deepEqual(restored.snapshot(),terminal);assert.deepEqual(await restored.checkpoint(),checkpoint);assert.equal(await restored.advance(),false);assert.deepEqual(restored.snapshot(),terminal);
  const file=`pair-${index}.json`;write(file,{contrast:c.id,prefixes,terminalRestore:true});results.push({contrast:c.id,file,sha256:sha(fs.readFileSync(root+'/'+file)),prefixes:prefixes.length});pair.dispose();restored.dispose();console.log(`PASS obligation pair ${index+1}/8 full horizon and restore`);
 }
 for(const s of [...sources,...references,...batch.sources])assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 write('receipt.json',{status:'PASS EIGHT ORIGINAL OBLIGATION PAIRS',pairs:8,pairedPrefixes:88,results,scope:'All eight declared original obligation pairs0..10, original native prefix identities, stable choice histories/first-choice witnesses and terminal paired restore/no-op. Browser control and integrated entry separately qualified.'});
}catch(error){write('failure.json',{message:String(error),stack:error.stack,completed:results});throw error;}finally{await server.close();}
