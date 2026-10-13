import catalog from './multisourceCatalog.json';
import {canonicalEncode,canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {multisourceSupportedSchemas} from '../campaign3/multisourcePublicCodecs';
const MULTISOURCE_VERSION='multisource-public/0.1-candidate';
import {prepareMultisourceModel,createMultisourceRun,restoreMultisourceRun} from '../campaign3/multisourceFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
export const MULTISOURCE_PROGRAMS=catalog.programs.map(r=>({id:r.name,model:r.model,runSeed:r.runSeed,cohort:r.cohort}));
const schema=new RecordSchemaRegistry(multisourceSupportedSchemas());
// Public execution validates semantic bytes; this diagnostic read performs structural decoding.
const decode=(b:Uint8Array)=>canonicalDecode(b,schema);
function original(id:string){const row=catalog.programs.find(r=>r.name===id);if(!row)throw Error('Unknown frozen MULTISOURCE program');return row;}
function model(name:string){const m=catalog.models.find(m=>m.name===name);if(!m)throw Error('Unknown MULTISOURCE model');return m;}
function source(name:string){const m=model(name);return {...catalog.versions,parameters:fromHex(m.parameters),content:fromHex(m.content),registry:fromHex(m.registry)};}
type Run=Awaited<ReturnType<typeof createMultisourceRun>>;
export interface MultisourceCheckpoint {version:'multisource-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type MultisourceSnapshot=ReturnType<MultisourceWorkbenchRun['snapshot']>;
export class MultisourceWorkbenchRun {
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!:{program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;researchOutputs:string;traceHash:string;fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='shared--GroundAggregate'){
  const row=original(program),m=model(row.model),run=await createMultisourceRun(await prepareMultisourceModel(source(row.model)),{initialState:fromHex(row.initialState),orderedInputs:fromHex(row.orderedInputs),runSeed:fromHex(row.runSeed)});
  const identity=rec(decode(run.runIdentity()),104n);if(exactKey(f(identity,1n))!==m.modelIdentity)throw Error('MULTISOURCE frozen model identity mismatch');const a=new MultisourceWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('MULTISOURCE run is advancing');return structuredClone(this.#view);}
 checkpoint():MultisourceCheckpoint{if(this.#busy)throw Error('MULTISOURCE run is advancing');return {version:'multisource-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:exactHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('MULTISOURCE command already in flight');if(this.#prefix>=8&&!this.#view.complete)throw Error('MULTISOURCE inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:MultisourceCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='multisource-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>8||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded MULTISOURCE checkpoint');
  const expected=await MultisourceWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('MULTISOURCE checkpoint digest mismatch');for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('MULTISOURCE checkpoint exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('MULTISOURCE checkpoint program/prefix mismatch');
  const row=original(c.program),run=await restoreMultisourceRun(source(row.model),{initialState:fromHex(row.initialState),orderedInputs:fromHex(row.orderedInputs),save}),a=new MultisourceWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;
 }
 async #refresh(){const row=original(this.#program),m=model(row.model),s=this.#run.snapshot(),save=this.#run.save();
  this.#view={program:this.#program,seamVersion:MULTISOURCE_VERSION,projection:'Researcher-only native diagnostics. No observer-safe character projection is qualified.',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),modelHash:await digest(fromHex(m.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),researchOutputs:exactText(decode(s.outputs)),traceHash:await digest(s.trace),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
 }
}
const exactHex=(b:Uint8Array)=>Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');
