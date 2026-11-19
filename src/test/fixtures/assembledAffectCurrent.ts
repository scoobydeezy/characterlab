/** M185 plan61513dc6: current0.129 reference psychology, declared source contexts. */
import {fixture as sensed} from './assembledCalibratedSensing';
import {fixture as executed} from './assembledExecutedAffect';
import {decode,items,key,enc,list,text,signed} from './assembledFamiliarity';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {CALIBRATED_SENSING_RULES,CALIBRATED_SENSING_REGISTRY,GOAL_ABSENCE_RULES} from '../../assembled/model';
export function responseBase(hidden=false){
 const b=sensed(0);if(!hidden)return b;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(POSITION_SOURCE))return v;const p=[...items(a[3],'list')],annex=[...items(p[3],'list')];annex[1]=annex[1]!==true;p[3]=list(annex);a[3]=list(p);return list(a);});
 return {s:b.s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export function executedFixture(permitted=true,observed=true){
 const b=executed(permitted,observed),slots=[...items(decode(b.s.registry),'list')],body=items(slots[6],'list');
 if(b.s.rulesVersion!==GOAL_ABSENCE_RULES||slots.length!==55||body.length!==7)throw Error('M185 expected original0.128 execution source');
 slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(0)]);
 return {...b,s:{...b.s,rulesVersion:CALIBRATED_SENSING_RULES,registrySchemaVersion:CALIBRATED_SENSING_REGISTRY,registry:enc(list(slots))}};
}
