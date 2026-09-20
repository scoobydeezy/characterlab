/** Separate bounded retained-context cohort. Four Before/Motion/Motion/After
 * trials use the accepted source contracts; this is fixture data, not a new
 * action law. The original sparse/dense comparator calendar is unchanged. */
import {list,set,signed,unsigned as u,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent as referent} from '../substrate/referentOrigin';
import {dataRecord as rec,dataField as f,dataKey as key} from '../campaign2/canonicalData';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalContentId as c,generalId as id} from './generalBindingProfile';
export const generalCreditCalendar=Object.freeze({starts:[3n,16n,20n,33n] as const,cue:37n,significance:38n,retention:39n,bodyPressure:40n,eventPressure:41n,replenishments:[{at:6n,amount:13},{at:19n,amount:4},{at:23n,amount:13}] as const});
export function buildGeneralCreditSourceEntries(base:readonly CanonicalValue[]){
 const who=generalSubject(),replaced=new Set(['scene','panel','formation-policy','cue-policy','observation-originals'].map(n=>key(d(n))));
 const entries=base.filter(v=>!replaced.has(key(f(rec(v,171n),1n)))),template=rec(base[0],171n);
 const add=(name:string,value:CanonicalValue)=>{const fields=new Map(template.fields);fields.set(1n,d(name));fields.set(4n,value);entries.push(r(171,fields));};
 const trials=Array.from({length:16},(_,i)=>({at:generalCreditCalendar.starts[Math.floor(i/4)]+BigInt(i%4),trial:Math.floor(i/4),position:i%4}));
 const motions=trials.filter(t=>t.position===1||t.position===2);
 const frame=(at:bigint,x:number)=>r(659,[signed(at),list([r(658,[referent(c('scene-a')),id(1003,'event-role/actor'),r(608,[u(x),u(0)]),u(0),true,true,u(1)])])]);
 add('scene',r(660,[d('event-schema'),list([...motions.map(t=>frame(t.at,t.position===2&&t.trial%2===0?1:0)),frame(generalCreditCalendar.cue,0),frame(generalCreditCalendar.eventPressure,0)])]));
 add('panel',r(662,[list(trials.map(t=>r(661,[signed(t.at),u(t.trial),u([1,2,2,3][t.position]),true,true])))]));
 add('credit-body-policy',r(698,new Map([[1n,d('body-selection')]])));
 add('credit-motion-policy',r(698,new Map([[2n,d('visual-selection')],[3n,d('spatial')],[4n,d('encoding')]])));
 add('credit-assessment-policy',r(698,new Map([[1n,d('body-selection')],[6n,d('goal-baseline-recall')],[8n,d('goal-qualification')]])));
 add('cue-policy',r(698,new Map([[5n,d('body-recall')],[7n,d('event-recall')]])));
 const original=(at:bigint,body:boolean,panel:boolean,visual:boolean,use:CanonicalValue,consequence=false)=>r(665,[signed(at),d('source-profile'),r(655,new Map<bigint,CanonicalValue>([[1n,who.observer],...(body?[[2n,r(650,[who.observer,set([id(1005,'channel/A')])])] as [bigint,CanonicalValue]]:[]),[3n,panel],[4n,visual]])),use,u(consequence?2:1)]);
 add('observation-originals',list([...trials.map(t=>{
  const body=t.position===0||t.position===3,assessment=t.at===6n;
  return original(t.at,body,true,!body,r(664,new Map<bigint,CanonicalValue>([[1n,body],[2n,!body],[3n,false],[4n,false],...(assessment?[[5n,d('goal')] as [bigint,CanonicalValue]]:[]),[6n,d(assessment?'credit-assessment-policy':body?'credit-body-policy':'credit-motion-policy')]])),t.position===3&&t.trial%2===0);
 }),original(generalCreditCalendar.cue,true,false,true,r(664,new Map<bigint,CanonicalValue>([[1n,false],[2n,false],[3n,true],[4n,true],[6n,d('cue-policy')]]))),original(generalCreditCalendar.bodyPressure,true,false,false,r(664,new Map<bigint,CanonicalValue>([[1n,true],[2n,false],[3n,false],[4n,false],[6n,d('credit-body-policy')]]))),original(generalCreditCalendar.eventPressure,false,false,true,r(664,new Map<bigint,CanonicalValue>([[1n,false],[2n,true],[3n,false],[4n,false],[6n,d('credit-motion-policy')]])))]));
 return entries;
}
