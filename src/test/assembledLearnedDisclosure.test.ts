import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {list,text,signed,unsigned,typedIdentifier,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {personPath,personHistory,personMean,PERSON_OWNER} from '../assembled/social';
import {knowledgePath,history,communicationEstimate,FROZEN,SIGNAL,RECEIVED,PROBE,PRIVATE,COMM_SOURCE} from '../assembled/communication';
import {C} from './fixtures/campaign2Cognitive';
import {recipients} from './fixtures/assembledCommunication';
import {workLimit} from './fixtures/assembledCharacter';
import {candidate} from './fixtures/assembledRecognitionCatalog';
import {learnedSource,learnedData,encounters,opportunities,target,other,decode,items,key,enc} from './fixtures/assembledLearnedDisclosure';
import {through,finish,outputs,decisions,mapFromDecision,draws,choice,signedValue,type Run} from './fixtures/assembledComparison';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const knowledge=(r:Run,i=0)=>state(r).read(knowledgePath(recipients[i])).value;
const records=(r:Run,t:CanonicalValue=target)=>personHistory(state(r).read(personPath(C,t)).value);
const reports=(r:Run,name:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(name))).map(v=>items(v,'list'));
const at=(r:Run,name:string,time=3n)=>reports(r,name).find(v=>signedValue(v[1])===time)!;
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const mapped=(seed:number,map:ReturnType<typeof mapFromDecision>)=>{const d=learnedData(seed);return {...d,orderedInputs:enc(list([map.canonicalValue,...items(decode(d.orderedInputs),'list')]))};};
function expressionJoin(r:Run,topic:CanonicalValue,time=3n){const frozen=at(r,FROZEN,time),latest=records(r,topic).at(-1),traces=outputs(r.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text('assembled-character-learned-disclosure/0.1-candidate'))&&signedValue(f(rec(f(t,4n),130n),2n))===time&&uint(f(rec(f(t,4n),130n),3n))===90n);expect(traces).toHaveLength(1);expect(frozen[4]).toEqual(latest?items(latest,'list')[6]:list([]));expect(frozen[5]).toEqual(topic);expect(f(traces[0],9n)).toEqual(list(latest?[items(latest,'list')[0]]:[]));expect(items(f(traces[0],11n),'list')).toHaveLength(1);expect(state(r).read(knowledgePath(C)).presence).toBe(false);expect(reports(r,PRIVATE)).toHaveLength(0);}
it('matrix: learned topic changes received content under the same coupled choices',async()=>{
 const models=await Promise.all([target,other].map(t=>prepareCharacterModel(learnedSource(t)))),maps=[];
 for(const model of models){const r=await createCharacterRun(model,learnedData());await through(r,3n);maps.push(mapFromDecision(r));}
 console.info('M26_MAPS '+JSON.stringify(maps.map(m=>key(m.canonicalValue))));let common=0;const delivered:number[]=[];
 for(let seed=0;seed<8;seed++){const a=await createCharacterRun(models[0],mapped(seed,maps[0])),b=await createCharacterRun(models[1],mapped(seed,maps[1]));await through(a,3n);await through(b,3n);
  expressionJoin(a,target);expressionJoin(b,other);expect(at(a,FROZEN)[4]).toEqual(list([true]));expect(at(b,FROZEN)[4]).toEqual(list([false]));expect(choice(a)).toBe(choice(b));
  const aa=draws(a),bb=draws(b),by=new Map(bb.map(d=>[key(f(d,2n)),d]));expect(aa.length).toBeGreaterThan(0);expect(aa.map(d=>key(f(d,2n))).sort()).toEqual(bb.map(d=>key(f(d,2n))).sort());
  for(const x of aa){const y=by.get(key(f(x,2n)))!;for(const n of [3n,4n,7n])expect(f(x,n)).toEqual(f(y,n));common++;}
  const sa=at(a,SIGNAL),sb=at(b,SIGNAL);expect(sa[5]).toBe(sb[5]);if(sa[5]){delivered.push(seed);expect(sa[6]).toEqual(list([true]));expect(sb[6]).toEqual(list([false]));}else {expect(sa[6]).toEqual(list([]));expect(sb[6]).toEqual(list([]));}
  for(const [r,topic] of [[a,target],[b,other]] as const){for(const row of reports(r,RECEIVED)){const obs=items(row[1],'list');expect(obs).toHaveLength(5);expect(obs[4]).toEqual(topic);}expect(knowledge(r,1)).toBeUndefined();}
  await through(a,4n);await through(b,4n);expect(communicationEstimate(knowledge(a))).toEqual(list(sa[5]?[q(1,1)]:[]));expect(communicationEstimate(knowledge(b))).toEqual(list(sa[5]?[q(0,1)]:[]));
  for(const r of [a,b])expect(at(r,PROBE,4n)[4]).toEqual(communicationEstimate(knowledge(r)));
  console.info('M26_CELL '+JSON.stringify({seed,choice:choice(a),delivered:sa[5],common:aa.length,drawsA:aa.map(key),drawsB:bb.map(key)}));await finish(a);await finish(b);
 }
 expect(delivered.length).toBeGreaterThan(0);console.info('M26_MATRIX '+JSON.stringify({runs:16,delivered,common,terminal:10}));
},550000);

it('controls: actual learned content, timing, hidden evidence and delivery boundaries',async()=>{
 const source=learnedSource(),model=await prepareCharacterModel(source),run=async(data=learnedData(),m=model,time=3n)=>{const r=await createCharacterRun(m,data);await through(r,time);return r;};
 const base=await run(),hidden=await run(learnedData(0,encounters.map(x=>({...x,hidden:other}))),model,2n),prior=await run(learnedData(),model,2n);expect(hidden.snapshot().state).toEqual(prior.snapshot().state);expect(hidden.snapshot().outputs).toEqual(prior.snapshot().outputs);
 const unknown=await run(learnedData(0,[encounters[1]])),denied=await run(learnedData(0,encounters.map(x=>({...x,access:false}))));for(const r of [unknown,denied]){expect(at(r,FROZEN)[4]).toEqual(list([]));expect(at(r,SIGNAL)[5]).toBe(false);expect(knowledge(r)).toBeUndefined();expressionJoin(r,target);}
 const mixed=await run(learnedData(0,[encounters[0],{at:2,signals:[['appearance/coat',true]],continuity:true}]));expect(personMean(state(mixed).read(personPath(C,target)).value)!.numerator).toBe(1n);expect(personMean(state(mixed).read(personPath(C,target)).value)!.denominator).toBe(2n);expect(at(mixed,FROZEN)[4]).toEqual(list([false]));expressionJoin(mixed,target);
 const late=await run(learnedData(0,[...encounters,{at:3,signals:[['appearance/coat',true]]}]));expect(records(late,target)).toHaveLength(2);expect(items(records(late,target).at(-1)!,'list')[6]).toEqual(list([false]));expect(at(late,FROZEN)[4]).toEqual(list([true]));const frozenTrace=outputs(late.snapshot().trace,160n).find(t=>key(f(t,6n))===key(text('assembled-character-learned-disclosure/0.1-candidate'))&&uint(f(rec(f(t,4n),130n),3n))===90n)!;expect(f(frozenTrace,9n)).toEqual(list([items(records(late,target)[0],'list')[0]]));
 const slots=items(decode(source.registry),'list'),body=items(slots[10],'list'),blocked=await prepareCharacterModel({...source,registry:enc(list(slots.map((v,i)=>i===10?list([body[0],false,...body.slice(2)]):v)))});
 const noDelivery=await run(learnedData(1,encounters,opportunities.map(o=>({...o,delivery:false})))),noAccess=await run(learnedData(1,encounters,opportunities.map(o=>({...o,a:false,b:false})))),physical=await run(learnedData(1),blocked);
 for(const r of [noDelivery,noAccess,physical]){expect(at(r,FROZEN)[4]).toEqual(list([true]));expect(knowledge(r)).toBeUndefined();expect(knowledge(r,1)).toBeUndefined();for(const row of reports(r,RECEIVED)){const obs=items(row[1],'list');expect(obs).toHaveLength(5);expect(obs[3]).toEqual(list([]));expect(obs[4]).toEqual(target);}}
 expect(at(noDelivery,SIGNAL)[5]).toBe(false);expect(at(physical,SIGNAL)[4]).toBe(false);
 expect(at(base,FROZEN)[4]).toEqual(list([true]));console.info('M26 learned/latest/not-mean/unknown/hidden/denied/same-instant/physical/delivery/access/privacy controls PASS');
},350000);

it('controls: exact repeat and acquired-history restores2/3 through10',async()=>{
 const source=learnedSource(),data=learnedData(1),model=await prepareCharacterModel(source),a=await createCharacterRun(model,data),b=await createCharacterRun(model,data);await through(a,2n);await through(b,2n);exact(a,b);
 const early=await restoreCharacterRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save:a.save()});exact(a,early);for(const r of [a,b,early])await through(r,3n);exact(a,b);exact(a,early);
 const late=await restoreCharacterRun(source,{initialState:data.initialState,orderedInputs:data.orderedInputs,save:a.save()});exact(a,late);while(await a.settleNextInstant())for(const r of [b,early,late]){expect(await r.settleNextInstant()).toBe(true);exact(a,r);}expect(a.snapshot().clock).toBe(10n);expect(a.diagnostic()).toBeUndefined();console.info('M26 exact repeat/restores2/3 through10 PASS');
},240000);

it('controls: topic/source/state admission, authority, phases and late rollback',async()=>{
 const source=learnedSource(),data=learnedData(1),model=await prepareCharacterModel(source),compiled=await compileCharacterModel(source),component=await compileCharacterState(compiled),r=await createCharacterRun(model,data);await through(r,3n);
 await expect(prepareCharacterModel(learnedSource(candidate(7)))).rejects.toThrow('topic');const slots=items(decode(source.registry),'list'),declaration=items(slots[18],'list');
 for(const altered of [list(declaration.slice(0,3)),list([declaration[0],declaration[1],list([recipients[0],recipients[0]]),target])])await expect(prepareCharacterModel({...source,registry:enc(list(slots.map((v,i)=>i===18?altered:v)))})).rejects.toThrow();
 const input=items(decode(data.orderedInputs),'list'),row=input.find(v=>key(items(v,'list')[2])===key(COMM_SOURCE))!;
 for(const payload of [list([text('assembled-communication/0.1'),true,true,true,true,true,false]),list([declaration[0],true,true]),list([declaration[0],true,true,false,true])]){const x=[...items(row,'list')];x[3]=payload;await expect(createCharacterRun(model,{...data,orderedInputs:enc(list(input.map(v=>v===row?list(x):v)))})).rejects.toThrow('source');}
 await expect(createCharacterRun(model,{...data,orderedInputs:enc(list([...input,row]))})).rejects.toThrow('duplicate communication');
 const snapshot=state(r),initial=component.initialState(data.initialState);expect(()=>component.stateModel.read(snapshot,knowledgePath(C))).toThrow('foreign path');
 const observation=list([typedIdentifier(1168,unsigned(999999)),recipients[0],signed(4),list([true]),target]);
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:knowledgePath(recipients[0]),expected:{presence:false},newValue:list([observation])}]},PERSON_OWNER)).toThrow();
 const wrongTopic=[...items(observation,'list')];wrongTopic[4]=other;
 expect(()=>component.stateModel.validateState(new AuthoritativeState([...initial.entries(),{path:knowledgePath(recipients[0]),value:list([list(wrongTopic)])}]))).toThrow('topic');
 const traces=outputs(r.snapshot().trace,160n).filter(t=>key(f(t,6n))===key(text('assembled-character-learned-disclosure/0.1-candidate'))),phases=traces.map(t=>uint(f(rec(f(t,4n),130n),3n)));for(const p of [10n,20n,40n,90n,110n,120n,140n])expect(phases).toContain(p);expect(phases).not.toContain(30n);
 const count=new Set(outputs(r.snapshot().trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===3n).map(t=>key(f(rec(f(t,4n),130n),1n)))).size,failed=await createCharacterRun(await prepareCharacterModel(workLimit(source,BigInt(count-1))),data);await through(failed,2n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(knowledge(failed)).toBeUndefined();console.info('M26 topic/source/no-speaker-copy/phases/owner/rollback controls PASS events='+count);
},200000);
