import plan from '../../docs/planning/LONGITUDINAL_HABIT_PLAN_REV2.json';
import {createHabitReceiver,restoreHabitReceiver,HABIT_VERSION,habitTimes,type HabitProfile} from '../campaign3/longitudinalHabit';
import {createModelIdentity,createRunIdentity,commitManifest} from '../substrate/identity';
import {canonicalEncode,text,list,bytesToHex,rational} from '../substrate/canonicalEncoding';
import {readQ} from '../campaign2/cognitiveMath';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {digest,fromHex} from './canonical';

export const LONG_HABIT_CASES=plan.runs.map((r,index)=>({index,...r.profile}));
const original=(index:number)=>{if(!Number.isInteger(index)||index<0||index>=plan.runs.length)throw Error('Unknown original LONG habit case');return plan.runs[index];};
const sourceFor=(profile:HabitProfile)=>{const source=plan.sources.find(s=>s.seed===profile.seed&&!s.keepEpisodes);if(!source||source.nativeHashes.length!==17||source.observations.length!==16||source.observations.some((r,i)=>r.at!==habitTimes[i]))throw Error('Invalid frozen LONG habit source');return source;};
const operands=(profile:HabitProfile)=>sourceFor(profile).observations.map(r=>{const [a,b]=r.standing.split('/').map(BigInt);return readQ(rational(a,b));});
type Receiver=ReturnType<typeof createHabitReceiver>;
export interface LongHabitCheckpoint{version:'long-habit-reuse-workbench/0.1';index:number;prefix:number;saveHex:string;saveHash:string;pairHash:string;runHash:string;}
export type LongHabitSnapshot=ReturnType<LongHabitWorkbenchRun['snapshot']>;

/** Exact receiver replay under the accepted 0.2 source-reuse protocol, not a native run. */
export class LongHabitWorkbenchRun{
 #receiver:Receiver;#index:number;#busy=false;
 #view!:{index:number;profile:HabitProfile;seamVersion:string;protocolVersion:'habit-reuse-harness/0.2-candidate';boundary:'component-receiver-with-reused-native-source';prefix:number;complete:boolean;modelHash:string;runHash:string;saveHash:string;pairHash:string;sourceRun:string;reusedNativeSaveHash:string;state:ReturnType<Receiver['snapshot']>;scope:string};
 private constructor(receiver:Receiver,index:number){this.#receiver=receiver;this.#index=index;}
 static async create(index=0){
  const p=original(index),profile=structuredClone(p.profile) as HabitProfile,receiver=createHabitReceiver(profile),source=sourceFor(profile);
  const model=await createModelIdentity({rulesVersion:HABIT_VERSION,contentSchemaVersion:HABIT_VERSION,contentManifest:await commitManifest(text(JSON.stringify(plan.artifacts))),parameterSchemaVersion:HABIT_VERSION,parameterSet:await commitManifest(text(JSON.stringify({law:profile.law,keepEpisodes:profile.keepEpisodes}))),numericProfileVersion:'habit-exact-fine-standing/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:HABIT_VERSION,registryManifest:await commitManifest(list([]))});
  if(bytesToHex(model.canonicalBytes)!==p.modelIdentity)throw Error('LONG habit frozen model identity mismatch');
  const run=await createRunIdentity({modelIdentity:model,initialState:await commitManifest(text(JSON.stringify({receiver:bytesToHex(receiver.save()),sourceInitial:source.nativeHashes[0]}))),orderedInputSequence:await commitManifest(text(JSON.stringify({profile,source}))),runSeed:new Uint8Array(32).fill(profile.seed)});
  if(bytesToHex(run.canonicalBytes)!==p.runIdentity)throw Error('LONG habit frozen run identity mismatch');
  const adapter=new LongHabitWorkbenchRun(receiver,index);await adapter.#refresh();return adapter;
 }
 snapshot(){if(this.#busy)throw Error('LONG habit advancing');return structuredClone(this.#view);}
 checkpoint():LongHabitCheckpoint{if(this.#busy)throw Error('LONG habit advancing');return{version:'long-habit-reuse-workbench/0.1',index:this.#index,prefix:this.#view.prefix,saveHex:bytesToHex(this.#receiver.save()),saveHash:this.#view.saveHash,pairHash:this.#view.pairHash,runHash:this.#view.runHash};}
 async advance(){if(this.#busy)throw Error('LONG habit command already in flight');this.#busy=true;try{const moved=await this.#receiver.step(operands(this.#view.profile)[Math.min(this.#view.prefix,15)]);await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:LongHabitCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='long-habit-reuse-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>16||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid LONG habit checkpoint');
  const p=original(c.index),saved=fromHex(c.saveHex);if(await digest(saved)!==c.saveHash||await digest(fromHex(p.runIdentity))!==c.runHash)throw Error('LONG habit checkpoint identity/digest mismatch');
  const adapter=await LongHabitWorkbenchRun.create(c.index),profile=p.profile as HabitProfile;
  adapter.#receiver=await restoreHabitReceiver(profile,operands(profile),c.prefix,saved);await adapter.#refresh();
  if(adapter.#view.pairHash!==c.pairHash)throw Error('LONG habit source/receiver commitment mismatch');return adapter;
 }
 async #refresh(){
  const p=original(this.#index),profile=p.profile as HabitProfile,source=sourceFor(profile),state=this.#receiver.snapshot(),saved=this.#receiver.save();
  this.#view={index:this.#index,profile:structuredClone(profile),seamVersion:HABIT_VERSION,protocolVersion:'habit-reuse-harness/0.2-candidate',boundary:'component-receiver-with-reused-native-source',prefix:state.prefix,complete:state.prefix===16,modelHash:await digest(fromHex(p.modelIdentity)),runHash:await digest(fromHex(p.runIdentity)),saveHash:await digest(saved),pairHash:await digest(canonicalEncode(text(JSON.stringify({version:HABIT_VERSION,receiver:bytesToHex(saved),sourceRun:source.sourceRun,nativeSaveSha256:source.nativeHashes[state.prefix]})))),sourceRun:source.sourceRun,reusedNativeSaveHash:source.nativeHashes[state.prefix],state,scope:'Original REV2 receiver identity and exact source-reuse commitments. Only standing from the frozen source enters the receiver. Receiving practice retention does not alter native memory. Reused native save hashes are provenance, not newly executed native restores. Component diagnostics are not character narration; habit availability, performance, observed outcomes and episode loss remain distinct. No fresh joined run, native scheduler admission or general learning law is claimed.'};
 }
}
