import {DecisionWorkbenchRun,type DecisionCheckpoint} from './decisionAdapter';
let run:DecisionWorkbenchRun|undefined;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:DecisionCheckpoint}>)=>{
 const q=event.data;try{let result:unknown;
 if(q.operation==='create'){if(run)throw Error('Already initialized');run=await DecisionWorkbenchRun.create(q.program);result=run.snapshot();}
 else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await DecisionWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
 else if(!run)throw Error('DECISION worker not initialized');
 else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
 else if(q.operation==='checkpoint')result=run.checkpoint();
 else throw Error('Unknown DECISION command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
