import {it,expect,vi} from 'vitest';
import {compileGeneralAccessors as compile,type GeneralAccessorDeclaration} from '../campaign3/generalAccessors';
import {generalAttentionRecord as ga,generalAttentionRawRecord as raw} from '../campaign3/generalAttentionCodecs';
import {attentionRecord as ar} from '../campaign3/attentionCodecs';
import {canonicalEncode as enc,typedIdentifier as tid,text,unsigned as u,signed,list,set,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {AuthoritativeState,type StatePath,type StatePathPattern} from '../substrate/state';
import inventory from '../../docs/planning/GA_REGISTRY_MEMBER_SHAPE_REV1.json';
const observer=tid(1000,text('observer/subject'));
const character=semanticReferentFromAuthoredContent(tid(1027,text('content/subject')));
const foreign=semanticReferentFromAuthoredContent(tid(1027,text('content/foreign')));
const subject={observer,character};
const path=(root:bigint,key:CanonicalValue):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key}]});
const domain=(root:bigint):StatePathPattern=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
const member='accessor/general-attention-body-recall-evidence';
const declaration=():GeneralAccessorDeclaration=>({member,path:path(630n,character),resultTypeId:587n,projection:'BodyPartition'});
const compiler=()=>compile('current-body-rank',[declaration()],[domain(268n),domain(630n)],subject,{});
const state=(who=character,owner=true)=>new AuthoritativeState([
 {path:path(268n,observer),value:ar(267,[who])},
 ...(owner?[{path:path(630n,who),value:ga('SurvivingEpisodeLedger',[list([])])}]:[]),
]);
function cue(present:boolean,who=observer,at=2n,withOpportunity=present){
 const fields=new Map<bigint,CanonicalValue>([[1n,who],[2n,signed(at)],[4n,u(present?1:2)],[5n,set(present?[tid(1045,text('signal/a'))]:[])],[6n,set(present?[tid(1115,u(1))]:[])]]);
 if(withOpportunity)fields.set(3n,tid(1106,u(1)));
 return raw('BodySignalCue',fields);
}
it('GAP-A: reads roster before owner and produces only the canonical recall partition',()=>{
 const s=state(),spy=vi.spyOn(s,'read'),projection=compiler().construct(s,observer,2n,cue(true));
 expect(spy.mock.calls.map(c=>c[0].rootStateTypeId)).toEqual([268n,630n]);
 expect(projection.read(member)).toEqual(list([]));
 expect(projection.actualReadRecords()).toHaveLength(2);
 expect(()=>projection.read('accessor/general-attention-episodes-prior')).toThrow();
});
it('GAP-B: absent cue reads roster only, even if episode leaf is missing',()=>{
 for(const withOpportunity of [false,true]){
  const s=state(character,false),spy=vi.spyOn(s,'read'),p=compiler().construct(s,observer,2n,cue(false,observer,2n,withOpportunity));
  expect(spy.mock.calls.map(c=>c[0].rootStateTypeId)).toEqual([268n]);
  expect(()=>p.read(member)).toThrow();
 }
});
it('GAP-C: foreign observer, wrong roster subject and foreign cue cannot select another holder',()=>{
 const other=tid(1000,text('observer/foreign'));
 const s=state(),spy=vi.spyOn(s,'read');
 expect(()=>compiler().construct(s,other,2n,cue(true))).toThrow(/observer/);expect(spy).not.toHaveBeenCalled();
 const wrong=state(foreign),wrongSpy=vi.spyOn(wrong,'read');
 expect(()=>compiler().construct(wrong,observer,2n,cue(false))).toThrow(/roster subject/);
 expect(wrongSpy.mock.calls.map(c=>c[0].rootStateTypeId)).toEqual([268n]);
 expect(()=>compiler().construct(s,observer,2n,cue(true,other))).toThrow(/cue observer/);
});
it('GAP-D: wrong root, field, holder, return grammar, projection and read domain reject at compile time',()=>{
 const base=declaration();
 for(const b of [{...base,path:path(631n,character)},{...base,path:{...base.path,fieldId:2n}},{...base,path:path(630n,foreign)},{...base,resultTypeId:555n},{...base,projection:'Identity' as const}]){
  expect(()=>compile('current-body-rank',[b],[domain(268n),domain(630n),domain(631n)],subject,{})).toThrow();
 }
 expect(()=>compile('current-body-rank',[base],[domain(630n)],subject,{})).toThrow(/subject projection/);
 expect(()=>compile('current-body-rank',[base],[domain(268n)],subject,{})).toThrow(/ReadDomain/);
 expect(()=>compile('retained-attribution',[base],[domain(268n),domain(630n)],subject,{})).toThrow(/accessor set/);
});
it('GAP-E: available cue requires owner; stale or malformed cue fails before owner read',()=>{
 expect(()=>compiler().construct(state(character,false),observer,2n,cue(true))).toThrow(/owner leaf/);
 const s=state(),spy=vi.spyOn(s,'read');
 expect(()=>compiler().construct(s,observer,2n,cue(true,observer,1n))).toThrow(/cue time/);
 expect(spy.mock.calls.map(c=>c[0].rootStateTypeId)).toEqual([268n]);
 expect(()=>compiler().construct(s,observer,2n,cue(true,observer,2n,false))).toThrow(/status\/evidence/);
});
it('GAP-F: compiler snapshots bindings and results cannot tamper with subsequent reads',()=>{
 const b=declaration(),domains=[domain(268n),domain(630n)],c=compile('current-body-rank',[b],domains,subject,{});
 (b.path as {rootStateTypeId:bigint}).rootStateTypeId=631n;domains.length=0;
 const s=state(),before=s.entries().map(e=>enc(e.value)),p=c.construct(s,observer,2n,cue(true));
 const result=p.read(member) as Extract<CanonicalValue,{kind:'list'}>;(result.items as CanonicalValue[]).push(u(99));
 const reads=p.actualReadRecords();(reads[1].path as {rootStateTypeId:bigint}).rootStateTypeId=999n;
 expect(p.read(member)).toEqual(list([]));expect(p.actualReadRecords()[1].path.rootStateTypeId).toBe(630n);
 expect(s.entries().map(e=>enc(e.value))).toEqual(before);
});
it('GAP-G: all eight accessor descriptors compile for their owners; observer windows do not use the roster',()=>{
 const stages:Record<string,string>={'episodes-prior':'ordinary-memory-formation','event-recall-evidence':'current-event-rank','body-recall-evidence':'current-body-rank','association-prior':'event-association-formation','presentations-prior':'event-presentation-owner','goals-prior':'goal-command-owner','tracking-prior':'current-track','panel-prior':'current-track'};
 const specs=(suffixes:string[])=>inventory.accessors.filter(a=>suffixes.includes(a.member.replace('accessor/general-attention-',''))).map(a=>({member:a.member,path:path(BigInt(a.rootTypeId),a.key==='ObserverId'?observer:character),resultTypeId:BigInt(a.resultTypeId),projection:a.projection as GeneralAccessorDeclaration['projection']}));
 for(const [suffix,stage] of Object.entries(stages)){
  const suffixes=stage==='current-track'?['tracking-prior','panel-prior']:stage==='current-event-rank'?['event-recall-evidence','association-prior','presentations-prior']:[suffix];
  const bindings=specs(suffixes);
  expect(()=>compile(stage,bindings,[domain(268n),...bindings.map(b=>domain(b.path.rootStateTypeId))],subject,{})).not.toThrow();
 }
 const bindings=specs(['tracking-prior','panel-prior']),c=compile('current-track',bindings,[domain(634n),domain(635n)],subject,{});
 const s=new AuthoritativeState([{path:path(634n,observer),value:raw('TrackingWindow',new Map([[1n,signed(0)],[3n,list([])]]))},{path:path(635n,observer),value:raw('TrialPanelWindow',new Map([[1n,signed(0)]]))}]);
 const spy=vi.spyOn(s,'read');c.construct(s,observer,1n);
 expect(spy.mock.calls.map(c=>c[0].rootStateTypeId)).toEqual([634n,635n]);
});
it('GAP-H: unavailable visual cue suppresses all three recall roots, preserving subject admission',()=>{
 const bindings=inventory.accessors.filter(a=>['EventPartition','association-prior','presentations-prior'].some(s=>a.projection===s||a.member.endsWith(s))).map(a=>({member:a.member,path:path(BigInt(a.rootTypeId),character),resultTypeId:BigInt(a.resultTypeId),projection:a.projection as GeneralAccessorDeclaration['projection']}));
 const c=compile('current-event-rank',bindings,[domain(268n),domain(630n),domain(631n),domain(632n)],subject,{});
 const s=state(character,false),spy=vi.spyOn(s,'read');
 const absent=raw('CueEvidence',new Map([[1n,observer],[2n,tid(1115,u(1))],[3n,signed(2)],[5n,u(2)]]));
 const p=c.construct(s,observer,2n,absent);
 expect(spy.mock.calls.map(c=>c[0].rootStateTypeId)).toEqual([268n]);
 for(const b of bindings)expect(()=>p.read(b.member)).toThrow();
});
