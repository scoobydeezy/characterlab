/** Observed trial efficacy inside the shared knowledge owner; no state or runtime. */
import {list,text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,dataText as txt,dataUnsigned as uint,dataKey as key,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {ExactRational as Q} from '../substrate/exactMath';
import {qValue,ZERO} from '../campaign2/cognitiveMath';
import {groupPerceivedTrial} from '../campaign3/perceivedTrialGrouping';
import {positionExperience} from './memory';
import {POSITION} from './positionPerception';
import {OBSERVER} from './recognition';
const require=(b:boolean,s:string)=>{if(!b)invalidModel('mitigation '+s);};
export function validateMitigationPacket(value:CanonicalValue,at?:bigint){
 const a=items(value,'list');require(a.length===5&&txt(a[0])==='assembled-mitigation/0.1','packet');
 const o=items(a[1],'list'),x=positionExperience(a[2]),safe=items(a[3],'list');
 require(o.length===7&&txt(o[0])===POSITION&&o[3]===true&&typeof o[1]!=='boolean'&&o[1].kind==='signed'&&o[1].value===x.occurredAt&&x.observerId===OBSERVER&&x.perceptualEventReferentIds.length===1&&(at===undefined||at===x.occurredAt),'observer/time/context');
 const panel=items(o[5],'list');require(panel.length===3&&['Before','Motion','After'].includes(txt(panel[2]))&&uint(panel[1])<=7n,'panel');
 const observation=id(panel[0]);require(observation.namespaceId===1115n&&x.supportingObservationIds.some(s=>s.observerId===OBSERVER&&s.observationId===uint(observation.payload)),'observation support');
 require(safe.length===2&&uint(safe[0])<=2n,'safe action');const outcome=items(safe[1],'list');
 require([0,3].includes(outcome.length)&&outcome.every(v=>typeof v==='boolean'),'safe outcome');uint(a[4]);
 return {value,experience:x,role:txt(panel[2]) as 'Before'|'Motion'|'After',glyph:uint(panel[1]),action:uint(safe[0]),outcome,observation:panel[0],producer:uint(a[4])};
}
export function relativeEfficacy(b:Q|undefined,t:Q|undefined){const delta=b&&t&&b.compare(ZERO)>0?b.subtract(t).divide(b):undefined;return delta===undefined?undefined:delta.compare(ZERO)<0?ZERO:delta;}
export function mitigationEstimates(packets:readonly CanonicalValue[]){
 const rows=packets.filter(v=>items(v,'list').length).map(v=>validateMitigationPacket(v));
 require(rows.length<=16&&new Set(rows.map(r=>r.experience.experienceId)).size===rows.length,'unique bounded experiences');
 const contexts=[...new Map(rows.map(r=>[key(list(r.experience.perceptualEventReferentIds.map(c=>list([text(c.observerId),{kind:'unsigned',value:c.observerEventSequence}])))),r.experience.perceptualEventReferentIds[0]])).values()];
 const samples:[boolean[],boolean[]]=[[],[]],supports:CanonicalValue[]=[];
 for(const context of contexts){
  const matching=rows.filter(r=>r.experience.perceptualEventReferentIds.some(c=>c.observerId===context.observerId&&c.observerEventSequence===context.observerEventSequence));
  if(matching.length>12)continue; // Overfull contexts are ambiguous, never subsetted.
  const group=groupPerceivedTrial(OBSERVER,context,matching);
  if(group.kind!=='Grouped'||matching.some(r=>r.glyph!==1n))continue;
  const motion=matching.find(r=>r.experience.experienceId===group.motionExperience)!,after=matching.find(r=>r.experience.experienceId===group.afterExperience)!;
  if(!motion.action||after.outcome.length!==3||after.outcome[0]!==true||after.outcome[1]!==true)continue;
  samples[Number(motion.action)-1].push(after.outcome[2]===true);
  supports.push(list([ {kind:'unsigned',value:motion.action},list(matching.map(r=>r.value)) ]));
 }
 const means=samples.map(xs=>xs.length?Q.of(BigInt(xs.filter(Boolean).length),BigInt(xs.length)):undefined),[b,t]=means;
 const control=relativeEfficacy(b,t);
 return {means,control,supports,provenance:list([...means.map(v=>v?qValue(v):list([])),control?qValue(control):list([]),list(supports)])};
}
