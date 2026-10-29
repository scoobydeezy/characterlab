import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {restoreAuthoritativeState} from '../substrate/state';
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint} from '../campaign2/canonicalData';
import {randomDrawRecord} from '../assembled/codecs';
import {personPath,personHistory,personMean,PERSON_OWNER} from '../assembled/social';
import {relationshipPath,relationshipHistory,relationshipFold,REL_OWNER} from '../assembled/relationship';
import {C} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';
import {peopleSource,peopleData,changeReports,target,other,decode,items,key,enc} from './fixtures/assembledPersonHistory';
import {catalogSource,candidate} from './fixtures/assembledRecognitionCatalog';
import {through,finish,outputs,decisions,mapFromDecision,draws,choice,signedValue,type Run} from './fixtures/assembledComparison';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const belief=(r:Run,t=target)=>state(r).read(personPath(C,t)).value;
const history=(r:Run,t=target)=>state(r).read(relationshipPath(C,t)).value;
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const reports=(r:Run,name:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(name))).map(v=>items(v,'list'));
const mapped=(second:boolean,seed:number,map:ReturnType<typeof mapFromDecision>)=>{const d=peopleData(second,seed);return {...d,orderedInputs:enc(list([map.canonicalValue,...items(decode(d.orderedInputs),'list')]))};};
function scoreEvidence(run:Run){
 const result=rec(f(rec(f(decisions(run)[0],4n),419n),2n),420n);
 expect(uint(f(result,8n))).not.toBe(1n);
 const context=rec(f(decisions(run)[0],3n),408n),options=rec(f(rec(f(context,2n),403n),2n),398n);
 const candidates=items(f(options,3n),'list').map(v=>f(rec(v,397n),1n)),scores=new Map(candidates.map(c=>[key(c),0n]));
 const reasons=items(f(result,9n),'list').map(v=>{const x=rec(v,422n),nk=rec(f(x,1n),404n),draw=randomDrawRecord(f(x,5n));
  const face=uint(f(draw,3n))+1n,contribution=(uint(f(nk,4n))===1n?1n:-1n)*(face+signedValue(f(x,3n))+signedValue(f(x,4n)));
  expect(face).toBe(uint(f(x,6n)));expect(contribution).toBe(signedValue(f(x,7n)));
  const k=key(f(nk,1n));expect(scores.has(k)).toBe(true);scores.set(k,scores.get(k)!+contribution);return draw;});
 expect(reasons.length).toBe(items(f(context,3n),'list').length);
 const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=candidates.filter(c=>scores.get(key(c))===top).sort((a,b)=>key(a)<key(b)?-1:1);
 const tie=rec(f(result,10n),423n);expect(uint(f(tie,1n))).toBe(leaders.length>1?2n:1n);
 let tieDraw:ReturnType<typeof randomDrawRecord>|undefined;
 if(leaders.length>1){tieDraw=randomDrawRecord(f(tie,3n));expect(f(tie,2n)).toEqual(list(leaders));expect(uint(f(tieDraw,4n))).toBe(BigInt(leaders.length));expect(f(tie,4n)).toEqual(leaders[Number(uint(f(tieDraw,3n)))]);expect(f(result,1n)).toEqual(f(tie,4n));}
 else expect(f(result,1n)).toEqual(leaders[0]);
 return {reasons,tieDraw,leaders};
}

it('matrix: recognized people retain separate histories that feed coupled choices',async()=>{
 const model=await prepareCharacterModel(peopleSource()),maps=[];
 for(const [i,shared]of [false,true].entries()){const r=await createCharacterRun(model,peopleData(shared));await through(r,3n);maps.push(mapFromDecision(r));}
 console.info('M25_MAPS '+JSON.stringify(maps.map(m=>key(m.canonicalValue))));
 const changed:number[]=[];let common=0,conditionalTies=0;
 for(let seed=0;seed<8;seed++){
  const a=await createCharacterRun(model,mapped(false,seed,maps[0])),b=await createCharacterRun(model,mapped(true,seed,maps[1]));await through(a,3n);await through(b,3n);
  for(const [run,person,absent] of [[a,target,other],[b,other,target]] as const){expect(personHistory(belief(run,person))).toHaveLength(2);expect(relationshipHistory(history(run,person))).toHaveLength(2);expect(belief(run,absent)).toBeUndefined();expect(history(run,absent)).toBeUndefined();
   const social=reports(run,'assembled-social-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list')),relation=reports(run,'assembled-relationship-people/0.1/appraisal').at(-1)!.slice(1).map(v=>items(v,'list'));
   for(const t of [target,other]){expect(social.find(r=>key(r[2])===key(t))![3]).toEqual(list(personHistory(belief(run,t))));expect(relation.find(r=>key(r[2])===key(t))![3]).toEqual(history(run,t)??list([]));}
   expect(relation.find(r=>key(r[2])===key(person))![6]).toBe(true);
   expect(items(relation.find(r=>key(r[2])===key(person))![9],'list').length).toBeGreaterThan(0);
  }
  expect(f(decisions(a)[0],3n)).not.toEqual(f(decisions(b)[0],3n));
  const aa=draws(a),bb=draws(b),by=new Map(bb.map(v=>[key(f(v,2n)),v]));let paired=0;
  for(const x of aa){const y=by.get(key(f(x,2n)));if(!y)continue;paired++;const ax=items(f(x,7n),'list'),ay=items(f(y,7n),'list');for(let i=0;i<Math.min(ax.length,ay.length);i++){expect(f(rec(ax[i],410n),1n)).toEqual(f(rec(ay[i],410n),1n));expect(f(rec(ax[i],410n),2n)).toEqual(f(rec(ay[i],410n),2n));}}
  const sa=scoreEvidence(a),sb=scoreEvidence(b);expect(sa.reasons.map(x=>key(f(x,2n))).sort()).toEqual(sb.reasons.map(x=>key(f(x,2n))).sort());
  const unmatched=[...aa.filter(x=>!bb.some(y=>key(f(x,2n))===key(f(y,2n)))),...bb.filter(y=>!aa.some(x=>key(f(x,2n))===key(f(y,2n))))];
  if(unmatched.length){expect(unmatched).toHaveLength(1);const tied=sa.tieDraw?sa:sb,unique=sa.tieDraw?sb:sa;expect(unique.tieDraw).toBeUndefined();expect(unique.leaders).toHaveLength(1);expect(unmatched[0]).toEqual(tied.tieDraw);conditionalTies++;}
  expect(paired).toBeGreaterThan(0);common+=paired;if(choice(a)!==choice(b))changed.push(seed);
  console.info('M25_CELL '+JSON.stringify({seed,target:choice(a),other:choice(b),common:paired,unmatched:unmatched.length,drawsA:aa.map(key),drawsB:bb.map(key)}));await finish(a);await finish(b);
 }
 expect(changed.length).toBeGreaterThan(0);console.info('M25_MATRIX '+JSON.stringify({runs:16,changed,common,conditionalTies,terminal:10}));
},550000);


it('controls: sequential people, receipt isolation, hidden evidence and admission',async()=>{
 const source=peopleSource(),model=await prepareCharacterModel(source);
 const frames=[{at:1,signals:[['appearance/coat',true] as [string,boolean]]},{at:2,signals:[['appearance/plain',true] as [string,boolean]]},{at:4,signals:[['appearance/coat',true] as [string,boolean]]}];
 const run=async(data=peopleData(false,0,frames),m=model,at=4n)=>{const r=await createCharacterRun(m,data);await through(r,at);return r;};
 // Same receipt number can mean different claims from different recognized people.
 const d=changeReports(peopleData(false,0,frames),(at,s)=>{s[4]=unsigned(1);s[3]=unsigned(at===2?4:3);});
 const a=await run(d);expect(personHistory(belief(a))).toHaveLength(1);expect(personHistory(belief(a,other))).toHaveLength(1);expect(personMean(belief(a))!.numerator).toBe(1n);expect(personMean(belief(a,other))!.numerator).toBe(0n);
 expect(relationshipHistory(history(a))).toHaveLength(2);expect(relationshipHistory(history(a,other))).toHaveLength(1);expect(relationshipFold(history(a)).comfort).toBe(true);expect(relationshipFold(history(a,other)).comfort).toBe(false);
 const contradictory=changeReports(d,(at,s)=>{if(at===4)s[3]=unsigned(4);}),failed=await createCharacterRun(model,contradictory);await through(failed,3n);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('person receipt changed');expect({...failed.snapshot(),status:before.status}).toEqual(before);
 const basic=await run(peopleData(),model,2n),hidden=await run(peopleData(false,0,[{at:1,signals:[['appearance/coat',true]],hidden:other},{at:2,signals:[['appearance/coat',true]],continuity:true,hidden:other}]),model,2n);
 expect(hidden.snapshot().state).toEqual(basic.snapshot().state);expect(hidden.snapshot().outputs).toEqual(basic.snapshot().outputs);
 const deniedA=await run(peopleData(false,0,[{at:1,signals:[['appearance/coat',true]],access:false}]),model,1n),deniedB=await run(peopleData(false,0,[{at:1,signals:[['appearance/plain',true]],access:false,hidden:other}]),model,1n);
 expect(deniedA.snapshot().state).toEqual(deniedB.snapshot().state);expect(deniedA.snapshot().outputs).toEqual(deniedB.snapshot().outputs);
 const unconfigured=await run(peopleData(false,0,[{at:1,signals:[['appearance/stripe',true]]}]),model,1n);expect(belief(unconfigured)).toBeUndefined();expect(belief(unconfigured,other)).toBeUndefined();expect(history(unconfigured)).toBeUndefined();expect(history(unconfigured,other)).toBeUndefined();
 const slots=items(decode(source.registry),'list'),reverse=slots.map((v,i)=>i===19||i===20?list([items(v,'list')[0],list([...items(items(v,'list')[1],'list')].reverse())]):v),ordered=await run(peopleData(),await prepareCharacterModel({...source,registry:enc(list(reverse))}),2n);
 expect(ordered.snapshot().state).toEqual(basic.snapshot().state);expect(ordered.snapshot().outputs).toEqual(basic.snapshot().outputs);
 const singleton=await run(peopleData(),await prepareCharacterModel(peopleSource(true)),2n);expect(personHistory(belief(singleton))).toHaveLength(2);expect(relationshipHistory(history(singleton))).toHaveLength(2);
 const mutate=(slot:number,rows:CanonicalValue[])=>({...source,registry:enc(list(slots.map((v,i)=>i===slot?list([items(v,'list')[0],list(rows)]):v)))}),social=items(items(slots[19],'list')[1],'list'),rel=items(items(slots[20],'list')[1],'list'),s0=items(social[0],'list'),s1=items(social[1],'list'),r0=items(rel[0],'list'),r1=items(rel[1],'list');
 for(const bad of [mutate(19,[]),mutate(19,[...social,social[0]]),mutate(19,[list([candidate(7),s0[1]]),social[1]]),mutate(19,[social[0],list([s1[0],s0[1]])]),mutate(20,[rel[0]]),mutate(20,[rel[0],list([r1[0],r0[1]])]),mutate(20,[rel[0],rel[0]]),{...source,registry:catalogSource().registry}])await expect(prepareCharacterModel(bad)).rejects.toThrow();
 const compiled=await compileCharacterModel(source),component=await compileCharacterState(compiled),current=state(a),entry=current.entries().find(e=>e.path.rootStateTypeId===810n)!;
 expect(()=>component.stateModel.applyPatch(current,{operations:[{kind:'set',path:entry.path,expected:{presence:true,value:entry.value},newValue:entry.value}]},REL_OWNER)).toThrow();
 expect(()=>component.stateModel.read(current,personPath(C,candidate(7)))).toThrow('foreign path');expect(()=>component.stateModel.read(current,relationshipPath(C,candidate(7)))).toThrow('foreign path');
 const otherEntry=current.entries().find(e=>e.path.rootStateTypeId===810n&&key((e.path.selectors[0] as {key:CanonicalValue}).key)===key(list([C,other])))!;
 expect(()=>component.stateModel.applyPatch(current,{operations:[{kind:'set',path:otherEntry.path,expected:{presence:true,value:otherEntry.value},newValue:entry.value}]},PERSON_OWNER)).toThrow('observation holder/target');
 console.info('M25 isolation/receipt/hidden/denied/order/singleton/admission/authority controls PASS');
},450000);

it('controls: exact repeat and restores2/3 through10',async()=>{
 const source=peopleSource(),d=peopleData(false,0,[{at:1,signals:[['appearance/coat',true]]},{at:2,signals:[['appearance/plain',true]]},{at:4,signals:[['appearance/coat',true]]}]),model=await prepareCharacterModel(source),a=await createCharacterRun(model,d),b=await createCharacterRun(model,d);await through(a,2n);await through(b,2n);exact(a,b);
 const early=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,early);for(const r of [a,b,early])await through(r,3n);exact(a,b);exact(a,early);
 const late=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,late);while(await a.settleNextInstant())for(const r of [b,early,late]){expect(await r.settleNextInstant()).toBe(true);exact(a,r);}expect(a.snapshot().clock).toBe(10n);expect(a.diagnostic()).toBeUndefined();expect(personHistory(belief(a,other))).toHaveLength(1);console.info('M25 exact repeat/restores2/3 to10 PASS');
},220000);

it('controls: late shared-state rollback',async()=>{
 const source=peopleSource(),data=peopleData(false,0,[{at:1,signals:[['appearance/coat',true]]},{at:3,signals:[['appearance/plain',true]]}]),model=await prepareCharacterModel(source),r=await createCharacterRun(model,data);await through(r,1n);let checkpoint=r.snapshot();while(r.snapshot().clock<3n){checkpoint=r.snapshot();await r.settleNextInstant();}
 const events=outputs(r.snapshot().trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===3n),count=new Set(events.map(t=>key(f(rec(f(t,4n),130n),1n)))).size;
 const failed=await createCharacterRun(await prepareCharacterModel(workLimit(source,BigInt(count-1))),data);await through(failed,checkpoint.clock);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(personHistory(belief(failed))).toHaveLength(1);expect(belief(failed,other)).toBeUndefined();console.info('M25 late rollback PASS events='+count);
},160000);
