/** M237: protocol contact is gated before adaptation; body delivery is a separate effect. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,type CanonicalValue} from './assembledGoalOutcomePrivacy';
import {changeDefinition} from './assembledCharacter';
import {PROBE_SOURCE_EVENT,AUTHORED_FACT_EVENT} from '../../campaign2/orderedInputs';
import {campaign2Record as cr} from '../../campaign2/codecs';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {DISPLAY} from '../../assembled/strategy';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const names=['permitted','denied','silent','external'] as const;
export type Case=typeof names[number];
let base:ReturnType<typeof prior>|undefined;
export function fixture(name:Case){
 const b=base??(base=prior('visibleSuccess')),permitted=name==='permitted'||name==='silent',external=name==='external';
 let s=changeDefinition(b.s,'definition/task-b',3n,q(52,10));s=changeDefinition(s,'definition/task-b',4n,q(53,10));s=changeDefinition(s,'definition/protocol-execution',1n,permitted);
 for(const action of b.actions){if(typeof action==='boolean'||action.kind!=='typedIdentifier'||typeof action.payload==='boolean'||action.payload.kind!=='text')throw Error('M237 action ID');s=changeDefinition(s,action.payload.value,1n,u(2));}
 const inputs=items(decode(b.d.orderedInputs),'list').filter(v=>at(items(v,'list')[0])!==4n&&!(external&&at(items(v,'list')[0])===3n)).map(v=>{const a=[...items(v,'list')];if(external&&key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list([])]);}return list(a);});
 if(name!=='silent')inputs.push(list([signed(4),u(110),PROBE_SOURCE_EVENT,r(333,[sid(1027,'definition/regulatory-diagnostic-probe')]),list([])]));
 if(external)inputs.push(list([signed(3),u(110),AUTHORED_FACT_EVENT,cr('AuthoredActualAdaptationFact',{Fact:cr('RegulatoryExposureFact',{CharacterId:C,ExposureReferentId:C,ActualContactCount:u(2)})}),list([])]));
 const slots=items(decode(s.registry),'list'),defs=items(slots[0],'set'),body=[...items(slots[6],'list')];
 const def=(name:string)=>f(rec(defs.find(v=>key(f(rec(v,171n),1n))===key(sid(1027,name)))!,171n),4n);
 if(f(rec(def('definition/protocol-execution'),434n),1n)!==permitted||key(body[1])!==key(q(100,1))||key(body[2])!==key(q(0,1)))throw Error('M237 physical declaration');
 for(const action of b.actions){const row=defs.find(v=>key(f(rec(v,171n),1n))===key(action))!;if(uint(f(rec(f(rec(row,171n),4n),391n),1n))!==2n)throw Error('M237 two contacts');}
 return {...b,s,d:{...b.d,orderedInputs:enc(list(inputs))},permitted,external,silent:name==='silent'};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(name:Case){const b=fixture(name),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid};
export type {CanonicalValue};
