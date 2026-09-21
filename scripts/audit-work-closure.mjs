import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const hash=b=>createHash('sha256').update(b).digest('hex'),read=p=>JSON.parse(fs.readFileSync(p)),out='docs/planning/WORK_VALIDATION_CLOSURE_REV1.json';assert(!fs.existsSync(out));
const freeze=read('docs/planning/campaign3-work-model-rev1/FREEZE.json');
assert.equal(hash(fs.readFileSync('docs/formal/WORKSPACE_CONTROL_CONTRACT.md')),freeze.contractSha256);assert.equal(hash(fs.readFileSync('docs/formal/WORKSPACE_CONTROL_ALLOCATION_TABLE.json')),freeze.allocationSha256);
const files=freeze.models.flatMap(m=>m.files);for(const f of files)assert.equal(hash(fs.readFileSync(f.path)),f.sha256);
const main=read('docs/planning/WORK_PUBLIC_EXPERIMENT_REV1.json'),extra=read('docs/planning/WORK_DISTRACTOR_REV1.json');assert.equal(main.status,'PASS');assert.equal(extra.status,'PASS');
const test=read('docs/planning/WORK_PRESERVATION_TESTS_REV1.json'),reference=read('docs/planning/WORK_REFERENCE_TESTS_REV1.json');assert(test.success);assert(reference.success);
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {decodeWork}=await server.ssrLoadModule('/src/campaign3/workCodecs.ts'),plan=read('docs/planning/WORK_DISTRACTOR_PLAN_REV1.json'),pairs=[];
 const primitive=(v)=>typeof v==='bigint'?String(v):v;
 function differences(a,b,path=''){
  if(typeof a==='bigint'||typeof b==='bigint')return a===b?[]:[path];
  if(a instanceof Map&&b instanceof Map)return [...new Set([...a.keys(),...b.keys()])].flatMap(k=>differences(a.get(k),b.get(k),path+'/'+String(k)));
  if(a&&b&&typeof a==='object'&&typeof b==='object')return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>differences(a[k],b[k],path+'/'+k));
  return primitive(a)===primitive(b)?[]:[path];
 }
 for(const c of [1,2])for(const s of [0,1]){const low=plan.runs.find(r=>r.name===`distractor-${c}-${s}-low`),high=plan.runs.find(r=>r.name===`distractor-${c}-${s}-high`),diff=differences(decodeWork(new Uint8Array(Buffer.from(low.orderedInputs,'hex'))),decodeWork(new Uint8Array(Buffer.from(high.orderedInputs,'hex'))));assert.deepEqual(diff,['/items/1/fields/2/items/1/fields/3/value']);const lr=extra.results.find(r=>r.name===low.name),hr=extra.results.find(r=>r.name===high.name);assert.equal(lr.prefixOutputsSha256[1],hr.prefixOutputsSha256[1]);pairs.push({candidate:c,support:s,differences:diff,preInterventionEqual:true});}
 const sourceFiles=fs.readdirSync('src/campaign3').filter(n=>n.startsWith('work')).map(n=>'src/campaign3/'+n),receipt={date:'2026-09-21',status:'PASS',models:freeze.models.length,frozenFiles:files.length,publicRuns:main.runs+extra.runs,prefixRestores:main.restores+extra.restores,continuationEqualities:main.continuations+extra.continuations,terminalNoOpEqualities:main.runs+extra.runs,affectedTests:test.numPassedTests,referenceTests:reference.numPassedTests,exactSingleFieldPairs:pairs,sourceFiles:sourceFiles.map(path=>({path,sha256:hash(fs.readFileSync(path))})),limits:'No full active-suite claim. Explicit identity channel, two adopted tasks, three cards, eight source instants, fixed deadline and control law. Broader Brief12.6 is conditional.'};
 fs.writeFileSync(out,JSON.stringify(receipt,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify(receipt));
}finally{await server.close();}
