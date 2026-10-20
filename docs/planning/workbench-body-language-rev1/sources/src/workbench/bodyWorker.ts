import {BodyWorkbenchRun,type BodyCheckpoint} from './bodyAdapter';
import {inspectBodyOwnership} from './bodyOwnership';
let run:BodyWorkbenchRun|undefined,busy=false;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:BodyCheckpoint}>)=>{
 const q=event.data;if(busy){self.postMessage({id:q.id,error:'BODY worker command already in flight'});return;}busy=true;
 try{
  let result:unknown;
  if(q.operation==='create'){if(run)throw Error('Already initialized');run=await BodyWorkbenchRun.create(q.program);result=run.snapshot();}
  else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await BodyWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
  else if(!run)throw Error('BODY worker not initialized');
  else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
  else if(q.operation==='checkpoint')result=run.checkpoint();
  else if(q.operation==='ownership')result=await inspectBodyOwnership(run.snapshot().program);
  else throw Error('Unknown BODY inspection command');
  self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}finally{busy=false;}
});
