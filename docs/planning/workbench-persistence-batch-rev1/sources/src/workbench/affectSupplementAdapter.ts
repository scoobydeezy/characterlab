import plan from './affectSupplementFixtures.json';
import fixtures from './affectFixtures.json';
import {canonicalDecode,RecordSchemaRegistry,bytesToHex} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {affectSupportedSchemas} from '../campaign3/affectCodecs';
import {affectRecipe,AFFECT_VERSION} from '../campaign3/affectModel';
import {prepareAffectModel,createAffectRun,restoreAffectRun} from '../campaign3/affectFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
import {explainAffect,type AffectExplanation} from './affectExplanations';

export const AFFECT_SUPPLEMENT_PROGRAMS=plan.runs.map(r=>({id:r.id,model:r.model,seed:r.seed}));
const registry=new RecordSchemaRegistry(affectSupportedSchemas());
const decode=(bytes:Uint8Array)=>canonicalDecode(bytes,registry);
function original(program:string){
  const row=plan.runs.find(r=>r.id===program);if(!row)throw Error('Unknown frozen AFFECT supplementary program');
  const model=fixtures.models.find(m=>m.name===row.model)!;
  return {row,model,source:affectRecipe(model.settings),initialState:fromHex(model.initialState),orderedInputs:fromHex(row.orderedInputs)};
}
type Run=Awaited<ReturnType<typeof createAffectRun>>;
export interface AffectSupplementCheckpoint {version:'affect-supplement-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type AffectSupplementSnapshot=ReturnType<AffectSupplementRun['snapshot']>;
export class AffectSupplementRun {
  #run:Run;#program:string;#prefix=0;#busy=false;
  #view!: {program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;
    modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;
    admittedOutputs:string;explanations:AffectExplanation[];fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
  private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
  static async create(program='timing/feedback/a'){
    const o=original(program),run=await createAffectRun(await prepareAffectModel(o.source),{initialState:o.initialState,orderedInputs:o.orderedInputs,runSeed:new Uint8Array(32).fill(o.row.seed)});
    if(bytesToHex(run.runIdentity())!==plan.runs.find(r=>r.id===program)!.runIdentity)throw Error('Frozen AFFECT run identity mismatch');
    const adapter=new AffectSupplementRun(run,program);await adapter.#refresh();return adapter;
  }
  snapshot(){if(this.#busy)throw Error('AFFECT run is advancing');return structuredClone(this.#view);}
  checkpoint():AffectSupplementCheckpoint {if(this.#busy)throw Error('AFFECT run is advancing');return {version:'affect-supplement-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash};}
  async advance(){if(this.#busy)throw Error('AFFECT command already in flight');if(this.#prefix>=17&&!this.#view.complete)throw Error('AFFECT inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
  static async restore(input:AffectSupplementCheckpoint){
    const c=structuredClone(input);if(!c||c.version!=='affect-supplement-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>17||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded AFFECT checkpoint');
    const expected=await AffectSupplementRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('AFFECT checkpoint digest mismatch');
    for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('AFFECT checkpoint exceeds original horizon');
    if(!equalBytes(expected.#run.save(),save))throw Error('AFFECT checkpoint program/prefix mismatch');
    const o=original(c.program),run=await restoreAffectRun(o.source,{initialState:o.initialState,orderedInputs:o.orderedInputs,save});
    const adapter=new AffectSupplementRun(run,c.program);adapter.#prefix=c.prefix;await adapter.#refresh();return adapter;
  }
  async #refresh(){
    const o=original(this.#program),s=this.#run.snapshot(),save=this.#run.save();
    this.#view={program:this.#program,seamVersion:AFFECT_VERSION,projection:'Native admitted outputs; state and timeline are researcher diagnostics',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),
      modelHash:await digest(fromHex(o.model.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),
      admittedOutputs:exactText(decode(s.outputs)),explanations:explainAffect(items(decode(s.outputs),'list'),o.model.settings),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
  }
}
