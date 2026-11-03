import {it,expect} from 'vitest';
import {list,text,unsigned,rational as q,map,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {REAPPRAISAL_APPRAISAL,REAPPRAISAL_MOTIVE,REAPPRAISAL_SOURCE,REAPPRAISAL_VERSION,reappraisalPath,framePath,reappraisalKnowledge,reappraisalFrame,REAPPRAISAL_APPLY} from '../assembled/reappraisal';
import {ACTION_BODY} from '../assembled/actionBody';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {receivingRecord as rec,cognitiveRecord as r} from '../assembled/codecs';
import {dataField as f,dataUnsigned as uint,dataRecord as plain} from '../campaign2/canonicalData';
import {compileReasonNuclei,readQ} from '../campaign2/cognitiveMath';
import {createChosenReappraisalRun} from '../campaign3/chosenReappraisal';
import {chosenFrames,type Scenario} from './chosenReappraisalFixtures';
import {source,data,task,action,decode,items,key,enc} from './fixtures/assembledReappraisal';
import {outputs,through,signedValue,type Run} from './fixtures/assembledComparison';
import {C} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';
const reports=(run:Run,label:string)=>items(decode(run.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const state=(run:Run)=>restoreAuthoritativeState(decode(run.snapshot().state));
const knowledge=(run:Run)=>reappraisalKnowledge(state(run).read(reappraisalPath(C)).value,C);
const frame=(run:Run)=>reappraisalFrame(state(run).read(framePath(C)).value);
const appraisal=(run:Run,at=5)=>reports(run,REAPPRAISAL_APPRAISAL).find(a=>uint(a[1])===BigInt(at))!;
const motive=(run:Run,at=4)=>reports(run,REAPPRAISAL_MOTIVE).find(a=>uint(a[1])===BigInt(at))!;
const decision=(run:Run,at=4)=>outputs(run.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===BigInt(at))!;
const status=(run:Run)=>rec(f(decision(run),4n),419n);
const trace=(run:Run)=>outputs(run.snapshot().trace,160n),event=(row:CanonicalValue)=>rec(f(rec(row,160n),4n),130n);
const rational=(v:CanonicalValue)=>{const n=readQ(v);return `${n.numerator}/${n.denominator}`;};
const diagnostic=(v:unknown)=>JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x);
const equal=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
function live(run:Run){expect(appraisal(run,4),'live appraisal4').toBeDefined();expect(appraisal(run,4)[5]).toEqual(text('Known'));expect(appraisal(run,4)[2]).toEqual(list([q(1,1),q(0,1)]));expect(motive(run)[3],'eligible operation').toBe(true);expect(motive(run)[4]).toEqual(q(1,1));expect(motive(run)[6]).toEqual(q(1,1));expect(uint(f(status(run),1n)),'live chosen resolution').toBe(3n);expect(f(rec(f(rec(f(status(run),2n),420n),1n),395n),2n)).toEqual(action);expect(appraisal(run)[5],'live later appraisal').toEqual(text('Known'));}
async function run(scenario:Scenario='SafetyOnly',law='BenefitRelative',until=8n){const x=await createCharacterRun(await prepareCharacterModel(source(law)),data(scenario));await through(x,until);return x;}
function summary(run:Run){return {clock:run.snapshot().clock,means:knowledge(run).means.map(v=>v?`${v.numerator}/${v.denominator}`:null),frame:frame(run).at,appraisals:reports(run,REAPPRAISAL_APPRAISAL).map(a=>({at:uint(a[1]),known:key(a[5])===key(text('Known')),affect:items(a[6],'list').map(rational)})),motive4:motive(run)?.slice(3),choice:uint(f(status(run),1n)),draws:trace(run).reduce((n,t)=>n+items(f(t,14n),'list').length,0)};}
// Run before behavioral tests: fixed source calibration, no search or retuning.
it('calibration: fixed original safety and Mixed remain in their declared bands',()=>{
 const slots=items(decode(source().registry),'list'),defs=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>plain(v,171n)),dice=f(defs.find(v=>key(f(v,1n))===key({kind:'typedIdentifier',namespaceId:1027n,payload:text('definition/task-reason-dice')}))!,4n),candidate=r(395,[C,action]),signal=(strength:CanonicalValue)=>r(402,[r(401,[candidate,task(),unsigned(1)]),strength,r(400,[map([])])]);
 const strong=compileReasonNuclei([signal(q(1,1))],dice),small=compileReasonNuclei([signal(q(1,2))],dice);expect(f(rec(dice,437n),2n)).toEqual(q(37,100));expect(strong).toHaveLength(1);expect(small).toHaveLength(0);const n=rec(strong[0],407n),roles=rec(f(n,2n),406n);expect(f(roles,1n)).toEqual(q(1,2));expect(f(n,5n)).toEqual({kind:'signed',value:0n});expect(f(n,6n)).toEqual({kind:'signed',value:0n});console.info('M41 PRE-RUN calibration '+diagnostic({raw:'1',bounded:'1/2',threshold:rational(f(rec(dice,437n),2n)),die:uint(f(n,4n)),standing:'0',context:'0',singleOptionProbability:'1',mode:'Auto',smallRaw:'1/2',smallBounded:'1/3',small:'NoReasons',saturation:'unreachable in admitted zero-modifier witness'}));
});
it('connection: original SafetyOnly, Interrupted and NoReappraisal share evidence and differ only after completion',async()=>{
 const a=await run(),b=await run('Interrupted'),c=await run('SafetyOnly','NoReappraisal');for(const x of [a,b,c]){live(x);expect(reports(x,ACTION_BODY)).toHaveLength(0);expect(knowledge(x).rows).toHaveLength(2);expect(summary(x).draws).toBe(0);expect(uint(f(rec(f(status(x),2n),420n),8n))).toBe(1n);expect(items(f(rec(f(status(x),2n),420n),2n),'list').map(v=>rational(f(rec(v,421n),2n)))).toEqual(['1/1']);}
 expect(knowledge(a)).toEqual(knowledge(b));expect(knowledge(a)).toEqual(knowledge(c));expect(frame(a).at).toBe(4n);expect(frame(b).at).toBe(0n);expect(frame(c).at).toBe(0n);expect(appraisal(a,4)[6]).toEqual(list([q(1,1),q(1,1)]));expect(appraisal(a)[6]).toEqual(list([q(0,1),q(0,1)]));for(const x of [b,c])expect(appraisal(x)[6]).toEqual(list([q(1,1),q(1,1)]));
 for(const [x,scenario,law]of [[a,'SafetyOnly','BenefitRelative'],[b,'Interrupted','BenefitRelative'],[c,'SafetyOnly','NoReappraisal']] as const){const original=await createChosenReappraisalRun(law,chosenFrames(scenario),0,2);for(let i=0;i<8;i++)await original.step();const rows=original.snapshot().rows;expect(rows).toHaveLength(8);expect(reports(x,REAPPRAISAL_APPRAISAL)).toHaveLength(8);for(const row of rows){expect(items(appraisal(x,row.at)[6],'list').map(rational)).toEqual(row.affect);expect(items(appraisal(x,row.at)[2],'list').map(v=>typeof v!=='boolean'&&v.kind==='list'?null:rational(v))).toEqual(row.means);}expect(rows[3].chosen).toBe(0);expect(rows[3].completion).toBe(scenario!=='Interrupted');expect(rows[4].frameBefore!==null).toBe(x===a);expect(rows[3].knowledgeBefore).toBe(rows[4].knowledgeBefore);}
 const appraisalTrace=trace(a).find(t=>key(f(t,6n))===key(text(REAPPRAISAL_VERSION))&&uint(f(event(t),3n))===50n&&signedValue(f(event(t),2n))===5n)!;expect(appraisalTrace).toBeDefined();expect(items(f(appraisalTrace,11n),'list')).toHaveLength(2);const prior=items(f(appraisalTrace,12n),'list');expect(prior[0]).toEqual(state(a).read(reappraisalPath(C)).value);expect(reappraisalFrame(prior[1]).at).toBe(4n);const applied=trace(a).find(t=>key(f(event(t),5n))===key(REAPPRAISAL_APPLY))!,completed=trace(a).find(t=>key(f(t,6n))===key(text(REAPPRAISAL_VERSION))&&uint(f(event(t),3n))===110n)!;expect(applied).toBeDefined();expect(completed).toBeDefined();expect(items(f(event(applied),8n),'list')).toContainEqual(f(event(completed),1n));expect(items(state(a).read(framePath(C)).value!,'list')[2]).toEqual(f(rec(items(f(completed,12n),'list')[0],433n),1n));console.info('M41 primary/original replay '+diagnostic([a,b,c].map(summary)));
},540000);
it('controls: unknown, late evidence, denied catalogue, absent opportunity and subthreshold Mixed never install a frame',async()=>{
 for(const scenario of ['Unknown','SameInstant','DeniedCatalogue','NoOpportunity','Mixed'] as const){const x=await run(scenario);expect(frame(x).at).toBe(0n);expect(uint(f(status(x),1n))).not.toBe(3n);expect(summary(x).draws).toBe(0);if(scenario==='SameInstant'){expect(items(appraisal(x,4)[2],'list')[1]).toEqual(list([]));expect(items(appraisal(x,5)[2],'list')[1]).toEqual(q(0,1));}if(scenario==='Mixed'){expect(motive(x)[6]).toEqual(q(1,2));expect(appraisal(x,4)[5]).toEqual(text('Known'));}console.info('M41 control '+scenario+' '+diagnostic(summary(x)));}
},540000);
it('comparators: known ineffective/harmful interpretation is rejected by BenefitRelative but may be chosen by KnowledgeOnly',async()=>{
 for(const scenario of ['Ineffective','Harmful'] as const){const a=await run(scenario),b=await run(scenario,'KnowledgeOnly');for(const x of [a,b]){expect(appraisal(x,4)[5]).toEqual(text('Known'));expect(motive(x)[3]).toBe(true);expect(summary(x).draws).toBe(0);}expect(uint(f(status(a),1n))).not.toBe(3n);expect(frame(a).at).toBe(0n);expect(frame(b).at).toBe(4n);expect(uint(f(status(b),1n))).toBe(3n);expect(items(appraisal(b)[6],'list')).toEqual([q(1,1),q(1,1)]);expect(knowledge(a)).toEqual(knowledge(b));console.info('M41 comparator '+scenario+' '+diagnostic([a,b].map(summary)));}
},540000);
it('hidden: physical truth cannot change safe knowledge, interpretation or cognition',async()=>{
 // HiddenTruth has the original Balanced goals; this fixture maps only the safety
 // goal and leaves other goals0, so the hidden flag is the only compared input.
 const a=await run(),b=await run('HiddenTruth');live(a);live(b);expect(knowledge(a)).toEqual(knowledge(b));expect(frame(a)).toEqual(frame(b));expect(reports(a,REAPPRAISAL_APPRAISAL)).toEqual(reports(b,REAPPRAISAL_APPRAISAL));expect(outputs(a.snapshot().outputs,409n)).toEqual(outputs(b.snapshot().outputs,409n));expect(summary(a).draws).toBe(0);expect(summary(b).draws).toBe(0);console.info('M41 hidden truth PASS');
},240000);
it('persistence: exact repeat4 and whole-save continuation4 through terminal deadlines',async()=>{
 const s=source(),d=data(),m=await prepareCharacterModel(s),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);await through(a,4n);await through(b,4n);equal(a,b);expect(frame(a).at).toBe(4n);const restored=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});equal(a,restored);let n=0;while(await a.settleNextInstant()){expect(await restored.settleNextInstant()).toBe(true);equal(a,restored);if(++n>16)throw Error('M41 terminal bound');}expect(await restored.settleNextInstant()).toBe(false);equal(a,restored);console.info('M41 repeat4/restore4..terminal PASS');
},300000);
it('admission: learned starts, forged source, direct frame injection and wrong owner reject',async()=>{
 const s=source(),d=data(),x=await run(),model=await compileCharacterModel(s),component=await compileCharacterState(model),prior=state(x),value=prior.read(framePath(C)).value!;expect(()=>component.stateModel.applyPatch(prior,{operations:[{kind:'set',path:framePath(C),expected:{presence:true,value},newValue:list([items(value,'list')[0],unsigned(5),...items(value,'list').slice(2)])}]},KNOWLEDGE_OWNER)).toThrow();
 const initial=restoreAuthoritativeState(decode(d.initialState)),injected=new AuthoritativeState([...initial.entries(),...prior.entries().filter(e=>e.path.rootStateTypeId===1000n&&e.path.fieldId===8n||e.path.rootStateTypeId===1031n)]);await expect(createCharacterRun(await prepareCharacterModel(s),{...d,initialState:enc(injected.canonicalValue())})).rejects.toThrow();
 const rows=items(decode(d.orderedInputs),'list'),bad=rows.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(REAPPRAISAL_SOURCE))a[3]=list([...items(a[3],'list'),value]);return list(a);});await expect(createCharacterRun(await prepareCharacterModel(s),{...d,orderedInputs:enc(list(bad))})).rejects.toThrow('source grammar');const direct=list([ {kind:'signed',value:4n} as CanonicalValue,unsigned(140),REAPPRAISAL_APPLY,value,list([])]);await expect(createCharacterRun(await prepareCharacterModel(s),{...d,orderedInputs:enc(list([...rows,direct]))})).rejects.toThrow();console.info('M41 admission/authority PASS');
},240000);
it('rollback: a late first-operation failure leaves no frame or partial shared state',async()=>{
 const s=source(),d=data(),a=await run(),counts=new Map<bigint,Set<string>>();for(const t of trace(a)){const e=event(t),at=signedValue(f(e,2n)),xs=counts.get(at)??new Set<string>();xs.add(key(f(e,1n)));counts.set(at,xs);}const n=counts.get(4n)!.size;expect(n).toBeGreaterThan(Math.max(...[...counts].filter(([at])=>at<4n).map(([,x])=>x.size)));const b=await createCharacterRun(await prepareCharacterModel(workLimit(s,BigInt(n-1))),d);await through(b,3n);const before=b.snapshot();await expect(b.settleNextInstant()).rejects.toThrow('work ceiling');expect({...b.snapshot(),status:before.status}).toEqual(before);expect(frame(b).at).toBe(0n);expect(knowledge(b).rows).toHaveLength(2);console.info('M41 rollback PASS '+(n-1)+'/'+n);
},240000);
