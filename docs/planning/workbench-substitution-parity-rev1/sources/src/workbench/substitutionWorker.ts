import {SubstitutionWorkbenchRun,type SubstitutionCheckpoint} from './substitutionAdapter';
let run:SubstitutionWorkbenchRun|undefined,busy=false;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;program?:string;checkpoint?:SubstitutionCheckpoint}>)=>{
 const q=event.data;if(busy){self.postMessage({id:q.id,error:'SUBSTITUTION worker command already in flight'});return;}busy=true;
 try{
  let result:unknown;
  if(q.operation==='create'){if(run)throw Error('Already initialized');run=await SubstitutionWorkbenchRun.create(q.program);result=run.snapshot();}
  else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await SubstitutionWorkbenchRun.restore(q.checkpoint!);result=run.snapshot();}
  else if(!run)throw Error('SUBSTITUTION worker not initialized');
  else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
  else if(q.operation==='checkpoint')result=run.checkpoint();
  else throw Error('Unknown SUBSTITUTION inspection command');
  self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}finally{busy=false;}
});
