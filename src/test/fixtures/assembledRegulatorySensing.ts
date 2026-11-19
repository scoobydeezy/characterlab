/** M181 ce82ada5: current candidate; only declared physical/sensor settings vary. */
import {fixture as prior} from './assembledRegulatorySources';
import {decode,items,enc,list,signed,q} from './assembledFamiliarity';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord} from '../../campaign3/embodiedCodecs';
import {stressValue} from '../../assembled/regulatoryStress';
export type Mode='alias51'|'alias59'|'fine51'|'stress200'|'denied51'|'denied59'|'unavailable51';
export function fixture(mode:Mode='alias51'){
 const b=prior(),slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')];
 body[1]=q(100,1);body[2]=q(1,1);body[3]=q(mode==='fine51'?10:20,1);body[4]=q(60,1);body[5]=!mode.startsWith('denied');body[6]=mode!=='unavailable51';slots[6]=list(body);
 const initial=restoreAuthoritativeState(decode(b.d.initialState)),level=mode==='alias59'||mode==='denied59'?59:51,stress=mode==='stress200'||mode==='denied59'?200:0;
 return {s:{...b.s,registry:enc(list(slots))},d:{...b.d,initialState:enc(new AuthoritativeState(initial.entries().map(e=>e.path.rootStateTypeId!==455n?e:{...e,value:e.path.fieldId===1n?embodiedRecord(454,[q(level,1),signed(0)]):stressValue(0n,stress)})).canonicalValue())}};
}
