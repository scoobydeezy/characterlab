import catalog from './longCatalog.json';
import {prepareLongitudinalModel,createLongitudinalRun,restoreLongitudinalRun} from '../campaign3/longitudinalFactory';
import {decodeLongitudinal as decode} from '../campaign3/longitudinalCodecs';
import {OBSERVER} from '../campaign3/longitudinalModel';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {bytesToHex,canonicalEncode} from '../substrate/canonicalEncoding';
import {digest,fromHex,exactKey,exactText,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
export const LONG_PROGRAMS=catalog.programs.map(p=>({name:p.name,model:p.model,cohort:p.cohort}));
const original=(name:string)=>{const p=catalog.programs.find(p=>p.name===name);if(!p)throw Error('Unknown frozen LONG program');return p;};
const model=(name:string)=>{const m=catalog.models.find(m=>m.name===name);if(!m)throw Error('Unknown LONG model');return m;};
export const longModelSource=(name:string)=>{const m=model(name);return{content:fromHex(m.content),registry:fromHex(m.registry),parameters:fromHex(m.parameters)};};
type Run=Awaited<ReturnType<typeof createLongitudinalRun>>;
export interface LongCheckpoint{version:'long-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type LongSnapshot=ReturnType<LongWorkbenchRun['snapshot']>;
export class LongWorkbenchRun{
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!:{program:string;model:string;seamVersion:string;prefix:number;clock:string;complete:boolean;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;traceHash:string;observerHash:string;observerExact:string;observerHex:string;fields:{path:string;root:string;exact:string}[];researchOutputs:string;timeline:ReturnType<typeof nativeTimeline>;scope:string};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program=LONG_PROGRAMS[0].name){const p=original(program),m=model(p.model),run=await createLongitudinalRun(await prepareLongitudinalModel(longModelSource(p.model)),{initialState:fromHex(m.initialState),orderedInputs:fromHex(p.orderedInputs),runSeed:fromHex(p.runSeed)});const identity=rec(decode(run.runIdentity()),104n);if(bytesToHex(canonicalEncode(f(identity,1n)))!==m.modelIdentity)throw Error('LONG frozen model identity mismatch');const a=new LongWorkbenchRun(run,program);await a.#refresh();return a;}
 snapshot(){if(this.#busy)throw Error('LONG advancing');return structuredClone(this.#view);}
 checkpoint():LongCheckpoint{if(this.#busy)throw Error('LONG advancing');return{version:'long-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('LONG command already in flight');if(this.#prefix>=16&&!this.#view.complete)throw Error('LONG bounded horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:LongCheckpoint){const c=structuredClone(input);if(!c||c.version!=='long-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>16||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded LONG checkpoint');const expected=await LongWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('LONG checkpoint digest mismatch');for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('LONG prefix exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('LONG original prefix mismatch');const p=original(c.program),run=await restoreLongitudinalRun(longModelSource(p.model),{initialState:fromHex(model(p.model).initialState),orderedInputs:fromHex(p.orderedInputs),save});const a=new LongWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;}
 async #refresh(){const p=original(this.#program),s=this.#run.snapshot(),save=this.#run.save(),observer=this.#run.observerView(canonicalEncode(OBSERVER));this.#view={program:this.#program,model:p.model,seamVersion:catalog.contract,prefix:this.#prefix,clock:String(s.clock),complete:items(f(rec(decode(save),132n),7n),'list').length===0,modelHash:await digest(fromHex(model(p.model).modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),traceHash:await digest(s.trace),observerHash:await digest(observer),observerExact:exactText(decode(observer)),observerHex:bytesToHex(observer),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),researchOutputs:exactText(decode(s.outputs)),timeline:nativeTimeline(items(decode(s.trace),'list')),scope:'Original bounded LONG public source. Closed observer view is separate from omniscient research state/output/trace. Learned projection equality does not imply equal accessible detail. Goal, habit, personal-loss and routine successors and observer-safe language require separate qualification.'};}
}
