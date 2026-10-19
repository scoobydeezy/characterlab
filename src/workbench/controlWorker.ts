import {ControlWorkbenchRun,type ControlCheckpoint} from './controlAdapter';
let run:ControlWorkbenchRun|undefined,busy=false;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:ControlCheckpoint}>)=>{
 const q=event.data;if(busy){self.postMessage({id:q.id,error:'CONTROL worker command already in flight'});return;}busy=true;
 try{
  let result:unknown;
  if(q.operation==='create'){if(run)throw Error('Already initialized');run=await ControlWorkbenchRun.create(q.program);result=run.snapshot();}
  else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await ControlWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
  else if(!run)throw Error('CONTROL worker not initialized');
  else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
  else if(q.operation==='checkpoint')result=run.checkpoint();
  else throw Error('Unknown CONTROL inspection command');
  self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}finally{busy=false;}
});
