import plan from '../../docs/planning/EPI_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import {canonicalDecode,canonicalEncode,set,RecordSchemaRegistry,bytesToHex} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {epiSupportedSchemas} from '../campaign3/epiCodecs';
import {epiRecipe,EPI_VERSION} from '../campaign3/epiModel';
import {prepareEpiModel,createEpiRun,restoreEpiRun} from '../campaign3/epiFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
import {explainEpi,type EpiExplanation} from './epiExplanations';
export const EPI_PROGRAMS = plan.runs.map(row=>({id:`${row.law}/${row.numeric}/${row.name}`,name:row.name,law:row.law,numeric:row.numeric}));
const registry=new RecordSchemaRegistry(epiSupportedSchemas());
const decode=(bytes:Uint8Array)=>canonicalDecode(bytes,registry);
const initialState=canonicalEncode(set([]));
const seed=()=>new Uint8Array(32).fill(19);
type Run=Awaited<ReturnType<typeof createEpiRun>>;
export interface EpiCheckpoint {version:'epi-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type EpiSnapshot=ReturnType<EpiWorkbenchRun['snapshot']>;
export class EpiWorkbenchRun {
  #run:Run; #program:string; #prefix=0; #busy=false;
  #view!: {program:string;seamVersion:string;projection:string;lawfulCharacterAccess:boolean;prefix:number;complete:boolean;clock:string;
    modelHash:string;runHash:string;stateHash:string;saveHash:string;characterStateHash:string;characterOutputsHash:string;
    characterOutputs:string;researchOutputs:string;explanations:EpiExplanation[];fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
  private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
  static async create(program='1/1/establishedA') {
    const row=plan.runs.find(r=>`${r.law}/${r.numeric}/${r.name}`===program);if(!row)throw Error('Unknown frozen EPI program');
    const run=await createEpiRun(await prepareEpiModel(epiRecipe(row.law,row.numeric)),{initialState,orderedInputs:fromHex(row.orderedInputs),runSeed:seed()});
    if(bytesToHex(run.runIdentity())!==row.runIdentity)throw Error('Frozen EPI run identity mismatch');
    const adapter=new EpiWorkbenchRun(run,program);await adapter.#refresh();return adapter;
  }
  snapshot(){if(this.#busy)throw Error('EPI run is advancing');return structuredClone(this.#view);}
  checkpoint():EpiCheckpoint {if(this.#busy)throw Error('EPI run is advancing');return {version:'epi-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash};}
  async advance(){if(this.#busy)throw Error('EPI command already in flight');if(this.#prefix>=64&&!this.#view.complete)throw Error('EPI inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
  static async restore(input:EpiCheckpoint) {
    const c=structuredClone(input);if(!c||c.version!=='epi-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>64||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded EPI checkpoint');
    const expected=await EpiWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('EPI checkpoint digest mismatch');
    for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('EPI checkpoint exceeds original horizon');
    if(!equalBytes(expected.#run.save(),save))throw Error('EPI checkpoint program/prefix mismatch');
    const row=plan.runs.find(r=>`${r.law}/${r.numeric}/${r.name}`===c.program)!;
    const run=await restoreEpiRun(epiRecipe(row.law,row.numeric),{initialState,orderedInputs:fromHex(row.orderedInputs),save});
    const adapter=new EpiWorkbenchRun(run,c.program);adapter.#prefix=c.prefix;await adapter.#refresh();return adapter;
  }
  async #refresh() {
    const row=plan.runs.find(r=>`${r.law}/${r.numeric}/${r.name}`===this.#program)!,s=this.#run.snapshot(),save=this.#run.save(),character=this.#run.characterView();
    this.#view={program:this.#program,seamVersion:EPI_VERSION,projection:['','Safe applied measurement','VIOLATING potential-leak control','VIOLATING overflow-leak control'][row.law],lawfulCharacterAccess:row.law===1,prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),
      modelHash:await digest(fromHex(row.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),characterStateHash:await digest(character.state),characterOutputsHash:await digest(character.outputs),
      explanations:explainEpi(items(decode(character.outputs),'list'),row.law===1),characterOutputs:exactText(decode(character.outputs)),researchOutputs:exactText(decode(s.outputs)),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
  }
}
