/** M53: one holder, physical tasks, marker1, body30/rate10/width1.
 * Identical perceived histories and goals; only declared retention comparator differs.
 * No final-choice claim: spatial appraisal is deterministic and consumes no draws. */
import {it,expect,vi} from 'vitest';
import {list,text,signed,unsigned as u,rational as q,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,AuthoritativeState} from '../substrate/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {SPATIAL_MEANING,SPATIAL_MEANING_VERSION,compileGoalMeaning,createGoalMeaning,goalMeaningPath,GOAL_ADOPT} from '../assembled/goalMeaning';
import {ExactRational as Q} from '../substrate/exactMath';
import {SIGNIFICANCE,named,directions} from '../assembled/significance';
import {POSITION_EPISODE,RECALL,isPositionEpisodePath} from '../assembled/memory';
import {POSITION_SOURCE} from '../assembled/positionPerception';
import {sid} from '../assembled/skill';
import * as qualification from '../campaign3/goalOutcomeQualification';
import {fixture,decode,items,key,enc} from './fixtures/assembledSpatialMeaning';
import {signedValue,outputs,type Run} from './fixtures/assembledComparison';
import {dataField as f,dataRecord as rec,dataText as txt} from '../campaign2/canonicalData';
async function advance(r:Run,from:number,to:number){for(let n=from;n<to;n++)expect(await r.settleNextInstant()).toBe(true);expect(r.snapshot().clock).toBe(BigInt(to));}
const reports=(s:ReturnType<Run['snapshot']>,tag:string)=>items(decode(s.outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
const latest=(r:Run)=>reports(r.snapshot(),SPATIAL_MEANING).at(-1)!;
const assessment=(p:readonly CanonicalValue[])=>named(p[5],'assessment');
const ages=(p:readonly CanonicalValue[])=>items(p[4],'list').map(v=>signedValue(items(items(v,'list')[1],'list')[5]));
function bytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);}
function same(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){expect(a.clock).toBe(b.clock);for(const k of ['state','outputs','trace'] as const)bytes(a[k],b[k]);}
async function fresh(law:'SignificanceFirst'|'AgeOnly'='SignificanceFirst'){const {s,d}=fixture(law);return createCharacterRun(await prepareCharacterModel(s),d);}
it('witness: significance survival changes a live later spatial appraisal',async()=>{
 const a=await fresh(),b=await fresh('AgeOnly');await advance(a,0,17);await advance(b,0,17);
 for(const r of [a,b]){const p=reports(r.snapshot(),SIGNIFICANCE);expect(p).toHaveLength(1);const target=restoreAuthoritativeState(decode(r.snapshot().state)).entries().find(e=>isPositionEpisodePath(e.path)&&signedValue(items(e.value,'list')[5])===15n)!;expect(directions(items(target.value,'list')[7])).toEqual(['MovingCloser']);}
 await advance(a,17,33);await advance(b,17,33);const sa=a.snapshot(),sb=b.snapshot(),pa=latest(a),pb=latest(b);
 expect(named(assessment(pa),'kind')).toEqual(text('Assessed'));expect(named(assessment(pb),'kind')).toEqual(text('Assessed'));
 console.info('M53 LIVE both current goals active, both spatial appraisals Assessed at33.');
 expect(ages(pa)).toEqual([15n,32n]);expect(ages(pb)).toEqual([31n,32n]);
 expect(named(assessment(pa),'relation')).toEqual(text('MovingFarther'));expect(named(assessment(pb),'relation')).toEqual(text('SameDistance'));expect(pa[2]).toEqual(pb[2]);
 const stateA=restoreAuthoritativeState(decode(sa.state)),stateB=restoreAuthoritativeState(decode(sb.state));
 expect(stateA.entries().filter(e=>e.path.rootStateTypeId===455n)).toEqual(stateB.entries().filter(e=>e.path.rootStateTypeId===455n));
 for(const [s,p] of [[sa,pa],[sb,pb]] as const)for(const v of items(p[4],'list')){const e=items(v,'list')[1];expect(reports(s,RECALL).some(r=>signedValue(r[1])===33n&&key(r[2])===key(e))).toBe(true);}
 const referenceTarget=items(items(pa[4],'list')[0],'list')[1];expect(stateA.entries().some(e=>key(e.value)===key(referenceTarget))).toBe(true);expect(stateB.entries().filter(e=>isPositionEpisodePath(e.path)).every(e=>signedValue(items(e.value,'list')[5])!==15n)).toBe(true);
 for(const s of [sa,sb]){const traces=outputs(s.trace,160n).filter(t=>txt(f(t,6n))===SPATIAL_MEANING_VERSION&&signedValue(f(rec(f(t,4n),130n),2n))===33n);expect(traces).toHaveLength(1);expect(items(f(traces[0],14n),'list')).toHaveLength(0);expect(items(f(traces[0],12n),'list')[0]).toEqual((s===sa?pa:pb)[3]);expect(items(f(traces[0],11n),'list')).toHaveLength(1);}
 // Detached negative controls use the actual native selected operands and goal.
 const {s,d}=fixture(),model=await compileCharacterModel(s),component=await compileCharacterState(model),C=f(rec(items(pa[3],'list')[3],381n),2n),ext=createGoalMeaning(C,model.spatialMeaning!,component.stateModel,[],list([]),list([]));
 const wrapper=ext.extend({begin(){},close(){}} as never);wrapper.begin(33n);
 const event={dueAt:33n,phase:50n,eventTypeId:sid(1001,'event/task-appraisal')} as never,w=items(pa[3],'list');
 const evaluated=(ws:CanonicalValue,st=stateA)=>ext.appraise(event,st,ws,pa[6]).report;
 expect(()=>evaluated(list(w.map((v,i)=>i===1?signed(32):v)))).toThrow('stale');
 const task=rec(w[3],381n),foreign=record(task.schema,new Map([...task.fields].map(([n,v])=>[n,n===2n?sid(1002,'foreign'):v])));
 expect(()=>evaluated(list(w.map((v,i)=>i===3?foreign:v)))).toThrow('foreign');
 const absent=new AuthoritativeState(stateA.entries().filter(e=>!(e.path.rootStateTypeId===373n&&e.path.fieldId===6n)));
 expect(named(named(items(evaluated(pa[3],absent),'list')[5],'assessment'),'reason')).toEqual(text('Absent'));
 const excluded=list(w.map((v,i)=>i===4?list(items(v,'list').filter(v=>key(items(v,'list')[1])!==key(referenceTarget))):v));
 expect(named(named(items(evaluated(excluded),'list')[5],'assessment'),'relation')).toEqual(text('SameDistance'));
 wrapper.close();expect(()=>evaluated(pa[3])).toThrow('lifecycle');
 await expect(createCharacterRun(await prepareCharacterModel(s),{...d,initialState:sa.state})).rejects.toThrow();
 const p=goalMeaningPath(C,true),value=stateA.read(p).value!;
 expect(()=>component.stateModel.applyPatch(stateA,{operations:[{kind:'set',path:p,expected:{presence:true,value},newValue:value}]},sid(1025,'authority/person-model'))).toThrow();
 console.info('M53 WITNESS same goals/history/body; SF selects15/32 -> MovingFarther, AgeOnly31/32 -> SameDistance. Actual recall/workspace/read/trace joined. Stale/foreign/absent/unselected/lifecycle/owner/initial controls PASS.');
},600000);
it('continuation: exact repeat through the new consumer',async()=>{
 const {s,d}=fixture(),a=await fresh();await advance(a,0,17);const checkpoint=a.save(),b=await restoreCharacterRun(s,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:checkpoint});same(a.snapshot(),b.snapshot());
 await advance(a,17,33);await advance(b,17,33);same(a.snapshot(),b.snapshot());bytes(a.save(),b.save());expect(named(assessment(latest(b)),'relation')).toEqual(text('MovingFarther'));
 console.info('M53 CONTINUATION repeat save17 and exact state/output/trace/save33 PASS.');
},600000);
it('controls: denied hidden positions and atomic appraisal rollback',async()=>{
 const {s,d}=fixture(),control=fixture('AgeOnly');for(const k of ['initialState','orderedInputs','runSeed'] as const)bytes(d[k],control.d[k]);
 const all=items(decode(d.orderedInputs),'list');
 function short(hidden:number){return {...d,orderedInputs:enc(list(all.flatMap(v=>{const a=items(v,'list'),at=signedValue(a[0]);if(at===17n)return [list([signed(4),...a.slice(1)])];if(at>3n)return [];if(at!==3n||key(a[2])!==key(POSITION_SOURCE))return [v];const p=items(a[3],'list'),pos=[...items(p[1],'list')];pos[0]=u(hidden);pos[4]=false;return [list([...a.slice(0,3),list([p[0],list(pos),p[2]]),a[4]])];})))};}
 const a=await createCharacterRun(await prepareCharacterModel(s),short(0)),b=await createCharacterRun(await prepareCharacterModel(s),short(7));await advance(a,0,4);await advance(b,0,4);
 expect(latest(a)).toEqual(latest(b));expect(named(assessment(latest(a)),'reason')).toEqual(text('MissingEvidence'));
 const rollback=await createCharacterRun(await prepareCharacterModel(s),short(0));await advance(rollback,0,3);const before=rollback.snapshot();let reached=false;const original=qualification.qualifyGoalOutcome;
 const spy=vi.spyOn(qualification,'qualifyGoalOutcome').mockImplementation(input=>{const out=original(input);if(input.goal==='position-goal'){reached=true;throw Error('M53 after spatial appraisal');}return out;});
 try{await expect(rollback.settleNextInstant()).rejects.toThrow('M53 after spatial appraisal');expect(reached).toBe(true);same(rollback.snapshot(),before);}finally{spy.mockRestore();}
 const declaration=items(decode(s.registry),'list')[37],arr=items(declaration,'list');
 expect(()=>compileGoalMeaning(list(arr.map((v,i)=>i===4?u(8):v)),Q.of(7n),SPATIAL_MEANING)).toThrow();
 expect(()=>compileGoalMeaning(list(arr.map((v,i)=>i===1?list([q(0,1),q(8,1)]):v)),Q.of(7n),SPATIAL_MEANING)).toThrow();
 await expect(compileCharacterModel({...s,rulesVersion:'rules/assembled-character/0.53-candidate',registrySchemaVersion:'assembled-character-registry/0.53-candidate'})).rejects.toThrow();
 const current=restoreAuthoritativeState(decode(a.snapshot().state)),entry=current.entries().find(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===6n)!,initial=restoreAuthoritativeState(decode(d.initialState));
 await expect(createCharacterRun(await prepareCharacterModel(s),{...short(0),initialState:enc(new AuthoritativeState([...initial.entries(),entry]).canonicalValue())})).rejects.toThrow('initial maintenance goal');
 const model=await compileCharacterModel(s),component=await compileCharacterState(model),without=new AuthoritativeState(current.entries().filter(e=>!(e.path.rootStateTypeId===373n&&e.path.fieldId===6n)));
 expect(()=>component.stateModel.applyPatch(without,{operations:[{kind:'set',path:entry.path,expected:{presence:false},newValue:entry.value}]},sid(1025,'authority/person-model'))).toThrow();
 await expect(createCharacterRun(await prepareCharacterModel(s),{...short(0),orderedInputs:enc(list([...items(decode(short(0).orderedInputs),'list'),list([signed(1),u(140),GOAL_ADOPT,list([text(SPATIAL_MEANING)]),list([])])]))})).rejects.toThrow();
 for(let n=0;b.snapshot().clock<101n;n++){expect(n).toBeLessThan(12);expect(await b.settleNextInstant()).toBe(true);}
 const end=restoreAuthoritativeState(decode(b.snapshot().state));for(const field of [5n,6n])expect(items(end.entries().find(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===field)!.value,'list')[7]).toEqual(text('Expired'));
 console.info('M53 CONTROLS exact paired input bytes; denied x0/x7 identical appraisal; missing stays missing; atomic rollback, domain/version, isolated goal injection/foreign owner/bootstrap rejection and both expirations101 PASS.');
},600000);
