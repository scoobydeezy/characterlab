import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const planPath=process.argv[2]??'docs/planning/WORK_PUBLIC_EXPERIMENT_PLAN_REV1.json',path=process.argv[3]??'docs/planning/WORK_PUBLIC_EXPERIMENT_REV1.json';assert(!fs.existsSync(path));const hash=b=>createHash('sha256').update(b).digest('hex');
const plan=JSON.parse(fs.readFileSync(planPath)),freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-work-model-rev1/FREEZE.json'));
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'}),results=[];
try{
 const {prepareWorkModel,createWorkRun,restoreWorkRun}=await server.ssrLoadModule('/src/campaign3/workFactory.ts'),{decodeWork}=await server.ssrLoadModule('/src/campaign3/workCodecs.ts'),{canonicalEncode:enc}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const sources=new Map(),handles=new Map();
 const bytes=p=>new Uint8Array(Buffer.from(fs.readFileSync(p,'utf8').trim(),'hex'));
 for(const m of freeze.models){const base='docs/planning/campaign3-work-model-rev1/'+m.name+'/',source=Object.fromEntries(['parameters','content','registry'].map(n=>[n,bytes(base+n+'.cenc.hex')]));sources.set(m.name,{source,initialState:bytes(base+'initial-state.cenc.hex')});handles.set(m.name,await prepareWorkModel(source));}
 for(const row of plan.runs){
  const {source,initialState}=sources.get(row.model),orderedInputs=new Uint8Array(Buffer.from(row.orderedInputs,'hex')),runSeed=new Uint8Array(32);runSeed[0]=row.seed;
  const run=await createWorkRun(handles.get(row.model),{initialState,orderedInputs,runSeed});let restores=0,continuations=0;const prefix=[],prefixOutputs=[];
  for(;;){const save=run.save(),restored=await restoreWorkRun(source,{initialState,orderedInputs,save});assert.deepEqual(restored.save(),save);restores++;prefix.push(hash(save));prefixOutputs.push(hash(run.snapshot().outputs));const a=await run.settleNextInstant(),b=await restored.settleNextInstant();assert.equal(a,b);assert.deepEqual(restored.save(),run.save());continuations++;if(!a)break;}
  const snapshot=run.snapshot(),outputs=decodeWork(snapshot.outputs).items,work=outputs.filter(v=>v.schema?.typeId===773n),decisions=outputs.filter(v=>v.schema?.typeId===776n),number=v=>Number(v.value);
  const result={name:row.name,model:row.model,seed:row.seed,restores,continuations,prefixSaveSha256:prefix,finalSaveSha256:hash(run.save()),outputsSha256:hash(snapshot.outputs),stateSha256:hash(snapshot.state),workspace:work.map(w=>({at:number(w.fields.get(2n)),candidateCount:w.fields.get(3n).items.length,selected:w.fields.get(4n).items.map(number),control:number(w.fields.get(5n)),prior:w.fields.get(6n).items.map(number),cue:w.fields.get(7n),statuses:hash(enc(w.fields.get(8n))),access:w.fields.get(9n).items.map(number)})),choices:decisions.map(d=>({at:number(d.fields.get(2n)),chosen:d.fields.get(8n)?hash(enc(d.fields.get(8n))):null,draws:d.fields.get(6n).items.length}))};
  result.prefixOutputsSha256=prefixOutputs;results.push(result);console.log(`${results.length}/${plan.runs.length} ${row.name}: ${restores} prefixes`);
 }
 const by=new Map(results.map(r=>[r.name,r])),get=(c,k,s)=>by.get(`c${c}-k${k}-s${s}`),at=(r,t)=>r.workspace.find(w=>w.at===t);
 if(plan.supplementary){
  for(const c of [1,2])for(const s of [0,1]){const low=by.get(`distractor-${c}-${s}-low`),high=by.get(`distractor-${c}-${s}-high`);assert.equal(low.prefixOutputsSha256[1],high.prefixOutputsSha256[1]);assert.deepEqual(at(low,2),at(high,2));assert.deepEqual(at(low,3).selected,[1]);assert.deepEqual(at(high,3).selected,s?[1]:[2]);assert.equal(at(low,3).statuses,at(high,3).statuses);}
  for(const s of [0,1])for(const v of ['low','high'])assert.equal(by.get(`distractor-1-${s}-${v}`).outputsSha256,by.get(`distractor-2-${s}-${v}`).outputsSha256);
 }else{
 for(const k of [0,1,2,3])for(const s of [0,1])assert.equal(get(1,k,s).outputsSha256,get(2,k,s).outputsSha256,'stored/indexed');
 for(const c of [1,2])for(const s of [0,1]){const base=get(c,1,s),name=`c${c}-k1-s${s}`;assert.equal(base.outputsSha256,by.get(name+'-hidden').outputsSha256);assert.deepEqual(at(base,3).selected,s?[1]:[2]);assert.deepEqual(at(by.get(name+'-low-distraction'),3).selected,[1]);assert.deepEqual(at(base,5).selected,[1]);assert.deepEqual(at(base,7).selected,[3]);if(!s)assert.deepEqual(at(by.get(name+'-no-cue'),5).selected,[2]);assert(by.get(name+'-missing-board').workspace.every(w=>w.selected.length===0));}
 assert.equal(at(get(1,1,0),3).statuses,at(get(1,1,1),3).statuses);assert.deepEqual(at(get(1,2,0),3).selected,[2,3]);assert.equal(at(get(1,2,0),3).candidateCount,3);
 assert(at(get(4,1,1),2).selected.length>1);assert.deepEqual(at(get(5,1,0),3).access,[1,2]);assert.deepEqual(at(get(6,1,0),7).selected,[1]);assert.deepEqual(at(get(3,1,1),3).selected,[2]);
 for(let seed=1;seed<4;seed++)assert.equal(by.get(`draw-1-${seed}`).outputsSha256,by.get(`draw-2-${seed}`).outputsSha256);
 }
 const report={date:'2026-09-21',status:'PASS',planSha256:hash(fs.readFileSync(planPath)),runs:results.length,restores:results.reduce((n,r)=>n+r.restores,0),continuations:results.reduce((n,r)=>n+r.continuations,0),results};
 fs.writeFileSync(path,JSON.stringify(report,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({status:report.status,runs:report.runs,restores:report.restores}));
}catch(e){fs.writeFileSync('docs/planning/WORK_PUBLIC_EXPERIMENT_FAILURE_REV1.json',JSON.stringify({error:String(e),completed:results},null,2)+'\n',{flag:'wx'});throw e;}finally{await server.close();}
