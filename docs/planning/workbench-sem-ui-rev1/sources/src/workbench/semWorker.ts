import {SemWorkbenchRun,type SemCheckpoint} from './semAdapter';
import {verifySemReplay} from './semReplay';
let run:SemWorkbenchRun|undefined;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;checkpoint?:SemCheckpoint}>)=>{
 const q=event.data;try{let result:unknown;
 if(q.operation==='create'){if(run)throw Error('Already initialized');run=await SemWorkbenchRun.create();result=run.snapshot();}
 else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await SemWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
 else if(!run)throw Error('SEM worker not initialized');
 else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
 else if(q.operation==='verify')result=await verifySemReplay(run);
 else if(q.operation==='checkpoint')result=run.checkpoint();
 else throw Error('Unknown SEM command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
