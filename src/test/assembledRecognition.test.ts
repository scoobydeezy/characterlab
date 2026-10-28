import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {AuthoritativeState,restoreAuthoritativeState} from '../substrate/state';
import {compileCharacterModel} from '../assembled/model';
import {compileCharacterState} from '../assembled/state';
import {workLimit,replace} from './fixtures/assembledCharacter';
import {configurationData} from './fixtures/assembledConfiguration';
import {SOCIAL_SOURCE} from '../assembled/social';
import {sid} from '../assembled/skill';
import {SemanticMutationAuthority as OWNER,nextTrackSequencePath,activeContinuantFilePath,resolutionRecordPath} from '../semanticBinding/semanticStateAuthority';
import {restorePerceptualReferentId} from '../semanticBinding/semanticCodecs';
import {INITIAL_RECOGNITION_DERIVATION,currentRecognitionResolution,type PermittedRecognitionCueEvidence} from '../semanticBinding/recognition';
import {randomDrawRecord} from '../assembled/codecs';
import {list,text,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {personPath,personHistory,SOCIAL_APPRAISAL} from '../assembled/social';
import {resolutionHistory,trackState} from '../assembled/recognitionState';
import {readResolution,OBSERVER} from '../assembled/recognition';
import {C} from './fixtures/campaign2Cognitive';
import {recognitionModelSource,recognitionData,target,other,decode,items,key,enc,type CueFrame} from './fixtures/assembledRecognition';
import {through,finish,outputs,decisions,mapFromDecision,draws,choice,type Run} from './fixtures/assembledComparison';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const reports=(r:Run,name:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&txt(v.items[0])===name).map(v=>items(v,'list'));
let prepared:Promise<{model:Awaited<ReturnType<typeof prepareCharacterModel>>;maps:ReturnType<typeof mapFromDecision>[]}>|undefined;
const fixture=()=>prepared??=(async()=>{const model=await prepareCharacterModel(recognitionModelSource()),maps=[];for(const cue of [true,false]){const r=await createCharacterRun(model,recognitionData(cue));await through(r,3n);maps.push(mapFromDecision(r));console.info('M22 preflight '+JSON.stringify({targetCue:cue,draws:draws(r).length,belief:personHistory(state(r).read(personPath(C,target)).value).length,resolutions:resolutionHistory(state(r)).length}));}return {model,maps};})();
const mapped=(cue:boolean,seed:number,map:ReturnType<typeof mapFromDecision>)=>{const d=recognitionData(cue,seed);return {...d,orderedInputs:enc(list([map.canonicalValue,...items(decode(d.orderedInputs),'list')]))};};
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
describe('M22 observer-local recognition in one character',()=>{
 it('matrix: recognition evidence changes learned belief, reasons and coupled choice',async()=>{
  const {model,maps}=await fixture();const changed:number[]=[];let common=0,conditionalTies=0;
  for(let seed=0;seed<8;seed++){
   const a=await createCharacterRun(model,mapped(true,seed,maps[0])),b=await createCharacterRun(model,mapped(false,seed,maps[1]));await through(a,3n);await through(b,3n);
   for(const [i,r]of [a,b].entries()){const s=state(r),history=resolutionHistory(s);expect(history).toHaveLength(1);expect(history[0].resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(i?other:target)});expect(trackState(s).activePerceptualReferentIds).toHaveLength(1);expect(outputs(r.snapshot().outputs,225n).length).toBeGreaterThan(0);expect(personHistory(s.read(personPath(C,target)).value)).toHaveLength(i?0:2);expect(reports(r,SOCIAL_APPRAISAL).at(-1)![3]).toEqual(list(personHistory(s.read(personPath(C,target)).value)));}
   expect(f(decisions(a)[0],3n)).not.toEqual(f(decisions(b)[0],3n));const aa=draws(a),bb=draws(b),by=new Map(bb.map(v=>[key(f(v,2n)),v]));let paired=0;
   for(const x of aa){const y=by.get(key(f(x,2n)));if(!y)continue;paired++;const ax=items(f(x,7n),'list'),ay=items(f(y,7n),'list');for(let i=0;i<Math.min(ax.length,ay.length);i++){expect(f(rec(ax[i],410n),1n)).toEqual(f(rec(ay[i],410n),1n));expect(f(rec(ax[i],410n),2n)).toEqual(f(rec(ay[i],410n),2n));}}
   const sa=scoreEvidence(a),sb=scoreEvidence(b);
   expect(sa.reasons.map(x=>key(f(x,2n))).sort()).toEqual(sb.reasons.map(x=>key(f(x,2n))).sort());
   const unmatched=[...aa.filter(x=>!bb.some(y=>key(f(x,2n))===key(f(y,2n)))),...bb.filter(y=>!aa.some(x=>key(f(x,2n))===key(f(y,2n))))];
   if(unmatched.length){expect(unmatched).toHaveLength(1);const tied=sa.tieDraw?sa:sb,unique=sa.tieDraw?sb:sa;expect(unique.tieDraw).toBeUndefined();expect(unique.leaders).toHaveLength(1);expect(unmatched[0]).toEqual(tied.tieDraw);conditionalTies++;}
   expect(paired).toBeGreaterThan(0);common+=paired;if(choice(a)!==choice(b))changed.push(seed);console.info('M22 cell '+JSON.stringify({seed,a:choice(a),b:choice(b),common:paired,unmatched:aa.length+bb.length-2*paired}));await finish(a);await finish(b);
  }
  expect(changed.length).toBeGreaterThan(0);console.info('M22 matrix '+JSON.stringify({runs:16,changed,conditionalTies,common,terminal:10}));
 },550000);
});

// Bounded owner-approved diagnosis. This does not replace or relax the matrix gate.
it('diagnosis: unchanged M22 seed6 scores and conditional tie',async()=>{
 const {model,maps}=await fixture(); // Two original identity-only setup runs, if authorized.
 const signed=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('signed score');return v.value;};
 const action=(v:CanonicalValue)=>txt(id(f(rec(v,395n),2n)).payload);
 const projections=[];
 for(const [branch,map]of maps.entries())console.info('M22_DIAG_MAP '+JSON.stringify({branch:branch?'other':'target',comparisonMap:key(map.canonicalValue)}));
 for(const [branch,cue]of [true,false].entries()){
  const input=mapped(cue,6,maps[branch]),run=await createCharacterRun(model,input);await through(run,3n);
  expect(run.diagnostic()).toBeUndefined();
  // Reconstructed address map must equal the original preflight map, without reading outcomes.
  expect(mapFromDecision(run).canonicalValue).toEqual(maps[branch].canonicalValue);
  const decision=decisions(run)[0],context=rec(f(decision,3n),408n),status=rec(f(decision,4n),419n);
  expect(uint(f(status,1n))).toBe(3n);
  const result=rec(f(status,2n),420n),raw=rec(f(context,2n),403n),options=rec(f(raw,2n),398n);
  const candidates=items(f(options,3n),'list').map(v=>f(rec(v,397n),1n));
  const scores=new Map(candidates.map(v=>[key(v),0n]));
  const nuclei=items(f(context,3n),'list');
  const reasons=items(f(result,9n),'list').map(v=>{
   const sample=rec(v,422n),nk=rec(f(sample,1n),404n),candidate=f(nk,1n);
   const nucleus=nuclei.find(n=>key(f(rec(n,407n),1n))===key(nk))!;
   const draw=randomDrawRecord(f(sample,5n)),face=uint(f(sample,6n));
   const standing=signed(f(sample,3n)),situational=signed(f(sample,4n));
   const contribution=(uint(f(nk,4n))===1n?1n:-1n)*(face+standing+situational);
   expect(contribution).toBe(signed(f(sample,7n)));expect(face).toBe(uint(f(draw,3n))+1n);
   scores.set(key(candidate),scores.get(key(candidate))!+contribution);
   return {action:action(candidate),nucleus:key(nucleus),effectiveKey:key(f(draw,2n)),draw:key(draw),
    span:uint(f(draw,4n)).toString(),face:face.toString(),standing:standing.toString(),situational:situational.toString(),contribution:contribution.toString(),
    attempts:items(f(draw,7n),'list').map(a=>{const x=rec(a,410n);return {index:uint(f(x,1n)).toString(),raw:uint(f(x,2n)).toString(),rejected:f(x,3n)};})};
  });
  const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=candidates.filter(c=>scores.get(key(c))===top).sort((a,b)=>key(a)<key(b)?-1:1);
  const tie=rec(f(result,10n),423n),hasTie=uint(f(tie,1n))===2n;
  expect(hasTie).toBe(leaders.length>1);
  if(hasTie)expect(f(tie,2n)).toEqual(list(leaders));else expect(f(result,1n)).toEqual(leaders[0]);
  const projection={sourceCommit:'522f18dd',branch:cue?'target':'other',seed:6,instant:3,runIdentity:key(decode(run.runIdentity())),
   comparisonMap:key(maps[branch].canonicalValue),resolution:key(f(decision,1n)),mode:uint(f(result,8n)).toString(),reasons,
   scores:candidates.map(c=>({action:action(c),score:scores.get(key(c))!.toString()})),leaders:leaders.map(action),
   tie:hasTie?{canonical:key(tie),draw:key(f(tie,3n)),selected:action(f(tie,4n))}:null,choice:choice(run)};
  projections.push(projection);console.info('M22_DIAG '+JSON.stringify(projection));
 }
 const [a,b]=projections;expect(a.reasons).toHaveLength(3);expect(b.reasons).toHaveLength(3);
 for(const x of a.reasons){const y=b.reasons.find(v=>v.effectiveKey===x.effectiveKey);expect(y).toBeDefined();expect(x.attempts).toEqual(y!.attempts);}
 console.info('M22_DIAG_SUMMARY '+JSON.stringify(projections.map(p=>({branch:p.branch,scores:p.scores,leaders:p.leaders,tie:!!p.tie,choice:p.choice,reasons:p.reasons.map(({action,span,face,standing,situational,contribution})=>({action,span,face,standing,situational,contribution}))}))));
},110000);

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
it('controls: observer boundary, ambiguous cues, appearance and correction',async()=>{
 const {model}=await fixture(),run=async(frames:CueFrame[],at=2n)=>{const r=await createCharacterRun(model,recognitionData(true,0,frames));await through(r,at);return r;};
 const frames:CueFrame[]=[{at:1,signals:[[0,true]]},{at:2,signals:[[0,true]],continuity:true}];
 const base=await run(frames),hidden=await run(frames.map(x=>({...x,hidden:other})));
 expect(hidden.snapshot().outputs).toEqual(base.snapshot().outputs);expect(hidden.snapshot().state).toEqual(base.snapshot().state);
 const denied=await run(frames.map(x=>({...x,access:false}))),deniedOther=await run(frames.map(x=>({...x,signals:[[1,true]],form:false,continuity:false,hidden:other,access:false})));
 expect(deniedOther.snapshot().outputs).toEqual(denied.snapshot().outputs);expect(deniedOther.snapshot().state).toEqual(denied.snapshot().state);
 expect(trackState(state(denied)).activePerceptualReferentIds).toHaveLength(0);expect(resolutionHistory(state(denied))).toHaveLength(0);expect(personHistory(state(denied).read(personPath(C,target)).value)).toHaveLength(0);
 let comparisons=directRecognitionLaw(base)+directRecognitionLaw(hidden);
 for(const signals of [[],[[0,true],[1,true]]] as [number,boolean][][]){const r=await run([{at:1,signals},{at:2,signals,continuity:true}]);expect(resolutionHistory(state(r))).toHaveLength(0);expect(personHistory(state(r).read(personPath(C,target)).value)).toHaveLength(0);comparisons+=directRecognitionLaw(r);}
 for(const form of [false,null]){const r=await run(frames.map(x=>({...x,form})));const classifications=outputs(r.snapshot().outputs,225n);expect(classifications).toHaveLength(form===null?0:2);for(const c of classifications)expect(f(c,6n)).toBe(false);expect(resolutionHistory(state(r))[0].resolution).toEqual(resolutionHistory(state(base))[0].resolution);comparisons+=directRecognitionLaw(r);}
 // Truth remains target: first misidentify the other candidate, then correct, withdraw, and reassert.
 const corrected=await run([{at:1,signals:[[1,true]]},{at:2,signals:[[0,true]],continuity:true},{at:4,signals:[[0,false]],continuity:true},{at:6,signals:[[0,true]],continuity:true}],2n);
 const earlier=resolutionHistory(state(corrected));expect(earlier.map(x=>x.resolution)).toEqual([{kind:'asserted-candidate',candidateSemanticReferentId:key(other)},{kind:'asserted-candidate',candidateSemanticReferentId:key(target)}]);
 expect(personHistory(state(corrected).read(personPath(C,target)).value)).toHaveLength(1);await through(corrected,4n);expect(resolutionHistory(state(corrected)).at(-1)!.resolution).toEqual({kind:'withdrawn'});expect(personHistory(state(corrected).read(personPath(C,target)).value)).toHaveLength(1);
 await finish(corrected);const history=resolutionHistory(state(corrected));expect(history.slice(0,2)).toEqual(earlier);expect(history).toHaveLength(4);expect(history.at(-1)!.resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(target)});expect(personHistory(state(corrected).read(personPath(C,target)).value)).toHaveLength(2);expect(trackState(state(corrected)).activePerceptualReferentIds).toHaveLength(1);comparisons+=directRecognitionLaw(corrected);
 console.info('M22 boundary/correction:9 runs; exact hidden/access controls; missing/ambiguous; false distinct from absent; mistaken identity/replacement/withdrawal; direct law comparisons='+comparisons);
},240000);

it('controls: exact repeat and recognition restores2/3 through10',async()=>{
 const source=recognitionModelSource(),d=recognitionData(),{model}=await fixture(),a=await createCharacterRun(model,d),b=await createCharacterRun(model,d);
 await through(a,2n);await through(b,2n);exact(a,b);const restored=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,restored);
 for(const r of [a,b,restored])await through(r,3n);exact(a,b);exact(a,restored);const late=await restoreCharacterRun(source,{initialState:d.initialState,orderedInputs:d.orderedInputs,save:a.save()});exact(a,late);
 while(await a.settleNextInstant())for(const r of [b,restored,late]){expect(await r.settleNextInstant()).toBe(true);exact(a,r);}expect(a.snapshot().clock).toBe(10n);expect(a.diagnostic()).toBeUndefined();
 console.info('M22 continuation: exact state/output/trace/save repeat and restores2/3 to10');
},180000);

it('controls: forged knowledge, ownership, initial history and late atomic rollback',async()=>{
 const source=recognitionModelSource(),d=recognitionData(true,0,[{at:1,signals:[[0,true]]},{at:3,signals:[[1,true]],continuity:true}]),{model}=await fixture();
 const compiled=await compileCharacterModel(source),component=await compileCharacterState(compiled),initial=component.initialState(d.initialState),r=await createCharacterRun(model,d);await through(r,1n);
 const acquired=state(r),semantic=acquired.entries().filter(e=>[241n,244n].includes(e.path.rootStateTypeId));
 await expect(createCharacterRun(model,{...d,initialState:enc(new AuthoritativeState([...initial.entries(),...semantic]).canonicalValue())})).rejects.toThrow('initial recognition');
 const catalog=initial.entries().find(e=>e.path.rootStateTypeId===243n)!;
 await expect(createCharacterRun(model,{...d,initialState:enc(new AuthoritativeState(initial.entries().filter(e=>key(e.value)!==key(catalog.value))).canonicalValue())})).rejects.toThrow('catalog');
 const forged=replace(catalog.value,2n,C);
 await expect(createCharacterRun(model,{...d,initialState:enc(new AuthoritativeState(initial.entries().map(e=>e===catalog?{...e,value:forged}:key(e.value)===key(catalog.value)?{...e,value:forged}:e)).canonicalValue())})).rejects.toThrow('catalog');
 await expect(createCharacterRun(model,{...d,orderedInputs:configurationData().orderedInputs})).rejects.toThrow('source grammar');
 const slots=items(decode(source.registry),'list'),decl=items(slots[21],'list');
 for(const bad of [list([decl[0],target,decl[2],decl[3]]),list([decl[0],other,decl[2],list([])])])await expect(prepareCharacterModel({...source,registry:enc(list([...slots.slice(0,21),bad]))})).rejects.toThrow('recognition');
 const first=resolutionHistory(acquired)[0],path=resolutionRecordPath(first.recognitionResolutionId),value=acquired.read(path).value!;
 expect(()=>component.stateModel.applyPatch(acquired,{operations:[{kind:'set',path,expected:{presence:true,value},newValue:value}]},OWNER.RecognitionResolution)).toThrow('append-only');
 const noResolution=new AuthoritativeState(acquired.entries().filter(e=>e.path.rootStateTypeId!==244n));
 expect(()=>component.stateModel.applyPatch(noResolution,{operations:[{kind:'set',path,expected:{presence:false},newValue:value}]},OWNER.Perception)).toThrow();
 const tracking=acquired.entries().filter(e=>e.path.rootStateTypeId===241n).map(e=>({kind:'set' as const,path:e.path,expected:{presence:false as const},newValue:e.value}));
 expect(()=>component.stateModel.applyPatch(initial,{operations:tracking},OWNER.RecognitionResolution)).toThrow();
 expect(()=>component.stateModel.applyPatch(initial,{operations:[{kind:'set',path:catalog.path,expected:{presence:true,value:catalog.value},newValue:catalog.value}]},OWNER.RecognitionKnowledge)).toThrow('immutable');
 expect(()=>component.stateModel.validatePath(nextTrackSequencePath('foreign-observer'))).toThrow('foreign');
 // Derive the late work ceiling from this same run, without changing its behavioral inputs.
 let checkpoint=r.snapshot();while(r.snapshot().clock<3n){checkpoint=r.snapshot();await r.settleNextInstant();}
 const trace=outputs(r.snapshot().trace,160n),events=new Set(trace.filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===3n).map(t=>key(f(rec(f(t,4n),130n),1n))));
 const failed=await createCharacterRun(await prepareCharacterModel(workLimit(source,BigInt(events.size-1))),d);await through(failed,checkpoint.clock);const before=failed.snapshot();await expect(failed.settleNextInstant()).rejects.toThrow('work ceiling');expect({...failed.snapshot(),status:before.status}).toEqual(before);expect(resolutionHistory(state(failed))).toHaveLength(1);
 console.info('M22 admission/authority and late rollback: '+events.size+' events; state, outputs, trace, queue and allocators restored');
},180000);
