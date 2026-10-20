import {GeneralWorkbenchRun, type GeneralCheckpoint, type GeneralSnapshot} from './generalAdapter';
import {prepareGeneralAttentionModel, generalAttentionModelSource, generalAttentionOrderedInputs} from '../campaign3/generalFactory';
import {bytesToHex} from '../substrate/canonicalEncoding';
import {NATIVE_READ_SOURCES_VERSION} from './nativeReadSources';
export const GENERAL_EXPORT_VERSION = 'general-inspection-export/0.2';
export const GENERAL_EXPORT_LIMIT = 40_000_000;
export interface GeneralExport {
  version: typeof GENERAL_EXPORT_VERSION | 'general-inspection-export/0.1';
  nativeReadSourcesVersion?: typeof NATIVE_READ_SOURCES_VERSION;
  projectionVersion: 'association-inspection/0.1';
  checkpoint: GeneralCheckpoint;
  originalInputs: string;
  snapshot: GeneralSnapshot;
  scope: string;
}
const legacyScope = 'Frozen original calendar; diagnostic reads and changes are not causal necessity. No runtime interventions. Two recipe parity qualification only; full corpus and language gates remain open.';
const scope = 'Frozen original calendar and native read-source metadata. Diagnostic read/source continuity is not causal necessity or observer-admitted evidence. No runtime interventions; broader qualification and Campaign4 entry remain separate.';
export async function exportGeneral(run: GeneralWorkbenchRun): Promise<GeneralExport> {
  const checkpoint = run.checkpoint(), snapshot = run.snapshot();
  const token = await prepareGeneralAttentionModel(generalAttentionModelSource(checkpoint.recipe));
  const result: GeneralExport = {version: GENERAL_EXPORT_VERSION, projectionVersion: 'association-inspection/0.1', checkpoint,
    originalInputs: bytesToHex(generalAttentionOrderedInputs(token)), snapshot, scope,nativeReadSourcesVersion:NATIVE_READ_SOURCES_VERSION};
  if (JSON.stringify(result, null, 2).length > GENERAL_EXPORT_LIMIT) throw Error('Graph export exceeds 40 million characters; no records discarded');
  return result;
}
/** Import never installs exported diagnostics as authority; it reconstructs and checks them. */
export async function importGeneral(text: string): Promise<GeneralWorkbenchRun> {
  if (text.length > GENERAL_EXPORT_LIMIT) throw Error('Graph import exceeds 40 million characters');
  const data = JSON.parse(text) as GeneralExport;
  if (!data || ![GENERAL_EXPORT_VERSION,'general-inspection-export/0.1'].includes(data.version) || data.projectionVersion !== 'association-inspection/0.1' || !data.checkpoint) throw Error('Unsupported graph export version');
  const restored = await GeneralWorkbenchRun.restore(data.checkpoint);
  const expected = await exportGeneral(restored);
  // Exact producer representation is intentional for this versioned interchange format.
  if(data.version==='general-inspection-export/0.1'){
    const {nativeReadSourcesVersion,...oldEnvelope}=expected;
    const {nativeReadMetadata,...oldSnapshot}=oldEnvelope.snapshot;
    const legacy={...oldEnvelope,version:'general-inspection-export/0.1',snapshot:oldSnapshot,scope:legacyScope};
    if(JSON.stringify(data)!==JSON.stringify(legacy))throw Error('Graph export originals, identities or diagnostics mismatch');
  }else if (JSON.stringify(data) !== JSON.stringify(expected)) throw Error('Graph export originals, identities or diagnostics mismatch');
  return restored;
}
