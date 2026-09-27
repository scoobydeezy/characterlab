import {describe,it,expect,beforeAll,vi} from 'vitest';
import registryHex from '../../docs/planning/campaign2-task-cognitive-model/registry.cenc.hex?raw';
import contentHex from '../../docs/planning/campaign2-task-cognitive-model/content.cenc.hex?raw';
import parameterHex from '../../docs/planning/campaign2-task-cognitive-model/parameters.cenc.hex?raw';
import {canonicalEncode as enc,bytesToHex,list,set,record,text,typedIdentifier,unsigned as u,signed,rational,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {compileCognitiveState} from '../campaign2/cognitiveState';
import {createCognitiveExecution} from '../campaign2/cognitiveExecution';
import {compileCognitiveIngress} from '../campaign2/cognitiveIngress';
import {createCognitiveRuntime} from '../campaign2/cognitiveRuntime';
import {beginTransitionIngressV04} from '../campaign2/transitionIngressV04';

import {evidOperands,executeEvid} from '../campaign2/evidExecution';
import {compileOrderedInputProfile,COGNITIVE_INPUT_PROFILE,DELIBERATION_EVENT,PROBE_SOURCE_EVENT} from '../campaign2/orderedInputs';
import type {ScheduledEvent} from '../substrate/scheduler';
import {compileCognitiveModel} from '../campaign2/cognitiveModel';
import {compileCognitiveDeclarations} from '../campaign2/cognitiveDeclarations';
import {decodeCognitive,cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {compileTaskModel} from '../campaign2/taskModel';
import {taskModelReviewSource} from '../campaign2/taskModelReview';
import {dataUnsigned as uint,dataItems as items,dataRecord as rec,dataField as f,dataIdentity as id,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';

const fromHex=(s:string)=>Uint8Array.from(s.trim().match(/../g)!.map(v=>Number.parseInt(v,16)));
const source=()=>({...taskModelReviewSource(),rulesVersion:'rules/campaign2-task-cognitive/0.1-candidate',registrySchemaVersion:'campaign2-task-cognitive-registry/0.1-candidate',numericProfileVersion:'numeric/task-cognitive-exact/0.1-candidate',content:fromHex(contentHex),registry:fromHex(registryHex),parameters:fromHex(parameterHex)});
const replace=(value:CanonicalValue,n:bigint,next:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='record')throw Error('record');return record(value.schema,new Map([...value.fields].map(([k,v])=>[k,k===n?next:v])));};
const mutate=(name:string,change:(v:CanonicalValue)=>CanonicalValue)=>{const s=source(),slots=items(decodeCognitive(s.registry),'list');return {...s,registry:enc(list(slots.map((v,i)=>i===0?set(items(v,'set').map(row=>typeof row!=='boolean'&&row.kind==='record'&&row.schema.typeId===171n&&key(f(row,1n))===key(typedIdentifier(1027,text(name)))?change(row):row)):v)))};};

describe('cognitive whole declaration admission (no runtime qualification)',()=>{
 it('computes the frozen commitment from all bytes and keeps the prior model distinct',async()=>{
  const m=await compileCognitiveModel(source());expect(m.recipe).toBe('baseline');
  expect(bytesToHex(m.modelIdentity.digest)).toBe('abe15a4f6bb6ec13a3ccc825dc5e9d755c4444998fa178dbb8683969a1a2a498');
  expect(m.semanticBundle).toHaveLength(78);
  await expect(compileTaskModel(source())).rejects.toThrow();
 });
 it('qualifies character and task evidence roles separately',async()=>{
  const s=source(),c=await compileCognitiveDeclarations(s.content,s.registry);
  const C=semanticReferentFromAuthoredContent(governedContentDefinitionId('character/bridge-subject'));
  const T=semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-a'));
  const action=typedIdentifier(1027,text('definition/protocol-contact-one'));
  expect(()=>c.validateRecordRoles(enc(r(395,[C,action])))).not.toThrow();
  expect(()=>c.validateRecordRoles(enc(r(395,[T,action])))).toThrowError(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
 });
 it('rejects a well-typed instruction pointing at a concern definition',async()=>{
  const s=mutate('definition/task-instruction-one',v=>replace(v,4n,r(389,[typedIdentifier(1027,text('definition/task-concern'))])));
  await expect(compileCognitiveModel(s)).rejects.toThrow('requires 391/1');
 });
 it('rejects a truth bridge naming a different well-typed producer before commitment',async()=>{
  const s=mutate('definition/protocol-observation',v=>replace(v,4n,replace(f(rec(v,171n),4n),1n,typedIdentifier(1009,text('TaskArbitrationTransition')))));
  await expect(compileCognitiveModel(s)).rejects.toThrow('wrong protocol observation producer');
 });
 it('rejects structurally valid but unfrozen calibration',async()=>{
  const s=mutate('definition/task-workspace',v=>replace(v,4n,replace(f(rec(v,171n),4n),2n,u(4))));
  await expect(compileCognitiveModel(s)).rejects.toThrow('outside the frozen cohort');
 });
 it('rejects an accessor without invoking it',async()=>{
  const s=source();let calls=0;Object.defineProperty(s,'registry',{get(){calls++;return fromHex(registryHex);}});
  await expect(compileCognitiveModel(s)).rejects.toThrow('accessor forbidden');expect(calls).toBe(0);
 });
 it('copies caller bytes before asynchronous admission',async()=>{
  const s=source(),pending=compileCognitiveModel(s);s.registry.fill(0);s.content.fill(0);s.parameters.fill(0);
  expect((await pending).recipe).toBe('baseline');
 });
});

describe('cognitive original and generated source admission',()=>{
 let model:Awaited<ReturnType<typeof compileCognitiveModel>>,component:Awaited<ReturnType<typeof compileCognitiveState>>;
 beforeAll(async()=>{model=await compileCognitiveModel(source());component=await compileCognitiveState(model);});
 const observer=typedIdentifier(1000,text('observer/bridge-subject'));
 const cue=()=>r(377,[observer,typedIdentifier(1027,text('definition/task-workspace'))]);
 const manifest=(at=2,phase=40,payload=cue(),event=DELIBERATION_EVENT)=>enc(list([list([signed(at),u(phase),event,payload,list([])])]));
 function initial(){return new AuthoritativeState([{path:{rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:observer}]},value:r(267,[component.tasks[0].character])},...component.tasks.flatMap((t,i)=>[{path:t.path,value:r(372,[u(1)])},{path:{...t.path,fieldId:2n},value:r(390,[typedIdentifier(1027,text('definition/task-instruction-'+(i?'two':'one')))])}])]);}
 const profile=()=>compileOrderedInputProfile(COGNITIVE_INPUT_PROFILE,model.content,component.prior.base.domains,decodeCognitive);
 async function input(bytes=manifest()){return profile().create(bytes,enc(initial().canonicalValue()),model.modelIdentity,new Uint8Array(32));}
 it('executes the frozen probe/cognition sequence from empty learned state through the common scheduler',async()=>{
  const start=new AuthoritativeState([...initial().entries(),{path:{rootStateTypeId:302n,fieldId:3n,selectors:[{kind:'mapKey',key:r(294,[component.tasks[0].character,typedIdentifier(1029,text('variable/fixture-regulation'))])}]},value:r(299,[signed(-50)])}]);
  const entries=[1,2,3,4,5,6].map(t=>items(decodeCognitive(t===1||t===5?manifest(t,110,r(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),PROBE_SOURCE_EVENT):manifest(t)),'list')[0]);
  const inputs=await profile().create(enc(list(entries)),enc(start.canonicalValue()),model.modelIdentity,new Uint8Array(32));
  const runtime=createCognitiveRuntime(model,component,inputs,component.initialState(enc(start.canonicalValue())));
  for(let i=1;i<=6;i++){expect(await runtime.settleNextInstant()).toBeDefined();expect(runtime.snapshot().clock).toBe(BigInt(i));}
  const snapshot=runtime.snapshot(),types=snapshot.outputs.map(v=>(v as ReturnType<typeof rec>).schema.typeId);
  for(const type of [342n,381n,409n,429n,433n,307n,227n,269n,270n,324n,325n])expect(types).toContain(type);
  expect(snapshot.state.entries().some(e=>e.path.rootStateTypeId===415n)).toBe(true);
  expect(runtime.committedRandomAddressKeys().length).toBeGreaterThan(0);
  while(await runtime.settleNextInstant()){}expect(runtime.snapshot().queue).toEqual([]);
 },20000);
 it('excludes authored facts, coincident probe/cognition, wrong phase and out-of-bound times',async()=>{
  await expect(input(manifest(2,110))).rejects.toThrow();await expect(input(manifest(101))).rejects.toThrow();
  await expect(input(manifest(100,110,r(333,[typedIdentifier(1027,text('definition/regulatory-diagnostic-probe'))]),PROBE_SOURCE_EVENT))).rejects.toThrow();
  const entry=items(decodeCognitive(manifest()),'list')[0];await expect(input(enc(list([entry,entry])))).rejects.toThrow('exclusive');
  await expect(input(manifest(2,40,cue(),typedIdentifier(1001,text('event/authored-adaptation-fact'))))).rejects.toThrow('excludes');
 });
 it('authenticates the entire original event before IDN/state reads or allocation',async()=>{
  const inputs=await input(),engine=createCognitiveExecution(model,component,inputs),read=vi.spyOn(AuthoritativeState.prototype,'read'),allocateRuntimeId=vi.fn(()=>0n);engine.begin(2n);
  try{await expect(engine.execute({...inputs.initialEvents[0],eventId:999n},initial(),{allocateRuntimeId})).rejects.toThrow('original compilation');expect(read).not.toHaveBeenCalled();expect(allocateRuntimeId).not.toHaveBeenCalled();}finally{read.mockRestore();engine.close();}
 });
 it('generates the actual seven upstream stages and rejects lookalike children before reads',async()=>{
  const inputs=await input(),engine=createCognitiveExecution(model,component,inputs),state=initial();let event=inputs.initialEvents[0],ordinal=0n,eventId=100n;const outputs:bigint[]=[];engine.begin(2n);
  try{for(let i=0;i<7;i++){
   if(i>0){const read=vi.spyOn(AuthoritativeState.prototype,'read');try{await expect(engine.execute({...event,eventId:event.eventId+1000n},state,{allocateRuntimeId:()=>ordinal++})).rejects.toThrow('parent association');expect(read).not.toHaveBeenCalled();}finally{read.mockRestore();}}
   const result=await engine.execute(event,state,{allocateRuntimeId:()=>ordinal++});outputs.push((result.output as ReturnType<typeof rec>).schema.typeId);
   if(i===0)expect(result.reads.map(r=>r.path.rootStateTypeId)).toEqual([268n,373n,373n,362n]);
   if(i===1||i===2||i===3||i===6)expect(result.reads).toHaveLength(0);
   const emission=result.emissions()[0],child:ScheduledEvent={...emission,eventId:eventId++,eventSequence:eventId,causalParentEventIds:[event.eventId]};result.bindAllocatedChildren([child]);event=child;
  }
  expect(outputs).toEqual([381n,384n,388n,394n,398n,403n,408n]);expect(ordinal).toBe(7n);
  expect(enc(state.canonicalValue())).toEqual(enc(initial().canonicalValue()));
  expect(()=>engine.prepareCommit()).toThrow('unfinished'); // Arbitration remains pending, not a vacuous successful instant.
  const resolution=await engine.execute(event,state,{allocateRuntimeId:()=>ordinal++});
  expect(uint(f(rec(f(rec(resolution.output,409n),4n),419n),1n))).toBe(2n);
  expect(resolution.emissions()).toEqual([]);expect(resolution.randomDrawRecords).toEqual([]);
  expect(()=>engine.prepareCommit()).toThrow('unfinished'); // Even an empty child plan must bind.
  resolution.bindAllocatedChildren([]);engine.prepareCommit();engine.commit();expect(ordinal).toBe(8n);
  }finally{engine.close();}
 });
 it('component scope: generated choice closes actual EVID and ADAPT ingress alongside identity from a valid retained forecast',async()=>{
  const inputs=await input(),engine=createCognitiveExecution(model,component,inputs),C=component.tasks[0].character;
  // A component-positive retained value, not a public S0 or a prefix-authenticated history.
  const before=new AuthoritativeState([...initial().entries(),{path:{rootStateTypeId:362n,fieldId:1n,selectors:[{kind:'mapKey',key:r(360,[C,typedIdentifier(1027,text('definition/measurement-prediction'))])}]},value:r(361,[rational(0,1),set([r(237,[u(1),typedIdentifier(1115,u(1))])])])}]);
  component.stateModel.validateState(before);const queue=[inputs.initialEvents[0]],outputs:bigint[]=[];let ordinal=10n,sequence=100n,after=before,identity=false;engine.begin(2n);
  const inherited=compileCognitiveIngress(model,component),ingress=beginTransitionIngressV04(inherited.admission,2n),evaluator=inherited.evaluator;
  expect(inherited.admission.outputClosure(typedIdentifier(1026,text('route/character-learning')))).toEqual(['269/1','270/1','342/1','429/1']);
  for(const name of ['TaskQualificationTransition','TaskIdentityApplicationTransition'])expect(inherited.admission.routeKeyForTransition(key(typedIdentifier(1009,text(name))))).toBe(key(typedIdentifier(1026,text('route/character-learning'))));
  const allocator={allocateRuntimeId:()=>ordinal++};
  const bind=(event:ScheduledEvent,plan:{emissions():readonly import('../substrate/scheduler').EventEmission[];bindAllocatedChildren(children:readonly ScheduledEvent[]):void})=>{const children=plan.emissions().map(emission=>({...emission,eventId:sequence,eventSequence:sequence++,causalParentEventIds:[event.eventId]}));plan.bindAllocatedChildren(children);queue.push(...children);};
  const protocol=new Set(engine.protocolEventTypes().map(key));
  try{while(queue.length){queue.sort((a,b)=>a.phase<b.phase?-1:a.phase>b.phase?1:a.eventSequence<b.eventSequence?-1:1);const event=queue.shift()!;
   if(event.phase===140n){
    const stage=[event,...queue.splice(0)],identityEvent=stage.find(e=>key(e.eventTypeId)===key(engine.identityEventType()))!;
    expect(stage).toHaveLength(2);expect(identityEvent).toBeDefined();
    const adaptEvent=stage.find(e=>e!==identityEvent)!,token=ingress.admit(adaptEvent);
    const read=vi.spyOn(AuthoritativeState.prototype,'read');
    let prepared:ReturnType<typeof evaluator.prepare>;
    try{expect(()=>engine.identityCandidate(identityEvent,before)).toThrow('sealed');engine.preflightIdentity(identityEvent,before);expect(()=>engine.identityCandidate(identityEvent,before)).toThrow('sealed');prepared=evaluator.prepare([token],2n);expect(read).not.toHaveBeenCalled();engine.sealIdentityPreflight();}finally{read.mockRestore();}
    const batch=prepared!.begin(before),candidate=engine.identityCandidate(identityEvent,before);expect(candidate.reads).toHaveLength(1);expect(candidate.patch.operations).toHaveLength(1);
    const result=batch.execute(token,allocator);outputs.push(...result.outputs.map(v=>(v as ReturnType<typeof rec>).schema.typeId));const settled=batch.finish();for(const execution of settled.executions)ingress.completeAdaptation(execution).bindAllocatedChildren([]);
    after=component.stateModel.applyPatch(settled.state,candidate.patch,candidate.authority,{writableRoots:[415n],targetPaths:candidate.targetPaths}).state;identity=true;continue;
   }
   if(protocol.has(key(event.eventTypeId))){const result=engine.executeProtocol(event,allocator);for(const v of result.outputs)outputs.push((v as ReturnType<typeof rec>).schema.typeId);bind(event,result.plan);if(result.freeze)bind(event,ingress.observeSemanticFreeze(event,[enc(result.freeze)]));}
   else if(!engine.isEvent(event)){
    const token=ingress.admit(event),evaluation=key(event.eventTypeId)===key(typedIdentifier(1001,text('event/outcome-evaluation'))),output=executeEvid(evidOperands(evaluation,event.payload,ingress.allocateEvidIdentity(token,allocator)));outputs.push((output as ReturnType<typeof rec>).schema.typeId);bind(event,ingress.completeEvid(token,[enc(output)]));
   }else {const result=await engine.execute(event,before,allocator);outputs.push((result.output as ReturnType<typeof rec>).schema.typeId);bind(event,result);if((result.output as ReturnType<typeof rec>).schema.typeId===307n){
    expect(()=>beginTransitionIngressV04(component.prior.base.admission,2n).observeProtocolSource(event,enc(result.output))).toThrow();
    expect(()=>ingress.observeProtocolSource(event,enc(replace(result.output,3n,signed(3))))).toThrow('projection mismatch');
    bind(event,ingress.observeProtocolSource(event,enc(result.output)));
   }}
  }
  expect(identity).toBe(true);expect(outputs).toContain(307n);expect(outputs).toContain(227n);expect(outputs).toContain(429n);expect(after.entries().filter(e=>e.path.rootStateTypeId===415n)).toHaveLength(1);
  expect(outputs).toContain(269n);expect(outputs).toContain(270n);expect(outputs).toContain(324n);expect(outputs).toContain(325n);
  expect(enc(new AuthoritativeState(after.entries().filter(e=>![415n,302n].includes(e.path.rootStateTypeId))).canonicalValue())).toEqual(enc(before.canonicalValue()));ingress.finish();engine.prepareCommit();engine.commit();
  }finally{ingress.abort();engine.close();}
  // Common scheduler rollback and public prefix authentication remain unqualified.
 });
});

describe('cognitive successor state boundaries',()=>{
 let component:Awaited<ReturnType<typeof compileCognitiveState>>;
 beforeAll(async()=>{component=await compileCognitiveState(await compileCognitiveModel(source()));});
 const instruction=()=>r(390,[typedIdentifier(1027,text('definition/task-instruction-one'))]);
 const status=()=>r(372,[u(1)]);
 const planPath=():StatePath=>({...component.tasks[0].path,fieldId:2n});
 const adopted=()=>new AuthoritativeState([{path:component.tasks[0].path,value:status()},{path:planPath(),value:instruction()}]);
 const identityPath=():StatePath=>({rootStateTypeId:415n,fieldId:1n,selectors:[{kind:'mapKey',key:component.identityKey}]});
 const history=()=>r(414,[list([r(413,[typedIdentifier(1138,u(1)),typedIdentifier(1135,u(2)),signed(2),rational(1,35)])])]);
 it('requires actual adoption for every immutable instruction',()=>{
  expect(()=>component.initialState(enc(adopted().canonicalValue()))).not.toThrow();
  expect(()=>component.initialState(enc(new AuthoritativeState([{path:planPath(),value:instruction()}]).canonicalValue()))).toThrow('actually adopted task');
 });
 it('distinguishes valid retained history from admitted initial state',()=>{
  const state=new AuthoritativeState([...adopted().entries(),{path:identityPath(),value:history()}]);
  expect(()=>component.stateModel.validateState(state)).not.toThrow();
  expect(()=>component.initialState(enc(state.canonicalValue()))).toThrow('must be empty');
  expect(()=>component.stateModel.validateState(new AuthoritativeState([{path:identityPath(),value:r(414,[list([])])}]))).toThrow('nonempty');
 });
 it('does not give the status owner an instruction write',()=>{
  const s=adopted();expect(()=>component.stateModel.applyPatch(s,{operations:[{kind:'set',path:planPath(),expected:{presence:true,value:instruction()},newValue:r(390,[typedIdentifier(1027,text('definition/task-instruction-two'))])}]},typedIdentifier(1025,text('authority/prospective-commitments')))).toThrow();
  expect(enc(s.canonicalValue())).toEqual(enc(adopted().canonicalValue()));
 });
 it('keeps instructions byte-identical through terminal status writes',()=>{
  const s=adopted(),next=component.stateModel.applyPatch(s,{operations:[{kind:'set',path:component.tasks[0].path,expected:{presence:true,value:status()},newValue:r(372,[u(3)])}]},typedIdentifier(1025,text('authority/prospective-commitments'))).state;
  expect(enc(next.read(planPath()).value!)).toEqual(enc(instruction()));
  expect(()=>component.initialState(enc(next.canonicalValue()))).toThrow('must be Open');
 });
 it('rejects identity writes under prospective authority',()=>{
  expect(()=>component.stateModel.applyPatch(adopted(),{operations:[{kind:'set',path:identityPath(),expected:{presence:false},newValue:history()}]},typedIdentifier(1025,text('authority/prospective-commitments')))).toThrow();
 });
});

