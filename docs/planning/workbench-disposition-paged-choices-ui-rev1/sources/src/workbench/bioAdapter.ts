import plan from '../../docs/planning/BIO_COMPARISON_PLAN_REV3.json';
import identities from '../../docs/planning/BIO_IDENTITY_PLAN_REV1.json';
import {BIO_VERSION, BIO_LAWS, createBioComparison, restoreBioComparison, bioSummary, type BioLaw} from '../campaign3/bioComparison';
import {ACTOR, TASKS, OPTIONS} from '../campaign3/longitudinalModel';
import {receivingRecord, decodeReceiving} from '../campaign3/receivingCodecs';
import {list, text, unsigned as u, rational as q, canonicalEncode} from '../substrate/canonicalEncoding';
import {commitManifest, createModelIdentity, createRunIdentity} from '../substrate/identity';
import {dataItems as items, dataUnsigned as uint} from '../campaign2/canonicalData';
import {digest, exactText, exactKey, fromHex} from './canonical';

export const BIO_CASES = identities.runs.map(r => r.name);
export interface BioCheckpoint {version:'bio-workbench/0.1';name:string;prefix:number;modelHash:string;runHash:string;saveHash:string;saveHex:string;}
export interface BioSnapshot {
  version:'bio-inspection/0.1';boundary:'composed-component';seamVersion:string;
  name:string;law:BioLaw;prefix:number;complete:boolean;modelHash:string;runHash:string;stateHash:string;saveHash:string;
  history:string;archive:string;records:{ordinal:number;canonicalHex:string;exact:string;summary:ReturnType<typeof bioSummary>}[];
  seedRouting:{early:number;probe:number;nondecision:number;contrary:number[]};scope:string;
}
async function boundIdentity(name:string) {
  const spec=identities.runs.find(r=>r.name===name),original=plan.cases.find(r=>r.name===name);
  if(!spec||!original||spec.law!==original.law||spec.earlySeed!==original.earlySeed||!BIO_LAWS.includes(spec.law as BioLaw))throw Error('Unknown frozen BIO case');
  const content=list([ACTOR,list(TASKS),list(OPTIONS)]);
  const parameters=list([text(spec.law),q(1,1),q(1,1),q(1,16),u(3),list([q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(1,2),q(1,2),q(1,2)]);
  const registry=list([list(['context40','raw51','reason52','decision60','expression80','qualification130','identity140'].map(text)),list(plan.artifacts.map(a=>list([text(a.path),text(a.sha256)])))]);
  const initial=list([receivingRecord(414,[list([])]),list([])]);
  const ordered=list([list(Array.from({length:19},(_,i)=>{const at=i+1;return list([u(at),at<=4||at>=6&&at<=17,at===19,at<=4?list([]):list([u(at>=6&&at<=17?plan.contrarySeeds[at-6]:255)])]);})),u(254)]);
  const image=identities.models.find(m=>m.law===spec.law)!;
  if(exactKey(content)!==image.content||exactKey(parameters)!==image.parameters||exactKey(registry)!==image.registry||exactKey(initial)!==identities.initialState||exactKey(ordered)!==identities.orderedInputs)throw Error('BIO identity manifest drift');
  const model=await createModelIdentity({rulesVersion:BIO_VERSION,contentSchemaVersion:'bio-component-content/0.1',contentManifest:await commitManifest(content),parameterSchemaVersion:'bio-component-parameters/0.1',parameterSet:await commitManifest(parameters),numericProfileVersion:'bio-exact-identity-lattice/0.1',randomAlgorithmVersion:'rng/bio-address-routed-sha256/0.1-candidate',registrySchemaVersion:'bio-component-registry/0.1',registryManifest:await commitManifest(registry)});
  const run=await createRunIdentity({modelIdentity:model,initialState:await commitManifest(initial),orderedInputSequence:await commitManifest(ordered),runSeed:new Uint8Array(32).fill(spec.earlySeed)});
  if(exactKey(model.value)!==image.modelIdentity||exactKey(run.value)!==spec.runIdentity)throw Error('BIO canonical identity mismatch');
  return {name,law:spec.law as BioLaw,input:{earlySeed:spec.earlySeed,contrarySeeds:[...plan.contrarySeeds]},modelHash:await digest(model.canonicalBytes),runHash:await digest(run.canonicalBytes)};
}
type Bound=Awaited<ReturnType<typeof boundIdentity>>;
export class BioWorkbenchRun {
  #run:ReturnType<typeof createBioComparison>;#bound:Bound;#busy=false;#snapshot!:BioSnapshot;
  private constructor(run:ReturnType<typeof createBioComparison>,bound:Bound){this.#run=run;this.#bound=bound;}
  static async create(name=BIO_CASES[0]){const bound=await boundIdentity(name),run=new BioWorkbenchRun(createBioComparison(bound.law,bound.input),bound);await run.#refresh();return run;}
  snapshot(){if(this.#busy)throw Error('BIO component advancing');return structuredClone(this.#snapshot);}
  checkpoint():BioCheckpoint{if(this.#busy)throw Error('BIO component advancing');return {version:'bio-workbench/0.1',name:this.#bound.name,prefix:this.#snapshot.prefix,modelHash:this.#bound.modelHash,runHash:this.#bound.runHash,saveHash:this.#snapshot.saveHash,saveHex:exactKey(decodeReceiving(this.#run.save()))};}
  static async restore(input:BioCheckpoint){
    const c=structuredClone(input);
    if(!c||c.version!=='bio-workbench/0.1'||!Number.isInteger(c.prefix)||c.prefix<0||c.prefix>19||typeof c.saveHex!=='string'||c.saveHex.length>16_000_000||!/^([0-9a-f]{2})+$/.test(c.saveHex))throw Error('Invalid bounded BIO checkpoint');
    const bound=await boundIdentity(c.name),save=fromHex(c.saveHex);
    if(c.modelHash!==bound.modelHash||c.runHash!==bound.runHash||await digest(save)!==c.saveHash)throw Error('BIO checkpoint identity/digest mismatch');
    const native=await restoreBioComparison(bound.law,bound.input,save),run=new BioWorkbenchRun(native,bound);await run.#refresh();
    if(run.#snapshot.prefix!==c.prefix)throw Error('BIO checkpoint prefix mismatch');return run;
  }
  async advance(){if(this.#busy)throw Error('BIO command already in flight');this.#busy=true;try{const moved=await this.#run.step();await this.#refresh();return moved;}finally{this.#busy=false;}}
  async #refresh(){
    const state=this.#run.snapshot(),parts=items(state,'list'),prefix=Number(uint(parts[0])),rows=items(parts[3],'list');
    this.#snapshot={version:'bio-inspection/0.1',boundary:'composed-component',seamVersion:BIO_VERSION,name:this.#bound.name,law:this.#bound.law,prefix,complete:prefix===19,modelHash:this.#bound.modelHash,runHash:this.#bound.runHash,stateHash:await digest(canonicalEncode(state)),saveHash:await digest(this.#run.save()),history:exactText(parts[1]),archive:exactText(parts[2]),records:rows.map((row,index)=>({ordinal:index+1,canonicalHex:exactKey(row),exact:exactText(row),summary:bioSummary(row)})),seedRouting:{early:this.#bound.input.earlySeed,probe:255,nondecision:254,contrary:[...this.#bound.input.contrarySeeds]},scope:'Qualified BIO composed components, original19-step calendar and routed research seeds. Records are component commitments, not public scheduler events or general character-language explanations. DisplayOnly/HistoryOnly and exact Refold equalities remain distinct; no production authority or psychological law is selected.'};
  }
}
