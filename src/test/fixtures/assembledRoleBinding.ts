/** M1292435908e. Two social goals, third unknown; body10; seed0; no successful execution.
 * Positive1, negative2, silent cue3. Only perceived co-carrier relation at2 differs. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledLearnedAssociation';
import {ROLE_BINDING_RULES,ROLE_BINDING_REGISTRY} from '../../assembled/model';
import {ROLE_ENCODING} from '../../assembled/encoding';
import {WORK} from '../../assembled/workMaintenance';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {DISPLAY} from '../../assembled/strategy';
import {sid} from '../../assembled/skill';
import {unsigned as u} from '../../substrate/canonicalEncoding';
import {changeDefinition} from './assembledCharacter';
export type Mode='separate'|'shared'|'duplicate'|'hidden'|'denied';
export function fixture(mode:Mode='separate'){
 const b=prior(30,'absent',1),slots=[...items(decode(b.s.registry),'list')],encoding=items(slots[30],'list');slots[30]=list([text(ROLE_ENCODING),...encoding.slice(1)]);
 slots.push(list([text(WORK),false,list([])]));
 const mapping=items(items(slots[19],'list')[1],'list').flatMap(v=>items(items(v,'list')[1],'list').map(v=>items(v,'list')[0])),taskA=mapping[0],taskB=mapping[1];if(!taskB)throw Error('M129 two social tasks');
 const strategy=items(slots[12],'list');slots[12]=list([strategy[0],list(items(strategy[1],'list').map(v=>{const row=items(v,'list');return [taskA,taskB].some(t=>key(t)===key(row[0]))?list([row[0],sid(1027,'definition/task-instruction-one'),sid(1027,'definition/task-instruction-two')]):v;}))]);
 let s=changeDefinition({...b.s,rulesVersion:ROLE_BINDING_RULES,registrySchemaVersion:ROLE_BINDING_REGISTRY,registry:enc(list(slots))},'definition/protocol-execution',1n,false);
 s=changeDefinition(s,'definition/task-workspace',2n,u(5));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];
 if(key(a[2])===key(SOCIAL_SOURCE)){const p=[...items(a[3],'list')],role=[...items(p[7],'list')],second=key(a[0])===key(signed(2)),shared=mode!=='separate'&&mode!=='denied';
  if(second){role[0]=u(mode==='hidden'?4:2);role[1]=u(2);}
  role[2]=list(second?[list([mode!=='denied',u(mode==='hidden'?4:3),u(mode==='duplicate'?2:3),shared])]:[]);p[7]=list(role);
  if(mode==='hidden'){p[2]=target;const o=[...items(p[1],'list')];o[1]=!(o[1]===true);p[1]=list(o);}a[3]=list(p);
 }
 if(key(a[2])===key(PRIORITY_DISPLAY)){const p=[...items(a[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const g=[...items(v,'list')];if(items(g[1],'list').length)g[1]=list([q([taskA,taskB].some(t=>key(t)===key(g[0]))?1:0,1)]);return list(g);}));a[3]=list(p);}
 if(key(a[2])===key(DISPLAY)){const p=[...items(a[3],'list')];p[1]=list(items(p[1],'list').map(v=>{const g=[...items(v,'list')];if(key(g[0])===key(taskA))g[3]=uint(g[1])===0n;if(key(g[0])===key(taskB))g[3]=uint(g[1])===1n;return list(g);}));a[3]=list(p);}
 return list(a);});
 return {s,d:{...b.d,orderedInputs:enc(list(rows))},taskA,taskB,legacy:b,mode};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
