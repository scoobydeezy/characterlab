import {list,text,signed,unsigned,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {PROCEDURES_RULES,PROCEDURES_REGISTRY} from '../../assembled/model';
import {PROCEDURES,SKILL,PRACTICE_SETTING,sid} from '../../assembled/skill';
import {DISPLAY,STRATEGY,compileStrategy} from '../../assembled/strategy';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../../assembled/performance';
import {learnedSource,learnedData,decode,items,key,enc} from './assembledLearnedDisclosure';
export const A=sid(1027,'definition/protocol-contact-one'),B=sid(1027,'definition/protocol-contact-two');
export const PA=sid(1027,'definition/procedure/a'),PB=sid(1027,'definition/procedure/b'),PC=sid(1027,'definition/procedure/c');
export function procedureSource(shared=false){const s=learnedSource(),slots=[...items(decode(s.registry),'list')],actions=items(items(slots[10],'list')[2],'set').map(v=>items(v,'list')[0]);slots[11]=list([text(PROCEDURES),list(actions.map(action=>list([action,shared?PA:key(action)===key(A)?PA:key(action)===key(B)?PB:PC])))]);return {...s,rulesVersion:PROCEDURES_RULES,registrySchemaVersion:PROCEDURES_REGISTRY,registry:enc(list(slots))};}
export type Options={practice?:boolean;permitted?:boolean;visible?:boolean;mode?:number;impairment5?:CanonicalValue};
export function procedureData(trainA=true,o:Options={}){
 const s=procedureSource(),slots=items(decode(s.registry),'list'),routes=compileStrategy(slots[12],items(slots[0],'set').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n),decode(s.content)),d=learnedData(0,[],[]),rows=items(decode(d.orderedInputs),'list').filter(v=>![DISPLAY,PRACTICE_SETTING,PERFORMANCE_SETTING].some(e=>key(e)===key(items(v,'list')[2])));
 for(const [i,at]of [1,4,6].entries()){const action=i===0?(trainA?A:B):i===1?B:A;rows.push(list([signed(at),unsigned(30),DISPLAY,list([text(STRATEGY),list(routes.flatMap(r=>r.plans.map((p,j)=>list([r.task,unsigned(j),unsigned(i*2+j+1),key(p.actionId)===key(action),unsigned(at),unsigned(8),true]))))]),list([])]));}
 for(const at of [3,5,7]){
  rows.push(list([signed(at),unsigned(30),PRACTICE_SETTING,list([text(SKILL),unsigned(at===3?0:4),at===5?(o.impairment5??q(0,1)):q(0,1),q(1,2),at===3?o.permitted!==false:true,at===3&&o.practice!==false]),list([])]));
  rows.push(list([signed(at),unsigned(30),PERFORMANCE_SETTING,list([text(PERFORMANCE),list(routes.map(r=>list([r.task,o.visible!==false,unsigned(o.mode??0)])))]),list([])]));
 }
 return {...d,orderedInputs:enc(list(rows))};
}
export {decode,items,key,enc};
