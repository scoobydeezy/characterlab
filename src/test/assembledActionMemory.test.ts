import {semanticReferentFromAuthoredContent as referent} from '../substrate/referentOrigin';
import {governedContentDefinitionId} from '../substrate/contentDefinitionId';
/** M61 fixed source: three physical tasks; body30/rate10; 16 memories,20 slots.
 * Four original attribution trials, actual A14/A28/B30; query33. Seed0.
 * Same model/history except permitted x15=1/0. All inherited social tasks disabled. */
import {list,set,text,unsigned as u,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataKey as key,dataField as f,dataRecord as rec,dataText as txt,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ACTION_MEMORY_RULES,ACTION_MEMORY_REGISTRY} from '../assembled/model';
import {ACTION_MEMORY} from '../assembled/actionMemory';
import {fixture as spatial,decode,enc} from './fixtures/assembledSpatialMeaning';
import {actionA,actionB} from './fixtures/assembledContraryCommunication';
import {FATIGUE} from '../assembled/fatigue';
import {RUMINATION} from '../assembled/rumination';
import {ATTACHMENT,LOSS} from '../assembled/attachment';
import {EMBARRASSMENT} from '../assembled/embarrassment';
import {target as targetPerson,other as otherPerson} from './fixtures/assembledPersonHistory';
import {POSITION,POSITION_SOURCE} from '../assembled/positionPerception';
import {BODY_SAMPLE} from '../assembled/body';
import {PRIORITY,PRIORITY_DISPLAY} from '../assembled/priority';
import {STRATEGY,DISPLAY,compileStrategy} from '../assembled/strategy';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../assembled/performance';
import {HABIT_SOURCE} from '../assembled/habit';
import {changeDefinition} from './fixtures/assembledCharacter';
import {thirdKey,newAction,newInstruction} from './fixtures/assembledConfiguration';
import {sid} from '../assembled/skill';
import {signedValue} from './fixtures/assembledComparison';

export type Opt={moved?:boolean;denied?:boolean;reportDenied?:boolean};
let cache:ReturnType<typeof build>|undefined;
function build(){
 const b=spatial(),a=[...items(decode(b.s.registry),'list')],firstTask=items(items(items(a[12],'list')[1],'list')[0],'list')[0];
 a.push(list([text(FATIGUE),text('SevereThreshold')]),list([text(RUMINATION),firstTask,text('EveryOpportunity')]),list([text(ATTACHMENT)]),list([text(LOSS),list([list([targetPerson,actionB]),list([otherPerson,actionA])])]),list([text(EMBARRASSMENT),targetPerson,firstTask,actionA]));
 const routes0=items(a[12],'list');a[12]=list([routes0[0],list(items(routes0[1],'list').map(v=>{const r=items(v,'list');return key(r[0])===key(thirdKey)?list([r[0],newInstruction,r[2]]):v;}))]);
 const reappraisal=items(a[28],'list');a[28]=list([reappraisal[0],thirdKey,newAction,reappraisal[3]]);
 const tasks=items(items(a[12],'list')[1],'list').map(v=>items(v,'list')[0]).filter(v=>key(v)!==key(thirdKey));
 const taskA=referent(governedContentDefinitionId('content/task-a'));
 const declarations=tasks.map(task=>({task,action:key(f(rec(task,371n),2n))===key(taskA)?actionA:actionB}));
 a.push(list([text(ACTION_MEMORY),list(declarations.map(d=>list([d.task,d.action])))]));
 const act=items(a[10],'list');a[10]=list([act[0],true,set(items(act[2],'set').map(v=>list([items(v,'list')[0],q(0,1),u(0)])))]);
 const goal=items(a[37],'list');a[37]=list([goal[0],list([q(7,1),q(7,1)]),...goal.slice(2)]);
 let s={...b.s,rulesVersion:ACTION_MEMORY_RULES,registrySchemaVersion:ACTION_MEMORY_REGISTRY,registry:enc(list(a))};
 for(const name of ['definition/task-a','definition/task-b','definition/configurable-garden']){s=changeDefinition(s,name,3n,q(0,1));s=changeDefinition(s,name,4n,q(10,1));}
 const original=items(decode(b.d.orderedInputs),'list').map(v=>{const r=[...items(v,'list')];if(key(r[2])===key(PRIORITY_DISPLAY)){const p=items(r[3],'list');r[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];if(items(x[1],'list').length)x[1]=list([q(key(x[0])===key(thirdKey)?0:1,1)]);return list(x);}))]);}return list(r);});
 const templates=original.filter(v=>signedValue(items(v,'list')[0])===17n&&(uint(items(v,'list')[1])===30n||key(items(v,'list')[2])===key(sid(1001,'event/deliberation-opportunity'))));
 const rows=original.filter(v=>{const r=items(v,'list'),at=signedValue(r[0]);return key(r[2])!==key(DISPLAY)&&!(at===33n||at>=28n&&at<=32n||at===17n&&(uint(r[1])===30n||key(r[2])===key(sid(1001,'event/deliberation-opportunity'))));});
 // Keep17 appraisal/attribution, but no runnable candidate during the attribution gate.
 for(const at of [14,17,28,30,33])for(const v of templates){
  const r=[...items(v,'list')];r[0]=signed(at);
  if([DISPLAY,PRIORITY_DISPLAY,PERFORMANCE_SETTING].some(t=>key(t)===key(r[2])))continue;
  if(!rows.some(v=>key(items(v,'list')[0])===key(r[0])&&key(items(v,'list')[2])===key(r[2])))rows.push(list(r));
 }

 // Actual current urgency, availability and permitted performance are independent inputs.
 const allTasks=items(items(a[12],'list')[1],'list').map(v=>items(v,'list')[0]);
 for(const at of [14,17,28,30,33])rows.push(list([signed(at),u(10),PRIORITY_DISPLAY,list([text(PRIORITY),list(allTasks.map(task=>list([task,list([]),true,list([q(key(task)===key(thirdKey)?0:1,1)]),true])))]),list([])]));
 const routes=compileStrategy(a[12],items(a[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decode(s.content));
 for(const [i,at]of [14,28,30,33].entries()){
  rows.push(list([signed(at-1),u(30),DISPLAY,list([text(STRATEGY),list(allTasks.flatMap(task=>[0,1].map(route=>{const d=declarations.find(d=>key(d.task)===key(task));return list([task,u(route),u(i*2+route+1),!!d&&key(routes.find(r=>key(r.task)===key(task))!.plans[route].actionId)===key(d.action)&&(at===33||key(d.action)===key(at===30?actionB:actionA)),u(at-1),u(at),true]);})))]),list([])]));
  rows.push(list([signed(at),u(30),PERFORMANCE_SETTING,list([text(PERFORMANCE),list(declarations.map(d=>list([d.task,true,u(0)])))]),list([])]));
 }
 for(const at of [28,29,30,31,32,33])rows.push(list([signed(at),u(10),POSITION_SOURCE,list([text(POSITION),list([u(at===31||at===32?1:0),u(0),u(1),true,true,u(1)]),list([u(1),text('Motion'),true,true])]),list([])]));
 // Begin a new ordinary perceived context after the last original trial closes.
 const at28=rows.findIndex(v=>signedValue(items(v,'list')[0])===28n&&key(items(v,'list')[2])===key(POSITION_SOURCE));const r=[...items(rows[at28],'list')],p=items(r[3],'list');r[3]=list([p[0],p[1],list([u(1),text('Before'),true,true])]);rows[at28]=list(r);
 // Retain original memory pressure through30; start/action observations add ordinary pressure.
 const sample=items(original.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 for(const at of [28,29,30])rows.push(list([signed(at),...sample.slice(1)]));
 return {s,d:{...b.d,orderedInputs:enc(list(rows.filter(v=>key(items(v,'list')[2])!==key(HABIT_SOURCE))))},declarations};
}
export function fixture(o:Opt={}){
 const b=structuredClone(cache??(cache=build())),rows=items(decode(b.d.orderedInputs),'list').map(v=>{const r=[...items(v,'list')],at=signedValue(r[0]);if(at===15n&&key(r[2])===key(POSITION_SOURCE)){const p=[...items(r[3],'list')],x=[...items(p[1],'list')];x[0]=u(o.moved===false?0:1);if(o.denied)x[4]=false;p[1]=list(x);r[3]=list(p);}
 if(o.reportDenied&&at===14n&&key(r[2])===key(PERFORMANCE_SETTING)){const p=items(r[3],'list');r[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[1]=false;return list(x);}))]);}
 return list(r);});
 return {...b,d:{...b.d,orderedInputs:enc(list(rows))}};
}


import {it,expect,vi} from 'vitest';

import {dataIdentity as id} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {readQ} from '../campaign2/cognitiveMath';
import {restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {arbitrationOutput} from '../assembled/arbitration';
import {cognitiveRecord as cr} from '../assembled/codecs';
import {randomAddressValue,naturalRandomKeyValue} from '../substrate/random';

import {ACTION_MEMORY_VERSION,validateActionAnnex} from '../assembled/actionMemory';
import {SIGNIFICANCE,named,directions} from '../assembled/significance';
import {isPositionEpisodePath} from '../assembled/memory';

import {outputs,type Run} from './fixtures/assembledComparison';
const reports=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const forecast=(r:Run)=>reports(r,ACTION_MEMORY+'/forecast').find(v=>signedValue(v[1])===33n)!;
const clocks=new WeakMap<Run,bigint>();
async function advance(r:Run,to:bigint){const from=clocks.get(r)??0n;for(let n=from;n<to;n++){const ok=await r.settleNextInstant();if(!ok)console.info('M61_DIAGNOSTIC',r.diagnostic());expect(ok).toBe(true);}expect(r.snapshot().clock).toBe(to);clocks.set(r,to);}
const target=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state)).entries().find(e=>isPositionEpisodePath(e.path)&&signedValue(items(e.value,'list')[5])===15n)?.value;
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
const exact=(a:Run,b:Run)=>{for(const k of ['state','outputs','trace'] as const)bytes(a.snapshot()[k],b.snapshot()[k]);bytes(a.save(),b.save());};
function decision(r:Run){return outputs(r.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===33n)!;}
function result(v:CanonicalValue){const status=rec(f(rec(v,409n),4n),419n);expect(uint(f(status,1n))).toBe(3n);return rec(f(status,2n),420n);}
function live(r:Run,moved:boolean){
 const p=forecast(r);expect(p).toBeDefined();const rows=items(p[4],'list').map(v=>items(v,'list'));expect(rows).toHaveLength(2);
 console.info('M61_FORECAST',rows.map(v=>({action:txt(id(v[1]).payload),status:txt(v[2]),mean:key(v[3]),progress:key(v[4]),ages:items(v[5],'list').map(e=>Number(signedValue(items(e,'list')[5])))})));
 expect(rows.every(v=>txt(v[2])==='Known'),'both forecasts live').toBe(true);
 const a=rows.find(v=>key(v[1])===key(actionA))!,b=rows.find(v=>key(v[1])===key(actionB))!;
 expect(a[3]).toEqual(q(moved?1:0,2));expect(a[4]).toEqual(q(moved?1:0,20));expect(b[3]).toEqual(q(1,1));expect(b[4]).toEqual(q(1,10));
 expect(items(a[5],'list').map(v=>signedValue(items(v,'list')[5])).sort()).toEqual(moved?[15n,29n]:[29n]);
 const dec=decision(r),context=rec(f(dec,3n),408n),data=result(dec),nuclei=items(f(context,3n),'list');expect(nuclei).toHaveLength(2);
 const traces=outputs(r.snapshot().trace,160n),reason=traces.find(t=>txt(f(t,6n))===ACTION_MEMORY_VERSION&&uint(f(rec(f(t,4n),130n),3n))===80n&&signedValue(f(rec(f(t,4n),130n),2n))===33n)!;
 expect(reason).toBeDefined();expect(items(f(reason,13n),'list')[0]).toEqual(f(context,2n));
 const chosen=f(rec(f(data,1n),395n),2n);
 // Execution is checked through the immutable expression/attempt ancestry below.
 expect(outputs(r.snapshot().outputs,433n).some(o=>{const attempt=rec(f(o,2n),432n),plan=rec(f(attempt,2n),431n),intent=rec(f(plan,2n),425n);return key(f(intent,2n))===key(dec)&&uint(f(o,3n))>0n;})).toBe(true);
 return {context,dec,data,nuclei,chosen};
}
async function exactProof(s:ReturnType<typeof fixture>['s'],runs:Run[]){
 const rows=items(items(decode(s.registry),'list')[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)),definition=f(rows.find(r=>key(f(r,1n))===key(sid(1027,'definition/task-arbitration')))! ,4n);
 const resolutions=runs.map(decision),results=resolutions.map(result);
 const contexts=resolutions.map(d=>rec(f(d,3n),408n)),ns=contexts.map(c=>items(f(c,3n),'list').map(n=>rec(n,407n)));
 expect(ns[0].map(n=>f(n,4n))).toEqual(ns[1].map(n=>f(n,4n)));
 const candidates=ns[0].map(n=>f(rec(f(n,1n),404n),1n)),sizes=ns[0].map(n=>uint(f(n,4n)));
 const counts=[0n,0n],total=sizes[0]*sizes[1]*2n;let changed=0;
 for(let a=0n;a<sizes[0];a++)for(let b=0n;b<sizes[1];b++)for(let t=0n;t<2n;t++){
  const winners:CanonicalValue[]=[];
  for(let arm=0;arm<2;arm++){
   const resolution=resolutions[arm],occ=f(resolution,1n),draw=(value:bigint,span:bigint,n?:CanonicalValue)=>{
    const k=n?rec(f(rec(n,407n),1n),404n):undefined,c=k?rec(f(k,1n),395n):rec(candidates[0],395n);
    const address={causalRootId:id(occ),purposeId:sid(1042,k?'purpose/task-reason-face':'purpose/task-decision-tie'),subjectBindings:[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},...(k?[{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(k,3n))}]:[])],drawIndex:0n};
    return cr(411,[randomAddressValue(address),naturalRandomKeyValue(address),u(value),u(span),u(((1n<<128n)/span)*span),false,list([cr(410,[u(0),u(value),false])])],1);
   };
   const out=await arbitrationOutput(occ,33n,contexts[arm],definition,{async reason(n){const first=key(f(rec(f(rec(n,407n),1n),404n),1n))===key(candidates[0]);return draw(first?a:b,first?sizes[0]:sizes[1],n);},async tie(leader){expect(leader).toHaveLength(2);return draw(t,2n);}},3),data=result(out),winner=f(data,1n);
   expect(f(data,2n)).toEqual(f(results[arm],2n));winners.push(winner);if(key(winner)===key(candidates[0]))counts[arm]++;
  }
  if(key(winners[0])!==key(winners[1]))changed++;
 }
 console.info('M61_EXACT',JSON.stringify({cases:String(total),changed,winnersA:counts.map(String),scope:'actual captured contexts, paired uniform faces and tie choices; no reconstructed reasons'}));
 expect(changed).toBeGreaterThan(0);expect(counts[0]).not.toBe(counts[1]);
 for(let arm=0;arm<2;arm++){const prob=items(f(results[arm],2n),'list').find(v=>key(f(rec(v,421n),1n))===key(candidates[0]))!;expect(readQ(f(rec(prob,421n),2n)).equals(Q.of(counts[arm],total))).toBe(true);}
}
it('witness: significant action episode reaches exact competing choice',async()=>{
 const A=fixture(),B=fixture({moved:false});expect(A.s).toEqual(B.s);bytes(A.d.initialState,B.d.initialState);bytes(A.d.runSeed,B.d.runSeed);
 const ar=items(decode(A.d.orderedInputs),'list'),br=items(decode(B.d.orderedInputs),'list');expect(ar.filter((v,i)=>key(v)!==key(br[i]))).toHaveLength(1);
 const model=await prepareCharacterModel(A.s),a=await createCharacterRun(model,A.d),b=await createCharacterRun(model,B.d);
 for(const [r,moved] of [[a,true],[b,false]] as const){await advance(r,17n);const v=target(r);expect(v).toBeDefined();console.info('M61_TARGET17',moved,items(v!,'list').length,directions(items(v!,'list')[7]),items(items(v!,'list')[8],'list').length);expect(directions(items(v!,'list')[7])).toEqual(moved?['MovingCloser']:[]);expect(validateActionAnnex(items(v!,'list')[8],items(v!,'list'))?.action).toEqual(actionA);await advance(r,33n);expect(!!target(r)).toBe(moved);live(r,moved);}
 await exactProof(A.s,[a,b]);
},600000);


import * as stateModule from '../substrate/state';
import {AuthoritativeState} from '../substrate/state';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {createActionMemory} from '../assembled/actionMemory';
import {positionExperience,EPISODIC_OWNER} from '../assembled/memory';
import type {ScheduledEvent} from '../substrate/scheduler';
import {simInstant} from '../substrate/time';
async function seamControls(s:ReturnType<typeof fixture>['s'],r:Run){
 const model=await compileCharacterModel(s),component=await compileCharacterState(model),C=component.tasks[0].character;
 const snap=r.snapshot(),state=restoreAuthoritativeState(decode(snap.state)),p=forecast(r),spatial=items(p[3],'list'),workspace=items(spatial[3],'list');
 const tr=outputs(snap.trace,160n).find(t=>txt(f(t,6n))===ACTION_MEMORY_VERSION&&uint(f(rec(f(t,4n),130n),3n))===50n&&signedValue(f(rec(f(t,4n),130n),2n))===33n)!;
 const experience=positionExperience(items(f(tr,12n),'list')[2]);
 const event={eventId:99999n,eventSequence:99999n,dueAt:simInstant(33n),phase:50n,eventTypeId:sid(1001,'event/task-appraisal'),payload:list([]),dependencies:list([]),causalParentEventIds:[]} as ScheduledEvent;
 function evaluate(slots:readonly CanonicalValue[],observation=p[2]){const w=[...workspace];w[4]=list(slots);const m=[...spatial];m[3]=list(w);return items(createActionMemory(C,model.actionMemory!,model.strategy!,model.spatialMeaning!,component.stateModel,model.modelIdentity.value,decode(r.runIdentity()),()=>({observation,experience,contexts:list([])})).appraise(event,list(w),list(m)).report,'list');}
 const slots=items(workspace[4],'list'),unknown=(v:readonly CanonicalValue[])=>expect(items(v[4],'list').map(x=>txt(items(x,'list')[2]))).toEqual(['Unknown','Unknown']);
 unknown(evaluate([]));const noA=slots.filter(v=>{const a=items(items(v,'list')[1],'list');return a.length!==9||validateActionAnnex(a[8],a)?.action&&key(validateActionAnnex(a[8],a)!.action)!==key(actionA);});
 expect(txt(items(items(evaluate(noA)[4],'list').find(v=>key(items(v,'list')[1])===key(actionA))!,'list')[2])).toBe('Unknown');
 for(const field of [1,2,3]){const o=[...items(p[2],'list')],v=[...items(o[4],'list')];v[field]=u(field===3?2:7);o[4]=list(v);unknown(evaluate(slots,list(o)));}
 const o=[...items(p[2],'list')];o[6]=u(2);unknown(evaluate(slots,list(o)));
 const selected=slots.find(v=>{const a=items(items(v,'list')[1],'list');return a.length===9&&items(a[8],'list').length===3;})!;
 expect(()=>evaluate([...slots,selected])).toThrow('duplicate');
 const original=items(selected,'list')[1],entry=state.entries().find(e=>key(e.value)===key(original))!,ep=items(original,'list'),annex=items(ep[8],'list');
 expect(()=>component.stateModel.applyPatch(state,{operations:[{kind:'set',path:entry.path,expected:{presence:true,value:original},newValue:original}]},sid(1025,'authority/selected-plan'))).toThrow();
 const removed=list([...ep.slice(0,8),list([])]);
 expect(()=>component.stateModel.applyPatch(state,{operations:[{kind:'set',path:entry.path,expected:{presence:true,value:original},newValue:removed}]},EPISODIC_OWNER)).toThrow('immutable');
 const observation=[...items(annex[2],'list')];observation[5]=sid(1027,'definition/not-admitted');const foreign=list([...ep.slice(0,8),list([annex[0],annex[1],list(observation)])]);
 expect(()=>component.stateModel.validateState(new AuthoritativeState(state.entries().map(e=>key(e.value)===key(original)?{...e,value:foreign}:e)))).toThrow('foreign action-memory');
 const sourceSlots=items(decode(s.registry),'list');await expect(prepareCharacterModel({...s,registry:enc(list(sourceSlots.slice(0,43)))})).rejects.toThrow();
 console.info('M61_BOUNDARIES selected-only/no-match/coordinate/context/duplicate/immutable/model-domain/foreign-owner/version PASS');
}
it('continuation and boundaries: actual annex persists with exact decision inputs',async()=>{
 const {s,d}=fixture(),r=await createCharacterRun(await prepareCharacterModel(s),d);await advance(r,32n);const save=r.save(),b=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save});clocks.set(b,32n);exact(r,b);
 await advance(r,33n);await advance(b,33n);exact(r,b);live(b,true);await seamControls(s,b);
 console.info('M61_CONTINUATION complete-prefix fresh replay to32 and continuation33 state/output/trace/save byte-equal');
},600000);
it('epistemic and rollback: denied observation, denied performance and atomic formation',async()=>{
 const A=fixture({denied:true}),B=fixture({denied:true,moved:false}),model=await prepareCharacterModel(A.s);
 const a=await createCharacterRun(model,A.d),b=await createCharacterRun(model,B.d);await advance(a,17n);await advance(b,17n);
 expect(target(a)).toBeUndefined();expect(target(b)).toBeUndefined();for(const tag of [ACTION_MEMORY+'/forecast',ACTION_MEMORY+'/reasons',SIGNIFICANCE])expect(reports(a,tag)).toEqual(reports(b,tag));
 const D=fixture({reportDenied:true}),d=await createCharacterRun(model,D.d);await advance(d,15n);expect(target(d)).toBeDefined();expect(items(items(target(d)!,'list')[8],'list')).toHaveLength(0);
 const R=fixture(),r=await createCharacterRun(model,R.d);await advance(r,14n);const before=r.snapshot(),apply=stateModule.applyStatePatch;let reached=false;
 const spy=vi.spyOn(stateModule,'applyStatePatch').mockImplementation((...args)=>{const result=apply(...args);if(args[1].operations.some(o=>o.kind==='set'&&isPositionEpisodePath(o.path)&&items(items(o.newValue,'list')[8],'list').length===3)){reached=true;throw Error('M61 after action episode formation');}return result;});
 try{await expect(r.settleNextInstant()).rejects.toThrow('M61 after action episode formation');expect(reached).toBe(true);for(const k of ['state','outputs','trace'] as const)bytes(r.snapshot()[k],before[k]);expect(r.snapshot().clock).toBe(14n);}finally{spy.mockRestore();}
 console.info('M61_EPISTEMIC hidden x15=1/0 denied: equal cognition; denied actual performance has no annex; reached formation rollback PASS');
},600000);

it('diagnostic17: fixed attribution prerequisites and actual training',async()=>{
 const {s,d}=fixture(),m=await compileCharacterModel(s),r=await createCharacterRun(await prepareCharacterModel(s),d);await advance(r,17n);
 const snap=r.snapshot(),st=restoreAuthoritativeState(decode(snap.state)),attribution=reports(r,'assembled-retained-attribution/0.1').at(-1)!,kind=txt(named(attribution[4],'kind'));
 console.info('M61_DIAG',JSON.stringify({routes:m.strategy!.map(r=>({task:key(r.task).slice(-40),actions:r.plans.map(p=>txt(id(p.actionId).payload))})),tasks:st.entries().filter(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===1n).map(e=>String(uint(f(rec(e.value,372n),1n)))),episodes:st.entries().filter(e=>e.path.rootStateTypeId===346n&&typeof e.value!=='boolean'&&e.value.kind==='list').map(e=>{const a=items(e.value,'list');return [txt(a[0]),String(signedValue(a[5]))]}),decisions:outputs(snap.outputs,409n).map(v=>({at:String(signedValue(f(v,2n))),status:String(uint(f(rec(f(v,4n),419n),1n)))})),executions:outputs(snap.outputs,433n).length,groups:items(attribution[3],'list').map(g=>txt(named(g,'kind'))),attribution:kind==='Result'?txt(named(named(attribution[4],'result'),'disposition')):kind,annex:items(items(target(r)!,'list')[8],'list').length},(_,v)=>typeof v==='bigint'?String(v):v));
 expect(outputs(snap.outputs,433n).length).toBeGreaterThan(0);expect(items(items(target(r)!,'list')[8],'list')).toHaveLength(3);
},180000);
