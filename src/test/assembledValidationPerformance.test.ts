/** Fixed native before/after evidence for the two-wrapper performance package.
 * Three physical tasks, body30/rate10/width1, seed0; unchanged M61 positive fixture.
 * Set VALIDATION_PERF_MODE=baseline once before editing production; never overwrite it.
 */
import {it,expect,vi} from 'vitest';
import {fixture} from './assembledActionMemory.test';
import {prepareCharacterModel,characterModelIdentity,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {canonicalEncode as enc,list,text,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import * as stateModule from '../substrate/state';
import {AuthoritativeState,statePathValue,type StatePath,type StatePatch} from '../substrate/state';
import {dataKey as key} from '../campaign2/canonicalData';
import {cognitiveRecord as r} from '../assembled/codecs';
import {STRATEGY,PLAN_OWNER,KNOWLEDGE_OWNER,planPath,knowledgePath} from '../assembled/strategy';
import {ELIGIBILITY,journalPath} from '../assembled/identityEligibility';
import {C} from './fixtures/campaign2Cognitive';

const file='docs/planning/ASSEMBLED_VALIDATION_PERFORMANCE_BASELINE.json.gz';
async function io(){
 const fsName='node:fs',zName='node:zlib',pName='node:process',bName='node:buffer';
 const [fs,z,p,b]=await Promise.all([import(/* @vite-ignore */ fsName),import(/* @vite-ignore */ zName),import(/* @vite-ignore */ pName),import(/* @vite-ignore */ bName)]);
 const to=(v:Uint8Array)=>b.Buffer.from(v).toString('base64');
 const from=(v:string):Uint8Array=>new Uint8Array(b.Buffer.from(v,'base64'));
 const equal=(a:Uint8Array,c:Uint8Array,label:string)=>expect(b.Buffer.from(a).equals(b.Buffer.from(c)),label+' exact bytes').toBe(true);
 return {fs,z,env:p.env,to,from,equal};
}
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
type Terminal={clock:string;status:string;state:string;outputs:string;trace:string;save:string;run:string};
function terminal(run:Run,to:(v:Uint8Array)=>string):Terminal{
 const s=run.snapshot();return {clock:String(s.clock),status:s.status,state:to(s.state),outputs:to(s.outputs),trace:to(s.trace),save:to(run.save()),run:to(run.runIdentity())};
}
function compare(a:Terminal,b:Terminal,tools:Awaited<ReturnType<typeof io>>){
 expect(a.clock).toBe(b.clock);expect(a.status).toBe(b.status);
 for(const k of ['state','outputs','trace','save','run'] as const)tools.equal(tools.from(a[k]),tools.from(b[k]),k);
}
async function controls(b:ReturnType<typeof fixture>,handle:Awaited<ReturnType<typeof prepareCharacterModel>>,tools:Awaited<ReturnType<typeof io>>){
 const model=await compileCharacterModel(b.s),component=await compileCharacterState(model),sm=component.stateModel,initial=component.initialState(b.d.initialState);
 const result:{label:string;error:string}[]=[];
 const replace=(path:StatePath,value:CanonicalValue)=>new AuthoritativeState([...initial.entries().filter(e=>key(statePathValue(e.path))!==key(statePathValue(path))),{path,value}]);
 const noOp:StatePatch={operations:[]};
 tools.equal(enc(sm.applyPatch(initial,noOp,PLAN_OWNER).state.canonicalValue()),enc(initial.canonicalValue()),'delegated no-op');
 const rejected=(label:string,s:AuthoritativeState,fn:()=>unknown)=>{
  const before=enc(s.canonicalValue());let failure:unknown;
  try{fn();}catch(e){failure=e;}
  expect(failure,label+' must reject').toBeInstanceOf(Error);
  const e=failure as Error;result.push({label,error:e.name+': '+e.message});
  tools.equal(enc(s.canonicalValue()),before,label+' preserves input');
 };
 const pp=planPath(model.strategy![0].task),kp=knowledgePath(C),jp=journalPath(component.identityKey);
 const badStates=[
  ['inherited',replace(component.tasks[0].path,true)],
  ['plan',replace(pp,list([text(STRATEGY),u(9),u(1)]))],
  ['strategy journal',replace(kp,list([text('bad'),list([])]))],
  ['identity presence',replace(jp,list([text(ELIGIBILITY),list([])]))],
  ['foreign strategy',replace({...pp,selectors:[]},list([text(STRATEGY),u(0),u(1)]))],
  ['foreign identity',replace({...jp,selectors:[]},list([text(ELIGIBILITY),list([])]))]
 ] as const;
 for(const [label,s]of badStates){
  rejected(label+' delegated',s,()=>sm.applyPatch(s,noOp,PLAN_OWNER));
  rejected(label+' full',s,()=>sm.validateState(s));
  rejected(label+' restore',s,()=>sm.restoreState(enc(s.canonicalValue())));
 }
 const plan:StatePatch={operations:[{kind:'set',path:pp,expected:{presence:false},newValue:list([text(STRATEGY),u(0),u(1)])}]};
 const valid=sm.applyPatch(initial,plan,PLAN_OWNER).state;sm.validateState(valid);
 rejected('foreign writer',initial,()=>sm.applyPatch(initial,plan,KNOWLEDGE_OWNER));
 rejected('foreign scope',initial,()=>sm.applyPatch(initial,plan,PLAN_OWNER,{writableRoots:[],targetPaths:[]}));
 rejected('mixed strategy',initial,()=>sm.applyPatch(initial,{operations:[...plan.operations,{kind:'set',path:component.tasks[0].path,expected:{presence:false},newValue:r(372,[u(1)])}]},PLAN_OWNER));
 rejected('mixed identity',initial,()=>sm.applyPatch(initial,{operations:[...plan.operations,{kind:'set',path:jp,expected:{presence:false},newValue:list([text(ELIGIBILITY),list([])])}]},PLAN_OWNER));
 // Throw only after a real immutable patch was produced, before instant publication.
 const run=await createCharacterRun(handle,b.d),before=run.snapshot(),original=stateModule.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{
  const value=original(...args);if(args[1].operations.length){reached=true;throw Error('validation performance after actual patch');}return value;
 });
 try{await expect(run.settleNextInstant()).rejects.toThrow('validation performance after actual patch');}finally{spy.mockRestore();}
 expect(reached).toBe(true);const after=run.snapshot();
 expect(after.clock).toBe(before.clock);expect(after.status).not.toBe(before.status);expect(run.diagnostic()).toBeDefined();
 for(const k of ['state','outputs','trace'] as const)tools.equal(after[k],before[k],'rollback '+k);
 result.push({label:'actual-patch rollback',error:'published state/output/trace/clock unchanged; failed status and diagnostic retained'});
 return result;
}
it('validation performance native parity and measured settlement',async()=>{
 const tools=await io(),baseline=tools.env.VALIDATION_PERF_MODE==='baseline';
 if(baseline)expect(tools.fs.existsSync(file),'baseline must never be overwritten').toBe(false);
 const times:Record<string,number>={};let started=performance.now();
 const b=fixture();times.fixture=(performance.now()-started)/1000;started=performance.now();
 const handle=await prepareCharacterModel(b.s),run=await createCharacterRun(handle,b.d);times.prepare=(performance.now()-started)/1000;
 console.info('VALIDATION_PERF preparation',JSON.stringify(times));started=performance.now();
 for(let i=1;i<=32;i++){expect(await run.settleNextInstant()).toBe(true);if(i%8===0)console.info('VALIDATION_PERF settled',i);}
 times.settle32=(performance.now()-started)/1000;started=performance.now();
 const checkpoint=run.save();times.save32=(performance.now()-started)/1000;started=performance.now();
 expect(await run.settleNextInstant()).toBe(true);times.settle33=(performance.now()-started)/1000;started=performance.now();
 const end=terminal(run,tools.to);expect(end.clock).toBe('33');times.terminal=(performance.now()-started)/1000;started=performance.now();
 const outcomes=await controls(b,handle,tools);times.controls=(performance.now()-started)/1000;
 const bundle={productionBaseline:'13653060',model:tools.to(characterModelIdentity(handle)),checkpoint:tools.to(checkpoint),terminal:end,times,outcomes};
 if(baseline){
  const packed=tools.z.gzipSync(JSON.stringify(bundle),{level:9});
  expect(packed.length).toBeLessThan(5*1024*1024-128*1024);tools.fs.writeFileSync(file,packed,{flag:'wx'});
  console.info('VALIDATION_PERF baseline',JSON.stringify({times,compressedBytes:packed.length,controls:outcomes.length}));
 }else{
  const prior=JSON.parse(tools.z.gunzipSync(tools.fs.readFileSync(file)).toString());
  tools.equal(tools.from(bundle.model),tools.from(prior.model),'model');tools.equal(checkpoint,tools.from(prior.checkpoint),'checkpoint32');
  compare(end,prior.terminal,tools);expect(outcomes).toEqual(prior.outcomes);
  const old=prior.times.settle32+prior.times.settle33,now=times.settle32+times.settle33,reduction=1-now/old;
  console.info('VALIDATION_PERF candidate',JSON.stringify({times,baselineSettlement:old,candidateSettlement:now,reduction,controls:outcomes.length}));
  expect(reduction,'at least 5% lower settlement in fixed single pair').toBeGreaterThanOrEqual(.05);
 }
},570000);

it('validation performance baseline continuation',async()=>{
 const tools=await io(),prior=JSON.parse(tools.z.gunzipSync(tools.fs.readFileSync(file)).toString()),b=fixture(),started=performance.now();
 const run=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:tools.from(prior.checkpoint)});
 expect(await run.settleNextInstant()).toBe(true);compare(terminal(run,tools.to),prior.terminal,tools);
 console.info('VALIDATION_PERF exact baseline32 continuation33',JSON.stringify({seconds:(performance.now()-started)/1000}));
},570000);


it('validation performance rejection preflight',async()=>{
 const tools=await io(),b=fixture(),handle=await prepareCharacterModel(b.s);
 const outcomes=await controls(b,handle,tools);
 console.info('VALIDATION_PERF rejection preflight',JSON.stringify(outcomes));
},120000);