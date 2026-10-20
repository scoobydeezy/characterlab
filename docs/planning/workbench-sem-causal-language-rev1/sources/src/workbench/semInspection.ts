import {canonicalDecode,RecordSchemaRegistry,typedIdentifier,text} from '../substrate/canonicalEncoding';
import {identitySchemas} from '../substrate/identity';
import {persistenceSchemas} from '../substrate/persistence';
import {SEMANTIC_RECORD_SCHEMAS} from '../semanticBinding/semanticSchemaRegistry';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {SemWorkbenchRun} from './semAdapter';
import catalog from './semCatalog.json';
import {fromHex} from './canonical';
import {projectSemCharacter} from './semCharacter';
import {projectSemRecognitionLanguage} from './semRecognitionLanguage';
import {projectSemCausalLanguage} from './semCausalLanguage';
export function semInspection(run:SemWorkbenchRun){
 const snapshot=run.snapshot(),checkpoint=run.checkpoint();
 if(snapshot.saveHash!==checkpoint.saveHash||snapshot.prefix!==checkpoint.prefix)throw Error('SEM inspection boundary mismatch');
 const save=rec(canonicalDecode(fromHex(checkpoint.saveHex),new RecordSchemaRegistry([...Object.values(identitySchemas),...Object.values(persistenceSchemas),...SEMANTIC_RECORD_SCHEMAS])),132n);
 const trace=items(f(save,11n),'list');
 return {...snapshot,characters:catalog.schedule.map(({observer})=>projectSemCharacter(trace,typedIdentifier(1000n,text(observer)))),recognitions:catalog.schedule.map(({observer})=>projectSemRecognitionLanguage(trace,typedIdentifier(1000n,text(observer)))),causalRoles:catalog.schedule.map(({observer})=>projectSemCausalLanguage(trace,typedIdentifier(1000n,text(observer))))};
}
export type SemInspectionSnapshot=ReturnType<typeof semInspection>;
