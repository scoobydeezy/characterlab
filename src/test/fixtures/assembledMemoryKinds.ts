/** M170: one detached source base, original four trials and real event pressure. */
import {fixture168} from '../assembledRetentionLaws.test';
import {items,key,enc,list,decode} from './assembledDefiningControls';
import {u,signed,q,type CanonicalValue} from './assembledDefining';
import {MEMORY_KINDS_RULES,MEMORY_KINDS_REGISTRY} from '../../assembled/model';
import {BODY_SAMPLE} from '../../assembled/body';
let cached:ReturnType<typeof fixture168>|undefined;
export function fixture170(o:{goal?:'High'|'Wide';eventCapacity?:number;finalSlots?:number;horizon?:number;pressureCount?:1|2}={}){
 const b=structuredClone(cached??(cached=fixture168())),slots=[...items(decode(b.s.registry),'list')],ret=items(slots[8],'list'),horizon=o.horizon??4000;
 slots[8]=list([ret[0],ret[1],u(8),ret[3],list([list([signed(22),ret[1],u(8),u(o.eventCapacity??2)])]),u(8)]);
 const goal=[...items(slots[32],'list')];if(o.goal==='Wide')goal[1]=list([q(0,1),q(100,1)]);slots[32]=list(goal);
 slots[52]=list([...items(slots[52],'list'),list([signed(horizon),u(o.finalSlots??2),true])]);
 const originals=items(decode(b.d.orderedInputs),'list'),pressure=originals.find(v=>key(items(v,'list')[0])===key(signed(3998)))!;
 if(!pressure)throw Error('M170 actual positional source template');
 const rows=originals.filter(v=>{const a=items(v,'list'),t=(a[0] as {value:bigint}).value;return t!==3998n&&t!==3999n&&!(t>=18n&&t<=30n&&key(a[2])===key(BODY_SAMPLE));}).map(v=>{const a=items(v,'list');return key(a[0])===key(signed(4000))?list([signed(horizon),...a.slice(1)]):v;});
 for(let i=0;i<(o.pressureCount??2);i++)rows.push(list([signed(22+i),...items(pressure,'list').slice(1)]));
 return {...b,s:{...b.s,rulesVersion:MEMORY_KINDS_RULES,registrySchemaVersion:MEMORY_KINDS_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
