import {executeBindingPhenomenon,originalSource as bindingSource} from './semPhenomenonBindingFixture';
import {executeCausalPhenomenon,originalSource as causalSource} from './semPhenomenonCausalFixture';
import {negativeDiagnostic} from './semNegativeRecorder';
import {digest} from './canonical';
export async function runSemPhenomenonControls(){
 const groups=[];for(const [name,source,executed] of [['binding',bindingSource,executeBindingPhenomenon()],['causal',causalSource,executeCausalPhenomenon()]] as const){const cases=[];for(const c of executed){const exact=negativeDiagnostic(c);cases.push({name:c.name,assertions:c.assertions.length,evidence:{encoding:'negative-ledger-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))}});}groups.push({name,source,cases});}
 return {version:'sem-phenomenon-controls/0.1',groups,scope:'Original ten binding and six causal/ancestry test bodies execute with recorded assertion operands. CV-SEM-001/002/003/007/008/009/010 only: role-swapped truth may remain perceptually isomorphic; independent observer handles and fixture-relative ancestry checks do not establish general epistemic safety. Companion-to-Participant and Location mappings execute; hidden truth versus permitted-role comparison executes. Original JSON/string equality is not relabelled canonical-byte equality. Assertion operands are not all function inputs or full traces. Recognition, rendering, native persistence and accepted seam qualifications remain separate. No UI or full SEM claim.'};
}
