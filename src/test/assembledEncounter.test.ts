import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {compileCharacterInputs} from '../assembled/inputs';
import {createRelationshipExecution} from '../assembled/relationshipExecution';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {randomDrawRecord} from '../assembled/codecs';
import {personPath,personHistory,PERSON_OWNER,SOCIAL_OBSERVATION,SOCIAL_STAGES,SOCIAL_EVIDENCE} from '../assembled/social';
import {relationshipPath,relationshipHistory,relationshipFold,REL_OBSERVATION,REL_APPRAISAL,REL_EVIDENCE,REL_UPDATE,REL_STAGES} from '../assembled/relationship';
import {resolutionHistory,trackState} from '../assembled/recognitionState';
import {C} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';
import {relationshipFrame} from './fixtures/assembledRelationship';
import {recognitionData} from './fixtures/assembledRecognition';
import {encounterModelSource,encounterData,target,other,decode,items,key,enc,type EncounterFrame} from './fixtures/assembledEncounter';
import {through,finish,outputs,decisions,mapFromDecision,draws,choice,type Run} from './fixtures/assembledComparison';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const history=(r:Run)=>state(r).read(relationshipPath(C,target)).value;
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const reports=(r:Run,name:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(name))).map(v=>items(v,'list'));
const mapped=(participant:boolean,seed:number,map:ReturnType<typeof mapFromDecision>)=>{const d=encounterData(participant,seed);return {...d,orderedInputs:enc(list([map.canonicalValue,...items(decode(d.orderedInputs),'list')]))};};
const signedValue=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('signed');return v.value;};
// Amendment1: independently rebuild scores and verify the actual conditional draw.
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

it('matrix: shared recognition preserves equal belief while participation changes coupled choice',async()=>{
 const model=await prepareCharacterModel(encounterModelSource()),maps=[];
 for(const participant of [true,false]){const r=await createCharacterRun(model,encounterData(participant));await through(r,3n);maps.push(mapFromDecision(r));}
 console.info('M23_MAPS '+JSON.stringify(maps.map(m=>key(m.canonicalValue))));
 const changed:number[]=[];let common=0,conditionalTies=0;
 for(let seed=0;seed<8;seed++){
  const a=await createCharacterRun(model,mapped(true,seed,maps[0])),b=await createCharacterRun(model,mapped(false,seed,maps[1]));await through(a,3n);await through(b,3n);
  expect(belief(a)).toEqual(belief(b));expect(personHistory(belief(a))).toHaveLength(2);expect(resolutionHistory(state(a))).toEqual(resolutionHistory(state(b)));
  expect(relationshipHistory(history(a))).toHaveLength(2);expect(history(b)).toBeUndefined();
  for(const [i,r]of [a,b].entries()){
   const report=reports(r,REL_APPRAISAL).at(-1)!;expect(report[3]).toEqual(history(r)??list([]));expect(report[6]).toBe(i===0);
   const joined=items(report[9],'list');expect(joined.length).toBeGreaterThan(0);for(const v of joined)expect(items(items(v,'list')[3],'list')).toHaveLength(i?0:2);
   const social=reports(r,SOCIAL_OBSERVATION),relation=reports(r,REL_OBSERVATION);expect(social).toHaveLength(2);expect(relation).toHaveLength(2);
   for(let n=0;n<2;n++){const so=items(social[n][1],'list'),ro=items(relation[n][1],'list');expect(ro[0]).toEqual(so[0]);expect(ro[1]).toEqual(so[1]);expect(ro[2]).toEqual(target);expect(ro[3]).toEqual(so[3]);}
   const trace=outputs(r.snapshot().trace,160n),events=trace.map(t=>rec(f(t,4n),130n));
   for(const stage of REL_STAGES)expect(events.filter(e=>key(f(e,5n))===key(stage))).toHaveLength(0);
   // Inspect shared phases by event type from the scheduler record's field5.
   expect(events.filter(e=>key(f(e,5n))===key(SOCIAL_STAGES[3]))).toHaveLength(2);
   for(const e of events.filter(e=>key(f(e,5n))===key(REL_EVIDENCE))){const peer=events.find(p=>key(f(p,5n))===key(SOCIAL_EVIDENCE)&&key(f(p,2n))===key(f(e,2n)))!;expect(f(e,8n)).toEqual(f(peer,8n));expect(items(f(e,6n),'list')[1]).toEqual(items(f(peer,6n),'list')[1]);const parent=events.find(p=>key(f(p,1n))===key(items(f(e,8n),'list')[0]))!;expect(uint(f(parent,3n))).toBe(127n);}
   expect(trackState(state(r)).activePerceptualReferentIds).toHaveLength(1);
  }
  expect(f(decisions(a)[0],3n)).not.toEqual(f(decisions(b)[0],3n));
  const aa=draws(a),bb=draws(b),by=new Map(bb.map(v=>[key(f(v,2n)),v]));let paired=0;
  for(const x of aa){const y=by.get(key(f(x,2n)));if(!y)continue;paired++;const ax=items(f(x,7n),'list'),ay=items(f(y,7n),'list');for(let i=0;i<Math.min(ax.length,ay.length);i++){expect(f(rec(ax[i],410n),1n)).toEqual(f(rec(ay[i],410n),1n));expect(f(rec(ax[i],410n),2n)).toEqual(f(rec(ay[i],410n),2n));}}
  const sa=scoreEvidence(a),sb=scoreEvidence(b);expect(sa.reasons.map(x=>key(f(x,2n))).sort()).toEqual(sb.reasons.map(x=>key(f(x,2n))).sort());
  const unmatched=[...aa.filter(x=>!bb.some(y=>key(f(x,2n))===key(f(y,2n)))),...bb.filter(y=>!aa.some(x=>key(f(x,2n))===key(f(y,2n))))];
  if(unmatched.length){expect(unmatched).toHaveLength(1);const tied=sa.tieDraw?sa:sb,unique=sa.tieDraw?sb:sa;expect(unique.tieDraw).toBeUndefined();expect(unique.leaders).toHaveLength(1);expect(unmatched[0]).toEqual(tied.tieDraw);conditionalTies++;}
  expect(paired).toBeGreaterThan(0);common+=paired;if(choice(a)!==choice(b))changed.push(seed);
  console.info('M23_CELL '+JSON.stringify({seed,participant:choice(a),witness:choice(b),common:paired,unmatched:unmatched.length,drawsA:aa.map(key),drawsB:bb.map(key)}));await finish(a);await finish(b);
 }
 expect(changed.length).toBeGreaterThan(0);console.info('M23_MATRIX '+JSON.stringify({runs:16,changed,common,conditionalTies,terminal:10}));
},550000);

it('controls: shared identities, privacy, evidence separation and prospective correction',async()=>{
 const model=await prepareCharacterModel(encounterModelSource()),run=async(frames:EncounterFrame[],at=2n)=>{const r=await createCharacterRun(model,encounterData(true,0,frames));await through(r,at);return r;};
 const frames:EncounterFrame[]=[{at:1,signals:[[0,true]],display:1},{at:2,signals:[[0,true]],continuity:true,display:1}];
 const base=await run(frames),hidden=await run(frames.map(x=>({...x,hidden:other,kind:2})));
 expect(hidden.snapshot().outputs).toEqual(base.snapshot().outputs);expect(hidden.snapshot().state).toEqual(base.snapshot().state);
 const denied=await run(frames.map(x=>({...x,access:false}))),deniedOther=await run(frames.map(x=>({...x,access:false,hidden:other,signals:[[1,true]],continuity:false,kind:2,participant:false,display:2})));
 expect(denied.snapshot().outputs).toEqual(deniedOther.snapshot().outputs);expect(denied.snapshot().state).toEqual(deniedOther.snapshot().state);expect(history(denied)).toBeUndefined();expect(belief(denied)).toBeUndefined();
 for(const signals of [[[1,true]],[],[[0,true],[1,true]]] as [number,boolean][][]){const r=await run(frames.map(x=>({...x,signals})));expect(history(r)).toBeUndefined();expect(belief(r)).toBeUndefined();}
 for(const fields of [{participant:false},{ownAccess:false},{kind:3,display:3}]){const r=await run(frames.map(x=>({...x,...fields})));expect(belief(r)).toEqual(belief(base));expect(history(r)).toBeUndefined();}
 const corrected=await run([{at:1,signals:[[1,true]]},{at:2,signals:[[0,true]],continuity:true},{at:4,signals:[[0,false]],continuity:true},{at:6,signals:[[0,true]],continuity:true}]);
 expect(relationshipHistory(history(corrected))).toHaveLength(1);const old=relationshipHistory(history(corrected))[0];expect(personHistory(belief(corrected))).toHaveLength(1);
 await through(corrected,4n);expect(relationshipHistory(history(corrected))).toEqual([old]);expect(resolutionHistory(state(corrected)).at(-1)!.resolution).toEqual({kind:'withdrawn'});
 await finish(corrected);expect(relationshipHistory(history(corrected))).toHaveLength(2);expect(relationshipHistory(history(corrected))[0]).toEqual(old);expect(personHistory(belief(corrected))).toHaveLength(2);expect(relationshipFold(history(corrected)).comfort).toBe(true);
 console.info('M23 controls:11 runs; fixed evidence hides truth; denied fields invisible; other/unknown/ambiguous exclude both; witness/statement/own denial preserve belief; correction/withdrawal preserve history');
},300000);

it('controls: exact repeat and restores2/3 to10',async()=>{
 const source=encounterModelSource(),d=encounterData(),m=await prepareCharacterModel(source),a=await createCharacterRun(m,d),b=await createCharacterRun(m,d);
 await through(a,2n);await through(b,2n);exact(a,b);const early=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,early);
 for(const r of [a,b,early])await through(r,3n);exact(a,b);exact(a,early);const late=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,late);
 while(await a.settleNextInstant())for(const r of [b,early,late]){expect(await r.settleNextInstant()).toBe(true);exact(a,r);}expect(a.snapshot().clock).toBe(10n);expect(a.diagnostic()).toBeUndefined();
 console.info('M23 exact state/output/trace/save repeat and restores2/3 to10 PASS');
},180000);

it('controls: no bypass, foreign owner, forged child and late atomic rollback',async()=>{
 const source=encounterModelSource(),d=encounterData(true,0,[{at:1,signals:[[0,true]]},{at:3,signals:[[0,true]],continuity:true}]),model=await prepareCharacterModel(source),compiled=await compileCharacterModel(source),component=await compileCharacterState(compiled);
 await expect(createCharacterRun(model,recognitionData())).rejects.toThrow();
 await expect(createCharacterRun(model,{...d,orderedInputs:enc(list([...items(decode(d.orderedInputs),'list'),relationshipFrame({at:2})]))})).rejects.toThrow('forbids separate');
 const bad=items(decode(d.orderedInputs),'list').map(v=>{const x=[...items(v,'list')];if(x[1]&&key(x[1])===key(unsigned(110)))x[2]=REL_UPDATE;return list(x);});await expect(createCharacterRun(model,{...d,orderedInputs:enc(list(bad))})).rejects.toThrow();
 const r=await createCharacterRun(model,d);await through(r,1n);const acquired=state(r),p=relationshipPath(C,target),value=acquired.read(p).value!;
 expect(()=>component.stateModel.applyPatch(acquired,{operations:[{kind:'set',path:p,expected:{presence:true,value},newValue:value}]},PERSON_OWNER)).toThrow();
 const input=await compileCharacterInputs(compiled,component,d),handler=createRelationshipExecution(C,compiled.relationship!,component.stateModel,[],compiled.modelIdentity.value,input.runIdentity.value,true);handler.begin(1n);
 const fake={...input.socialEvents[0],phase:130n,eventTypeId:REL_EVIDENCE,payload:list([])};expect(()=>handler.execute({event:fake,state:acquired,instant:fake.dueAt,allocateRuntimeId:()=>{throw Error('must reject before allocation');}})).toThrow('unbound child');handler.close();
 let checkpoint=r.snapshot();while(r.snapshot().clock<3n){checkpoint=r.snapshot();await r.settleNextInstant();}
 const trace=outputs(r.snapshot().trace,160n),count=new Set(trace.filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===3n).map(t=>key(f(rec(f(t,4n),130n),1n)))).size;
 const failed=await createCharacterRun(await prepareCharacterModel(workLimit(source,BigInt(count-1))),d);await through(failed,checkpoint.clock);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(relationshipHistory(history(failed))).toHaveLength(1);
 console.info('M23 admission/authority/binder and late rollback PASS: events='+count);
},180000);
