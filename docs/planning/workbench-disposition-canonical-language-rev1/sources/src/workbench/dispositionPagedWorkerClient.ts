import type {DispositionCheckpoint} from './dispositionAdapter';
import type {DispositionInspectionSummary,DispositionTextSelector,DispositionPagedRun} from './dispositionPagedAdapter';
import type {DispositionDiagnosticSelection} from './dispositionCanonicalInspection';
export class DispositionPagedWorkerClient{
 #worker=new Worker(new URL('./dispositionPagedWorker.ts',import.meta.url),{type:'module'});#next=0;#busy=false;#disposed=false;#summary!:DispositionInspectionSummary;
 #pending=new Map<number,{resolve:(value:unknown)=>void;reject:(error:Error)=>void}>();
 private constructor(){this.#worker.onmessage=event=>{if(this.#disposed)return;const {id,error,result}=event.data,q=this.#pending.get(id);if(!q)return;this.#pending.delete(id);error?q.reject(new Error(error)):q.resolve(result);};this.#worker.onerror=event=>{event.preventDefault();this.dispose(new Error(event.message||'DISPOSITION worker failed'));};this.#worker.onmessageerror=()=>this.dispose(new Error('DISPOSITION worker message decoding failed'));}
 async #call<T>(operation:string,data:object={}):Promise<T>{if(this.#disposed)throw Error('DISPOSITION worker disposed');if(this.#busy)throw Error('DISPOSITION worker command already in flight');this.#busy=true;try{const id=++this.#next;return await new Promise<T>((resolve,reject)=>{this.#pending.set(id,{resolve:value=>resolve(value as T),reject});try{this.#worker.postMessage({id,operation,...data});}catch(e){this.#pending.delete(id);reject(e instanceof Error?e:new Error(String(e)));}});}finally{this.#busy=false;}}
 static async create(program='Plastic/Main'){const client=new DispositionPagedWorkerClient();try{client.#summary=await client.#call('create',{program});return client;}catch(e){client.dispose();throw e;}}
 static async restore(checkpoint:DispositionCheckpoint){const client=new DispositionPagedWorkerClient();try{client.#summary=await client.#call('restore',{checkpoint});return client;}catch(e){client.dispose();throw e;}}
 summary(){return structuredClone(this.#summary);}
 textPage(saveHash:string,selector:DispositionTextSelector,offset=0,limit=65536){return this.#call<ReturnType<DispositionPagedRun['textPage']>>('textPage',{saveHash,selector,offset,limit});}
 diagnostic(saveHash:string,selection:DispositionDiagnosticSelection){return this.#call<ReturnType<DispositionPagedRun['diagnostic']>>('diagnostic',{saveHash,selection});}
 checkpoint(){return this.#call<DispositionCheckpoint>('checkpoint');}
 async advance(){const result=await this.#call<{moved:boolean;summary:DispositionInspectionSummary}>('advance');this.#summary=result.summary;return result.moved;}
 dispose(error=new Error('DISPOSITION worker disposed')){if(this.#disposed)return;this.#disposed=true;this.#worker.terminate();for(const q of this.#pending.values())q.reject(error);this.#pending.clear();}
}
