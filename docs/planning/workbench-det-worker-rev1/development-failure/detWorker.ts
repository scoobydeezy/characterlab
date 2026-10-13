import {compareDet} from './detComparison';
import {DetWorkbenchRun,type DetCheckpoint} from './adaptDeter';
let run:DetWorkbenchRun|undefined;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:DetCheckpoint}>)=>{
 const q=event.data;try{let result:unknown;
 if(q.operation==='create'){if(run)throw Error('Already initialized');run=await DetWorkbenchRun.create(q.program);result=run.snapshot();}
 else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await DetWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
 else if(!run)throw Error('DET worker not initialized');
 else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
 else if(q.operation==='compare'){const other=await DetWorkbenchRun.restore(q.checkpoint!);result=compareDet(run,other);}
 else if(q.operation==='checkpoint')result=run.checkpoint();
 else throw Error('Unknown DET command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
