import {semInspection} from './semInspection';
import {SemWorkbenchRun,type SemCheckpoint} from './semAdapter';
import {verifySemReplay} from './semReplay';
import {runSemControlSuite} from './semControlSuite';
import {runSemRecognitionControls} from './semRecognitionControls';
import {runSemRecognitionIntegrity} from './semRecognitionIntegrity';
import {runSemKnowledgeControls} from './semKnowledgeControls';
import {runSemMeasurementControls} from './semMeasurementControls';
import {runSemClassificationControls} from './semClassificationControls';
import {runSemRecognitionBoundaryControls} from './semRecognitionBoundaryControls';
import {runSemContinuantControls} from './semContinuantControls';
import {runSemAxesControls} from './semAxesControls';
import {runSemBindingControls} from './semBindingControls';
import {runSemEventFileControls} from './semEventFileControls';
import {runSemClassificationBoundaryControls} from './semClassificationBoundaryControls';
import {runSemEventClassificationControls} from './semEventClassificationControls';
import {runSemNegativeControls} from './semNegativeControls';
import {runSemRendererControls} from './semRendererControls';
import {runSemIntegratedSuite} from './semIntegratedSuite';
import {runSemAuthorityControls} from './semAuthorityControls';
import {runSemOccurrenceControls} from './semOccurrenceControls';
import {runSemPhenomenonControls} from './semPhenomenonControls';
import {runSemAcceptanceControls} from './semAcceptanceControls';
import {runSemPersistenceControls} from './semPersistenceControls';
import {runSemCodecControls} from './semCodecControls';
import {runSemSchemaControls} from './semSchemaControls';
import {runSemPhaseControls} from './semPhaseControls';
import {runSemProvenanceControls} from './semProvenanceControls';
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
 else if(q.operation==='recognitionIntegrity'){const before=JSON.stringify(run.checkpoint());result=await runSemRecognitionIntegrity();if(JSON.stringify(run.checkpoint())!==before)throw Error('Recognition integrity changed active run');}
 else if(q.operation==='acceptance'){const before=JSON.stringify(run.checkpoint());result=await runSemAcceptanceControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Acceptance controls changed active run');}
 else if(q.operation==='phenomenon'){const before=JSON.stringify(run.checkpoint());result=await runSemPhenomenonControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Phenomenon controls changed active run');}
 else if(q.operation==='occurrence'){const before=JSON.stringify(run.checkpoint());result=await runSemOccurrenceControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Occurrence controls changed active run');}
 else if(q.operation==='authority'){const before=JSON.stringify(run.checkpoint());result=await runSemAuthorityControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Authority controls changed active run');}
 else if(q.operation==='integrated'){const before=JSON.stringify(run.checkpoint());result=await runSemIntegratedSuite();if(JSON.stringify(run.checkpoint())!==before)throw Error('Integrated controls changed active run');}
 else if(q.operation==='renderer'){const before=JSON.stringify(run.checkpoint());result=await runSemRendererControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Renderer controls changed active run');}
 else if(q.operation==='negativeLedger'){const before=JSON.stringify(run.checkpoint());result=await runSemNegativeControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Negative ledger changed active run');}
 else if(q.operation==='persistence'){const before=JSON.stringify(run.checkpoint());result=await runSemPersistenceControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Persistence controls changed active run');}
 else if(q.operation==='codecs'){const before=JSON.stringify(run.checkpoint());result=await runSemCodecControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Codec controls changed active run');}
 else if(q.operation==='schemas'){const before=JSON.stringify(run.checkpoint());result=await runSemSchemaControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Schema controls changed active run');}
 else if(q.operation==='phases'){const before=JSON.stringify(run.checkpoint());result=await runSemPhaseControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Phase controls changed active run');}
 else if(q.operation==='provenance'){const before=JSON.stringify(run.checkpoint());result=await runSemProvenanceControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Provenance controls changed active run');}
 else if(q.operation==='eventClassification'){const before=JSON.stringify(run.checkpoint());result=await runSemEventClassificationControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Event classification controls changed active run');}
 else if(q.operation==='classificationBoundaries'){const before=JSON.stringify(run.checkpoint());result=await runSemClassificationBoundaryControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Classification boundary controls changed active run');}
 else if(q.operation==='eventFiles'){const before=JSON.stringify(run.checkpoint());result=await runSemEventFileControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Event-file controls changed active run');}
 else if(q.operation==='bindings'){const before=JSON.stringify(run.checkpoint());result=await runSemBindingControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Binding controls changed active run');}
 else if(q.operation==='axes'){const before=JSON.stringify(run.checkpoint());result=await runSemAxesControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Axis controls changed active run');}
 else if(q.operation==='continuant'){const before=JSON.stringify(run.checkpoint());result=await runSemContinuantControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Continuant controls changed active run');}
 else if(q.operation==='recognitionBoundaries'){const before=JSON.stringify(run.checkpoint());result=await runSemRecognitionBoundaryControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Recognition boundary controls changed active run');}
 else if(q.operation==='classification'){const before=JSON.stringify(run.checkpoint());result=await runSemClassificationControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Classification controls changed active run');}
 else if(q.operation==='measurement'){const before=JSON.stringify(run.checkpoint());result=await runSemMeasurementControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Measurement controls changed active run');}
 else if(q.operation==='knowledge'){const before=JSON.stringify(run.checkpoint());result=await runSemKnowledgeControls();if(JSON.stringify(run.checkpoint())!==before)throw Error('Knowledge controls changed active run');}
 else throw Error('Unknown SEM command');
 self.postMessage({id:q.id,result});
 }catch(e){self.postMessage({id:q.id,error:e instanceof Error?e.message:String(e)});}
});
