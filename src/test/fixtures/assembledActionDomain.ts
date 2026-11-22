/** M219: independent physical dose; no learned S0, seed0, reserve10/rate1. */
import {tolerance as prior,decode,items,key,enc,list,text,u,signed,C,rec,f,at} from './assembledEmbodimentCurrent';
import {ACTION_DOMAIN_RULES,ACTION_DOMAIN_REGISTRY} from '../../assembled/model';
import {set,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {replace} from './assembledCharacter';
import {sid} from '../../assembled/skill';
import {cognitiveRecord as r} from '../../assembled/codecs';
import {DISPLAY,STRATEGY} from '../../assembled/strategy';
import {BODY_SAMPLE} from '../../assembled/body';
import {OPPORTUNITY_SOURCE} from '../../assembled/externalObstruction';
export * from './assembledEmbodimentCurrent';
export const dose=sid(1027,'definition/ordinary-dose'),instruction=sid(1027,'definition/ordinary-dose-plan'),procedure=sid(1027,'definition/procedure/ordinary-dose');
export function fixture(law:'Reciprocal'|'Unattenuated'='Reciprocal',hidden=false,finiteExposure=true){
 const b=prior(law),slots=[...items(decode(b.s.registry),'list')],defs=items(slots[0],'set'),find=(name:string)=>rec(defs.find(v=>key(f(rec(v,171n),1n))===key(sid(1027,'definition/'+name)))!,171n);
 const action=replace(find('protocol-contact-one'),1n,dose),plan=replace(replace(find('task-instruction-two'),1n,instruction),4n,r(389,[dose]));slots[0]=set([...defs,action,plan]);
 const actuator=items(slots[10],'list');slots[10]=list([actuator[0],actuator[1],set([...items(actuator[2],'set').map(v=>list([items(v,'list')[0],q(0,1),u(0)])),list([dose,q(40,1),u(2)])])]);
 const skill=items(slots[11],'list');slots[11]=list([skill[0],list([...items(skill[1],'list'),list([dose,procedure])])]);
 const target=items(slots[56],'list')[2],routes=items(slots[12],'list');slots[12]=list([routes[0],list(items(routes[1],'list').map(v=>{const a=items(v,'list');return key(a[0])===key(target)?list([a[0],instruction,a[1]]):v;}))]);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>!hidden||key(items(v,'list')[2])!==key(BODY_SAMPLE)||at(items(v,'list')[0])<4n).map(v=>{const a=[...items(v,'list')];
  if(key(a[2])===key(DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[3]=key(x[0])===key(target)&&key(x[1])===key(u(0));return list(x);}))]);}
  if(key(a[2])===key(OPPORTUNITY_SOURCE)){const p=items(a[3],'list');a[3]=list([p[0],p[1],set([...items(p[2],'set'),list([dose,true])])]);}return list(a);
 });
 if(finiteExposure)rows.push(list([signed(8),u(30),DISPLAY,list([text(STRATEGY),list([list([target,u(0),u(3),false,u(8),u(101),true])])]),list([])]));
 return {s:{...b.s,rulesVersion:ACTION_DOMAIN_RULES,registrySchemaVersion:ACTION_DOMAIN_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))},target};
}
export function registryChange(b:ReturnType<typeof fixture>,change:(slots:CanonicalValue[])=>void){const slots=[...items(decode(b.s.registry),'list')];change(slots);return {...b.s,registry:enc(list(slots))};}
