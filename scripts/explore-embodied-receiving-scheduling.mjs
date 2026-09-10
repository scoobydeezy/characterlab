// Actual scheduler, abstract graph operands. Not canonical EMB implementation.
import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const output='docs/planning/EMBODIED_RECEIVING_SCHEDULING_REV1.json';assert(!fs.existsSync(output));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try {
 const {DeterministicScheduler}=await server.ssrLoadModule('/src/substrate/scheduler.ts');
 const {list,text,typedIdentifier,canonicalEncode:enc,bytesToHex}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const id=name=>typedIdentifier(10030n,text('receiving-research/'+name)),key=v=>bytesToHex(enc(v));
 const phases={sample:10,tracking:11,binding:12,classification:13,freeze:14,pressure:60,'body-options':70,workspace:40,appraisal:50,concern:50,motive:60,candidates:70,'task-raw':80,'mixed-candidates':70,'mixed-raw':80,reasons:80,resolution:80,intent:90,expression:90,plan:100,attempt:110,execution:110,delivery1:110,delivery2:110,delivery3:110,deadline:140};
 const graph={sample:['tracking'],tracking:['binding'],binding:['classification'],classification:['freeze'],freeze:['pressure'],pressure:['body-options'],workspace:['appraisal'],appraisal:['concern'],concern:['motive'],motive:['candidates'],candidates:['task-raw','mixed-candidates'],'task-raw':['mixed-raw'],'mixed-raw':['reasons'],reasons:['resolution'],resolution:['intent'],intent:['expression','plan'],plan:['attempt'],attempt:['execution']};
 const empty=list([]),results=[];
 async function run({chosen=true,present=true,extras=false,limit=26}={}){
  const originals=['sample','workspace',...(extras?['delivery1','delivery2','delivery3','deadline']:[])];
  const queue=originals.map((name,i)=>({eventId:BigInt(i),eventSequence:BigInt(i),dueAt:100n,phase:BigInt(phases[name]),eventTypeId:id(name),payload:text(name),dependencies:empty,causalParentEventIds:[]}));
  const handlers=new Map(Object.keys(phases).map(name=>[key(id(name)),context=>{
   const prior=context.state;
   if(name==='candidates')assert(prior.includes('body-options'),'body source exists before candidate join allocation');
   if(name==='task-raw')assert(prior.includes('mixed-candidates'),'mixed options exist before raw join allocation');
   const noOutput=['tracking','binding','classification','deadline'].includes(name)||(name==='freeze'&&!present);
   const count=name==='sample'?2:!['tracking','binding','classification','freeze','delivery1','delivery2','delivery3','deadline'].includes(name)?1:0;
   for(let i=0;i<count;i++)context.allocateRuntimeId();
   const children=name==='resolution'&&!chosen?[]:graph[name]??[];
   return {nextState:[...prior,name],outputs:noOutput?[]:[text(name)],traceContributions:[text(name)],emittedEvents:children.map(child=>({dueAt:100n,phase:BigInt(phases[child]),eventTypeId:id(child),payload:list([text(name),...(child==='mixed-candidates'?[text('body-options')]:child==='mixed-raw'?[text('mixed-candidates')]:[])]),dependencies:empty}))};
  }]));
  const scheduler=new DeterministicScheduler({initialState:[],stateAdapter:{clone:s=>[...s],validate:s=>assert(Array.isArray(s)),canonicalValue:s=>list(s.map(text))},handlers,initialQueue:queue,initialAllocators:{nextRuntimeId:0n,nextEventId:BigInt(queue.length),nextEventSequence:BigInt(queue.length)},maxSettlementWorkPerSimulationInstant:BigInt(limit)});
  let failure;try{await scheduler.settleNextInstant();}catch(error){failure=error.code??error.name;}
  const events=scheduler.getState(),outputs=scheduler.getOutputs(),alloc=scheduler.getAllocatorState();
  if(failure){assert.equal(events.length,0);assert.equal(outputs.length,0);assert.equal(alloc.nextRuntimeId,0n);assert.equal(scheduler.getPendingQueue().length,queue.length);}
  else {assert.equal(events.length,(chosen?22:17)+(extras?4:0));assert.equal(outputs.length,(chosen?19:14)-(present?0:1)+(extras?3:0));assert.equal(alloc.nextRuntimeId,BigInt(chosen?19:14));assert(events.indexOf('body-options')<events.indexOf('candidates'));assert(events.indexOf('mixed-candidates')<events.indexOf('task-raw'));}
  return {chosen,present,extras,limit,failure,events,outputCount:outputs.length,runtimeOrdinals:String(alloc.nextRuntimeId)};
 }
 for(const chosen of [false,true])for(const present of [false,true])results.push(await run({chosen,present}));
 results.push(await run({extras:true}));const bounded=await run({extras:true,limit:25});assert(bounded.failure);results.push(bounded);
 const fingerprint=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
 fs.writeFileSync(output,JSON.stringify({status:'ABSTRACT GRAPH EXECUTES WITH ACTUAL SCHEDULER; NOT SEMANTIC RUNTIME QUALIFICATION',results,sources:['scripts/explore-embodied-receiving-scheduling.mjs','src/substrate/scheduler.ts'].map(fingerprint),limits:['Uses the existing scheduler test namespace10030, not new permanent event members.','Text labels stand in for semantic outputs. No body, task, PRJ, canonical mixed record, live binding or RNG proof.','Confirms scheduling/count expressibility only; ER vectors remain NOT PASSED.']},null,2)+'\n');
 console.log(JSON.stringify(results.map(({events,...r})=>({...r,eventCount:events.length})),null,2));
} finally {await server.close();}
