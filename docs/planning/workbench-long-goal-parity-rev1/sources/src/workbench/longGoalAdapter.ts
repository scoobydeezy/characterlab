import plan from '../../docs/planning/LONGITUDINAL_GOAL_PLAN_REV1.json';
import {createLongitudinalGoalRun,restoreLongitudinalGoalRun,originalInputs,VERSION,type Law,type GoalMode} from '../campaign3/longitudinalGoal';
import {commitManifest,createModelIdentity,createRunIdentity} from '../substrate/identity';
import {text,list,bytes,bytesToHex} from '../substrate/canonicalEncoding';
import {decodeReceiving} from '../campaign3/receivingCodecs';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {digest,fromHex} from './canonical';
export const LONG_GOAL_CASES=plan.runs.map((r,index)=>({index,law:r.law,mode:r.mode,seed:r.seed,keepEpisodes:r.keepEpisodes}));
const original=(index:number)=>{if(!Number.isInteger(index)||index<0||index>=plan.runs.length)throw Error('Unknown original LONG goal case');return plan.runs[index];};
type Run=Awaited<ReturnType<typeof createLongitudinalGoalRun>>;
export interface LongGoalCheckpoint{version:'long-goal-workbench/0.1';index:number;prefix:number;saveHex:string;saveHash:string;runHash:string;}
export type LongGoalSnapshot=ReturnType<LongGoalWorkbenchRun['snapshot']>;
export class LongGoalWorkbenchRun{
 #run:Run;#index:number;#busy=false;
 #view!:{index:number;law:string;mode:string;seed:number;keepEpisodes:boolean;seamVersion:string;boundary:'native-source-plus-component-receiver';prefix:number;complete:boolean;modelHash:string;runHash:string;saveHash:string;nativeSaveHash:string;state:ReturnType<Run['snapshot']>;scope:string};
 private constructor(run:Run,index:number){this.#run=run;this.#index=index;}
 static async create(index=0){
  const p=original(index),run=await createLongitudinalGoalRun(p.law as Law,p.mode as GoalMode,p.seed,p.keepEpisodes),model=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(text(JSON.stringify(plan.artifacts))),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(text(JSON.stringify({law:p.law,keepEpisodes:p.keepEpisodes}))),numericProfileVersion:'longitudinal-goal-exact-with-declared-integer-receiver',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(list([]))});
  if(bytesToHex(model.canonicalBytes)!==p.modelIdentity)throw Error('LONG goal frozen model identity mismatch');
  const identity=await createRunIdentity({modelIdentity:model,initialState:await commitManifest(decodeReceiving(run.save())),orderedInputSequence:await commitManifest(list([text(p.mode),bytes(originalInputs())])),runSeed:new Uint8Array(32).fill(p.seed)});if(bytesToHex(identity.canonicalBytes)!==p.runIdentity)throw Error('LONG goal original run identity mismatch');
  const a=new LongGoalWorkbenchRun(run,index);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('LONG goal advancing');return structuredClone(this.#view);}
 checkpoint():LongGoalCheckpoint{if(this.#busy)throw Error('LONG goal advancing');return{version:'long-goal-workbench/0.1',index:this.#index,prefix:this.#view.prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash,runHash:this.#view.runHash};}
 async advance(){if(this.#busy)throw Error('LONG goal command already in flight');this.#busy=true;try{const moved=await this.#run.step();await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:LongGoalCheckpoint){const c=structuredClone(input);if(!c||c.version!=='long-goal-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>16||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid LONG goal checkpoint');const p=original(c.index),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash||await digest(fromHex(p.runIdentity))!==c.runHash)throw Error('LONG goal checkpoint identity/digest mismatch');await LongGoalWorkbenchRun.create(c.index);const run=await restoreLongitudinalGoalRun(p.law as Law,p.mode as GoalMode,p.seed,p.keepEpisodes,c.prefix,save),a=new LongGoalWorkbenchRun(run,c.index);await a.#refresh();return a;}
 async #refresh(){const p=original(this.#index),state=this.#run.snapshot();this.#view={index:this.#index,law:p.law,mode:p.mode,seed:p.seed,keepEpisodes:p.keepEpisodes,seamVersion:VERSION,boundary:'native-source-plus-component-receiver',prefix:state.prefix,complete:state.prefix===16,modelHash:await digest(fromHex(p.modelIdentity)),runHash:await digest(fromHex(p.runIdentity)),saveHash:await digest(this.#run.save()),nativeSaveHash:await digest(this.#run.nativeSave()),state,scope:'Original identity-bound LONG goal composition. Native biography/skill/relationship source and component-owned goal ledger/receiving decisions remain separate. Joined steps are not native scheduler events; component saves are not public Save132. Exact standing and truncated receiving modifiers remain distinct. No observer-safe narrative or general goal attainment claim.'};}
}
