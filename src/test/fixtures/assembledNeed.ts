/** M221 fixed scene: no people, body10/cap100/rate0/grid1/threshold60;
 * current body sample and ordinary opportunity2; seed0; no learned starting state. */
import {cohort,decode,items,key,enc,list,text,u,signed,C,rec,f,at} from './assembledIntoxicationCohort';
import {changeDefinition} from './assembledCharacter';
import {NEED_RULES,NEED_REGISTRY,ACTION_DOMAIN_RULES,ACTION_DOMAIN_REGISTRY} from '../../assembled/model';
import {NEED_RESPONSES} from '../../assembled/need';
import {BODY_SAMPLE,BODY_OBSERVER,BODY_DEFINITION} from '../../assembled/body';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {OPPORTUNITY,OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
import {set} from '../../substrate/canonicalEncoding';
import {CONTROL_SOURCE} from '../../assembled/control';
import {REWARD_SOURCE} from '../../assembled/rewardExperience';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord} from '../../campaign3/embodiedCodecs';
import {rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {sid} from '../../assembled/skill';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Options={responses?:number;goals?:boolean;reserve?:number;permitted?:boolean;selected?:boolean;width?:number;legacy?:boolean;inhibit?:boolean;execute?:boolean;protocolPermission?:boolean};
let base:ReturnType<typeof cohort>|undefined;
export function fixture(o:Options={}){
 const b=base??(base=cohort({scenario:'Sober',law:'Full',seed:0})),slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')];
 body[1]=q(100,1);body[2]=q(0,1);body[3]=q(o.width??1,1);body[4]=q(60,1);body[5]=o.permitted!==false;body[6]=true;slots[6]=list(body);
 if(o.selected===false){const a=[...items(slots[7],'list')];a[1]=u(0);slots[7]=list(a);}
 const instructions=[sid(1027,'definition/task-instruction-one'),sid(1027,'definition/task-instruction-two')].slice(0,o.responses??2);
 if(!o.legacy)slots.push(list([text(NEED_RESPONSES),list(instructions)]));
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().filter(e=>o.goals||e.path.rootStateTypeId!==373n).map(e=>e.path.rootStateTypeId===455n&&e.path.fieldId===1n?{...e,value:embodiedRecord(454,[q(o.reserve??10,1),signed(0)])}:e));
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>at(items(v,'list')[0])<=2n&&(o.goals||key(items(v,'list')[2])!==key(PRIORITY_DISPLAY))).map(v=>{const a=[...items(v,'list')];
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=[...items(a[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];t[1]=list([q(1,1)]);return list(t);}));a[3]=list(p);}
  if(o.inhibit&&key(a[2])===key(CONTROL_SOURCE)){const p=[...items(a[3],'list')];p[1]=u(1);p[2]=true;p[3]=true;p[4]=false;p[5]=true;p[6]=u(0);a[3]=list(p);}
  if(key(a[2])===key(REWARD_SOURCE)){const p=[...items(a[3],'list')];p[3]=false;p[4]=false;a[3]=list(p);}return list(a);
 });
 if(o.goals){const source=rows.find(v=>key(items(v,'list')[2])===key(PRIORITY_DISPLAY))!;const a=items(source,'list'),p=items(a[3],'list');rows.push(list([signed(2),a[1],a[2],list([p[0],list(items(p[1],'list').map(v=>list([items(v,'list')[0],list([]),...items(v,'list').slice(2)])))]),a[4]]));}
 if(o.execute!==undefined)rows.push(list([signed(2),u(100),OPPORTUNITY_SOURCE,list([text(OPPORTUNITY),C,set(items(items(slots[10],'list')[2],'set').map(v=>list([items(v,'list')[0],o.execute!])))]),list([])]));
 rows.push(list([signed(2),u(10),BODY_SAMPLE,embodiedRecord(459,[BODY_OBSERVER,BODY_DEFINITION]),list([])]));
 const source={...b.s,rulesVersion:o.legacy?ACTION_DOMAIN_RULES:NEED_RULES,registrySchemaVersion:o.legacy?ACTION_DOMAIN_REGISTRY:NEED_REGISTRY,registry:enc(list(slots))};
 return {s:o.protocolPermission===undefined?source:changeDefinition(source,'definition/protocol-execution',1n,o.protocolPermission),d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32)}};
}
const prepared=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(o:Options={}){const b=fixture(o),k=JSON.stringify(b.s);let pending=prepared.get(k);if(!pending){pending=prepareCharacterModel(b.s);prepared.set(k,pending);}const m=await pending,run=cachedMemory(await createCharacterRun(m,b.d));return {b,m,run};}
export async function through(run:Awaited<ReturnType<typeof createCharacterRun>>,t=2n){for(let n=0;run.snapshot().clock<t;n++){if(n>24||!await run.settleNextInstant())throw Error('Need fixture did not reach instant');}}
export {decode,items,key,enc,list,text,u,signed,C,rec,f,at,q};
export type {CanonicalValue};
