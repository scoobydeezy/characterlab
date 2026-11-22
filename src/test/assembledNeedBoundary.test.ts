import {it,expect} from 'vitest';
import {fixture,start,through,decode,items,key,enc,list,text,u,signed,C,rec,f,q,type CanonicalValue} from './fixtures/assembledNeed';
import {capture} from './assembledNeed.test';
import {compileNeedResponses,NEED_RESPONSES,NEED,NEED_CRITERION,NEED_MOTIVE} from '../assembled/need';
import {cloneCognitive,cognitiveRecord as r,validateCharacterRecordRoles} from '../assembled/codecs';
import {prepareCharacterModel,createCharacterRun} from '../assembled/character';
import {ACTION_DOMAIN_RULES,ACTION_DOMAIN_REGISTRY} from '../assembled/model';
import {protectionMeanings} from '../assembled/protectiveIdentity';
import {receivingCoverageComponent} from '../campaign3/receivingTransforms';
import {receivingRecord as rr,receivingSchema,decodeReceiving} from '../campaign3/receivingCodecs';
import {record,set,map,typedIdentifier} from '../substrate/canonicalEncoding';
import {readQ,bounded} from '../campaign2/cognitiveMath';
import {sid} from '../assembled/skill';
import {BODY_SAMPLE} from '../assembled/body';
const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{const a=v as Extract<CanonicalValue,{kind:'record'}>;return record(a.schema,new Map([...a.fields].map(([k,y])=>[k,k===n?x:y])));};
function prior(v:CanonicalValue):CanonicalValue{
 if(typeof v==='boolean')return v;
 if(v.kind==='record'){const fields=[...v.fields].map(([n,x])=>[n,prior(x)] as const);return v.schema.typeId===403n&&v.schema.schemaVersion===4n?r(403,fields.slice(0,6).map(([,v])=>v),3):record(v.schema,new Map(fields));}
 if(v.kind==='list')return list(v.items.map(prior));if(v.kind==='set')return set(v.items.map(prior));if(v.kind==='map')return map(v.entries.map(([a,b])=>[prior(a),prior(b)]));if(v.kind==='typedIdentifier')return typedIdentifier(v.namespaceId,prior(v.payload));return v;
}
it('need221 boundary admitted Need agrees with the original receiving kernel',async()=>{
 const x=await start();await through(x.run);const p=capture(x.run),sample=rec(p.report[4],461n);
 for(const d of p.need){const signal=rec(items(d,'list')[2],402n),source=rec(f(signal,1n),401n),candidate=f(source,1n),criterion=rr(493,[f(rec(candidate,395n),1n),NEED_CRITERION]);
  const ground=decodeReceiving(enc(record(receivingSchema(494n),new Map([[1n,u(2)],[3n,criterion]]))));
  const original=rr(496,[rr(495,[candidate,ground,u(1),sid(1027,'definition/task-instruction-one')]),f(signal,2n),f(signal,3n)]),computed=receivingCoverageComponent([original]);
  const nucleus=p.ns.find(v=>key(f(rec(f(rec(v,407n),1n),404n),1n))===key(candidate))!;expect(computed.net).toEqual(readQ(f(rec(f(rec(nucleus,407n),2n),406n),1n)));expect(computed.net).toEqual(bounded(readQ(f(signal,2n))));
  const basis=f(rec(f(signal,3n),400n),1n);expect(typeof basis!=='boolean'&&basis.kind==='map'&&basis.entries.length).toBe(1);if(typeof basis!=='boolean'&&basis.kind==='map')expect(f(rec(f(rec(basis.entries[0][0],399n),2n),237n),2n)).toEqual(f(sample,1n));
 }
 const tasks=items(f(p.raw,6n),'list');expect(tasks).toHaveLength(0);expect([...protectionMeanings(p.raw).values()].every(v=>v.numerator===0n)).toBe(true);
 console.info('M221 KERNEL PASS captured selected observation/pressure -> original coveredRole and native Base, no protective credit');
},590000);
it('need221 boundary no-response successor preserves existing semantic state and receiving',async()=>{
 const a=await start({goals:true,responses:0}),b=await start({goals:true,responses:0,legacy:true});await through(a.run);await through(b.run);
 const x=capture(a.run),old=items(decode(b.run.snapshot().outputs),'list'),without=(v:CanonicalValue)=>!(typeof v!=='boolean'&&v.kind==='list'&&key(v.items[0])===key(text(NEED)));
 expect(x.os.filter(without).map(prior)).toEqual(old);expect(prior(decode(a.run.snapshot().state))).toEqual(decode(b.run.snapshot().state));
 const projected=(bytes:Uint8Array)=>items(decode(bytes),'list').filter(v=>key(f(rec(v,160n),5n))!==key(sid(1036,'seam/assembled-need-receiving'))).map(v=>list([...rec(v,160n).fields].filter(([n])=>![2n,3n,6n,12n].includes(n)).map(([n,v])=>list([u(n),prior(v)]))));
 expect(projected(a.run.snapshot().trace)).toEqual(projected(b.run.snapshot().trace));
 console.info('M221 PRESERVATION PASS exact semantic state/outputs and all trace fields except declared identity/version/input-projection extension; no responses');
},590000);
it('need221 boundary closed sources versions and ordinary ingress',async()=>{
 const x=await start();await through(x.run);const p=capture(x.run),d=items(p.need[0],'list'),signal=rec(d[2],402n),source=rec(f(signal,1n),401n),plans=[{instructionId:sid(1027,'definition/task-instruction-one'),actionId:f(rec(f(source,1n),395n),2n)}];
 expect(()=>compileNeedResponses(list([text(NEED_RESPONSES),list([plans[0].instructionId,plans[0].instructionId])]),plans)).toThrow('duplicate');
 expect(()=>compileNeedResponses(list([text(NEED_RESPONSES),list([sid(1027,'definition/foreign')])]),plans)).toThrow('unknown');
 expect(()=>cloneCognitive(replace(p.raw,7n,list([p.need[0],p.need[0]])))).toThrow('identity');
 expect(()=>cloneCognitive(replace(source,3n,u(2)))).toThrow('Need');expect(()=>cloneCognitive(replace(source,2n,sid(1027,'foreign')))).toThrow('Need');
 expect(()=>cloneCognitive(replace(p.raw,7n,list([list([d[0],sid(1040,'Commitment'),signal])])))).toThrow('Need');
 expect(()=>validateCharacterRecordRoles({recordRole:()=>undefined,validateRole:()=>{}},enc(p.raw),true,true,true,true,true,true,true,true,false)).toThrow('Need requires successor');
 await expect(prepareCharacterModel({...x.b.s,rulesVersion:ACTION_DOMAIN_RULES,registrySchemaVersion:ACTION_DOMAIN_REGISTRY})).rejects.toThrow('slot count');
 const rows=items(decode(x.b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(BODY_SAMPLE))a[3]=p.raw;return list(a);});await expect(createCharacterRun(x.m,{...x.b.d,orderedInputs:enc(list(rows))})).rejects.toThrow();
 console.info('M221 ADMISSION PASS fixed source identities, duplicate/foreign responses, old bundle, forged original input');
},590000);

it('need221 boundary Need options pass through common inhibition',async()=>{
 const x=await start({inhibit:true});await through(x.run);const p=capture(x.run);expect(p.report[2]).toEqual(text('Positive'));expect(items(p.report[7],'list')).toHaveLength(2);
 expect(p.need,'the inhibited response cannot regain a raw Need source').toHaveLength(1);const source=rec(f(rec(items(p.need[0],'list')[2],402n),1n),401n);expect(f(rec(f(source,1n),395n),2n)).toEqual(sid(1027,'definition/protocol-contact-two'));
 expect(p.prob).toEqual([q(1,1)]);console.info('M221 INHIBITION PASS two Need responses offered, common control removes A, only B reaches reasons/choice');
},590000);

it('need221 execution physical-opportunity null preserves the original failed count comparison',async()=>{
 const a=await start({responses:1,execute:true}),b=await start({responses:1,execute:false});await through(a.run);await through(b.run);const x=capture(a.run),y=capture(b.run);
 expect(x.report).toEqual(y.report);expect(x.ns).toEqual(y.ns);expect(x.prob).toEqual([q(1,1)]);expect(y.prob).toEqual(x.prob);
 const actual=(p:ReturnType<typeof capture>)=>p.os.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===433n).map(v=>f(rec(v,433n),3n));expect(actual(x)).toEqual([u(1)]);expect(actual(y)).toEqual([u(1)]);
 console.info('M221 EXECUTION NULL PASS physical-opportunity true/false leaves protocol count1/1; original failed0 expectation preserved');
},590000);

it('need221 execution actual protocol permission separates outcome from the same choice',async()=>{
 const a=await start({responses:1,protocolPermission:true}),b=await start({responses:1,protocolPermission:false});await through(a.run);await through(b.run);const x=capture(a.run),y=capture(b.run);
 expect(x.report).toEqual(y.report);expect(x.ns).toEqual(y.ns);expect(x.prob).toEqual([q(1,1)]);expect(y.prob).toEqual(x.prob);
 const actual=(p:ReturnType<typeof capture>)=>p.os.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===433n).map(v=>f(rec(v,433n),3n));expect(actual(x)).toEqual([u(1)]);expect(actual(y)).toEqual([u(0)]);
 console.info('M221 EXECUTION PASS actual protocol permission1/0, identical positive Need/reasons/choice; no claim of relief efficacy');
},590000);
