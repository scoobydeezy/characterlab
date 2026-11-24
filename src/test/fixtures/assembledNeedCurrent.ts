/** M245: M241 item task unchanged; direct Need enters the same current character.
 * Nonsocial B, body10/cap100/rate0/grid1/threshold60, selected interoception, seed7.
 * No learned starting state; declared responses assert no learned relief efficacy. */
import {fixture as prior,through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination,type CanonicalValue} from './assembledItemCompetence';
import {NEED_RESPONSES} from '../../assembled/need';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord} from '../../campaign3/embodiedCodecs';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Options={goals?:boolean;responses?:number;reserve?:number;width?:number;permitted?:boolean};
let base:ReturnType<typeof prior>|undefined;
export function fixture(o:Options={}){
 const b=base??(base=prior('capable')),slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')];
 if(slots.length!==60||key(body[1])!==key(q(100,1))||key(body[2])!==key(q(0,1))||key(body[4])!==key(q(60,1)))throw Error('M245 fixed current body declarations');
 body[3]=q(o.width??1,1);body[5]=o.permitted!==false;slots[6]=list(body);
 slots[58]=list([text(NEED_RESPONSES),list([sid(1027,'definition/task-instruction-one'),sid(1027,'definition/task-instruction-two')].slice(0,o.responses??2))]);
 const entries=restoreAuthoritativeState(decode(b.d.initialState)).entries();if(entries.some(e=>e.path.rootStateTypeId===373n))throw Error('M245 requires empty initial goals');
 const initial=new AuthoritativeState(entries.map(e=>e.path.rootStateTypeId===455n&&e.path.fieldId===1n?{...e,value:embodiedRecord(454,[q(o.reserve??10,1),signed(0)])}:e));
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>o.goals||key(items(v,'list')[2])!==key(PRIORITY_DISPLAY));
 return {...b,s:{...b.s,registry:enc(list(slots))},d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))},options:o};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(o:Options={}){const b=fixture(o),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export {through,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,at,sid,target,origin,destination};
export type {CanonicalValue};
