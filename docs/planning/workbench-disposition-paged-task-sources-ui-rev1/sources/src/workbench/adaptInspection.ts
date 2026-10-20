import {AdaptWorkbenchRun} from './adaptAdapter';
import catalog from './adaptCatalog.json';
import {restoreAuthoritativeState} from '../substrate/state';
import {decodeMemory} from '../campaign2/memoryCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from './canonical';
import {projectAdaptCharacter} from './adaptCharacter';
export function adaptInspection(run:AdaptWorkbenchRun){const snapshot=run.snapshot(),checkpoint=run.checkpoint();if(snapshot.saveHash!==checkpoint.saveHash||snapshot.prefix!==checkpoint.prefix||snapshot.program!==checkpoint.program)throw Error('ADAPT inspection boundary mismatch');const initial=restoreAuthoritativeState(decodeMemory(fromHex(catalog.programs[0].initialState))),selector=initial.entries().find(e=>e.path.rootStateTypeId===268n)!.path.selectors[0];if(selector.kind!=='mapKey')throw Error('ADAPT observer roster key');return {...snapshot,character:projectAdaptCharacter(items(f(rec(decodeMemory(fromHex(checkpoint.saveHex)),132n),12n),'list'),selector.key)};}
export type AdaptInspectionSnapshot=ReturnType<typeof adaptInspection>;
