import {it,expect,vi} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {ASSOCIATION,ASSOCIATION_OWNER,associationPath,associationGraph,associationUnits,LEARNED_MEMORY_VERSION} from '../assembled/learnedAssociation';
import * as association from '../assembled/learnedAssociation';
import {AFFECT_RECALL,unpackAffectCue} from '../assembled/affectMemory';
import {isSocialEpisodePath,MEMORY_FORMATION,MEMORY_RECALL,EPISODIC_OWNER} from '../assembled/memory';
import {personPath,personHistory,personMean} from '../assembled/social';
import {WORKSPACE} from '../assembled/workspace';
import {JOINT_APPRAISAL} from '../assembled/appraisal';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {ExactRational as Q} from '../substrate/exactMath';
import {unsigned as u} from '../substrate/canonicalEncoding';
import {dataIdentity as id} from '../campaign2/canonicalData';
import {readQ,qValue} from '../campaign2/cognitiveMath';
import {recallCanonicalEventAcquisitions} from '../campaign3/canonicalEventRecall';
import {fixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './fixtures/assembledLearnedAssociation';
const cache=new WeakMap<Run,{snap:ReturnType<Run['snapshot']>;state?:ReturnType<typeof restoreAuthoritativeState>;out?:CanonicalValue;trace?:ReturnType<typeof outputs>}>();
function view(r:Run){let v=cache.get(r);if(!v){v={snap:r.snapshot()};cache.set(r,v);}return v;}
const snap=(r:Run)=>view(r).snap,state=(r:Run)=>view(r).state??=restoreAuthoritativeState(decode(snap(r).state)),out=(r:Run)=>view(r).out??=decode(snap(r).outputs),trace=(r:Run)=>view(r).trace??=outputs(snap(r).trace,160n);
const report=(r:Run,label:string)=>items(out(r),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(label))).map(v=>items(v,'list'));
const episodes=(r:Run)=>state(r).entries().filter(e=>isSocialEpisodePath(e.path)).map(e=>items(e.value,'list')).sort((a,b)=>(a[5] as {value:bigint}).value<(b[5] as {value:bigint}).value?-1:1);
const graph=(r:Run,nodes=30)=>associationGraph(state(r).read(associationPath(C)).value,{nodes,edges:nodes*(nodes-1)});
const event=(t:ReturnType<typeof rec>)=>rec(f(t,4n),130n);
async function advance(r:Run){try{return await r.settleNextInstant();}finally{cache.delete(r);}}
async function through(r:Run,at:bigint){for(let n=0;snap(r).clock<at;n++){expect(n).toBeLessThan(64);expect(await advance(r)).toBe(true);}expect(snap(r).clock).toBe(at);}
async function finish(r:Run,peers:Run[]=[]){for(let n=0;n<64;n++){const more=await advance(r);for(const p of peers){expect(await advance(p)).toBe(more);exact(r,p);}if(!more){expect(r.diagnostic()).toBeUndefined();return;}}throw Error('full queue did not exhaust');}
async function create(...args:Parameters<typeof fixture>){const b=fixture(...args),m=await prepareCharacterModel(b.s),r=await createCharacterRun(m,b.d);return {b,m,r};}
function edge(r:Run,episode:number){const a=episodes(r)[episode],units=associationUnits(a[6],a[3]),g=graph(r);expect(units).toHaveLength(2);const indices=units.map(u=>g.keys.findIndex(k=>key(k)===key(u.key)));expect(indices.every(i=>i>=0)).toBe(true);return g.weights[indices[0]][indices[1]];}
function probe(r:Run,expected:number,expectedPulls:CanonicalValue[],nodes=30){
 const belief=state(r).read(personPath(C,target)).value;expect(personHistory(belief)).toHaveLength(2);expect(personMean(belief)).toEqual({numerator:1n,denominator:2n});
 const social=report(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;
 expect(items(social[4],'list')).toHaveLength(1);const joint=report(r,JOINT_APPRAISAL).at(-1)!;expect(items(joint[4],'list').some(v=>items(v,'list').length===5)).toBe(true);
 const audit=report(r,AFFECT_RECALL).find(a=>key(a[1])===key(signed(21)))!;expect(audit).toBeDefined();expect(audit[3]).toEqual(q(1,1));const scores=items(audit[4],'list').map(v=>items(v,'list'));
 const byTime=episodes(r).map(a=>scores.find(s=>uint(s[0])===uint(id(a[1]).payload))!);
 expect(byTime.map(s=>s[1])).toEqual([q(1,21),q(1,20)]);expect(byTime.map(s=>s[2])).toEqual(expectedPulls);
 const t=trace(r).find(t=>key(f(event(t),2n))===key(signed(21))&&key(f(event(t),5n))===key(MEMORY_RECALL))!;
 expect(f(t,6n)).toEqual(text(LEARNED_MEMORY_VERSION));const reads=items(f(t,11n),'list').map(v=>rec(v,147n)),gread=reads.find(v=>uint(f(rec(f(v,2n),140n),1n))===631n)!;expect(gread).toBeDefined();
 const g=associationGraph(f(gread,4n),{nodes,edges:nodes*(nodes-1)}),mem=reads.filter(v=>uint(f(rec(f(v,2n),140n),1n))===346n).map(v=>items(f(v,4n),'list')).filter(a=>key(a[0])===key(text('assembled-social-episode/0.1')));
 const cue=unpackAffectCue(audit[2],21n);expect(cue.track).toBeDefined();
 const kernel=recallCanonicalEventAcquisitions({cue:{kind:'Present',key:cue.track!},now:21n,graph:g,memory:mem.map(a=>({id:uint(id(a[1]).payload),acquiredAt:(a[5] as {value:bigint}).value,units:associationUnits(a[6],a[3]).map(x=>({key:x.key,views:[enc(list(a))]}))})),presentations:new Map(mem.map(a=>[uint(id(a[1]).payload),[(a[5] as {value:bigint}).value,...items(a[4],'list').map(v=>(v as {value:bigint}).value)]])),calibration:{beta:Q.of(1n,2n),scale:1000n,lambda:Q.of(1n),exponent:1,omegaB:Q.of(1n),omegaA:readQ(audit[3]),k:1}});
 expect(list(kernel.scores.map(s=>list([u(s.acquisition),qValue(s.base),qValue(s.pull),qValue(s.score)])))).toEqual(audit[4]);
 expect(items(audit[5],'list').map(v=>uint(items(v,'list')[0]))).toEqual(kernel.recalled.map(w=>w.id));
 expect(items(audit[7],'list')).toHaveLength(3); // Direct-only keys remain accessible after graph loss.
 expect(items(social[4],'list')[0]).toEqual(q(expected,1));
 const selected=items(report(r,WORKSPACE).at(-1)![4],'list');expect(selected).toHaveLength(1);expect(items(social[6],'list')[3]).toEqual(list([items(selected[0],'list')[0]]));expect(items(joint[6],'list').slice(1)).toContainEqual(list(social));
 return audit;
}
it('primary123: selected strengths learn exact edges and change real recalled judgment',async()=>{
 const learned=await create(),lost=await create(0),independent=await create(30,'main',2,'independent');
 for(const [x,first,last,b]of [[learned,Q.of(9n,100n),Q.of(45n,1000n),Q.of(32n,1000n)],[independent,Q.of(53n,1000n),Q.of(26n,1000n),Q.of(22n,1000n)]] as const){
  await through(x.r,1n);expect(edge(x.r,0)).toEqual(first);await through(x.r,2n);expect(edge(x.r,0)).toEqual(last);expect(edge(x.r,1)).toEqual(b);expect(graph(x.r).lastUpdatedAt).toBe(2n);
 }
 await through(lost.r,2n);expect(graph(lost.r,0)).toEqual({keys:[],weights:[],lastUpdatedAt:2n});
 for(const {r}of[learned,lost,independent])await through(r,21n);
 const a=probe(learned.r,1,[q(64,125),q(1017,2000)]),b=probe(lost.r,0,[q(1,2),q(1,2)],0);probe(independent.r,0,[q(1013,2000),q(1011,2000)]);
 expect(episodes(learned.r).map(a=>a.slice(2,4))).toEqual(episodes(lost.r).map(a=>a.slice(2,4)));expect(a[2]).toEqual(b[2]);
 for(const {r}of[learned,lost,independent])await finish(r);
 console.info('M123 PRIMARY reference edges .090->.045/.032; actual pulls .512/.5085 => A/judgment1; graph loss .5/.5 => B/0; independent .053->.026/.022 gives .5065/.5055 => B/0; mean1/2 and original captured kernel; full queues');
},500000);
it('remaining123 controls: permission hidden truth and selection do not acquire extra authority',async()=>{
 const hidden=await create(30,'hidden'),main=await create(),denied=await create(30,'denied'),absent=await create(30,'absent'),one=await create(30,'main',1);
 for(const {r}of[hidden,main,denied,absent,one])await through(r,2n);
 for(const [a,b]of [[hidden,main],[denied,absent]]){bytes(snap(a.r).state,snap(b.r).state);bytes(snap(a.r).outputs,snap(b.r).outputs);}
 expect(graph(one.r)).toEqual({keys:[],weights:[],lastUpdatedAt:2n});expect(graph(denied.r).keys).toHaveLength(0);
 for(const {r}of[hidden,main]){await through(r,21n);probe(r,1,[q(64,125),q(1017,2000)]);await finish(r);}
 for(const {r}of[denied,absent,one]){await through(r,21n);expect(report(r,AFFECT_RECALL).find(a=>key(a[1])===key(signed(21)))).toBeDefined();const belief=state(r).read(personPath(C,target)).value;expect(personMean(belief)).toEqual({numerator:1n,denominator:2n});const social=report(r,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')).find(a=>key(a[2])===key(target))!;expect(items(social[4],'list')).toEqual([q(0,1)]);expect(items(report(r,WORKSPACE).at(-1)![4],'list')).toHaveLength(1);await finish(r);}
 console.info('M123 CONTROLS hidden==main and denied==absent at state/output; unselected/denied extra cannot create graph; empty graph preserves direct recall');
},500000);
it('remaining123 continuation: learned graph shares exact persistence and transaction rollback',async()=>{
 const b=fixture(),m=await prepareCharacterModel(b.s),a=await createCharacterRun(m,b.d),duplicate=await createCharacterRun(m,b.d);await through(a,2n);await through(duplicate,2n);exact(a,duplicate);
 const restored=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:a.save()});exact(a,restored);await finish(a,[duplicate,restored]);
 const fault=await createCharacterRun(m,b.d),before=fault.snapshot(),saved=fault.save(),original=association.prepareAssociation;let reached=false;
 const spy=vi.spyOn(association,'prepareAssociation').mockImplementation((...args)=>{const result=original(...args);reached=true;throw Error('M123 after learned settlement');});
 try{await expect(fault.settleNextInstant()).rejects.toThrow('M123 after learned settlement');expect(reached).toBe(true);expect({...fault.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 const recovered=await restoreCharacterRun(b.s,{initialState:b.d.initialState,orderedInputs:b.d.orderedInputs,save:saved});await finish(recovered);exact(a,recovered);
 console.info('M123 CONTINUATION exact duplicate/save2/full prefix restore; post-association prepare failure rolls back visible instant and recovered prefix equals clean full continuation');
},500000);
it('remaining123 boundaries: only selected observed keys and one graph authority enter learned state',async()=>{
 const x=await create();await through(x.r,2n);const component=await compileCharacterState(await compileCharacterModel(x.b.s)),p=associationPath(C),prior=state(x.r).read(p),g=graph(x.r);
 const same={operations:[{kind:'set' as const,path:p,expected:{presence:true as const,value:prior.value!},newValue:prior.value!}]};
 expect(()=>component.stateModel.applyPatch(state(x.r),same,EPISODIC_OWNER,{writableRoots:[631n],targetPaths:[p]})).toThrow();
 const initial=restoreAuthoritativeState(decode(x.b.d.initialState)),injected=new AuthoritativeState([...initial.entries(),{path:p,value:list([text(ASSOCIATION),list([]),list([]),u(1)])}]);
 expect(()=>component.initialState(enc(injected.canonicalValue()))).toThrow('initial learned association must be absent');
 const old=await compileCharacterState(await compileCharacterModel(x.b.legacy.s));expect(()=>old.stateModel.validateState(state(x.r))).toThrow();
 await expect(prepareCharacterModel({...x.b.s,rulesVersion:x.b.legacy.s.rulesVersion,registrySchemaVersion:x.b.legacy.s.registrySchemaVersion})).rejects.toThrow('affect memory declaration/domain');
 const value=items(prior.value!,'list'),bad=[...value],rows=items(value[2],'list').map(v=>[...items(v,'list')]);rows[0][0]=q(1,1);bad[2]=list(rows.map(list));expect(()=>associationGraph(list(bad),{nodes:30,edges:870})).toThrow();
 const foreign=[...value],keys=[...items(value[1],'list')],r=rec(keys[0],212n);keys[0]={...r,fields:new Map([...r.fields].map(([k,v])=>[k,k===1n?{kind:'typedIdentifier' as const,namespaceId:1000n,payload:text('foreign-observer')}:v]))};foreign[1]=list(keys);expect(()=>associationGraph(list(foreign),{nodes:30,edges:870})).toThrow();
 for(const t of trace(x.r).filter(t=>key(f(event(t),5n))===key(MEMORY_FORMATION))){
  const diffs=items(f(t,17n),'list').map(v=>rec(v,148n)),gd=diffs.filter(v=>uint(f(rec(f(v,1n),140n),1n))===631n);
  if(gd.length){expect(gd).toHaveLength(1);expect(f(gd[0],6n)).toEqual(ASSOCIATION_OWNER);expect(items(f(t,13n),'list').some(v=>key(items(v,'list')[0])===key(text(ASSOCIATION)))).toBe(true);}
 }
 for(const kind of ['lattice','mass']){const changed=[...value],matrix=items(value[2],'list').map(v=>[...items(v,'list')]);matrix[0][1]=kind==='lattice'?q(1,3):q(1,1);if(kind==='mass')matrix[0][2]=q(1,1);changed[2]=list(matrix.map(list));expect(()=>associationGraph(list(changed),{nodes:30,edges:870})).toThrow();}
 expect(()=>associationGraph(prior.value!,{nodes:2,edges:2})).toThrow();
 expect(report(x.r,ASSOCIATION)).toHaveLength(2);expect(g.keys).toHaveLength(3);await finish(x.r);
 console.info('M123 BOUNDARIES graph S0, old grammar/state, wrong owner, self edges and foreign observer reject; actual graph diffs have one owner and selected source receipts');
},200000);
