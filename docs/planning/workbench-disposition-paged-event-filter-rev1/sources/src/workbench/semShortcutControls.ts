import {executeSemShortcuts,originalSource} from './semShortcutFixture';
import {negativeDiagnostic} from './semNegativeRecorder';
import {digest} from './canonical';
export async function runSemShortcutControls(){
 const cases=[];for(const result of executeSemShortcuts()){const exact=negativeDiagnostic(result);cases.push({name:result.name,assertions:result.assertions.length,failures:result.failures,evidence:{encoding:'negative-ledger-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))}});}
 return {version:'sem-shortcut-controls/0.1',contract:'semantic-binding/0.1-candidate#SEM-001J',source:originalSource,cases,scope:'Original two occurrence/version cases and ten integrated shortcut sections executed with assertion operands and caught failure messages. Structural multiplicity, distinct experience and ancestry-string absence are not executed rejection boundaries. Hidden-truth linkage refusal is not a new causal intervention. Legacy-version rejection is not by itself the full typed-ID migration proof; canonical chains and poisoned labels remain separate. Whole-instant rollback is retained by integrated controls rev2. No full trace, UI or full SEM qualification.'};
}
