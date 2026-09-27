import {it,expect} from 'vitest';
import {buildGeneralDeclarationPacket,compileGeneralDeclarations} from '../campaign3/generalDeclarations';
import {generalRecord as r,generalDefinitionId as d,generalContentId as c,generalId as id,generalSubject,generalBindingContext} from '../campaign3/generalBindingProfile';
import {canonicalEncode as enc,record,list,set,typedIdentifier,unsigned as u,signed,map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent as referent} from '../substrate/referentOrigin';
import {createPositionSceneSource,materializePositionScene} from '../campaign3/positionSceneSource';
import {createTrialPanelSource,observeTrialPanel} from '../campaign3/trialPanelSource';
const change=(v:CanonicalValue,field:bigint,next:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('test record');return record(v.schema,new Map([...v.fields,[field,next]]));};
function alter(name:string,mutate:(v:CanonicalValue)=>CanonicalValue){
 const packet=buildGeneralDeclarationPacket();
 return {...packet,definitions:enc(set(items(decode(packet.definitions,generalBindingContext()),'set').map(row=>key(f(rec(row,171n),1n))===key(d(name))?change(row,4n,mutate(f(rec(row,171n),4n))):row)))};
}
it('compiles exact multimodal source frames, use policies and four selector hook bindings',async()=>{
 const m=await compileGeneralDeclarations(buildGeneralDeclarationPacket());
 expect(m.source.counts).toEqual({observations:8,visualSweeps:8,panelSweeps:8,qualifiedSelectionSlots:8});
 const plans=m.source.plans();expect(plans.slice(0,4).every(p=>p.use.bodySelection&&p.use.visualSelection&&!p.use.bodyCue&&!p.use.visualCue)).toBe(true);
 expect(plans.slice(4).every(p=>!p.use.bodySelection&&!p.use.visualSelection&&p.use.bodyCue&&p.use.visualCue)).toBe(true);
 expect(m.protocol.sourceBindings).toBe(4);expect(m.protocol.maximumQualifiedSources).toBe(32);
 expect(decode(m.protocol.initialValueBytes())).toEqual(decode(enc(r(580,[map([]),map([])]))));
});
it.each(['baseline','select-k0','denied-port','unresolved-role'])('materializes %s through actual source components without a cue index',async recipe=>{
 const m=await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe));
 const scene=createPositionSceneSource(m.source.sceneFrames()),panel=createTrialPanelSource(m.source.panelFrames());let n=0n;
 for(const plan of m.source.plans()){
  const observed=materializePositionScene(scene,plan.at,()=>n++),context=observeTrialPanel(panel,plan.at);
  expect(context.kind).toBe('Present');
  expect(observed.safe.items).toHaveLength(plan.use.visualCue?(recipe==='denied-port'?0:1):(recipe==='denied-port'?2:3));
  for(const item of observed.safe.items){expect(item).not.toHaveProperty('marker');expect(item).not.toHaveProperty('cuePort');}
  if(recipe==='unresolved-role'&&plan.use.visualCue)expect(observed.safe.items[0].role.kind).toBe('unresolved');
 }
 // Zero selection capacity still declares the same eight protocol sources.
 expect(m.source.counts.qualifiedSelectionSlots).toBe(8);
});
it.each([
 ['foreign profile observer','source-profile',(v:CanonicalValue)=>change(v,1n,id(1000,'observer/foreign')),/source observer/],
 ['dangling profile body','source-profile',(v:CanonicalValue)=>change(v,2n,d('missing-body')),/profile reference/],
 ['missing scene frame','scene',(v:CanonicalValue)=>change(v,2n,list(items(f(rec(v,660n),2n),'list').slice(1))),/exact frame coverage/],
 ['duplicate frame time','scene',(v:CanonicalValue)=>{const frames=items(f(rec(v,660n),2n),'list');return change(v,2n,list([frames[0],change(frames[1],1n,signed(3)),...frames.slice(2)]));},/POSITION_SCENE_DOMAIN/],
 ['unqualified marker','scene',(v:CanonicalValue)=>{const frames=items(f(rec(v,660n),2n),'list'),frame=rec(frames[0],659n),rows=items(f(frame,2n),'list');return change(v,2n,list([change(frame,2n,list([change(rows[0],1n,referent(c('subject'))),...rows.slice(1)])),...frames.slice(1)]));},/wrong committed kind/],
 ['extra cue item','scene',(v:CanonicalValue)=>{const frames=items(f(rec(v,660n),2n),'list'),first=rec(frames[0],659n);return change(v,2n,list([...frames.slice(0,4),change(frames[4],2n,f(first,2n)),...frames.slice(5)]));},/ambiguous visual cue/],
 ['unrequested policy slot','cue-policy',(v:CanonicalValue)=>change(v,1n,d('body-selection')),/OBSERVATION_EXECUTION_POLICY/],
 ['wrong policy target','cue-policy',(v:CanonicalValue)=>change(v,5n,d('spatial')),/OBSERVATION_EXECUTION_POLICY/],
] as const)('rejects %s before candidate comparison',async(_label,name,mutate,error)=>{
 const packet=alter(name,mutate);decode(packet.definitions,generalBindingContext());await expect(compileGeneralDeclarations(packet)).rejects.toThrow(error);
});
it.each([
 ['unregistered selector',(v:CanonicalValue)=>{const rows=items(f(rec(v,585n),4n),'set');return change(v,4n,set([change(rows[0],1n,id(1009,'transition/foreign')),...rows.slice(1)]));},/unknown producer/],
 ['wrong audit selection field',(v:CanonicalValue)=>{const rows=items(f(rec(v,585n),4n),'set');return change(v,4n,set([change(rows[0],3n,u(2)),...rows.slice(1)]));},/selection field/],
 ['missing source binding',(v:CanonicalValue)=>change(v,4n,set(items(f(rec(v,585n),4n),'set').slice(1))),/source coverage/],
 ['wrong protocol authority',(v:CanonicalValue)=>change(v,3n,change(f(rec(v,585n),3n),3n,id(1025,'authority/perception'))),/runtime authority/],
 ['wrong protocol value schema',(v:CanonicalValue)=>change(v,3n,change(f(rec(v,585n),3n),2n,r(254,[u(555),u(1)]))),/value schema/],
 ['foreign ordinary owner',(v:CanonicalValue)=>change(v,5n,change(f(rec(v,585n),5n),1n,id(1009,'transition/general-attention-event-association-formation'))),/terminal owner/],
] as const)('rejects %s',async(_label,mutate,error)=>{
 const packet=alter('formation-governance',mutate);decode(packet.definitions,generalBindingContext());await expect(compileGeneralDeclarations(packet)).rejects.toThrow(error);
});
it('preserves fixed collection-element roles without pretending collections are identity atoms',async()=>{
 const m=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),who=generalSubject();
 m.validateRecordRoles(enc(r(650,[who.observer,set([id(1005,'channel/A')])])));
 m.validateRecordRoles(enc(r(606,new Map<bigint,CanonicalValue>([[1n,who.observer],[2n,signed(3)],[4n,u(2)],[5n,set([])],[6n,set([])]]))));
 m.validateRecordRoles(enc(r(586,[map([]),set([typedIdentifier(1145,u(1))])])));
 expect(()=>m.validateRecordRoles(enc(r(650,[who.observer,set([id(1000,'observer/foreign')])])))).toThrow();
 expect(()=>m.validateRecordRoles(enc(r(586,[map([]),set([id(1145,'not-an-occurrence')])])))).toThrow();
});
it('source plans, frames and protocol bytes are detached snapshots',async()=>{
 const m=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),before=m.source.originalBytes();
 const frames=m.source.sceneFrames();(frames as {at:bigint}[])[0].at=999n;m.source.originalBytes().fill(0);m.protocol.initialValueBytes().fill(0);
 expect(m.source.sceneFrames()[0].at).toBe(3n);expect(m.source.originalBytes()).toEqual(before);
 expect(()=>decode(m.protocol.initialValueBytes())).not.toThrow();
});
it('cross-checks the protocol descriptor against its substrate ownership declaration',async()=>{
 const packet=alter('formation-protocol-ownership',v=>{
  const registry=rec(v,155n),authorities=items(f(registry,2n),'set'),owner=rec(authorities[0],154n),leaves=items(f(owner,2n),'set');
  return change(registry,2n,set([change(owner,2n,set([change(leaves[0],3n,true)]))]));
 });
 await expect(compileGeneralDeclarations(packet)).rejects.toThrow(/ownership\/value grammar/);
 const compiled=await compileGeneralDeclarations(buildGeneralDeclarationPacket());
 expect(rec(decode(compiled.protocol.ownershipBytes()),155n).schema.typeId).toBe(155n);
});
