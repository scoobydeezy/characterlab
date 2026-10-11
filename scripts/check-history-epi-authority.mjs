import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
await import('./check-epi-closure.mjs');
const p='docs/planning/',read=f=>JSON.parse(fs.readFileSync(f,'utf8')),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex'),ref=path=>({path,sha256:sha(path)});
const plan=read(p+'EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json'),result=read(p+'EPI_PUBLIC_EXPERIMENT_REV1.json');
assert.equal(result.results.reduce((n,r)=>n+r.prefixes,0),240);
for(let i=0;i<72;i++)for(const k of ['name','law','numeric','modelIdentity','runIdentity','orderedInputs'])assert.equal(plan.runs[i][k],result.results[i][k]);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});let pairs=0;
try{
 const codec=await server.ssrLoadModule('/src/campaign3/epiCodecs.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts');
 for(const law of [1,2,3])for(const numeric of [1,2])for(const name of ['established','informative','fresh','missing']){
  const get=s=>plan.runs.find(r=>r.law===law&&r.numeric===numeric&&r.name===name+s);
  const a=codec.decodeEpi(Uint8Array.from(Buffer.from(get('A').orderedInputs,'hex'))),b=codec.decodeEpi(Uint8Array.from(Buffer.from(get('B').orderedInputs,'hex')));
  const aa=data.dataItems(a,'list'),bb=data.dataItems(b,'list');assert.equal(aa.length,bb.length);let changes=0;
  for(let i=0;i<aa.length;i++){
   const af=data.dataItems(data.dataField(data.dataRecord(aa[i],899n),2n),'list'),bf=data.dataItems(data.dataField(data.dataRecord(bb[i],899n),2n),'list');assert.equal(af.length,bf.length);
   for(let j=0;j<af.length;j++){
    const ar=data.dataRecord(af[j],898n),br=data.dataRecord(bf[j],898n);
    if(data.dataKey(data.dataField(ar,2n))!==data.dataKey(data.dataField(br,2n))){
     assert.deepEqual(data.dataField(ar,2n),{kind:'rational',numerator:1n,denominator:10n});
     assert.deepEqual(data.dataField(br,2n),{kind:'rational',numerator:4n,denominator:5n});
     assert.deepEqual(data.dataField(ar,3n),{kind:'rational',numerator:19n,denominator:20n});
     br.fields.set(2n,data.dataField(ar,2n));changes++;
    }
   }
  }
  assert.equal(changes,1);assert.deepEqual(a,b,'Only one potential field may differ, including all timestamps and metadata');pairs++;
 }
}finally{await server.close();}
const failed=read(p+'EPI_PUBLIC_TESTS_REV1.json');assert.equal(failed.numPassedTests,0);assert.equal(failed.numFailedTests,16);
const failures=failed.testResults.flatMap(t=>t.assertionResults).filter(a=>a.status==='failed');assert.equal(failures.length,16);for(const f of failures)assert(f.failureMessages.some(m=>m.includes('run seed must be exactly 32 bytes')));
const receipt={status:'PASS; HQ011 OPEN',scope:'Exact original closure rechecked;72 ordered stored result/input joins and24 fully decoded input-only pairs verified. Original240prefix/49affected/328reference evidence remains historical;no fresh settlement,rollback or tests.',runs:72,prefixes:240,inputPairs:pairs,failedAdmissionTests:16,sources:['scripts/check-epi-closure.mjs','scripts/qualify-epi-public.mjs',p+'EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json',p+'EPI_PUBLIC_EXPERIMENT_REV1.json',p+'EPI_VALIDATION_CLOSURE_REV1.json',p+'EPI_PUBLIC_TESTS_REV1.json','src/campaign3/epiCodecs.ts'].map(ref),checker:ref('scripts/check-history-epi-authority.mjs')};
const O=p+'campaign3-history-epi-authority-rev1/';fs.mkdirSync(O,{recursive:true});if(fs.existsSync(O+'canonical-check.json'))assert.deepEqual(read(O+'canonical-check.json'),receipt);else fs.writeFileSync(O+'canonical-check.json',JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log('PASS:24 EPI exact input-only pairs;16 seed-admission failures preserved.');
