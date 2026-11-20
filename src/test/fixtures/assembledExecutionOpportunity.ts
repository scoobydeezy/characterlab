/** M194 plan b989b0ab: nonsocial M192 tasks, body30/cap100/rate10,
 * delivery90@9; importance3/5,severity1/2,seed0. Actual outcome channel at10.
 * World opportunity changes90 after choice, no actor or authored belief. */
import {fixture as prior,decode,items,enc,list,set,text,signed,u,C} from './assembledObstruction';
import {EXECUTION_OPPORTUNITY_RULES,EXECUTION_OPPORTUNITY_REGISTRY} from '../../assembled/model';
import {OPPORTUNITY,OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
export * from './assembledObstruction';
export function fixture(available=true,visible=true){
 const b=prior(0,visible,false),slots=items(decode(b.s.registry),'list'),actions=items(items(slots[10],'list')[2],'set').map(v=>items(v,'list')[0]);
 const source=list([signed(10),u(90),OPPORTUNITY_SOURCE,list([text(OPPORTUNITY),C,set(actions.map(a=>list([a,available])))]),list([])]);
 return {...b,actions,s:{...b.s,rulesVersion:EXECUTION_OPPORTUNITY_RULES,registrySchemaVersion:EXECUTION_OPPORTUNITY_REGISTRY},d:{...b.d,orderedInputs:enc(list([...items(decode(b.d.orderedInputs),'list'),source]))}};
}
