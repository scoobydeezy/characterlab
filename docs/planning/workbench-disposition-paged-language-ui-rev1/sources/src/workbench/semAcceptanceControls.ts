import {executeSemAcceptance,originalSource as gateSource} from './semAcceptanceFixture';
import {executeSemConsumerReplay,originalSource as replaySource} from './semConsumerReplayFixture';
import {negativeDiagnostic} from './semNegativeRecorder';
import {digest} from './canonical';
const dispositions=[
 ['Ledger','100 unique PASS rows; document status is not execution of all vectors.'],
 ['Executable and ledger','Numeric allocation, finite definitions and fixture facets execute; registry/document agreement also checked.'],
 ['Ledger reference','Six named PASS rows; original lifecycle, persistence and observer-interleaving controls remain separately qualified.'],
 ['Executable','Distinct ordered phase declarations in both lanes; this does not observe every scheduled runtime edge.'],
 ['Executable','All three fixture observers checked against the closed truth-identity/handle vocabulary and populated ancestry.'],
 ['Reference plus executable supplement','Source-reference check plus both original three-observer consumer/replay cases executed below.'],
 ['Ledger reference','31 formal names equal the ledger and test reference exists; separate negative-control report contains executed witnesses.'],
 ['Executable','One permitted emission target and nine coded forbidden targets.'],
 ['Ledger','ONT-001 inheritance and affordance closure remain deferred.'],
 ['Ledger','MATH-006 scope and CV-SEM-011 observation citation remain unchanged.'],
] as const;
export async function runSemAcceptanceControls(){
 const gate=await executeSemAcceptance(),replay=await executeSemConsumerReplay();
 const groups=[];
 for(const [name,source,executed] of [['acceptance',gateSource,gate.cases],['consumer-replay',replaySource,replay.cases]] as const){
  const cases=[];for(const c of executed){const exact=negativeDiagnostic(c);cases.push({name:c.name,assertions:c.assertions.length,failures:c.failures,evidence:{encoding:'negative-ledger-diagnostic-json/0.1',exact,sha256:await digest(new TextEncoder().encode(exact))}});}groups.push({name,source,cases});
 }
 if(gate.conditions.length!==dispositions.length)throw Error('Acceptance dispositions out of sync');
 return {version:'sem-acceptance-controls/0.1',conditions:gate.conditions.map((condition,index)=>({item:index+1,condition,kind:dispositions[index][0],scope:dispositions[index][1]})),groups,
  scope:'Original ten acceptance checks plus completeness and two original integration tests execute. Explicit raw imports replace repository-wide discovery with the exact three documents and two referenced test sources; source presence is bookkeeping, not test execution. The replay supplement executes all three observers, their immediate consumers and save/load after observer two; canonical save/trace equality and ordinal-free output equality retain their original domains. Renderer output is retained gate machinery, not accepted general character narration. Allocator-origin comparison tests this fixture only. Does not certify full workbench vectors, architecture participation, browser parity or Campaign4 entry. Campaign3 qualifications and18 conditional obligations unchanged.'};
}
