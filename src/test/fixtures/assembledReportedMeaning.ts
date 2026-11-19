/** M171 current reports use actual perception; historical significance stays acquired. */
import {fixture170} from './assembledMemoryKinds';
import {items,key,enc,list,decode} from './assembledDefiningControls';
import {u,signed,q,text,type CanonicalValue} from './assembledDefining';
import {REPORTED_MEANING_RULES,REPORTED_MEANING_REGISTRY} from '../../assembled/model';
import {REPORTED_MEANING,REPORT_SOURCE} from '../../assembled/reportedMeaning';
import {BODY_SAMPLE} from '../../assembled/body';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
export interface ReportOptions {goal?:'High'|'Low'|'Wide'|'Absent';report?:'original'|'contrary'|'missing';permitted?:boolean;worldAfter?:20|30;capacity?:0|1|8;horizon?:50|400|4000;concurrentBody?:boolean}
export function fixture171(o:ReportOptions={}){
 const b=fixture170({eventCapacity:o.capacity??1,finalSlots:1,horizon:o.horizon??50}),slots=[...items(decode(b.s.registry),'list')],goal=[...items(slots[32],'list')];
 const ranges={High:[q(30,1),q(31,1)],Low:[q(20,1),q(21,1)],Wide:[q(0,1),q(100,1)],Absent:[]};goal[1]=list(ranges[o.goal??'Low']);slots[32]=list(goal);
 slots.push(list([text(REPORTED_MEANING),signed(17),signed(23),text('stand-in-reporter')]));
 const report=o.report??'original',bounds=report==='missing'?[]:report==='original'?[q(30,1),q(31,1)]:[q(20,1),q(21,1)];
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return !([22n,23n].includes((a[0] as {value:bigint}).value)&&key(a[2])===key(POSITION_SOURCE));});
 if(o.concurrentBody){const sample=rows.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!;rows.push(list([signed(22),...items(sample,'list').slice(1)]));}
 rows.push(list([signed(23),u(10),REPORT_SOURCE,list([text(REPORTED_MEANING),text('stand-in-reporter'),list(bounds),true,o.permitted??true,q(o.worldAfter??30,1)]),list([])]));
 return {...b,s:{...b.s,rulesVersion:REPORTED_MEANING_RULES,registrySchemaVersion:REPORTED_MEANING_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
