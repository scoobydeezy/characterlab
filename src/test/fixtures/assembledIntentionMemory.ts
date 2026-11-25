/** M259: one nonsocial newly adopted task, controlled priority/board channels,
 * neutral permitted position evidence2; body30/cap100/rate10. Seed0; no learned S0.
 * Existing current0.157 configuration supplies all other owners with no new laws. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,taskB,type CanonicalValue} from './assembledPerceivedControl';
import {INTENTION_RULES,INTENTION_REGISTRY} from '../../assembled/model';
import {INTENTION_MEMORY} from '../../assembled/intentionMemory';
import {COMMITMENT_REQUEST} from '../../assembled/commitment';
import {WORK,WORK_SOURCE} from '../../assembled/workMaintenance';
import {PRIORITY,PRIORITY_ADOPTION,PRIORITY_DISPLAY} from '../../assembled/priority';
import {STRATEGY,DISPLAY,compileStrategy} from '../../assembled/strategy';
import {POSITION,POSITION_SOURCE} from '../../assembled/positionPerception';
import {BODY_SAMPLE} from '../../assembled/body';
import {changeDefinition} from './assembledCharacter';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Options={capacity?:number;route?:0|1;cue?:'instruction'|'neutral'|'absent';neutral?:boolean;denied?:boolean;hidden?:boolean;available?:boolean;failed?:boolean;cancelled?:boolean;expired?:boolean};
let base:ReturnType<typeof prior>|undefined;const sources=new Map<string,ReturnType<typeof prior>['s']>();
export function fixture(o:Options={}){
 const b=base??(base=prior()),slots=[...items(decode(b.s.registry),'list')];
 const retention=[...items(slots[8],'list')];retention[5]=u(o.capacity??2);slots[8]=list(retention);
 slots[47]=list([text(WORK),false,list([taskA])]);slots.push(list([text(INTENTION_MEMORY),list([taskA])]));
 const sourceKey=[o.capacity??2,!!o.failed,!!o.expired].join('/');let s=sources.get(sourceKey);if(!s){s={...b.s,rulesVersion:INTENTION_RULES,registrySchemaVersion:INTENTION_REGISTRY,registry:enc(list(slots))};
 s=changeDefinition(s,'definition/task-a',5n,signed(1));s=changeDefinition(s,'definition/task-a',6n,signed(o.expired?4:7));
 if(o.failed)s=changeDefinition(s,'definition/protocol-execution',1n,false);sources.set(sourceKey,s);}
 const routes=compileStrategy(slots[12],items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decode(s.content),5),route=routes.find(t=>key(t.task)===key(taskA))!;
 const originals=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list'));
 const rows:CanonicalValue[]=originals.filter(a=>key(a[2])===key(sid(1001,'event/regulatory-diagnostic-probe'))).map(a=>list([signed(1),...a.slice(1)]));
 rows.push(list([signed(1),u(10),PRIORITY_DISPLAY,list([text(PRIORITY_ADOPTION),list([list([taskA,list([q(1,1)]),!o.denied,list([]),true,list([route.plans[o.route??0].instructionId])])])]),list([])]));
 // Other pre-existing goals have no adopted importance; their motive is unavailable.
 // Their current urgency stays zero; no alternate instruction may supply the target.
 rows.push(list([signed(1),u(30),DISPLAY,list([text(STRATEGY),list(routes.flatMap(t=>[0,1].map(i=>list([t.task,u(i),u(i+1),o.available!==false,u(1),u(6),true]))))]),list([])]));
 if(o.neutral!==false)rows.push(list([signed(2),u(10),POSITION_SOURCE,list([text(POSITION),list([u(1),u(1),u(1),true,true,u(1)]),list([u(1),text('Before'),true,true])]),list([])]));
 if(o.cancelled)rows.push(list([signed(3),u(30),COMMITMENT_REQUEST,list([taskA,true,!!o.hidden]),list([])]));
 const cue=o.cue??'instruction';rows.push(list([signed(4),u(110),WORK_SOURCE,list([text(WORK),true,cue!=='absent',!!o.hidden,list([list([u(cue==='neutral'?2:1),true,u(3)]),...(cue==='neutral'?[list([u(1),true,u(1)])]:[])])]),list([])]));
 const frame=originals.filter(a=>key(a[0])===key(signed(10))&&(key(a[1])===key(u(30))&&key(a[2])!==key(DISPLAY)||key(a[2])===key(BODY_SAMPLE)||key(a[2])===key(sid(1001,'event/deliberation-opportunity'))));
 if(!frame.some(a=>key(a[2])===key(BODY_SAMPLE)))throw Error('M259 missing ordinary body frame');
 for(const at of [5,6]){rows.push(...frame.map(a=>list([signed(at),...a.slice(1)])));rows.push(list([signed(at),u(10),PRIORITY_DISPLAY,list([text(PRIORITY),list(routes.map(t=>list([t.task,list([]),true,list([q(key(t.task)===key(taskA)?1:0,1)]),true])))]),list([])]));}
 const initial=restoreAuthoritativeState(decode(b.d.initialState));
 const d={...b.d,initialState:enc(new AuthoritativeState(initial.entries().filter(e=>!(e.path.rootStateTypeId===373n&&e.path.selectors[0]?.kind==='mapKey'&&key(e.path.selectors[0].key)===key(taskA)))).canonicalValue()),orderedInputs:enc(list(rows))};
 return {s,d,o,route};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(o:Options={}){const b=fixture(o),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof createCharacterRun>>,at:bigint){for(let n=0;run.snapshot().clock<at;n++)if(n>=128||!await run.settleNextInstant())throw Error('M259 did not reach '+at);if(run.snapshot().clock!==at)throw Error('M259 skipped '+at);}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,taskB};
export type {CanonicalValue};
