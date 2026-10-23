/** Exact inherited arbitration in the new multisource envelope; internal only. */
import {list,unsigned as u,signed,type CanonicalValue} from '../substrate/canonicalEncoding';
import {RandomRunOracle,randomAddressValue,type RandomAddress,type RandomDrawRecord} from '../substrate/random';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id} from '../campaign2/canonicalData';
import {ZERO,ONE,absolute,convolve,expectation,readDistribution,analyzeOptions,readQ,qValue} from '../campaign2/cognitiveMath';
import {multisourceRecord as r} from './multisourcePublicCodecs';
import {receivingRecord as old} from './receivingCodecs';
import {msId} from './multisourceModelRecipe';
function drawValue(d:RandomDrawRecord){return old(411,[randomAddressValue(d.localAddress),d.effectiveKey,u(d.result),u(d.span),u(d.limit),d.fallback,list(d.attempts.map(a=>old(410,[u(a.internalCandidateIndex),u(a.candidate),a.rejected])))]);}
export function multisourceDecisionContext(value:CanonicalValue){const reasons=rec(value,726n),raw=rec(f(reasons,2n),722n),source=rec(f(raw,2n),719n);return {nuclei:items(f(reasons,3n),'list'),candidates:items(f(source,4n),'list')};}
export function createMultisourceRandomSession(seed:Uint8Array){
 const runSeed=seed.slice(),committed=new Set<string>();let oracle:RandomRunOracle|undefined,staged=new Set<string>(),sealed=false,epoch=0,inFlight=0;
 function fail():never{throw Error('MULTISOURCE_RANDOM_STAGE');}
 return Object.freeze({
  begin(){if(oracle)fail();oracle=new RandomRunOracle(runSeed);staged=new Set();sealed=false;epoch++;},
  forResolution(root:CanonicalValue,reasons:CanonicalValue){if(!oracle||sealed)fail();const generation=epoch,rootId=id(root),{nuclei,candidates}=multisourceDecisionContext(reasons);
   if(rootId.namespaceId!==1149n||typeof rootId.payload==='boolean'||rootId.payload.kind!=='unsigned')fail();
   async function draw(purpose:string,bindings:RandomAddress['subjectBindings'],span:bigint){
    if(!oracle||sealed||generation!==epoch)fail();const address:RandomAddress={causalRootId:rootId,purposeId:msId(1042,'purpose/multisource/'+purpose),subjectBindings:bindings,drawIndex:0n},k=key(randomAddressValue(address));
    if(committed.has(k)||staged.has(k)||staged.size>=6)fail();staged.add(k);const current=oracle;inFlight++;
    try{const result=await current.drawBounded(address,span);if(oracle!==current||epoch!==generation)fail();return drawValue(result);}finally{inFlight--;}
   }
   const binding=(role:string,value:CanonicalValue)=>({subjectRoleId:msId(1043,'subject/multisource/'+role),subjectId:id(value)});
   return Object.freeze({
    reason(value:CanonicalValue){const actual=nuclei.find(v=>key(v)===key(value));if(!actual)fail();const n=rec(actual,725n),nk=rec(f(n,1n),724n),option=rec(f(nk,1n),395n),ground=rec(f(nk,2n),494n),determinant=uint(f(ground,1n))===1n?f(rec(f(ground,2n),371n),2n):f(rec(f(ground,3n),493n),2n);
     const bindings=[binding('actor',f(option,1n)),binding('action',f(option,2n)),binding('ground',determinant)],description=nk.fields.get(4n);if(description)bindings.push(binding('description',description));return draw('reason-face',bindings,uint(f(n,5n)));
    },
    tie(leaders:readonly CanonicalValue[]){if(leaders.length!==2||key(leaders[0])>=key(leaders[1])||leaders.some(v=>!candidates.some(c=>key(c)===key(v))))fail();return draw('tie',[binding('actor',f(rec(leaders[0],395n),1n))],2n);},
   });
  },
  prepareCommit(){if(!oracle||sealed||inFlight)fail();sealed=true;},
  commit(){if(!oracle||!sealed)fail();for(const k of staged)committed.add(k);},
  close(){if(inFlight)fail();oracle=undefined;staged=new Set();sealed=false;epoch++;},
  committedAddressKeys(){if(oracle)fail();return [...committed].sort();},
 });
}
export async function multisourceDecisionStage(occurrence:CanonicalValue,at:bigint,reasons:CanonicalValue,definition:CanonicalValue,draws:ReturnType<ReturnType<typeof createMultisourceRandomSession>['forResolution']>){
 const {nuclei,candidates}=multisourceDecisionContext(reasons),def=rec(definition,440n),fields=new Map<bigint,CanonicalValue>([[1n,occurrence],[2n,signed(at)],[3n,reasons]]);
 let chosen:CanonicalValue|undefined,probabilities:CanonicalValue[]=[],margin=ZERO,contest=ZERO,conflictMass=ZERO,stake=ZERO,authorshipPotential=ZERO,mode=1,reasonDraws:CanonicalValue[]=[],tie=old(423,[u(1)]);
 if(candidates.length&&nuclei.length){const options=candidates.map(candidate=>{let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;
   for(const value of nuclei.filter(v=>key(f(rec(f(rec(v,725n),1n),724n),1n))===key(candidate))){const d=readDistribution(old(424,[f(rec(value,725n),7n)]));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}
   return {key:candidate,distribution,reasonMass};});
  const analytical=analyzeOptions(options,readQ(f(def,1n)),readQ(f(def,2n)));({margin,contest,conflictMass,stake,authorshipPotential}=analytical);mode={Auto:1,QuietRoll:2,PlayerFacingRoll:3}[analytical.mode as 'Auto'|'QuietRoll'|'PlayerFacingRoll'];chosen=analytical.ranked[0].key;
  probabilities=analytical.probabilities.map(p=>old(421,[p.key,qValue(p.probability)]));
  if(mode!==1){const scores=new Map(candidates.map(c=>[key(c),0n]));for(const value of nuclei){const n=rec(value,725n),nk=rec(f(n,1n),724n),draw=rec(await draws.reason(value),411n),modifier=f(n,6n);if(typeof modifier==='boolean'||modifier.kind!=='signed')throw Error('MULTISOURCE_MODIFIER');
    const contribution=(uint(f(nk,3n))===1n?1n:-1n)*(uint(f(draw,3n))+1n+modifier.value),candidate=key(f(nk,1n));if(!scores.has(candidate))throw Error('MULTISOURCE_NUCLEUS_OPTION');scores.set(candidate,scores.get(candidate)!+contribution);reasonDraws.push(r(727,[nk,draw,signed(contribution)]));
   }
   const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=candidates.filter(c=>scores.get(key(c))===top).sort((a,b)=>key(a)<key(b)?-1:1);chosen=leaders[0];if(leaders.length>1){const draw=rec(await draws.tie(leaders),411n);chosen=leaders[Number(uint(f(draw,3n)))];tie=old(423,[u(2),list(leaders),draw,chosen]);}
  }
 }
 fields.set(4n,u(!candidates.length?1:!nuclei.length?2:3));if(chosen)fields.set(5n,chosen);
 [list(probabilities),qValue(margin),qValue(contest),qValue(conflictMass),qValue(stake),qValue(authorshipPotential),u(mode),list(reasonDraws),tie].forEach((v,i)=>fields.set(BigInt(i+6),v));
 return r(728,fields);
}
