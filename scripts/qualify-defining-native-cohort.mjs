import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const dir='docs/planning/defining-native-cohort-rev1',sha=b=>createHash('sha256').update(b).digest('hex'),hex=b=>Buffer.from(b).toString('hex');
const arg=n=>process.argv[process.argv.indexOf(n)+1];
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const model=await server.ssrLoadModule('/src/campaign3/definingRehearsalModel.ts'),program=await server.ssrLoadModule('/src/campaign3/definingContinuationProgram.ts'),meaning=await server.ssrLoadModule('/src/campaign3/definingMeaning.ts'),memory=await server.ssrLoadModule('/src/campaign3/definingMemoryExperiment.ts'),canon=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts'),data=await server.ssrLoadModule('/src/campaign2/canonicalData.ts'),codec=await server.ssrLoadModule('/src/campaign3/definingRehearsalCodecs.ts'),qualification=await server.ssrLoadModule('/src/campaign3/goalOutcomeQualification.ts'),children=await server.ssrLoadModule('/src/campaign3/generalMemoryOwner.ts'),math=await server.ssrLoadModule('/src/campaign3/embodiedMath.ts');
 const {canonicalEncode:enc,list,bytes}=canon,{dataRecord:rec,dataField:f,dataItems:items,dataUnsigned:uint,dataIdentity:identity}=data,cases=meaning.definingMeaningCases();
 const files=['scripts/qualify-defining-native-cohort.mjs',...fs.readdirSync('src/campaign3').filter(n=>n.startsWith('defining')&&n.endsWith('.ts')).map(n=>'src/campaign3/'+n),'docs/planning/DEFINING_MEMORY_TRAINING_REV1.json','docs/planning/DEFINING_NATIVE_REHEARSAL_CHECK_REV1.json'];
 const manifest={version:1,contract:'defining-native-rehearsal/0.1-candidate',scope:'All68 internal native programs from empty acquired S0; component correspondence and selected settled-stage hashes. No public save or all-prefix restore qualification.',cases,files:files.map(path=>({path,sha256:sha(fs.readFileSync(path))}))};
 if(process.argv.includes('--prepare')){fs.mkdirSync(dir);fs.writeFileSync(dir+'/MANIFEST.json',JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});console.log('Prepared frozen68-case native cohort');}
 else{
  assert.deepEqual(JSON.parse(fs.readFileSync(dir+'/MANIFEST.json')),manifest,'Cohort source changed after preparation');
  const worker=Number(arg('--worker')),workers=Number(arg('--workers'));assert(Number.isInteger(worker)&&Number.isInteger(workers)&&worker>=0&&worker<workers&&workers<=4);
  const trainingReceipt=JSON.parse(fs.readFileSync('docs/planning/DEFINING_MEMORY_TRAINING_REV1.json')),trainingState=Uint8Array.from(Buffer.from(trainingReceipt.snapshots[0].state,'hex')),trainingOutputs=Uint8Array.from(Buffer.from(trainingReceipt.snapshots[0].outputs,'hex')),training=meaning.meaningTraining(trainingState,trainingOutputs);
  const time=v=>typeof v!=='boolean'&&v.kind==='signed'?v.value:-1n,ordinal=v=>uint(identity(v).payload);
  const oldState=s=>enc(s.state.withEntries(s.state.entries().filter(e=>![1485n,1486n].includes(e.path.rootStateTypeId))).canonicalValue());
  function projected(v){const q=rec(v,v.schema.typeId),n=Number(uint(f(q,1n)));if(q.schema.typeId===564n)return {kind:'Qualifies',direction:n===1?'MovingCloser':'MovingFarther'};if(q.schema.typeId===565n)return {kind:'DoesNotQualify',reason:n===1?'SameDistance':'ComparatorExcludesProgress'};if(q.schema.typeId===566n)return {kind:'QualificationUnavailable',reason:'IndeterminateRelation'};assert.equal(q.schema.typeId,567n);return {kind:'QualificationUnavailable',reason:'AssessmentUnavailable',cause:['Absent','Pending','Withdrawn','Expired','MissingEvidence'][n-1]};}
  for(let index=worker;index<cases.length;index+=workers){
   const path=dir+'/CASE_'+String(index).padStart(2,'0')+'.json';assert(!fs.existsSync(path),'case already recorded; no silent overwrite');const spec=cases[index],start=Date.now();let lastClock='S0';
   try{
    const run=await model.createDefiningRehearsalModel(program.admitDefiningContinuationProgram(spec)),initial=run.runtime.snapshot();assert.equal(memory.definingTraining(oldState(initial)).memory.length,0);const expected=meaning.runDefiningMeaning(training,spec).view,stages=[],instants=[],events=[];
    let beforeFinal;
    while(true){const settled=await run.runtime.settleNextInstant();if(!settled)break;lastClock=String(settled.dueAt);instants.push(lastClock);events.push(...settled.executedEvents);
     if([37n,38n,39n,40n,41n,42n,43n,BigInt(spec.now)].includes(settled.dueAt)){
      const s=run.runtime.snapshot(),state=enc(s.state.canonicalValue()),outputs=enc(list(s.outputs)),trace=enc(list(s.committedTrace));
      stages.push({clock:lastClock,state:sha(state),outputs:sha(outputs),trace:sha(trace),stateBytes:state.length,outputBytes:outputs.length,traceBytes:trace.length});
      if(settled.dueAt===37n){assert.deepEqual(oldState(s),trainingState);assert.deepEqual(outputs,trainingOutputs);}
      if(settled.dueAt===42n){const actual=memory.definingTraining(oldState(s));assert.deepEqual(actual.memory,expected.memory);assert.deepEqual(actual.presentations,expected.history);}
      if(settled.dueAt===43n)beforeFinal=memory.definingTraining(oldState(s));
     }
    }
    const s=run.runtime.snapshot();assert.equal(s.clock,BigInt(spec.now));assert.deepEqual(s.queue,[]);assert.equal(s.status,'Active');assert(beforeFinal);
    const all=s.outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'),historical=all.find(v=>v.schema.typeId===1489n),current=all.find(v=>v.schema.typeId===1490n);assert(historical&&current);
    assert.deepEqual(projected(f(historical,7n)),qualification.projectGoalQualification(expected.historical));assert.deepEqual(projected(f(current,7n)),qualification.projectGoalQualification(expected.current));
    assert.deepEqual(f(current,5n),historical);
    for(let i=0;i<spec.rehearsals;i++){const at=39n+BigInt(i),pubs=all.filter(v=>v.schema.typeId===590n&&time(f(v,3n))===at),a=all.find(v=>v.schema.typeId===575n&&time(f(v,5n))===at);assert.equal(pubs.length,16);assert(a);assert.equal(uint(f(a,7n)),1n);assert.equal(items(f(a,8n),'set').length,16);assert.equal(items(f(a,9n),'set').length,1);}
    assert.equal(events.filter(e=>e.eventTypeId.payload.value==='event/defining-rehearsal-settle').length,spec.rehearsals);
    const finalPubs=all.filter(v=>v.schema.typeId===590n&&time(f(v,3n))===BigInt(spec.now)),winner=p=>ordinal(f(rec(f(rec(f(p,4n),588n),1n),587n),1n));assert.deepEqual(finalPubs.map(winner),expected.publication.recollections.map(p=>p.content.winner.id));
    const finalRank=all.find(v=>v.schema.typeId===592n&&time(f(v,3n))===BigInt(spec.now));assert(finalRank);
    assert.deepEqual(items(f(finalRank,5n),'list').map(v=>{const row=rec(v,591n);return [ordinal(f(row,1n)),f(row,2n),f(row,3n),f(row,4n)];}),expected.scores.map(row=>[row.acquisition,math.atom(row.base),math.atom(row.pull),math.atom(row.score)]));
    for(let i=0;i<finalPubs.length;i++){const evidence=rec(f(rec(f(finalPubs[i],4n),588n),1n),587n),actualViews=children.canonicalAcquisitionChildren(evidence,false).flatMap(c=>c.views),wanted=expected.publication.recollections[i].content.winner.units.flatMap(c=>c.views);assert.deepEqual(enc(list(actualViews.map(bytes))),enc(list(wanted.map(bytes))));}
    const final=memory.definingTraining(oldState(s));assert.deepEqual(final.memory,expected.memory);const expectedHistory=new Map(expected.history);for(const p of finalPubs){const id=winner(p);expectedHistory.set(id,[...expectedHistory.get(id),BigInt(spec.now)]);}assert.deepEqual(final.presentations,expectedHistory);assert.deepEqual(beforeFinal.memory,expected.memory);assert.deepEqual(beforeFinal.presentations,expected.history);
    const finalTrace=s.committedTrace.map(v=>rec(v,160n)).find(t=>f(t,7n).payload.value==='event/defining-recall-rank'&&time(f(rec(f(t,4n),130n),2n))===BigInt(spec.now));assert(finalTrace);assert.equal(items(f(finalTrace,11n),'list').length,spec.cue==='absent'?0:2);
    assert.equal(events.filter(e=>e.eventTypeId.payload.value==='event/defining-final-presentations').length,finalPubs.length);
    const row={status:'PASS',index,spec,modelIdentity:hex(run.modelIdentity.canonicalBytes),runIdentity:hex(run.runIdentity.canonicalBytes),initialState:sha(run.initialState),originals:sha(run.originals),instants,stages,historical:projected(f(historical,7n)),current:projected(f(current,7n)),retainedEvents:final.memory.filter(a=>a.kind==='EventContinuant').map(a=>String(a.id)),selected:finalPubs.map(p=>String(winner(p))),finalRankReads:items(f(finalTrace,11n),'list').length,rehearsals:spec.rehearsals,finalPresentationSettlements:finalPubs.length,elapsedMs:Date.now()-start};
    fs.writeFileSync(path,JSON.stringify(row,null,2)+'\n',{flag:'wx'});console.log(JSON.stringify({worker,index,status:'PASS',elapsedMs:row.elapsedMs}));
   }catch(error){fs.writeFileSync(dir+'/FAILURE_'+String(index).padStart(2,'0')+'.json',JSON.stringify({status:'FAIL',index,spec,lastClock,error:error.stack??String(error),elapsedMs:Date.now()-start},null,2)+'\n',{flag:'wx'});throw error;}
  }
 }
}finally{await server.close();}
