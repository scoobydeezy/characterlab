import {receivingRecord as rec,randomDrawRecord} from '../assembled/codecs';
import {mapIdentities as mapFromDecision} from './fixtures/assembledValueReceiving';
/** M57 fixed scene: physical A/B tasks, no person dependencies, reserve10 unsensed,
 * workspace6; recognized coat support at1/2, absent cue3, alternative true/demand false.
 * Owner-approved witness: support opportunity only at1 in both arms;
 * original two-support scene retained as Auto control. Only unableUnaided differs. No learned bootstrap, authored bond, or active partner. */
import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import * as stateModule from '../substrate/state';
import {restoreAuthoritativeState,AuthoritativeState,statePathValue} from '../substrate/state';
import {dataField as f,dataUnsigned as uint,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,ATTACHMENT_RULES,ATTACHMENT_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {ATTACHMENT,ATTACHMENT_CUE,ATTACHMENT_VERSION,attachmentFold,attachmentCue,supportSource,safeSupport} from '../assembled/attachment';
import {relationshipPath,relationshipHistory,relationshipFold,REL_OWNER,REL,REL_UPDATE} from '../assembled/relationship';
import {createRelationshipExecution} from '../assembled/relationshipExecution';
import {SOCIAL_SOURCE,personPath,PERSON_OWNER} from '../assembled/social';
import {RUMINATION_SOURCE} from '../assembled/rumination';
import {FATIGUE_SOURCE} from '../assembled/fatigue';
import {CONTROL_SOURCE} from '../assembled/control';
import {DISPLAY} from '../assembled/strategy';
import {fixture as previous,decode,items,key,enc} from './fixtures/assembledRumination';
import {peopleData,target,other} from './fixtures/assembledPersonHistory';
import {thirdKey} from './fixtures/assembledConfiguration';
import {C} from './fixtures/campaign2Cognitive';
import {through,outputs,decisions,draws,choice,signedValue,type Run} from './fixtures/assembledComparison';
import {attachmentRecipe,compileAttachmentModel,compileAttachmentInputs,HOLDERS} from '../campaign3/attachmentModel';
import {createAttachmentRuntime} from '../campaign3/attachmentRuntime';
import {cases,ordered,initialState,seed as originalSeed} from './attachmentFixtures';
import {simInstant} from '../substrate/time';
type Opt={dependent?:boolean;participant?:boolean;units?:number;resolved?:boolean;demand?:boolean;visible?:boolean;access?:boolean;opportunity?:boolean;present?:boolean;cue?:boolean;truth?:boolean;signal?:string;one?:boolean};
let base:ReturnType<typeof previous>|undefined,frames:CanonicalValue[]|undefined;
function fixture(o:Opt={},seed=0){
 const b=structuredClone(base??(base=previous())),slots=[...items(decode(b.s.registry),'list')];
 slots.push(list([text(ATTACHMENT)]));b.s={...b.s,rulesVersion:ATTACHMENT_RULES,registrySchemaVersion:ATTACHMENT_REGISTRY,registry:enc(list(slots))};
 const important=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')[0]).filter(t=>key(t)!==key(thirdKey));
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return signedValue(a[0])<=3n&&![RUMINATION_SOURCE,FATIGUE_SOURCE,CONTROL_SOURCE,SOCIAL_SOURCE].some(t=>key(t)===key(a[2]));}).map(v=>{
  const a=items(v,'list');
  if(key(a[2])!==key(DISPLAY))return v;
  const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=important.some((t,i)=>key(t)===key(r[0])&&uint(r[1])===BigInt(i));return list(r);}))]),a[4]]);
 });
 frames??=items(decode(peopleData(false,0,[{at:1,signals:[['appearance/coat',true]],kind:0},{at:2,signals:[['appearance/coat',true]],continuity:true,kind:0}]).orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE));
 for(const frame of frames){const row=[...items(frame,'list')],p=[...items(row[3],'list')],s=[...items(p[1],'list')],r=[...items(p[6],'list')];s[5]=o.access??true;p[1]=list(s);r[2]=o.participant??true;p[6]=list(r);p[5]=list([list([text(o.signal??'appearance/coat'),true])]);
  p.push(list([u(1),u(1)]),list([o.opportunity!==false&&!(o.one&&signedValue(row[0])===2n),u(o.units??2),o.resolved??true,o.demand??true,o.dependent??true,o.visible??true,o.truth??true]));row[3]=list(p);rows.push(list(row));
 }
 rows.push(list([signed(3),u(10),ATTACHMENT_CUE,list([text(ATTACHMENT),target,o.present??false,true,false,o.cue??true,o.truth??true]),list([])]));
 b.d={...b.d,runSeed:new Uint8Array(32).fill(seed),orderedInputs:enc(list(rows))};return b;
}
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const history=(r:Run,t=target)=>state(r).read(relationshipPath(C,t)).value;
const reports=(r:Run,name:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(name))).map(v=>items(v,'list'));
const view=(r:Run,t=target)=>reports(r,'assembled-relationship-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(v=>key(v[2])===key(t))!;
const derived=(r:Run,t=target)=>items(view(r,t)[10],'list');
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:Run,b:Run)=>{for(const k of ['state','outputs','trace'] as const)bytes(a.snapshot()[k],b.snapshot()[k]);bytes(a.save(),b.save());expect(a.snapshot().clock).toBe(b.snapshot().clock);};
const run=async(o:Opt={},at=3n)=>{const {s,d}=fixture(o),r=await createCharacterRun(await prepareCharacterModel(s),d);await through(r,at);return r;};
function live(r:Run,count:number,historyLength=2){
 expect(relationshipHistory(history(r))).toHaveLength(historyLength);expect(relationshipFold(history(r))).toEqual({count:0n,rupture:false,comfort:false});
 const v=view(r);expect(v[7]).toBe(true);expect(uint(derived(r)[1])).toBe(BigInt(count));expect(derived(r)[2]).toEqual(q(count,2));expect(derived(r)[3]).toEqual(list([q(count,2)]));
 const context=rec(f(decisions(r)[0],3n),408n),raw=rec(f(context,2n),403n),options=rec(f(raw,2n),398n);
 expect(items(f(options,3n),'list')).toHaveLength(2);expect(items(f(context,3n),'list').length).toBeGreaterThan(1);
 expect(uint(f(rec(f(rec(f(decisions(r)[0],4n),419n),2n),420n),8n))).not.toBe(1n);
 const joined=items(v[9],'list').map(v=>items(v,'list'));expect(joined.length).toBeGreaterThan(0);
 const contact=f(rec(joined[0][0],401n),1n),nucleus=items(f(context,3n),'list').map(v=>rec(v,407n)).find(n=>key(f(rec(f(n,1n),404n),1n))===key(contact))!;
 expect(f(nucleus,5n)).toEqual(signed(count)); // raw count/2 -> bounded count/(count+2) -> unit1/4.

 for(const j of joined){expect(j[2]).toEqual(q(0,1));expect(j[6]).toEqual(q(count,2));expect(readQ(j[4]).subtract(typeof j[1]!=='boolean'&&j[1].kind==='list'?readQ(q(0,1)):readQ(f(rec(j[1],402n),2n))).equals(readQ(q(count,2)))).toBe(true);}
}
it('witness: fixed coupled dependence changes a choice and survives continuation',async()=>{
 const {s}=fixture(),m=await prepareCharacterModel(s),maps=[];
 for(const dependent of [true,false]){const {d}=fixture({dependent,one:true}),r=await createCharacterRun(m,d);await through(r,3n);live(r,dependent?1:0,1);maps.push(mapFromDecision(r));}
 const changed:number[]=[];let common=0,conditional=0;
 for(let seed=0;seed<8;seed++){
  const rs:Run[]=[];
  for(const [i,dependent]of [true,false].entries()){const {d}=fixture({dependent,one:true},seed);d.orderedInputs=enc(list([maps[i].canonicalValue,...items(decode(d.orderedInputs),'list')]));const r=await createCharacterRun(m,d);
   if(seed===0&&dependent){await through(r,2n);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:r.save()}),repeat=await createCharacterRun(m,d);await through(repeat,2n);exact(r,restored);exact(r,repeat);for(const x of [r,restored,repeat])await through(x,3n);exact(r,restored);exact(r,repeat);}else await through(r,3n);
   live(r,dependent?1:0,1);rs.push(r);
  }
  const [a,b]=rs;expect(state(a).read(personPath(C,target))).toEqual(state(b).read(personPath(C,target)));
  const aa=draws(a),bb=draws(b),shared=aa.filter(x=>bb.some(y=>key(f(x,2n))===key(f(y,2n))));
  expect(shared.length).toBeGreaterThan(0);
  for(const x of shared){const y=bb.find(y=>key(f(x,2n))===key(f(y,2n)))!;expect(f(x,3n)).toEqual(f(y,3n));expect(f(x,7n)).toEqual(f(y,7n));}common+=shared.length;
  // Same complete reason identities and fixed random faces. Only tie draw may be conditional.
  const contexts=rs.map(r=>rec(f(decisions(r)[0],3n),408n)),nuclei=contexts.map(c=>items(f(c,3n),'list').map(v=>rec(v,407n)));
  expect(nuclei[0].map(n=>key(f(n,1n))).sort()).toEqual(nuclei[1].map(n=>key(f(n,1n))).sort());
  expect(nuclei[0].map(key)).not.toEqual(nuclei[1].map(key));
  for(const r of rs){const result=rec(f(rec(f(decisions(r)[0],4n),419n),2n),420n),tie=rec(f(result,10n),423n),reasonRows=items(f(result,9n),'list').map(x=>rec(x,422n));expect(reasonRows.length).toBe(nuclei[0].length);
   const unmatched=draws(r).filter(x=>!shared.some(y=>key(f(x,2n))===key(f(y,2n))));
   if(unmatched.length){expect(unmatched).toHaveLength(1);expect(uint(f(tie,1n))).toBe(2n);expect(f(tie,3n)).toEqual(unmatched[0]);conditional++;}
   for(const reason of reasonRows){const draw=randomDrawRecord(f(reason,5n));expect(shared.some(x=>key(f(x,2n))===key(f(draw,2n)))).toBe(true);}
  }
  if(choice(a)!==choice(b))changed.push(seed);
  if(seed===0){
   const ts=outputs(a.snapshot().trace,160n),t=ts.find(t=>txt(f(t,6n))===ATTACHMENT_VERSION&&uint(f(rec(f(t,4n),130n),3n))===80n)!;
   expect(t).toBeDefined();const cue=reports(a,ATTACHMENT+'/cue')[0],cueTrace=ts.find(t=>key(f(rec(f(t,4n),130n),5n))===key(ATTACHMENT_CUE))!;
   const ids=items(f(t,9n),'list').map(key);for(const id of [cue[1],...items(derived(a)[5],'list')])expect(ids).toContain(key(id));
   expect(items(f(t,11n),'list').some(v=>key(f(rec(v,147n),2n))===key(statePathValue(relationshipPath(C,target))))).toBe(true);
   for(const child of items(f(t,18n),'list'))expect(items(f(rec(child,130n),8n),'list')).toContainEqual(f(rec(f(cueTrace,4n),130n),1n));
  }
  console.info('M57_CELL '+JSON.stringify({seed,dependent:choice(a),selfSufficient:choice(b),shared:shared.length}));
 }
 expect(changed.length).toBeGreaterThan(0);console.info('M57_WITNESS '+JSON.stringify({runs:16,changed,common,conditional,continuation:'exact2-to3'}));
},590000);

it('controls: admitted support, recognition, cue and hidden truth boundaries',async()=>{
 const a=await run();
 for(const [o,count,length,missing]of [
  [{participant:false},0,0,0],[{one:true},1,1,0.5],[{units:0},0,2,0],[{resolved:false},0,2,0],[{demand:false},0,2,0],[{dependent:false},0,2,0],
  [{present:true},2,2,0],[{cue:false},2,2,null],[{signal:'appearance/stripe'},0,0,0],[{signal:'appearance/plain'},0,0,0]
 ] as [Opt,number,number,number|null][]){
  const r=await run(o);expect(relationshipHistory(history(r))).toHaveLength(length);const d=derived(r);expect(uint(d[1])).toBe(BigInt(count));expect(d[3]).toEqual(list(missing===null?[]:[q(Math.round(missing*2),2)]));
  if(o.signal==='appearance/plain')expect(relationshipHistory(history(r,other))).toHaveLength(2);
 }
 const hidden=await run({truth:false});bytes(a.snapshot().state,hidden.snapshot().state);bytes(a.snapshot().outputs,hidden.snapshot().outputs);
 for(const o of [{visible:false},{access:false},{opportunity:false}]){
  const x=await run({...o,units:2,truth:true}),y=await run({...o,units:0,resolved:false,demand:false,dependent:false,truth:false});
  bytes(x.snapshot().state,y.snapshot().state);bytes(x.snapshot().outputs,y.snapshot().outputs);expect(relationshipHistory(history(x))).toHaveLength(0);
 }
 console.info('M57_CONTROLS own/witness, one/repeated, zero/unresolved/inactive/self-sufficient, present/unknown, hidden/denied/no-opportunity, unconfigured/other identity PASS');
},590000);

it('native: exact Bond and MissingContact correspondence; retained alternatives',async()=>{
 const synthetic=(o:Opt,count=2)=>Array.from({length:count},(_,i)=>list([typedIdentifier(1115,u(i)),C,target,signed(i+1),true,o.participant??true,u(0),list([u(o.units??2),o.resolved??true,o.demand??true,o.dependent??true])]));
 const cue=(o:Opt)=>list([text(ATTACHMENT+'/cue'),typedIdentifier(1115,u(99)),C,target,u(3),list(o.cue===false?[]:[o.present??false,true,false])]);
 for(const [name,o] of [['main',{}],['selfSufficient',{dependent:false}],['incidental',{demand:false}],['unresolved',{resolved:false}],['witnessA',{participant:false}],['present',{present:true}],['missingCue',{cue:false}],['noCurrentDemand',{}]] as const){
  const m=await compileAttachmentModel(attachmentRecipe()),input=await compileAttachmentInputs(m,initialState,ordered(cases()[name]),originalSeed),r=createAttachmentRuntime(m,input);for(let i=0;i<3;i++)await r.settle();
  const app=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1259n).map(v=>rec(v,1259n)).filter(v=>key(f(v,3n))===key(HOLDERS[0])).at(-1)!;
  const a=attachmentFold(synthetic(o),cue(o));expect(f(app,8n)).toEqual(list([items(a.report,'list')[2]]));expect(f(app,10n)).toEqual(items(a.report,'list')[3]);
 }
 const differences=[];
 for(const law of [1,2,3,4,5]){const m=await compileAttachmentModel(attachmentRecipe(law)),input=await compileAttachmentInputs(m,initialState,ordered(cases().selfSufficient),originalSeed),r=createAttachmentRuntime(m,input);for(let i=0;i<3;i++)await r.settle();const a=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1259n).map(v=>rec(v,1259n)).filter(v=>key(f(v,3n))===key(HOLDERS[0])).at(-1)!;differences.push(f(a,8n));}
 expect(differences).toEqual([0,1,0,0,1].map(n=>list([q(n,1)])));
 expect(attachmentFold(synthetic({},1),cue({})).report).not.toEqual(attachmentFold(synthetic({}),cue({})).report);
 console.info('M57_NATIVE original own-history Bond/MissingContact correspondence and five retained law distinctions PASS; no expected-relief/utility port claimed');
},590000);

it('boundaries: admission, append ownership, source authentication and late140 rollback',async()=>{
 const {s,d}=fixture(),model=await compileCharacterModel(s),component=await compileCharacterState(model),inputs=await compileCharacterInputs(model,component,d),m=await prepareCharacterModel(s),r=await createCharacterRun(m,d);await through(r,1n);
 const current=state(r),path=relationshipPath(C,target),old=current.read(path).value!,rows=relationshipHistory(old),next=[...items(rows[0],'list')];next[0]=typedIdentifier(1115,u(999999));next[3]=signed(2);
 const patch={operations:[{kind:'set' as const,path,expected:{presence:true as const,value:old},newValue:list([text(REL),list([...rows,list(next)])])}]};
 expect(()=>component.stateModel.applyPatch(current,patch,PERSON_OWNER)).toThrow();expect(relationshipHistory(component.stateModel.applyPatch(current,patch,REL_OWNER).state.read(path).value)).toHaveLength(2);
 expect(()=>component.stateModel.applyPatch(current,{operations:[{...patch.operations[0],newValue:old}]},REL_OWNER)).toThrow('history rewrite');
 const initial=restoreAuthoritativeState(decode(d.initialState));await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value:old}]).canonicalValue())})).rejects.toThrow('initial relationship history');
 for(const bad of [list([text(ATTACHMENT),target,false,true,false,u(1),true]),list([text(ATTACHMENT),text('foreign'),false,true,false,true,true])])expect(()=>attachmentCue(bad,[target,other])).toThrow();
 expect(()=>supportSource(list([true,u(3),true,true,true,true,true]))).toThrow();
 expect(safeSupport(supportSource(list([true,u(2),true,true,true,false,true])),true)).toEqual(list([]));
 const inputRows=items(decode(d.orderedInputs),'list'),cueRow=inputRows.find(v=>key(items(v,'list')[2])===key(ATTACHMENT_CUE))!;
 await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...inputRows,cueRow]))})).rejects.toThrow('attachment time');
 const owner=createRelationshipExecution(C,model.relationship!,component.stateModel,inputs.relationshipEvents,model.modelIdentity.value,inputs.runIdentity.value,true,true,inputs.attachmentEvents),event=inputs.attachmentEvents[0];let ordinal=1n;owner.begin(3n);
 const context={event,state:initial,instant:simInstant(3n),allocateRuntimeId:()=>ordinal++};
 expect(()=>owner.execute({...context,event:{...event,eventId:event.eventId+100n}})).toThrow('unbound cue');
 const result=owner.execute(context);result.traceFactory([]);expect(()=>owner.execute(context)).toThrow('unbound cue');owner.prepareCommit();owner.close();
 const before=r.snapshot(),apply=stateModule.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===848n)){expect(relationshipHistory(result.state.read(path).value)).toHaveLength(2);reached=true;throw Error('M57 after relationship140');}return result;});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M57 after relationship140');expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)bytes(r.snapshot()[k],before[k]);expect(r.snapshot().clock).toBe(before.clock);}finally{spy.mockRestore();}
 console.info('M57_BOUNDARIES source/admission/bootstrap/unique owner/append/late140 whole-instant rollback PASS');
},590000);

it('auto control: original two-support comparison retains its automatic branch',async()=>{
 for(const dependent of [true,false]){const r=await run({dependent}),decision=decisions(r)[0],context=rec(f(decision,3n),408n),result=rec(f(rec(f(decision,4n),419n),2n),420n);
 const nuclei=items(f(context,3n),'list').map(v=>rec(v,407n));
 expect(uint(f(result,8n))).toBe(dependent?1n:3n);expect(draws(r).length).toBe(dependent?0:2);expect(relationshipHistory(history(r))).toHaveLength(2);expect(derived(r)[2]).toEqual(q(dependent?1:0,1));expect(nuclei.map(n=>signedValue(f(n,5n)))).toEqual(dependent?[2n,0n]:[0n,0n]);
 console.info('M57_AUTO_CONTROL '+JSON.stringify({dependent,mode:String(uint(f(result,8n))),choice:choice(r),draws:draws(r).length,attachment:key(list(derived(r))),nuclei:nuclei.map(n=>({key:key(f(n,1n)),roles:key(f(n,2n)),relevance:key(f(n,3n)),die:String(uint(f(n,4n))),standing:String(signedValue(f(n,5n))),context:String(signedValue(f(n,6n)))}))}));
 }
},590000);
