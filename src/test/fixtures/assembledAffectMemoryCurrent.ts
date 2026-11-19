/** M186 e6d71665/90a68d2c: preserve M176 sources; current shared model. */
import {fixture as prior} from './assembledAffectMemoryFinal';
import {decode,items,enc,list,text,signed,u,C} from './assembledFamiliarity';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {ATTRIBUTION_USE_RULES,CALIBRATED_SENSING_RULES,CALIBRATED_SENSING_REGISTRY} from '../../assembled/model';
import {STRESS,stressPath,stressValue} from '../../assembled/regulatoryStress';
export function fixture(...args:Parameters<typeof prior>){
 const b=prior(...args),slots=[...items(decode(b.s.registry),'list')],body=items(slots[6],'list');
 if(b.s.rulesVersion!==ATTRIBUTION_USE_RULES||slots.length!==54||body.length!==7)throw Error('M186 expected original0.126 source');
 slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(0)]);
 slots.push(list([text(STRESS),true,u(0),u(500)]));
 const state=restoreAuthoritativeState(decode(b.d.initialState));if(state.read(stressPath(C)).value)throw Error('M186 unexpected prior stress');
 return {s:{...b.s,rulesVersion:CALIBRATED_SENSING_RULES,registrySchemaVersion:CALIBRATED_SENSING_REGISTRY,registry:enc(list(slots))},d:{...b.d,initialState:enc(new AuthoritativeState([...state.entries(),{path:stressPath(C),value:stressValue(0n,0)}]).canonicalValue())}};
}
