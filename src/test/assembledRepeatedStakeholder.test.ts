import {it,expect,vi} from 'vitest';
import {fixture,taskB,create,decode,items,key,enc,list,text,signed,u,q,rec,f,uint,outputs,bytes,through,finish,type Run,type CanonicalValue} from './fixtures/assembledRepeatedStakeholder';
import {fixture as originalFixture} from './fixtures/assembledRepeatedInterference';
import {compileCharacterModel} from '../assembled/model';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {SK,SK_OBS,SK_LEARN,SK_PROBE,stakeholderPath,stakeholderJournal,stakeholderBeliefs,stakeholderKnowledgeView} from '../assembled/stakeholderKnowledge';
import {INTERFERENCE_APPRAISAL,interferencePath,interferenceJournal,interferenceObservation,routeExpectation,type Episode} from '../assembled/interferenceExpectation';
import {OBSTRUCTION_SOURCE,OBSTRUCTION_RESULT} from '../assembled/externalObstruction';
import {ACTION_BODY} from '../assembled/actionBody';
import {SKILL_ACTUAL} from '../assembled/skill';
import {PERFORMANCE_OBS,outcomePath} from '../assembled/performance';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {signedValue} from './fixtures/assembledComparison';
import {foldAgencyEvidence,admitAgencyEvidence,projectAttempt,projectReports,type Observation} from '../campaign3/agencyInterferenceSource';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
const all=(r:Run)=>items(decode(r.snapshot().outputs),'list');
const labelled=(r:Run,t:string)=>all(r).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(t))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
async function setup(b=fixture(),at=10n){return {...await create(b,at),m:await compileCharacterModel(b.s)};}
type Setup=Awaited<ReturnType<typeof setup>>;
const own=(a:Setup,i:number)=>stakeholderJournal(state(a.run).read(stakeholderPath(a.m.socialWitness!.observers[i])).value,a.m.socialWitness!.observers[i],EXTENDED_TIME_LIMIT);
const view=(a:Setup,i:number)=>stakeholderKnowledgeView(all(a.run),a.m.socialWitness!,i);
const journal=(a:Setup)=>interferenceJournal(state(a.run).read(interferencePath(taskB)).value,taskB,EXTENDED_TIME_LIMIT,a.b.people);
function appraisal(a:Setup,at:bigint,mean:CanonicalValue,count:number){
 const rows=labelled(a.run,INTERFERENCE_APPRAISAL).filter(r=>uint(r[1])===at);expect(rows).toHaveLength(1);const row=rows[0];
 expect(row[2]).toEqual(taskB);expect(row[5]).toEqual(u(count));expect(row[6]).toEqual(mean);expect(row[7]).toEqual(count?list([mean,mean]):list([]));
 const trace=outputs(a.run.snapshot().trace,160n).find(t=>eq(f(t,13n),list(row)))!;expect(trace).toBeDefined();expect(items(f(trace,11n),'list')).toHaveLength(1);expect(uint(f(rec(f(trace,4n),130n),3n))).toBe(50n);return row;
}
function live(a:Setup,at:bigint){
 const os=a.run.snapshot().outputs,d=outputs(os,409n).find(v=>signedValue(f(v,2n))===at)!;expect(d).toBeDefined();const status=rec(f(d,4n),419n);expect(uint(f(status,1n))).toBe(3n);
 const intent=outputs(os,425n).find(v=>eq(f(v,2n),d))!,expression=outputs(os,426n).find(v=>eq(f(v,2n),intent))!;expect(intent).toBeDefined();expect(expression).toBeDefined();
 const execution=outputs(os,433n).find(v=>eq(f(rec(f(rec(f(v,2n),432n),2n),431n),2n),intent))!;expect(execution).toBeDefined();
 const effect=labelled(a.run,ACTION_BODY).find(r=>eq(r[1],f(execution,1n)))!;expect(effect).toBeDefined();expect(effect[5]).toEqual(text('Blocked'));
 const skill=labelled(a.run,SKILL_ACTUAL).find(r=>eq(r[2],effect[1]))!;expect(skill).toBeDefined();expect(skill[6]).toBe(true);expect(skill[7]).toBe(true);
 const obs=labelled(a.run,PERFORMANCE_OBS).filter(r=>uint(r[2])===at&&eq(r[3],taskB));expect(obs).toHaveLength(1);expect(obs[0][4]).toEqual(u(1));expect(obs[0][5]).toEqual(effect[3]);expect(obs[0][6]).toBe(false);expect(obs[0][7]).toBe(true);
 const trace=outputs(a.run.snapshot().trace,160n).find(t=>eq(f(t,13n),d))!;expect(trace).toBeDefined();const draws=f(trace,14n);
 if(at===10n)expect(items(draws,'list').length).toBeGreaterThan(0);else{expect(items(draws,'list')).toHaveLength(0);const choice=rec(f(status,2n),420n);expect(f(choice,8n)).toEqual(u(1));const ps=items(f(choice,2n),'list');expect(ps).toHaveLength(1);expect(f(rec(ps[0],421n),2n)).toEqual(q(1,1));}
 return {d,intent,expression,execution,draws,observation:list(obs[0])};
}
function snapshot(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function exact(a:Run,b:Run){snapshot(a.snapshot(),b.snapshot());bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
function unaffected(a:Setup,b:Setup){
 const path=stakeholderPath(a.m.socialWitness!.observers[0]),without=(r:Run)=>new AuthoritativeState(state(r).entries().filter(e=>!(e.path.rootStateTypeId===path.rootStateTypeId&&e.path.fieldId===path.fieldId&&eq((e.path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key,(path.selectors[0] as {kind:'mapKey';key:CanonicalValue}).key)))).canonicalValue();
 bytes(enc(without(a.run)),enc(without(b.run)));expect(view(a,1)).toEqual(view(b,1));expect(own(a,1)).toEqual(own(b,1));bytes(a.run.decisionHistory(),b.run.decisionHistory());bytes(a.run.decisionPresentation(),b.run.decisionPresentation());
}
function originalProjection(a:Setup,report:boolean){
 for(let i=0;i<2;i++){const who=i===0?'A':'B',o=a.m.socialWitness!.observers[i],native:Observation[]=own(a,i).map(v=>{const r=items(v,'list'),episode=uint(r[4])===10n?1:2,common={observer:who,episode:who+'/visible-episode/'+episode} as const;
 if(uint(r[5])===0n)return {...common,kind:'outcome',success:r[7]===true};
 if(uint(r[5])===2n)return {...common,kind:'report',source:who+'/visible-receipt/'+uint(r[6]),positive:r[7]===true};
 const actor=items(r[8],'list')[0];expect(actor).toEqual(o.actors![0].local);return {...common,kind:'obstruction',actor:who+'/identified/blocker-a',source:common.episode+'/visible-block'};
 });
 const first=projectAttempt({attempt:1,frozenIntent:'deliver',competent:true,blocker:'blocker-a',access:{A:{outcome:true,obstruction:true},B:{outcome:true,obstruction:false}}}).views[who];
 const second=projectAttempt({attempt:2,frozenIntent:'deliver',competent:true,blocker:'blocker-a',access:{A:{outcome:true,obstruction:true},B:{outcome:true,obstruction:false}}}).views[who];
 const claims=projectReports(report?[{receipt:1,attempt:1,positive:false,recipients:['A']}]:[])[who];expect(native).toEqual([...first,...claims,...second]);
 const evidence=admitAgencyEvidence(who,native),groups=foldAgencyEvidence(evidence,'GroupedMean');
 expect(stakeholderBeliefs(own(a,i))).toEqual(list([...groups].map(([e,g])=>list([u(e.endsWith('/1')?10:12),u(g.numerator),u(g.denominator)]))));
 if(i===0&&report)expect(foldAgencyEvidence(evidence,'LastClaim').get('A/visible-episode/1')!.numerator).toBe(0);
 expect(foldAgencyEvidence(admitAgencyEvidence(who,native,true),'GroupedMean').size).toBe(0);
 }
}
it('M199 admission allows disjoint reports and rejects actual main witness conflicts',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s);await expect(createCharacterRun(m,b.d)).resolves.toBeDefined();
 const rows=items(decode(b.d.orderedInputs),'list'),source=rows.find(v=>eq(items(v,'list')[0],signed(11))&&eq(items(v,'list')[2],OBSTRUCTION_SOURCE))!;
 const a=[...items(source,'list')],p=[...items(a[3],'list')];p[2]=list([b.people[0]]);p[3]=list([taskB]);p[7]=list([list([]),list([])]);a[3]=list(p);
 await expect(createCharacterRun(m,{...b.d,orderedInputs:enc(list(rows.map(v=>v===source?list(a):v)))})).rejects.toThrow('competing causal report');
 const original=originalFixture(),oldRows=items(decode(original.d.orderedInputs),'list'),oldSource=oldRows.find(v=>eq(items(v,'list')[2],OBSTRUCTION_SOURCE))!,extra=[...items(oldSource,'list')];extra[0]=signed(11);
 await expect(createCharacterRun(await prepareCharacterModel(original.s),{...original.d,orderedInputs:enc(list([...oldRows,list(extra)]))})).rejects.toThrow('competing causal report');
 const oldSlots=items(decode(original.s.registry),'list'),newSlots=items(decode(b.s.registry),'list');expect(oldSlots).toHaveLength(55);expect(newSlots).toHaveLength(55);for(let i=0;i<55;i++)if(i!==50)expect(newSlots[i]).toEqual(oldSlots[i]);
 bytes(original.d.initialState,b.d.initialState);bytes(original.d.runSeed,b.d.runSeed);
 const notWorld=(v:CanonicalValue)=>!eq(items(v,'list')[2],OBSTRUCTION_SOURCE);
 expect(rows.filter(notWorld)).toEqual(oldRows.filter(notWorld));
 console.info('M199 ADMISSION PASS disjoint main/passive reports11/15 accepted; genuine same-instant witness/report and historical gate reject; unchanged original sources,55-slot prefix,seed,S0.');
},570000);
it('M199 repeated execution and later nonrecipient evidence transfer to current candidate',async()=>{
 const a=await setup(),b=await setup(fixture({report:false})),c=await setup(fixture({secondSeen:false}));
 const first=live(a,10n);expect(live(b,10n)).toEqual(first);expect(live(c,10n)).toEqual(first);for(const x of[a,b,c])appraisal(x,10n,list([]),0);
 for(const x of[a,b,c])await through(x.run,12n);
 const second=live(a,12n);expect(live(b,12n)).toEqual(second);expect(live(c,12n)).toEqual(second);
 for(const x of[a,b,c])appraisal(x,12n,q(1,2),1);
 const bLater=own(a,1).map(v=>items(v,'list'));expect(bLater).toHaveLength(2);expect(bLater.map(r=>uint(r[4]))).toEqual([10n,12n]);expect(bLater.map(r=>r[7])).toEqual([false,false]);expect(stakeholderBeliefs(own(a,1))).toEqual(list([]));unaffected(a,b);
 expect(stakeholderBeliefs(own(a,0))).toEqual(list([list([u(10),u(1),u(2)]),list([u(12),u(1),u(1)])]));expect(stakeholderBeliefs(own(b,0))).toEqual(list([list([u(10),u(1),u(1)]),list([u(12),u(1),u(1)])]));expect(view(a,0)).not.toEqual(view(b,0));
 originalProjection(a,true);originalProjection(b,false);
 for(const x of[a,b,c])await through(x.run,14n);
 appraisal(a,14n,q(3,4),2);appraisal(b,14n,q(3,4),2);appraisal(c,14n,q(1,2),1);
 const history=journal(a);expect(history).toHaveLength(3);expect(history.map(v=>interferenceObservation(v,taskB,EXTENDED_TIME_LIMIT,a.b.people).ticket)).toEqual([10n,10n,12n]);
 const groups=new Map<string,Episode>();for(const row of history){const v=interferenceObservation(row,taskB,EXTENDED_TIME_LIMIT,a.b.people);expect(v.outcome).toBeDefined();const k=key(v.outcome!),e=groups.get(k)??{context:String(v.route),support:[]};groups.set(k,{...e,support:[...e.support,{source:String(v.receipt),positive:v.positive}]});}
 const episodes=[...groups.values()],mean=routeExpectation(episodes,'1',1).estimate!,latest=routeExpectation(episodes,'1',1,'LatestEpisode').estimate!;
 expect(q(mean.numerator,mean.denominator)).toEqual(q(3,4));expect(q(latest.numerator,latest.denominator)).toEqual(q(1,1));for(const law of['EpisodeOnly','NoLearning'] as const)expect(routeExpectation(episodes,'1',1,law).estimate).toBeUndefined();
 const retained=own(a,0);for(const x of[a,b,c])await through(x.run,16n);expect(own(a,0)).toEqual(retained);appraisal(a,16n,q(3,4),2);appraisal(c,16n,q(1,2),1);
 for(let n=0;;n++){expect(n).toBeLessThan(32);unaffected(a,b);const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);if(!more)break;}
 await finish(c.run);for(const x of[a,b,c]){expect(x.run.snapshot().clock).toBe(101n);for(const p of[first,second]){expect(outputs(x.run.snapshot().outputs,425n)).toContainEqual(p.intent);expect(outputs(x.run.snapshot().outputs,426n)).toContainEqual(p.expression);}expect(items(items(state(x.run).read(outcomePath(taskB)).value!,'list')[1],'list')).toEqual([first.observation,second.observation]);}
 console.info('M199 CONNECTION PASS real competent attempts10/12; nonempty matched first draws, Auto retry; main prior1/2 ->3/4 versus1/2, passive episodes remain separate. A-only report changes A, never B later outcome12 or any non-A state/history through101. Original agency projectors/folds agree, meaningful alternatives differ.');
},570000);
it('M199 hidden repeated blockers preserve all cognition and passive outcomes',async()=>{
 const a=await setup(fixture({private:true,blocker:1})),b=await setup(fixture({private:true,blocker:2}));expect(live(a,10n)).toEqual(live(b,10n));
 const safe=(r:Run)=>list(all(r).filter(v=>!(typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(OBSTRUCTION_RESULT)))));
 for(let n=0;;n++){expect(n).toBeLessThan(32);bytes(a.run.snapshot().state,b.run.snapshot().state);expect(safe(a.run)).toEqual(safe(b.run));bytes(a.run.decisionHistory(),b.run.decisionHistory());expect(journal(a)).toHaveLength(0);expect(journal(b)).toHaveLength(0);for(let i=0;i<2;i++){expect(view(a,i)).toEqual(view(b,i));expect(stakeholderBeliefs(own(a,i))).toEqual(list([]));}const more=await a.run.settleNextInstant();expect(await b.run.settleNextInstant()).toBe(more);if(!more)break;}
 expect(live(a,12n)).toEqual(live(b,12n));for(const x of[a,b]){for(const at of[10n,12n,14n,16n])appraisal(x,at,list([]),0);expect(own(x,1).map(v=>uint(items(v,'list')[4]))).toEqual([10n,12n]);expect(x.run.snapshot().clock).toBe(101n);}
 console.info('M199 PRIVACY PASS two actual failures with private blocker1/2; denied main/passive cause and claim produce identical all state/safe outputs/history, two own outcomes, no causal belief, full101.');
},570000);
it('M199 repeated knowledge exact continuation and reached second learning rollback',async()=>{
 const b=fixture(),a=await create(b,11n),repeat=await create(b,11n);exact(a.run,repeat.run);const saved=a.run.save(),before=a.run.snapshot(),original=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=original(v);if(eq(v.event.eventTypeId,SK_LEARN)&&v.event.dueAt===12n){reached=true;throw Error('M199 second passive140');}return row;});
 try{await expect(a.run.settleNextInstant()).rejects.toThrow('M199 second passive140');expect(reached).toBe(true);snapshot({...a.run.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await through(repeat.run,12n);await through(recovered,12n);exact(repeat.run,recovered);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:repeat.run.save()});exact(repeat.run,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await repeat.run.settleNextInstant();for(const r of[recovered,restored]){expect(await r.settleNextInstant()).toBe(more);exact(repeat.run,r);}if(!more)break;}
 expect(repeat.run.snapshot().clock).toBe(101n);console.info('M199 CONTINUATION PASS independent repeat11, reached12 passive140 rollback, save11 recovery/save12 and every later complete byte through101 preserve both causal histories.');
},570000);
