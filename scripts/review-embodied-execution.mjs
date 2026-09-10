// Execute frozen specimens through the public factory and reconcile independent
// pre-implementation expectations. This is evidence, not whole EMB qualification.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const root='docs/planning/campaign3-embodied-model-rev2',folder='docs/planning/embodied-execution-rev1';assert(!fs.existsSync(folder));
const freeze=JSON.parse(fs.readFileSync(root+'/FREEZE.json')),expected=JSON.parse(fs.readFileSync('docs/planning/CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json'));
const bytes=p=>Uint8Array.from(Buffer.from(fs.readFileSync(root+'/'+p,'utf8').trim(),'hex')),hex=b=>Buffer.from(b).toString('hex'),fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'}),results=[],artifacts=[];
try{const api=await server.ssrLoadModule('/src/campaign3/embodiedFactory.ts'),{decodeEmbodied:decode}=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts');
 const f=(v,n)=>v.fields.get(BigInt(n)),q=v=>`${v.numerator}/${v.denominator}`,n=v=>Number(v.value),event=row=>f(row,4),outputs=row=>f(row,13).items;
 for(const name of ['baseline','hidden89','slower','coarser','denied','unavailable','overflow']){
  const modelName=name==='hidden89'?'baseline':name,source={...freeze.versions,...Object.fromEntries(['content','registry','parameters'].map(k=>[k,bytes(modelName+'/'+k+'.cenc.hex')]))},handle=await api.prepareEmbodiedModel(source),data={initialState:bytes('runs/'+name+'/initial-state.cenc.hex'),orderedInputs:bytes('runs/'+name+'/ordered-inputs.cenc.hex'),runSeed:new Uint8Array(32)},run=await api.createEmbodiedRun(handle,data),oracle=expected.cases[name==='hidden89'?'hiddenInitial':name];
  assert.deepEqual(run.runIdentity(),bytes('runs/'+name+'/run-identity.cenc.hex'));
  const boundaries=[];while(await run.settleNextInstant()){
   const save=decode(run.save()),state=f(save,5),anchor=f(state.items.find(leaf=>n(f(f(leaf,1),1))===455),2),a=f(save,6);
   const boundary={time:n(f(save,4)),anchor:[q(f(anchor,1)),n(f(anchor,2))],nextRuntime:n(f(a,1)),nextEvent:n(f(a,2)),nextSequence:n(f(a,3)),pendingInputIds:f(save,7).items.map(e=>n(f(e,1)))};boundaries.push(boundary);
   for(const slot of [8,9,10])assert.deepEqual(f(save,slot).items,[]);
  }
  assert.deepEqual(boundaries,oracle.boundaries);
  const snapshot=run.snapshot(),rows=decode(snapshot.trace).items,values=decode(snapshot.outputs).items;assert.equal(rows.length,39);assert.equal(values.filter(v=>v.schema.typeId===227n).length,oracle.totals.semOutputs);
  for(const record of oracle.records){const at=rows.findIndex(row=>n(f(event(row),1))===record.input),row=rows[at],output=outputs(row)[0];assert.equal(n(f(event(row),2)),record.time);
   if(record.kind==='delivery'){assert.equal(output.schema.typeId,479n);assert.deepEqual([1,2,3,4,5].map(k=>q(f(output,k))),['before','potential','applied','overflow','after'].map(k=>record[k]));assert.equal(f(row,18).items.length,0);}
   else{assert.equal(n(f(output,1).payload),record.observationOrdinal);assert.deepEqual(rows.slice(at,at+6).map(row=>n(f(event(row),3))),[10,11,12,13,14,60]);assert.deepEqual([n(f(event(rows[at+1]),1)),n(f(event(rows[at+5]),1))],record.children);
    for(let i=1;i<=5;i++)assert.deepEqual(f(event(rows[at+i]),8).items.map(n),[n(f(event(rows[at+i-1]),1))]);
    const pressure=outputs(rows[at+5])[0];assert.equal(n(f(pressure,1).payload),record.pressureOrdinal);
    if(record.interval){assert.deepEqual([1,2].map(k=>q(f(f(output,5),k))),record.interval);assert.equal(q(f(f(pressure,4),2)),record.pressure);assert.equal(n(f(outputs(rows[at+4])[0],1).payload),record.experienceOrdinal);assert.equal(q(f(f(row,15).items[0],1)),record.reserve);}
    else{assert.equal(output.schema.typeId,463n);assert.equal(n(f(f(pressure,4),1)),2);assert.equal(outputs(rows[at+4]).length,0);assert.equal(f(row,15).items.length,0);assert.equal(f(row,11).items.length,1);}
   }
  }
  for(const [suffix,dataBytes] of [['outputs',snapshot.outputs],['trace',snapshot.trace],['final-save',run.save()]]){const path=`${folder}/${name}/${suffix}.cenc.hex`;fs.mkdirSync(`${folder}/${name}`,{recursive:true});fs.writeFileSync(path,hex(dataBytes)+'\n');artifacts.push(fp(path));}
  results.push({name,runDigest:freeze.runs.find(r=>r.name===name).runDigest,checkedOriginals:9,checkedBoundaries:boundaries.length,events:rows.length,outputs:values.length,semOutputs:oracle.totals.semOutputs});
 }
 const old=JSON.parse(fs.readFileSync('docs/planning/COGNITIVE_QUALIFICATION_EVIDENCE_REV1.json')),changed=['src/substrate/scheduler.ts','src/campaign2/requiredProjection.ts'];for(const p of old.checks.filter(p=>!changed.includes(p.path)))assert.deepEqual(fp(p.path),{path:p.path,sha256:p.sha256});
 const sources=fs.readdirSync('src/campaign3').filter(p=>p.endsWith('.ts')).map(p=>fp('src/campaign3/'+p));
 fs.writeFileSync(folder+'/REVIEW.json',JSON.stringify({status:'SEVEN PUBLIC EXECUTIONS MATCH FROZEN EXPECTATIONS; WHOLE VECTOR REVIEW OPEN',results,artifacts,sources,cohort:fp(root+'/FREEZE.json'),expectations:fp('docs/planning/CAMPAIGN3_EMBODIED_PROFILE_EXPECTATIONS_REV1.json'),script:fp('scripts/review-embodied-execution.mjs'),preservedReceiptEntries:old.checks.filter(p=>!changed.includes(p.path)).length,reviewedSourceChanges:changed.map(fp),limits:['Denied/unavailable hidden reserve expectation is deliberately not read or reconstructed by the runtime.','Frozen historical expectation bytes remain unchanged.','Bounded public execution does not establish EMB-M..O, BODY/MULTISOURCE, action knowledge or final Need ownership.']},null,2)+'\n');console.log(JSON.stringify(results));
}finally{await server.close();}
