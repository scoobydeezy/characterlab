import retainedChecks from '../../docs/planning/ASSEMBLED_CHARACTER_M59_CHECKS.txt?raw';
import {arbitrationOutput} from '../assembled/arbitration';
import {valueReasons} from '../assembled/valueReceiving';
import {cognitiveRecord as cr} from '../assembled/codecs';
import {coupledRandomKeyValue,mapCandidatesToBoundedRange,randomCandidate128,randomAddressValue,naturalRandomKeyValue} from '../substrate/random';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
import {sid} from '../assembled/skill';
import {cognitiveSupportedSchemas,decodeCognitive} from '../assembled/codecs';
import {canonicalDecode,RecordSchemaRegistry,record,set,map} from '../substrate/canonicalEncoding';
import {receivingRecord as rec,randomDrawRecord} from '../assembled/codecs';
import {mapIdentities as mapFromDecision} from './fixtures/assembledValueReceiving';
import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import * as stateModule from '../substrate/state';
import {restoreAuthoritativeState,AuthoritativeState,statePathValue} from '../substrate/state';
import {dataField as f,dataUnsigned as uint,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {LOSS,ATTACHMENT} from '../assembled/attachment';
import {REL_OWNER} from '../assembled/relationship';
import {SOCIAL_SOURCE,SOCIAL_UPDATE,personPath,personHistory,personMean,PERSON_OWNER} from '../assembled/social';
import {RUMINATION_SOURCE} from '../assembled/rumination';
import {FATIGUE_SOURCE} from '../assembled/fatigue';
import {CONTROL_SOURCE} from '../assembled/control';
import {DISPLAY} from '../assembled/strategy';
import {fixture as previous,decode,items,key,enc} from './fixtures/assembledRumination';
import {peopleData,target,other} from './fixtures/assembledPersonHistory';
import {thirdKey} from './fixtures/assembledConfiguration';
import {C} from './fixtures/campaign2Cognitive';
import {through,outputs,decisions,draws,choice,signedValue,type Run} from './fixtures/assembledComparison';
import {simInstant} from '../substrate/time';
import {EMBARRASSMENT_RULES,EMBARRASSMENT_REGISTRY} from '../assembled/model';
import {EMBARRASSMENT,EMBARRASSMENT_VERSION,evaluationFold,evaluationSource,evaluationTuple,compileEmbarrassment,createEmbarrassment} from '../assembled/embarrassment';
import {PRIORITY_DISPLAY,importancePath} from '../assembled/priority';
import {nativeRuntime,nativeCase,nativeRows} from './embarrassmentPublicFixtures';
import {estimate} from '../campaign3/embarrassment';
/** M59: physical A/B tasks, no person dependency, unsensed reserve10, workspace6.
 * Fixed known competence incident, coat evaluator reports1/2, choice3.
 * Primary reputation/withdrawal importance3/5, completion1 (defaults stay1/1).
 * Urgency1, third goal0; no support, bond or loss cue.
 * Approved primary: judgment true at1, false at2 in both arms.
 * Only mismatch differs in primary arms. Evidence is independently gated. */
type Opt={competing?:boolean;mixed?:boolean;mismatch?:boolean;seen?:boolean;judgment?:boolean;unknown?:number;denied?:boolean;truth?:boolean;signal?:string;late?:boolean;correction?:boolean;zeroBase?:boolean;duplicate?:boolean};
let base:ReturnType<typeof previous>|undefined,frames:CanonicalValue[]|undefined;
const actionA=typedIdentifier(1027,text('definition/protocol-contact-one')),actionB=typedIdentifier(1027,text('definition/protocol-contact-two'));
function fixture(o:Opt={},seed=0){
 const b=structuredClone(base??(base=previous())),slots=[...items(decode(b.s.registry),'list')];
 const important=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')[0]).filter(t=>key(t)!==key(thirdKey));
 slots.push(list([text(ATTACHMENT)]),list([text(LOSS),list([list([target,actionB]),list([other,actionA])])]),list([text(EMBARRASSMENT),target,important[0],actionA]));
 b.s={...b.s,rulesVersion:EMBARRASSMENT_RULES,registrySchemaVersion:EMBARRASSMENT_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return signedValue(a[0])<=3n&&![RUMINATION_SOURCE,FATIGUE_SOURCE,CONTROL_SOURCE,SOCIAL_SOURCE].some(t=>key(t)===key(a[2]));}).map(v=>{
  const a=items(v,'list');
  if((o.zeroBase||o.competing)&&key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(important[0])&&items(r[1],'list').length)r[1]=list([o.zeroBase?q(0,1):q(3,5)]);return list(r);}))]),a[4]]);}
  if(key(a[2])!==key(DISPLAY))return v;const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=important.some((t,i)=>key(t)===key(r[0])&&uint(r[1])===BigInt(i));return list(r);}))]),a[4]]);
 });
 frames??=items(decode(peopleData(false,0,[{at:1,signals:[['appearance/coat',true]],kind:0},{at:2,signals:[['appearance/coat',true]],continuity:true,kind:0}]).orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE));
 const selected=o.late?[list([signed(3),...items(frames[0],'list').slice(1)])]:[...frames];
 if(o.correction){selected.push(list([signed(3),...items(frames[1],'list').slice(1)]));for(const row of [...rows])if(signedValue(items(row,'list')[0])===3n)rows.push(list([signed(4),...items(row,'list').slice(1)]));}
 for(const frame of selected){const row=[...items(frame,'list')],p=[...items(row[3],'list')],s=[...items(p[1],'list')],r=[...items(p[6],'list')];const at=signedValue(row[0]);s[3]=u(0);s[4]=u(o.duplicate&&at===3n?1:Number(at));s[5]=o.denied!==true;p[1]=list(s);r[2]=false;p[6]=list(r);p[5]=list([list([text(o.signal??'appearance/coat'),true])]);
  p.push(list([u(1),u(1)]),list([false,u(0),false,false,false,true,true]),list([false,u(0),true,u(0)]),list([o.mismatch??true,o.seen??true,(at===3n&&o.correction)||(at===2n&&o.mixed)?false:o.judgment??true].map((v,i)=>list([v,o.unknown!==i,o.truth??true]))));row[3]=list(p);rows.push(list(row));
 }
 b.d={...b.d,runSeed:new Uint8Array(32).fill(seed),orderedInputs:enc(list(rows))};return b;
}
const state=(r:Run)=>restoreAuthoritativeState(canonicalDecode(r.snapshot().state,new RecordSchemaRegistry(cognitiveSupportedSchemas())));
const history=(r:Run)=>state(r).read(personPath(C,target)).value;
const reports=(r:Run,name:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(name))).map(v=>items(v,'list'));
const app=(r:Run,at=3)=>reports(r,EMBARRASSMENT+'/appraisal').find(a=>uint(a[1])===BigInt(at))!;
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:Run,b:Run)=>{for(const k of ['state','outputs','trace'] as const)bytes(a.snapshot()[k],b.snapshot()[k]);bytes(a.save(),b.save());expect(a.snapshot().clock).toBe(b.snapshot().clock);};
const run=async(o:Opt={},at=3n)=>{const {s,d}=fixture(o),r=await createCharacterRun(await prepareCharacterModel(s),d);await through(r,at);return r;};
function live(r:Run,mismatch:boolean){
 const a=app(r);expect(a,'live appraisal').toBeDefined();expect(a[8]).toEqual(text('Known'));expect(a.slice(3,8)).toEqual([list([mismatch]),list([true]),list([q(1,2)]),list([q(mismatch?1:0,2)]),q(3,5)]);expect(a[9]).toEqual(list([q(mismatch?3:0,10),q(mismatch?3:0,10)]));
 expect(personHistory(history(r))).toHaveLength(2);expect(personMean(history(r))).toBeUndefined();
 const nuclei=items(f(rec(f(decisions(r)[0],3n),408n),3n),'list').map(v=>rec(v,407n));expect(nuclei).toHaveLength(2);
 const raw=rec(f(rec(f(decisions(r)[0],3n),408n),2n),403n),bases=items(f(raw,3n),'set').map(v=>rec(v,402n)).filter(v=>uint(f(rec(f(v,1n),401n),3n))===1n);
 expect(bases.map(v=>f(v,2n))).toEqual([q(3,5),q(1,1)]);
 expect(nuclei.map(n=>f(rec(f(n,2n),406n),1n))).toEqual([q(3,8),q(1,2)]);
 expect(nuclei.map(n=>f(rec(f(n,2n),406n),3n))).toEqual([q(mismatch?3:0,13),q(0,1)]);
 expect(nuclei.map(n=>uint(f(n,4n)))).toEqual([4n,6n]);expect(nuclei.map(n=>f(n,5n))).toEqual([signed(0),signed(0)]);
 expect(nuclei.map(n=>f(n,6n))).toEqual([signed(mismatch?2:0),signed(0)]);
 const result=rec(f(rec(f(decisions(r)[0],4n),419n),2n),420n);
 expect(f(result,4n)).toEqual(q(2,3));expect(items(f(result,2n),'list').map(v=>f(rec(v,421n),2n))).toEqual([q(mismatch?2:1,3),q(mismatch?1:2,3)]);
 expect(uint(f(result,8n))).not.toBe(1n);
}
it('integration: live contextual appraisal, fixed sampled choices and exact coupled continuation',async()=>{
 const {s}=fixture({mixed:true,competing:true}),m=await prepareCharacterModel(s),maps=[];
 for(const mismatch of [true,false]){const {d}=fixture({mixed:true,competing:true,mismatch}),r=await createCharacterRun(m,d);await through(r,3n);
  live(r,mismatch);console.info('M59_PREFLIGHT_LIVE '+JSON.stringify({mismatch,importance:'3/5 vs 1',dice:[4,6],modifier:mismatch?2:0,contest:'2/3'}));maps.push(mapFromDecision(r));}
 const changed:number[]=[],continued:number[]=[];let common=0,conditional=0;
 for(let seed=0;seed<8;seed++){
  const rs:Run[]=[];
  for(const [i,mismatch]of [true,false].entries()){
   const {d}=fixture({mixed:true,competing:true,mismatch},seed);d.orderedInputs=enc(list([maps[i].canonicalValue,...items(decode(d.orderedInputs),'list')]));const r=await createCharacterRun(m,d);
   if(seed===0&&mismatch){await through(r,2n);const b=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:r.save()}),repeat=await createCharacterRun(m,d);await through(repeat,2n);exact(r,b);exact(r,repeat);for(const x of [r,b,repeat])await through(x,3n);exact(r,b);exact(r,repeat);}else await through(r,3n);
   live(r,mismatch);rs.push(r);
  }
  const [a,b]=rs,aa=draws(a),bb=draws(b),shared=aa.filter(x=>bb.some(y=>key(f(x,2n))===key(f(y,2n))));expect(shared).toHaveLength(2);common+=shared.length;
  for(const x of shared){const y=bb.find(y=>key(f(x,2n))===key(f(y,2n)))!;expect(f(x,3n)).toEqual(f(y,3n));expect(f(x,7n)).toEqual(f(y,7n));}
  const identities=rs.map(r=>items(f(rec(f(decisions(r)[0],3n),408n),3n),'list').map(v=>key(f(rec(v,407n),1n))).sort());expect(identities[0]).toEqual(identities[1]);
  for(const r of rs){const result=rec(f(rec(f(decisions(r)[0],4n),419n),2n),420n),tie=rec(f(result,10n),423n),unmatched=draws(r).filter(x=>!shared.some(y=>key(f(x,2n))===key(f(y,2n))));if(unmatched.length){expect(unmatched).toHaveLength(1);expect(uint(f(tie,1n))).toBe(2n);expect(f(tie,3n)).toEqual(unmatched[0]);conditional++;}for(const reason of items(f(result,9n),'list').map(x=>rec(x,422n))){const d=randomDrawRecord(f(reason,5n));expect(shared.some(x=>key(f(x,2n))===key(f(d,2n)))).toBe(true);}}
  if(choice(a)!==choice(b))changed.push(seed);if(choice(a).includes('protocol-contact-two'))continued.push(seed);
  if(seed===0){const ts=outputs(a.snapshot().trace,160n),t=ts.find(t=>key(f(t,6n))===key(text(EMBARRASSMENT_VERSION))&&uint(f(rec(f(t,4n),130n),3n))===50n)!;expect(t).toBeDefined();const reads=items(f(t,11n),'list').map(v=>key(f(rec(v,147n),2n)));expect(reads).toContain(key(statePathValue(personPath(C,target))));expect(reads).toContain(key(statePathValue(importancePath(items(items(decode(s.registry),'list')[42],'list')[2]))));expect(f(t,13n)).toEqual(list(app(a)));}
  console.info('M59_CELL '+JSON.stringify({seed,exposed:choice(a),noMismatch:choice(b),shared:shared.length}));
 }
 expect(changed).toEqual([]);expect(continued).toEqual([0,1,2,3,4,5,6]);console.info('M59_SAMPLED_REGRESSION '+JSON.stringify({changed,continued,common,conditional,continuation:'exact2-to3'}));
},590000);
it('controls: gated recognition, unknown and timing; original contextual projections and alternatives',async()=>{
 const a=await run();expect(app(a)[9]).toEqual(list([q(1,1),q(1,1)]));
 for(const [o,status,amount]of [[{mismatch:false},'Known',0],[{seen:false},'Known',0],[{judgment:false},'Known',0],[{unknown:0},'Unavailable',undefined],[{unknown:1},'Unavailable',undefined],[{unknown:2},'Unavailable',undefined],[{denied:true},'Unavailable',undefined],[{signal:'appearance/stripe'},'Unavailable',undefined],[{signal:'appearance/plain'},'Unavailable',undefined],[{late:true},'Unavailable',undefined]] as [Opt,string,number|undefined][]){const r=await run(o);expect(app(r)[8]).toEqual(text(status));expect(app(r)[9]).toEqual(list(amount===undefined?[]:[q(amount,1),q(amount,1)]));if(o.late)expect(evaluationFold(personHistory(history(r))).likelihood).toEqual(readQ(q(1,1)));console.info('M59_CONTROL '+JSON.stringify({o,status,amount}));}
 const hidden=await run({truth:false});expect(reports(hidden,EMBARRASSMENT+'/appraisal')).toEqual(reports(a,EMBARRASSMENT+'/appraisal'));expect(outputs(hidden.snapshot().outputs,409n)).toEqual(outputs(a.snapshot().outputs,409n));expect(history(hidden)).toEqual(history(a));
 const deniedA=await run({unknown:2,judgment:true}),deniedB=await run({unknown:2,judgment:false});bytes(deniedA.snapshot().outputs,deniedB.snapshot().outputs);bytes(deniedA.snapshot().state,deniedB.snapshot().state);
 const corrected=await run({correction:true}),before=app(corrected);expect(before[6]).toEqual(list([q(1,1)]));await through(corrected,4n);expect(app(corrected,4)[6]).toEqual(list([q(2,3)]));expect(app(corrected)).toEqual(before);
 const zero=await run({zeroBase:true});expect(app(zero)[8]).toEqual(text('Known'));expect(app(zero)[9]).toEqual(list([q(0,1),q(0,1)]));expect(items(reports(zero,EMBARRASSMENT+'/reasons')[0][3],'list')).toHaveLength(0);
 const model=await compileCharacterModel(fixture().s),component=await compileCharacterState(model),consumer=createEmbarrassment(model.embarrassment!,C,component.stateModel,model.modelIdentity.value,decode(a.runIdentity()));
 const event={dueAt:simInstant(4n),phase:50n,eventId:99999n,eventSequence:99999n,eventTypeId:sid(1001,'event/task-appraisal'),payload:list([]),dependencies:list([]),causalParentEventIds:[]};expect(items(consumer.appraise(event,state(a)).report,'list')[9]).toEqual(list([q(1,1),q(1,1)]));
 const raw=rec(items(decode(a.snapshot().outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===403n)!,403n),noBase=record(raw.schema,new Map([...raw.fields].map(([n,v])=>[n,n===3n?set(items(v,'set').filter(s=>key(f(rec(f(rec(f(rec(s,402n),1n),401n),1n),395n),2n))!==key(actionA))):v]))),without=consumer.raw({...event,phase:80n,eventTypeId:sid(1001,'event/task-raw-signals')},noBase);expect(without.output).toEqual(noBase);expect(items(items(without.report,'list')[3],'list')).toHaveLength(0);
 for(const [scenario,o]of [['Balanced',{}],['NoMismatch',{mismatch:false}],['Unseen',{seen:false}],['UnknownJudgment',{unknown:2}],['Nonnegative',{judgment:false}]] as const){const native=await nativeRuntime(nativeCase(scenario));for(let i=0;i<3;i++)await native.runtime.settle();const original=nativeRows(native.runtime.snapshot().outputs).at(-1)!,r=scenario==='Balanced'?a:await run(o);expect(items(app(r)[9],'list').map(v=>{const x=readQ(v);return `${x.numerator}/${x.denominator}`;})).toEqual(original.affect);console.info('M59_NATIVE '+scenario+' '+JSON.stringify(original.affect));}
 const mixed=[[{at:1,value:true}],[{at:1,value:true}],[{at:1,value:true},{at:2,value:false}]];expect(estimate(mixed,'Contextual').likelihood).toEqual(readQ(q(1,2)));expect(estimate(mixed,'Latest').likelihood).toEqual(readQ(q(0,1)));mixed[0][0].value=false;expect(estimate(mixed,'Contextual').likelihood).toEqual(readQ(q(0,1)));expect(estimate(mixed,'JudgmentOnly').likelihood).toEqual(readQ(q(1,2)));
 console.info('M59 epistemic/timing/no-base and five native contextual projections PASS; Latest/JudgmentOnly preserved');
},590000);
it('boundaries: owner, append-only receipt, admission and reached learning rollback',async()=>{
 const {s,d}=fixture(),m=await prepareCharacterModel(s),model=await compileCharacterModel(s),component=await compileCharacterState(model),r=await createCharacterRun(m,d);await through(r,1n);const current=state(r),path=personPath(C,target),old=current.read(path).value!,rows=personHistory(old),next=[...items(rows[0],'list')];next[0]=typedIdentifier(1115,u(9999));next[3]=signed(2);next[5]=u(2);const value=list([text('assembled-social/0.1'),list([...rows,list(next)])]);const patch={operations:[{kind:'set' as const,path,expected:{presence:true as const,value:old},newValue:value}]};
 expect(()=>component.stateModel.applyPatch(current,patch,REL_OWNER)).toThrow();expect(personHistory(component.stateModel.applyPatch(current,patch,PERSON_OWNER).state.read(path).value)).toHaveLength(2);expect(()=>component.stateModel.applyPatch(current,{operations:[{...patch.operations[0],newValue:old}]},PERSON_OWNER)).toThrow('history rewrite');
 const bad=[...next];bad[9]=list([list([u(1)]),list([]),list([])]);expect(()=>component.stateModel.applyPatch(current,{operations:[{...patch.operations[0],newValue:list([text('assembled-social/0.1'),list([...rows,list(bad)])])}]},PERSON_OWNER)).toThrow();
 const initial=restoreAuthoritativeState(decode(d.initialState));await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value:old}]).canonicalValue())})).rejects.toThrow();
 for(const bad of [list([]),list([list([true,true])]),list([list([true,u(1),false]),list([true,true,true]),list([true,true,true])])])expect(()=>evaluationSource(bad)).toThrow();
 const c=fixture({correction:true,duplicate:true}),changed=await createCharacterRun(m,c.d);await through(changed,2n);await expect(changed.settleNextInstant()).rejects.toThrow('receipt changed');
 const before=r.snapshot(),apply=stateModule.applyStatePatch;let reached=false;const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===810n)){expect(personHistory(result.state.read(path).value)).toHaveLength(2);reached=true;throw Error('M59 after person140');}return result;});try{await expect(r.settleNextInstant()).rejects.toThrow('M59 after person140');expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)bytes(r.snapshot()[k],before[k]);expect(r.snapshot().clock).toBe(before.clock);}finally{spy.mockRestore();}
 console.info('M59 owner/append-only/report grammar/bootstrap/receipt/after-person140 rollback PASS');
},180000);

it('persistence: post-choice save containing qualified identity restores exactly',async()=>{
 const {s,d}=fixture(),a=await createCharacterRun(await prepareCharacterModel(s),d);await through(a,3n);expect(app(a)[9]).toEqual(list([q(1,1),q(1,1)]));expect(uint(f(rec(f(rec(f(decisions(a)[0],4n),419n),2n),420n),8n))).toBe(1n);
 const b=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,b);
 const canonical=canonicalDecode(a.snapshot().state,new RecordSchemaRegistry(cognitiveSupportedSchemas()));expect(decodeCognitive(a.snapshot().state)).toEqual(canonical);
 const leaf=items(canonical,'set')[0];
 const extension=items(decode(a.snapshot().outputs),'list').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===403n)!,badLeaf=record(rec(leaf,151n).schema,new Map([[1n,extension],[2n,extension]]));expect(()=>decodeCognitive(enc(badLeaf))).toThrow('unrelated record');
 const malformed=record(rec(extension,403n).schema,new Map([...rec(extension,403n).fields].map(([n,v])=>[n,n===3n?list([]):v])));expect(()=>decodeCognitive(enc(record(rec(leaf,151n).schema,new Map([[1n,f(rec(leaf,151n),1n)],[2n,malformed]]))))).toThrow();
 const save=rec(decodeCognitive(a.save()),132n),corrupt=record(save.schema,new Map([...save.fields].map(([n,v])=>[n,n===5n?set([]):v])));await expect(restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:enc(corrupt)})).rejects.toThrow('whole-save prefix equality');
 console.info('M59 post-choice full-state save/restore and malformed metadata/nested record/whole-save corruption PASS');
},180000);

/** Fixed already-executed cohort only; no fixture construction or new seed search. */
it('diagnostic: reconcile fixed M59 coupled faces and scores with retained choices',async()=>{
 const effective=(purpose:string,subjects:readonly (readonly [string,CanonicalValue])[])=>coupledRandomKeyValue({
  keyId:sid(10006,key(list([text('M34'),signed(3),sid(1042,'purpose/'+purpose),list(subjects.map(([role,id])=>list([sid(1043,'subject/'+role),id])))]))),
  comparisonRoleId:sid(10005,'assembled/'+purpose),
 });
 const reasonKeys=['a','b'].map((task,i)=>effective('task-reason-face',[['actor',C],['action',i?actionB:actionA],['task',semanticReferentFromAuthoredContent(governedContentDefinitionId('content/task-'+task))]])),tieKey=effective('task-decision-tie',[['actor',C]]);
 const cells:{seed:number;faces:string[];positive:string;neutral:string;tie:string|null}[]=[];
 for(let seed=0;seed<8;seed++){
  const runSeed=new Uint8Array(32).fill(seed),draw=async(k:CanonicalValue,span:bigint)=>(await mapCandidatesToBoundedRange(span,async index=>(await randomCandidate128(runSeed,k,index)).candidate)).result;
  const a=await draw(reasonKeys[0],4n)+1n,b=await draw(reasonKeys[1],6n)+1n;let tie:bigint|undefined;
  if(a===b||a+2n===b)tie=await draw(tieKey,2n);
  const selected=(offset:bigint)=>a+offset>b?'Withdraw':a+offset<b?'Continue':tie===0n?'Withdraw':'Continue';
  const cell={seed,faces:[String(a),String(b)],positive:selected(2n),neutral:selected(0n),tie:tie===undefined?null:String(tie)};cells.push(cell);console.info('M59_FIXED_DRAWS '+JSON.stringify(cell));
 }
 const expected=Array.from({length:8},(_,i)=>i===7?'Withdraw':'Continue');
 expect(cells.map(c=>c.positive)).toEqual(expected);expect(cells.map(c=>c.neutral)).toEqual(expected);
},15000);

/** Owner-approved seam proof; controlled legal faces, not runtime RNG or a new run. */
it('exhaustive: all48 coupled face/tie cases through assembled arbitration',async()=>{
 // Restore retained diagnostic identities/definitions with the existing schema registry.
 const hydrate=(v:any):CanonicalValue=>{
  if(typeof v==='boolean')return v;
  switch(v.kind){
   case 'unsigned':return u(BigInt(v.value));case 'signed':return signed(BigInt(v.value));case 'text':return text(v.value);
   case 'rational':return q(BigInt(v.numerator),BigInt(v.denominator));
   case 'typedIdentifier':return typedIdentifier(BigInt(v.namespaceId),hydrate(v.payload));
   case 'list':return list(v.items.map(hydrate));case 'set':return set(v.items.map(hydrate));
   case 'map':return map(v.entries.map(([a,b]:any[])=>[hydrate(a),hydrate(b)]));
   case 'record':return record(cognitiveSupportedSchemas().find(s=>s.typeId===BigInt(v.schema.typeId)&&s.schemaVersion===BigInt(v.schema.schemaVersion))!,new Map(v.fields.map(([n,x]:any[])=>[BigInt(n),hydrate(x)])));
   default:throw Error('unsupported retained diagnostic value');
  }
 };
 const saved=JSON.parse(retainedChecks.split(/\r?\n/).find(s=>s.startsWith('M59_CALIBRATION '))!.slice('M59_CALIBRATION '.length)),original=rec(hydrate(saved.raw),403n),definitions=saved.definitions.map(hydrate) as CanonicalValue[];
 const dice=definitions.find(v=>rec(v,typeof v!=='boolean'&&v.kind==='record'?v.schema.typeId:0n).schema.typeId===437n)!,definition=definitions.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===440n)!;
 const candidates=items(f(rec(f(original,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n)),occ=(n:number)=>typedIdentifier(n,u(1));
 expect(candidates.map(v=>f(rec(v,395n),2n))).toEqual([actionA,actionB]);expect(items(f(original,5n),'set')).toHaveLength(0);
 const contexts=[true,false].map(mismatch=>{
  const signals=items(f(original,3n),'set').flatMap(v=>{const r=rec(v,402n),k=rec(f(r,1n),401n),role=uint(f(k,3n)),first=key(f(k,1n))===key(candidates[0]);
   if(role===2n&&!mismatch)return [];return [record(r.schema,new Map([...r.fields].map(([n,x])=>[n,n===2n&&first?(role===1n?q(3,5):q(3,10)):x])))];});
  const raw=record(original.schema,new Map([...original.fields].map(([n,x])=>[n,n===3n?set(signals):n===4n?map([[candidates[0],mismatch?q(9,19):q(3,8)],[candidates[1],q(1,2)]]):x]))),nuclei=valueReasons(raw,dice,3).map(v=>rec(v,407n));
  // Exact decision-consumed correspondence to the full-run live assertions.
  expect(nuclei.map(n=>f(n,1n))).toEqual(items(hydrate(saved.nuclei),'list').map(v=>f(rec(v,407n),1n)));
  expect(nuclei.map(n=>f(rec(f(n,2n),406n),1n))).toEqual([q(3,8),q(1,2)]);
  expect(nuclei.map(n=>f(rec(f(n,2n),406n),3n))).toEqual([q(mismatch?3:0,13),q(0,1)]);
  expect(nuclei.map(n=>uint(f(n,4n)))).toEqual([4n,6n]);expect(nuclei.map(n=>f(n,5n))).toEqual([signed(0),signed(0)]);expect(nuclei.map(n=>f(n,6n))).toEqual([signed(mismatch?2:0),signed(0)]);
  return cr(408,[occ(1134),raw,list(nuclei)]);
 });
 let pairs=0,changed=0,continued=0,neutralContinued=0;
 for(let a=1n;a<=4n;a++)for(let b=1n;b<=6n;b++)for(let tie=0n;tie<2n;tie++){
  const winners:CanonicalValue[]=[];
  for(const [arm,context] of contexts.entries()){
   let reasons=0,ties=0;
   const draw=(value:bigint,span:bigint,nucleus?:CanonicalValue)=>{
    expect(value>=0n&&value<span).toBe(true);const nk=nucleus?rec(f(rec(nucleus,407n),1n),404n):undefined,candidate=nk?rec(f(nk,1n),395n):undefined;
    const address={causalRootId:occ(1135),purposeId:sid(1042,nk?'purpose/task-reason-face':'purpose/task-decision-tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:C},...(nk?[{subjectRoleId:sid(1043,'subject/action'),subjectId:f(candidate!,2n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>},{subjectRoleId:sid(1043,'subject/task'),subjectId:f(nk,3n) as Extract<CanonicalValue,{kind:'typedIdentifier'}>}]:[])],drawIndex:0n};
    return cr(411,[randomAddressValue(address),naturalRandomKeyValue(address),u(value),u(span),u(((1n<<128n)/span)*span),false,list([cr(410,[u(0),u(value),false])])],1);
   };
   const result=rec(f(rec(f(rec(await arbitrationOutput(occ(1135),3n,context,definition,{
    async reason(n){reasons++;const first=key(f(rec(f(rec(n,407n),1n),404n),1n))===key(candidates[0]);return draw((first?a:b)-1n,first?4n:6n,n);},
    async tie(leaders){ties++;expect(leaders).toEqual(candidates);return draw(tie,2n);},
   }),409n),4n),419n),2n),420n);
   expect(reasons).toBe(2);expect(ties).toBe(a+(arm===0?2n:0n)===b?1:0);expect(uint(f(result,8n))).not.toBe(1n);expect(f(result,4n)).toEqual(q(2,3));
   expect(items(f(result,2n),'list').map(v=>f(rec(v,421n),2n))).toEqual([q(arm===0?2:1,3),q(arm===0?1:2,3)]);
   expect(items(f(result,9n),'list').map(v=>f(rec(v,422n),7n))).toEqual([signed(a+(arm===0?2n:0n)),signed(b)]);
   const winner=f(result,1n),expected=a+(arm===0?2n:0n)>b?0:a+(arm===0?2n:0n)<b?1:Number(tie);expect(winner).toEqual(candidates[expected]);winners.push(winner);
  }
  pairs++;if(key(winners[0])!==key(winners[1]))changed++;if(key(winners[0])===key(candidates[1]))continued++;if(key(winners[1])===key(candidates[1]))neutralContinued++;
 }
 expect({pairs,changed,continued,neutralContinued}).toEqual({pairs:48,changed:16,continued:16,neutralContinued:32});
 console.info('M59_EXHAUSTIVE '+JSON.stringify({pairs,changed,continued,neutralContinued,scope:'production arbitration seam; controlled faces; original full-run0/8 retained'}));
},15000);
