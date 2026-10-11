import plan from '../../docs/planning/LEARN_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import {canonicalDecode,canonicalEncode,set,RecordSchemaRegistry,bytesToHex} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {learnSupportedSchemas} from '../campaign3/learnCodecs';
import {learnRecipe,LEARN_VERSION} from '../campaign3/learnModel';
import {prepareLearnModel,createLearnRun,restoreLearnRun} from '../campaign3/learnFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';

export const LEARN_PROGRAMS = plan.runs.map(row=>({id:`${row.law}/${row.numeric}/${row.name}`,name:row.name,law:row.law,numeric:row.numeric}));
const registry=new RecordSchemaRegistry(learnSupportedSchemas());
const decode=(bytes:Uint8Array)=>canonicalDecode(bytes,registry);
const initialState=canonicalEncode(set([]));
const seed=()=>new Uint8Array(32);
type Run=Awaited<ReturnType<typeof createLearnRun>>;
export interface LearnCheckpoint {version:'learn-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type LearnSnapshot=ReturnType<LearnWorkbenchRun['snapshot']>;
export class LearnWorkbenchRun {
  #run:Run; #program:string; #prefix=0; #busy=false;
  #view!: {program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;
    modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;
    researchOutputs:string;fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
  private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
  static async create(program='1/1/compatible') {
    const row=plan.runs.find(r=>`${r.law}/${r.numeric}/${r.name}`===program);if(!row)throw Error('Unknown frozen LEARN program');
    const run=await createLearnRun(await prepareLearnModel(learnRecipe(row.law,row.numeric)),{initialState,orderedInputs:fromHex(row.orderedInputs),runSeed:seed()});
    if(bytesToHex(run.runIdentity())!==row.runIdentity)throw Error('Frozen LEARN run identity mismatch');
    const adapter=new LearnWorkbenchRun(run,program);await adapter.#refresh();return adapter;
  }
  snapshot(){if(this.#busy)throw Error('LEARN run is advancing');return structuredClone(this.#view);}
  checkpoint():LearnCheckpoint {if(this.#busy)throw Error('LEARN run is advancing');return {version:'learn-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash};}
  async advance(){if(this.#busy)throw Error('LEARN command already in flight');if(this.#prefix>=64&&!this.#view.complete)throw Error('LEARN inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
  static async restore(input:LearnCheckpoint) {
    const c=structuredClone(input);if(!c||c.version!=='learn-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>64||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded LEARN checkpoint');
    const expected=await LearnWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('LEARN checkpoint digest mismatch');
    for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('LEARN checkpoint exceeds original horizon');
    if(!equalBytes(expected.#run.save(),save))throw Error('LEARN checkpoint program/prefix mismatch');
    const row=plan.runs.find(r=>`${r.law}/${r.numeric}/${r.name}`===c.program)!;
    const run=await restoreLearnRun(learnRecipe(row.law,row.numeric),{initialState,orderedInputs:fromHex(row.orderedInputs),save});
    const adapter=new LearnWorkbenchRun(run,c.program);adapter.#prefix=c.prefix;await adapter.#refresh();return adapter;
  }
  async #refresh() {
    const row=plan.runs.find(r=>`${r.law}/${r.numeric}/${r.name}`===this.#program)!,s=this.#run.snapshot(),save=this.#run.save();
    this.#view={program:this.#program,seamVersion:LEARN_VERSION,projection:'Researcher diagnostics only',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),
      modelHash:await digest(fromHex(row.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),
      researchOutputs:exactText(decode(s.outputs)),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
  }
}
