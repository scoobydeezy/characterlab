import {DispositionPagedRun,type DispositionTextSelector} from './dispositionPagedAdapter';
import type {DispositionCheckpoint} from './dispositionAdapter';
let run:DispositionPagedRun|undefined,busy=false;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:DispositionCheckpoint;saveHash?:string;selector?:DispositionTextSelector;offset?:number;limit?:number}>)=>{
 const q=event.data;if(busy){self.postMessage({id:q.id,error:'DISPOSITION inspection command already in flight'});return;}busy=true;
 try{
  let result:unknown;
  if(q.operation==='create'){if(run)throw Error('Already initialized');run=await DispositionPagedRun.create(q.program);result=run.summary();}
  else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await DispositionPagedRun.restore(q.checkpoint!);result=run.summary();}
  else if(!run)throw Error('DISPOSITION inspection not initialized');
  else if(q.operation==='advance'){const moved=await run.advance();result={moved,summary:run.summary()};}
  else if(q.operation==='checkpoint')result=run.checkpoint();
  else if(q.operation==='textPage'){if(!q.selector||typeof q.saveHash!=='string')throw Error('Missing text selection');result=run.textPage(q.saveHash,q.selector,q.offset,q.limit);}
  else throw Error('Unknown DISPOSITION inspection command');
  self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}finally{busy=false;}
});
