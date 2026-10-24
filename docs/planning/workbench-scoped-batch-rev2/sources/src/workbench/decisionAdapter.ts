import plan from '../../docs/planning/DECISION_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import {bytesToHex,canonicalEncode,set} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {decodeDecision as decode} from '../campaign3/decisionCodecs';
import {decisionRecipe,VERSION} from '../campaign3/decisionModel';
import {prepareDecisionModel,createDecisionRun,restoreDecisionRun} from '../campaign3/decisionFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
export const DECISION_PROGRAMS=plan.runs.map(r=>({id:`${r.law}/${r.name}`,law:r.law,name:r.name,seed:r.seed}));
const original=(id:string)=>{const row=plan.runs.find(r=>`${r.law}/${r.name}`===id);if(!row)throw Error('Unknown frozen DECISION program');return row;};
const initialState=()=>canonicalEncode(set([]));
type Run=Awaited<ReturnType<typeof createDecisionRun>>;
export interface DecisionCheckpoint {version:'decision-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type DecisionSnapshot=ReturnType<DecisionWorkbenchRun['snapshot']>;
export class DecisionWorkbenchRun {
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!: {program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;characterHash:string;characterView:string;researchOutputs:string;fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='1/r1-s0-allowed'){
  const row=original(program),run=await createDecisionRun(await prepareDecisionModel(decisionRecipe(row.law)),{initialState:initialState(),orderedInputs:fromHex(row.orderedInputs),runSeed:new Uint8Array(32).fill(row.seed)});
  if(bytesToHex(run.runIdentity())!==row.runIdentity)throw Error('Frozen DECISION identity mismatch');const a=new DecisionWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('DECISION run is advancing');return structuredClone(this.#view);}
 checkpoint():DecisionCheckpoint{if(this.#busy)throw Error('DECISION run is advancing');return {version:'decision-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('DECISION command already in flight');if(this.#prefix>=8&&!this.#view.complete)throw Error('DECISION inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:DecisionCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='decision-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>8||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded DECISION checkpoint');
  const expected=await DecisionWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('DECISION checkpoint digest mismatch');for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('DECISION checkpoint exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('DECISION checkpoint program/prefix mismatch');
  const row=original(c.program),run=await restoreDecisionRun(decisionRecipe(row.law),{initialState:initialState(),orderedInputs:fromHex(row.orderedInputs),save}),a=new DecisionWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;
 }
 async #refresh(){
  const row=original(this.#program),s=this.#run.snapshot(),save=this.#run.save(),character=this.#run.characterView();
  this.#view={program:this.#program,seamVersion:VERSION,projection:'Native closed character projection; full outputs, state and trace are separate researcher diagnostics.',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),modelHash:await digest(fromHex(row.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),characterHash:await digest(character),characterView:exactText(decode(character)),researchOutputs:exactText(decode(s.outputs)),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
 }
}
