import {MultisourceWorkbenchRun} from './multisourceAdapter';
import catalog from './multisourceCatalog.json';
import {decodeMultisource} from '../campaign3/multisourcePublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from './canonical';
import {projectMultisourceCharacter} from './multisourceCharacter';
/** Read the same public save already authenticated by the run adapter. This
 * wrapper adds no runtime field, evaluator, or second simulation. */
export function multisourceInspection(run:MultisourceWorkbenchRun){
 const snapshot=run.snapshot(),checkpoint=run.checkpoint();
 if(snapshot.program!==checkpoint.program||snapshot.prefix!==checkpoint.prefix||snapshot.saveHash!==checkpoint.saveHash)throw Error('MULTISOURCE inspection boundary mismatch');
 const program=catalog.programs.find(p=>p.name===snapshot.program)!,model=catalog.models.find(m=>m.name===program.model)!;
 const observer=f(rec(decodeMultisource(fromHex(model.parameters)),710n),1n),save=rec(decodeMultisource(fromHex(checkpoint.saveHex)),132n);
 return {...snapshot,character:projectMultisourceCharacter(items(f(save,12n),'list'),observer)};
}
export type MultisourceInspectionSnapshot=ReturnType<typeof multisourceInspection>;
