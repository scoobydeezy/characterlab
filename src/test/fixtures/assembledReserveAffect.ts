/** M71: existing risk episodes; body intervention9, current sample and choice10.
 * Three physical tasks, no social dependencies; seed0; consequence1/3. */
import {list,rational as q,signed,unsigned as u} from '../../substrate/canonicalEncoding';
import {fixture as prior,taskA,taskB,decode,items,key,enc} from './assembledThreatEvidence';
import {RESERVE_AFFECT_RULES,RESERVE_AFFECT_REGISTRY} from '../../assembled/model';
import {BODY_DELIVERY} from '../../assembled/body';
import {C} from './campaign2Cognitive';
export type Mode='low'|'high'|'hidden'|'denied'|'capacity200'|'saturatedLow'|'saturatedHigh';
export function fixture(mode:Mode='low'){
 const b=prior('risk'),a=[...items(decode(b.s.registry),'list')],body=[...items(a[6],'list')],app=[...items(a[28],'list')];
 app[5]=q(mode.startsWith('saturated')?1:1,mode.startsWith('saturated')?1:3);a[28]=list(app);
 if(mode==='denied')body[5]=false;if(mode==='capacity200')body[1]=q(200,1);a[6]=list(body);
 const rows=[...items(decode(b.d.orderedInputs),'list')];
 if(rows.some(v=>key(items(v,'list')[0])===key(signed(9))&&key(items(v,'list')[2])===key(BODY_DELIVERY)))throw Error('M71 inherited delivery collision');
 const amount=mode==='low'||mode==='saturatedLow'?q(0,1):mode==='hidden'?q(181,2):q(90,1);
 rows.push(list([signed(9),u(110),BODY_DELIVERY,list([C,amount]),list([])]));
 return {s:{...b.s,rulesVersion:RESERVE_AFFECT_RULES,registrySchemaVersion:RESERVE_AFFECT_REGISTRY,registry:enc(list(a))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {taskA,taskB,decode,items,key,enc};
