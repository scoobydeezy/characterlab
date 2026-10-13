import {RelationshipWorkbenchRun,type RelationshipCheckpoint} from './relationshipAdapter';
let run:RelationshipWorkbenchRun|undefined;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:RelationshipCheckpoint}>)=>{
 const q=event.data;try{let result:unknown;
 if(q.operation==='create'){if(run)throw Error('Already initialized');run=await RelationshipWorkbenchRun.create(q.program);result=run.snapshot();}
 else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await RelationshipWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
 else if(!run)throw Error('RELATIONSHIP worker not initialized');
 else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
 else if(q.operation==='checkpoint')result=run.checkpoint();
 else throw Error('Unknown RELATIONSHIP command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
