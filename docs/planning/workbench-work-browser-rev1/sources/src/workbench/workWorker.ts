import {WorkWorkbenchRun,type WorkCheckpoint} from './workAdapter';
let run:WorkWorkbenchRun|undefined;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:WorkCheckpoint}>)=>{
 const q=event.data;try{let result:unknown;
 if(q.operation==='create'){if(run)throw Error('Already initialized');run=await WorkWorkbenchRun.create(q.program);result=run.snapshot();}
 else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await WorkWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
 else if(!run)throw Error('WORK worker not initialized');
 else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
 else if(q.operation==='checkpoint')result=run.checkpoint();
 else throw Error('Unknown WORK command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
