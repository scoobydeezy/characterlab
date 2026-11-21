import {fatigueFrame} from './assembledFatigue';
import {decodeCognitive as decode} from '../../assembled/codecs';
/** M209: M200 trained/free scene. Nonsocial tasks, reserve10/rate0, A-only,
 * skill practice12; no learned S0. Sleep recovery14 occurs AFTER that choice.
 * Current physiological channels explicit/live; retained fatigue absent by default. */
import {competence} from './assembledAgencyCurrent';
import {items,key,enc,list,text,u,rec,f,uint,outputs,bytes,exact} from './assembledAgencyVersionCarry';
import {signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {SLEEP_RULES,SLEEP_REGISTRY} from '../../assembled/model';
import {SLEEP,SLEEP_SOURCE,sleepPath,sleepValue} from '../../assembled/sleepControl';
import {CONTROL_SOURCE} from '../../assembled/control';
import {controlFrame} from './assembledControl';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {changeDefinition} from './assembledCharacter';
import {C} from './campaign2Cognitive';
import {cachedMemory} from './assembledMemoryFinal';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
export {decode,items,key,enc,list,text,u,signed,C,rec,f,uint,outputs,bytes,exact};
export type {CanonicalValue};
let prior:ReturnType<typeof competence>|undefined;
const prepared=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export type Mode='Rested'|'Deprived'|'Recovered';
export function fixture(mode:Mode='Recovered',o:{denied?:boolean;bias?:number;enabled?:boolean;support?:boolean;fatigue?:boolean}={}){
 const b=structuredClone(prior??(prior=competence(true,false))),slots=[...items(decode(b.s.registry),'list')];
 slots.push(list([text(SLEEP),o.enabled??true,u(100),u(1000),u(0),u(800),u(10)]));
 const s=changeDefinition({...b.s,rulesVersion:SLEEP_RULES,registrySchemaVersion:SLEEP_REGISTRY,registry:enc(list(slots))},'definition/task-workspace',2n,u(6));
 const initial=restoreAuthoritativeState(decode(b.d.initialState)),rows=items(decode(b.d.orderedInputs),'list').filter(v=>key(items(v,'list')[2])!==key(CONTROL_SOURCE));
 rows.push(controlFrame(13,1),controlFrame(14,0,o.support!==false,false,o.support!==false),controlFrame(16,0,o.support!==false,false,o.support!==false));
 for(let at=1;at<=16;at++)rows.push(list([signed(at),u(10),SLEEP_SOURCE,list([text(SLEEP),at<=8||mode==='Rested'||mode==='Recovered'&&at>=14,list([!o.denied,true,true,true]),list([signed(o.bias??0),signed(0),signed(0),signed(0)])]),list([])]));
 if(o.fatigue)rows.push(fatigueFrame(13,2));
 return {...b,s,d:{...b.d,initialState:enc(new AuthoritativeState([...initial.entries(),{path:sleepPath(C),value:sleepValue(0n,0)}]).canonicalValue()),orderedInputs:enc(list(rows))}};
}
export async function start(b=fixture()){const k=JSON.stringify(b.s);let m=prepared.get(k);if(!m){m=prepareCharacterModel(b.s);prepared.set(k,m);}return {b,run:cachedMemory(await createCharacterRun(await m,b.d))};}
export type Run=Awaited<ReturnType<typeof start>>['run'];
export const state=(r:Run)=>restoreAuthoritativeState(decode(r.snapshot().state));
export const labels=(r:Run,tag:string)=>items(decode(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='list'&&v.items.length&&key(v.items[0])===key(text(tag))).map(v=>items(v,'list'));
export const at=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('time');return v.value;};
export async function through(r:Run,t:bigint){for(let n=0;r.snapshot().clock<t;n++){if(n>64||!await r.settleNextInstant())throw Error('missing instant '+t);}if(r.snapshot().clock!==t)throw Error('wrong instant');}
