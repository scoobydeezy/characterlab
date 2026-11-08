/** M69: three physical tasks; A threat/B competing, third cognitive operation.
 * Existing observed trials1..6, risk7; body30/rate10; live choice9/10, seed0. */
import {list,text,unsigned as u,signed,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent as referent} from '../../substrate/referentOrigin';
import {governedContentDefinitionId} from '../../substrate/contentDefinitionId';
import {fixture as previous,decode,items,key,enc,type Mode as PriorMode} from './assembledMitigation';
import {GROUNDED_AFFECT_RULES,GROUNDED_AFFECT_REGISTRY} from '../../assembled/model';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {PRIORITY,PRIORITY_DISPLAY} from '../../assembled/priority';
import {STRATEGY,DISPLAY,compileStrategy} from '../../assembled/strategy';
import {changeDefinition} from './assembledCharacter';
import {C} from './campaign2Cognitive';
export const taskA=r(371,[C,referent(governedContentDefinitionId('content/task-a'))]),taskB=r(371,[C,referent(governedContentDefinitionId('content/task-b'))]);
export type Mode='ineffective'|'effective'|'zeroSeverity'|'noGround'|'hidden'|'unknown';
export function fixture(mode:Mode='ineffective'){
 const prior:PriorMode=mode==='unknown'?'missingAction':mode==='effective'||mode==='hidden'?mode:'ineffective';
 const b=previous(prior),a=[...items(decode(b.s.registry),'list')],reappraisal=items(a[28],'list');
 a[28]=list([...reappraisal,taskA,q(mode==='zeroSeverity'?0:1,1)]);
 const social=items(a[19],'list');a[19]=list([social[0],list(items(social[1],'list').map(v=>list([items(v,'list')[0],list([])])))]);
 let s={...b.s,rulesVersion:GROUNDED_AFFECT_RULES,registrySchemaVersion:GROUNDED_AFFECT_REGISTRY,registry:enc(list(a))};
 for(const name of ['definition/task-a','definition/task-b']){
  s=changeDefinition(s,name,3n,q(name.endsWith('-a')?10:0,1));s=changeDefinition(s,name,4n,q(10,1));
  s=changeDefinition(s,name,5n,signed(8));s=changeDefinition(s,name,6n,signed(20));
 }
 const tasks=items(items(a[12],'list')[1],'list').map(v=>items(v,'list')[0]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const x=[...items(v,'list')];if(key(x[2])!==key(PRIORITY_DISPLAY))return v;
  const at=x[0];if(typeof at==='boolean'||at.kind!=='signed')throw Error('time');
  const p=items(x[3],'list');x[3]=list([p[0],list(items(p[1],'list').map(v=>{
   const row=[...items(v,'list')],main=[taskA,taskB].some(t=>key(t)===key(row[0]));
   if(at.value===1n)row[1]=list([q(main&&!(mode==='noGround'&&key(row[0])===key(taskA))?1:0,1)]);
   if(at.value===9n||at.value===10n){row[3]=list([q(main?1:0,1)]);row[4]=true;}
   return list(row);
  }))]);return list(x);
 });
 for(const at of [9,10])if(!rows.some(v=>key(items(v,'list')[0])===key(signed(at))&&key(items(v,'list')[2])===key(PRIORITY_DISPLAY)))rows.push(list([signed(at),u(10),PRIORITY_DISPLAY,list([text(PRIORITY),list(tasks.map(t=>list([t,list([]),true,list([q([taskA,taskB].some(x=>key(x)===key(t))?1:0,1)]),true])))]),list([])]));
 const routes=compileStrategy(a[12],items(a[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decode(s.content));
 rows.push(list([signed(8),u(30),DISPLAY,list([text(STRATEGY),list(routes.flatMap(t=>[0,1].map(i=>list([t.task,u(i),u(3+i),key(t.plans[i].actionId)===key(key(t.task)===key(taskB)?{kind:'typedIdentifier',namespaceId:1027n,payload:text('definition/protocol-contact-two')}:key(t.task)===key(taskA)?{kind:'typedIdentifier',namespaceId:1027n,payload:text('definition/protocol-contact-one')}:t.plans[0].actionId),u(8),u(10),true]))))]),list([])]));
 return {s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {decode,items,key,enc};
