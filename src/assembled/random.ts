/** assembled-character-habit/0.1: successor of the fixed cognitive RNG capability.
 * Same addresses, event binding and atomic ledger; capacity four nuclei plus one tie. */
import {list,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {RandomRunOracle,randomAddressValue,type RandomAddress,type RandomDrawRecord,type ComparisonDrawMap} from '../substrate/random';
import {SchedulerContractError} from '../substrate/scheduler';
import {cognitiveRecord as r,cloneCognitive} from '../campaign2/cognitiveCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import type {ArbitrationDraws} from '../campaign2/cognitiveArbitration';
const atom=(n:number,s:string)=>typedIdentifier(n,text(s));
function drawValue(draw:RandomDrawRecord){return r(411,[randomAddressValue(draw.localAddress),draw.effectiveKey,u(draw.result),u(draw.span),u(draw.limit),draw.fallback,list(draw.attempts.map(a=>r(410,[u(a.internalCandidateIndex),u(a.candidate),a.rejected])))]);}
function context(value:CanonicalValue){const reason=rec(value,408n),raw=rec(f(reason,2n),403n),options=rec(f(raw,2n),398n);return {nuclei:items(f(reason,3n),'list'),candidates:items(f(options,3n),'list').map(v=>f(rec(v,397n),1n))};}
export function createAssembledRandomSession(seed:Uint8Array,comparison?:ComparisonDrawMap){
 const runSeed=seed.slice(),committed=new Set<string>();let oracle:RandomRunOracle|undefined,staged=new Set<string>(),sealed=false,generation=0,inFlight=0;
 function stage(message:string):never{throw new SchedulerContractError('COGNITIVE_STAGE_VIOLATION',message);}
 return Object.freeze({
  begin(){if(oracle)stage('random instant already active');oracle=new RandomRunOracle(runSeed,comparison);staged=new Set();sealed=false;generation++;},
  forResolution(root:CanonicalValue,reasonContext:CanonicalValue):ArbitrationDraws {
   if(!oracle||sealed)stage('random capability requires live instant');
   const epoch=generation,{nuclei,candidates}=context(cloneCognitive(reasonContext)),rootId=id(cloneCognitive(root));
   if(rootId.namespaceId!==1135n||typeof rootId.payload==='boolean'||rootId.payload.kind!=='unsigned')invalidModel('resolution root family');
   const actor=candidates.length?f(rec(candidates[0],395n),1n):undefined;
   async function draw(purpose:string,bindings:RandomAddress['subjectBindings'],span:bigint){
    if(!oracle||sealed||generation!==epoch)stage('expired random capability');
    const address:RandomAddress={causalRootId:rootId,purposeId:atom(1042,purpose),subjectBindings:bindings,drawIndex:0n},addressKey=key(randomAddressValue(address));
    if(committed.has(addressKey)||staged.has(addressKey)||staged.size>=5)stage('repeated or excessive cognitive draw');
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
