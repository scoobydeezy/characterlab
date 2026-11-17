/** M148 scenario: body10, seed0, two social tasks with goals/urgency1, third
 * unknown. Recognized controlled target, visual/voice/person/body channels.
 * Negative expression1; positive explanations2/3; actual decision/action4.
 * No authored learned beliefs; same source-grouped laws and model in all arms. */
import {historyFixture,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target} from './assembledSemanticFinal';
import {ADAPT_BOUNDARY_RULES,ADAPT_BOUNDARY_REGISTRY} from '../../assembled/model';
import {learningProtectionDeclaration} from '../../assembled/learningProtection';
import {SOCIAL,SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='corrected'|'denied'|'duplicate'|'false'|'missing';
export function fixture(mode:Mode='corrected',truth=true){
 const b=historyFixture(),slots=items(decode(b.s.registry),'list');
 if(slots.length!==49)throw Error('M148 expected current SEM registry');
 const s={...b.s,rulesVersion:ADAPT_BOUNDARY_RULES,registrySchemaVersion:ADAPT_BOUNDARY_REGISTRY,registry:enc(list([...slots,learningProtectionDeclaration()]))};
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];if(key(a[2])!==key(SOCIAL_SOURCE))return v;
  const at=key(a[0])===key(signed(1))?1:key(a[0])===key(signed(2))?2:key(a[0])===key(signed(3))?3:0;
  if(!at)throw Error('M148 undeclared social instant');
  const p=[...items(a[3],'list')];
  p[1]=list([text(SOCIAL),truth,u(at===1?1:2),u(at===1||mode==='false'?4:3),u(at===1?1:mode==='missing'?0:mode==='duplicate'?2:at),at===1||mode!=='denied',true]);
  p[3]=list([at>1,false,false,false]);
  p[5]=list([list([u(1),text('appearance/voice'),true,true])]);
  a[3]=list(p);return list(a);
 });
 return {...b,s,d:{...b.d,orderedInputs:enc(list(rows))},correctionMode:mode};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
