/** M182 plan95c30585: same intended action, private execution permission, later sensing. */
import {changeDefinition} from './assembledCharacter';
import {fixture as prior} from './assembledRegulatorySensing';
import {decode,items,key,enc,list,text,signed,u,q,type CanonicalValue} from './assembledFamiliarity';
import {set} from '../../substrate/canonicalEncoding';
import {BODY_SAMPLE} from '../../assembled/body';
import {DISPLAY} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {SKILL,PRACTICE_SETTING} from '../../assembled/skill';
import {PERFORMANCE_SETTING} from '../../assembled/performance';
const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M182 time');return v.value;};
export function fixture(permitted=true,observed=true){
 const b=prior(),slots=[...items(decode(b.s.registry),'list')],threat=items(slots[28],'list')[4];
 const tasks=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')[0]),target=tasks.find(t=>key(t)!==key(threat))!;
 const body=[...items(slots[10],'list')];body[1]=true;body[2]=set(items(body[2],'set').map(v=>list([items(v,'list')[0],q(80,1),u(0)])));slots[10]=list(body);
 let rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')],t=at(a[0]);
  if(key(a[2])===key(DISPLAY)&&t===25n){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=key(r[0])===key(target)&&key(r[1])===key(u(0));return list(r);}))]);}
  if(key(a[2])===key(PRIORITY_DISPLAY)&&t===26n){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=list([q(key(r[0])===key(target)?1:0,1)]);return list(r);}))]);}
  if(key(a[2])===key(PRACTICE_SETTING))a[3]=list([text(SKILL),u(4),q(0,1),q(0,1),t===26n?permitted:true,false]);
  if(key(a[2])===key(PERFORMANCE_SETTING)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[1]=false;return list(r);}))]);}
  return list(a);
 });
 rows.push(...rows.filter(v=>at(items(v,'list')[0])===26n).map(v=>{const a=[...items(v,'list')];a[0]=signed(28);if(key(a[2])===key(PRACTICE_SETTING)){const p=[...items(a[3],'list')];p[4]=true;a[3]=list(p);}return list(a);}));
 const display=items(rows.find(v=>at(items(v,'list')[0])===25n&&key(items(v,'list')[2])===key(DISPLAY))!,'list'),p=items(display[3],'list');
 rows.push(list([signed(27),...display.slice(1,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[2]=u(key(r[1])===key(u(0))?5:6);r[3]=false;r[4]=u(27);return list(r);}))]),display[4]]));
 if(!observed)rows=rows.filter(v=>!(at(items(v,'list')[0])===28n&&key(items(v,'list')[2])===key(BODY_SAMPLE)));
 return {s:changeDefinition(changeDefinition({...b.s,registry:enc(list(slots))},'definition/protocol-execution',1n,true),'definition/protocol-observation',4n,false),d:{...b.d,orderedInputs:enc(list(rows))},target,threat};
}
