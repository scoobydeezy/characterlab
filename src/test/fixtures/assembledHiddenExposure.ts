/** M146: fixed body10, seed0; existing task dependencies, no social/choice input.
 * Authored regulatory exposure2 count0/1; permitted diagnostic probe4, optional omission. */
import {historyFixture,rec,f,items,key,decode,enc,list,text,signed,C} from './assembledSemanticFinal';
import {HIDDEN_EXPOSURE_RULES,HIDDEN_EXPOSURE_REGISTRY} from '../../assembled/model';
import {AUTHORED_FACT_EVENT,PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {campaign2Record} from '../../campaign2/codecs';
import {probeRecord} from '../../campaign2/probeCodecs';
import {unsigned as u,typedIdentifier as tid} from '../../substrate/canonicalEncoding';
export function fixture(count=0,reveal=true){const b=historyFixture();return {s:{...b.s,rulesVersion:HIDDEN_EXPOSURE_RULES,registrySchemaVersion:HIDDEN_EXPOSURE_REGISTRY},d:{...b.d,runSeed:new Uint8Array(32),orderedInputs:enc(list([
 list([signed(2),u(110),AUTHORED_FACT_EVENT,campaign2Record('AuthoredActualAdaptationFact',{Fact:campaign2Record('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:u(count)})}),list([])]),
 ...(reveal?[list([signed(4),u(110),PROBE_SOURCE_EVENT,probeRecord(333,[tid(1027,text('definition/regulatory-diagnostic-probe'))]),list([])])]:[])
 ]))}};}
export {rec,f,items,key,decode,enc,list,text,signed,C};
