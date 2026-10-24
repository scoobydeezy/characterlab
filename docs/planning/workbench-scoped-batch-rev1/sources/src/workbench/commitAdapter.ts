import plan from '../../docs/planning/COMMIT_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import {bytesToHex,canonicalEncode,set} from '../substrate/canonicalEncoding';
import {restoreAuthoritativeState,statePathValue} from '../substrate/state';
import {dataItems as items,dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {decodeCommit as decode} from '../campaign3/commitCodecs';
import {commitRecipe,VERSION} from '../campaign3/commitModel';
import {prepareCommitModel,createCommitRun,restoreCommitRun} from '../campaign3/commitFactory';
import {digest,exactText,exactKey,fromHex,equalBytes} from './canonical';
import {nativeTimeline} from './nativeTimeline';
export const COMMIT_PROGRAMS=plan.runs.map(r=>({id:`${r.law}/${r.name}`,law:r.law,name:r.name,seed:7}));
const original=(id:string)=>{const row=plan.runs.find(r=>`${r.law}/${r.name}`===id);if(!row)throw Error('Unknown frozen COMMIT program');return row;};
const initialState=()=>canonicalEncode(set([]));
type Run=Awaited<ReturnType<typeof createCommitRun>>;
export interface CommitCheckpoint {version:'commit-workbench/0.1';program:string;prefix:number;saveHex:string;saveHash:string;}
export type CommitSnapshot=ReturnType<CommitWorkbenchRun['snapshot']>;
export class CommitWorkbenchRun {
 #run:Run;#program:string;#prefix=0;#busy=false;
 #view!: {program:string;seamVersion:string;projection:string;prefix:number;complete:boolean;clock:string;modelHash:string;runHash:string;stateHash:string;saveHash:string;outputsHash:string;observerViews:{observer:number;hash:string;exact:string}[];researchOutputs:string;fields:{path:string;root:string;exact:string}[];timeline:ReturnType<typeof nativeTimeline>};
 private constructor(run:Run,program:string){this.#run=run;this.#program=program;}
 static async create(program='1/main'){
  const row=original(program),run=await createCommitRun(await prepareCommitModel(commitRecipe(row.law)),{initialState:initialState(),orderedInputs:fromHex(row.orderedInputs),runSeed:new Uint8Array(32).fill(7)});
  if(bytesToHex(run.runIdentity())!==row.runIdentity)throw Error('Frozen COMMIT identity mismatch');const a=new CommitWorkbenchRun(run,program);await a.#refresh();return a;
 }
 snapshot(){if(this.#busy)throw Error('COMMIT run is advancing');return structuredClone(this.#view);}
 checkpoint():CommitCheckpoint{if(this.#busy)throw Error('COMMIT run is advancing');return {version:'commit-workbench/0.1',program:this.#program,prefix:this.#prefix,saveHex:bytesToHex(this.#run.save()),saveHash:this.#view.saveHash};}
 async advance(){if(this.#busy)throw Error('COMMIT command already in flight');if(this.#prefix>=8&&!this.#view.complete)throw Error('COMMIT inspection horizon exceeded');this.#busy=true;try{const moved=await this.#run.settleNextInstant();if(moved)this.#prefix++;await this.#refresh();return moved;}finally{this.#busy=false;}}
 static async restore(input:CommitCheckpoint){
  const c=structuredClone(input);if(!c||c.version!=='commit-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>8||typeof c.saveHex!=='string'||c.saveHex.length>32_000_000)throw Error('Invalid bounded COMMIT checkpoint');
  const expected=await CommitWorkbenchRun.create(c.program),save=fromHex(c.saveHex);if(await digest(save)!==c.saveHash)throw Error('COMMIT checkpoint digest mismatch');for(let i=0;i<c.prefix;i++)if(!await expected.advance())throw Error('COMMIT checkpoint exceeds original horizon');if(!equalBytes(expected.#run.save(),save))throw Error('COMMIT checkpoint program/prefix mismatch');
  const row=original(c.program),run=await restoreCommitRun(commitRecipe(row.law),{initialState:initialState(),orderedInputs:fromHex(row.orderedInputs),save}),a=new CommitWorkbenchRun(run,c.program);a.#prefix=c.prefix;await a.#refresh();return a;
 }
 async #refresh(){
  const row=original(this.#program),s=this.#run.snapshot(),save=this.#run.save(),observerViews=[0,1].map(observer=>({observer,bytes:this.#run.observerView(observer)}));
  this.#view={program:this.#program,seamVersion:VERSION,projection:'Separate native observer projections; actor identity, lifecycle, full outputs, state and trace are researcher diagnostics.',prefix:this.#prefix,complete:items(f(rec(decode(save),132n),7n),'list').length===0,clock:String(s.clock),modelHash:await digest(fromHex(row.modelIdentity)),runHash:await digest(this.#run.runIdentity()),stateHash:await digest(s.state),saveHash:await digest(save),outputsHash:await digest(s.outputs),observerViews:await Promise.all(observerViews.map(async o=>({observer:o.observer,hash:await digest(o.bytes),exact:exactText(decode(o.bytes))}))),researchOutputs:exactText(decode(s.outputs)),fields:restoreAuthoritativeState(decode(s.state)).entries().map(e=>({path:exactKey(statePathValue(e.path)),root:String(e.path.rootStateTypeId),exact:exactText(e.value)})),timeline:nativeTimeline(items(decode(s.trace),'list'))};
 }
}
