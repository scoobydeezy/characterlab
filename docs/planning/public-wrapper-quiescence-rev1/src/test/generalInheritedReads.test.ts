import {beforeAll,it,expect,vi} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {compileGeneralPhysicalReads} from '../campaign3/generalPhysicalReads';
import {generalRecord as r,generalSubject,generalId as id,generalDefinitionId as d,generalBindingContext} from '../campaign3/generalBindingProfile';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {canonicalEncode as enc,list,set,unsigned as u,signed,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key,dataText as txt,dataIdentity as identity} from '../campaign2/canonicalData';
import {advanceMarkerWindow} from '../campaign3/markerWindowTracking';
import {advancePanelWindow} from '../campaign3/panelWindowPerception';
const who=generalSubject(),observer=txt(identity(who.observer).payload);
const path=(root:bigint,k:CanonicalValue,field=1n):StatePath=>({rootStateTypeId:root,fieldId:field,selectors:[{kind:'mapKey',key:k}]});
const request=(names=['A'])=>r(650,[who.observer,set(names.map(n=>id(1005,'channel/'+n)))]);
const reserve=(n:string)=>r(644,[who.character,id(1044,'local-reserve/'+n)]);
let model:Awaited<ReturnType<typeof compileGeneralDeclarations>>;
beforeAll(async()=>{model=await compileGeneralDeclarations(buildGeneralDeclarationPacket());});
function state(){return new AuthoritativeState([{path:path(268n,who.observer),value:r(267,[who.character])},...['A','B','C'].map((n,i)=>({path:path(649n,reserve(n)),value:r(454,[q(40+i*20,1),signed(0)])}))]);}
it('samples only requested anchors using the exact materialization/binning law',()=>{
 const s=state(),spy=vi.spyOn(s,'read'),before=s.entries();let next=10n;
 const result=model.physical.sampleBody(s,request(),3n,()=>next++),body=rec(decode(result.bodyBytes()!,generalBindingContext()),654n),sample=rec(items(f(body,3n),'list')[0],461n);
 expect(spy.mock.calls.map(([p])=>p.rootStateTypeId)).toEqual([268n,649n]);expect(spy.mock.calls[1][0]).toEqual(path(649n,reserve('A')));
 expect(f(sample,5n)).toEqual(r(462,[q(37,1),q(38,1)]));expect(next).toBe(11n);
 expect(f(body,4n)).toEqual(set([r(598,[id(1005,'channel/A'),id(1045,'interoceptive-signal/A')])]));expect(s.entries()).toEqual(before);
});
it('unrequested body has no roster reads or observation allocation',()=>{
 const s=new AuthoritativeState([]),spy=vi.spyOn(s,'read'),allocate=vi.fn(()=>0n),result=model.physical.sampleBody(s,null,3n,allocate);
 expect(result.bodyBytes()).toBeNull();expect(result.actualReadRecords()).toEqual([]);expect(spy).not.toHaveBeenCalled();expect(allocate).not.toHaveBeenCalled();
});
it('rejects foreign/empty/unknown requests and invalid time before reads or allocation',()=>{
 const s=state(),spy=vi.spyOn(s,'read'),allocate=vi.fn(()=>0n);
 for(const input of [r(650,[id(1000,'observer/other'),set([id(1005,'channel/A')])]),request([]),request(['missing'])])expect(()=>model.physical.sampleBody(s,input,3n,allocate)).toThrow();
 expect(()=>model.physical.sampleBody(s,request(),-1n,allocate)).toThrow();expect(spy).not.toHaveBeenCalled();expect(allocate).not.toHaveBeenCalled();
});
it('missing or future anchors fail before allocation, while unrequested poisoned anchors are ignored',()=>{
 const allocate=vi.fn(()=>0n),base=state().entries();
 for(const entries of [base.filter(e=>e.path.rootStateTypeId!==649n),base.map(e=>key(e.path.selectors[0].kind==='mapKey'?e.path.selectors[0].key:false)===key(reserve('A'))?{...e,value:r(454,[q(40,1),signed(4)])}:e)])expect(()=>model.physical.sampleBody(new AuthoritativeState(entries),request(),3n,allocate)).toThrow();
 expect(allocate).not.toHaveBeenCalled();
 const s=new AuthoritativeState(base.map(e=>key(e.path.selectors[0].kind==='mapKey'?e.path.selectors[0].key:false)===key(reserve('C'))?{...e,value:false}:e));
 expect(model.physical.sampleBody(s,request(),3n,allocate).bodyBytes()).not.toBeNull();
});
it.each([6n,7n])('unavailable or denied channels emit absence without roster/physical access (field %s)',flag=>{
 // Internal adapter control only: this modified profile is not a new admitted model.
 const packet=buildGeneralDeclarationPacket(),defs=new Map(items(decode(packet.definitions,generalBindingContext()),'set').map(v=>{const row=rec(v,171n);return [key(f(row,1n)),row];}));
 const entry=defs.get(key(d('channels')))!,channels=items(f(rec(f(entry,4n),648n),1n),'set').map(v=>{const c=rec(v,647n),fields=new Map(c.fields);fields.set(flag,false);return r(647,fields);});
 const fields=new Map(entry.fields);fields.set(4n,r(648,[set(channels)]));defs.set(key(d('channels')),rec(r(171,fields),171n));
 const adapter=compileGeneralPhysicalReads(defs,model.validateStateLeaf),s=new AuthoritativeState([]),spy=vi.spyOn(s,'read');let next=0n;
 const result=adapter.sampleBody(s,request(['A','B']),3n,()=>next++),body=rec(decode(result.bodyBytes()!,generalBindingContext()),654n);
 expect(items(f(body,3n),'list').map(v=>rec(v,463n).schema.typeId)).toEqual([463n,463n]);expect(next).toBe(2n);expect(spy).not.toHaveBeenCalled();
});
it('rejects duplicate occurrence slots; outputs and read audit are detached',()=>{
 expect(()=>model.physical.sampleBody(state(),request(['A','B']),3n,()=>1n)).toThrow(/slot/);
 const result=model.physical.sampleBody(state(),request(),3n,()=>1n),before=result.bodyBytes();result.bodyBytes()!.fill(0);
 const reads=result.actualReadRecords();(reads[0].path as {rootStateTypeId:bigint}).rootStateTypeId=0n;
 expect(result.bodyBytes()).toEqual(before);expect(result.actualReadRecords()[0].path.rootStateTypeId).toBe(268n);
});
it('reconstructs SEM files through bounded same-observer counter/membership reads',()=>{
 const s=new AuthoritativeState([{path:path(241n,who.observer),value:u(3)},{path:path(241n,r(212,[who.observer,u(0)]),2n),value:true},{path:path(241n,r(212,[who.observer,u(2)]),2n),value:true},{path:path(242n,who.observer),value:u(1)},{path:path(242n,r(213,[who.observer,u(0)]),2n),value:true}]);
 const spy=vi.spyOn(s,'read'),scan=vi.spyOn(s,'entries'),result=model.semantic.construct(s,'current-track',who.observer,{continuants:true,events:true});
 expect(result.continuants()!.activePerceptualReferentIds.map(f=>f.observerTrackSequence)).toEqual([0n,2n]);expect(result.events()!.activeEventFiles).toEqual([{observerId:observer,observerEventSequence:0n}]);
 expect(spy).toHaveBeenCalledTimes(6);expect(scan).not.toHaveBeenCalled();expect(result.actualReadRecords()[2].presence).toBe(false);
 expect(result.actualReadRecords().every(r=>r.accessorId.namespaceId===1028n)).toBe(true);
});
it('empty counter state feeds the actual marker and panel owner components',()=>{
 const s=new AuthoritativeState([]),result=model.semantic.construct(s,'consequence-track',who.observer,{continuants:true,events:true});
 const markers=advanceMarkerWindow(observer,result.continuants()!,{at:0n,observation:null,items:[]},{observerId:observer,observationId:1n,occurredAt:3n,detections:[{detectionId:2n,glyph:1n}]});
 expect(markers.transitions[0].perceptualReferentId.observerTrackSequence).toBe(0n);
 const panel=advancePanelWindow(observer,result.events()!,{at:0n},{observer,observation:3n,detection:4n,sample:{kind:'Present',at:3n,glyph:0,stage:'Before'}});
 expect(panel.result.transition!.perceptualEventReferentId.observerEventSequence).toBe(0n);
 expect(result.continuants()!.activePerceptualReferentIds).toEqual([]);
});
it('skips unrequested SEM families and rejects foreign observers before reads',()=>{
 const s=new AuthoritativeState([]),spy=vi.spyOn(s,'read');
 expect(()=>model.semantic.construct(s,'current-track',id(1000,'observer/other'),{continuants:true,events:true})).toThrow();expect(spy).not.toHaveBeenCalled();
 const none=model.semantic.construct(s,'current-track',who.observer,{continuants:false,events:false});expect(none.continuants()).toBeUndefined();expect(none.events()).toBeUndefined();expect(spy).not.toHaveBeenCalled();
 model.semantic.construct(s,'current-track',who.observer,{continuants:false,events:true});expect(spy.mock.calls.map(([p])=>p.rootStateTypeId)).toEqual([242n]);
});
it('bounds SEM counter traversal and rejects false membership markers',()=>{
 const s=new AuthoritativeState([{path:path(241n,who.observer),value:u(31)}]),spy=vi.spyOn(s,'read');expect(()=>model.semantic.construct(s,'current-track',who.observer,{continuants:true,events:false})).toThrow(/bound/);expect(spy).toHaveBeenCalledTimes(1);
 const invalid=new AuthoritativeState([{path:path(242n,who.observer),value:u(1)},{path:path(242n,r(213,[who.observer,u(0)]),2n),value:false}]);expect(()=>model.semantic.construct(invalid,'current-track',who.observer,{continuants:false,events:true})).toThrow(/membership/);
});
