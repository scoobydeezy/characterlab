import {semInspection} from './semInspection';
import {SemWorkbenchRun,type SemCheckpoint} from './semAdapter';
import {verifySemReplay} from './semReplay';
import {runSemControlSuite} from './semControlSuite';
import {runSemRecognitionControls} from './semRecognitionControls';
import {runSemKnowledgeControls} from './semKnowledgeControls';
import {runSemMeasurementControls} from './semMeasurementControls';
let run:SemWorkbenchRun|undefined;
self.addEventListener('message',async(event:MessageEvent<{id:number;operation:string;checkpoint?:SemCheckpoint}>)=>{
 const q=event.data;try{let result:unknown;
 if(q.operation==='create'){if(run)throw Error('Already initialized');run=await SemWorkbenchRun.create();result=semInspection(run);}
 else if(q.operation==='restore'){if(run)throw Error('Already initialized');run=await SemWorkbenchRun.restore(q.checkpoint!);result=semInspection(run);}
 else if(!run)throw Error('SEM worker not initialized');
 else if(q.operation==='advance'){const moved=await run.advance();result={moved,snapshot:semInspection(run)};}
 else if(q.operation==='verify')result=await verifySemReplay(run);
 else if(q.operation==='controls'){const before=JSON.stringify(run.checkpoint());result=await runSemControlSuite();if(JSON.stringify(run.checkpoint())!==before)throw Error('SEM component controls changed active run');}
 else if(q.operation==='recognition'){const before=JSON.stringify(run.checkpoint());result=await runSemRecognitionControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Recognition controls changed active run');}
 else if(q.operation==='checkpoint')result=run.checkpoint();
 else if(q.operation==='measurement'){const before=JSON.stringify(run.checkpoint());result=await runSemMeasurementControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Measurement controls changed active run');}
 else if(q.operation==='knowledge'){const before=JSON.stringify(run.checkpoint());result=await runSemKnowledgeControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Knowledge controls changed active run');}
 else throw Error('Unknown SEM command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
