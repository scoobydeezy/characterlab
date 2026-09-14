import {describe,it,expect} from 'vitest';
import {typedIdentifier,text} from '../substrate/canonicalEncoding';
import {AuthoritativeState,StateAuthorityRegistry,applyStatePatch,createStatePatch} from '../substrate/state';
import {compileAdditiveFamilyRoots,type FamilyRootDefinition,type AdditiveFamilyRoot} from '../campaign3/additiveFamilyRoots';
const id=(n:number,s:string)=>typedIdentifier(n,text(s)),family=id(1031,'episodic-memory'),route=id(1026,'route/character-learning');
//900001..900003 are fixture root numbers, not production allocations.
const base=():FamilyRootDefinition[]=>[{family,route,roots:[{root:346n,leaves:[{leaf:id(1032,'leaf/measurement-episode'),field:1n}]}]}];
const additions=():AdditiveFamilyRoot[]=>[{family,root:900001n,leaves:[{leaf:id(1032,'fixture/ordinary'),field:1n}]},{family,root:900002n,leaves:[{leaf:id(1032,'fixture/presentation'),field:1n}]}];
const path=(root:bigint,field=1n)=>({rootStateTypeId:root,fieldId:field,selectors:[]});
describe('additive physical roots preserve logical families',()=>{
 it('AFR-A: old and new memory roots classify together while protocol stays separate',()=>{const c=compileAdditiveFamilyRoots(base(),additions(),[{root:900003n,fields:[1n]}]);for(const root of [346n,900001n,900002n])expect(c.classify(path(root))).toMatchObject({kind:'Family',family,route});expect(c.classify(path(900003n))).toEqual({kind:'RuntimeProtocol'});expect(()=>c.classify(path(900004n))).toThrow('UNDECLARED_PATH');expect(()=>c.classify(path(346n,2n))).toThrow('UNDECLARED_PATH');});
 it('AFR-B: root collision, duplicate leaf and undeclared family reject',()=>{for(const changed of [[{...additions()[0],root:346n}],[{...additions()[0],leaves:[{leaf:id(1032,'leaf/measurement-episode'),field:1n}]}],[{...additions()[0],family:id(1031,'undeclared')}]])expect(()=>compileAdditiveFamilyRoots(base(),changed)).toThrow();expect(()=>compileAdditiveFamilyRoots(base(),additions(),[{root:900001n,fields:[1n]}])).toThrow('DUPLICATE_ROOT');});
 it('AFR-C: additive declaration cannot override route or classify protocol as a family by overlap',()=>{expect(()=>compileAdditiveFamilyRoots(base(),[{...additions()[0],route:id(1026,'route/automatic-adaptation')} as AdditiveFamilyRoot])).toThrow('ADDITIVE_FIELDS');expect(()=>compileAdditiveFamilyRoots(base(),[],[{root:346n,fields:[1n]}])).toThrow('DUPLICATE_ROOT');});
 it('AFR-D: descriptor permutation and later mutation cannot alter classification',()=>{const b=structuredClone(base()),a=structuredClone(additions()),c=compileAdditiveFamilyRoots(b,a),d=compileAdditiveFamilyRoots(base(),additions().reverse()),before=c.classify(path(900001n));(a[0].leaves[0] as {field:bigint}).field=2n;const r=c.classify(path(900001n));if(r.kind!=='Family')throw Error('family');if(typeof r.family.payload==='boolean'||r.family.payload.kind!=='text')throw Error('text');(r.family.payload as {value:string}).value='changed';expect(c.classify(path(900001n))).toEqual(before);expect(d.classify(path(900001n))).toEqual(before);});
 it('AFR-E: malformed ordinals, duplicate fields and wrong identity roles reject',()=>{for(const a of [{...additions()[0],root:0n},{...additions()[0],leaves:[...additions()[0].leaves,{leaf:id(1032,'other'),field:1n}]},{...additions()[0],leaves:[{leaf:id(1031,'wrong'),field:1n}]}])expect(()=>compileAdditiveFamilyRoots(base(),[a])).toThrow();});
 it('AFR-F: shared logical family does not widen an existing physical mutation authority',()=>{
  const c=compileAdditiveFamilyRoots(base(),additions()),old=id(1025,'fixture/old-owner'),fresh=id(1025,'fixture/new-owner');
  const patterns=[path(346n),path(900001n),path(900002n)];
  const registry=new StateAuthorityRegistry(patterns.map(pattern=>({pattern,validateValue:()=>{},removalAllowed:false})),[{mutationAuthorityId:old,patterns:[patterns[0]]},{mutationAuthorityId:fresh,patterns:patterns.slice(1)}]);
  const patch=createStatePatch([{kind:'set',path:patterns[1],expected:{presence:false},newValue:text('new')}]);
  expect(c.classify(patterns[0])).toMatchObject({family});expect(c.classify(patterns[1])).toMatchObject({family});
  expect(()=>applyStatePatch(new AuthoritativeState([]),patch,old,registry)).toThrow();
  expect(()=>applyStatePatch(new AuthoritativeState([]),patch,fresh,registry)).not.toThrow();
 });
 it('AFR-G: bounds apply across base, additive and protocol roots, including sparse descriptors',()=>{
  const roots=Array.from({length:32},(_,i)=>({root:BigInt(910000+i),fields:[1n]}));
  expect(()=>compileAdditiveFamilyRoots([],[],roots)).not.toThrow();
  expect(()=>compileAdditiveFamilyRoots(base(),[],roots)).toThrow('BOUND');
  const sparse=new Array(1) as AdditiveFamilyRoot[];expect(()=>compileAdditiveFamilyRoots(base(),sparse)).toThrow('BOUND');
 });
});
