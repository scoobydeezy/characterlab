import plan from '../../docs/planning/LONGITUDINAL_ROUTINE_PLAN_REV1.json';
import {createRoutineReceiver,ROUTINE_VERSION,routineTimes,type RoutineProfile} from '../campaign3/longitudinalRoutine';
import {createModelIdentity,createRunIdentity,commitManifest} from '../substrate/identity';
import {canonicalEncode,text,list,bytesToHex,rational} from '../substrate/canonicalEncoding';
import {readQ} from '../campaign2/cognitiveMath';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {digest,fromHex} from './canonical';

export const LONG_ROUTINE_CASES=plan.runs.map((r,index)=>({index,...r.profile}));
const original=(index:number)=>{if(!Number.isInteger(index)||index<0||index>=plan.runs.length)throw Error('Unknown original LONG routine case');return plan.runs[index];};
const sourceFor=(profile:RoutineProfile)=>{const source=plan.sources.find(s=>s.seed===profile.seed&&s.keepEpisodes===profile.keepEpisodes);if(!source||source.nativeHashes.length!==17||source.observations.length!==16||source.observations.some((r,i)=>r.at!==routineTimes[i]))throw Error('Invalid frozen LONG routine source');return source;};
const operands=(profile:RoutineProfile)=>sourceFor(profile).observations.map(r=>{const [a,b]=r.standing.split('/').map(BigInt);return readQ(rational(a,b));});
type Receiver=ReturnType<typeof createRoutineReceiver>;
export interface LongRoutineCheckpoint{version:'long-routine-reuse-workbench/0.1';index:number;prefix:number;saveHex:string;saveHash:string;pairHash:string;runHash:string;}
export type LongRoutineSnapshot=ReturnType<LongRoutineWorkbenchRun['snapshot']>;

/** Exact receiver replay under the accepted 0.1 source-reuse protocol, not a native run. */
export class LongRoutineWorkbenchRun{
 #receiver:Receiver;#index:number;#busy=false;
 #view!:{index:number;profile:RoutineProfile;seamVersion:string;protocolVersion:'routine-reuse-harness/0.1-candidate';boundary:'component-receiver-with-reused-native-source';prefix:number;complete:boolean;modelHash:string;runHash:string;saveHash:string;pairHash:string;sourceRun:string;reusedNativeSaveHash:string;state:ReturnType<Receiver['snapshot']>;scope:string};
 private constructor(receiver:Receiver,index:number){this.#receiver=receiver;this.#index=index;}
 static async create(index=0){
  const p=original(index),profile=structuredClone(p.profile) as RoutineProfile,receiver=createRoutineReceiver(profile),source=sourceFor(profile);
  const model=await createModelIdentity({rulesVersion:ROUTINE_VERSION,contentSchemaVersion:ROUTINE_VERSION,contentManifest:await commitManifest(text(JSON.stringify(plan.artifacts))),parameterSchemaVersion:ROUTINE_VERSION,parameterSet:await commitManifest(text(JSON.stringify({law:profile.law,keepEpisodes:profile.keepEpisodes}))),numericProfileVersion:'routine-exact-fine-standing/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:ROUTINE_VERSION,registryManifest:await commitManifest(list([]))});
  if(bytesToHex(model.canonicalBytes)!==p.modelIdentity)throw Error('LONG routine frozen model identity mismatch');
  const run=await createRunIdentity({modelIdentity:model,initialState:await commitManifest(text(JSON.stringify({receiver:bytesToHex(receiver.save()),sourceInitial:source.nativeHashes[0]}))),orderedInputSequence:await commitManifest(text(JSON.stringify({profile,source}))),runSeed:new Uint8Array(32).fill(profile.seed)});
  if(bytesToHex(run.canonicalBytes)!==p.runIdentity)throw Error('LONG routine frozen run identity mismatch');
  const adapter=new LongRoutineWorkbenchRun(receiver,index);await adapter.#refresh();return adapter;
 }
 snapshot(){if(this.#busy)throw Error('LONG routine advancing');return structuredClone(this.#view);}
 checkpoint():LongRoutineCheckpoint{if(this.#busy)throw Error('LONG routine advancing');return{version:'long-routine-reuse-workbench/0.1',index:this.#index,prefix:this.#view.prefix,saveHex:bytesToHex(this.#receiver.save()),saveHash:this.#view.saveHash,pairHash:this.#view.pairHash,runHash:this.#view.runHash};}
 async advance(){if(this.#busy)throw Error('LONG routine command already in flight');this.#busy=true;try{const moved=await this.#receiver.step(operands(this.#view.profile)[Math.min(this.#view.prefix,15)]);await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:LongRoutineCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='long-routine-reuse-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>16||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid LONG routine checkpoint');
  const p=original(c.index),saved=fromHex(c.saveHex);if(await digest(saved)!==c.saveHash||await digest(fromHex(p.runIdentity))!==c.runHash)throw Error('LONG routine checkpoint identity/digest mismatch');
  const adapter=await LongRoutineWorkbenchRun.create(c.index),profile=p.profile as RoutineProfile;
  const replay=createRoutineReceiver(profile);for(let n=0;n<c.prefix;n++)await replay.step(operands(profile)[n]);if(bytesToHex(replay.save())!==c.saveHex.toLowerCase())throw Error('LONG routine original prefix bytes mismatch');adapter.#receiver=replay;await adapter.#refresh();
  if(adapter.#view.pairHash!==c.pairHash)throw Error('LONG routine source/receiver commitment mismatch');return adapter;
 }
 async #refresh(){
  const p=original(this.#index),profile=p.profile as RoutineProfile,source=sourceFor(profile),state=this.#receiver.snapshot(),saved=this.#receiver.save();
  this.#view={index:this.#index,profile:structuredClone(profile),seamVersion:ROUTINE_VERSION,protocolVersion:'routine-reuse-harness/0.1-candidate',boundary:'component-receiver-with-reused-native-source',prefix:state.prefix,complete:state.prefix===16,modelHash:await digest(fromHex(p.modelIdentity)),runHash:await digest(fromHex(p.runIdentity)),saveHash:await digest(saved),pairHash:await digest(canonicalEncode(text(JSON.stringify({version:ROUTINE_VERSION,receiver:bytesToHex(saved),sourceRun:source.sourceRun,nativeSaveSha256:source.nativeHashes[state.prefix]})))),sourceRun:source.sourceRun,reusedNativeSaveHash:source.nativeHashes[state.prefix],state,scope:'Original REV1 receiver and exact source-reuse commitments. Only standing enters the receiver from the frozen source. Native retention is separate from receiving practice history. Reused native saves are provenance, not fresh native execution. Reward belief, cue-history availability, goal reasons, opportunity, performance and observed outcomes remain distinct. No fresh joined run, native scheduler admission, character narration or general routine law is claimed.'};
 }
}
