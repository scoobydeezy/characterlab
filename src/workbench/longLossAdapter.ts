import plan from '../../docs/planning/LONGITUDINAL_PERSONAL_LOSS_PLAN_REV1.json';
import {createPersonalLossRun,restorePersonalLossRun,LOSS_VERSION,type LossProfile} from '../campaign3/longitudinalPersonalLoss';
import {createModelIdentity,createRunIdentity,commitManifest} from '../substrate/identity';
import {text,list,bytesToHex} from '../substrate/canonicalEncoding';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {digest,fromHex} from './canonical';
export const LONG_LOSS_CASES=plan.runs.map((r,index)=>({index,...r.profile}));
const original=(index:number)=>{if(!Number.isInteger(index)||index<0||index>=plan.runs.length)throw Error('Unknown original LONG loss case');return plan.runs[index];};
type Run=ReturnType<typeof createPersonalLossRun>;
export interface LongLossCheckpoint{version:'long-loss-workbench/0.1';index:number;prefix:number;saveHex:string;saveHash:string;runHash:string;}
export type LongLossSnapshot=ReturnType<LongLossWorkbenchRun['snapshot']>;
export class LongLossWorkbenchRun{
 #run:Run;#index:number;#busy=false;
 #view!:{index:number;profile:LossProfile;seamVersion:string;boundary:'standalone-component';prefix:number;complete:boolean;modelHash:string;runHash:string;saveHash:string;state:ReturnType<Run['snapshot']>;scope:string};
 private constructor(run:Run,index:number){this.#run=run;this.#index=index;}
 static async create(index=0){
  const p=original(index),profile=structuredClone(p.profile) as LossProfile,run=createPersonalLossRun(profile);
  const model=await createModelIdentity({rulesVersion:LOSS_VERSION,contentSchemaVersion:LOSS_VERSION,contentManifest:await commitManifest(text(JSON.stringify(plan.artifacts))),parameterSchemaVersion:LOSS_VERSION,parameterSet:await commitManifest(text(profile.law)),numericProfileVersion:'personal-loss-exact-fine/0.1-candidate',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:LOSS_VERSION,registryManifest:await commitManifest(list([]))});
  if(bytesToHex(model.canonicalBytes)!==p.modelIdentity)throw Error('LONG loss frozen model identity mismatch');
  const identity=await createRunIdentity({modelIdentity:model,initialState:await commitManifest(text(bytesToHex(run.save()))),orderedInputSequence:await commitManifest(text(JSON.stringify({profile,instants:Array.from({length:12},(_,i)=>i+1)}))),runSeed:new Uint8Array(32).fill(profile.seed)});
  if(bytesToHex(identity.canonicalBytes)!==p.runIdentity)throw Error('LONG loss frozen run identity mismatch');
  const adapter=new LongLossWorkbenchRun(run,index);await adapter.#refresh();return adapter;
 }
 snapshot(){if(this.#busy)throw Error('LONG loss advancing');return structuredClone(this.#view);}
 checkpoint():LongLossCheckpoint{if(this.#busy)throw Error('LONG loss advancing');return{version:'long-loss-workbench/0.1',index:this.#index,prefix:this.#view.prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash,runHash:this.#view.runHash};}
 async advance(){if(this.#busy)throw Error('LONG loss command already in flight');this.#busy=true;try{const moved=await this.#run.step();await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:LongLossCheckpoint){const c=structuredClone(input);if(!c||c.version!=='long-loss-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>12||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid LONG loss checkpoint');const p=original(c.index),saved=fromHex(c.saveHex);if(await digest(saved)!==c.saveHash||await digest(fromHex(p.runIdentity))!==c.runHash)throw Error('LONG loss checkpoint identity/digest mismatch');const adapter=await LongLossWorkbenchRun.create(c.index);adapter.#run=await restorePersonalLossRun(p.profile as LossProfile,c.prefix,saved);await adapter.#refresh();return adapter;}
 async #refresh(){const p=original(this.#index),state=this.#run.snapshot();this.#view={index:this.#index,profile:structuredClone(p.profile) as LossProfile,seamVersion:LOSS_VERSION,boundary:'standalone-component',prefix:state.prefix,complete:state.prefix===12,modelHash:await digest(fromHex(p.modelIdentity)),runHash:await digest(fromHex(p.runIdentity)),saveHash:await digest(this.#run.save()),state,scope:'Original valued-contact-loss component. Acquired relationship history, retained report belief, owned goals and appraisal remain separate from physical contact and support completion. Complete snapshots include researcher-only execution fields; they are not character narration. No reused native source, public scheduler/Save132 admission, clinical grief law or general recovery claim.'};}
}
