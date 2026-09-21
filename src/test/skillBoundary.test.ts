import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataUnsigned as uint} from '../campaign2/canonicalData';
import {compileSkillModel,compileSkillInputs,skillRecipe,DEFAULT_SETTINGS,eventId} from '../campaign3/skillModel';
import {createSkillRuntime} from '../campaign3/skillRuntime';
import {skillRecord as r,decodeSkill as decode} from '../campaign3/skillCodecs';
import {receivingRecord as old} from '../campaign3/receivingCodecs';
import {learnSkill} from '../campaign3/skillMath';
import {skillInputs} from './skillFixtures';
it('observes exact registered reads and separate adaptation/learning owners',async()=>{
 const model=await compileSkillModel(skillRecipe()),input=await compileSkillInputs(model,enc(model.initial.canonicalValue()),skillInputs([{at:1,practice:true},{at:2}]),new Uint8Array(32)),runtime=createSkillRuntime(model,input);while(await runtime.settle()){}
 const trace=runtime.snapshot().trace.map(v=>rec(v,160n));
 for(const [name,roots] of [['appraise',[787n]],['raw',[373n]],['execute',[785n]],['adapt',[785n]],['learn',[787n]]] as const){const rows=trace.filter(t=>key(f(t,7n))===key(eventId(name)));expect(rows).toHaveLength(2);for(const row of rows)expect(items(f(row,11n),'list').map(v=>uint(f(rec(f(rec(v,147n),2n),140n),1n)))).toEqual(roots);}
 const outputs=runtime.snapshot().outputs,apps=outputs.filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===788n).map(v=>rec(v,788n));expect(apps[0].fields.has(3n)).toBe(false);expect(apps[1].fields.has(3n)).toBe(true);
},120000);
it('rejects duplicate performance support without weakening unknown versus zero',()=>{
 const obs=r(797,[typedIdentifier(1153,u(1)),signed(1),true,false]),result=learnSkill(DEFAULT_SETTINGS,undefined,obs);expect(f(rec(result.next!,786n),1n)).toEqual(q(0,1));expect(()=>learnSkill(DEFAULT_SETTINGS,result.next,obs)).toThrow('DUPLICATE');
 const absent=r(797,[typedIdentifier(1153,u(2)),signed(2),false]);expect(learnSkill(DEFAULT_SETTINGS,undefined,absent)).toEqual({next:undefined,applied:false});
});
it('new schema grammar does not widen inherited typed fields or physical unit domains',()=>{
 const inherited=rec(old(439,[q(1,4),u(3)]),439n),fields=new Map(inherited.fields);fields.set(2n,r(784,[q(1,2),u(0)]));expect(()=>decode(enc({...inherited,fields}))).toThrow();
 expect(()=>r(783,[signed(1),q(2,1),q(1,2),true,false,true,u(0)])).toThrow();expect(()=>r(783,[signed(1),q(0,1),q(-1,2),true,false,true,u(0)])).toThrow();
});
it('original admission rejects nonmonotone opportunities and uncommitted model content',async()=>{
 const source=skillRecipe(),model=await compileSkillModel(source),initial=enc(model.initial.canonicalValue());
 for(const xs of [[{at:0}],[{at:11}],[{at:1},{at:1}],[{at:2},{at:1}]])await expect(compileSkillInputs(model,initial,skillInputs(xs),new Uint8Array(32))).rejects.toThrow('TIME');
 await expect(compileSkillModel({...source,content:enc(list([]))})).rejects.toThrow();
});
