import {BioWorkbenchRun, type BioCheckpoint} from './bioAdapter';
let run:BioWorkbenchRun|undefined, busy=false;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;name?:string;checkpoint?:BioCheckpoint}>)=>{
 const request=event.data;
 if(busy){self.postMessage({id:request.id,error:'BIO worker command already in flight'});return;}
 busy=true;
 try{
  let result:unknown;
  if(request.operation==='create'){if(run)throw Error('Already initialized');run=await BioWorkbenchRun.create(request.name);result=run.snapshot();}
  else if(request.operation==='restore'){if(run)throw Error('Already initialized');run=await BioWorkbenchRun.restore(request.checkpoint!);result=run.snapshot();}
  else if(!run)throw Error('BIO worker not initialized');
  else if(request.operation==='advance'){const moved=await run.advance();result={moved,snapshot:run.snapshot()};}
  else if(request.operation==='checkpoint')result=run.checkpoint();
  else throw Error('Unknown BIO inspection command');
  self.postMessage({id:request.id,result});
 }catch(error){self.postMessage({id:request.id,error:error instanceof Error?error.message:String(error)});}
 finally{busy=false;}
});
