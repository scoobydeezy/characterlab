import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
import {randomDrawRecord} from '../assembled/codecs';
import {list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataUnsigned as uint,dataIdentity as id,dataText as txt} from '../campaign2/canonicalData';
import {personPath,personHistory,SOCIAL_APPRAISAL} from '../assembled/social';
import {resolutionHistory,trackState} from '../assembled/recognitionState';
import {readResolution,OBSERVER} from '../assembled/recognition';
import {C} from './fixtures/campaign2Cognitive';
import {recognitionModelSource,recognitionData,target,other,decode,items,key,enc} from './fixtures/assembledRecognition';
import {through,finish,outputs,decisions,mapFromDecision,draws,choice,type Run} from './fixtures/assembledComparison';
const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
const exact=(a:Run,b:Run)=>{expect(a.snapshot()).toEqual(b.snapshot());expect(a.save()).toEqual(b.save());};
const reports=(r:Run,name:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items[0]&&txt(v.items[0])===name).map(v=>items(v,'list'));
let prepared:Promise<{model:Awaited<ReturnType<typeof prepareCharacterModel>>;maps:ReturnType<typeof mapFromDecision>[]}>|undefined;
const fixture=()=>prepared??=(async()=>{const model=await prepareCharacterModel(recognitionModelSource()),maps=[];for(const cue of [true,false]){const r=await createCharacterRun(model,recognitionData(cue));await through(r,3n);maps.push(mapFromDecision(r));console.info('M22 preflight '+JSON.stringify({targetCue:cue,draws:draws(r).length,belief:personHistory(state(r).read(personPath(C,target)).value).length,resolutions:resolutionHistory(state(r)).length}));}return {model,maps};})();
const mapped=(cue:boolean,seed:number,map:ReturnType<typeof mapFromDecision>)=>{const d=recognitionData(cue,seed);return {...d,orderedInputs:enc(list([map.canonicalValue,...items(decode(d.orderedInputs),'list')]))};};
describe('M22 observer-local recognition in one character',()=>{
 it('matrix: recognition evidence changes learned belief, reasons and coupled choice',async()=>{
  const {model,maps}=await fixture();const changed:number[]=[];let common=0,fullyMatchedChanged=0;
  for(let seed=0;seed<8;seed++){
   const a=await createCharacterRun(model,mapped(true,seed,maps[0])),b=await createCharacterRun(model,mapped(false,seed,maps[1]));await through(a,3n);await through(b,3n);
   for(const [i,r]of [a,b].entries()){const s=state(r),history=resolutionHistory(s);expect(history).toHaveLength(1);expect(history[0].resolution).toEqual({kind:'asserted-candidate',candidateSemanticReferentId:key(i?other:target)});expect(trackState(s).activePerceptualReferentIds).toHaveLength(1);expect(outputs(r.snapshot().outputs,225n).length).toBeGreaterThan(0);expect(personHistory(s.read(personPath(C,target)).value)).toHaveLength(i?0:2);expect(reports(r,SOCIAL_APPRAISAL).at(-1)![3]).toEqual(list(personHistory(s.read(personPath(C,target)).value)));}
   expect(f(decisions(a)[0],3n)).not.toEqual(f(decisions(b)[0],3n));const aa=draws(a),bb=draws(b),by=new Map(bb.map(v=>[key(f(v,2n)),v]));let paired=0;
   for(const x of aa){const y=by.get(key(f(x,2n)));if(!y)continue;paired++;const ax=items(f(x,7n),'list'),ay=items(f(y,7n),'list');for(let i=0;i<Math.min(ax.length,ay.length);i++){expect(f(rec(ax[i],410n),1n)).toEqual(f(rec(ay[i],410n),1n));expect(f(rec(ax[i],410n),2n)).toEqual(f(rec(ay[i],410n),2n));}}
   expect(paired).toBeGreaterThan(0);common+=paired;if(choice(a)!==choice(b)){changed.push(seed);if(aa.length+bb.length===2*paired)fullyMatchedChanged++;}console.info('M22 cell '+JSON.stringify({seed,a:choice(a),b:choice(b),common:paired,unmatched:aa.length+bb.length-2*paired}));await finish(a);await finish(b);
  }
  expect(changed.length).toBeGreaterThan(0);expect(fullyMatchedChanged).toBeGreaterThan(0);console.info('M22 matrix '+JSON.stringify({runs:16,changed,fullyMatchedChanged,common,terminal:10}));
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
