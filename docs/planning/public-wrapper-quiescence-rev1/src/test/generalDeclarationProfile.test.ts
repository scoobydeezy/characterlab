import {it,expect} from 'vitest';
import {buildGeneralRegistrations,buildGeneralRoles,generalBindingContext,generalStagePaths,generalStageAccessors,generalSubject,generalRecord as r,generalDefinitionId as d,generalContentId as c,generalId as id} from '../campaign3/generalBindingProfile';
import {buildGeneralDefinitionEntries,buildGeneralContent,generalRecipeNames} from '../campaign3/generalDefinitionProfile';
import {compileGeneralAccessors} from '../campaign3/generalAccessors';
import {canonicalEncode as enc,set,list,record,unsigned as u,signed,rational as q,text,map,type CanonicalValue} from '../substrate/canonicalEncoding';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {compileGeneralStageRegistrations} from '../campaign3/generalRegistration';
import {buildGeneralDeclarationPacket,compileGeneralDeclarations} from '../campaign3/generalDeclarations';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {semanticReferentFromAuthoredContent as referent} from '../substrate/referentOrigin';
import {decodeReceiving} from '../campaign3/receivingCodecs';
import {AuthoritativeState,type StatePath} from '../substrate/state';
const change=(value:CanonicalValue,field:bigint,next:CanonicalValue)=>{if(typeof value==='boolean'||value.kind!=='record')throw Error('test record');return record(value.schema,new Map([...value.fields,[field,next]]));};
function definition(name:string,mutate:(v:CanonicalValue)=>CanonicalValue){
 const packet={...buildGeneralDeclarationPacket()},rows=items(decode(packet.definitions,generalBindingContext()),'set');
 return {...packet,definitions:enc(set(rows.map(row=>key(f(rec(row,171n),1n))===key(d(name))?change(row,4n,mutate(f(rec(row,171n),4n))):row)))};
}
it('constructs and binds the concrete 67-stage declaration profile',()=>{
 const context=generalBindingContext(),bindings=buildGeneralRegistrations();
 const registry=enc(set([...bindings.values()].map(b=>decode(b,context))));
 expect(compileGeneralStageRegistrations(registry,bindings,context).stageNames).toHaveLength(67);
 for(const name of bindings.keys())compileGeneralAccessors(name,generalStageAccessors(name),generalStagePaths(name).reads,generalSubject(),context);
 decode(enc(buildGeneralRoles()),context);decode(enc(buildGeneralContent()),context);
 for(const recipe of generalRecipeNames())buildGeneralDefinitionEntries(recipe);
});
it('admits the concrete content and declaration packet',async()=>{
 const compiled=await compileGeneralDeclarations(buildGeneralDeclarationPacket());
 expect(compiled.stageNames).toHaveLength(67);
 compiled.qualifyCharacter(generalSubject().character);
});
it.each(generalRecipeNames())('admits concrete calibration recipe %s without issuing a model identity',async recipe=>{
 const compiled=await compileGeneralDeclarations(buildGeneralDeclarationPacket(recipe));
 expect(compiled.recipe).toBe(recipe);expect(compiled).not.toHaveProperty('modelIdentity');
});
it.each([
 ['goal self identity','goal',1n,d('task'),/specification self/],
 ['goal holder','goal',2n,r(557,[referent(c('scene-a')),referent(c('goal'))]),/goal holder/],
 ['goal wrong kind','goal',2n,r(557,[generalSubject().character,referent(c('task'))]),/wrong committed kind/],
 ['goal uncommitted','goal',2n,r(557,[generalSubject().character,referent(c('missing'))]),/uncommitted/],
 ['goal signal','goal',3n,id(1045,'interoceptive-signal/foreign'),/goal signal/],
 ['reversed desired range','goal',4n,r(556,[q(40,1),q(30,1)]),/desired interval/],
 ['outside signal domain','goal',4n,r(556,[q(30,1),q(101,1)]),/desired interval/],
 ['expired at activation','goal',6n,signed(1),/active\/expiry/],
 ['task holder','task',1n,c('scene-a'),/task holder/],
 ['prediction holder','prediction',2n,referent(c('scene-a')),/prediction holder/],
 ['spatial ordering','spatial',1n,u(7),/spatial bounds/],
 ['cross calibration scale','event-recall',2n,u(99),/scale disagreement/],
] as const)('rejects codec-valid %s',async(_label,name,field,value,error)=>{
 const packet=definition(name,v=>change(v,field,value));
 decode(packet.definitions,generalBindingContext());
 await expect(compileGeneralDeclarations(packet)).rejects.toThrow(error);
});
it('rejects delegated goal content pointing to a different holder or specification',async()=>{
 for(const [field,value] of [[12n,list([c('scene-a')])],[16n,list([d('task')])]] as const){
  const packet={...buildGeneralDeclarationPacket()};packet.content=enc(set(items(decode(packet.content),'set').map(row=>key(f(rec(row,170n),1n))===key(c('goal'))?change(row,field,value):row)));
  await expect(compileGeneralDeclarations(packet)).rejects.toThrow(/coupling|delegation/);
 }
});
it('rejects dangling, duplicate and coherently renamed definitions',async()=>{
 for(const mode of ['missing','duplicate','renamed']){
  const packet={...buildGeneralDeclarationPacket()},rows=items(decode(packet.definitions,generalBindingContext()),'set'),goal=rows.find(row=>key(f(rec(row,171n),1n))===key(d('goal')))!;
  packet.definitions=enc(set(mode==='duplicate'?[...rows,change(goal,3n,text('other-version'))]:rows.flatMap(row=>row===goal?(mode==='missing'?[]:[change(row,1n,d('other-goal'))]):[row])));
  await expect(compileGeneralDeclarations(packet)).rejects.toThrow(/duplicate|missing definition/);
 }
});
it('rejects missing domain roles and checks nested scalar and state-map roles',async()=>{
 const packet={...buildGeneralDeclarationPacket()},rows=items(decode(packet.roles),'set');
 await expect(compileGeneralDeclarations({...packet,roles:enc(set(rows.slice(1)))})).rejects.toThrow(/role coverage/);
 const compiled=await compileGeneralDeclarations(packet);
 compiled.validateRecordRoles(enc(r(557,[generalSubject().character,referent(c('goal'))])));
 expect(()=>compiled.validateRecordRoles(enc(r(557,[generalSubject().character,referent(c('task'))])))).toThrow(/wrong committed kind/);
 expect(()=>compiled.validateRecordRoles(enc(r(633,[map([[referent(c('scene-a')),r(560,[list([])])]])])))).toThrow(/wrong committed kind/);
 expect(()=>compiled.qualifyCharacter(referent(c('goal')))).toThrow(/wrong committed kind/);
});
it('compares caller registrations against compiler-owned bindings',async()=>{
 for(const field of [3n,8n,10n,11n]){
  const packet={...buildGeneralDeclarationPacket()},rows=items(decode(packet.registrations,generalBindingContext()),'set');
  const changed=field===3n?text('task-cognitive-path/0.1-candidate'):field===8n?set([]):field===10n?r(266,[u(1),r(149,[u(268),u(1),list([r(150,[u(2)])])]),u(1),r(263,[u(1002)]),id(1028,'ResolvedCharacterSubject')]):list([]);
  // Pick a stage that has both reads and definitions, so each mutation is real.
  const target=rec(decode(buildGeneralRegistrations().get('current-event-rank')!,generalBindingContext()),706n);
  packet.registrations=enc(set(rows.map(row=>key(f(rec(row,706n),1n))===key(f(target,1n))?change(row,field,changed):row)));
  await expect(compileGeneralDeclarations(packet)).rejects.toThrow(/implementation binding/);
 }
});
it('snapshots declarations before asynchronous content commitment',async()=>{
 const packet={...buildGeneralDeclarationPacket()},before=packet.definitions.slice(),pending=compileGeneralDeclarations(packet);
 packet.definitions.fill(0);packet.content.fill(0);const compiled=await pending;
 expect(compiled.declarationBytes('definitions')).toEqual(before);
 compiled.declarationBytes('definitions').fill(0);expect(compiled.declarationBytes('definitions')).toEqual(before);
 expect(()=>compiled.accessorBinding('unknown')).toThrow();
});
it('extends only inherited canonical payload slots and preserves prior rejection',()=>{
 const value=r(171,[d('spatial'),id(1023,'registry/general-attention-definition'),text('general-attention-carrier/0.1-candidate'),r(687,[u(0),u(3),u(0),u(7),q(1,1),q(1,5)])]);
 expect(()=>decode(enc(value),generalBindingContext())).not.toThrow();
 expect(()=>decodeReceiving(enc(value))).toThrow();
 // An added record is still forbidden as an inherited typed operand.
 expect(()=>decode(enc(r(370,[c('subject'),d('prediction'),r(556,[q(0,1),q(1,1)]),q(6,1),signed(2),signed(21)])),generalBindingContext())).toThrow();
 expect(()=>decode(enc(change(value,4n,r(519,[u(0),u(1),text('invalid')]))),generalBindingContext())).toThrow(/closed algorithm/);
});
it('enforces subject projection even at a stage with no owner-ledger read',async()=>{
 const compiled=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),who=generalSubject();
 const binding=compiled.accessorBinding('current-visual-selection');
 expect(()=>binding.construct(new AuthoritativeState([]),who.observer,3n)).toThrow(/missing subject roster/);
 const path:StatePath={rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'mapKey',key:who.observer}]};
 const state=new AuthoritativeState([{path,value:r(267,[who.character])}]);
 expect(binding.construct(state,who.observer,3n).actualReadRecords()).toHaveLength(1);
 expect(compiled.accessorBinding('world').construct(state,who.observer,3n).actualReadRecords()).toHaveLength(0);
});
it('rejects foreign SEM keys beneath wildcard declarations and enforces leaf grammars',async()=>{
 const compiled=await compileGeneralDeclarations(buildGeneralDeclarationPacket()),who=generalSubject();
 const path=(root:number,key:CanonicalValue,field=1):StatePath=>({rootStateTypeId:BigInt(root),fieldId:BigInt(field),selectors:[{kind:'mapKey',key}]});
 compiled.validateStateLeaf(path(241,who.observer),u(0));
 compiled.validateStateLeaf(path(241,r(212,[who.observer,u(0)]),2),true);
 expect(()=>compiled.validateStatePath(path(241,r(212,[id(1000,'observer/foreign'),u(0)]),2))).toThrow(/SEM file observer/);
 expect(()=>compiled.validateStateLeaf(path(241,r(212,[who.observer,u(0)]),2),false)).toThrow(/membership/);
 expect(()=>compiled.validateStateLeaf(path(630,who.character),r(560,[list([])]))).toThrow(/555/);
 expect(()=>compiled.validateStatePath(path(649,r(644,[who.character,id(1044,'local-reserve/foreign')])))).toThrow(/outside declared/);
 expect(()=>compiled.validateStatePath(path(630,referent(c('scene-a'))))).toThrow(/outside declared/);
 expect(()=>compiled.validateStatePath(path(581,who.character))).toThrow(/outside declared/);
});

