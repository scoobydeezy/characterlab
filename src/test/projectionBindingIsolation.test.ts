import {it,expect} from 'vitest';
import {signed,text,typedIdentifier} from '../substrate/canonicalEncoding';
import {AuthoritativeState,ContractReadProjection,type StatePath,type StatePathPattern,type ProjectionBinding} from '../substrate/state';
const a=typedIdentifier(20000,text('a')),b=typedIdentifier(20000,text('b')),accessor=typedIdentifier(20002,text('read'));
const path=(who=a):StatePath=>({rootStateTypeId:1n,fieldId:1n,selectors:[{kind:'typedEntity',id:who}]});
const exact:StatePathPattern={rootStateTypeId:1n,fieldId:1n,selectors:[{kind:'exact',selector:{kind:'typedEntity',id:a}}]};
const state=()=>new AuthoritativeState([{path:path(),value:signed(4)},{path:path(b),value:signed(7)}]);
it('PRJ binding isolation: direct binding and nested path cannot be rebound after validation',()=>{
 const originalPath=path(),bindings:Record<string,ProjectionBinding>={read:{kind:'direct',accessorId:accessor,path:originalPath}};
 const projection=new ContractReadProjection(state(),[exact],bindings);
 Object.assign(originalPath.selectors,{0:{kind:'typedEntity',id:b}});
 bindings.read={kind:'direct',accessorId:typedIdentifier(20002,text('replacement')),path:path(b)};
 expect(projection.read('read')).toEqual(signed(4));expect(projection.actualReadRecords()[0].path).toEqual(path());
 expect(projection.actualReadRecords()[0].accessorId).toEqual(accessor);
});
it('PRJ binding isolation: derived paths and function selection are captured at construction',()=>{
 const sourcePaths=[path()],binding:ProjectionBinding={kind:'derived',accessorId:accessor,projectionPath:path(),sourcePaths,transformationId:accessor,derive:reads=>reads[0].value!};
 const projection=new ContractReadProjection(state(),[exact],{read:binding});
 sourcePaths.splice(0,1,path(b));Object.assign(binding,{derive:()=>signed(999),projectionPath:path(b)});
 expect(projection.read('read')).toEqual(signed(4));expect(projection.actualReadRecords()[0].derivedSources[0].path).toEqual(path());
});
it('PRJ exact-domain cross-character read, undeclared accessor and enumeration remain excluded',()=>{
 expect(()=>new ContractReadProjection(state(),[exact],{read:{kind:'direct',accessorId:accessor,path:path(b)}})).toThrowError(expect.objectContaining({code:'ILLEGAL_READ'}));
 const projection=new ContractReadProjection(state(),[exact],{read:{kind:'direct',accessorId:accessor,path:path()}});
 expect(()=>projection.read('other' as 'read')).toThrowError(expect.objectContaining({code:'UNKNOWN_ACCESSOR'}));
 expect(Object.keys(projection)).toEqual([]);
 for(const name of ['entries','keys','state','bindings','rebind'])expect(name in projection).toBe(false);
});
