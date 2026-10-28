import {describe,it,expect} from 'vitest';
import {compileCognitiveDeclarations} from '../assembled/cognitiveDeclarations';
import {configurationTopology} from '../assembled/configurationTopology';
import {prepareCharacterModel} from '../assembled/character';
import {text,unsigned} from '../substrate/canonicalEncoding';
import {sid} from '../assembled/skill';
import {configurationSource,baseRegistry,newAction,newInstruction,newSpec,newTask,decode,items,rec,f,key,enc,list,set,replace,walk} from './fixtures/assembledConfiguration';
const compile=(s:ReturnType<typeof configurationSource>)=>compileCognitiveDeclarations(s.content,baseRegistry(s));
describe('M21b governed configuration declarations',()=>{
 it('admits three ordinary named tasks/actions and independently renamed identities',async()=>{
  const s=configurationSource();expect(await compile(s)).toBeDefined();
  const rename=(v:Parameters<typeof key>[0])=>[newAction,newInstruction,newSpec,newTask].some(x=>key(x)===key(v))&&typeof v!=='boolean'&&v.kind==='typedIdentifier'?{...v,payload:text('another/legal/'+key(v))}:v;
  expect(await compile({...s,content:enc(walk(decode(s.content),rename)),registry:enc(walk(decode(s.registry),rename))})).toBeDefined();
 });
 it('rejects cardinality, missing target coverage and foreign action references',async()=>{
  const s=configurationSource(),slots=items(decode(s.registry),'list');
  const mutate=(change:Parameters<typeof walk>[1])=>({...s,registry:enc(walk(decode(s.registry),change))});
  await expect(compile(mutate(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===416n?replace(v,2n,set(items(f(v,2n),'set').filter(x=>key(x)!==key(newSpec)))):v))).rejects.toThrow('coverage');
  await expect(compile(mutate(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===389n?replace(v,1n,sid(1027,'foreign')):v))).rejects.toThrow();
  const rows=items(slots[0],'set'),extra=rows.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(newAction))!;
  await expect(compile({...s,registry:enc(list([set([...rows,replace(extra,1n,sid(1027,'fourth/action'))]),...slots.slice(1)]))})).rejects.toThrow('cardinality');
  await expect(compile(mutate(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===391n?replace(v,1n,unsigned(3)):v))).rejects.toThrow('action domain');
 });
 it('normalizes only dynamic declarations and task target sets; unknown model versions remain closed',async()=>{
  const s=configurationSource(),shape=configurationTopology(decode(baseRegistry(s)));
  const changed=walk(decode(baseRegistry(s)),v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===378n?replace(v,3n,false):v);
  expect(configurationTopology(changed)).not.toEqual(shape);
  await expect(prepareCharacterModel({...s,rulesVersion:"rules/assembled-character/unknown"})).rejects.toThrow('unsupported assembled model version');
 });
});
