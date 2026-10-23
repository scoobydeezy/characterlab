import type {DispositionPackedPairCheckpoint} from './dispositionPackedPairCheckpoint';
import type {DispositionPagedPair,DispositionBranch} from './dispositionPagedPair';
import type {DispositionPairCheckpoint} from './dispositionPairCheckpoint';
import type {DispositionTextSelector} from './dispositionPagedAdapter';
import type {DispositionDiagnosticSelection} from './dispositionCanonicalInspection';
type View=ReturnType<DispositionPagedPair['summary']>;
export class DispositionPagedPairWorkerClient{
 #worker=new Worker(new URL('./dispositionPagedPairWorker.ts',import.meta.url),{type:'module'});#next=0;#busy=false;#disposed=false;#view!:View;
 #pending=new Map<number,{resolve:(value:unknown)=>void;reject:(error:Error)=>void}>();
 private constructor(){this.#worker.onmessage=event=>{if(this.#disposed)return;const {id,error,result,summary}=event.data,q=this.#pending.get(id);if(!q)return;this.#pending.delete(id);if(summary)this.#view=summary;error?q.reject(new Error(error)):q.resolve(result);};this.#worker.onerror=event=>{event.preventDefault();this.dispose(new Error(event.message||'DISPOSITION pair worker failed'));};this.#worker.onmessageerror=()=>this.dispose(new Error('DISPOSITION pair message decoding failed'));}
 async #call<T>(operation:string,data:object={}):Promise<T>{if(this.#disposed)throw Error('DISPOSITION pair worker disposed');if(this.#busy)throw Error('DISPOSITION pair worker command already in flight');this.#busy=true;try{const id=++this.#next;return await new Promise<T>((resolve,reject)=>{this.#pending.set(id,{resolve:value=>resolve(value as T),reject});try{this.#worker.postMessage({id,operation,...data});}catch(e){this.#pending.delete(id);reject(e instanceof Error?e:new Error(String(e)));}});}finally{this.#busy=false;}}
 static async create(comparison:string){const client=new DispositionPagedPairWorkerClient();try{client.#view=await client.#call('create',{comparison});return client;}catch(e){client.dispose();throw e;}}
 static async restore(checkpoint:DispositionPairCheckpoint){const client=new DispositionPagedPairWorkerClient();try{client.#view=await client.#call('restore',{checkpoint});return client;}catch(e){client.dispose();throw e;}}
 static async restorePacked(packedCheckpoint:DispositionPackedPairCheckpoint){const client=new DispositionPagedPairWorkerClient();try{client.#view=await client.#call('restorePacked',{packedCheckpoint});return client;}catch(e){client.dispose();throw e;}}
 packedCheckpoint(){return this.#call<DispositionPackedPairCheckpoint>('packedCheckpoint');}
 summary(){return structuredClone(this.#view);}
 async advance(branch:DispositionBranch|'both'='both'){const result=await this.#call<{moved:boolean;summary:View}>('advance',{branch});this.#view=result.summary;return result.moved;}
 diagnostic(branch:DispositionBranch,saveHash:string,selection:DispositionDiagnosticSelection){return this.#call<ReturnType<DispositionPagedPair['diagnostic']>>('diagnostic',{branch,saveHash,selection});}
 textPage(branch:DispositionBranch,saveHash:string,selector:DispositionTextSelector,offset=0,limit=4096){return this.#call<ReturnType<DispositionPagedPair['textPage']>>('textPage',{branch,saveHash,selector,offset,limit});}
 checkpoint(){return this.#call<DispositionPairCheckpoint>('checkpoint');}
 dispose(error=new Error('DISPOSITION pair worker disposed')){if(this.#disposed)return;this.#disposed=true;this.#worker.terminate();for(const q of this.#pending.values())q.reject(error);this.#pending.clear();}
}
