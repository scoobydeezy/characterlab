import {executeSemAuthority,originalSource} from './semAuthorityFixture';
import {negativeDiagnostic} from './semNegativeRecorder';
import {digest} from './canonical';
import {SEMANTIC_STATE_AUTHORITY_VERSION} from '../semanticBinding/semanticStateAuthority';
export async function runSemAuthorityControls(){
 const executed=await executeSemAuthority(),evidence=async(value:unknown)=>{const exact=negativeDiagnostic(value);return {encoding:'negative-ledger-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))};},cases=[];
 for(const c of executed.cases)cases.push({name:c.name,assertions:c.assertions.length,failures:c.failures,evidence:await evidence(c)});
 return {version:'sem-authority-controls/0.1',contract:SEMANTIC_STATE_AUTHORITY_VERSION,source:originalSource,cases,registry:await evidence({definitions:executed.definitions,leaves:executed.leaves}),occurrenceOrdinals:await evidence(executed.occurrenceOrdinals),scope:'Original eight semantic state-authority tests execute in original order with a fresh per-invocation ordinal map. Seven writable leaves across roots241..244, exact ownership refusals, canonical-set membership projection, codec round-trip, removal/value grammar and ModelIdentity distinctions. Codec persistence is not native scheduler save/load. Model-identity differences do not alone prove changed runtime behavior. Declared authority is not an observed read/write participation trace. Assertion operands and caught errors are retained, not every execution input. No UI, full SEM or Campaign4 qualification.'};
}
