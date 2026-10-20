import type {FatigueSnapshot,FatigueCheckpoint} from './fatigueAdapter';
export class FatigueWorkerClient{
 #worker=new Worker(new URL('./fatigueWorker.ts',import.meta.url),{type:'module'});#next=0;#busy=false;#disposed=false;#snapshot!:FatigueSnapshot;
 #pending=new Map<number,{resolve:(value:unknown)=>void;reject:(error:Error)=>void}>();
 private constructor(){this.#worker.onmessage=event=>{if(this.#disposed)return;const {id,error,result}=event.data,q=this.#pending.get(id);if(!q)return;this.#pending.delete(id);error?q.reject(new Error(error)):q.resolve(result);};this.#worker.onerror=event=>{event.preventDefault();this.dispose(new Error(event.message||'FATIGUE worker failed'));};this.#worker.onmessageerror=()=>this.dispose(new Error('FATIGUE worker message decoding failed'));}
 async #call<T>(operation:string,data:object={}):Promise<T>{if(this.#disposed)throw Error('FATIGUE worker disposed');if(this.#busy)throw Error('FATIGUE worker command already in flight');this.#busy=true;try{const id=++this.#next;return await new Promise<T>((resolve,reject)=>{this.#pending.set(id,{resolve:value=>resolve(value as T),reject});try{this.#worker.postMessage({id,operation,...data});}catch(e){this.#pending.delete(id);reject(e instanceof Error?e:new Error(String(e)));}});}finally{this.#busy=false;}}
 static async create(program='1/1/main'){const client=new FatigueWorkerClient();try{client.#snapshot=await client.#call('create',{program});return client;}catch(e){client.dispose();throw e;}}
 static async restore(checkpoint:FatigueCheckpoint){const client=new FatigueWorkerClient();try{client.#snapshot=await client.#call('restore',{checkpoint});return client;}catch(e){client.dispose();throw e;}}
 snapshot(){return structuredClone(this.#snapshot);}
 checkpoint(){return this.#call<FatigueCheckpoint>('checkpoint');}
 async advance(){const result=await this.#call<{moved:boolean;snapshot:FatigueSnapshot}>('advance');this.#snapshot=result.snapshot;return result.moved;}
 dispose(error=new Error('FATIGUE worker disposed')){if(this.#disposed)return;this.#disposed=true;this.#worker.terminate();for(const q of this.#pending.values())q.reject(error);this.#pending.clear();}
}
