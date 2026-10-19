import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/workbench-disposition-pair-browser-rev1',read=p=>JSON.parse(fs.readFileSync(p)),sha=b=>createHash('sha256').update(b).digest('hex');
const b=read(root+'/browser.json'),sources=read(root+'/sources.json');assert(!fs.existsSync(root+'/receipt.json'));
for(const s of sources){assert.equal(sha(fs.readFileSync(s.path)),s.sha256);assert.equal(sha(fs.readFileSync(root+'/sources/'+s.path)),s.sha256);}
assert.equal(b.paused.a.prefix,b.paused.b.prefix);assert(b.paused.a.prefix>0&&b.paused.a.prefix<18);assert.deepEqual(b.restored,b.paused);assert.deepEqual(b.mainAfter,b.mainBefore);assert.equal(b.advanced.a.prefix,b.paused.a.prefix+1);assert.equal(b.advanced.b.prefix,b.advanced.a.prefix);assert.deepEqual(b.continued,b.advanced);assert.deepEqual(b.afterModes,b.paused);
const nativeManifestPath='docs/planning/workbench-disposition-parity-rev1/frozen.json',nativeManifest=read(nativeManifestPath); for(const source of nativeManifest.sources)assert.equal(sha(fs.readFileSync(source.path)),source.sha256);
const plan=read('docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json');
for(const report of [b.zero,b.paused,b.advanced,b.restored,b.continued])for(const side of ['a','b']){const s=report[side],r=plan.runs.find(r=>r.law+'/'+r.name===s.program),original=read(`docs/planning/DISPOSITION_PUBLIC_RUN_${r.index}_REV1.json`);assert.equal(s.saveHash,original.prefixes.find(p=>p.at===s.prefix).saveSha256);}
const server=await createServer({configFile:false,server:{watch:null,middlewareMode:true,hmr:false,ws:false},appType:'custom'});
try{
 const {DispositionWorkbenchRun}=await server.ssrLoadModule('/src/workbench/dispositionAdapter.ts'),{compareDisposition}=await server.ssrLoadModule('/src/workbench/dispositionComparison.ts');
 const a=await DispositionWorkbenchRun.create(b.zero.a.program),c=await DispositionWorkbenchRun.create(b.zero.b.program);assert(b.advanced.a.prefix<=3);
 for(let prefix=0;prefix<=b.advanced.a.prefix;prefix++){
  if(prefix){await a.advance();await c.advance();}
  const native=await compareDisposition(b.zero.contrast.id,a.snapshot(),c.snapshot());for(const report of [b.zero,b.paused,b.advanced,b.restored,b.continued])if(report.a.prefix===prefix)assert.deepEqual(report,native);console.log(`PASS exact native/browser pair prefix ${prefix}`);
 }
 for(const s of sources)assert.equal(sha(fs.readFileSync(s.path)),s.sha256);
 fs.writeFileSync(root+'/receipt.json',JSON.stringify({status:'PASS BOUNDED DISPOSITION PAIR BROWSER',sources,nativeSources:{path:nativeManifestPath,sha256:sha(fs.readFileSync(nativeManifestPath))},originals:['docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json','docs/planning/DISPOSITION_PUBLIC_RUN_0_REV1.json','docs/planning/DISPOSITION_PUBLIC_RUN_13_REV1.json'].map(path=>({path,sha256:sha(fs.readFileSync(path))})),checker:{path:'scripts/check-workbench-disposition-pair-browser.mjs',sha256:sha(fs.readFileSync('scripts/check-workbench-disposition-pair-browser.mjs'))},artifacts:['browser.json','pair.png'].map(path=>({path,sha256:sha(fs.readFileSync(root+'/'+path))})),comparison:b.zero.contrast.id,pausePrefix:b.paused.a.prefix,continuedPrefix:b.advanced.a.prefix,scope:'One constitutional pair: original prefix saves and exact fresh native comparison reports; nonterminal whole-pair pause, in-memory pair capture/restore, exact next continuation, mode persistence and main-worker isolation. No file transfer, all-contrast/full-horizon qualification, character narration, resource or general causal claim.'},null,2)+'\n',{flag:'wx'});
}finally{await server.close();}
