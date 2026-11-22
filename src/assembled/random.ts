import type {TimedComparison} from './timedComparison';
import {ROUNDING_SPAN} from './standingRounding';
import {receivingRecord as rec} from './codecs';
/** assembled-character-habit/0.1: successor of the fixed cognitive RNG capability.
 * Same addresses, event binding and atomic ledger; capacity four nuclei plus one tie. */
import {list,unsigned as u,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {RandomRunOracle,randomAddressValue,type RandomAddress,type RandomDrawRecord,type ComparisonDrawMap} from '../substrate/random';
import {SchedulerContractError} from '../substrate/scheduler';
import {cognitiveRecord as r} from '../campaign2/cognitiveCodecs';
import {dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint,dataIdentity as id,invalidModel} from '../campaign2/canonicalData';
import {cognitiveRecord as successorRecord,cloneCognitive} from './codecs';
import type {ArbitrationDraws} from '../campaign2/cognitiveArbitration';
export type StandingDraws=ArbitrationDraws & {rounding?(nucleus:CanonicalValue):Promise<CanonicalValue>};
const atom=(n:number,s:string)=>typedIdentifier(n,text(s));
function drawValue(draw:RandomDrawRecord){return (draw.comparisonDrawKey||String(typeof draw.localAddress.purposeId.payload!=='boolean'&&draw.localAddress.purposeId.payload.kind==='text'?draw.localAddress.purposeId.payload.value:'').endsWith('-standing-rounding')?successorRecord:r)(411,[randomAddressValue(draw.localAddress),draw.effectiveKey,u(draw.result),u(draw.span),u(draw.limit),draw.fallback,list(draw.attempts.map(a=>r(410,[u(a.internalCandidateIndex),u(a.candidate),a.rejected])))]);}
function context(value:CanonicalValue){const reason=rec(value,408n),raw=rec(f(reason,2n),403n),options=rec(f(raw,2n),398n);return {nuclei:items(f(reason,3n),'list'),candidates:items(f(options,3n),'list').map(v=>f(rec(v,397n),1n))};}
export function createAssembledRandomSession(seed:Uint8Array,comparison?:ComparisonDrawMap,maxDomain=2,valueReceiving=false,standingRounding=false,timedComparison?:TimedComparison,needReceiving=false){
 if(comparison&&timedComparison)invalidModel('static and timed comparison are mutually exclusive');
 const runSeed=seed.slice(),committed=new Set<string>();let instant:bigint|undefined,bound=false;let oracle:RandomRunOracle|undefined,staged=new Set<string>(),sealed=false,generation=0,inFlight=0;
 function stage(message:string):never{throw new SchedulerContractError('COGNITIVE_STAGE_VIOLATION',message);}
 return Object.freeze({
  begin(at?:bigint){if(oracle)stage('random instant already active');if(timedComparison&&at===undefined)stage('timed comparison requires authenticated instant');instant=at;bound=false;oracle=new RandomRunOracle(runSeed,comparison);staged=new Set();sealed=false;generation++;},
  forResolution(root:CanonicalValue,reasonContext:CanonicalValue):StandingDraws {
   if(!oracle||sealed)stage('random capability requires live instant');
   const epoch=generation,{nuclei,candidates}=context(cloneCognitive(reasonContext)),rootId=id(cloneCognitive(root));
   if(rootId.namespaceId!==1135n||typeof rootId.payload==='boolean'||rootId.payload.kind!=='unsigned')invalidModel('resolution root family');
   if(timedComparison){if(bound)stage('timed resolution already bound');oracle!.installComparisonDrawMap(timedComparison.bind(instant!,rootId));bound=true;}
   const actor=candidates.length?f(rec(candidates[0],395n),1n):undefined;
   async function draw(purpose:string,bindings:RandomAddress['subjectBindings'],span:bigint){
    if(!oracle||sealed||generation!==epoch)stage('expired random capability');
    const address:RandomAddress={causalRootId:rootId,purposeId:atom(1042,purpose),subjectBindings:bindings,drawIndex:0n},addressKey=key(randomAddressValue(address));
    if(committed.has(addressKey)||staged.has(addressKey)||staged.size>=(standingRounding?2:1)*(maxDomain*maxDomain+(valueReceiving?1:0)+(needReceiving?2:0))+1)stage('repeated or excessive cognitive draw');
    staged.add(addressKey);const current=oracle;inFlight++;
    try{const result=await current.drawBounded(address,span);if(generation!==epoch||oracle!==current)stage('random result crossed instant');return drawValue(result);}finally{inFlight--;}
   }
   return Object.freeze({
    async reason(nucleus:CanonicalValue){const matched=nuclei.find(v=>key(v)===key(nucleus));if(!matched)stage('draw for unauthenticated nucleus');
     const n=rec(matched,407n),nk=rec(f(n,1n),404n),candidate=rec(f(nk,1n),395n);
     if(nk.schema.schemaVersion===3n&&!needReceiving)stage('Need draw requires successor');const isValue=nk.schema.schemaVersion===2n;if(isValue&&!valueReceiving)stage('Value draw requires successor');
     return draw(isValue?'purpose/value-reason-face':'purpose/task-reason-face',[{subjectRoleId:atom(1043,'subject/actor'),subjectId:id(f(candidate,1n))},{subjectRoleId:atom(1043,'subject/action'),subjectId:id(f(candidate,2n))},{subjectRoleId:atom(1043,'subject/task'),subjectId:id(f(nk,3n))}],uint(f(n,4n)));
    },
    async rounding(nucleus:CanonicalValue){
     const matched=nuclei.find(v=>key(v)===key(nucleus));if(!standingRounding||!matched)stage('rounding for disabled/foreign nucleus');
     const n=rec(matched!,407n);if(n.schema.schemaVersion!==3n||uint(f(n,10n))===0n)stage('rounding requires fractional nucleus');
     const nk=rec(f(n,1n),404n),candidate=rec(f(nk,1n),395n),isValue=nk.schema.schemaVersion===2n;
     return draw(isValue?'purpose/value-standing-rounding':'purpose/task-standing-rounding',[{subjectRoleId:atom(1043,'subject/actor'),subjectId:id(f(candidate,1n))},{subjectRoleId:atom(1043,'subject/action'),subjectId:id(f(candidate,2n))},{subjectRoleId:atom(1043,'subject/task'),subjectId:id(f(nk,3n))}],ROUNDING_SPAN);
    },
    async tie(leaders:readonly CanonicalValue[]){if(!actor||leaders.length<2||leaders.length>maxDomain||new Set(leaders.map(key)).size!==leaders.length||leaders.some(v=>!candidates.some(c=>key(c)===key(v)))||leaders.some((v,i)=>i>0&&key(leaders[i-1])>=key(v)))stage('invalid tie leaders');
     return draw('purpose/task-decision-tie',[{subjectRoleId:atom(1043,'subject/actor'),subjectId:id(actor)}],BigInt(leaders.length));
    },
   });
  },
  prepareCommit(){if(!oracle||sealed||inFlight)stage('random instant cannot seal');sealed=true;},
  commit(){if(!oracle||!sealed)stage('random commit not prepared');for(const address of staged)committed.add(address);},
  close(){if(inFlight)stage('random instant still executing');oracle=undefined;instant=undefined;bound=false;staged=new Set();sealed=false;generation++;},
  committedAddressKeys(){if(oracle)stage('random ledger requires quiescence');return [...committed].sort();},
 });
}
