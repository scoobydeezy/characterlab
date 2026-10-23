import type {DispositionPackedPairCheckpoint} from './dispositionPackedPairCheckpoint';
import {DispositionPagedPair,type DispositionBranch} from './dispositionPagedPair';
import type {DispositionPairCheckpoint} from './dispositionPairCheckpoint';
import type {DispositionTextSelector} from './dispositionPagedAdapter';
import type {DispositionDiagnosticSelection} from './dispositionCanonicalInspection';
let pair:DispositionPagedPair|undefined,busy=false;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;comparison?:string;checkpoint?:DispositionPairCheckpoint;packedCheckpoint?:DispositionPackedPairCheckpoint;branch?:DispositionBranch|'both';saveHash?:string;selection?:DispositionDiagnosticSelection;selector?:DispositionTextSelector;offset?:number;limit?:number}>)=>{
 const q=event.data;if(busy){self.postMessage({id:q.id,error:'DISPOSITION pair worker command already in flight'});return;}busy=true;
 try{
  let result:unknown;
  if(q.operation==='create'){if(pair)throw Error('Already initialized');pair=await DispositionPagedPair.create(q.comparison!);result=pair.summary();}
  else if(q.operation==='restore'){if(pair)throw Error('Already initialized');pair=await DispositionPagedPair.restore(q.checkpoint!);result=pair.summary();}
  else if(q.operation==='restorePacked'){if(pair)throw Error('Already initialized');pair=await DispositionPagedPair.restorePacked(q.packedCheckpoint!);result=pair.summary();}
  else if(!pair)throw Error('DISPOSITION pair not initialized');
  else if(q.operation==='advance'){const moved=await pair.advance(q.branch);result={moved,summary:pair.summary()};}
  else if(q.operation==='packedCheckpoint')result=await pair.packedCheckpoint();
  else if(q.operation==='checkpoint')result=await pair.checkpoint();
  else if(q.operation==='diagnostic'){if(!q.selection||typeof q.saveHash!=='string')throw Error('Missing pair diagnostic selection');result=pair.diagnostic(q.branch as DispositionBranch,q.saveHash,q.selection);}
  else if(q.operation==='textPage'){if(!q.selector||typeof q.saveHash!=='string')throw Error('Missing pair text selection');result=pair.textPage(q.branch as DispositionBranch,q.saveHash,q.selector,q.offset,q.limit);}
  else throw Error('Unknown DISPOSITION pair command');
  self.postMessage({id:q.id,result});
 }catch(error){self.postMessage({id:q.id,error:error instanceof Error?error.message:String(error),summary:pair?.summary()});}finally{busy=false;}
});
