import {it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {randomDrawRecord} from '../assembled/codecs';
import {personPath,personHistory} from '../assembled/social';
import {relationshipPath,relationshipHistory,REL_APPRAISAL} from '../assembled/relationship';
import {resolutionHistory} from '../assembled/recognitionState';
import {OBSERVER} from '../assembled/recognition';
import {INITIAL_RECOGNITION_DERIVATION,currentRecognitionResolution,type PermittedRecognitionCueEvidence} from '../semanticBinding/recognition';
import {restorePerceptualReferentId} from '../semanticBinding/semanticCodecs';
import {SemanticMutationAuthority as OWNER} from '../semanticBinding/semanticStateAuthority';
import {C} from './fixtures/campaign2Cognitive';
import {workLimit} from './fixtures/assembledCharacter';
import {encounterModelSource,encounterData} from './fixtures/assembledEncounter';
import {catalogSource,catalogData,entriesFor,candidate,declaration,target,other,decode,items,key,enc,type Frame,type Entry} from './fixtures/assembledRecognitionCatalog';
import {through,finish,outputs,decisions,mapFromDecision,draws,choice,type Run} from './fixtures/assembledComparison';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const belief=(r:Run)=>state(r).read(personPath(C,target)).value;
const history=(r:Run)=>state(r).read(relationshipPath(C,target)).value;
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const reports=(r:Run,name:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&key(v.items[0])===key(text(name))).map(v=>items(v,'list'));
const mapped=(shared:boolean,seed:number,map:ReturnType<typeof mapFromDecision>)=>{const d=catalogData(shared,seed);return {...d,orderedInputs:enc(list([map.canonicalValue,...items(decode(d.orderedInputs),'list')]))};};
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

function directRecognitionLaw(run:Run){
 const history=resolutionHistory(state(run));let comparisons=0;
 for(const evaluation of outputs(run.snapshot().outputs,234n)){
  const at=uint(f(evaluation,9n)),track=restorePerceptualReferentId(f(evaluation,4n));
  const prior=currentRecognitionResolution(history.filter(h=>h.occurredAt<at),OBSERVER,track);
  const cues:PermittedRecognitionCueEvidence[]=outputs(run.snapshot().outputs,232n).filter(v=>uint(f(v,9n))===at).map(v=>({recognitionCueEvidenceId:uint(id(f(v,1n)).payload),experienceId:uint(id(f(v,2n)).payload),observerId:OBSERVER,perceptualReferentId:restorePerceptualReferentId(f(v,4n)),candidateSemanticReferentId:key(f(v,5n)),recognitionCueSource:{kind:'retained-template-match',recognitionTemplateId:txt(id(f(rec(f(v,6n),230n),2n)).payload)},cuePolarity:uint(f(v,7n))===1n?'SupportsCandidate':'ContradictsCandidate',supportingExperienceEvidenceRefs:[],occurredAt:at,transformationVersion:txt(f(v,10n))}));
  // Direct law comparison; full evidence-reference admission is covered by unchanged C1 tests.
  const expected=INITIAL_RECOGNITION_DERIVATION.derive(cues,prior?.resolution.kind==='asserted-candidate'?prior.resolution.candidateSemanticReferentId:undefined),actual=rec(f(evaluation,8n),233n);
  expect(uint(f(actual,1n))).toBe(expected.kind==='no-update'?1n:expected.kind==='assert-unique-candidate'?2n:3n);
  if(expected.kind==='assert-unique-candidate')expect(key(f(actual,3n))).toBe(expected.candidateSemanticReferentId);
  if(expected.kind==='no-update')expect(uint(f(actual,2n))).toBe(BigInt(['NoQualifyingCandidate','AmbiguousCandidates','SameCandidateMaintained'].indexOf(expected.reason)+1));comparisons++;
 }
 expect(comparisons).toBeGreaterThan(0);return comparisons;
}

it('matrix: identical appearance with shared knowledge yields ambiguity, learning and coupled choice differences',async()=>{
 const models=await Promise.all([false,true].map(shared=>prepareCharacterModel(catalogSource(entriesFor(shared))))),maps=[];
 for(const [i,shared]of [false,true].entries()){const r=await createCharacterRun(models[i],catalogData(shared));await through(r,3n);maps.push(mapFromDecision(r));}
 console.info('M24_MAPS '+JSON.stringify(maps.map(m=>key(m.canonicalValue))));
 const changed:number[]=[];let common=0,conditionalTies=0;
 for(let seed=0;seed<8;seed++){
  const a=await createCharacterRun(models[0],mapped(false,seed,maps[0])),b=await createCharacterRun(models[1],mapped(true,seed,maps[1]));await through(a,3n);await through(b,3n);
  expect(personHistory(belief(a))).toHaveLength(2);expect(relationshipHistory(history(a))).toHaveLength(2);expect(belief(b)).toBeUndefined();expect(history(b)).toBeUndefined();expect(resolutionHistory(state(a))).toHaveLength(1);expect(resolutionHistory(state(b))).toHaveLength(0);
  expect(outputs(a.snapshot().outputs,232n)).toHaveLength(2);expect(outputs(b.snapshot().outputs,232n)).toHaveLength(4);
  for(const r of [a,b]){expect(reports(r,REL_APPRAISAL).at(-1)![3]).toEqual(history(r)??list([]));directRecognitionLaw(r);}
  expect(f(decisions(a)[0],3n)).not.toEqual(f(decisions(b)[0],3n));
  const aa=draws(a),bb=draws(b),by=new Map(bb.map(v=>[key(f(v,2n)),v]));let paired=0;
  for(const x of aa){const y=by.get(key(f(x,2n)));if(!y)continue;paired++;const ax=items(f(x,7n),'list'),ay=items(f(y,7n),'list');for(let i=0;i<Math.min(ax.length,ay.length);i++){expect(f(rec(ax[i],410n),1n)).toEqual(f(rec(ay[i],410n),1n));expect(f(rec(ax[i],410n),2n)).toEqual(f(rec(ay[i],410n),2n));}}
  const sa=scoreEvidence(a),sb=scoreEvidence(b);expect(sa.reasons.map(x=>key(f(x,2n))).sort()).toEqual(sb.reasons.map(x=>key(f(x,2n))).sort());
  const unmatched=[...aa.filter(x=>!bb.some(y=>key(f(x,2n))===key(f(y,2n)))),...bb.filter(y=>!aa.some(x=>key(f(x,2n))===key(f(y,2n))))];
  if(unmatched.length){expect(unmatched).toHaveLength(1);const tied=sa.tieDraw?sa:sb,unique=sa.tieDraw?sb:sa;expect(unique.tieDraw).toBeUndefined();expect(unique.leaders).toHaveLength(1);expect(unmatched[0]).toEqual(tied.tieDraw);conditionalTies++;}
  expect(paired).toBeGreaterThan(0);common+=paired;if(choice(a)!==choice(b))changed.push(seed);
  console.info('M24_CELL '+JSON.stringify({seed,unique:choice(a),ambiguous:choice(b),common:paired,unmatched:unmatched.length,drawsA:aa.map(key),drawsB:bb.map(key)}));await finish(a);await finish(b);
 }
 expect(changed.length).toBeGreaterThan(0);console.info('M24_MATRIX '+JSON.stringify({runs:16,changed,common,conditionalTies,terminal:10}));
},550000);

it('controls: catalog domains, canonical ordering, private evidence and correction',async()=>{
 const entries=entriesFor(),model=await prepareCharacterModel(catalogSource(entries)),frames:Frame[]=[{at:1,signals:[['appearance/coat',true]]},{at:2,signals:[['appearance/coat',true]],continuity:true}];
 const run=async(fs:Frame[],es=entries,at=2n)=>{const m=es===entries?model:await prepareCharacterModel(catalogSource(es)),r=await createCharacterRun(m,catalogData(false,0,fs,es));await through(r,at);return r;};
 const base=await run(frames),hidden=await run(frames.map(x=>({...x,hidden:other}))),reordered=await run(frames,[...entries].reverse().map(e=>({...e,templates:[...e.templates].reverse()})));
 for(const r of [hidden,reordered]){expect(r.snapshot().outputs).toEqual(base.snapshot().outputs);expect(r.snapshot().state).toEqual(base.snapshot().state);}
 const denied=await run(frames.map(x=>({...x,access:false}))),deniedOther=await run(frames.map(x=>({...x,access:false,hidden:other,signals:[['appearance/stripe',false]],continuity:false})));
 expect(denied.snapshot().outputs).toEqual(deniedOther.snapshot().outputs);expect(denied.snapshot().state).toEqual(deniedOther.snapshot().state);
 for(const count of [1,8]){const es=Array.from({length:count},(_,i)=>({candidate:i?candidate(i):target,templates:Array.from({length:4},(_,j)=>'boundary/'+i+'/'+j)}));const all=es.flatMap(e=>e.templates.map(t=>[t,true] as [string,boolean]));const r=await run([{at:1,signals:all}],es,1n);expect(outputs(r.snapshot().outputs,232n)).toHaveLength(4*count);expect(resolutionHistory(state(r))).toHaveLength(count===1?1:0);directRecognitionLaw(r);}
 const corrected=await run([{at:1,signals:[['appearance/coat',true]]},{at:2,signals:[['appearance/voice',false]],continuity:true},{at:4,signals:[['appearance/voice',true]],continuity:true},{at:6,signals:[['appearance/coat',true],['appearance/plain',true]],continuity:true}]);
 const old=relationshipHistory(history(corrected))[0];expect(relationshipHistory(history(corrected))).toHaveLength(1);expect(resolutionHistory(state(corrected)).at(-1)!.resolution).toEqual({kind:'withdrawn'});
 await finish(corrected);expect(resolutionHistory(state(corrected))).toHaveLength(3);expect(relationshipHistory(history(corrected))).toHaveLength(3);expect(relationshipHistory(history(corrected))[0]).toEqual(old);expect(personHistory(belief(corrected))).toHaveLength(3);directRecognitionLaw(corrected);
 console.info('M24 boundary controls PASS:1/8 candidates,4 templates each,32 signals; canonical declaration order; hidden/denied; contradiction/withdrawal/reassertion/prior-under-ambiguity; direct C1 law');
},350000);

it('controls: exact repeat and restores2/3 through10',async()=>{
 const source=catalogSource(),d=catalogData(),model=await prepareCharacterModel(source),a=await createCharacterRun(model,d),b=await createCharacterRun(model,d);await through(a,2n);await through(b,2n);exact(a,b);
 const early=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,early);for(const r of [a,b,early])await through(r,3n);exact(a,b);exact(a,early);
 const late=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,late);while(await a.settleNextInstant())for(const r of [b,early,late]){expect(await r.settleNextInstant()).toBe(true);exact(a,r);}expect(a.snapshot().clock).toBe(10n);expect(a.diagnostic()).toBeUndefined();console.info('M24 exact repeat/restores2/3 to10 PASS');
},200000);

it('controls: configuration admission, immutable knowledge and late rollback',async()=>{
 const es=entriesFor(),source=catalogSource(),model=await prepareCharacterModel(source),d=catalogData();
 const bad:Entry[][]=[[],[es[1]],[...es,es[0]],Array.from({length:9},(_,i)=>({candidate:i?candidate(i):target,templates:['t/'+i]})),[{candidate:target,templates:[]}],[{candidate:target,templates:['x','x']}],[{candidate:target,templates:['a','b','c','d','e']}],[{candidate:target,templates:['x'.repeat(81)]}],[{candidate:unsigned(1),templates:['x']}]];
 for(const entries of bad)await expect(prepareCharacterModel(catalogSource(entries))).rejects.toThrow();
 const slots=items(decode(source.registry),'list'),decl=items(slots[21],'list');await expect(prepareCharacterModel({...source,registry:enc(list([...slots.slice(0,21),list([decl[0],decl[1],list([])])]))})).rejects.toThrow('authority manifest');
 await expect(prepareCharacterModel({...source,registry:enc(list([...slots.slice(0,21),items(decode(encounterModelSource().registry),'list')[21]]))})).rejects.toThrow('catalog declaration');
 await expect(prepareCharacterModel({...encounterModelSource(),registry:source.registry})).rejects.toThrow('declaration');
 for(const signals of [[['unknown',true]],[['appearance/coat',true],['appearance/coat',false]]] as [string,boolean][][])await expect(createCharacterRun(model,catalogData(false,0,[{at:1,signals}]))).rejects.toThrow('recognition');
 await expect(createCharacterRun(model,encounterData())).rejects.toThrow();
 const compiled=await compileCharacterModel(source),component=await compileCharacterState(compiled),initial=component.initialState(d.initialState),entry=initial.entries().find(e=>e.path.rootStateTypeId===243n)!;
 await expect(createCharacterRun(model,{...d,initialState:enc(new AuthoritativeState(initial.entries().filter(e=>key(e.value)!==key(entry.value))).canonicalValue())})).rejects.toThrow('catalog');
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:entry.path,expected:{presence:true,value:entry.value},newValue:entry.value}]},OWNER.Perception)).toThrow();
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:entry.path,expected:{presence:true,value:entry.value},newValue:entry.value}]},OWNER.RecognitionKnowledge)).toThrow('immutable');
 const data=catalogData(false,0,[{at:1,signals:[['appearance/coat',true]]},{at:3,signals:[['appearance/voice',false]],continuity:true}]),r=await createCharacterRun(model,data);await through(r,1n);let checkpoint=r.snapshot();while(r.snapshot().clock<3n){checkpoint=r.snapshot();await r.settleNextInstant();}
 const events=outputs(r.snapshot().trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===3n),count=new Set(events.map(t=>key(f(rec(f(t,4n),130n),1n)))).size;
 const failed=await createCharacterRun(await prepareCharacterModel(workLimit(source,BigInt(count-1))),data);await through(failed,checkpoint.clock);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(resolutionHistory(state(failed))).toHaveLength(1);console.info('M24 negative admission/ownership/rollback PASS:events='+count);
},200000);
