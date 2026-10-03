/** Execution-only partition of the already frozen qualification matrix. */
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {Worker,isMainThread,workerData,parentPort} from 'node:worker_threads';import {createServer} from 'vite';
const p='docs/planning/',planPath=p+'CROSS_CONTEXT_IDENTITY_PLAN_REV1.json',executionPath=p+'CROSS_CONTEXT_IDENTITY_EXECUTION_REV1.json',resultPath=p+'CROSS_CONTEXT_IDENTITY_RESULT_REV1.json',hash=b=>createHash('sha256').update(b).digest('hex'),plan=JSON.parse(fs.readFileSync(planPath));
const execution={scope:'Execution-only partition; no model/run/comparison bytes changed; each complete prefix and one successor reexecutes actual kernels.',workers:4,planSha256:hash(fs.readFileSync(planPath)),runnerSha256:hash(fs.readFileSync('scripts/execute-cross-context-identity.mjs')),originalHarnessSha256:hash(fs.readFileSync('scripts/qualify-cross-context-identity.mjs')),priorAttempt:'Serial session69781 verified16 runs at least; interrupted for throughput before any final result was written. No failed behavioral assertion reported.'};
if(isMainThread&&process.argv.includes('--freeze')){fs.writeFileSync(executionPath,JSON.stringify(execution,null,2)+'\n',{flag:'wx'});console.log('Frozen execution-only partition; original127 runs unchanged.');}
else{
 assert.deepEqual(JSON.parse(fs.readFileSync(executionPath)),execution);for(const a of plan.artifacts)assert.equal(hash(fs.readFileSync(a.path)),a.sha256,a.path);assert(!fs.existsSync(resultPath));
 if(!isMainThread){
  const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
  try{const m=await server.ssrLoadModule('/src/campaign3/crossContextIdentity.ts'),c=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),results=[];
   for(const [index,row] of plan.runs.entries()){if(index%4!==workerData)continue;const run=m.createCrossContextRun(row.law,row.inputs,row.seed),saves=[run.save()];while(await run.step())saves.push(run.save());for(let i=0;i<=5;i++){const restored=await m.restoreCrossContextRun(row.law,row.inputs,row.seed,i,saves[i]);assert.deepEqual(restored.save(),saves[i]);assert.equal(await restored.step(),i<5);assert.deepEqual(restored.save(),saves[Math.min(i+1,5)]);}results.push({...row,inputs:undefined,prefixHashes:saves.map(hash),safeHash:hash(c.canonicalEncode(run.observerView())),stateHash:hash(c.canonicalEncode(run.snapshot())),rows:m.crossContextSummary(run.observerView())});parentPort.postMessage({done:index});}
   const chunk=p+'CROSS_CONTEXT_IDENTITY_EXECUTION_PART'+workerData+'_REV1.json';fs.writeFileSync(chunk,JSON.stringify({executionSha256:hash(fs.readFileSync(executionPath)),results},null,2)+'\n',{flag:'wx'});
  }finally{await server.close();}
 }else{
  let completed=0;await Promise.all(Array.from({length:4},(_,i)=>new Promise((resolve,reject)=>{const worker=new Worker(new URL(import.meta.url),{workerData:i});worker.on('message',()=>{completed++;if(completed%8===0)console.log('Verified '+completed+'/127 independent runs and all prefix successors.');});worker.on('error',reject);worker.on('exit',code=>code===0?resolve():reject(Error('worker exit '+code)));})));
  const byIdentity=new Map();for(let i=0;i<4;i++){const part=JSON.parse(fs.readFileSync(p+'CROSS_CONTEXT_IDENTITY_EXECUTION_PART'+i+'_REV1.json'));assert.equal(part.executionSha256,hash(fs.readFileSync(executionPath)));for(const row of part.results){assert(!byIdentity.has(row.runIdentity));byIdentity.set(row.runIdentity,row);}}
  assert.equal(byIdentity.size,127);const results=plan.runs.map(row=>{const r=byIdentity.get(row.runIdentity);assert(r);for(const k of ['law','name','seed','modelIdentity','runIdentity'])assert.equal(r[k],row[k]);return r;});
  // Execute the exact frozen post-run assertions and result writer, not a rewritten
  // set of scientific checks. Only the independently produced results are supplied.
  const source=fs.readFileSync('scripts/qualify-cross-context-identity.mjs','utf8'),start=source.indexOf("  const get=(law,name='main'"),end=source.indexOf('\n }\n}finally',start);assert(start>0&&end>start);
  const validate=new Function('results','m','assert','fs','resultPath','hash','planPath',source.slice(start,end));validate(results,{LAWS:plan.models.map(x=>x.law)},assert,fs,resultPath,hash,planPath);
  console.log('Original frozen post-run checks and result writer completed.');
 }
}
