/** M286 fixed receiver: nonsocial A-only; body30/rate0; empty learned S0. */
import plan from '../../../docs/planning/SKILL_PUBLIC_EXPERIMENT_PLAN_REV1.json';
import freeze from '../../../docs/planning/campaign3-skill-model-rev1/FREEZE.json';
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,actionA,cachedMemory,type CanonicalValue} from './assembledSkillMemory';
import {event,taskA} from './assembledWorkspaceFamily';
import {DISUSE_RULES,DISUSE_REGISTRY} from '../../assembled/model';
import {PRACTICE_SETTING,INTERFERENCE} from '../../assembled/skill';
import {PERFORMANCE_SETTING,PERFORMANCE} from '../../assembled/performance';
import {DISPLAY,STRATEGY,compileStrategy} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {PROBE_SOURCE_EVENT} from '../../campaign2/orderedInputs';
import {decodeSkill} from '../../campaign3/skillCodecs';
import {changeDefinition} from './assembledCharacter';
import {createCharacterRun,prepareCharacterModel} from '../../assembled/character';
export const hex=(s:string)=>Uint8Array.from(s.match(/../g)??[],x=>parseInt(x,16));
export const groups:{initial:number;seed:number;input:string;names:string[]}[]=[];
for(const r of plan.runs){const initial=freeze.models.find(m=>m.name===r.model)!.settings.initial;let g=groups.find(g=>g.initial===initial&&g.seed===r.seed&&g.input===r.orderedInputs);if(!g){g={initial,seed:r.seed,input:r.orderedInputs,names:[]};groups.push(g);}g.names.push(r.name);}
export function fixture(index:number){
 const group=groups[index],b=prior('lost'),slots=items(decode(b.s.registry),'list');
 let s={...b.s,rulesVersion:DISUSE_RULES,registrySchemaVersion:DISUSE_REGISTRY};
 for(const name of ['task-a','task-b','configurable-garden'])s=changeDefinition(s,'definition/'+name,6n,signed(15));
 const routes=compileStrategy(slots[12],items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decode(s.content),3);
 const route=routes.find(r=>key(r.task)===key(taskA))!.plans.findIndex(p=>key(p.actionId)===key(actionA));if(route<0)throw Error('action absent');
 const original=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list'));
 const frame=original.filter(a=>key(a[0])===key(signed(7))&&![PRACTICE_SETTING,PERFORMANCE_SETTING,PRIORITY_DISPLAY,DISPLAY].some(t=>key(t)===key(a[2])));
 const priority=original.find(a=>key(a[0])===key(signed(7))&&key(a[2])===key(PRIORITY_DISPLAY))!;
 const rows=original.filter(a=>key(a[2])===key(PROBE_SOURCE_EVENT)||key(a[2])===key(POSITION_SOURCE)||key(a[0])===key(signed(1))&&key(a[2])===key(PRIORITY_DISPLAY)).map(a=>list(a));
 rows.push(event(1,30,DISPLAY,list([text(STRATEGY),list(routes.flatMap(r=>[0,1].map(i=>list([r.task,u(i),u(i+1),key(r.task)===key(taskA)&&i===route,u(1),u(14),true]))))])));
 const sources=items(decodeSkill(hex(group.input)),'list').map(v=>rec(v,783n));
 const attempts=[...[2,3].map(at=>({at,impairment:q(0,1),difficulty:q(0,1),permitted:true,practice:at===3?group.initial>0:group.initial===1,visible:false,report:0,source:undefined as CanonicalValue|undefined})),...sources.map(src=>({at:Number((f(src,1n) as {value:bigint}).value)+3,impairment:f(src,2n),difficulty:f(src,3n),permitted:f(src,4n)===true,practice:f(src,5n)===true,visible:f(src,6n)===true,report:Number(uint(f(src,7n))),source:src as CanonicalValue|undefined}))];
 for(const a of attempts){rows.push(...frame.map(v=>list([signed(a.at),...v.slice(1)])),event(a.at,10,PRIORITY_DISPLAY,priority[3]),
  event(a.at,30,PRACTICE_SETTING,list([text(INTERFERENCE),u(a.at<=6?0:4),a.impairment,a.difficulty,a.permitted,a.practice,false])),
  event(a.at,30,PERFORMANCE_SETTING,list([text(PERFORMANCE),list([list([taskA,a.visible,u(a.report===0?0:a.report===1?2:1)])])])));}
 if(group.seed!==0)throw Error('undeclared nonzero original seed');
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},group,index,attempts,route};
}
let model:ReturnType<typeof prepareCharacterModel>|undefined;
export async function start(index:number){const b=fixture(index);model??=prepareCharacterModel(b.s);const m=await model;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,actionA,taskA,cachedMemory};
export type {CanonicalValue};
