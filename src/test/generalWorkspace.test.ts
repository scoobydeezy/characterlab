import {beforeAll,it,expect,vi} from 'vitest';
import {compileGeneralDeclarations,buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {generalRecord as r,generalSubject,generalDefinitionId as d,generalContentId as c,generalId as id,generalBindingContext} from '../campaign3/generalBindingProfile';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {AuthoritativeState,type StatePath} from '../substrate/state';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {canonicalEncode as enc,unsigned as u,typedIdentifier,set,rational as q,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';

const who=generalSubject(),occ=typedIdentifier(1128,u(1)),original=r(377,[who.observer,d('workspace')]);
const path=(root:bigint,key:CanonicalValue):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key}]});
const taskKey=r(371,[who.character,semanticReferentFromAuthoredContent(c('task'))]);
const forecast=r(361,[q(0,1),set([r(237,[u(1),typedIdentifier(1115,u(7))])])]);
const recipes=['baseline','source-capacity1','source-no-task-access','source-no-prediction-access'];
const models=new Map<string,Awaited<ReturnType<typeof compileGeneralDeclarations>>>();
beforeAll(async()=>{for(const recipe of recipes)models.set(recipe,await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe)));},60000);
function state(status:CanonicalValue|undefined=r(372,[u(1)]),prediction:CanonicalValue|undefined=forecast,character:CanonicalValue=who.character){
 return new AuthoritativeState([
  {path:path(268n,who.observer),value:r(267,[character])},
  ...(status===undefined?[]:[{path:path(373n,taskKey),value:status}]),
  ...(prediction===undefined?[]:[{path:path(362n,r(360,[who.character,d('prediction')])),value:prediction}]),
 ]);
}
const run=(s:AuthoritativeState,recipe='baseline',at=3n)=>models.get(recipe)!.workspace.construct(s,original,occ,at);
const output=(result:ReturnType<typeof run>)=>rec(decode(result.outputBytes(),generalBindingContext()),381n);
it('reads the authoritative roster, active task and prediction through inherited members',()=>{
 const s=state(),spy=vi.spyOn(s,'read'),before=s.entries(),result=run(s),w=output(result);
 expect(spy.mock.calls.map(([p])=>p.rootStateTypeId)).toEqual([268n,373n,362n]);
 expect(items(f(w,4n),'list')).toEqual([r(379,[taskKey,d('task')])]);
 expect(f(w,5n)).toEqual(r(380,[u(2),forecast]));expect(result.unavailable).toBeUndefined();
 expect(result.actualReadRecords().map(v=>v.accessorId)).toEqual(['ResolvedCharacterSubject','accessor/workspace-task-status','accessor/measurement-prediction-prior'].map(n=>id(1028,n)));
 expect(result.actualReadRecords()[0].derivedSources).toHaveLength(1);expect(s.entries()).toEqual(before);
});
it.each([
 ['source-capacity1',[268n,373n],'CapacityExcluded',1],
 ['source-no-task-access',[268n],'NoSelectedTask',0],
 ['source-no-prediction-access',[268n,373n],'AccessDisabled',1],
] as const)('%s suppresses the actual excluded state reads',(recipe,roots,reason,count)=>{
 // Poison excluded leaves: a speculative eager read would fail validation.
 const s=state(recipe==='source-no-task-access'?u(99):r(372,[u(1)]),u(99)),spy=vi.spyOn(s,'read'),result=run(s,recipe);
 expect(spy.mock.calls.map(([p])=>p.rootStateTypeId)).toEqual(roots);expect(result.unavailable).toBe(reason);
 expect(items(f(output(result),4n),'list')).toHaveLength(count);expect(f(output(result),5n)).toEqual(r(380,[u(1)]));
});
it.each([1n,2n,20n,21n])('honors the half-open task window at %s',at=>{
 const s=state(),spy=vi.spyOn(s,'read'),result=run(s,'baseline',at),active=at>=2n&&at<21n;
 expect(items(f(output(result),4n),'list')).toHaveLength(active?1:0);
 expect(spy.mock.calls.map(([p])=>p.rootStateTypeId)).toEqual(active?[268n,373n,362n]:[268n,373n]);
});
it('keeps absent prediction distinct from known zero and audits the absent read',()=>{
 const s=new AuthoritativeState(state().entries().filter(e=>e.path.rootStateTypeId!==362n)),result=run(s);
 expect(result.unavailable).toBe('PriorAbsent');expect(result.actualReadRecords()[2].presence).toBe(false);
 expect(run(state()).unavailable).toBeUndefined();
});
it('does not read prediction when task status is absent or inactive',()=>{
 for(const s of [new AuthoritativeState(state().entries().filter(e=>e.path.rootStateTypeId!==373n)),state(r(372,[u(3)]),u(99))]){
  const spy=vi.spyOn(s,'read'),result=run(s);expect(result.unavailable).toBe('NoSelectedTask');
  expect(spy.mock.calls.map(([p])=>p.rootStateTypeId)).toEqual([268n,373n]);
 }
});
it('rejects foreign subject, agenda, wrong occurrence namespace and negative time before state reads',()=>{
 const s=state(),spy=vi.spyOn(s,'read'),binding=models.get('baseline')!.workspace;
 for(const cue of [r(377,[id(1000,'observer/other'),d('workspace')]),r(377,[who.observer,d('concern')])])expect(()=>binding.construct(s,cue,occ,3n)).toThrow();
 expect(()=>binding.construct(s,original,typedIdentifier(1129,u(1)),3n)).toThrow();
 expect(()=>binding.construct(s,original,occ,-1n)).toThrow();expect(spy).not.toHaveBeenCalled();
});
it('rejects missing or foreign roster before inherited holder reads',()=>{
 for(const s of [new AuthoritativeState([]),state(r(372,[u(1)]),forecast,semanticReferentFromAuthoredContent(c('scene-a')))]){
  const spy=vi.spyOn(s,'read');expect(()=>run(s)).toThrow();expect(spy.mock.calls.map(([p])=>p.rootStateTypeId)).toEqual([268n]);
 }
});
it('validates present state leaves, and detached outputs cannot mutate state or subsequent runs',()=>{
 expect(()=>run(state(u(99)))).toThrow();expect(()=>run(state(r(372,[u(1)]),u(99)))).toThrow();
 const s=state(),result=run(s),bytes=result.outputBytes(),reads=result.actualReadRecords();bytes.fill(0);
 (reads[1].path as {rootStateTypeId:bigint}).rootStateTypeId=999n;
 expect(result.outputBytes()).toEqual(run(s).outputBytes());expect(result.actualReadRecords()[1].path.rootStateTypeId).toBe(373n);
 expect(enc(f(output(result),5n))).toEqual(enc(r(380,[u(2),forecast])));
});
