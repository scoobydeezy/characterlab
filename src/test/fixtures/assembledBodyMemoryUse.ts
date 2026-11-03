/** M46: physical tasks, no social inputs; body10, diagnostic1, samples1/4,
 * refill80 at3, context decisions2/5; fixed seed0. Empty learned state. */
import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {restoreAuthoritativeState,AuthoritativeState} from '../../substrate/state';
import {embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {source as priorSource,data as priorData,decode,items,key,enc} from './assembledMemoryUse';
import {interactionData} from './assembledInteraction';
import {BODY_MEMORY_USE_RULES,BODY_MEMORY_USE_REGISTRY} from '../../assembled/model';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {BODY_SAMPLE,BODY_DELIVERY} from '../../assembled/body';
import {sid} from '../../assembled/skill';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY} from '../../assembled/strategy';
let cached:ReturnType<typeof priorData>|undefined;
export function source(law='SignificanceFirst',capacity=1){const s=priorSource(law,capacity),a=[...items(decode(s.registry),'list')],people=items(a[19],'list');a[19]=list([people[0],list(items(people[1],'list').map(v=>list([items(v,'list')[0],list([])])))]);return {...s,rulesVersion:BODY_MEMORY_USE_RULES,registrySchemaVersion:BODY_MEMORY_USE_REGISTRY,registry:enc(list(a))};}
export function data(mode:'main'|'unused'|'current'|'hidden'|'same-barrier'='main'){
 const d=cached??(cached=priorData()),all=items(decode(d.orderedInputs),'list'),rows:CanonicalValue[]=[];
 for(const v of all){const a=items(v,'list');if(key(a[0])===key(signed(1))&&[PRIORITY_DISPLAY,DISPLAY,sid(1001,'event/regulatory-diagnostic-probe')].some(x=>key(x)===key(a[2])))rows.push(v);
 if(key(a[0])===key(signed(4))&&(key(a[1])===key(unsigned(30))||key(a[2])===key(sid(1001,'event/deliberation-opportunity'))))for(const at of mode==='unused'?[5]:[2,5])rows.push(list([signed(at),...a.slice(1)]));}
 if(mode==='same-barrier'){const perceived=items(all.find(v=>key(items(v,'list')[0])===key(signed(1))&&key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list');rows.push(list([signed(2),...perceived.slice(1)]));}
 const physical=items(decode(interactionData(0,1).orderedInputs),'list');
 const sample=items(physical.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list'),delivery=items(physical.find(v=>key(items(v,'list')[2])===key(BODY_DELIVERY))!,'list');
 for(const at of mode==='current'?[1,2,4]:[1,4])rows.push(list([signed(at),...sample.slice(1)]));
 rows.push(list([signed(3),...delivery.slice(1)]));
 const initial=mode==='hidden'?enc(new AuthoritativeState(restoreAuthoritativeState(decode(d.initialState)).entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[q(21,2),signed(0)])}:e)).canonicalValue()):d.initialState;
 return {...d,initialState:initial,orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32)};
}
export {decode,items,key,enc};
