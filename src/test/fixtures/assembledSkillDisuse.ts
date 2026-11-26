/** M285: one continuing character, nonsocial A/B, body30/rate0, seed0. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,actionA,cachedMemory,type CanonicalValue} from './assembledSkillMemory';
import {event,taskA,taskB,actionB} from './assembledWorkspaceFamily';
import {DISUSE_RULES,DISUSE_REGISTRY} from '../../assembled/model';
import {SKILL,INTERFERENCE,PRACTICE_SETTING} from '../../assembled/skill';
import {DISPLAY,STRATEGY,compileStrategy} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {BODY_SAMPLE,BODY_OBSERVER,BODY_DEFINITION} from '../../assembled/body';
import {cognitiveRecord} from '../../assembled/codecs';
import {createCharacterRun,prepareCharacterModel} from '../../assembled/character';
import {changeDefinition} from './assembledCharacter';
export type Mode='main'|'dense'|'hidden'|'blocked'|'interference'|'old'|'long';
export const times=[3,4,6,7,8,9,10];
export function fixture(mode:Mode='main'){
 const b=prior(mode==='hidden'?'hidden':'lost'),slots=items(decode(b.s.registry),'list'),routes=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list'));
 const compiled=compileStrategy(slots[12],items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decode(b.s.content),3);
 const routeFor=(task:CanonicalValue)=>{const row=compiled.find(r=>key(r.task)===key(task))!,action=key(task)===key(taskB)?actionB:actionA;const i=row.plans.findIndex(p=>key(p.actionId)===key(action));if(i<0)throw Error('declared action absent');return i;};
 let s=mode==='old'?b.s:{...b.s,rulesVersion:DISUSE_RULES,registrySchemaVersion:DISUSE_REGISTRY};
 const max=mode==='long'?1000000:12,end=mode==='long'?999999:11,ats=mode==='long'?[3,999999]:times;
 if(mode==='long')for(const n of ['task-a','task-b','configurable-garden'])s=changeDefinition(s,'definition/'+n,6n,signed(max));
 const original=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list')),frame=original.filter(a=>key(a[0])===key(signed(7))&&key(a[2])!==key(PRIORITY_DISPLAY)&&key(a[2])!==key(PRACTICE_SETTING)),priority=original.find(a=>key(a[0])===key(signed(7))&&key(a[2])===key(PRIORITY_DISPLAY))!;
 const rows=original.filter(a=>![DISPLAY,PRIORITY_DISPLAY,PRACTICE_SETTING].some(t=>key(t)===key(a[2]))&&![3n,7n].includes((a[0] as {value:bigint}).value)||key(a[0])===key(signed(3))&&![DISPLAY,PRIORITY_DISPLAY,PRACTICE_SETTING,...frame.map(a=>a[2])].some(t=>key(t)===key(a[2]))).map(a=>list(a));
 for(const [i,at] of [1,...ats].entries()){
  const target=at===6||at===9?taskB:taskA;
  const p=at===1?original.find(a=>key(a[0])===key(signed(1))&&key(a[2])===key(PRIORITY_DISPLAY))!:priority;
  const payload=items(p[3],'list');
  rows.push(event(at,10,PRIORITY_DISPLAY,list([payload[0],list(items(payload[1],'list').map(v=>{
   const a=[...items(v,'list')],main=[taskA,taskB].some(t=>key(t)===key(a[0])),r=routes.find(r=>key(r[0])===key(a[0]))!;
   if(at===1){a[1]=list([q(main?1:0,1)]);a[5]=list([r[main?routeFor(a[0])+1:1]]);}
   a[3]=list([q(key(a[0])===key(target)?1:0,1)]);return list(a);
  }))])));
  if(at===1)rows.push(event(at,30,DISPLAY,list([text(STRATEGY),list(routes.flatMap(r=>[0,1].map(route=>list([r[0],u(route),u(i*2+route+1),key(r[0])===key(taskA)&&route===routeFor(r[0]),u(at),u(end),true]))))])));
  if([6,7,9,10].includes(at))rows.push(event(at-1,30,DISPLAY,list([text(STRATEGY),list(routes.filter(r=>[taskA,taskB].some(t=>key(t)===key(r[0]))).map(r=>list([r[0],u(routeFor(r[0])),u(3+[6,7,9,10].indexOf(at)),key(r[0])===key(target),u(at-1),u(end),true])))])));
  if(at===1)continue;
  rows.push(...frame.map(a=>list([signed(at),...a.slice(1)])));
  rows.push(event(at,30,PRACTICE_SETTING,list([text(INTERFERENCE),u(at<=6?0:4),q(0,1),q(at===3||at===6?0:1,at===3||at===6?1:2),!(mode==='blocked'&&at===7),[3,6,7,8].includes(at),mode==='interference'&&at===7])));
 }
 if(mode==='dense')for(const at of[5,8])rows.push(event(at,10,BODY_SAMPLE,cognitiveRecord(459,[BODY_OBSERVER,BODY_DEFINITION])));
 const procedures=items(items(slots[11],'list')[1],'list').map(v=>items(v,'list'));
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},mode,ats,procedures:{A:procedures.find(p=>key(p[0])===key(actionA))![1],B:procedures.find(p=>key(p[0])===key(actionB))![1]}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(mode:Mode='main'){const b=fixture(mode),k=b.s.rulesVersion+key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,sid,actionA,actionB,taskA,taskB,cachedMemory};
export type {CanonicalValue};
