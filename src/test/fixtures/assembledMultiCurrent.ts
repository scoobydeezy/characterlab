/** M223: unchanged M150 social scene and learned receipts, migrated to0.145.
 * New physical anchors are not learned psychological state. Withholding is unused. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,type Mode,type CanonicalValue} from './assembledMultiReceipts';
import {NEED_RULES,NEED_REGISTRY} from '../../assembled/model';
import {replace} from './assembledCharacter';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {sid} from '../../assembled/skill';
import {semanticReferentFromAuthoredContent as ref} from '../../substrate/referentOrigin';
import {REHEARSAL} from '../../assembled/rehearsal';
import {STRESS,stressPath,stressValue} from '../../assembled/regulatoryStress';
import {INTOXICATION,sleepPath,sleepValue} from '../../assembled/sleepControl';
import {PROTECTION} from '../../assembled/protectiveIdentity';
import {REWARD_EVIDENCE,rewardBodyPath,rewardValue} from '../../assembled/rewardExperience';
import {NEED_RESPONSES} from '../../assembled/need';
import {BODY_DELIVERY} from '../../assembled/body';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export const unused=sid(1027,'definition/unselected-withholding'),procedure=sid(1027,'definition/procedure/unselected-withholding');
const bases=new Map<string,ReturnType<typeof prior>>();
export function fixture(mode:Mode='collective',permitted=true,truth=true,linked=true){
 const k=[mode,permitted,truth,linked].join('/');let b=bases.get(k);if(!b){b=prior(mode,permitted,truth,linked);bases.set(k,b);}
 const slots=[...items(decode(b.s.registry),'list')];if(slots.length!==52)throw Error('M223 expected original52 slots');
 const body=items(slots[6],'list'),ret=items(slots[8],'list'),access=items(slots[9],'list');
 if(body.length!==7||ret.length!==4||access.length!==2)throw Error('M223 source representation changed');
 slots[6]=list([text('assembled-body/0.2'),...body.slice(1),signed(0)]);
 slots[8]=list([...ret,list([]),ret[2]]);slots[9]=list([...access,text('PresentationFrequency')]);
 const social=items(slots[50],'list'),people=items(items(slots[19],'list')[1],'list').map(v=>items(v,'list')[0]);
 const observers=items(social[3],'list').map((v,i)=>{
  const actors=people.map((p,j)=>list([p,ref(sid(1038,'content/m223-observer-'+i+'-person-'+j))]));
  return list([...items(v,'list'),list(actors)]);
 });
 slots[50]=list([...social.slice(0,3),list(observers)]);
 const habit=items(slots[16],'list')[1],defs=items(slots[0],'set'),template=defs.find(v=>key(f(rec(v,171n),1n))===key(habit))!;
 const zero=replace(replace(replace(template,1n,unused),3n,text('bounded-protocol-execution/0.2-candidate')),4n,r(391,[u(0)]));
 slots[0]=set([...defs,zero]);const actuator=items(slots[10],'list');
 slots[10]=list([actuator[0],actuator[1],set([...items(actuator[2],'set'),list([unused,q(0,1),u(0)])])]);
 const skill=items(slots[11],'list');slots[11]=list([skill[0],list([...items(skill[1],'list'),list([unused,procedure])])]);
 slots.push(list([text(REHEARSAL),signed(0),list([]),list([])]),list([]),
  list([text(STRESS),true,u(0),u(500)]),
  list([text(INTOXICATION),true,u(100),u(1000),u(0),u(800),u(10),true,u(100),u(500)]),
  list([text(PROTECTION),unused,b.taskA,q(3,5)]),
  list([text(REWARD_EVIDENCE),habit,b.taskA,u(300),u(500),u(600),u(10)]),
  list([text(NEED_RESPONSES),list([])]));
 const original=restoreAuthoritativeState(decode(b.d.initialState));
 const initial=new AuthoritativeState([...original.entries(),{path:stressPath(C),value:stressValue(0n,0)},{path:sleepPath(C),value:sleepValue(0n,0)},{path:rewardBodyPath(C),value:rewardValue(0n,300)}]);
 const inputs=items(decode(b.d.orderedInputs),'list').map(v=>{const a=items(v,'list');if(key(a[2])!==key(BODY_DELIVERY))return v;const p=items(a[3],'list');return list([...a.slice(0,3),p.length===2?list([...p,false]):a[3],a[4]]);});
 return {...b,old:b,s:{...b.s,rulesVersion:NEED_RULES,registrySchemaVersion:NEED_REGISTRY,registry:enc(list(slots))},d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(inputs))}};
}
const prepared=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(mode:Mode='collective',permitted=true,truth=true,linked=true){const b=fixture(mode,permitted,truth,linked),k=key(decode(b.s.registry));let pending=prepared.get(k);if(!pending){pending=prepareCharacterModel(b.s);prepared.set(k,pending);}const m=await pending;return {b,m,r:cachedMemory(await createCharacterRun(m,b.d))};}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set};
export type {Mode,CanonicalValue};
