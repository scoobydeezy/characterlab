import catalog from './longCatalog.json';
import type {LongSnapshot} from './longAdapter';
import {decodeLongitudinal as decode} from '../campaign3/longitudinalCodecs';
import {OBSERVER} from '../campaign3/longitudinalModel';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {canonicalEncode,bytesToHex} from '../substrate/canonicalEncoding';
import {commitManifest,createRunIdentity} from '../substrate/identity';
import {digest,fromHex,exactText} from './canonical';
const base='representation-2-law-1';
export const LONG_COMPARISONS=[
 ...[1,2].map(law=>({id:`detail:${law}`,control:`representation-1-law-${law}`,candidate:`representation-2-law-${law}`,purpose:'Learned projection equality versus accessible relationship detail'})),
 ...['representation-3-law-1','representation-4-law-1','family-1','family-2','family-3','family-4','keep-all','no-interference','no-relearning','rust','denied-social','witness-only','no-claim','standing-off','seed-1','seed-2','reordered-law-1'].map(candidate=>({id:`baseline:${candidate}`,control:base,candidate,purpose:'Retained original LONG control; inspect each learned family separately'})),
 {id:'fixed-display',control:'fixed-display-false',candidate:'fixed-display-true',purpose:'Same observed display under different hidden interaction truth'},
 {id:'order:2',control:'representation-2-law-2',candidate:'reordered-law-2',purpose:'History order under LatestInteraction'},
 {id:'gap',control:'rust',candidate:'short-gap',purpose:'Different authored gap schedules; only equal committed clocks align'},
 ...['rust','fresh'].map(c=>({id:`execution:${c}`,control:'execution:retained',candidate:`execution:${c}`,purpose:'Actual execution probe with retained, rusted or fresh skill'})),
];
async function validate(s:LongSnapshot,name:string){
 const p=catalog.programs.find(p=>p.name===name),m=catalog.models.find(m=>m.name===p?.model);if(!p||!m||s.program!==name||s.model!==m.name||s.seamVersion!==catalog.contract)throw Error('LONG comparison original program mismatch');
 const modelBytes=fromHex(m.modelIdentity),modelHash=await digest(modelBytes),identity=await createRunIdentity({modelIdentity:{kind:'ModelIdentity',value:decode(modelBytes),canonicalBytes:modelBytes,digest:fromHex(modelHash)},initialState:await commitManifest(decode(fromHex(m.initialState))),orderedInputSequence:await commitManifest(decode(fromHex(p.orderedInputs))),runSeed:fromHex(p.runSeed)});
 if(s.modelHash!==modelHash||s.runHash!==await digest(identity.canonicalBytes))throw Error('LONG comparison original identity/seed mismatch');
 if(await digest(fromHex(s.observerHex))!==s.observerHash)throw Error('LONG comparison observer digest mismatch');const view=rec(decode(fromHex(s.observerHex)),881n);
 if(bytesToHex(canonicalEncode(f(view,1n)))!==bytesToHex(canonicalEncode(OBSERVER)))throw Error('LONG comparison observer identity mismatch');
 return{view,seed:p.runSeed};
}
export async function compareLongSnapshots(id:string,left:LongSnapshot,right:LongSnapshot){
 const spec=LONG_COMPARISONS.find(p=>p.id===id);if(!spec)throw Error('Unknown LONG comparison');const a=structuredClone(left),b=structuredClone(right),av=await validate(a,spec.control),bv=await validate(b,spec.candidate);
 const info={version:'long-comparison/0.1',spec:{...spec},control:{program:a.program,prefix:a.prefix,clock:a.clock,saveHash:a.saveHash},candidate:{program:b.program,prefix:b.prefix,clock:b.clock,saveHash:b.saveHash},identity:{modelEqual:a.modelHash===b.modelHash,runEqual:a.runHash===b.runHash,stateEqual:a.stateHash===b.stateHash,observerEqual:a.observerHash===b.observerHash},rng:{controlSeed:av.seed,candidateSeed:bv.seed,seedEqual:av.seed===bv.seed,correspondence:'NOT_INFERRED_FROM_SEED',controlDraws:a.timeline.map(e=>({instant:e.instant,stage:e.stage,eventId:e.id,draws:e.draws})),candidateDraws:b.timeline.map(e=>({instant:e.instant,stage:e.stage,eventId:e.id,draws:e.draws}))}};
 if(a.clock!==b.clock)return{...info,status:'UNALIGNED_CLOCKS' as const,scope:'Different committed instants; no learned-state or retained-detail equality inferred.'};
 const fields=([['identity',2n],['skill',3n],['relationship',4n],['episodes',5n],['personEstimate',6n],['relationshipDetail',7n]] as const).map(([name,key])=>{const value=(v:typeof av.view)=>v.fields.has(key)?{present:true,exact:exactText(f(v,key))}:{present:false,exact:null};const control=value(av.view),candidate=value(bv.view);return{name,control,candidate,equal:control.present===candidate.present&&control.exact===candidate.exact};});
 return{...info,status:'ALIGNED_COMMITTED_CLOCK' as const,fields,learnedEqual:fields.slice(0,3).every(f=>f.equal),scope:'Exact closed-observer fields at one shared committed clock. Learned identity/skill/relationship equality is separate from episode, person estimate and relationship-detail equality. Absent fields are not zero or false. Raw draw records are retained without assuming cross-model RNG correspondence. No causal necessity, general compression or psychological law selection follows.'};
}
