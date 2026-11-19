/** M180: real absent adoption and withheld current After receipt; no authored belief. */
import {fixture as prior} from './assembledRegulatoryStress';
import {decode,items,key,enc,list,text,signed,u,q,type CanonicalValue} from './assembledFamiliarity';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {GOAL_ABSENCE_RULES,GOAL_ABSENCE_REGISTRY} from '../../assembled/model';
import {POSITION_SOURCE} from '../../assembled/positionPerception';
import {PRIORITY_DISPLAY,PRIORITY_ADOPTION} from '../../assembled/priority';
export type Mode='risk'|'safe'|'noGoal'|'noReceipt'|'denied'|'noGoalNoReceipt'|'laterGoal';
export function fixture(mode:Mode='risk',legacy=false){
 const b=prior(mode==='safe'?'safe':mode==='denied'?'denied':'risk'),slots=items(decode(b.s.registry),'list'),task=items(slots[28],'list')[4];
 const absent=['noGoal','noGoalNoReceipt','laterGoal'].includes(mode),missing=['noReceipt','noGoalNoReceipt'].includes(mode);
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return !(missing&&key(a[0])===key(signed(9))&&key(a[2])===key(POSITION_SOURCE));}).map(v=>{
  const a=[...items(v,'list')];if(!absent||key(a[0])!==key(signed(1))||key(a[2])!==key(PRIORITY_DISPLAY))return v;
  const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(task))r[1]=list([]);return list(r);}))]);return list(a);
 });
 const initial=restoreAuthoritativeState(decode(b.d.initialState));
 const retained=initial.entries().filter(e=>!(absent&&e.path.rootStateTypeId===373n&&[1n,2n].includes(e.path.fieldId)&&e.path.selectors.length===1&&e.path.selectors[0].kind==='mapKey'&&key(e.path.selectors[0].key)===key(task)));
 if(mode==='laterGoal'){
  const instruction=initial.entries().find(e=>e.path.rootStateTypeId===373n&&e.path.fieldId===2n&&e.path.selectors[0].kind==='mapKey'&&key(e.path.selectors[0].key)===key(task))!.value;
  // Instruction390 stores the governed instruction ID in its first field.
  if(typeof instruction==='boolean'||instruction.kind!=='record')throw Error('M180 initial instruction');
  const instructionId=instruction.fields.get(1n)!;
  rows.push(list([signed(12),u(10),PRIORITY_DISPLAY,list([text(PRIORITY_ADOPTION),list([list([task,list([q(1,1)]),true,list([]),true,list([instructionId])])])]),list([])]));
 }
 return {s:legacy?b.s:{...b.s,rulesVersion:GOAL_ABSENCE_RULES,registrySchemaVersion:GOAL_ABSENCE_REGISTRY},d:{...b.d,initialState:enc(new AuthoritativeState(retained).canonicalValue()),orderedInputs:enc(list(rows))}};
}
export const threatTask=(b:ReturnType<typeof fixture>):CanonicalValue=>items(items(decode(b.s.registry),'list')[28],'list')[4];
