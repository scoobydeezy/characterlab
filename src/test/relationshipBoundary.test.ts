import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,rational as q,signed,unsigned as u,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {relationshipRecord as r,decodeRelationship as decode} from '../campaign3/relationshipCodecs';
import {receivingRecord as old} from '../campaign3/receivingCodecs';
import {relationshipSummary,appendRelationship} from '../campaign3/relationshipMath';
import {relationshipRecipe,compileRelationshipModel,compileRelationshipInputs,OBSERVERS,CHARACTERS,TARGETS,personPath,historyPath} from '../campaign3/relationshipModel';
import {createRelationshipRuntime} from '../campaign3/relationshipRuntime';
import {relationshipInputs,relationshipScenario} from './relationshipFixtures';
it('excludes other observers and source truth from the closed exported view',async()=>{
 const m=await compileRelationshipModel(relationshipRecipe()),input=await compileRelationshipInputs(m,enc(m.initial.canonicalValue()),relationshipInputs(relationshipScenario()),new Uint8Array(32)),runtime=createRelationshipRuntime(m,input);while(await runtime.settle()){}
 for(const i of [0,1]){const forbidden=new Set([OBSERVERS[1-i],CHARACTERS[1-i],TARGETS[1-i]].map(key));let count=0;function walk(v:CanonicalValue){expect(forbidden.has(key(v))).toBe(false);if(typeof v==='boolean')return;if(v.kind==='record'){expect([843n,844n,160n,103n,104n,861n,842n]).not.toContain(v.schema.typeId);count++;for(const x of v.fields.values())walk(x);}else if(v.kind==='list'||v.kind==='set')for(const x of v.items)walk(x);else if(v.kind==='map')for(const [k,x] of v.entries){walk(k);walk(x);}else if(v.kind==='typedIdentifier')walk(v.payload);}
 walk(decode(runtime.view(OBSERVERS[i])));expect(count).toBeGreaterThan(40);const v=rec(decode(runtime.view(OBSERVERS[i])),860n);for(const o of items(f(v,3n),'list'))expect(f(rec(o,845n),5n)).toBe(true);}
},180000);
it('distinguishes participant history, witnessed events, denied evidence and negative claims',async()=>{
 for(const [participants,visible] of [[0,true],[1,false],[1,true]] as const){const m=await compileRelationshipModel(relationshipRecipe()),input=await compileRelationshipInputs(m,enc(m.initial.canonicalValue()),relationshipInputs([{at:1,kind:1,participants,a:visible,claim:2}]),new Uint8Array(32)),runtime=createRelationshipRuntime(m,input);await runtime.settle();expect(runtime.snapshot().state.read(personPath(0)).presence).toBe(visible);expect(items(f(rec(runtime.snapshot().state.read(historyPath(0)).value!,847n),1n),'list')).toHaveLength(participants===1&&visible?1:0);if(visible)expect(f(rec(runtime.snapshot().state.read(personPath(0)).value!,849n),1n)).toBe(false);}
});
it('preserves distinct rupture laws and closed inherited field grammar',()=>{
 const journal=r(847,[list([2,1].map((kind,i)=>r(846,[typedIdentifier(1156,u(i)),signed(i+1),u(kind)])))]);expect(f(rec(relationshipSummary({candidate:1,law:1,reverse:false},journal),851n),2n)).toBe(true);expect(f(rec(relationshipSummary({candidate:1,law:2,reverse:false},journal),851n),2n)).toBe(false);const observation=r(845,[typedIdentifier(1156,u(0)),OBSERVERS[0],TARGETS[0],signed(1),true,true,u(2)]);expect(()=>appendRelationship(journal,observation)).toThrow('DUPLICATE');const inherited=rec(old(439,[q(1,4),u(3)]),439n),fields=new Map(inherited.fields);fields.set(2n,r(851,[u(0),false]));expect(()=>decode(enc({...inherited,fields}))).toThrow();
});
it('keeps simultaneous participant histories separate and rejects their conflation transactionally',async()=>{
 for(const candidate of [1,2,4]){const m=await compileRelationshipModel(relationshipRecipe({candidate})),input=await compileRelationshipInputs(m,enc(m.initial.canonicalValue()),relationshipInputs([{at:1,kind:1,participants:3}]),new Uint8Array(32)),runtime=createRelationshipRuntime(m,input);if(candidate===4){await expect(runtime.settle()).rejects.toThrow();expect(runtime.snapshot().status).toBe('Failed');expect(enc(runtime.snapshot().state.canonicalValue())).toEqual(enc(m.initial.canonicalValue()));}else{await runtime.settle();for(const i of [0,1])expect(items(f(rec(runtime.snapshot().state.read(historyPath(i)).value!,847n),1n),'list')).toHaveLength(1);}}
});

