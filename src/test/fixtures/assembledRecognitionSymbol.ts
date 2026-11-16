/** M131 e4790c12: voice-positive1, new-track name-negative2, voice-silent3.
 * Same M130 social goals/body10/seed0/importance+urgency1/routes30; probe4.
 * Both know voice; only run-owned name mapping differs. No authored identity cue. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledRecognitionSeed';
import {RECOGNITION_SYMBOL_RULES,RECOGNITION_SYMBOL_REGISTRY} from '../../assembled/model';
import {RECOGNITION_SYMBOL_DOMAIN} from '../../assembled/recognition';
import {symbolMappingValue} from '../../assembled/recognitionSymbols';
import {identitySymbolMappingPath} from '../../semanticBinding/semanticStateAuthority';
import {OBSERVER} from '../../assembled/recognition';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {unsigned as u} from '../../substrate/canonicalEncoding';
export const symbol='name/visitor',alias='name/alias';
export function fixture(known=true,mode:'main'|'hidden'|'denied'='main'){
 const b=prior(true,mode),slots=[...items(decode(b.s.registry),'list')],domain=[...items(slots[21],'list')];
 const other=items(items(domain[1],'list').find(v=>key(items(v,'list')[0])!==key(target))!,'list')[0];
 domain[0]=text(RECOGNITION_SYMBOL_DOMAIN);domain.push(list([text(symbol),text(alias)]));slots[21]=list(domain);
 const s={...b.s,rulesVersion:RECOGNITION_SYMBOL_RULES,registrySchemaVersion:RECOGNITION_SYMBOL_REGISTRY,registry:enc(list(slots))};
 const initial=new AuthoritativeState([...restoreAuthoritativeState(decode(b.d.initialState)).entries(),
 {path:identitySymbolMappingPath(OBSERVER,alias),value:symbolMappingValue(alias,target,0n)},
 ...(known?[{path:identitySymbolMappingPath(OBSERVER,symbol),value:symbolMappingValue(symbol,target,1n)}]:[])]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])!==key(SOCIAL_SOURCE))return v;
 const p=[...items(a[3],'list')],second=key(a[0])===key(signed(2));p[5]=list([list([u(second?2:1),text(second?symbol:'appearance/voice'),true])]);if(mode==='hidden')p[2]=other;a[3]=list(p);return list(a);});
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))},taskA:b.taskA,taskB:b.taskB,known,mode,legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue};
