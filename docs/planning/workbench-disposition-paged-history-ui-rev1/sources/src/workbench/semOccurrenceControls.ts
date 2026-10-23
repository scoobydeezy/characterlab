import {executeSemOccurrence,originalSource} from './semOccurrenceFixture';
import {negativeDiagnostic} from './semNegativeRecorder';
import {digest} from './canonical';
export async function runSemOccurrenceControls(){
 const cases=[];for(const c of await executeSemOccurrence()){const exact=negativeDiagnostic(c);cases.push({name:c.name,assertions:c.assertions.length,failures:c.failures,evidence:{encoding:'negative-ledger-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))}});}
 return {version:'sem-occurrence-controls/0.1',source:originalSource,cases,scope:'Original six SEM-001J occurrence-identity regression cases: allocator reservation, malformed ordinal/support refusals, event-support numeric ordering across2/9/10, singleton continuant-rule limit, typed role projection and16 distinct namespaces. Event ordering is a discriminating emitted-evidence comparison. Continuant rules use one input each: their support ordering is unobservable here, not qualified by the singleton check. Namespace distinctness alone does not establish every payload domain. Exact assertion operands and caught errors retained; no full traces, native save/load, UI or full SEM qualification.'};
}
