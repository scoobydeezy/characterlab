/** M256: M189 p1/s1/v1 control edge, one current0.157 character.
 * Nonsocial A/B, third0; body30/cap100/rate10 +90 at9; learned panels1..9, no learned S0. */
import {fixture as memory} from './assembledAffectMemoryCurrent';
import {rec,f,uint,items,key,decode,enc,list,text,signed,q,C,u,set,sid,type CanonicalValue} from './assembledMultiSensor';
import {taskA,taskB} from './assembledGroundedAffect';
import {changeDefinition,replace} from './assembledCharacter';
import {CAUSAL_DISCLOSURE_RULES,CAUSAL_DISCLOSURE_REGISTRY} from '../../assembled/model';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {BODY_DELIVERY} from '../../assembled/body';
import {DISPLAY} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {INTOXICATION,sleepPath,sleepValue} from '../../assembled/sleepControl';
import {PROTECTION} from '../../assembled/protectiveIdentity';
import {REWARD_EVIDENCE,rewardBodyPath,rewardValue} from '../../assembled/rewardExperience';
import {NEED_RESPONSES} from '../../assembled/need';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {semanticReferentFromAuthoredContent as ref} from '../../substrate/referentOrigin';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Mode='normal'|'denied'|'hidden'|'failed';
let base:ReturnType<typeof memory>|undefined;
export function fixture(control:0|1=0,mode:Mode='normal',legacy=false){
 const b=base??(base=memory()),slots=[...items(decode(b.s.registry),'list')];if(slots.length!==55)throw Error('M256 expected55 original slots');
 const affect=[...items(slots[28],'list')],social=items(slots[19],'list');affect[5]=q(1,1);slots[28]=list(affect);
 slots[19]=list([social[0],list(items(social[1],'list').map(v=>list([items(v,'list')[0],list([])])))]);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(SOCIAL_SOURCE)).map(v=>{
  const a=[...items(v,'list')],at=(a[0] as {value:bigint}).value;if(![POSITION_SOURCE,DISPLAY,PRIORITY_DISPLAY].some(v=>key(v)===key(a[2])))return v;const p=[...items(a[3],'list')];
  if(key(a[2])===key(POSITION_SOURCE)){const annex=[...items(p[3],'list')];if(at===6n)annex[7]=!control;if(at===9n)annex[7]=true;if(mode==='hidden')annex[1]=!annex[1];if(mode==='denied'&&at===5n){const panel=[...items(p[2],'list')];panel[3]=false;p[2]=list(panel);}p[3]=list(annex);}
  else if(key(a[2])===key(DISPLAY))p[1]=list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[3]=uint(x[1])===(key(x[0])===key(taskB)?1n:0n);return list(x);}));
  else p[1]=list(items(p[1],'list').map(v=>{const x=[...items(v,'list')],main=[taskA,taskB].some(t=>key(t)===key(x[0]));x[at===1n?1:3]=list([q(main?1:0,1)]);return list(x);}));
  a[3]=list(p);return list(a);
 });
 rows.push(list([signed(9),u(110),BODY_DELIVERY,list([C,q(90,1),false]),list([])]));
 let initial=b.d.initialState;
 if(!legacy){
  const observers=items(slots[50],'list'),people=items(items(slots[19],'list')[1],'list').map(v=>items(v,'list')[0]);
  const extendedObservers=items(observers[3],'list').map((v,i)=>{
   const actors=people.map((person,j)=>list([person,ref(sid(1038,'content/m256-observer-'+i+'-person-'+j))]));
   return list([...items(v,'list'),list(actors)]);
  });
  slots[50]=list([...observers.slice(0,3),list(extendedObservers)]);
  const unused=sid(1027,'definition/m256-unused-withholding'),procedure=sid(1027,'definition/procedure/m256-unused-withholding'),habit=items(slots[16],'list')[1],defs=items(slots[0],'set'),template=defs.find(v=>key(f(rec(v,171n),1n))===key(habit))!;
  slots[0]=set([...defs,replace(replace(replace(template,1n,unused),3n,text('bounded-protocol-execution/0.2-candidate')),4n,r(391,[u(0)]))]);
  const actuator=items(slots[10],'list');slots[10]=list([actuator[0],actuator[1],set([...items(actuator[2],'set'),list([unused,q(0,1),u(0)])])]);
  const skill=items(slots[11],'list');slots[11]=list([skill[0],list([...items(skill[1],'list'),list([unused,procedure])])]);
  const item=sid(1601,'item/m256-parcel'),origin=sid(1602,'place/m256-origin'),destination=sid(1602,'place/m256-destination');
  slots.push(list([text(INTOXICATION),true,u(100),u(1000),u(0),u(800),u(10),true,u(100),u(500)]),list([text(PROTECTION),unused,taskA,q(3,5)]),list([text(REWARD_EVIDENCE),habit,taskA,u(300),u(500),u(600),u(10)]),list([text(NEED_RESPONSES),list([])]),list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([habit,item,destination])]),list([])]));
  initial=enc(new AuthoritativeState([...restoreAuthoritativeState(decode(initial)).entries(),{path:sleepPath(C),value:sleepValue(0n,0)},{path:rewardBodyPath(C),value:rewardValue(0n,300)},{path:itemPath(item),value:origin}]).canonicalValue());
 }
 const s=changeDefinition({...b.s,registry:enc(list(slots)),...(!legacy?{rulesVersion:CAUSAL_DISCLOSURE_RULES,registrySchemaVersion:CAUSAL_DISCLOSURE_REGISTRY}:{})},'definition/protocol-execution',1n,mode!=='failed');
 return {s,d:{...b.d,initialState:initial,orderedInputs:enc(list(rows))},control,mode,legacy};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(control:0|1=0,mode:Mode='normal',legacy=false){const b=fixture(control,mode,legacy),k=b.s.rulesVersion+key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof createCharacterRun>>,at:bigint){for(let n=0;run.snapshot().clock<at;n++)if(n>=128||!await run.settleNextInstant())throw Error('M256 did not reach '+at);if(run.snapshot().clock!==at)throw Error('M256 skipped '+at);}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,taskA,taskB};
export type {CanonicalValue};

/** Current expressions include Protection426/2; preserve the old helper as a control. */
function outputs(bytes:Uint8Array,type:bigint){return items(decode(bytes),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===type).map(v=>rec(v,type));}
