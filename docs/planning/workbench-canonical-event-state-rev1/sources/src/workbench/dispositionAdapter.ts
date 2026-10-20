import plan from '../../docs/planning/DISPOSITION_PUBLIC_PLAN_REV1.json';
import {dispositionCase,type DispositionCase} from '../test/dispositionAdaptationFixtures';
import {dispositionRecipe,dispositionInitial,dispositionOrdered,VERSION} from '../campaign3/dispositionPublicModel';
import {prepareDispositionModel,createDispositionPublicRun,restoreDispositionPublicRun} from '../campaign3/dispositionPublicFactory';
import {decodeDispositionPublic as decode} from '../campaign3/dispositionPublicCodecs';
import {dataItems as items} from '../campaign2/canonicalData';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {bytesToHex} from '../substrate/canonicalEncoding';
import {digest,exactKey,exactText,fromHex} from './canonical';
import {nativeTimeline} from './nativeTimeline';
import {encodeCheckpointHex,decodeCheckpointHex} from './largeCheckpointHex';
export const DISPOSITION_PROGRAMS=plan.runs.map(r=>({id:r.law+'/'+r.name,index:r.index,law:r.law,constitution:r.constitution}));
export const DISPOSITION_MAX_SAVE_BYTES=128_000_000;
function original(id:string){const row=plan.runs.find(r=>r.law+'/'+r.name===id);if(!row)throw Error('Unknown frozen DISPOSITION program');const c=dispositionCase(row as DispositionCase);return {row,...c,source:dispositionRecipe(c.profile),initialState:dispositionInitial(),orderedInputs:dispositionOrdered(c.profile,c.frames)};}
type NativeRun=Awaited<ReturnType<typeof createDispositionPublicRun>>;
export interface DispositionCheckpoint{version:'disposition-workbench/0.1';program:string;prefix:number;runHash:string;saveHash:string;saveHex:string;}
export type DispositionSnapshot=ReturnType<DispositionWorkbenchRun['snapshot']>;
export class DispositionWorkbenchRun{
 #run:NativeRun;#program:string;#prefix=0;#busy=false;
 #view!:{program:string;seamVersion:string;constitution:string;law:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;projectionHash:string;mechanismProjection:string;fields:{root:string;path:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>;scope:string};
 private constructor(run:NativeRun,program:string){this.#run=run;this.#program=program;}
 static async create(program='Plastic/Main'){
  const c=original(program);if(await digest(c.orderedInputs)!==c.row.inputsSha256)throw Error('DISPOSITION original input mismatch');
  const run=await createDispositionPublicRun(await prepareDispositionModel(c.source),{initialState:c.initialState,orderedInputs:c.orderedInputs,runSeed:new Uint8Array(32)});
  if(bytesToHex(run.modelIdentity())!==c.row.modelIdentity||bytesToHex(run.runIdentity())!==c.row.runIdentity)throw Error('DISPOSITION original model/run identity mismatch');
  const a=new DispositionWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('DISPOSITION command in flight');return structuredClone(this.#view);}
 checkpoint():DispositionCheckpoint{if(this.#busy)throw Error('DISPOSITION command in flight');const save=this.#run.save();if(save.length>DISPOSITION_MAX_SAVE_BYTES)throw Error('DISPOSITION checkpoint exceeds explicit 128MB save limit; no simulation events discarded');return {version:'disposition-workbench/0.1',program:this.#program,prefix:this.#prefix,runHash:this.#view.runHash,saveHash:this.#view.saveHash,saveHex:encodeCheckpointHex(save,DISPOSITION_MAX_SAVE_BYTES)};}
 async advance(){if(this.#busy)throw Error('DISPOSITION command in flight');if(this.#view.complete)return false;this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:DispositionCheckpoint){
  if(!input||input.version!=='disposition-workbench/0.1'||!Number.isInteger(input.prefix)||input.prefix<0||input.prefix>18||typeof input.saveHex!=='string'||input.saveHex.length>DISPOSITION_MAX_SAVE_BYTES*2)throw Error('Invalid bounded DISPOSITION checkpoint');
  const c=structuredClone(input),o=original(c.program),save=decodeCheckpointHex(c.saveHex,DISPOSITION_MAX_SAVE_BYTES);
  if(await digest(save)!==c.saveHash||await digest(fromHex(o.row.runIdentity))!==c.runHash)throw Error('DISPOSITION checkpoint identity/digest mismatch');
  const run=await restoreDispositionPublicRun(o.source,{initialState:o.initialState,orderedInputs:o.orderedInputs,save}),a=new DispositionWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();
  if(a.#view.timeline.length!==c.prefix*10||a.#view.clock!==String(c.prefix))throw Error('DISPOSITION checkpoint prefix mismatch');return a;
 }
 async #refresh(){
  const o=original(this.#program),s=this.#run.snapshot(),save=this.#run.save(),projection=this.#run.characterProjection(),timeline=nativeTimeline(items(decode(s.trace),'list'));
  this.#view={program:this.#program,seamVersion:VERSION,constitution:o.profile.constitution===0?'0/1':o.profile.constitution+'/8',law:o.profile.law,prefix:this.#prefix,complete:this.#prefix===18,clock:String(s.clock??0),modelHash:await digest(this.#run.modelIdentity()),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),projectionHash:await digest(projection),mechanismProjection:exactText(decode(projection)),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({root:String(e.path.rootStateTypeId),path:exactKey(statePathValue(e.path)),exact:exactText(e.value)})),timeline,scope:'disposition-public/0.1-candidate, original18-instant opposed task-fidelity channel. Constitution, plastic contribution, effective disposition, identity standing and world execution remain distinct. Mechanism-side characterProjection excludes world execution but grants no represented self-knowledge, downstream evidence-reference admission or qualified narration. No general constitutional vector, universal plasticity or independent necessity claim.'};
 }
}
