import {LongWorkbenchRun,type LongCheckpoint} from './longAdapter';
let run:LongWorkbenchRun|undefined,busy=false;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:LongCheckpoint}>)=>{
 const q=event.data;if(busy){self.postMessage({id:q.id,error:'LONG worker command already in flight'});return;}busy=true;
 try{
  let result:unknown;
  if(q.operation==='create'){if(run)throw Error('Already initialized');run=await LongWorkbenchRun.create(q.program);result=run.snapshot();}
  else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await LongWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
  else if(!run)throw Error('LONG worker not initialized');
  else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
  else if(q.operation==='checkpoint')result=run.checkpoint();
  else throw Error('Unknown LONG inspection command');
  self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}finally{busy=false;}
});
