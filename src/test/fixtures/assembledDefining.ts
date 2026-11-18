/** M157: physical tasks, body30/rate10/width1, seed0. Same four perceived trials;
 * historical meaning17, pressure18..30, sparse appearances3998/3999, appraisal4000.
 * No learned initial state or authored significance. */
import {fixture as modern,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type CanonicalValue} from './assembledFamiliarity';
import {fixture as history} from './assembledSpatialMeaning';
import {MAINTENANCE_HORIZON_RULES,MAINTENANCE_HORIZON_REGISTRY} from '../../assembled/model';
import {changeDefinition} from './assembledCharacter';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {sid} from '../../assembled/skill';
import {BODY_SAMPLE} from '../../assembled/body';
export type Mode='High'|'Wide'|'Low'|'Absent';
export function fixture(mode:Mode='High',law='SignificanceFirst',recalled=16,hidden=false){
 const b=modern(),h=history(),slots=[...items(decode(b.s.registry),'list')],old=items(decode(h.s.registry),'list');
 slots[6]=old[6];slots[8]=old[8];slots[9]=list([items(old[9],'list')[0],u(recalled)]);
 slots[19]=list([items(slots[19],'list')[0],list(items(items(slots[19],'list')[1],'list').map(v=>list([items(v,'list')[0],list([])])))]);
 slots[31]=list([items(slots[31],'list')[0],text(law)]);
 const ranges={High:[q(30,1),q(31,1)],Low:[q(0,1),q(1,1)],Wide:[q(0,1),q(100,1)],Absent:[]};
 slots[32]=list([items(old[32],'list')[0],list(ranges[mode]),u(1),text('BothDirections'),u(5001)]);
 slots[37]=list([...items(old[37],'list'),u(5001)]);
 let s={...b.s,rulesVersion:MAINTENANCE_HORIZON_RULES,registrySchemaVersion:MAINTENANCE_HORIZON_REGISTRY,registry:enc(list(slots))};
 s=changeDefinition(s,'definition/task-workspace',2n,u(20));
 for(const n of ['definition/task-a','definition/task-b','definition/configurable-garden'])s=changeDefinition(s,n,6n,signed(5000));
 const opportunity=sid(1001,'event/deliberation-opportunity'),isContext=(a:readonly CanonicalValue[])=>key(a[1])===key(u(30))||key(a[2])===key(opportunity);
 const rows=items(decode(h.d.orderedInputs),'list').filter(v=>!isContext(items(v,'list'))).map(v=>{const a=[...items(v,'list')];if(key(a[0])===key(signed(31)))a[0]=signed(3998);else if(key(a[0])===key(signed(32)))a[0]=signed(3999);return list(a);});
 const frame=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[0])===key(signed(4))&&isContext(items(v,'list')));
 if(!frame.some(v=>key(items(v,'list')[2])===key(opportunity)))throw Error('M157 needs current opportunity frame');
 for(const at of [17,4000])rows.push(...frame.map(v=>list([signed(at),...items(v,'list').slice(1)])));
 const initial=restoreAuthoritativeState(decode(b.d.initialState));
 return {s,d:{...b.d,initialState:enc(new AuthoritativeState(initial.entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[hidden?q(61,2):q(30,1),signed(0)])}:e)).canonicalValue()),orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32)},mode};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u};
export type {CanonicalValue};

/** Split M157 foundation: current normal early sources, body10/seed0; only
 * maintenance expiry varies. Late planning stays blocked by its existing domain. */
export function foundation(expiry=5001){
 const b=modern(),slots=[...items(decode(b.s.registry),'list')];
 slots[32]=list([items(slots[32],'list')[0],list([q(30,1),q(31,1)]),u(1),text('BothDirections'),u(expiry)]);
 slots[37]=list([items(slots[37],'list')[0],list([q(0,1),q(0,1)]),u(1),text('BothDirections'),u(1),u(expiry)]);
 const rows=items(decode(b.d.orderedInputs),'list'),sample=items(rows.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list'),at=101n-uint(items(slots[8],'list')[3]);if(at<1n||at>100n)throw Error('foundation recall horizon');
 return {...b,s:{...b.s,rulesVersion:MAINTENANCE_HORIZON_RULES,registrySchemaVersion:MAINTENANCE_HORIZON_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list([...rows,list([signed(at),...sample.slice(1)])]))}};
}
