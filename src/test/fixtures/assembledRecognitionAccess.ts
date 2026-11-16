/** M132 b457c8bb: body10/seed0/goals+urgency1, two social tasks/third unknown.
 * Voice-positive1; same-track negative report2; voice-silent3; choice4/recall21. */
import {fixture as prior,symbol,alias,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledRecognitionSymbol';
import {RECOGNITION_ACCESS_RULES,RECOGNITION_ACCESS_REGISTRY} from '../../assembled/model';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {symbolMappingValue} from '../../assembled/recognitionSymbols';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export type Mode='main'|'hidden'|'denied'|'none'|'replacement';
export function fixture(visible=true,mode:Mode='main'){
 const b=prior(true,mode==='hidden'?'hidden':mode==='denied'?'denied':'main'),slots=items(decode(b.s.registry),'list');
 const catalog=items(items(slots[21],'list')[1],'list').map(v=>items(v,'list')[0]),people=items(items(slots[19],'list')[1],'list').map(v=>items(v,'list')[0]);
 const other=people.find(p=>key(p)!==key(target)&&catalog.some(c=>key(c)===key(p)));if(!other)throw Error('M132 other admitted person');
 const s={...b.s,rulesVersion:RECOGNITION_ACCESS_RULES,registrySchemaVersion:RECOGNITION_ACCESS_REGISTRY};
 const initial=new AuthoritativeState(restoreAuthoritativeState(decode(b.d.initialState)).entries().map(e=>{
 if(mode!=='replacement'||e.path.rootStateTypeId!==243n||e.path.fieldId!==2n||key(f(rec(e.value,229n),3n))!==key(f(rec(symbolMappingValue(symbol,target,1n),229n),3n)))return e;
 return {...e,value:symbolMappingValue(symbol,other,1n)};
 }));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(SOCIAL_SOURCE))return v;
 const p=[...items(a[3],'list')],second=key(a[0])===key(signed(2));p[3]=key(a[0])!==key(signed(1));
 p[5]=list(second?[list([u(2),text(symbol),true,mode!=='none']),list([u(1),text('appearance/voice'),mode==='hidden'&&!visible,visible&&mode!=='none'])]:[list([u(1),text('appearance/voice'),true,true])]);
 a[3]=list(p);return list(a);});
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,visible,mode,other,legacy:b};
}
export {symbol,alias,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
