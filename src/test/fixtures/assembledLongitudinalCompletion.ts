/** M152: same continuing character. BIO4, practice6, own cooperation8/9,
 * capacity pressure10..13, loss30, failed32, fresh practice34, successful36.
 * Seed0/body10/rate0; two social tasks/third unknown; no learned initial state. */
import {promote,prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u,type CanonicalValue} from './assembledSocialWitness';
import {upgrade} from './assembledMultiReceipts';
import {PROCEDURAL_LOSS_RULES,PROCEDURAL_LOSS_REGISTRY} from '../../assembled/model';
import {PRACTICE_SETTING,INTERFERENCE} from '../../assembled/skill';
import {IDENTITY_CONTEXT,ELIGIBILITY} from '../../assembled/identityEligibility';
import {SOCIAL,SOCIAL_SOURCE} from '../../assembled/social';
import {REL} from '../../assembled/relationship';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {BODY_SAMPLE} from '../../assembled/body';
import {DISPLAY} from '../../assembled/strategy';
import {DELAYED_ACTION_BODY} from '../../assembled/actionBody';
import {set} from '../../substrate/canonicalEncoding';
import {changeDefinition,replace} from './assembledCharacter';
import {walk} from './campaign2Cognitive';
export type Mode='main'|'noLoss'|'untrained'|'bioOnly'|'skillOnly'|'relOnly'|'hidden'|'falseClaim'|'encodedEpisodes'|'unencodedReports';
export const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
function base(){
 const b=upgrade(promote(prior())),slots=[...items(decode(b.s.registry),'list')],body=[...items(slots[6],'list')],retention=[...items(slots[8],'list')];body[2]=q(0,1);slots[6]=list(body);retention[2]=u(2);slots[8]=list(retention);
 const act=items(slots[10],'list');slots[10]=list([text(DELAYED_ACTION_BODY),true,set(items(act[2],'set').map(v=>list([items(v,'list')[0],q(10,1),u(0)])))]);
 let s={...b.s,rulesVersion:PROCEDURAL_LOSS_RULES,registrySchemaVersion:PROCEDURAL_LOSS_REGISTRY,registry:enc(walk(list(slots),v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===370n?replace(v,6n,signed(60)):v))};
 s=changeDefinition(s,'definition/protocol-execution',1n,true);
 const original=items(decode(b.d.orderedInputs),'list'),frame=original.filter(v=>time(items(v,'list')[0])===4n),source=original.find(v=>time(items(v,'list')[0])===3n&&key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,sample=original.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!;
 return {b,s,slots,original,frame,source,sample};
}
let cached:ReturnType<typeof base>|undefined;
export function fixture(mode:Mode='main'){
 const {b,s,slots,original,frame,source,sample}=cached??(cached=base());
 const bio=mode!=='skillOnly'&&mode!=='relOnly',skill=mode!=='bioOnly'&&mode!=='relOnly',rel=mode!=='bioOnly'&&mode!=='skillOnly';
 const social=(v:CanonicalValue,at:number)=>{const a=[...items(v,'list')],p=[...items(a[3],'list')],acquire=at===8||at===9,kind=acquire?1:3;a[0]=signed(at);p[3]=list([at!==1,false,false,false]);
  p[6]=list([text(REL),u(mode==='hidden'&&acquire?2:kind),acquire&&rel,true,u(kind)]);p[8]=list([false,u(0),false,false,false,false,false]);
  if(at>3)p[1]=list([text(SOCIAL),mode!=='hidden',u(2),u(at===35?mode==='falseClaim'?4:3:(mode==='encodedEpisodes'||mode==='unencodedReports')&&acquire?3:0),u(at===35?(mode==='encodedEpisodes'||mode==='unencodedReports')?6:4:(mode==='encodedEpisodes'||mode==='unencodedReports')&&acquire?at-4:0),true,true]);
  else if(mode==='hidden'){const o=[...items(p[1],'list')];o[1]=!(o[1]===true);p[1]=list(o);}
  if(mode==='encodedEpisodes'&&acquire){const role=[...items(p[7],'list')];role[1]=u(1);p[7]=list(role);}
  a[3]=list(p);return list(a);};
 const rows=original.filter(v=>time(items(v,'list')[0])!==4n&&!(time(items(v,'list')[0])===6n&&key(items(v,'list')[2])===key(PRIORITY_DISPLAY))).map(v=>{const a=items(v,'list');return key(a[2])===key(SOCIAL_SOURCE)?social(v,Number(time(a[0]))):v;});
 for(const at of[4,6,30,32,34,36])for(const v of frame){const a=[...items(v,'list')];a[0]=signed(at);
  if(key(a[2])===key(PRACTICE_SETTING))a[3]=list([text(INTERFERENCE),u(at>=34?4:0),q(0,1),q(at===4?0:3,at===4?1:8),true,skill&&(at===6&&mode!=='untrained'||at===34),at===30&&mode!=='noLoss']);
  if(key(a[2])===key(IDENTITY_CONTEXT))a[3]=list([text(ELIGIBILITY),q(bio&&at===4?1:0,1),q(0,1),false]);
  if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const g=[...items(v,'list')];if(items(g[1],'list').length)g[1]=list([key(g[0])===key(b.taskA)?q(13,20):q(1,1)]);g[3]=key(g[0])===key(b.taskA)||at===4&&key(g[0])===key(b.taskB)?list([q(1,1)]):list([]);return list(g);}))]);}
  rows.push(list(a));
 }
 for(const at of[8,9,35])rows.push(social(source,at));
 for(const at of[10,11,12,13]){const a=[...items(sample,'list')];a[0]=signed(at);if(!rows.some(v=>time(items(v,'list')[0])===BigInt(at)&&key(items(v,'list')[2])===key(BODY_SAMPLE)))rows.push(list(a));}
 const result=rows.map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[5]=u(60);return list(r);}))]);}return list(a);});
 const procedures=items(items(slots[11],'list')[1],'list').map(v=>items(v,'list')),strategy=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')),instruction=strategy.find(v=>key(v[0])===key(b.taskA))![1];
 const defs=items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n).map(v=>rec(v,171n)),action=f(rec(f(defs.find(v=>key(f(v,1n))===key(instruction))!,4n),389n),1n),procedure=procedures.find(v=>key(v[0])===key(action))![1];
 return {...b,s,d:{...b.d,orderedInputs:enc(list(result))},procedure};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,u};
export type {CanonicalValue};
