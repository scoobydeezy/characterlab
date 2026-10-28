import {describe,it,expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {restoreAuthoritativeState} from '../substrate/state';
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
