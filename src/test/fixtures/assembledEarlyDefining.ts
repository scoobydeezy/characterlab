/** M172 original early focal event, through ordinary shared perception. */
import {fixture171,type ReportOptions} from './assembledReportedMeaning';
import {items,key,enc,list,decode} from './assembledDefiningControls';
import {u,signed,q,text,type CanonicalValue} from './assembledDefining';
import {ATTRIBUTION_USE_RULES,ATTRIBUTION_USE_REGISTRY} from '../../assembled/model';
import {BODY_DELIVERY} from '../../assembled/body';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {sid} from '../../assembled/skill';
import {REPORT_SOURCE} from '../../assembled/reportedMeaning';
export type EarlyOptions=ReportOptions&{law?:'SignificanceFirst'|'SharedProtection'|'UseOnly'|'AgeOnly';rehearsals?:0|3;cue?:'matching'|'absent'};
let cached:ReturnType<typeof fixture171>|undefined;
export function fixture172(o:EarlyOptions={}){
 const b=structuredClone(cached??(cached=fixture171())),slots=[...items(decode(b.s.registry),'list')],ret=[...items(slots[8],'list')],goal=[...items(slots[32],'list')],spatial=[...items(slots[37],'list')],horizon=o.horizon??50;
 const ranges={High:[q(30,1),q(31,1)],Low:[q(20,1),q(21,1)],Wide:[q(0,1),q(100,1)],Absent:[]};
 ret[3]=u(17);ret[4]=list([list([signed(37),ret[1],u(8),u(o.capacity??1)])]);slots[8]=list(ret);
 slots[31]=list([items(slots[31],'list')[0],text(o.law??'SignificanceFirst')]);
 goal[1]=list(ranges[o.goal??'High']);goal[2]=u(21);slots[32]=list(goal);spatial[2]=u(39);slots[37]=list(spatial);
 const rehearse=items(slots[52],'list');slots[52]=list([rehearse[0],signed(21),list((o.rehearsals===3?[34,35,36]:[]).map(signed)),list([signed(horizon),u(1),o.cue!=='absent'])]);
 const report=items(slots[53],'list');slots[53]=list([report[0],signed(21),signed(38),report[3]]);
 const originals=items(decode(b.d.orderedInputs),'list'),delivery=items(originals.find(v=>key(items(v,'list')[2])===key(BODY_DELIVERY))!,'list'),body=items(delivery[3],'list'),rows:CanonicalValue[]=[];
 const context=(a:readonly CanonicalValue[])=>key(a[1])===key(u(30))||key(a[2])===key(sid(1001,'event/deliberation-opportunity'));
 const frame=originals.filter(v=>key(items(v,'list')[0])===key(signed(17))&&context(items(v,'list')));
 for(const v of originals){
  const a=[...items(v,'list')],at=Number((a[0] as {value:bigint}).value);
  if(key(a[2])===key(BODY_DELIVERY))continue;
  if(context(a)&&(at===17||at===50))continue;
  if(key(a[2])===key(POSITION_SOURCE)&&at<=16){const p=[...items(a[3],'list')],pos=[...items(p[1],'list')];if(pos.length){pos[0]=u((at===3||at===11)?1:0);p[1]=list(pos);a[3]=list(p);}}
  if(key(a[2])===key(REPORT_SOURCE)){a[0]=signed(38);const p=[...items(a[3],'list')];p[2]=list(o.report==='missing'?[]:o.report==='contrary'?[q(20,1),q(21,1)]:[q(30,1),q(31,1)]);p[4]=o.permitted??true;p[5]=q(o.worldAfter??30,1);a[3]=list(p);}
  rows.push(list(a));
 }
 for(const [at,amount] of [[3,40],[8,30],[11,40]])rows.push(list([signed(at),...delivery.slice(1,3),list([body[0],q(amount,1),false]),delivery[4]]));
 // Opportunity is identical with/without rehearsal; it does not author a recalled cue.
 for(const at of [21,34,35,36,horizon])rows.push(...frame.map(v=>list([signed(at),...items(v,'list').slice(1)])));
 return {...b,s:{...b.s,rulesVersion:ATTRIBUTION_USE_RULES,registrySchemaVersion:ATTRIBUTION_USE_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
