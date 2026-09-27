/** decision-public/0.1-candidate. Character operands never include world permission. */
import {canonicalEncode as enc,list,set,map,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {ZERO,ONE,bounded,absolute,convolve,expectation,readDistribution,readQ,qValue,analyzeOptions,choiceAlignment} from '../campaign2/cognitiveMath';
import {arbitrationOutput,type ArbitrationDraws} from '../campaign2/cognitiveArbitration';
import {chosenData} from '../campaign2/cognitiveChoice';
import {receivingRecord as old} from './receivingCodecs';
import {biographyContext} from './longitudinalMath';
import {decisionRecord as r,decodeDecision} from './decisionCodecs';
import {TASKS,OPTIONS,sid} from './decisionModel';

export function decisionRaw(at:bigint,occ:(ns?:number)=>CanonicalValue,frozen:CanonicalValue){
 const observations=items(f(rec(frozen,934n),2n),'list').map(v=>rec(v,933n));
 const original=rec(biographyContext(at,occ),398n),motive=rec(f(original,2n),394n);
 const admittedMotive=old(394,[f(motive,1n),f(motive,2n),list(TASKS.map(task=>old(393,[task,q(1,10)])))]),options=old(398,[f(original,1n),admittedMotive,f(original,3n)]);
 const signals:CanonicalValue[]=[],meaning:[CanonicalValue,CanonicalValue][]=[];
 for(let i=0;i<2;i++){
  const source=(role:number)=>old(401,[OPTIONS[i],TASKS[i],u(role)]),base=readQ(q(1,10)),sample=observations.find(v=>uint(f(v,4n))===BigInt(i+1));
  signals.push(old(402,[source(1),qValue(base),old(400,[map([])])]));
  let situation=ZERO;if(sample){situation=readQ(f(sample,5n));signals.push(old(402,[source(2),qValue(situation),old(400,[map([[old(399,[u(1),old(237,[u(1),f(sample,1n)])]),q(1,1)]])])]));}
  meaning.push([OPTIONS[i],qValue(bounded(base.add(situation)))]);
 }
 return old(403,[occ(1133),options,set(signals),map(meaning)]);
}
const integer=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('DECISION_MODIFIER');return v.value;};
export async function resolveDecision(occ:CanonicalValue,at:bigint,context:CanonicalValue,definition:CanonicalValue,law:number,draws:ArbitrationDraws){
 if(law===1||law===6){const reference=await arbitrationOutput(typedIdentifier(1135,u(at)),at,context,definition,draws),data=chosenData(reference);return r(935,[occ,signed(at),context,u(law),...[1n,2n,3n,4n,5n,6n,7n,8n,9n,10n].map(n=>f(data,n))]);}
 const nuclei=items(f(rec(context,408n),3n),'list'),raw=rec(f(rec(context,408n),2n),403n),options=items(f(rec(f(raw,2n),398n),3n),'list').map(v=>f(rec(v,397n),1n));
 const analysis=analyzeOptions(options.map(candidate=>{let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;for(const value of nuclei){const n=rec(value,407n);if(key(f(rec(f(n,1n),404n),1n))!==key(candidate))continue;const d=readDistribution(f(n,7n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}return {key:candidate,distribution,reasonMass};}),readQ(f(rec(definition,440n),1n)),readQ(f(rec(definition,440n),2n)));
 let mode=analysis.mode,chosen=analysis.ranked[0].key,tie=old(423,[u(1)]),opaque:CanonicalValue|undefined;const reasonDraws:CanonicalValue[]=[];
 if(law===3)mode='Auto';
 else if(law===5){if(mode!=='Auto'){if(!analysis.probabilities.every(p=>p.probability.equals(readQ(q(1,2)))))throw Error('DECISION_OPAQUE_DOMAIN');const leaders=[...options].sort((a,b)=>key(a)<key(b)?-1:1);opaque=await draws.tie(leaders);chosen=leaders[Number(uint(f(rec(opaque,411n),3n)))];}}
 else if(mode!=='Auto'||law===2){
  if(mode==='Auto')mode='QuietRoll';const scores=new Map(options.map(o=>[key(o),0n]));
  for(const value of nuclei){const n=rec(value,407n),nk=rec(f(n,1n),404n),draw=await draws.reason(value),face=uint(f(rec(draw,411n),3n))+1n,h=integer(f(n,5n)),x=integer(f(n,6n)),score=(uint(f(nk,4n))===1n?1n:-1n)*(face+h+x),k=key(f(nk,1n));scores.set(k,scores.get(k)!+score);reasonDraws.push(old(422,[nk,f(n,4n),f(n,5n),f(n,6n),draw,u(face),signed(score)]));}
  const max=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=options.filter(o=>scores.get(key(o))===max).sort((a,b)=>key(a)<key(b)?-1:1);let rolled=leaders[0];
  if(leaders.length===2){const draw=await draws.tie(leaders);rolled=leaders[Number(uint(f(rec(draw,411n),3n)))];tie=old(423,[u(2),list(leaders),draw,rolled]);}if(law!==4)chosen=rolled;
 }
 const fields=new Map<bigint,CanonicalValue>([occ,signed(at),context,u(law),chosen,list(analysis.probabilities.map(p=>old(421,[p.key,qValue(p.probability)]))),qValue(analysis.margin),qValue(analysis.contest),qValue(analysis.conflictMass),qValue(analysis.stake),qValue(analysis.authorshipPotential),u(mode==='Auto'?1:mode==='QuietRoll'?2:3),list(reasonDraws),tie].map((v,i)=>[BigInt(i+1),v]));if(opaque)fields.set(15n,opaque);return r(935,fields);
}
export function decisionDraws(value:CanonicalValue){const d=rec(value,935n),out=items(f(d,13n),'list').map(v=>f(rec(v,422n),5n)),tie=rec(f(d,14n),423n);if(uint(f(tie,1n))===2n)out.push(f(tie,3n));if(d.fields.has(15n))out.push(f(d,15n));return out;}
export function decisionExpression(occ:CanonicalValue,intent:CanonicalValue){const d=rec(f(rec(intent,936n),2n),935n),raw=rec(f(rec(f(d,3n),408n),2n),403n),meaning=f(raw,4n);if(typeof meaning==='boolean'||meaning.kind!=='map')throw Error('DECISION_MEANING');const semantic=new Map(meaning.entries.map(([k,v])=>[key(k),readQ(v)]));return r(937,[occ,intent,list([old(427,[sid(1041,'CommitmentFidelity'),qValue(choiceAlignment(f(d,5n),semantic))])])]);}
export function safeIntent(value:CanonicalValue){const i=rec(value,936n);return r(943,[f(i,1n),f(rec(f(i,2n),935n),5n)]);}
export function safeExpression(value:CanonicalValue){const e=rec(value,937n),i=rec(f(e,2n),936n),d=rec(f(i,2n),935n);return r(944,[f(e,1n),safeIntent(i),f(d,3n),...[6n,7n,8n,9n,10n,11n,12n].map(n=>f(d,n)),f(e,3n)]);}
export function playerDisplay(value:CanonicalValue){const d=rec(value,935n);if(uint(f(d,12n))!==3n)return undefined;const fields=new Map<bigint,CanonicalValue>([[1n,f(d,5n)],[2n,list(items(f(d,13n),'list').map(v=>{const face=rec(v,422n);return r(950,[1n,2n,3n,4n,6n,7n].map(n=>f(face,n)));}))]]),tie=rec(f(d,14n),423n);if(uint(f(tie,1n))===2n)fields.set(3n,f(tie,4n));return r(949,fields);}
/** Closed public output roster: new output kinds must receive explicit disposition. */
export function decisionCharacterView(outputs:readonly CanonicalValue[]){
 const safe=new Set([933n,934n,941n,943n,944n,945n,948n]),traceOnly=new Set([403n,408n,935n,936n,937n,938n,939n,940n,942n,949n]);const view:CanonicalValue[]=[];
 const forbidden=new Set([110n,410n,411n,422n,423n,932n,935n,936n,937n,938n,939n,940n,942n,949n,950n]);
 function inspect(v:CanonicalValue):void{if(typeof v==='boolean')return;if(v.kind==='record'){if(forbidden.has(v.schema.typeId))throw Error('DECISION_CHARACTER_CLOSURE');v.fields.forEach(inspect);}else if(v.kind==='list'||v.kind==='set')v.items.forEach(inspect);else if(v.kind==='map')v.entries.forEach(([k,x])=>{inspect(k);inspect(x);});}
 for(const value of outputs){decodeDecision(enc(value));if(typeof value==='boolean'||value.kind!=='record'||!safe.has(value.schema.typeId)&&!traceOnly.has(value.schema.typeId))throw Error('DECISION_OUTPUT_ROSTER');if(safe.has(value.schema.typeId)){inspect(value);view.push(value);}}
 return list(view);
}
