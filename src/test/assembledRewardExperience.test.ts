import {SELF,SELF_CONTEXT} from '../assembled/selfBelief';
import {VALUES,VALUES_CONTEXT} from '../assembled/values';
import {it,expect} from 'vitest';
import {fixture as base,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,state,labels,through,at,outputs,exact,type Run} from './fixtures/assembledSleepAcquisition';
import {REWARD_EXPERIENCE_RULES,REWARD_EXPERIENCE_REGISTRY} from '../assembled/model';
import {REWARD,REWARD_SOURCE,REWARD_RECEIPT,rewardBodyPath,rewardValue,rewardTransition,rewardAnchor,compileReward,rewardSource,rewardSense} from '../assembled/rewardExperience';
import {HABIT,HABIT_SOURCE,NUMERIC_REWARD,habitJournal,habitPath,rewardPath,rewardValue as beliefValue} from '../assembled/habit';
import {SLEEP,SLEEP_SOURCE,sleepPath,sleepValue} from '../assembled/sleepControl';
import {CONTROL,CONTROL_SOURCE,CONTROL_VIEW} from '../assembled/control';
import {STRATEGY,DISPLAY} from '../assembled/strategy';
import {PRIORITY,PRIORITY_DISPLAY} from '../assembled/priority';
import {SKILL,PRACTICE_SETTING,sid} from '../assembled/skill';
import {IDENTITY_CONTEXT,ELIGIBILITY,EXPERIMENT,identityJournal,journalPath} from '../assembled/identityEligibility';
import {PROTECTION_CHANNEL} from '../assembled/protectiveIdentity';
import {cognitiveRecord as r} from '../assembled/codecs';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {rational as q,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {prepareCharacterModel,createCharacterRun,restorePreparedCharacterRun} from '../assembled/character';
import {cachedMemory} from './fixtures/assembledMemoryFinal';
import {changeDefinition} from './fixtures/assembledCharacter';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {advanceBiology,defaultConstitution,initialBiology,emptyPhysicalInput} from '../campaign3/biologicalDynamics';
const target=sid(1027,'definition/protocol-contact-one');
export function rewardFixture(o:{learn?:boolean;permitted?:boolean;dose?:number}={}){
 const b=base(),slots=[...items(decode(b.s.registry),'list')],routes=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')),taskA=routes[0][0],taskB=items(slots[56],'list')[2];
 slots.push(list([text(REWARD),target,taskA,u(300),u(500),u(o.dose??600),u(10)]));
 const actuator=items(slots[10],'list');slots[10]=list([actuator[0],actuator[1],set(items(actuator[2],'set').map(v=>list([items(v,'list')[0],q(0,1),u(0)])))]);
 let s=changeDefinition({...b.s,rulesVersion:REWARD_EXPERIENCE_RULES,registrySchemaVersion:REWARD_EXPERIENCE_REGISTRY,registry:enc(list(slots))},'definition/protocol-observation',4n,false);
 for(const v of items(slots[0],'set')){if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)continue;const d=f(v,4n);if(typeof d==='boolean'||d.kind!=='record'||d.schema.typeId!==370n)continue;const id=f(v,1n);if(typeof id==='boolean'||id.kind!=='typedIdentifier'||typeof id.payload==='boolean'||id.payload.kind!=='text')throw Error('task definition');s=changeDefinition(changeDefinition(s,id.payload.value,5n,signed(1)),id.payload.value,6n,signed(25));}
 const initial=new AuthoritativeState([...restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n&&e.path.fieldId===3n?{...e,value:sleepValue(0n,0,7)}:e),{path:rewardBodyPath(C),value:rewardValue(0n,300)}]);
 const rows:CanonicalValue[]=[],put=(at:number,phase:number,event:CanonicalValue,payload:CanonicalValue)=>rows.push(list([signed(at),u(phase),event,payload,list([])]));
 const display=(at:number,task:CanonicalValue,route:number,receipt:number,available:boolean,until:number)=>list([task,u(route),u(receipt),available,u(at),u(until),true]);
 const displays=new Map<number,CanonicalValue[]>(),show=(t:number,v:CanonicalValue)=>displays.set(t,[...(displays.get(t)??[]),v]);
 show(1,display(1,taskA,0,1,true,3));show(1,display(1,taskA,1,2,false,13));show(1,display(1,taskB,0,1,false,2));show(1,display(1,taskB,1,2,false,13));show(2,display(2,taskB,0,3,true,13));
 for(const [t,available,until,receipt] of [[3,false,8,3],[8,true,10,4],[10,false,12,5],[12,true,13,6]] as const)show(t,display(t,taskA,0,receipt,available,until));
 for(const [t,ds] of displays)put(t,30,DISPLAY,list([text(STRATEGY),list(ds)]));
 put(1,10,PRIORITY_DISPLAY,list([text(PRIORITY),list(routes.map(x=>list([x[0],list([q(0,1)]),true,list([q(1,1)]),true])))]));
 for(let t=1;t<=13;t++){
  const logical=t-1;put(t,10,SLEEP_SOURCE,list([text(SLEEP),t===1||logical>=2,list([true,true,true,true]),list([signed(0),signed(0),signed(0),signed(0)])]));
  put(t,10,REWARD_SOURCE,list([text(REWARD),o.permitted!==false,signed(0),logical===1&&o.learn!==false,logical===1]));
  if(t===1)continue;
  put(t,10,HABIT_SOURCE,list([text(HABIT),true,true,false,false,true,u(0)]));
  put(t,10,CONTROL_SOURCE,list([text(CONTROL),u(logical===2?1:0),logical===2,true,false,true,u(logical===2?800:0)]));
  put(t,30,PRACTICE_SETTING,list([text(SKILL),u(4),q(0,1),q(0,1),true,false]));
  put(t,30,SELF_CONTEXT,list([text(SELF),false,signed(1)]));put(t,30,VALUES_CONTEXT,list([text(VALUES),false,signed(1)]));
  put(t,30,IDENTITY_CONTEXT,list([text(EXPERIMENT),list([text(ELIGIBILITY),q(1,1),q(0,1),logical===1]),list([false,logical===2])]));
  put(t,40,sid(1001,'event/deliberation-opportunity'),r(377,[sid(1000,'observer/bridge-subject'),sid(1027,'definition/task-workspace')]));
 }
 return {s,d:{initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32)}};
}
const prepared=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function rewardStart(b=rewardFixture()){const k=JSON.stringify(b.s);let m=prepared.get(k);if(!m){m=prepareCharacterModel(b.s);prepared.set(k,m);}const handle=await m;return {b,handle,run:cachedMemory(await createCharacterRun(handle,b.d))};}
const decision=(run:Run,t:bigint)=>outputs(run.snapshot().outputs,409n).find(v=>at(f(v,2n))===t)!;
const data=(d:CanonicalValue)=>rec(f(rec(f(rec(d,409n),4n),419n),2n),420n);
const belief=(run:Run)=>beliefValue(state(run).read(rewardPath(C)).value,EXTENDED_TIME_LIMIT,true);
const history=(run:Run)=>habitJournal(state(run).read(habitPath(C)).value,EXTENDED_TIME_LIMIT,true);
it('kernel214 reward projection equals original zero-adaptation Full and denied sensors stay unknown',()=>{
 let cases=0;for(const baseline of [0,300,1000])for(const level of [0,300,900,1000])for(const dose of [0,600,1000])for(const dt of [0,1,3]){const d=compileReward(list([text(REWARD),target,list([]),u(baseline),u(500),u(dose),u(10)])),c=defaultConstitution();Object.assign(c.channels.reward,{baseline,toleranceGain:0,sensitizationGain:0,displacementGain:0,satiationGain:0});let original=initialBiology(c);original.channels.reward.level=level;for(let n=0;n<dt;n++)original=advanceBiology(original,c,emptyPhysicalInput(),'Full','elapsed').state;const input=emptyPhysicalInput();input.stimuli.push({channel:'reward',exposure:'drug',dose,direction:1});original=advanceBiology(original,c,input,'Full','consequence').state;expect(rewardAnchor(rewardTransition(rewardValue(0n,level),BigInt(dt),d,true).value).level).toBe(original.channels.reward.level);expect(rewardSense(level,d,rewardSource(list([text(REWARD),false,signed(0),true,false])))).toBeUndefined();cases++;}console.info('M214 KERNEL PASS',cases,'exact physical projections; denied signal unknown');
});
it('native214 performed pleasure learns once and changes a later real decision',async()=>{
 const a=await rewardStart(),b=await rewardStart(rewardFixture({learn:false})),repeat=await rewardStart();for(const x of [a,b,repeat])await through(x.run,2n);exact(a.run,repeat.run);
 console.info('M214 prelude',history(a.run).length,belief(a.run)?.mean?.toString());expect(history(a.run)).toHaveLength(1);expect(belief(a.run)?.mean).toBe(600n);expect(history(b.run)).toHaveLength(0);expect(belief(b.run)).toBeUndefined();expect(state(a.run).read({rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]})).toEqual(state(b.run).read({rootStateTypeId:455n,fieldId:1n,selectors:[{kind:'mapKey',key:C}]}));
 const receipt=labels(a.run,REWARD_RECEIPT).find(v=>v.length===9&&at(v[2])===2n)!;expect(receipt).toBeDefined();expect(uint(items(receipt[6],'list')[0])).toBe(600n);
 const restored=cachedMemory(await restorePreparedCharacterRun(a.handle,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()}));exact(a.run,restored);
 const held=state(a.run).read(habitPath(C));for(const x of [a.run,b.run,restored])await through(x,3n);exact(a.run,restored);
 const reason=labels(a.run,NUMERIC_REWARD+'/reasons').find(v=>uint(v[1])===3n)!;expect(reason).toBeDefined();expect(reason[2]).toBe(true);expect(reason[3]).toBe(false);expect(reason[5]).toEqual(q(3,5));const v=labels(a.run,CONTROL_VIEW).find(v=>uint(v[1])===3n)!;expect(v[2]).toBe(true);expect(v[3]).toBe(true);expect(v[9]).toBe(false);
 expect(f(data(decision(a.run,3n)),2n)).not.toEqual(f(data(decision(b.run,3n)),2n));expect(identityJournal(state(a.run).read(journalPath(r(412,[C,PROTECTION_CHANNEL],2))).value)).toHaveLength(1);
 for(const x of [a.run,restored])await through(x,4n);exact(a.run,restored);expect(state(a.run).read(habitPath(C))).toEqual(held);
 console.info('M214 NATIVE PASS actual600 pleasure, mean3/5, live later shared reason and changed exact probability; protective acquisition3; held history4; repeat2/restore2->3->4');
},600000);
it('boundary214 denied and zero first receipts do not invent positive reward',async()=>{for(const o of [{permitted:false},{dose:0}]){const x=await rewardStart(rewardFixture(o));await through(x.run,3n);if('dose'in o){expect(history(x.run)).toHaveLength(1);expect(belief(x.run)?.mean).toBe(0n);expect(belief(x.run)?.positive).toBe(false);}else {expect(history(x.run)).toHaveLength(0);expect(belief(x.run)).toBeUndefined();}const reason=labels(x.run,NUMERIC_REWARD+'/reasons').find(v=>uint(v[1])===3n)!;expect(reason[5]).toEqual(q(0,1));}console.info('M214 BOUNDARY PASS denied unknown vs experienced zero; neither produces learned pleasure');},600000);

it('diagnostic214 inspect the actual practice path after missing receipt',async()=>{const x=await rewardStart();await through(x.run,2n);const os=items(decode(x.run.snapshot().outputs),'list'),tags=['assembled-habit-options/0.1',NUMERIC_REWARD+'/reasons',REWARD_RECEIPT,'assembled-action-body/0.1','assembled-skill-actual/0.1','assembled-strategy-evaluation/0.1'];const compact=tags.map(tag=>[tag,labels(x.run,tag).map(a=>tag===REWARD_RECEIPT?[a.length,a[2],a.length===9?a[6]:[],a.length===9?a[8]:[]]:tag==='assembled-strategy-evaluation/0.1'?[a[2],items(a[3],'list').map(v=>{const b=items(v,'list');return [b[1],items(b[2],'list').map(v=>items(v,'list')[0])];})]:tag==='assembled-habit-options/0.1'?[a[1],a[3],a[5],items(a[6],'list').length]:tag===NUMERIC_REWARD+'/reasons'?[a[1],a[2],a[3],a[5]]:a)]);const d=decision(x.run,2n);console.info('M214 ACTUAL DIAGNOSTIC',JSON.stringify({compact,status:d?f(rec(f(d,4n),419n),1n):null},(_,v)=>typeof v==='bigint'?v.toString():v));},180000);
