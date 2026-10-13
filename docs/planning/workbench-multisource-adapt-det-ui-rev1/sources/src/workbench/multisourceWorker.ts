import {MultisourceWorkbenchRun,type MultisourceCheckpoint} from './multisourceAdapter';
import {multisourceInspection} from './multisourceInspection';
let run:MultisourceWorkbenchRun|undefined;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:MultisourceCheckpoint}>)=>{
 const q=event.data;try{let result:unknown;
 if(q.operation==='create'){if(run)throw Error('Already initialized');run=await MultisourceWorkbenchRun.create(q.program);result=multisourceInspection(run);}
 else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await MultisourceWorkbenchRun.restore(q.checkpoint!);result=multisourceInspection(run);}
 else if(!run)throw Error('MULTISOURCE worker not initialized');
 else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:multisourceInspection(run)};}
 else if(q.operation==='checkpoint')result=run.checkpoint();
 else throw Error('Unknown MULTISOURCE command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
