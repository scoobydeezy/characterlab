import catalog from './habitCatalog.json';
import {canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {habitSupportedSchemas} from '../campaign3/habitCodecs';
import {HABIT_VERSION} from '../campaign3/habitModel';
import {prepareHabitModel,createHabitRun,restoreHabitRun} from '../campaign3/habitFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
export const HABIT_PROGRAMS=catalog.programs.map(r=>({id:r.name,model:r.model,seed:r.seed,cohort:r.cohort}));
const schema=new RecordSchemaRegistry(habitSupportedSchemas());
// Public execution validates semantic bytes; this diagnostic read performs structural decoding.
const decode=(b:Uint8Array)=>canonicalDecode(b,schema);
function original(id:string){const row=catalog.programs.find(r=>r.name===id);if(!row)throw Error('Unknown frozen HABIT program');if(row.seed!==0)throw Error('HABIT frozen seed must be zero');return row;}
function model(name:string){const m=catalog.models.find(m=>m.name===name);if(!m)throw Error('Unknown HABIT model');return m;}
function source(name:string){const m=model(name);return {parameters:fromHex(m.parameters),content:fromHex(m.content),registry:fromHex(m.registry)};}
type Run=Awaited<ReturnType<typeof createHabitRun>>;
export interface HabitCheckpoint {version:'habit-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type HabitSnapshot=ReturnType<HabitWorkbenchRun['snapshot']>;
export class HabitWorkbenchRun {
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!:{program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;researchOutputs:string;fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='candidate-1-law-1'){
  const row=original(program),m=model(row.model),run=await createHabitRun(await prepareHabitModel(source(row.model)),{initialState:fromHex(m.initialState),orderedInputs:fromHex(row.orderedInputs),runSeed:new Uint8Array(32)});
  const identity=rec(decode(run.runIdentity()),104n);if(exactKey(f(identity,1n))!==m.modelIdentity)throw Error('HABIT frozen model identity mismatch');const a=new HabitWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('HABIT run is advancing');return structuredClone(this.#view);}
 checkpoint():HabitCheckpoint{if(this.#busy)throw Error('HABIT run is advancing');return {version:'habit-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:exactHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('HABIT command already in flight');if(this.#prefix>=16&&!this.#view.complete)throw Error('HABIT inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:HabitCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='habit-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>16||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded HABIT checkpoint');
  const expected=await HabitWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('HABIT checkpoint digest mismatch');for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('HABIT checkpoint exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('HABIT checkpoint program/prefix mismatch');
  const row=original(c.program),run=await restoreHabitRun(source(row.model),{initialState:fromHex(model(row.model).initialState),orderedInputs:fromHex(row.orderedInputs),save}),a=new HabitWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;
 }
 async #refresh(){const row=original(this.#program),m=model(row.model),s=this.#run.snapshot(),save=this.#run.save();
  this.#view={program:this.#program,seamVersion:HABIT_VERSION,projection:'Researcher-only native records; no observer-safe character projection or narrative is qualified yet.',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),modelHash:await digest(fromHex(m.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),researchOutputs:exactText(decode(s.outputs)),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
 }
}
const exactHex=(b:Uint8Array)=>Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');
