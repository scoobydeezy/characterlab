import type {BioSnapshot,BioCheckpoint} from './bioAdapter';
import identities from '../../docs/planning/BIO_IDENTITY_PLAN_REV1.json';
export const BIO_CASES=identities.runs.map(r=>r.name);
export class BioWorkerClient {
 #worker=new Worker(new URL('./bioWorker.ts',import.meta.url),{type:'module'});
 #next=0;#busy=false;#disposed=false;#snapshot!:BioSnapshot;
 #pending=new Map<number,{resolve:(value:unknown)=>void;reject:(error:Error)=>void}>();
 private constructor(){
  this.#worker.onmessage=event=>{if(this.#disposed)return;const {id,error,result}=event.data,request=this.#pending.get(id);if(!request)return;this.#pending.delete(id);error?request.reject(new Error(error)):request.resolve(result);};
  this.#worker.onerror=event=>{event.preventDefault();this.dispose(new Error(event.message||'BIO worker failed'));};
  this.#worker.onmessageerror=()=>this.dispose(new Error('BIO worker message decoding failed'));
 }
 async #call<T>(operation:string,data:object={}):Promise<T>{
  if(this.#disposed)throw Error('BIO worker disposed');if(this.#busy)throw Error('BIO worker command already in flight');this.#busy=true;
  try{const id=++this.#next;return await new Promise<T>((resolve,reject)=>{this.#pending.set(id,{resolve:value=>resolve(value as T),reject});this.#worker.postMessage({id,operation,...data});});}finally{this.#busy=false;}
 }
 static async create(name=BIO_CASES[0]){const client=new BioWorkerClient();try{client.#snapshot=await client.#call('create',{name});return client;}catch(e){client.dispose();throw e;}}
 static async restore(checkpoint:BioCheckpoint){const client=new BioWorkerClient();try{client.#snapshot=await client.#call('restore',{checkpoint});return client;}catch(e){client.dispose();throw e;}}
 snapshot(){return structuredClone(this.#snapshot);}
 checkpoint(){return this.#call<BioCheckpoint>('checkpoint');}
 async advance(){const result=await this.#call<{moved:boolean;snapshot:BioSnapshot}>('advance');this.#snapshot=result.snapshot;return result.moved;}
 dispose(error=new Error('BIO worker disposed')){if(this.#disposed)return;this.#disposed=true;this.#worker.terminate();for(const request of this.#pending.values())request.reject(error);this.#pending.clear();}
}
