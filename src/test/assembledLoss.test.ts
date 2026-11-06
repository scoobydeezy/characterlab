import {receivingRecord as rec,randomDrawRecord} from '../assembled/codecs';
import {mapIdentities as mapFromDecision} from './fixtures/assembledValueReceiving';
/** M58 fixed scene: physical A/B tasks, no person dependencies, reserve10 unsensed,
 * workspace6; recognized coat support at1/2, absent cue3, alternative true/demand false.
 * Support opportunity only at1 in both arms; future-contact report at2;
 * only report code differs for primary witness. A reunion/B keepsake. No learned bootstrap, authored bond, or active partner. */
import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import * as stateModule from '../substrate/state';
import {restoreAuthoritativeState,AuthoritativeState,statePathValue} from '../substrate/state';
import {dataField as f,dataUnsigned as uint,dataText as txt} from '../campaign2/canonicalData';
import {readQ} from '../campaign2/cognitiveMath';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,LOSS_RULES,LOSS_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {LOSS,LOSS_VERSION,lossFold,compileLoss,returnSource,returnTuple,ATTACHMENT,ATTACHMENT_CUE,ATTACHMENT_VERSION,attachmentFold,attachmentCue,supportSource,safeSupport} from '../assembled/attachment';
import {relationshipPath,relationshipHistory,relationshipFold,REL_OWNER,REL,REL_UPDATE} from '../assembled/relationship';
import {createRelationshipExecution} from '../assembled/relationshipExecution';
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
import {griefRecipe,compileGriefModel,compileGriefInputs,HOLDERS} from '../campaign3/griefModel';
import {createGriefRuntime} from '../campaign3/griefRuntime';
import {cases,ordered,initialState,seed as originalSeed} from './griefFixtures';
import {simInstant} from '../substrate/time';
type Opt={reportAtChoice?:boolean;code?:number;report?:boolean;reportVisible?:boolean;reportAccess?:boolean;reportSignal?:string;hiddenCode?:number;correction?:number;laterEmpty?:boolean;dependent?:boolean;participant?:boolean;units?:number;resolved?:boolean;demand?:boolean;visible?:boolean;access?:boolean;opportunity?:boolean;present?:boolean;cue?:boolean;truth?:boolean;signal?:string;one?:boolean};
let base:ReturnType<typeof previous>|undefined,frames:CanonicalValue[]|undefined;
function fixture(o:Opt={},seed=0){
 const b=structuredClone(base??(base=previous())),slots=[...items(decode(b.s.registry),'list')];
 const actionB=typedIdentifier(1027,text('definition/protocol-contact-two'));
 slots.push(list([text(ATTACHMENT)]),list([text(LOSS),list([list([target,actionB]),list([other,typedIdentifier(1027,text('definition/protocol-contact-one'))])])]));b.s={...b.s,rulesVersion:LOSS_RULES,registrySchemaVersion:LOSS_REGISTRY,registry:enc(list(slots))};
 const important=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')[0]).filter(t=>key(t)!==key(thirdKey));
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return signedValue(a[0])<=3n&&![RUMINATION_SOURCE,FATIGUE_SOURCE,CONTROL_SOURCE,SOCIAL_SOURCE].some(t=>key(t)===key(a[2]));}).map(v=>{
  const a=items(v,'list');
  if(key(a[2])!==key(DISPLAY))return v;
  const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=important.some((t,i)=>key(t)===key(r[0])&&uint(r[1])===BigInt(i));return list(r);}))]),a[4]]);
 });
 frames??=items(decode(peopleData(false,0,[{at:1,signals:[['appearance/coat',true]],kind:0},{at:2,signals:[['appearance/coat',true]],continuity:true,kind:0}]).orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE));
 const selected=[...frames];if(o.reportAtChoice){const r=[...items(frames[1],'list')];r[0]=signed(3);selected.push(list(r));}if(o.correction!==undefined||o.laterEmpty){const r=[...items(frames[1],'list')];r[0]=signed(4);selected.push(list(r));}
 for(const frame of selected){const row=[...items(frame,'list')],p=[...items(row[3],'list')],s=[...items(p[1],'list')],r=[...items(p[6],'list')];const at=signedValue(row[0]);s[5]=at===2n?(o.reportAccess??o.access??true):(o.access??true);if(at===2n)s[3]=u(0);if(at>=3n){s[3]=u(0);s[4]=u(3);}p[1]=list(s);r[2]=o.participant??true;p[6]=list(r);p[5]=list([list([text(at===2n?(o.reportSignal??o.signal??'appearance/coat'):(o.signal??'appearance/coat')),true])]);
  p.push(list([u(1),u(1)]),list([o.opportunity!==false&&at===1n,u(o.units??2),o.resolved??true,o.demand??true,o.dependent??true,o.visible??true,o.truth??true]),list([(at===2n&&o.report!==false&&!o.reportAtChoice)||(at===3n&&o.reportAtChoice===true)||(at===4n&&o.correction!==undefined),u(at===4n?(o.correction??0):(o.code??0)),o.reportVisible??true,u(o.hiddenCode??0)]));row[3]=list(p);rows.push(list(row));
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

const lossReport=(r:Run,t=target)=>items(view(r,t)[11],'list');
const estimate=(r:Run)=>lossFold(attachmentFold(relationshipHistory(history(r)),reports(r,ATTACHMENT+'/cue')[0]?list(reports(r,ATTACHMENT+'/cue')[0]):undefined),personHistory(state(r).read(personPath(C,target)).value));
function live(r:Run,code:number){
 expect(relationshipHistory(history(r))).toHaveLength(1);
 expect(personHistory(state(r).read(personPath(C,target)).value)).toHaveLength(2);
 expect(personMean(state(r).read(personPath(C,target)).value)).toEqual(readQ(q(1,1)));
 expect(lossReport(r).slice(1,6)).toEqual([q(1,2),q(1,2),q(code,2),q(2-code,4),q(code,4)].map(v=>list([v])));
 const context=rec(f(decisions(r)[0],3n),408n),nuclei=items(f(context,3n),'list').map(v=>rec(v,407n));
 expect(nuclei).toHaveLength(2);expect(uint(f(rec(f(rec(f(decisions(r)[0],4n),419n),2n),420n),8n))).not.toBe(1n);
 expect(nuclei.map(n=>f(n,5n))).toEqual(code===0?[signed(0),signed(1)]:[signed(1),signed(0)]);
 for(const n of nuclei)expect(uint(f(n,4n))).toBeGreaterThan(0n);
}
it('witness: prior future-contact belief changes coupled choice with exact continuation',async()=>{
 const {s}=fixture(),m=await prepareCharacterModel(s),maps=[];
 for(const code of [0,2]){const {d}=fixture({code}),r=await createCharacterRun(m,d);await through(r,3n);live(r,code);maps.push(mapFromDecision(r));}
 const changed:number[]=[];let common=0,conditional=0;
 for(let seed=0;seed<8;seed++){
  const rs:Run[]=[];
  for(const [i,code]of [0,2].entries()){
   const {d}=fixture({code},seed);d.orderedInputs=enc(list([maps[i].canonicalValue,...items(decode(d.orderedInputs),'list')]));
   const r=await createCharacterRun(m,d);
   if(seed===0&&code===0){await through(r,2n);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:r.save()}),repeat=await createCharacterRun(m,d);await through(repeat,2n);exact(r,restored);exact(r,repeat);for(const x of [r,restored,repeat])await through(x,3n);exact(r,restored);exact(r,repeat);}else await through(r,3n);
   live(r,code);rs.push(r);
  }
  const [a,b]=rs;expect(history(a)).toEqual(history(b));
  const aa=draws(a),bb=draws(b),shared=aa.filter(x=>bb.some(y=>key(f(x,2n))===key(f(y,2n))));
  expect(shared).toHaveLength(2);common+=shared.length;
  for(const x of shared){const y=bb.find(y=>key(f(x,2n))===key(f(y,2n)))!;expect(f(x,3n)).toEqual(f(y,3n));expect(f(x,7n)).toEqual(f(y,7n));}
  const nuclei=rs.map(r=>items(f(rec(f(decisions(r)[0],3n),408n),3n),'list').map(v=>rec(v,407n)));
  expect(nuclei[0].map(n=>key(f(n,1n))).sort()).toEqual(nuclei[1].map(n=>key(f(n,1n))).sort());
  for(const r of rs){
   const result=rec(f(rec(f(decisions(r)[0],4n),419n),2n),420n),tie=rec(f(result,10n),423n),unmatched=draws(r).filter(x=>!shared.some(y=>key(f(x,2n))===key(f(y,2n))));
   if(unmatched.length){expect(unmatched).toHaveLength(1);expect(uint(f(tie,1n))).toBe(2n);expect(f(tie,3n)).toEqual(unmatched[0]);conditional++;}
   for(const reason of items(f(result,9n),'list').map(x=>rec(x,422n))){const d=randomDrawRecord(f(reason,5n));expect(shared.some(x=>key(f(x,2n))===key(f(d,2n)))).toBe(true);}
  }
  if(choice(a)!==choice(b))changed.push(seed);
  if(seed===0){
   const ts=outputs(a.snapshot().trace,160n),t=ts.find(t=>txt(f(t,6n))===LOSS_VERSION&&uint(f(rec(f(t,4n),130n),3n))===80n)!;
   const paths=items(f(t,11n),'list').map(v=>key(f(rec(v,147n),2n)));
   for(const p of [personPath(C,target),relationshipPath(C,target)])expect(paths).toContain(key(statePathValue(p)));
   const ids=items(f(t,9n),'list').map(key),cue=reports(a,ATTACHMENT+'/cue')[0];
   for(const id of [cue[1],...items(derived(a)[5],'list'),...items(lossReport(a)[6],'list')])expect(ids).toContain(key(id));
   const cueTrace=ts.find(t=>key(f(rec(f(t,4n),130n),5n))===key(ATTACHMENT_CUE))!;
   for(const child of items(f(t,18n),'list'))expect(items(f(rec(child,130n),8n),'list')).toContainEqual(f(rec(f(cueTrace,4n),130n),1n));
   console.info('M58 calibration raw1/2 -> bounded1/3 -> standing+1; other orientation0; prior810/848/cue sources PASS');
  }
  console.info('M58_CELL '+JSON.stringify({seed,loss:choice(a),return:choice(b),shared:shared.length}));
 }
 expect(changed.length).toBeGreaterThan(0);console.info('M58_WITNESS '+JSON.stringify({changed,common,conditional,continuation:'exact2-to3'}));
},590000);
it('controls: report isolation, correction, recognition and no manufactured history',async()=>{
 const a=await run(),h=history(a);
 for(const [o,future,amount] of [
  [{code:1},q(1,2),q(1,4)],[{report:false},undefined,undefined],[{reportVisible:false},undefined,undefined],
  [{reportAccess:false},undefined,undefined],[{reportSignal:'appearance/stripe'},undefined,undefined],[{reportSignal:'appearance/plain'},undefined,undefined],
  [{dependent:false},q(0,1),q(0,1)],[{participant:false},q(0,1),q(0,1)],[{present:true},q(0,1),q(0,1)]
 ] as [Opt,CanonicalValue|undefined,CanonicalValue|undefined][]){
  const r=await run(o),l=lossReport(r);expect(l[3]).toEqual(list(future?[future]:[]));expect(l[4]).toEqual(list(amount?[amount]:[]));
  if(o.reportSignal==='appearance/plain')expect(personHistory(state(r).read(personPath(C,other)).value).some(v=>items(v,'list')[8]&&key(items(v,'list')[8])===key(list([u(0)])))).toBe(true);
 }
 const late=await run({reportAtChoice:true});expect(lossReport(late)[3]).toEqual(list([]));expect(estimate(late).future).toEqual(readQ(q(0,1)));expect(history(late)).toEqual(h);
 const hidden=await run({hiddenCode:2,truth:false});bytes(a.snapshot().state,hidden.snapshot().state);bytes(a.snapshot().outputs,hidden.snapshot().outputs);
 const denied0=await run({reportVisible:false,code:0}),denied2=await run({reportVisible:false,code:2,hiddenCode:2});bytes(denied0.snapshot().state,denied2.snapshot().state);bytes(denied0.snapshot().outputs,denied2.snapshot().outputs);
 const corrected=await run({correction:2},3n),before=corrected.snapshot().outputs,prior=personHistory(state(corrected).read(personPath(C,target)).value);
 await through(corrected,4n);expect(history(corrected)).toEqual(h);expect(personHistory(state(corrected).read(personPath(C,target)).value).slice(0,2)).toEqual(prior);expect(estimate(corrected).future).toEqual(readQ(q(1,1)));
 expect(items(decode(corrected.snapshot().outputs),'list').slice(0,items(decode(before),'list').length)).toEqual(items(decode(before),'list'));
 const unchanged=await run({laterEmpty:true},4n);expect(history(unchanged)).toEqual(h);expect(estimate(unchanged).future).toEqual(readQ(q(0,1)));
 console.info('M58_CONTROLS uncertain/unknown/known0, hidden/denied/unrecognized/foreign, own-history, correction/no-message and immutable history PASS');
},590000);
it('native: original grief contexts and retained alternatives agree on declared projection',async()=>{
 const synthetic=(count:number)=>Array.from({length:count},(_,i)=>list([typedIdentifier(1115,u(i)),C,target,signed(i+1),true,true,u(0),list([u(2),true,true,true])]));
 const cue=list([text(ATTACHMENT+'/cue'),typedIdentifier(1115,u(99)),C,target,u(4),list([false,true,false])]);
 for(const [name,code,count]of [['main',0,2],['temporary',2,2],['uncertain',1,2],['oneSupport',0,1],['noReport',undefined,2]] as const){
  const m=await compileGriefModel(griefRecipe()),input=await compileGriefInputs(m,initialState,ordered(cases()[name]),originalSeed),r=createGriefRuntime(m,input);for(let i=0;i<4;i++)await r.settle();
  const app=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1287n).map(v=>rec(v,1287n)).filter(v=>key(f(v,3n))===key(HOLDERS[0])).at(-1)!;
  const person=code===undefined?[]:[list([typedIdentifier(1115,u(88)),C,target,signed(3),u(1),u(3),list([]),list([true]),list([u(code)])])],g=lossFold(attachmentFold(synthetic(count),cue),person);
  expect([8n,13n,12n,10n,11n].map(k=>f(app,k))).toEqual(items(g.report,'list').slice(1,6));
 }
 const differences=[];
 for(const law of [1,2,3,4,5,6]){const m=await compileGriefModel(griefRecipe(law)),input=await compileGriefInputs(m,initialState,ordered(cases().hiddenReturn),originalSeed),r=createGriefRuntime(m,input);for(let i=0;i<4;i++)await r.settle();const a=r.snapshot().outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===1287n).map(v=>rec(v,1287n)).filter(v=>key(f(v,3n))===key(HOLDERS[0])).at(-1)!;differences.push([f(a,10n),f(a,11n)]);}
 expect(differences).toEqual([[1,0],[1,1],[0,0],[0,0],[0,1],[null,null]].map(row=>row.map(n=>list(n===null?[]:[q(n,1)]))));
 console.info('M58_NATIVE five original contexts and six laws PASS; prospective native probes do not claim enacted mourning');
},590000);
it('boundaries: receipt, owner, bootstrap, admission and late person140 rollback',async()=>{
 const {s,d}=fixture(),model=await compileCharacterModel(s),component=await compileCharacterState(model),m=await prepareCharacterModel(s),r=await createCharacterRun(m,d);await through(r,1n);
 const current=state(r),path=personPath(C,target),old=current.read(path).value!,rows=personHistory(old),next=[...items(rows[0],'list')];next[0]=typedIdentifier(1115,u(999999));next[3]=signed(2);next[5]=u(2);next[6]=list([]);next[8]=list([u(2)]);
 const patch={operations:[{kind:'set' as const,path,expected:{presence:true as const,value:old},newValue:list([text('assembled-social/0.1'),list([...rows,list(next)])])}]};
 expect(()=>component.stateModel.applyPatch(current,patch,REL_OWNER)).toThrow();expect(personHistory(component.stateModel.applyPatch(current,patch,PERSON_OWNER).state.read(path).value)).toHaveLength(2);
 expect(()=>component.stateModel.applyPatch(current,{operations:[{...patch.operations[0],newValue:old}]},PERSON_OWNER)).toThrow('history rewrite');
 const malformed=[...next];malformed[8]=list([u(3)]);expect(()=>component.stateModel.applyPatch(current,{operations:[{...patch.operations[0],newValue:list([text('assembled-social/0.1'),list([...rows,list(malformed)])])}]},PERSON_OWNER)).toThrow();
 const initial=restoreAuthoritativeState(decode(d.initialState));await expect(createCharacterRun(m,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),{path,value:old}]).canonicalValue())})).rejects.toThrow();
 const action=typedIdentifier(1027,text('definition/protocol-contact-one'));expect(()=>compileLoss(list([text(LOSS),list([list([target,action])])]),[{target,action}],[action])).toThrow('loss target/action');
 for(const bad of [list([true,u(3),true,u(0)]),list([true,u(0),true,u(3)]),list([u(1),u(0),true,u(0)])])expect(()=>returnSource(bad)).toThrow();
 const inputRows=items(decode(d.orderedInputs),'list'),row=inputRows.find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!;
 await expect(createCharacterRun(m,{...d,orderedInputs:enc(list([...inputRows,row]))})).rejects.toThrow('duplicate social source');
 const conflict=fixture({correction:2}),cr=items(decode(conflict.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)&&signedValue(a[0])===4n){const p=[...items(a[3],'list')],social=[...items(p[1],'list')];social[4]=u(2);p[1]=list(social);a[3]=list(p);}return list(a);});
 const c=await createCharacterRun(m,{...conflict.d,orderedInputs:enc(list(cr))});await through(c,3n);await expect(c.settleNextInstant()).rejects.toThrow('receipt changed');
 const before=r.snapshot(),apply=stateModule.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.path.rootStateTypeId===810n)){expect(personHistory(result.state.read(path).value)).toHaveLength(2);reached=true;throw Error('M58 after person140');}return result;});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M58 after person140');expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)bytes(r.snapshot()[k],before[k]);expect(r.snapshot().clock).toBe(before.clock);}finally{spy.mockRestore();}
 console.info('M58_BOUNDARIES malformed source/state, duplicate/changed receipt, bootstrap, sole owner, append and whole-instant rollback PASS');
},590000);

it('persistence: final learning trace discloses consumed report and restores exactly',async()=>{
 const {s,d}=fixture(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),repeat=await createCharacterRun(m,d);await through(a,2n);await through(repeat,2n);
 const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,repeat);exact(a,restored);
 const learned=personHistory(state(a).read(personPath(C,target)).value).at(-1)!;
 const t=outputs(a.snapshot().trace,160n).find(t=>txt(f(t,6n))===LOSS_VERSION&&key(f(rec(f(t,4n),130n),5n))===key(SOCIAL_UPDATE)&&signedValue(f(rec(f(t,4n),130n),2n))===2n)!;
 expect(items(f(t,12n),'list')[1]).toEqual(learned);expect(items(learned,'list')[8]).toEqual(list([u(0)]));expect(items(f(t,9n),'list')).toContainEqual(items(learned,'list')[0]);
 for(const r of [a,repeat,restored])await through(r,3n);exact(a,repeat);exact(a,restored);live(a,0);
 console.info('M58_FINAL_TRACE explicit consumed nine-field person evidence, exact repeat/save2/restore/3 PASS');
},590000);
