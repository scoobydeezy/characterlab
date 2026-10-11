import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
await import('./check-commit-closure.mjs');
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),ref=path=>({path,sha256:sha(path)});
const plan=read(p+'COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json'),result=read(p+'COMMIT_PUBLIC_EXPERIMENT_REV1.json');assert.equal(result.results.reduce((n,r)=>n+r.prefixes,0),70);
for(let i=0;i<10;i++)for(const k of ['law','name','modelIdentity','runIdentity','orderedInputs'])assert.equal(result.results[i][k],plan.runs[i][k]);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});const instances=[];
try{
 const codec=await server.ssrLoadModule('/src/campaign3/commitCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 for(const row of result.results){
  const probes=row.probes.map(p=>p.instances.map(hex=>{const r=data.dataRecord(codec.decodeCommit(Uint8Array.from(Buffer.from(hex,'hex'))),955n);return {task:data.dataKey(data.dataField(r,1n)),version:String(data.dataField(r,2n).value),status:String(data.dataField(r,3n).value),cause:String(data.dataField(r,4n).value)};}));
  instances.push({name:row.name,law:row.law,probes});
 }
 const a=instances.find(r=>r.name==='main'&&r.law===1).probes,b=instances.find(r=>r.name==='main'&&r.law===4).probes;
 assert.deepEqual(a.map(x=>x.length),[0,1,1,2,2]);const A=a[1][0].task,B=a[3].find(x=>x.task!==A).task;assert.notEqual(A,B);
 assert.deepEqual(a[1][0],{task:A,version:'1',status:'1',cause:'0'});
 assert.deepEqual(a[2][0],{task:A,version:'2',status:'2',cause:'1'});
 assert.deepEqual(a[3].find(x=>x.task===A),a[2][0]);assert.deepEqual(a[3].find(x=>x.task===B),{task:B,version:'1',status:'1',cause:'0'});assert.deepEqual(a[4],a[3]);
 assert.equal(b[3].length,1);assert.equal(b[3][0].task,A);assert.equal(b[3][0].version,'3');assert.equal(b[3][0].status,'1');
}finally{await server.close();}
const tests=read(p+'COMMIT_PUBLIC_TESTS_REV1.json');assert.equal(tests.numPassedTests,27);assert.equal(tests.numFailedTests,0);
const receipt={status:'PASS; HQ011 OPEN',scope:'Exact original closure,10ordered input/result joins and decoded persisted instance955 histories checked. Original70prefix/144affected/328reference evidence historical;no fresh simulation,rollback or tests.',runs:10,prefixes:70,instances,sources:['scripts/check-commit-closure.mjs','scripts/qualify-commit-public.mjs','src/campaign3/commitCodecs.ts',p+'COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json',p+'COMMIT_PUBLIC_EXPERIMENT_REV1.json',p+'COMMIT_VALIDATION_CLOSURE_REV1.json',p+'COMMIT_PUBLIC_TESTS_REV1.json'].map(ref),checker:ref('scripts/check-history-commit-authority.mjs')};
const O=p+'campaign3-history-commit-authority-rev1/';fs.mkdirSync(O,{recursive:true});if(fs.existsSync(O+'canonical-check.json'))assert.deepEqual(read(O+'canonical-check.json'),receipt);else fs.writeFileSync(O+'canonical-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log('PASS: COMMIT persisted retirement/new-instance versus reused-instance histories.');
