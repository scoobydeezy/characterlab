import {LongLossWorkbenchRun,type LongLossCheckpoint} from './longLossAdapter';
let run:LongLossWorkbenchRun|undefined,busy=false;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;index?:number;checkpoint?:LongLossCheckpoint}>)=>{
 const q=event.data;if(busy){self.postMessage({id:q.id,error:'LONG loss worker command already in flight'});return;}busy=true;
 try{
  let result:unknown;
  if(q.operation==='create'){if(run)throw Error('Already initialized');run=await LongLossWorkbenchRun.create(q.index);result=run.snapshot();}
  else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await LongLossWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
  else if(!run)throw Error('LONG loss worker not initialized');
  else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
  else if(q.operation==='checkpoint')result=run.checkpoint();
  else throw Error('Unknown LONG loss inspection command');
  self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}finally{busy=false;}
});
