import catalog from './detCatalog.json';
import {canonicalEncode,canonicalDecode,RecordSchemaRegistry} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {cognitiveSupportedSchemas} from '../campaign2/cognitiveCodecs';
const DET_VERSION='campaign2-task-cognitive-persistence/0.1-candidate';
import {prepareCognitiveModel,createCognitiveRun,restoreCognitiveRun} from '../campaign2/cognitiveFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
export const DET_PROGRAMS=catalog.programs.map(r=>({id:r.name,model:r.model,runSeed:r.runSeed}));
const schema=new RecordSchemaRegistry(cognitiveSupportedSchemas());
// Public execution validates semantic bytes; this diagnostic read performs structural decoding.
const decode=(b:Uint8Array)=>canonicalDecode(b,schema);
function original(id:string){const row=catalog.programs.find(r=>r.name===id);if(!row)throw Error('Unknown frozen DET program');return row;}
function model(name:string){const m=catalog.models.find(m=>m.name===name);if(!m)throw Error('Unknown DET model');return m;}
function source(name:string){const m=model(name);return {...catalog.versions,parameters:fromHex(m.parameters),content:fromHex(m.content),registry:fromHex(m.registry)};}
type Run=Awaited<ReturnType<typeof createCognitiveRun>>;
export interface DetCheckpoint {version:'det-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type DetSnapshot=ReturnType<DetWorkbenchRun['snapshot']>;
export class DetWorkbenchRun {
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!:{program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;researchOutputs:string;traceHash:string;fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='baseline'){
  const row=original(program),m=model(row.model),run=await createCognitiveRun(await prepareCognitiveModel(source(row.model)),{initialState:fromHex(row.initialState),orderedInputs:fromHex(row.orderedInputs),runSeed:fromHex(row.runSeed)});
  const identity=rec(decode(run.runIdentity()),104n);if(exactKey(f(identity,1n))!==m.modelIdentity)throw Error('DET frozen model identity mismatch');const a=new DetWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('DET run is advancing');return structuredClone(this.#view);}
 checkpoint():DetCheckpoint{if(this.#busy)throw Error('DET run is advancing');return {version:'det-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:exactHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('DET command already in flight');if(this.#prefix>=16&&!this.#view.complete)throw Error('DET inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:DetCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='det-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>16||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded DET checkpoint');
  const expected=await DetWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('DET checkpoint digest mismatch');for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('DET checkpoint exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('DET checkpoint program/prefix mismatch');
  const row=original(c.program),run=await restoreCognitiveRun(source(row.model),{initialState:fromHex(row.initialState),orderedInputs:fromHex(row.orderedInputs),save}),a=new DetWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;
 }
 async #refresh(){const row=original(this.#program),m=model(row.model),s=this.#run.snapshot(),save=this.#run.save();
  this.#view={program:this.#program,seamVersion:DET_VERSION,projection:'Accepted cognitive complete-prefix persistence successor. Actual trace draws are researcher diagnostics; no character projection or external coupling map.',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),modelHash:await digest(fromHex(m.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),researchOutputs:exactText(decode(s.outputs)),traceHash:await digest(s.trace),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
 }
}
const exactHex=(b:Uint8Array)=>Array.from(b,v=>v.toString(16).padStart(2,'0')).join('');
