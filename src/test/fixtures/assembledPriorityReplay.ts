/** M248: original M222 psychology and stimuli on the shared0.155 composition. */
// @ts-expect-error Node-only replay selector.
import {env} from 'node:process';
// @ts-expect-error Node-only lossless evidence.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
// @ts-expect-error Node-only evidence hashes.
import {createHash} from 'node:crypto';
// @ts-expect-error Node-only lossless evidence compression.
import {deflateSync} from 'node:zlib';
import {expect} from 'vitest';
import {decode,items,key,rec,f,enc,list,text,type CanonicalValue} from './assembledNeed';
import {set} from '../../substrate/canonicalEncoding';
import {sid} from '../../assembled/skill';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {NEED_RULES,SENSOR_BINDING_RULES,SENSOR_BINDING_REGISTRY} from '../../assembled/model';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import type {createCharacterRun} from '../../assembled/character';
export const replay248=env.CHARACTERLAB_PRIORITY_REPLAY==='M248';
export const hash248=(b:Uint8Array):string=>createHash('sha256').update(b).digest('hex');
type Fixture={s:{registry:Uint8Array;rulesVersion:string;registrySchemaVersion:string};d:{initialState:Uint8Array;orderedInputs:Uint8Array;runSeed:Uint8Array}};
type Run=Awaited<ReturnType<typeof createCharacterRun>>;
const mappings=new WeakMap<object,unknown>();
const bytes=(a:Uint8Array,b:Uint8Array)=>expect(a.length===b.length&&a.every((v,i)=>v===b[i])).toBe(true);
export function candidate248<T extends Fixture>(b:T):T {
 if(!replay248)return b;
 expect(b.s.rulesVersion).toBe(NEED_RULES);
 const slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(59);
 const route=items(items(items(slots[12],'list')[1],'list')[0],'list');
 const definition=items(slots[0],'set').find(v=>key(f(rec(v,171n),1n))===key(route[1]))!;
 const action=f(rec(f(rec(definition,171n),4n),389n),1n);
 const item=sid(1601,'item/m248-parcel'),origin=sid(1602,'place/m248-origin'),destination=sid(1602,'place/m248-destination');
 const declaration=list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([action,item,destination])]),list([])]);
 const original=restoreAuthoritativeState(decode(b.d.initialState));
 const initial=new AuthoritativeState([...original.entries(),{path:itemPath(item),value:origin}]);
 const result={...b,s:{...b.s,rulesVersion:SENSOR_BINDING_RULES,registrySchemaVersion:SENSOR_BINDING_REGISTRY,registry:enc(list([...slots,declaration]))},d:{...b.d,initialState:enc(initial.canonicalValue())}};
 bytes(enc(list(items(decode(result.s.registry),'list').slice(0,59))),b.s.registry);
 bytes(result.d.orderedInputs,b.d.orderedInputs);bytes(result.d.runSeed,b.d.runSeed);
 expect(initial.entries().length).toBe(original.entries().length+1);
 for(const e of original.entries())expect(initial.read(e.path)).toEqual(original.read(e.path));
 mappings.set(result,{prior:'M222/0.145',registry:hash248(b.s.registry),initial:hash248(b.d.initialState),input:hash248(b.d.orderedInputs),seed:hash248(b.d.runSeed),mapping:'same59 slots/task definitions/input/seed/all initial entries; only unbound item0.3 and one physical location appended',pass:true});
 return result;
}
export function consumed248(c:{d:CanonicalValue;os:readonly CanonicalValue[]}){
 if(!replay248)return;
 expect(c.os.some(o=>typeof o!=='boolean'&&o.kind==='record'&&o.schema.typeId===433n&&key(f(rec(f(rec(f(rec(f(o,2n),432n),2n),431n),2n),425n),2n))===key(c.d)),'M248 actual decision -> intent -> attempt -> execution').toBe(true);
}
export function evidence248(name:string,b:Fixture,run:Run,summary:unknown){
 if(!replay248)return;
 const file='docs/planning/ASSEMBLED_CHARACTER_M248_EVIDENCE.json',data=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
 expect(data[name],'immutable native evidence '+name).toBeUndefined();
 const pack=(v:Uint8Array)=>({bytes:v.length,sha256:hash248(v),deflate:deflateSync(v).toString('base64')}),s=run.snapshot();
 data[name]={summary,mapping:mappings.get(b),rules:b.s.rulesVersion,registry:hash248(b.s.registry),initial:hash248(b.d.initialState),input:hash248(b.d.orderedInputs),seed:hash248(b.d.runSeed),clock:String(s.clock),state:pack(s.state),outputs:pack(s.outputs),trace:pack(s.trace),save:hash248(run.save())};
 writeFileSync(file,JSON.stringify(data,(_,v)=>typeof v==='bigint'?String(v):v,2)+'\n');
}
