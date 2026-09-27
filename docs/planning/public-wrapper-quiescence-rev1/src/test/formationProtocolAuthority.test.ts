import {describe,it,expect} from 'vitest';
import {AuthoritativeState,StateAuthorityRegistry,ContractReadProjection,applyStatePatch,restoreAuthoritativeState,type StatePath} from '../substrate/state';
import {canonicalEncode,list,text,unsigned,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
// Synthetic generic-substrate fixture path; no production root/member allocation.
const path={rootStateTypeId:1n,fieldId:1n,selectors:[]} as const satisfies StatePath;
const authority=typedIdentifier(20001n,text('fixture/formation-protocol'));
const cognitive=typedIdentifier(20001n,text('fixture/evidence-producer'));
const accessor=typedIdentifier(20002n,text('fixture/protocol'));
const empty=list([list([]),list([])]);
const admitted=list([list([text('qualified-source')]),list([])]);
const formed=list([list([text('qualified-source')]),list([list([text('qualified-source'),unsigned(812n),true])])]);
const registry=new StateAuthorityRegistry([{pattern:path,validateValue:v=>{if(typeof v!=='object'||v.kind!=='list'||v.items.length!==2)throw Error('fixture shape');},removalAllowed:false}],[{mutationAuthorityId:authority,patterns:[path]}]);
const set=(state:AuthoritativeState,old:CanonicalValue,value:CanonicalValue,owner=authority)=>applyStatePatch(state,{operations:[{kind:'set',path,expected:{presence:true,value:old},newValue:value}]},owner,registry).state;
describe('formation protocol generic authority substrate',()=>{
 it('PA-A: explicit protocol authority updates the root; cognitive producer cannot',()=>{const state=new AuthoritativeState([{path,value:empty}]);expect(()=>set(state,empty,admitted,cognitive)).toThrow();expect(set(state,empty,admitted).read(path).value).toEqual(admitted);expect(state.read(path).value).toEqual(empty);});
 it('PA-B: cognitive read domains exclude direct and indirect protocol reads',()=>{const state=new AuthoritativeState([{path,value:formed}]);expect(()=>new ContractReadProjection(state,[],{leak:{kind:'direct',accessorId:accessor,path}})).toThrow();expect(()=>new ContractReadProjection(state,[],{leak:{kind:'derived',accessorId:accessor,projectionPath:path,sourcePaths:[path],transformationId:accessor,derive:()=>true}})).toThrow();});
 it('PA-C: absent, admitted/no-success and successful/lost remain distinct canonical states',()=>{const variants=[new AuthoritativeState([]),... [empty,admitted,formed].map(value=>new AuthoritativeState([{path,value}]))];expect(new Set(variants.map(s=>Array.from(canonicalEncode(s.canonicalValue())).join(','))).size).toBe(4);});
 it('PA-D: canonical authoritative state reconstructs protocol facts without trace or output input',()=>{const state=set(new AuthoritativeState([{path,value:admitted}]),admitted,formed);const restored=restoreAuthoritativeState(state.canonicalValue());expect(canonicalEncode(restored.canonicalValue())).toEqual(canonicalEncode(state.canonicalValue()));const view=new ContractReadProjection(restored,[path],{protocol:{kind:'direct',accessorId:accessor,path}});expect(view.read('protocol')).toEqual(formed);});
 it('PA-E: removal and stale preconditions cannot clear enrolled state',()=>{const state=new AuthoritativeState([{path,value:formed}]);expect(()=>applyStatePatch(state,{operations:[{kind:'remove',path,expectedOldValue:formed}]},authority,registry)).toThrow();expect(()=>set(state,empty,admitted)).toThrow();});
});
