/** M52: High vs Wide goal;14 body samples18..31 and visual32 -> recall33.
 * M51: one holder,3 physical tasks; body30/rate10/width1, seed0.
 * Four Before/Motion/Motion/After panels at1..16. Body Before/After only;
 * eight Actor motion observations, stationary trials1/2 and stroke3/4.
 * Fixed refill contrast and one deliberation17; no social task dependencies. */
import {it,expect,vi} from 'vitest';
import {list,text,unsigned as u,signed,rational as q,record,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {simInstant} from '../substrate/time';
import {embodiedRecord as r} from '../campaign3/embodiedCodecs';
import * as production from '../campaign3/attributionProduction';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel,SIGNIFICANCE_RULES,SIGNIFICANCE_REGISTRY,RETAINED_ATTRIBUTION_RULES,RETAINED_ATTRIBUTION_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {BODY_SAMPLE,BODY_DELIVERY} from '../assembled/body';
import {POSITION,POSITION_SOURCE,POSITION_AUTHORITY} from '../assembled/positionPerception';
import {POSITION_MEMORY,POSITION_EPISODE,EPISODE,isBodyEpisodePath,isPositionEpisodePath,MEMORY_RECALL,MEMORY_FORMATION,createEpisodicExtension,EPISODIC_OWNER} from '../assembled/memory';
import {RETAINED_ATTRIBUTION,ATTRIBUTION_VERSION,bindBodyContext,readBodyContext,deriveRetainedAttribution,validateAttributionCue} from '../assembled/retainedAttribution';
import {WORKSPACE,sharedWorkspace} from '../assembled/workspace';
import {GOAL_MEANING} from '../assembled/goalMeaning';
import {sid} from '../assembled/skill';
import {source as priorSource,data as priorData,decode,items,key,enc} from './fixtures/assembledWorkspaceDomain';
import {through,outputs,signedValue,type Run} from './fixtures/assembledComparison';
import {dataField as f,dataRecord as rec,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
type Options={goal?:'High'|'Wide';retained?:number;recalled?:number;workspace?:number;confounded?:boolean;hidden?:boolean;denied?:boolean;noAfter?:boolean};
function source(o:Options={}){const s=priorSource(o.workspace??20,o.goal??'High',true),a=[...items(decode(s.registry),'list')],b=[...items(a[6],'list')],ret=items(a[8],'list');b[2]=q(10,1);a[6]=list(b);a[8]=list([ret[0],ret[1],u(o.retained??16),ret[3]]);a[9]=list([items(a[9],'list')[0],u(o.recalled??16)]);return {...s,rulesVersion:SIGNIFICANCE_RULES,registrySchemaVersion:SIGNIFICANCE_REGISTRY,registry:enc(list([...a,list([text(POSITION),POSITION_AUTHORITY]),list([text(POSITION_MEMORY)]),list([text(RETAINED_ATTRIBUTION)]),list([text(SIGNIFICANCE)])]))};}
function data(o:Options={}){const d=priorData(true),initial=restoreAuthoritativeState(decode(d.initialState)),C=initial.entries().find(e=>e.path.rootStateTypeId===455n)!.path.selectors[0];if(C.kind!=='mapKey')throw Error('body key');const rows=items(decode(d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return key(a[2])!==key(BODY_SAMPLE)||[1,4,5,8,9,12,13,16].includes(Number(signedValue(a[0])));}),frames:CanonicalValue[]=[];
 for(let at=1;at<=16;at++){const phase=(at-1)%4,trial=Math.floor((at-1)/4),motion=phase===1||phase===2,position=motion?list([u(o.denied&&o.hidden&&at===3?7:phase===2&&trial>=2?1:0),u(0),u(1),true,!(o.denied&&at===3),u(1)]):list([]);frames.push(list([signed(at),u(10),POSITION_SOURCE,list([text(POSITION),position,list([u(1),text(phase===0?'Before':phase===3?'After':'Motion'),true,!(o.noAfter&&at===16)])]),list([])]));}
 const sample=items(rows.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 for(let at=18;at<=31;at++)rows.push(list([signed(at),...sample.slice(1)]));
 frames.push(list([signed(32),u(10),POSITION_SOURCE,list([text(POSITION),list([u(2),u(0),u(1),true,true,u(1)]),list([])]),list([])]));
 const deliveries=o.confounded?[[3,40],[7,40],[11,40],[15,40]]:[[4,30],[8,30],[11,40],[15,40]];
 return {...d,initialState:enc(new AuthoritativeState(initial.entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[o.hidden&&!o.denied?q(61,2):q(30,1),signed(0)])}:e)).canonicalValue()),orderedInputs:enc(list([...rows,...frames,...deliveries.map(([at,amount])=>list([signed(at),u(110),BODY_DELIVERY,list([C.key,q(amount,1)]),list([])]))]))};}
import {SIGNIFICANCE,SIGNIFICANCE_VERSION,named as field,qualifiedSignificance,creditSignificance,assertSignificanceUpdate,directions} from '../assembled/significance';
import * as significance from '../assembled/significance';
import {retainSignificanceFirst} from '../campaign3/significanceFirstRetention';
import type {SignificanceDirection} from '../campaign3/directionalSignificanceState';
import {prepareEpisodicRetention,retainedEpisodeIds} from '../assembled/retention';
import {RECALL,MEMORY_PRESENTATION} from '../assembled/memory';
function exactBytes(a:Uint8Array,b:Uint8Array){expect(a.length).toBe(b.length);expect(a.every((v,i)=>v===b[i])).toBe(true);}
function sameSnapshot(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){expect(a.clock).toBe(b.clock);expect(a.status).toBe(b.status);for(const k of ['state','outputs','trace'] as const)exactBytes(a[k],b[k]);}
const snapshots=new WeakMap<Run,Pick<ReturnType<Run['snapshot']>,'clock'|'state'|'outputs'>>();
const snap=(r:Run)=>{let s=snapshots.get(r);if(!s){const {clock,state,outputs}=r.snapshot();s={clock,state,outputs};snapshots.set(r,s);}return s;};
const state=(r:Run)=>restoreAuthoritativeState(decode(snap(r).state));
const reports=(r:Run,label:string)=>items(decode(snap(r).outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const report=(r:Run)=>reports(r,RETAINED_ATTRIBUTION).at(-1)!;
const result=(r:Run)=>field(report(r)[4],'result');
const ws=(r:Run)=>reports(r,WORKSPACE).at(-1)!;
const target=(r:Run)=>state(r).entries().find(e=>isPositionEpisodePath(e.path)&&signedValue(items(e.value,'list')[5])===15n);
async function advance(r:Run,from:number,to:number){snapshots.delete(r);for(let n=from+1;n<=to;n++)expect(await r.settleNextInstant()).toBe(true);expect(snap(r).clock).toBe(BigInt(to));}
async function freshRun(o:Options={},at=17){const a=await createCharacterRun(await prepareCharacterModel(source(o)),data(o));await advance(a,0,at);return a;}
let baseline:Promise<Run>|undefined;
const run=(o:Options={},at=17)=>Object.keys(o).length===0&&at===17?(baseline??=freshRun()):freshRun(o,at);
function live(r:Run){const a=report(r),m=reports(r,GOAL_MEANING).at(-1)!;expect(items(a[3],'list')).toHaveLength(4);for(const g of items(a[3],'list'))expect(field(g,'kind')).toEqual(text('Grouped'));expect(items(ws(r)[4],'list')).toHaveLength(16);expect(items(field(result(r),'consumed'),'list')).toHaveLength(16);expect(field(result(r),'disposition')).toEqual(text('Supported'));expect(field(field(m[5],'assessment'),'kind')).toEqual(text('Assessed'));expect(items(m[4],'list').map(v=>signedValue(items(items(v,'list')[1],'list')[5]))).toEqual([13n,16n]);expect(m[7]).toEqual(list(a));return m;}
function recalled(r:Run,acquisition:CanonicalValue){return reports(r,RECALL).some(p=>signedValue(p[1])===33n&&key(items(p[2],'list')[1])===key(acquisition));}
it('witness: actual goal attribution credit changes survival and later recall',async()=>{
 const a=await freshRun(),b=await freshRun({goal:'Wide'}),am=live(a),bm=live(b);expect(field(am[5],'kind')).toEqual(text('Qualifies'));expect(field(am[5],'direction')).toEqual(text('MovingCloser'));expect(field(bm[5],'kind')).toEqual(text('DoesNotQualify'));
 console.info('M52 live gate PASS: both arms Supported/Assessed, High qualifies and Wide does not.');
 const ae=target(a)!,be=target(b)!,acquisition=items(ae.value,'list')[1],other=items(be.value,'list')[1];expect(directions(items(ae.value,'list')[7])).toEqual(['MovingCloser']);expect(directions(items(be.value,'list')[7])).toEqual([]);expect(reports(a,SIGNIFICANCE)).toHaveLength(1);expect(reports(b,SIGNIFICANCE)).toHaveLength(0);
 const credit=qualifiedSignificance(list(ws(a)),list(report(a)),list(am));expect(credit).toHaveLength(1);const C=items((ae.path.selectors[0] as {key:CanonicalValue}).key,'list')[1],used=creditSignificance(ae.value,'MovingFarther',C,18n);expect(directions(items(used,'list')[7])).toEqual(['MovingCloser','MovingFarther']);expect(creditSignificance(used,'MovingCloser',C,19n)).toEqual(used);expect(()=>assertSignificanceUpdate(used,ae.value)).toThrow();
 expect(()=>qualifiedSignificance(list(ws(a)),list(report(a).map((v,i)=>i===1?signed(18):v)),list(am))).toThrow('current');expect(()=>qualifiedSignificance(list(ws(a)),list(report(a).map((v,i)=>i===4?list([list([text('kind'),text('NoConsequence')])]):v)),list(am))).toThrow('join');
 await advance(a,17,33);console.info('M52 High pressure settled33.');await advance(b,17,33);expect(target(a)).toBeDefined();expect(target(b)).toBeUndefined();expect(recalled(a,acquisition)).toBe(true);expect(recalled(b,other)).toBe(false);expect(state(a).entries().filter(e=>isBodyEpisodePath(e.path)||isPositionEpisodePath(e.path))).toHaveLength(16);expect(state(b).entries().filter(e=>isBodyEpisodePath(e.path)||isPositionEpisodePath(e.path))).toHaveLength(16);
 console.info('M52 WITNESS live4groups/16consumed; focal body13/16. High MovingCloser -> focal end15 significant, survives14body+1visual pressure and actual recall33. Wide SameDistance -> no credit, end15 lost and absent recall33. Same laws/quotas/seed; no choice claim.');
},600000);
it('epistemic: hidden body truth and unsupported attribution controls',async()=>{
 const a=await run(),hidden=await run({hidden:true}),confounded=await run({confounded:true});live(a);live(hidden);expect(report(hidden)).toEqual(report(a));expect(reports(hidden,GOAL_MEANING)).toEqual(reports(a,GOAL_MEANING));expect(reports(hidden,SIGNIFICANCE)).toEqual(reports(a,SIGNIFICANCE));expect(target(hidden)!.value).toEqual(target(a)!.value);expect(field(result(confounded),'disposition')).toEqual(text('Unavailable'));expect(reports(confounded,SIGNIFICANCE)).toHaveLength(0);expect(directions(items(target(confounded)!.value,'list')[7])).toEqual([]);expect(field(reports(confounded,GOAL_MEANING).at(-1)![5],'kind')).toEqual(text('Qualifies'));
 console.info('M52 EPISTEMIC reserve30/30.5 exact evidence-derived meaning/attribution/credit. Confounded attribution with qualifying goal produces no significance.');
},600000);
it('rollback: significance preparation is atomic',async()=>{
 const a=await run({},16),before=a.snapshot();let reached=false;const original=significance.creditSignificance,spy=vi.spyOn(significance,'creditSignificance').mockImplementation((...args)=>{const r=original(...args);reached=true;throw Error('M52 after significance preparation');return r;});
 try{await expect(a.settleNextInstant()).rejects.toThrow('M52 after significance preparation');expect(reached).toBe(true);sameSnapshot({...a.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 console.info('M52 ROLLBACK after significance preparation rolls back whole17.');
},600000);
it('continuation: exact save17 restore through pressure',async()=>{
 const d=data(),b=await freshRun(),save=b.save(),restored=await restoreCharacterRun(source(),{initialState:d.initialState,orderedInputs:d.orderedInputs,save});sameSnapshot(restored.snapshot(),b.snapshot());await advance(b,17,33);await advance(restored,17,33);sameSnapshot(restored.snapshot(),b.snapshot());exactBytes(restored.save(),b.save());
 console.info('M52 PERSISTENCE save17 restore through33 byte-exact including significance, retention, recall, allocator and trace.');
},600000);
it('boundaries: old versions owner and fresh credit; PRIOR retention tiers',async()=>{
 const a=await run(),s=source(),m=await compileCharacterModel(s),c=await compileCharacterState(m),entry=target(a)!,e=items(entry.value,'list'),C=items((entry.path.selectors[0] as {key:CanonicalValue}).key,'list')[1];
 const old={...s,rulesVersion:RETAINED_ATTRIBUTION_RULES,registrySchemaVersion:RETAINED_ATTRIBUTION_REGISTRY,registry:enc(list(items(decode(s.registry),'list').slice(0,36)))};expect(()=>(c.stateModel.applyPatch(state(a),{operations:[{kind:'set',path:entry.path,expected:{presence:true,value:entry.value},newValue:entry.value}]},sid(1025,'authority/person-model')))).toThrow();const oldState=(await compileCharacterState(await compileCharacterModel(old))).stateModel;expect(()=>oldState.validateState(state(a))).toThrow();
 const absent=new AuthoritativeState(state(a).entries().filter(x=>key(x.value)!==key(entry.value)));expect(()=>c.stateModel.applyPatch(absent,{operations:[{kind:'set',path:entry.path,expected:{presence:false},newValue:entry.value}]},EPISODIC_OWNER)).toThrow('fresh');
 const extension=createEpisodicExtension(C,m.body!,c.stateModel,list([]),list([]),1n,m.retrieval,true,true,m.affectMemory,undefined,m.encoding,m.memoryUse,true,true,true,true);expect(()=>extension.qualifySignificance({dueAt:simInstant(17n),phase:50n,eventTypeId:sid(1001,'event/task-appraisal')} as never,list(ws(a)),list(report(a)),list(reports(a,GOAL_MEANING).at(-1)!))).toThrow('lifecycle');
 extension.begin(17n);expect(()=>extension.qualifySignificance({dueAt:simInstant(17n),phase:50n,eventTypeId:sid(1001,'event/task-appraisal')} as never,list(ws(a)),list(report(a)),list(reports(a,GOAL_MEANING).at(-1)!))).toThrow('exact recalled target');extension.close();
 const foreignTask=rec(ws(a)[3],381n),foreignWorkspace=list(ws(a).map((v,i)=>i===3?record(foreignTask.schema,new Map([...foreignTask.fields].map(([n,v])=>[n,n===2n?sid(1002,'foreign'):v]))):v)),meaning=reports(a,GOAL_MEANING).at(-1)!;
 expect(()=>qualifiedSignificance(foreignWorkspace,list(report(a)),list(meaning.map((v,i)=>i===3?foreignWorkspace:v)))).toThrow('holder');
 const narrow=list(ws(a).map((v,i)=>i===4?list(items(v,'list').filter(slot=>key(items(items(slot,'list')[1],'list')[1])!==key(e[1]))):v));expect(()=>qualifiedSignificance(narrow,list(report(a)),list(meaning.map((v,i)=>i===3?narrow:v)))).toThrow('selected target');
 const d=data(),initial=restoreAuthoritativeState(decode(d.initialState));await expect(createCharacterRun(await prepareCharacterModel(s),{...d,initialState:enc(new AuthoritativeState([...initial.entries(),entry]).canonicalValue())})).rejects.toThrow();
 await expect(createCharacterRun(await prepareCharacterModel(s),{...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),list([signed(17),u(140),MEMORY_PRESENTATION,list([text(SIGNIFICANCE),entry.value]),list([])])]))})).rejects.toThrow();
 const rows=[{acquisition:1n,acquiredAt:1n,kind:'body' as const,significant:true},{acquisition:2n,acquiredAt:2n,kind:'body' as const,useProtection:true},{acquisition:3n,acquiredAt:3n,kind:'body' as const}];expect(retainedEpisodeIds(rows,4n,{diagnostic:0,body:1},'SignificanceFirst')).toEqual([1n]);expect(retainedEpisodeIds(rows,4n,{diagnostic:0,body:1},'AgeOnly')).toEqual([3n]);expect(()=>retainedEpisodeIds(rows,1n,{diagnostic:0,body:1},'SignificanceFirst')).toThrow();expect(()=>creditSignificance(entry.value,'MovingCloser',C,15n)).toThrow('prior');expect(()=>directions(list([text('MovingFarther'),text('MovingCloser')]))).toThrow();
 // Detached coordinator control using actual native records; candidate credit must not
 // enter PRIOR priority. A capacity2 unit control retains the two already-used bodies.
 const empty=list([...e.slice(0,7),list([])]),B0=new AuthoritativeState(state(a).entries().map(x=>key(x.value)===key(entry.value)?{...x,value:empty}:x));
 await advance(a,17,18);const fresh=state(a).entries().find(x=>isBodyEpisodePath(x.path)&&signedValue(items(x.value,'list')[5])===18n)!;
 const formation={eventId:90001n,eventSequence:90001n,dueAt:simInstant(18n),phase:140n,eventTypeId:MEMORY_FORMATION,payload:fresh.value,dependencies:list([]),causalParentEventIds:[]},presentation={...formation,eventId:90002n,eventSequence:90002n,eventTypeId:MEMORY_PRESENTATION,payload:list([text(SIGNIFICANCE),empty])},next=creditSignificance(empty,'MovingCloser',C,18n);
 const retention=prepareEpisodicRetention([formation,presentation],B0,C,{diagnostic:0,body:2,recallDelay:1n},c.stateModel,list([]),list([]),'SignificanceFirst',()=>next,true)!;
 const candidate=new AuthoritativeState([...B0.entries().map(x=>key(x.value)===key(empty)?{...x,value:next}:x),fresh]),settled=retention.finish(candidate);
 expect(settled.entries().filter(x=>isPositionEpisodePath(x.path)).some(x=>key(items(x.value,'list')[1])===key(e[1]))).toBe(false);
 const priority=items(items(retention.audit,'list')[7],'list').map(v=>items(v,'list')).find(r=>key(r[0])===key(u(uint(id(e[1]).payload))))!;expect(priority).toEqual([u(uint(id(e[1]).payload)),false,false]);expect(directions(items(next,'list')[7])).toEqual(['MovingCloser']);

 console.info('M52 BOUNDARIES wrong owner/old version/fresh credit/stale lifecycle rejected; significance > use > unprotected, AgeOnly retained; immutable canonical direction set.');
},600000);

it('calibration: all directional and use combinations match original retention tiers',()=>{
 let count=0;const tags:SignificanceDirection[][]=[[],['MovingCloser'],['MovingFarther'],['MovingCloser','MovingFarther']];
 for(const da of tags)for(const db of tags)for(const ua of [false,true])for(const ub of [false,true])for(const equalAge of [false,true])for(const capacity of [0,1,2]){
  const rows=[{acquisition:812n,acquiredAt:1n,kind:'body' as const,useProtection:ua,significant:da.length>0},{acquisition:900n,acquiredAt:equalAge?1n:2n,kind:'body' as const,useProtection:ub,significant:db.length>0}];
  const original=rows.map((a,i)=>({id:a.acquisition,acquiredAt:a.acquiredAt,kind:'EventContinuant' as const,units:[{key:'episode',views:[new Uint8Array([42])],useProtection:a.useProtection,outcomeSignificanceDirections:i?db:da}]}));
  expect(retainedEpisodeIds(rows,3n,{diagnostic:0,body:capacity},'SignificanceFirst')).toEqual(retainSignificanceFirst(original,3n,{EventContinuant:capacity,Interoceptive:0}).acquisitions.map(a=>a.id));count++;
 }
 console.info('M52 CALIBRATION '+count+' exact original-comparator matches; both directions/cardinality and extra use confer no significance-tier bonus. Existing assembled quota partition preserved.');
});

it('ordinary: existing goal meaning remains live without focal attribution',async()=>{
 const prior=await import('./fixtures/assembledGoalMeaning'),s=prior.source(),a=[...items(decode(s.registry),'list')],source={...s,rulesVersion:SIGNIFICANCE_RULES,registrySchemaVersion:SIGNIFICANCE_REGISTRY,registry:enc(list([...a,list([text(POSITION),POSITION_AUTHORITY]),list([text(POSITION_MEMORY)]),list([text(RETAINED_ATTRIBUTION)]),list([text(SIGNIFICANCE)])]))};
 const r=await createCharacterRun(await prepareCharacterModel(source),prior.data());await through(r,5n);
 const m=reports(r,GOAL_MEANING).at(-1)!;expect(field(m[5],'kind')).toEqual(text('Qualifies'));expect(field(m[5],'direction')).toEqual(text('MovingCloser'));expect(items(m[4],'list')).toHaveLength(2);expect(field(report(r)[4],'kind')).toEqual(text('NoConsequence'));expect(reports(r,SIGNIFICANCE)).toHaveLength(0);
 const traced=outputs(r.snapshot().trace,160n).filter(t=>txt(f(t,6n))===SIGNIFICANCE_VERSION&&txt(id(f(rec(f(t,4n),130n),5n)).payload)==='event/task-appraisal');expect(traced.length).toBeGreaterThan(0);for(const t of traced){const input=items(f(t,12n),'list'),output=items(items(f(t,13n),'list')[0],'list');expect(input).toHaveLength(3);expect(input[2]).toEqual(output[7]);}
 console.info('M52 ORDINARY original two-body goal assessment still Qualifies/MovingCloser under0.53 without a focal attribution; no significance invented.');
},600000);
