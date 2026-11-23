/** M226: same social task/body/practices as M225; panel report at idle8.
 * The panel labels one governed action. It does not supply a belief or an attempt. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,type CanonicalValue} from './assembledActionReward';
import {REWARD_INFORMATION_RULES,REWARD_INFORMATION_REGISTRY} from '../../assembled/model';
import {REWARD_INFORMATION,REWARD_SOURCE} from '../../assembled/rewardExperience';
import {sid} from '../../assembled/skill';
import {BODY_OBSERVER} from '../../assembled/bodyIdentifiers';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Options={amount?:number;action?:number;denied?:boolean;withheld?:boolean};
export function fixture(o:Options={}){
 const b=prior({diverse:false}),slots=[...items(decode(b.s.registry),'list')],state=restoreAuthoritativeState(decode(b.d.initialState));
 const roster=state.entries().find(e=>e.path.rootStateTypeId===268n&&e.path.fieldId===1n&&e.path.selectors[0].kind==='mapKey'&&key(e.path.selectors[0].key)===key(BODY_OBSERVER));
 if(!roster||key(f(rec(roster.value,267n),1n))!==key(C))throw Error('missing holder binding');
 const observer=sid(1000,'observer/reward-panel'),initial=new AuthoritativeState([...state.entries(),{path:{...roster.path,selectors:[{kind:'mapKey' as const,key:observer}]},value:roster.value}]),decl=items(slots[57],'list');slots[57]=list([text(REWARD_INFORMATION),...decl.slice(1),observer]);
 const inputs=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(REWARD_SOURCE)){const p=[...items(a[3],'list')],report=at(a[0])===8n&&o.amount!==undefined;p[0]=text(REWARD_INFORMATION);if(at(a[0])===8n){p[1]=!o.denied;p[3]=!o.withheld;}p.push(list(report?[list([b.actions[o.action??1],u(o.amount!)])]:[]));a[3]=list(p);}return list(a);});
 return {...b,observer,s:{...b.s,rulesVersion:REWARD_INFORMATION_RULES,registrySchemaVersion:REWARD_INFORMATION_REGISTRY,registry:enc(list(slots))},d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(inputs))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(o:Options={}){const b=fixture(o),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at};
export type {CanonicalValue};
