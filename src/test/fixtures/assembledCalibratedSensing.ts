/** M183 d070ebb8: same physical history, explicit sensory calibration. */
import {fixture as prior,type Mode} from './assembledRegulatorySensing';
import {decode,items,enc,list,text,signed} from './assembledFamiliarity';
import {CALIBRATED_SENSING_RULES,CALIBRATED_SENSING_REGISTRY} from '../../assembled/model';
export function fixture(bias=200,mode:Mode='alias51'){
 const b=prior(mode),slots=[...items(decode(b.s.registry),'list')],body=items(slots[6],'list');
 slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(bias)]);
 return {s:{...b.s,rulesVersion:CALIBRATED_SENSING_RULES,registrySchemaVersion:CALIBRATED_SENSING_REGISTRY,registry:enc(list(slots))},d:b.d};
}
