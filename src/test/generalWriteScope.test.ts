import {it,expect} from 'vitest';
import {validateGeneralWriteScope as validate} from '../campaign3/generalWriteScope';
import {generalAttentionRecord as r,generalAttentionRawRecord as raw,generalAttentionSchema as schema,decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {attentionRecord} from '../campaign3/attentionCodecs';
import {campaign2Record} from '../campaign2/codecs';
import {canonicalEncode as enc,typedIdentifier as tid,text,unsigned as u,set,list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {statePathPatternValue,type StatePathPattern} from '../substrate/state';
const id=(ns:number,s:string)=>tid(ns,text(s));
const readOnly=()=>campaign2Record('WriteCapabilityV06',{VariantTag:u(1)});
const learning=(authority:string,family='episodic-memory')=>campaign2Record('WriteCapabilityV06',{VariantTag:u(2),MutationAuthority:id(1025,authority),WritableFamilies:set([id(1031,family)])});
const pattern=(root:string,selector:StatePathPattern['selectors'][number]={kind:'wildcard',selectorKind:'mapKey'})=>statePathPatternValue({rootStateTypeId:schema(root).typeId,fieldId:1n,selectors:[selector]});
const paths=(authority:string,values:CanonicalValue[])=>r('GeneralPathWriteCapability',[id(1025,authority),set(values)]);
it('GWS-A: physical path capability is expressible in706 and does not rewrite704',()=>{
 const cap=paths('authority/general-attention-local-reserve',[pattern('LocalReserveState')]);validate('local-reserve-replenishment',cap);
 const ref=attentionRecord(254,[u(705),u(1)]),values=[u(67),id(1036,'seam/general-attention-local-reserve-replenishment'),text('local/1'),id(1001,'event/general-attention-local-reserve-replenishment'),u(110),ref,list([]),set([]),cap];
 const fields=new Map(values.map((v,i)=>[BigInt(i+1),v]));fields.set(11n,list([]));
 const wrapper=raw('GeneralStageRegistrationV02',fields,{admittedVersions:['local/1']});
 expect(enc(decode(enc(wrapper),{admittedVersions:['local/1']}))).toEqual(enc(wrapper));
 expect(()=>raw('GeneralStageRegistration',fields,{admittedVersions:['local/1']})).toThrow();
});
it('GWS-B: read-only, learning-family and path capabilities cannot substitute for each other',()=>{
 validate('world',readOnly());validate('ordinary-memory-formation',learning('authority/general-attention-ordinary-memory'));
 expect(()=>validate('world',learning('authority/general-attention-ordinary-memory'))).toThrow();expect(()=>validate('local-reserve-replenishment',readOnly())).toThrow();
 expect(()=>validate('ordinary-memory-formation',paths('authority/general-attention-ordinary-memory',[pattern('GeneralEpisodeState')]))).toThrow();
 expect(()=>validate('ordinary-memory-formation',learning('authority/general-attention-association'))).toThrow();
 expect(()=>validate('ordinary-memory-formation',learning('authority/general-attention-ordinary-memory','associations'))).toThrow();
});
it('GWS-C: physical and perception scopes reject cognitive/protocol roots and wrong authorities',()=>{
 for(const root of['GeneralEpisodeState','FormationGovernanceState','GeneralTrackingState'])expect(()=>validate('local-reserve-replenishment',paths('authority/general-attention-local-reserve',[pattern(root)]))).toThrow();
 validate('current-track',paths('authority/perception',[pattern('GeneralTrackingState'),pattern('TrialPanelContextState')]));
 expect(()=>validate('current-track',paths('authority/perception',[pattern('LocalReserveState')]))).toThrow();
 expect(()=>validate('current-track',paths('authority/general-attention-local-reserve',[pattern('GeneralTrackingState')]))).toThrow();
 validate('goal-command-owner',paths('authority/general-attention-goal-lifecycle',[pattern('MaintenanceGoalState')]));
 expect(()=>validate('goal-command-owner',paths('authority/general-attention-goal-lifecycle',[pattern('FormationGovernanceState')]))).toThrow();
});
it('GWS-D: empty permissions, wrong selector grammar and unknown stages reject',()=>{
 expect(()=>paths('authority/perception',[])).toThrow();
 expect(()=>validate('current-track',paths('authority/perception',[pattern('GeneralTrackingState',{kind:'wildcard',selectorKind:'typedEntity'})]))).toThrow();
 expect(()=>validate('unknown-stage',readOnly())).toThrow();
});
