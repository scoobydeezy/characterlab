/** task-arbitration/0.1-candidate. Exact analysis plus the retained dice lottery.
 * Character arbitration receives two narrowly addressed draw operations, not an oracle. */
import {list,unsigned as u,signed,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {RandomRunOracle,randomAddressValue,type RandomAddress,type RandomDrawRecord} from '../substrate/random';
import {SchedulerContractError} from '../substrate/scheduler';
import {cognitiveRecord as r,cloneCognitive} from './cognitiveCodecs';
import {ZERO,ONE,absolute,convolve,expectation,readDistribution,analyzeOptions,readQ,qValue} from './cognitiveMath';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id,invalidModel} from './canonicalData';

export interface ArbitrationDraws {reason(nucleus:CanonicalValue):Promise<CanonicalValue>;tie(leaders:readonly CanonicalValue[]):Promise<CanonicalValue>;}
const atom=(n:number,s:string)=>typedIdentifier(n,text(s));
function drawValue(draw:RandomDrawRecord){return r(411,[randomAddressValue(draw.localAddress),draw.effectiveKey,u(draw.result),u(draw.span),u(draw.limit),draw.fallback,list(draw.attempts.map(a=>r(410,[u(a.internalCandidateIndex),u(a.candidate),a.rejected])))]);}
function context(value:CanonicalValue){const reason=rec(value,408n),raw=rec(f(reason,2n),403n),options=rec(f(raw,2n),398n);return {nuclei:items(f(reason,3n),'list'),candidates:items(f(options,3n),'list').map(v=>f(rec(v,397n),1n))};}

/** Trusted run-owned RNG ledger. An aborted instant discards the oracle and its
 * provisional used addresses; successful addresses are retained across instants.
 * Restore must rebuild this ledger by executing the accepted prefix. */
export function createCognitiveRandomSession(seed:Uint8Array){
 const runSeed=seed.slice(),committed=new Set<string>();let oracle:RandomRunOracle|undefined,staged=new Set<string>(),sealed=false,generation=0,inFlight=0;
 function stage(message:string):never{throw new SchedulerContractError('COGNITIVE_STAGE_VIOLATION',message);}
 return Object.freeze({
  begin(){if(oracle)stage('random instant already active');oracle=new RandomRunOracle(runSeed);staged=new Set();sealed=false;generation++;},
  forResolution(root:CanonicalValue,reasonContext:CanonicalValue):ArbitrationDraws {
   if(!oracle||sealed)stage('random capability requires live instant');
   const epoch=generation,{nuclei,candidates}=context(cloneCognitive(reasonContext)),rootId=id(cloneCognitive(root));
   if(rootId.namespaceId!==1135n||typeof rootId.payload==='boolean'||rootId.payload.kind!=='unsigned')invalidModel('resolution root family');
   const actor=candidates.length?f(rec(candidates[0],395n),1n):undefined;
   async function draw(purpose:string,bindings:RandomAddress['subjectBindings'],span:bigint){
    if(!oracle||sealed||generation!==epoch)stage('expired random capability');
    const address:RandomAddress={causalRootId:rootId,purposeId:atom(1042,purpose),subjectBindings:bindings,drawIndex:0n},addressKey=key(randomAddressValue(address));
    if(committed.has(addressKey)||staged.has(addressKey)||staged.size>=3)stage('repeated or excessive cognitive draw');
    staged.add(addressKey);const current=oracle;inFlight++;
    try{const result=await current.drawBounded(address,span);if(generation!==epoch||oracle!==current)stage('random result crossed instant');return drawValue(result);}finally{inFlight--;}
   }
   return Object.freeze({
    async reason(nucleus:CanonicalValue){const matched=nuclei.find(v=>key(v)===key(nucleus));if(!matched)stage('draw for unauthenticated nucleus');
     const n=rec(matched,407n),nk=rec(f(n,1n),404n),candidate=rec(f(nk,1n),395n);
     return draw('purpose/task-reason-face',[{subjectRoleId:atom(1043,'subject/actor'),subjectId:id(f(candidate,1n))},{subjectRoleId:atom(1043,'subject/action'),subjectId:id(f(candidate,2n))},{subjectRoleId:atom(1043,'subject/task'),subjectId:id(f(nk,3n))}],uint(f(n,4n)));
    },
    async tie(leaders:readonly CanonicalValue[]){if(!actor||leaders.length!==2||new Set(leaders.map(key)).size!==2||leaders.some(v=>!candidates.some(c=>key(c)===key(v)))||key(leaders[0])>=key(leaders[1]))stage('invalid tie leaders');
     return draw('purpose/task-decision-tie',[{subjectRoleId:atom(1043,'subject/actor'),subjectId:id(actor)}],BigInt(leaders.length));
    },
   });
  },
  prepareCommit(){if(!oracle||sealed||inFlight)stage('random instant cannot seal');sealed=true;},
  commit(){if(!oracle||!sealed)stage('random commit not prepared');for(const address of staged)committed.add(address);},
  close(){if(inFlight)stage('random instant still executing');oracle=undefined;staged=new Set();sealed=false;generation++;},
  committedAddressKeys(){if(oracle)stage('random ledger requires quiescence');return [...committed].sort();},
 });
}

export async function arbitrationOutput(occurrence:CanonicalValue,at:bigint,reasonContext:CanonicalValue,definition:CanonicalValue,draws:ArbitrationDraws){
 if(at<=0n)invalidModel('positive resolution time required');
 const {nuclei,candidates}=context(reasonContext),def=rec(definition,440n);
 if(!candidates.length||!nuclei.length)return r(409,[occurrence,signed(at),reasonContext,r(419,[u(candidates.length?2:1)])]);
 const options=candidates.map(candidate=>{const own=nuclei.filter(v=>key(f(rec(f(rec(v,407n),1n),404n),1n))===key(candidate));let distribution=new Map([[0n,ONE]]),reasonMass=ZERO;
  for(const value of own){const d=readDistribution(f(rec(value,407n),7n));distribution=convolve(distribution,d);reasonMass=reasonMass.add(absolute(expectation(d)));}return {key:candidate,distribution,reasonMass};});
 const analytical=analyzeOptions(options,readQ(f(def,1n)),readQ(f(def,2n))),reasonDraws:CanonicalValue[]=[];
 let chosen=analytical.ranked[0].key,tie=r(423,[u(1)]);
 if(analytical.mode!=='Auto'){
  const scores=new Map(candidates.map(c=>[key(c),0n]));
  for(const value of nuclei){const n=rec(value,407n),nk=rec(f(n,1n),404n),draw=rec(await draws.reason(value),411n),face=uint(f(draw,3n))+1n;
   const h=f(n,5n),x=f(n,6n);if(typeof h==='boolean'||h.kind!=='signed'||typeof x==='boolean'||x.kind!=='signed')invalidModel('signed modifiers');
   const contribution=(uint(f(nk,4n))===1n?1n:-1n)*(face+h.value+x.value),candidate=key(f(nk,1n));
   if(!scores.has(candidate))invalidModel('nucleus outside candidate domain');scores.set(candidate,scores.get(candidate)!+contribution);
   reasonDraws.push(r(422,[nk,f(n,4n),h,x,draw,u(face),signed(contribution)]));
  }
  const top=[...scores.values()].reduce((a,b)=>a>b?a:b),leaders=candidates.filter(c=>scores.get(key(c))===top).sort((a,b)=>key(a)<key(b)?-1:1);
  chosen=leaders[0];if(leaders.length>1){const draw=rec(await draws.tie(leaders),411n);chosen=leaders[Number(uint(f(draw,3n)))];tie=r(423,[u(2),list(leaders),draw,chosen]);}
 }
 const modes={Auto:1,QuietRoll:2,PlayerFacingRoll:3};
 const data=r(420,[chosen,list(analytical.probabilities.map(p=>r(421,[p.key,qValue(p.probability)]))),qValue(analytical.margin),qValue(analytical.contest),qValue(analytical.conflictMass),qValue(analytical.stake),qValue(analytical.authorshipPotential),u(modes[analytical.mode as keyof typeof modes]),list(reasonDraws),tie]);
 return r(409,[occurrence,signed(at),reasonContext,r(419,[u(3),data])]);
}
