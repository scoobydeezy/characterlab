import plan from '../../docs/planning/SUBSTITUTION_PLAN_REV1.json';
import {createSubstitutionRun,restoreSubstitutionRun,substitutionContent,VERSION,type Law} from '../campaign3/dependenceSubstitutes';
import {createModelIdentity,createRunIdentity,commitManifest} from '../substrate/identity';
import {text,list,canonicalEncode,bytesToHex} from '../substrate/canonicalEncoding';
import {RANDOM_ALGORITHM_VERSION} from '../substrate/random';
import {digest,fromHex} from './canonical';
export const SUBSTITUTION_PROGRAMS=plan.runs.map(r=>({id:r.law+'/'+r.name,law:r.law,name:r.name}));
const original=(id:string)=>{const r=plan.runs.find(r=>r.law+'/'+r.name===id);if(!r)throw Error('Unknown frozen SUBSTITUTION program');return r;};
type Run=ReturnType<typeof createSubstitutionRun>;
export interface SubstitutionCheckpoint{version:'substitution-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;runHash:string;}
export type SubstitutionSnapshot=ReturnType<SubstitutionWorkbenchRun['snapshot']>;
/** Original component transactions only. No native scheduler, trace or state-root admission. */
export class SubstitutionWorkbenchRun{
 #run:Run;#program:string;#busy=false;
 #view!:{program:string;law:Law;seamVersion:string;boundary:'standalone-component';prefix:number;complete:boolean;modelHash:string;runHash:string;saveHash:string;stateHash:string;observerHash:string;state:ReturnType<Run['snapshot']>;observer:ReturnType<Run['observerView']>;scope:string};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='LatestHistory/diversified'){
  const p=original(program),law=p.law as Law;
  if(bytesToHex(canonicalEncode(substitutionContent()))!==plan.content)throw Error('SUBSTITUTION content mismatch');
  const model=await createModelIdentity({rulesVersion:VERSION,contentSchemaVersion:VERSION,contentManifest:await commitManifest(list([substitutionContent(),text(JSON.stringify(plan.artifacts))])),parameterSchemaVersion:VERSION,parameterSet:await commitManifest(text(law)),numericProfileVersion:'exact-rational/substitution-component',randomAlgorithmVersion:RANDOM_ALGORITHM_VERSION,registrySchemaVersion:VERSION,registryManifest:await commitManifest(list([]))});
  const identity=await createRunIdentity({modelIdentity:model,initialState:await commitManifest(list([])),orderedInputSequence:await commitManifest(text(JSON.stringify(p.input))),runSeed:fromHex(plan.seed)});
  if(bytesToHex(model.canonicalBytes)!==p.modelIdentity||bytesToHex(identity.canonicalBytes)!==p.runIdentity)throw Error('SUBSTITUTION original identity mismatch');
  const a=new SubstitutionWorkbenchRun(createSubstitutionRun(law,p.input,7),program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('SUBSTITUTION advancing');return structuredClone(this.#view);}
 checkpoint():SubstitutionCheckpoint{if(this.#busy)throw Error('SUBSTITUTION advancing');return{version:'substitution-workbench/0.1',program:this.#program,prefix:this.#view.prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash,runHash:this.#view.runHash};}
 async advance(){if(this.#busy)throw Error('SUBSTITUTION command already in flight');this.#busy=true;try{const moved=await this.#run.step();await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:SubstitutionCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='substitution-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>8||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid SUBSTITUTION checkpoint');
  const p=original(c.program),saved=fromHex(c.saveHex);if(await digest(saved)!==c.saveHash||await digest(fromHex(p.runIdentity))!==c.runHash)throw Error('SUBSTITUTION checkpoint identity/digest mismatch');
  const a=await SubstitutionWorkbenchRun.create(c.program);a.#run=await restoreSubstitutionRun(p.law as Law,p.input,saved,7);await a.#refresh();if(a.#view.prefix!==c.prefix)throw Error('SUBSTITUTION checkpoint prefix mismatch');return a;
 }
 async #refresh(){const p=original(this.#program),state=this.#run.snapshot(),observer=this.#run.observerView(),encode=(v:unknown)=>new TextEncoder().encode(JSON.stringify(v));this.#view={program:this.#program,law:p.law as Law,seamVersion:VERSION,boundary:'standalone-component',prefix:state.at,complete:state.at===8,modelHash:await digest(fromHex(p.modelIdentity)),runHash:await digest(fromHex(p.runIdentity)),saveHash:await digest(this.#run.save()),stateHash:await digest(encode(state)),observerHash:await digest(encode(observer)),state,observer,scope:'Original dependence/substitutes component. Belief, acquired cue history, availability, reason strength, selected intent, admitted receipt and physical delivery remain separate. Observer view excludes world truth and execution results but contains mechanical choice provenance; it is not private thought or qualified narration. State includes researcher-only world and RNG diagnostics. No public scheduler, native timeline, physiological Need, clinical dependence or general history-necessity claim.'};}
}
