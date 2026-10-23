import {capturePackedDispositionPair,restorePackedDispositionPair,type DispositionPackedPairCheckpoint} from './dispositionPackedPairCheckpoint';
import {DispositionPagedRun,type DispositionTextSelector} from './dispositionPagedAdapter';
import {DISPOSITION_CONTRASTS} from './dispositionComparison';
import {captureDispositionPair,restoreDispositionPair,type DispositionPairCheckpoint} from './dispositionPairCheckpoint';
import type {DispositionDiagnosticSelection} from './dispositionCanonicalInspection';
import {dispositionChoiceComparisonFromRows} from './dispositionChoiceComparison';
export type DispositionBranch='a'|'b';
type PairView={choices:ReturnType<typeof dispositionChoiceComparisonFromRows>;history:{a:ReturnType<DispositionPagedRun['storedHistory']>;b:ReturnType<DispositionPagedRun['storedHistory']>};comparison:Awaited<ReturnType<DispositionPagedRun['compare']>>;a:ReturnType<DispositionPagedRun['summary']>;b:ReturnType<DispositionPagedRun['summary']>};
/** Two original native runs; publishes only after the requested advancement and comparison finish. */
export class DispositionPagedPair{
 #id:string;#a:DispositionPagedRun;#b:DispositionPagedRun;#busy=false;#failure:string|null=null;#view!:PairView;
 private constructor(id:string,a:DispositionPagedRun,b:DispositionPagedRun){this.#id=id;this.#a=a;this.#b=b;}
 static async create(id:string){const spec=DISPOSITION_CONTRASTS.find(c=>c.id===id);if(!spec)throw Error('Unknown DISPOSITION comparison');const pair=new DispositionPagedPair(id,await DispositionPagedRun.create(spec.a),await DispositionPagedRun.create(spec.b));await pair.#refresh();return pair;}
 static async restore(input:DispositionPairCheckpoint){const checkpoint=structuredClone(input),[a,b]=await restoreDispositionPair(checkpoint,c=>DispositionPagedRun.restore(c),()=>{}),pair=new DispositionPagedPair(checkpoint.comparison,a,b);await pair.#refresh();return pair;}
 static async restorePacked(input:DispositionPackedPairCheckpoint){const comparison=input.comparison,[a,b]=await restorePackedDispositionPair(input,c=>DispositionPagedRun.restore(c),()=>{}),pair=new DispositionPagedPair(comparison,a,b);await pair.#refresh();return pair;}
 async packedCheckpoint(){this.#ready();this.#busy=true;try{return await capturePackedDispositionPair(this.#id,[this.#a,this.#b]);}finally{this.#busy=false;}}
 #ready(){if(this.#busy)throw Error('DISPOSITION pair command in flight');if(this.#failure)throw Error('DISPOSITION pair failed; restore or create a new pair');}
 #branch(branch:DispositionBranch){if(branch!=='a'&&branch!=='b')throw Error('Unknown DISPOSITION comparison branch');return branch==='a'?this.#a:this.#b;}
 summary(){if(this.#busy)throw Error('DISPOSITION pair command in flight');return structuredClone({...this.#view,failure:this.#failure});}
 async #refresh(){const a=this.#a.summary(),b=this.#b.summary(),comparison=await this.#a.compare(this.#id,this.#b,a.saveHash,b.saveHash);const history={a:this.#a.storedHistory(a.saveHash),b:this.#b.storedHistory(b.saveHash)},choices=dispositionChoiceComparisonFromRows(this.#id,a,b,this.#a.choiceRows(a.saveHash),this.#b.choiceRows(b.saveHash));this.#view={comparison,a,b,history,choices};}
 async advance(branch:DispositionBranch|'both'='both'){
  this.#ready();if(!['a','b','both'].includes(branch))throw Error('Unknown DISPOSITION advance branch');
  if(branch==='both'&&!this.#view.comparison.aligned)throw Error('Align DISPOSITION prefixes before advancing both');
  this.#busy=true;
  try{const a=branch!=='b'?await this.#a.advance():false,b=branch!=='a'?await this.#b.advance():false;await this.#refresh();return a||b;}
  catch(error){this.#failure=String(error);throw error;}finally{this.#busy=false;}
 }
 diagnostic(branch:DispositionBranch,saveHash:string,selection:DispositionDiagnosticSelection){this.#ready();return this.#branch(branch).diagnostic(saveHash,selection);}
 textPage(branch:DispositionBranch,saveHash:string,selector:DispositionTextSelector,offset=0,limit=4096){this.#ready();return this.#branch(branch).textPage(saveHash,selector,offset,limit);}
 async checkpoint(){this.#ready();this.#busy=true;try{return await captureDispositionPair(this.#id,[this.#a,this.#b]);}finally{this.#busy=false;}}
}
