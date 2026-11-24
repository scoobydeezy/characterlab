/** M249: original task substitution sources; current shared sensor composition. */
// @ts-expect-error Node-only replay selector.
import {env} from 'node:process';
// @ts-expect-error Node-only immutable receipts.
import {readFileSync} from 'node:fs';
// @ts-expect-error Node-only evidence hash.
import {createHash} from 'node:crypto';
// @ts-expect-error Node-only lossless evidence.
import {deflateSync} from 'node:zlib';
import {expect} from 'vitest';
import {decode,items,key,rec,f,enc,list,text,at,type CanonicalValue} from './assembledSubstitutionBoundaries';
import {set} from '../../substrate/canonicalEncoding';
import {sid} from '../../assembled/skill';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {REWARD_PAIRED_SENSING_RULES,SENSOR_BINDING_RULES,SENSOR_BINDING_REGISTRY} from '../../assembled/model';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import type {createCharacterRun} from '../../assembled/character';
export const replay249=env.CHARACTERLAB_SUBSTITUTION_REPLAY==='M249';
export const replay250=env.CHARACTERLAB_SUBSTITUTION_REPLAY==='M250';
export const groups250={A:['unseenTraining','correctedConcentrated','correctedDiversified','otherCue','restoredA']} as const;
export const groups249={A:['diversified','concentrated','knownFailure','knownAlternative'],B:['deniedInfo','absentInfo','unavailable','noDemand'],C:['withheldLearning','withheldInformation','bothAvailable']} as const;
type Fixture={s:{registry:Uint8Array;rulesVersion:string;registrySchemaVersion:string};d:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array};actions:readonly CanonicalValue[]};
const hash=(b:Uint8Array):string=>createHash('sha256').update(b).digest('hex');
const mappings=new WeakMap<object,unknown>();
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
export function candidate249<T extends Fixture>(b:T,name:string):T {
 if(!replay249&&!replay250)return b;
 expect(b.s.rulesVersion).toBe(REWARD_PAIRED_SENSING_RULES);
 const slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(59);
 const prior='docs/planning/ASSEMBLED_CHARACTER_M'+(['diversified','falseTraining','deniedFeedback','hiddenBlocked','falseSuccess','trueSuccess','failure'].includes(name)?'229':'230')+'_EVIDENCE.json',old=JSON.parse(readFileSync(prior,'utf8'))[name];
 expect(hash(b.s.registry),'original registry '+name).toBe(old.registry);
 expect(hash(b.d.initialState),'original S0 '+name).toBe(old.initial);
 expect(hash(b.d.orderedInputs),'original inputs '+name).toBe(old.inputs);
 const item=sid(1601,'item/m249-parcel'),origin=sid(1602,'place/m249-origin'),destination=sid(1602,'place/m249-destination');
 const declaration=list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([b.actions[0],item,destination])]),list([])]);
 const original=restoreAuthoritativeState(decode(b.d.initialState)),initial=new AuthoritativeState([...original.entries(),{path:itemPath(item),value:origin}]);
 const result={...b,s:{...b.s,rulesVersion:SENSOR_BINDING_RULES,registrySchemaVersion:SENSOR_BINDING_REGISTRY,registry:enc(list([...slots,declaration]))},d:{...b.d,initialState:enc(initial.canonicalValue())}};
 bytes(enc(list(items(decode(result.s.registry),'list').slice(0,59))),b.s.registry);bytes(result.d.orderedInputs,b.d.orderedInputs);bytes(result.d.runSeed,b.d.runSeed);
 expect(initial.entries().length).toBe(original.entries().length+1);for(const e of original.entries())expect(initial.read(e.path)).toEqual(original.read(e.path));
 mappings.set(result,{prior,case:name,registry:old.registry,initial:old.initial,inputs:old.inputs,seed:hash(b.d.runSeed),mapping:'original59 slots, input/seed and all S0 entries; only unbound item0.3 and physical location appended',pass:true});
 return result;
}
export function native249(b:Fixture,run:Awaited<ReturnType<typeof createCharacterRun>>){
 if(!replay249&&!replay250)return {};
 const s=run.snapshot(),pack=(v:Uint8Array)=>({bytes:v.length,hash:hash(v),deflate:deflateSync(v).toString('base64')});
 const trace=items(decode(s.trace),'list').filter(v=>{const t=at(f(rec(f(rec(v,160n),4n),130n),2n));return t>=4n&&t<=11n;});
 return {native:{rules:b.s.rulesVersion,mapping:mappings.get(b),clock:String(s.clock),state:pack(s.state),outputs:pack(s.outputs),trace4to11:pack(enc(list(trace))),save:hash(run.save())}};
}
