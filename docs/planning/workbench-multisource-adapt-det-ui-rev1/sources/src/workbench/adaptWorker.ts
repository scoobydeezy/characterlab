import {adaptInspection} from './adaptInspection';
import {compareAdapt} from './adaptComparison';
import {AdaptWorkbenchRun,type AdaptCheckpoint} from './adaptAdapter';
let run:AdaptWorkbenchRun|undefined;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:AdaptCheckpoint}>)=>{
 const q=event.data;try{let result:unknown;
 if(q.operation==='create'){if(run)throw Error('Already initialized');run=await AdaptWorkbenchRun.create(q.program);result=adaptInspection(run);}
 else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await AdaptWorkbenchRun.restore(q.checkpoint!);result=adaptInspection(run);}
 else if(!run)throw Error('ADAPT worker not initialized');
 else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:adaptInspection(run)};}
 else if(q.operation==='compare'){const other=await AdaptWorkbenchRun.restore(q.checkpoint!);result=compareAdapt(run,other);}
 else if(q.operation==='checkpoint')result=run.checkpoint();
 else throw Error('Unknown ADAPT command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
