import {beforeAll,it,expect} from 'vitest';
import {canonicalEncode as enc,list,signed,unsigned as u} from '../substrate/canonicalEncoding';
import {scheduledEventValue} from '../substrate/persistence';
import {dataKey as key} from '../campaign2/canonicalData';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralSourceRuntime} from '../campaign3/generalSourceRuntime';
import {generalRegistrationTemplates} from '../campaign3/generalRegistration';
import {PROBE_EVENT_NAMES} from '../campaign2/probeExecution';
type Model=Awaited<ReturnType<typeof compileGeneralDeclarations>>;
const models=new Map<string,Model>(),witnesses=new Map<string,{recipe:string;at:bigint}>();
const templates=generalRegistrationTemplates();
const stageNames=[...templates.map(t=>(t.event.payload as {value:string}).value),...PROBE_EVENT_NAMES,'event/measurement-evidence-intake','event/measurement-episode-evidence','event/measurement-prediction-application','event/task-deadline'];
const inactive=new Set(templates.filter(t=>['current-visual-encoding','current-event-rank'].includes(t.name)).map(t=>(t.event.payload as {value:string}).value));
const yieldWorker=()=>new Promise(resolve=>setTimeout(resolve,0));
beforeAll(async()=>{
 for(const recipe of ['baseline','source-consequence-lane','credit-significance-first','source-denied-probe']){
  const model=await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe));models.set(recipe,model);const run=createGeneralSourceRuntime(model);
  while(run.snapshot().queue.length){const result=await run.settleNextInstant();for(const event of result!.executedEvents){const name=(event.eventTypeId.payload as {value:string}).value;if(!witnesses.has(name))witnesses.set(name,{recipe,at:event.dueAt});}await yieldWorker();}
 }
},120000);
function snapshotBytes(run:ReturnType<typeof createGeneralSourceRuntime>){const s=run.snapshot();return enc(list([signed(s.clock),s.state.canonicalValue(),list([u(s.allocators.nextRuntimeId),u(s.allocators.nextEventId),u(s.allocators.nextEventSequence)]),list(s.queue.map(scheduledEventValue)),list(s.committedTrace),list(s.outputs)]));}
it('has actual witnesses for every active registered stage and identifies the two replacement-only exclusions',()=>{
 expect(stageNames.filter(name=>!witnesses.has(name)).sort()).toEqual([...inactive].sort());
 expect(witnesses.size).toBe(stageNames.length-inactive.size);
});
it.each(stageNames.filter(name=>!inactive.has(name)))('rolls back the whole instant after actual stage %s',async name=>{
 const witness=witnesses.get(name)!;expect(witness).toBeDefined();const run=createGeneralSourceRuntime(models.get(witness.recipe)!);
 while(run.snapshot().queue[0].dueAt<witness.at){await run.settleNextInstant();await yieldWorker();}
 const before=snapshotBytes(run);let injected=false;
 await expect(run.settleNextInstantForConformance({onBoundary(boundary,event){if(boundary==='after-trace-validation'&&event&&(event.eventTypeId.payload as {value:string}).value===name){injected=true;throw Error('GA stage rollback witness');}}})).rejects.toThrow('GA stage rollback witness');
 expect(injected).toBe(true);const after=snapshotBytes(run);expect(after.length===before.length&&after.every((v,i)=>v===before[i])).toBe(true);expect(run.snapshot().status).toBe('Failed');await yieldWorker();
},90000);
it.each([3n,6n,37n,38n,39n,100n])('rolls back completed owner batches and pending delivery changes before commit at %s',async at=>{
 const run=createGeneralSourceRuntime(models.get('credit-significance-first')!);
 while(run.snapshot().queue[0].dueAt<at){await run.settleNextInstant();await yieldWorker();}
 const before=snapshotBytes(run);let injected=false;
 await expect(run.settleNextInstantForConformance({onBoundary(boundary){if(boundary==='before-commit'){injected=true;throw Error('GA final rollback witness');}}})).rejects.toThrow('GA final rollback witness');
 expect(injected).toBe(true);const after=snapshotBytes(run);expect(after.length===before.length&&after.every((v,i)=>v===before[i])).toBe(true);
},90000);
