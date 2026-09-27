import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {socialRecipe,compileSocialModel,compileSocialInputs,OBSERVERS,TARGETS,TARGET,CHARACTERS,TASK,STAGES,eventId,personPath,owner} from '../campaign3/socialModel';
import {createSocialRuntime} from '../campaign3/socialRuntime';
import {decodeSocial as decode} from '../campaign3/socialCodecs';
import {socialInputs,socialScenario} from './socialFixtures';
import {applyStatePatch,AuthoritativeState,statePathValue} from '../substrate/state';
import {displayedClaim} from '../campaign3/socialModel';
it('keeps source silence, truthfulness, inversion and forced displays distinct',()=>{
 for(const truth of [false,true])expect([0n,1n,2n,3n,4n].map(m=>displayedClaim(m,truth))).toEqual([undefined,truth,!truth,true,false]);
});
it('audits actual reads and closed observer projections for foreign/private material',async()=>{
 const m=await compileSocialModel(socialRecipe()),input=await compileSocialInputs(m,enc(m.initial.canonicalValue()),socialInputs(socialScenario()),new Uint8Array(32)),r=createSocialRuntime(m,input);while(await r.settle()){}
 for(const [name] of STAGES){const rows=r.snapshot().trace.map(v=>rec(v,160n)).filter(t=>key(f(t,7n))===key(eventId(name)));expect(rows).toHaveLength(4);for(const row of rows){const reads=items(f(row,11n),'list').map(v=>rec(f(rec(v,147n),2n),140n));expect(reads.map(p=>uint(f(p,1n)))).toEqual(name==='source'?[373n]:name.startsWith('probe')||name.startsWith('update')?[810n]:[]);if(name!=='source'&&reads.length)expect(reads[0]).toEqual(statePathValue(personPath(name.endsWith('-a')?0:1)));}}
 for(const i of [0,1]){const forbidden=new Set([OBSERVERS[1-i],TARGETS[1-i],CHARACTERS[0],CHARACTERS[1],TARGET,TASK].map(key));let checked=0;function walk(v:CanonicalValue){expect(forbidden.has(key(v))).toBe(false);if(typeof v==='boolean')return;if(v.kind==='record'){expect([814n,807n,811n,809n,806n]).toContain(v.schema.typeId);checked++;for(const x of v.fields.values())walk(x);}else if(v.kind==='list'||v.kind==='set')for(const x of v.items)walk(x);}
 walk(decode(r.view(OBSERVERS[i])));expect(checked).toBeGreaterThan(5);const view=rec(decode(r.view(OBSERVERS[i])),814n);for(const o of items(f(view,3n),'list')){expect(f(rec(o,807n),2n)).toEqual(OBSERVERS[i]);expect(f(rec(o,807n),3n)).toEqual(TARGETS[i]);expect(f(rec(o,807n),7n)).toBe(true);}}
},120000);
it('rejects foreign ownership, extra state and invalid input/model domains',async()=>{
 const source=socialRecipe(),m=await compileSocialModel(source),initial=enc(m.initial.canonicalValue());for(const xs of [[{at:0}],[{at:11}],[{at:1},{at:1}],[{at:2},{at:1}],Array.from({length:9},(_,i)=>({at:i+1}))])await expect(compileSocialInputs(m,initial,socialInputs(xs.map(x=>({...x,receipt:1}))),new Uint8Array(32))).rejects.toThrow();await expect(compileSocialModel({...source,content:enc(list([]))})).rejects.toThrow();
 const input=await compileSocialInputs(m,initial,socialInputs([{at:1}]),new Uint8Array(32)),r=createSocialRuntime(m,input);await r.settle();const state=r.snapshot().state,value=state.read(personPath(0)).value!;
 expect(()=>applyStatePatch(state,{operations:[{kind:'set',path:personPath(0),expected:{presence:true,value},newValue:value}]},OBSERVERS[0],m.authority)).toThrow();expect(()=>m.validateState(new AuthoritativeState([...state.entries(),{path:{...personPath(0),rootStateTypeId:999n},value}]))).toThrow();expect(owner).toBeDefined();
});


