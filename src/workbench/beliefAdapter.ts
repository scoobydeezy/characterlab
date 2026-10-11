import plan from '../../docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json';
import retained from '../../docs/planning/BELIEF_PUBLIC_EXPERIMENT_REV1.json';
import {canonicalDecode,RecordSchemaRegistry,bytesToHex} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {beliefSupportedSchemas} from '../campaign3/beliefCodecs';
import {beliefRecipe,BELIEF_VERSION} from '../campaign3/beliefModel';
import {prepareBeliefModel,createBeliefRun,restoreBeliefRun} from '../campaign3/beliefFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
import {explainBelief,type BeliefExplanation} from './beliefExplanations';

export const BELIEF_PROGRAMS = plan.runs.map(row=>({id:row.name,law:row.law,goal:row.goal,caseName:row.caseName}));
const registry=new RecordSchemaRegistry(beliefSupportedSchemas());
const decode=(bytes:Uint8Array)=>canonicalDecode(bytes,registry);
const initialState=fromHex(plan.initialState);
const seed=()=>fromHex(plan.runSeed);
type Run=Awaited<ReturnType<typeof createBeliefRun>>;
export interface BeliefCheckpoint {version:'belief-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type BeliefSnapshot=ReturnType<BeliefWorkbenchRun['snapshot']>;
export class BeliefWorkbenchRun {
  #run:Run; #program:string; #prefix=0; #busy=false;
  #view!: {program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;
    modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;
    admittedOutputs:string;explanations:BeliefExplanation[];fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
  private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
  static async create(program='misleading-law-1') {
    const row=plan.runs.find(r=>r.name===program);if(!row)throw Error('Unknown frozen BELIEF program');
    const run=await createBeliefRun(await prepareBeliefModel(beliefRecipe(row.law,row.goal)),{initialState,orderedInputs:fromHex(row.orderedInputs),runSeed:seed()});
    if(bytesToHex(run.runIdentity())!==retained.results.find(r=>r.name===program)!.runIdentity)throw Error('Frozen BELIEF run identity mismatch');
    const adapter=new BeliefWorkbenchRun(run,program);await adapter.#refresh();return adapter;
  }
  snapshot(){if(this.#busy)throw Error('BELIEF run is advancing');return structuredClone(this.#view);}
  checkpoint():BeliefCheckpoint {if(this.#busy)throw Error('BELIEF run is advancing');return {version:'belief-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash};}
  async advance(){if(this.#busy)throw Error('BELIEF command already in flight');if(this.#prefix>=32&&!this.#view.complete)throw Error('BELIEF inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
  static async restore(input:BeliefCheckpoint) {
    const c=structuredClone(input);if(!c||c.version!=='belief-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>32||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded BELIEF checkpoint');
    const expected=await BeliefWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('BELIEF checkpoint digest mismatch');
    for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('BELIEF checkpoint exceeds original horizon');
    if(!equalBytes(expected.#run.save(),save))throw Error('BELIEF checkpoint program/prefix mismatch');
    const row=plan.runs.find(r=>r.name===c.program)!;
    const run=await restoreBeliefRun(beliefRecipe(row.law,row.goal),{initialState,orderedInputs:fromHex(row.orderedInputs),save});
    const adapter=new BeliefWorkbenchRun(run,c.program);adapter.#prefix=c.prefix;await adapter.#refresh();return adapter;
  }
  async #refresh() {
    const row=plan.runs.find(r=>r.name===this.#program)!,s=this.#run.snapshot(),save=this.#run.save();
    this.#view={program:this.#program,seamVersion:BELIEF_VERSION,projection:'Native admitted outputs; state and timeline are researcher diagnostics',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),
      modelHash:await digest(fromHex(retained.results.find(r=>r.name===this.#program)!.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),
      explanations:explainBelief(items(decode(s.outputs),'list'),row.law),admittedOutputs:exactText(decode(s.outputs)),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
  }
}
