import {it,expect,vi} from 'vitest';
import {fixture,create,capture,decode,items,key,enc,list,text,u,rec,f,uint,outputs,bytes,through,finish,C,sid,type Run,type CanonicalValue} from './fixtures/assembledStakeholderKnowledge';
import {compileCharacterModel,STAKEHOLDER_RULES,STAKEHOLDER_REGISTRY} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {SK,SK_OBS,SK_PROBE,SK_LEARN,SK_EVIDENCE,SK_REPORT,stakeholderPath,stakeholderJournal,stakeholderBeliefs,stakeholderKnowledgeView,createStakeholderKnowledge} from '../assembled/stakeholderKnowledge';
import {OBSTRUCTION_SOURCE,obstructionSource} from '../assembled/externalObstruction';
import {KNOWLEDGE_OWNER} from '../assembled/strategy';
import {ACTION_BODY} from '../assembled/actionBody';
import {EXTENDED_TIME_LIMIT} from '../assembled/timeDomain';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {foldAgencyEvidence,admitAgencyEvidence,type Observation} from '../campaign3/agencyInterferenceSource';
import * as traceModule from '../substrate/trace';
const eq=(a:CanonicalValue,b:CanonicalValue)=>key(a)===key(b);
type Setup=Awaited<ReturnType<typeof setup>>;
async function setup(b=fixture(),at=10n){const m=await compileCharacterModel(b.s);return {...await create(b,at),m};}
const all=(r:Run)=>items(decode(r.snapshot().outputs),'list');
const labelled=(r:Run,t:string)=>all(r).filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&eq(v.items[0],text(t))).map(v=>items(v,'list'));
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const journal=(a:Setup,i:number)=>stakeholderJournal(state(a.run).read(stakeholderPath(a.m.socialWitness!.observers[i])).value,a.m.socialWitness!.observers[i],EXTENDED_TIME_LIMIT);
const belief=(a:Setup,i:number)=>stakeholderBeliefs(journal(a,i));
const mean=(n:number,d:number)=>list([list([u(10),u(n),u(d)])]);
const view=(a:Setup,i:number)=>stakeholderKnowledgeView(all(a.run),a.m.socialWitness!,i);
function snapshot(a:ReturnType<Run['snapshot']>,b:ReturnType<Run['snapshot']>){const {state:as,outputs:ao,trace:at,...am}=a,{state:bs,outputs:bo,trace:bt,...bm}=b;expect(am).toEqual(bm);bytes(as,bs);bytes(ao,bo);bytes(at,bt);}
function exact(a:Run,b:Run){snapshot(a.snapshot(),b.snapshot());bytes(a.save(),b.save());bytes(a.runIdentity(),b.runIdentity());bytes(a.decisionHistory(),b.decisionHistory());bytes(a.decisionPresentation(),b.decisionPresentation());}
function live(a:Setup){const p=capture(a.run);expect(p.execution).toBeDefined();expect(p.transcript.length).toBeGreaterThan(0);const effect=labelled(a.run,ACTION_BODY).find(v=>eq(v[1],f(rec(p.execution!,433n),1n)))!;expect(effect).toBeDefined();expect(effect[5]).toEqual(text('Blocked'));return p;}
function kernel(a:Setup,i:number){const o=a.m.socialWitness!.observers[i],who=i===0?'A':'B';const obs:Observation[]=journal(a,i).map(v=>{const r=items(v,'list'),base={observer:who,episode:'own/'+uint(r[4])} as const;return uint(r[5])===0n?{...base,kind:'outcome',success:r[7]===true}:uint(r[5])===1n?{...base,kind:'obstruction',actor:key(items(r[8],'list')[0]),source:'direct/'+uint(r[4])}:{...base,kind:'report',source:'receipt/'+uint(r[6]),positive:r[7]===true};});
 const evidence=admitAgencyEvidence(who,obs),groups=foldAgencyEvidence(evidence,'GroupedMean');
 expect(list([...groups].map(([e,g])=>list([u(BigInt(e.slice(4))),u(g.numerator),u(g.denominator)])))).toEqual(belief(a,i));expect(foldAgencyEvidence(admitAgencyEvidence(who,obs,true),'GroupedMean').size).toBe(0);return foldAgencyEvidence(evidence,'LastClaim');
}
it('M198 correction connects actual own observations to later causal knowledge',async()=>{
 const a=await setup();live(a);expect(belief(a,0)).toEqual(mean(1,1));expect(belief(a,1)).toEqual(list([]));expect(journal(a,0)).toHaveLength(2);expect(journal(a,1)).toHaveLength(1);
 for(const p of labelled(a.run,SK_PROBE))expect(p[4]).toEqual(list([]));
 await through(a.run,11n);expect(belief(a,0)).toEqual(mean(1,2));expect(belief(a,1)).toEqual(mean(0,1));
 const bprobe=labelled(a.run,SK_PROBE).find(p=>uint(p[3])===11n&&eq(p[1],a.m.socialWitness!.observers[1].holder))!;expect(bprobe[4]).toEqual(list([]));
 await through(a.run,12n);expect(belief(a,1)).toEqual(mean(1,2));const saved=journal(a,1);
 await through(a.run,13n);expect(journal(a,1)).toEqual(saved);expect(belief(a,0)).toEqual(mean(1,2));expect(belief(a,1)).toEqual(mean(1,2));
 expect(kernel(a,0).get('own/10')!.numerator).toBe(0);expect(kernel(a,1).get('own/10')!.numerator).toBe(1);
 await through(a.run,14n);for(const p of labelled(a.run,SK_PROBE).filter(p=>uint(p[3])===14n))expect(p[4]).toEqual(mean(1,2));
 const learned=outputs(a.run.snapshot().trace,160n).filter(t=>eq(f(rec(f(t,4n),130n),5n),SK_LEARN));expect(learned.length).toBeGreaterThan(0);for(const t of learned)expect(uint(f(rec(f(t,4n),130n),3n))).toBe(140n);
 await finish(a.run);expect(a.run.snapshot().clock).toBe(101n);console.info('M198 CONNECTION PASS actual blocked execution -> local cause A1/BUnknown -> received false A1/2/B0 -> correction B1/2; duplicate no weight; query40 prior-only; original GroupedMean agrees, LastClaim/OutcomeOnly differ; full101.');
},570000);
it('M198 visibility and nonrecipient comparisons preserve own knowledge',async()=>{
 const a=await setup(fixture({mode:'aOnly'})),b=await setup(fixture({mode:'empty',blocker:2}));const pa=live(a),pb=live(b);
 for(const k of ['d','intent','expression','execution','transcript'] as const)expect(pa[k]).toEqual(pb[k]);
 expect(view(a,1)).toEqual(view(b,1));expect(view(a,0)).not.toEqual(view(b,0)); // permitted local blocker differs
 await through(a.run,14n);await through(b.run,14n);expect(view(a,1)).toEqual(view(b,1));expect(belief(a,1)).toEqual(list([]));expect(belief(a,0)).toEqual(mean(1,2));expect(belief(b,0)).toEqual(mean(1,1));
 await finish(a.run);await finish(b.run);expect(view(a,1)).toEqual(view(b,1));expect(a.run.snapshot().clock).toBe(101n);
 for(const causes of [[false,true],[true,true],[false,false]] as [boolean,boolean][]){const c=await setup(fixture({mode:'empty',causes,access:causes[0]||causes[1]?[true,true]:[false,false]}));live(c);for(let i=0;i<2;i++){expect(belief(c,i)).toEqual(causes[i]?mean(1,1):list([]));kernel(c,i);}await finish(c.run);expect(c.run.snapshot().clock).toBe(101n);}
 console.info('M198 BOUNDARY PASS changed private blocker and report toA leave B full view unchanged through101; swapped/both/denied causal access, independent local actors, live actual dice and frozen meaning.');
},570000);
it('M198 exact continuation and reached learning rollback',async()=>{
 const b=fixture(),a=await create(b,9n),repeat=await create(b,9n);exact(a.run,repeat.run);const saved=a.run.save(),before=a.run.snapshot(),original=traceModule.traceRecordValue;let reached=false;
 const spy=vi.spyOn(traceModule,'traceRecordValue').mockImplementation(v=>{const row=original(v);if(eq(v.event.eventTypeId,SK_LEARN)){reached=true;throw Error('M198 learning140');}return row;});
 try{await expect(a.run.settleNextInstant()).rejects.toThrow('M198 learning140');expect(reached).toBe(true);snapshot({...a.run.snapshot(),status:before.status},before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await through(repeat.run,10n);await through(recovered,10n);exact(repeat.run,recovered);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:repeat.run.save()});exact(repeat.run,restored);
 for(let n=0;;n++){expect(n).toBeLessThan(32);const more=await repeat.run.settleNextInstant();for(const r of[recovered,restored]){expect(await r.settleNextInstant()).toBe(more);exact(repeat.run,r);}if(!more)break;}
 expect(repeat.run.snapshot().clock).toBe(101n);console.info('M198 CONTINUATION PASS repeat/save9, reached140 rollback, recovery9/save10 and all later complete snapshot/save/identity/history/player bytes through101.');
},570000);
it('M198 admission ownership and generated provenance reject invalid knowledge',async()=>{
 const a=await setup(),component=await compileCharacterState(a.m),o=a.m.socialWitness!.observers[0],p=stakeholderPath(o),v=state(a.run).read(p).value!,initial=restoreAuthoritativeState(decode(a.b.d.initialState));
 expect(()=>component.initialState(enc(new AuthoritativeState([...initial.entries(),{path:p,value:v}]).canonicalValue()))).toThrow('initial strategy');
 const patch={operations:[{kind:'set' as const,path:p,expected:{presence:false as const},newValue:v}]};
 expect(()=>component.stateModel.applyPatch(initial,patch,sid(1034,'foreign-owner'))).toThrow();expect(()=>component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER,{writableRoots:[1000n],targetPaths:[]})).toThrow();
 const changed=component.stateModel.applyPatch(initial,patch,KNOWLEDGE_OWNER).state;expect(()=>component.stateModel.applyPatch(changed,{operations:[{...patch.operations[0],expected:{presence:true,value:v}}]},KNOWLEDGE_OWNER)).toThrow('append only');
 const wrong=list([text(SK),list(journal(a,1))]);expect(()=>component.stateModel.applyPatch(initial,{operations:[{...patch.operations[0],newValue:wrong}]},KNOWLEDGE_OWNER)).toThrow('own observation');
 const model=await prepareCharacterModel(a.b.s),rows=items(decode(a.b.d.orderedInputs),'list'),source=rows.find(v=>eq(items(v,'list')[0],{kind:'signed',value:13n})&&eq(items(v,'list')[2],OBSTRUCTION_SOURCE))!;
 const change=(report:CanonicalValue)=>{const x=[...items(source,'list')],p=[...items(x[3],'list')];p[7]=list([list([]),report]);x[3]=list(p);return {...a.b.d,orderedInputs:enc(list(rows.map(v=>v===source?list(x):v)))};};
 await expect(createCharacterRun(model,change(list([u(10),u(2),false])))).rejects.toThrow('conflicting receipt');
 await expect(createCharacterRun(model,change(list([u(13),u(3),true])))).rejects.toThrow('report grammar/time');
 await expect(createCharacterRun(model,change(list([u(7),u(3),true])))).rejects.toThrow('report episode');
 await expect(prepareCharacterModel({...a.b.s,rulesVersion:STAKEHOLDER_RULES,registrySchemaVersion:STAKEHOLDER_REGISTRY})).rejects.toThrow('observer mapping');
 const handler=createStakeholderKnowledge(C,a.m.socialWitness!,a.m.modelIdentity.value,a.m.modelIdentity.value,component.stateModel,EXTENDED_TIME_LIMIT);handler.begin(10n);
 const event={eventId:999n,eventSequence:999n,eventTypeId:SK_REPORT,dueAt:10n as never,phase:120n,payload:list([list([]),list([])]),dependencies:list([]),causalParentEventIds:[]};
 expect(()=>handler.execute({event,state:initial} as never)).toThrow('unbound generated');handler.close();
 handler.begin(11n);const input={...event,phase:30n,dueAt:11n as never,eventTypeId:OBSTRUCTION_SOURCE},result=handler.source({event:input,state:initial} as never,list([list([]),list([])]));
 const children=result.emittedEvents.map((e,i)=>({...e,eventId:1000n+BigInt(i),eventSequence:1000n+BigInt(i),causalParentEventIds:[998n]}));
 expect(()=>result.traceFactory(children)).toThrow('child binding');handler.close();
 const slots=[...items(decode(a.b.s.registry),'list')],decl=[...items(slots[50],'list')],observers=[...items(decl[3],'list')],first=[...items(observers[0],'list')],actors=[...items(first[3],'list')],actor=[...items(actors[0],'list')];
 actor[1]=a.b.people[0];actors[0]=list(actor);first[3]=list(actors);observers[0]=list(first);decl[3]=list(observers);slots[50]=list(decl);
 await expect(prepareCharacterModel({...a.b.s,registry:enc(list(slots))})).rejects.toThrow('private actor identities');
 const copied=journal(a,0).map(v=>{const x=[...items(v,'list')];if(uint(x[5])===1n)x[8]=list([a.m.socialWitness!.observers[1].actors![0].local]);return list(x);});
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{...patch.operations[0],newValue:list([text(SK),list(copied)])}]},KNOWLEDGE_OWNER)).toThrow('source/actor');
 const forged=[...items(source,'list')];forged[1]=u(130);forged[2]=SK_EVIDENCE;await expect(createCharacterRun(model,{...a.b.d,orderedInputs:enc(list([...rows,list(forged)]))})).rejects.toThrow();
 console.info('M198 ADMISSION PASS conflicting/reused receipt, future/absent episode, old model, forged S0/source/generated evidence, foreign writer/path/holder and nonappend replacement reject.');
},570000);
