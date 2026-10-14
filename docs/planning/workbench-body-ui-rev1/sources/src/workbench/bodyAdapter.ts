import catalog from './bodyCatalog.json';
import {prepareEmbodiedModel,createEmbodiedRun,restoreEmbodiedRun,embodiedModelIdentity} from '../campaign3/embodiedFactory';
import {decodeEmbodied as decode} from '../campaign3/embodiedCodecs';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {bytesToHex} from '../substrate/canonicalEncoding';
import {digest,fromHex,exactKey,exactText,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
export const BODY_PROGRAMS=catalog.programs.map(p=>({name:p.name,model:p.model}));
const original=(name:string)=>{const p=catalog.programs.find(p=>p.name===name);if(!p)throw Error('Unknown frozen BODY program');return p;};
const model=(name:string)=>{const m=catalog.models.find(m=>m.name===name);if(!m)throw Error('Unknown BODY model');return m;};
export const bodyModelSource=(name:string)=>{const m=model(name);return {...catalog.versions,content:fromHex(m.content),registry:fromHex(m.registry),parameters:fromHex(m.parameters)};};
type Run=Awaited<ReturnType<typeof createEmbodiedRun>>;
export interface BodyCheckpoint{version:'body-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type BodySnapshot=ReturnType<BodyWorkbenchRun['snapshot']>;
export class BodyWorkbenchRun{
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!:{program:string;model:string;seamVersion:string;prefix:number;clock:string;complete:boolean;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;traceHash:string;fields:{path:string;root:string;exact:string}[];researchOutputs:string;timeline:ReturnType<typeof nativeTimeline>;scope:string};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='baseline'){
  const p=original(program),token=await prepareEmbodiedModel(bodyModelSource(p.model));if(bytesToHex(embodiedModelIdentity(token))!==model(p.model).modelIdentity)throw Error('BODY frozen model identity mismatch');
  const run=await createEmbodiedRun(token,{initialState:fromHex(p.initialState),orderedInputs:fromHex(p.orderedInputs),runSeed:fromHex(p.runSeed)});if(bytesToHex(run.runIdentity())!==p.runIdentity)throw Error('BODY original run identity mismatch');
  const a=new BodyWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('BODY advancing');return structuredClone(this.#view);}
 checkpoint():BodyCheckpoint{if(this.#busy)throw Error('BODY advancing');return{version:'body-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('BODY command already in flight');if(this.#prefix>=100&&!this.#view.complete)throw Error('BODY bounded horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:BodyCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='body-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>100||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded BODY checkpoint');
  const expected=await BodyWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('BODY checkpoint digest mismatch');
  for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('BODY prefix exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('BODY original prefix mismatch');
  const p=original(c.program),run=await restoreEmbodiedRun(bodyModelSource(p.model),{initialState:fromHex(p.initialState),orderedInputs:fromHex(p.orderedInputs),save});const a=new BodyWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;
 }
 async #refresh(){const p=original(this.#program),s=this.#run.snapshot(),save=this.#run.save();this.#view={program:this.#program,model:p.model,seamVersion:'campaign3-embodied-persistence/0.1-candidate',prefix:this.#prefix,clock:String(s.clock),complete:items(f(rec(decode(save),132n),7n),'list').length===0,modelHash:await digest(fromHex(model(p.model).modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),traceHash:await digest(s.trace),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),researchOutputs:exactText(decode(s.outputs)),timeline:nativeTimeline(items(decode(s.trace),'list')),scope:'Original BODY public EMB source program under current wrapper-repaired runtime. Truth-side body diagnostics are not character evidence. Mediated pressure, observation and delivery remain distinct. Ownership components and observer-safe explanation are not supplied by this raw source adapter.'};}
}
