import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-affect-retained-pair-rev1',sha=b=>createHash('sha256').update(b).digest('hex');assert(!fs.existsSync(root));fs.mkdirSync(root,{recursive:true});
const write=(p,v)=>fs.writeFileSync(root+'/'+p,JSON.stringify(v,null,2)+'\n',{flag:'wx'});
const paths=['src/workbench/affectPairSession.ts','src/workbench/AffectPairedWorkbench.tsx','src/workbench/AffectWorkbench.tsx','src/workbench/AffectAppraisalComparisonPanel.tsx','src/workbench/affectAppraisalDecision.ts','src/workbench/affectWorkerClient.ts','src/test/workbenchAffectPairSession.test.ts','scripts/check-affect-retained-pair.mjs'];
const sources=paths.map(path=>{const bytes=fs.readFileSync(path),copy=root+'/sources/'+path;fs.mkdirSync(copy.slice(0,copy.lastIndexOf('/')),{recursive:true});fs.writeFileSync(copy,bytes,{flag:'wx'});return{path,copy,sha256:sha(bytes)};});write('freeze.json',{sources});
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {AffectPairSession}=await server.ssrLoadModule('/src/workbench/affectPairSession.ts'),{createAffectInspection,restoreAffectInspection}=await server.ssrLoadModule('/src/workbench/affectSession.ts'),{summarizeAffectComparison}=await server.ssrLoadModule('/src/workbench/affectComparison.ts'),{participationReport}=await server.ssrLoadModule('/src/workbench/participation.ts');
 const pair=await AffectPairSession.create('hidden-world',{create:createAffectInspection,restore:restoreAffectInspection}),results=[];
 for(let prefix=0;prefix<=2;prefix++){
  const view=pair.snapshot(),report=view.comparison;results.push({prefix,report,summary:summarizeAffectComparison(report),architecture:Object.fromEntries(['a','b'].map(branch=>{const s=report[branch];return[branch,participationReport({modelHash:s.modelHash,runHash:s.runHash,saveHash:s.saveHash,stateHash:s.stateHash,prefix:s.prefix},s.timeline,s.fields)];}))});
  if(prefix<2)await pair.advance();
 }
 write('native.json',results);for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 write('native-receipt.json',{status:'PASS RETAINED AFFECT PAIR BROWSER ORACLE',prefixes:3,programs:['baseline','hidden'],artifact:{path:'native.json',sha256:sha(fs.readFileSync(root+'/native.json'))},scope:'Native browser oracle0/1/2 only. Three lifecycle tests separately qualify eight initial contrasts, two native pairs continuation/restore and failure guards.'});
}catch(error){write('failure.json',{message:String(error),stack:error.stack});throw error;}finally{await server.close();}
