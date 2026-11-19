/** M176: committed 4f7be66c comparison; normal sources, no authored memory. */
import {fixture as base,items,decode,enc,list,text,signed,u,q,key,type CanonicalValue} from './assembledFamiliarity';
import {changeDefinition} from './assembledCharacter';
import {prior} from './assembledSocialWitness';
import {currentMemory} from './assembledMemoryFinal';
import {fixture as threat} from './assembledThreatEvidence';
import {SOCIAL,SOCIAL_SOURCE} from '../../assembled/social';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {PRIORITY,PRIORITY_DISPLAY} from '../../assembled/priority';
import {STRATEGY,DISPLAY} from '../../assembled/strategy';
import {BODY_SAMPLE} from '../../assembled/body';
import {sid} from '../../assembled/skill';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord} from '../../campaign3/embodiedCodecs';
export type Mode='risk'|'safe'|'denied'|'hidden'|'later'|'socialDenied';
let cached:ReturnType<typeof base>|undefined,normal:ReturnType<typeof prior>|undefined;
const time=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('M176 time');return v.value;};
export function fixture(mode:Mode='risk',law='UncontrolledGain'){
 const b=currentMemory(structuredClone(cached??(cached=base()))),h=threat(mode==='later'||mode==='socialDenied'?'risk':mode),slots=[...items(decode(b.s.registry),'list')],old=items(decode(h.s.registry),'list');
 slots[6]=old[6];const ret=[...items(slots[8],'list')];ret[2]=u(32);ret[3]=u(16);ret[5]=u(32);slots[8]=list(ret);
 slots[9]=list([items(slots[9],'list')[0],u(1),text('PresentationFrequency')]);
 const affect=[...items(slots[29],'list')];affect[1]=text(law);slots[29]=list(affect);
 const encoding=[...items(slots[30],'list')];encoding[1]=u(2);slots[30]=list(encoding);
 const threatTask=items(slots[28],'list')[4],social=items(slots[19],'list');
 slots[19]=list([social[0],list(items(social[1],'list').map(v=>{const a=items(v,'list');return list([a[0],list(items(a[1],'list').filter(t=>key(items(t,'list')[0])!==key(threatTask)))]);}))]);
 const original=items(decode(b.d.orderedInputs),'list').map(v=>items(v,'list'));
 const rows=items(decode(h.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return time(a[0])<=9n&&[POSITION_SOURCE,REAPPRAISAL_SOURCE].some(t=>key(t)===key(a[2]));});
 const diagnostic=original.find(a=>key(a[2])===key(sid(1001,'event/regulatory-diagnostic-probe')))!;if(!diagnostic)throw Error('M176 missing ordinary conditional probe');rows.push(list([signed(1),...diagnostic.slice(1)]));
 const template=items(items(decode((normal??(normal=prior())).d.orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE))!,'list');
 for(const [i,at]of [10,11,12].entries()){
  const p=[...items(template[3],'list')];p[1]=list([text(SOCIAL),true,u(1),u(i===0?3:i===1?4:0),u(i+1),!(mode==='socialDenied'&&i===0),true]);
  p[3]=list([i>0&&!(mode==='socialDenied'&&i===1),false,false,false]);p[7]=list([u(1),u(1),list(i<2?[list([true,u(i===0?1:3),u(i===0?1:3),false])]:[])]);
  p[8]=list([false,u(0),false,false,false,true,true]);p[9]=list([false,u(0),true,u(0)]);p[10]=list([list([false,false,false]),list([false,false,false]),list([false,false,false])]);
  rows.push(list([signed(at),...template.slice(1,3),list(p),template[4]]));
 }
 const frame=original.filter(a=>time(a[0])===4n&&(key(a[1])===key(u(30))||key(a[2])===key(sid(1001,'event/deliberation-opportunity'))));
 const sample=original.find(a=>key(a[2])===key(BODY_SAMPLE))!;
 const tasks=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')[0]);
 for(const at of[1,25])rows.push(list([signed(at),u(30),DISPLAY,list([text(STRATEGY),list(tasks.flatMap(t=>[0,1].map(route=>list([t,u(route),u(route+(at===1?1:3)),at===25&&route===0,u(at),u(30),true]))))]),list([])]));
 rows.push(list([signed(1),u(10),PRIORITY_DISPLAY,list([text(PRIORITY),list(tasks.map(t=>list([t,list([q(1,1)]),true,list([]),true])))]),list([])]));
 for(const at of[10,26]){
  rows.push(...frame.map(a=>list([signed(at),...a.slice(1)])),list([signed(at),...sample.slice(1)]));
  rows.push(list([signed(at),u(10),PRIORITY_DISPLAY,list([text(PRIORITY),list(tasks.map(t=>list([t,list([]),true,list([q(at===10?0:1,1)]),true])))]),list([])]));
 }
 if(mode==='later'){
  const trials=rows.filter(v=>{const a=items(v,'list');return time(a[0])>=7n&&time(a[0])<=9n&&[POSITION_SOURCE,REAPPRAISAL_SOURCE].some(t=>key(t)===key(a[2]));});
  for(const v of trials){const a=[...items(v,'list')];a[0]=signed(time(a[0])+7n);if(key(a[2])===key(POSITION_SOURCE)){const p=[...items(a[3],'list')],annex=[...items(p[3],'list')];annex[1]=false;annex[7]=false;p[3]=list(annex);a[3]=list(p);}rows.push(list(a));}
 }
 const initial=restoreAuthoritativeState(decode(b.d.initialState));
 return {s:changeDefinition({...b.s,registry:enc(list(slots))},'definition/task-workspace',2n,u(6)),d:{...b.d,initialState:enc(new AuthoritativeState(initial.entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:embodiedRecord(454,[q(30,1),signed(0)])}:e)).canonicalValue()),orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32)}};
}
