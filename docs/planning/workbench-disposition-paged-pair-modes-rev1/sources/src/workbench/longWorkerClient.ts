import type {LongSnapshot,LongCheckpoint} from './longAdapter';
import catalog from './longCatalog.json';
export const LONG_PROGRAMS=catalog.programs.map(p=>({name:p.name,model:p.model}));
export class LongWorkerClient{
 #worker=new Worker(new URL('./longWorker.ts',import.meta.url),{type:'module'});#next=0;#busy=false;#disposed=false;#snapshot!:LongSnapshot;
 #pending=new Map<number,{resolve:(value:unknown)=>void;reject:(error:Error)=>void}>();
 private constructor(){this.#worker.onmessage=event=>{if(this.#disposed)return;const {id,error,result}=event.data,q=this.#pending.get(id);if(!q)return;this.#pending.delete(id);error?q.reject(new Error(error)):q.resolve(result);};this.#worker.onerror=event=>{event.preventDefault();this.dispose(new Error(event.message||'LONG worker failed'));};this.#worker.onmessageerror=()=>this.dispose(new Error('LONG worker message decoding failed'));}
 async #call<T>(operation:string,data:object={}):Promise<T>{if(this.#disposed)throw Error('LONG worker disposed');if(this.#busy)throw Error('LONG worker command already in flight');this.#busy=true;try{const id=++this.#next;return await new Promise<T>((resolve,reject)=>{this.#pending.set(id,{resolve:value=>resolve(value as T),reject});try{this.#worker.postMessage({id,operation,...data});}catch(e){this.#pending.delete(id);reject(e instanceof Error?e:new Error(String(e)));}});}finally{this.#busy=false;}}
 static async create(program=LONG_PROGRAMS[0].name){const client=new LongWorkerClient();try{client.#snapshot=await client.#call('create',{program});return client;}catch(e){client.dispose();throw e;}}
 static async restore(checkpoint:LongCheckpoint){const client=new LongWorkerClient();try{client.#snapshot=await client.#call('restore',{checkpoint});return client;}catch(e){client.dispose();throw e;}}
 snapshot(){return structuredClone(this.#snapshot);}
 checkpoint(){return this.#call<LongCheckpoint>('checkpoint');}
 async advance(){const result=await this.#call<{moved:boolean;snapshot:LongSnapshot}>('advance');this.#snapshot=result.snapshot;return result.moved;}
 dispose(error=new Error('LONG worker disposed')){if(this.#disposed)return;this.#disposed=true;this.#worker.terminate();for(const q of this.#pending.values())q.reject(error);this.#pending.clear();}
}
