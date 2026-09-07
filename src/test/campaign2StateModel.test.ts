import {describe,it,expect} from 'vitest';
import {canonicalEncode,set,unsigned,type CanonicalValue} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePathPatternValue,statePathValue,type StatePath,type StatePathPattern} from '../substrate/state';
import {mutationAuthorityRegistryValue,mutationAuthorityId,leafValueGrammarValue,compileMutationAuthorityRegistry,type MutationAuthorityDefinition} from '../substrate/mutationAuthority';
import {campaign2Record as r} from '../campaign2/codecs';
import {compileCampaign2StateModel} from '../campaign2/stateModel';
import {fixtureContentContext,fixtureCharacter,fixtureRuntime,fixtureObserver,fixtureVariable,fixtureRoleConstraints,modelId} from './fixtures/campaign2Model';

const pattern=(root:bigint):StatePathPattern=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
const tolerance=pattern(302n),roster=pattern(268n);
const owner:MutationAuthorityDefinition={authorityName:'authority/regulatory-adaptation',ownedLeaves:[{pattern:tolerance,valueGrammar:{kind:'canonical-record',recordTypeId:297n},removalAllowed:true}]};
const ownership=canonicalEncode(mutationAuthorityRegistryValue([owner]));
const readOnly=r('ReadOnlyStateFamilyDefinition',{Pattern:statePathPatternValue(roster),ValueGrammar:leafValueGrammarValue({kind:'canonical-record',recordTypeId:267n})});
const grammar=(p:StatePathPattern,keyGrammar:CanonicalValue)=>r('StateKeyGrammarDefinition',{Pattern:statePathPatternValue(p),KeyGrammar:keyGrammar});
const identityGrammar=r('StateKeyGrammar',{VariantTag:unsigned(1)});
const recordGrammar=r('StateKeyGrammar',{VariantTag:unsigned(2),RecordTypeId:unsigned(292)});
const grammars=[grammar(roster,identityGrammar),grammar(tolerance,recordGrammar)];
const key=(subject:CanonicalValue=fixtureCharacter,variable:CanonicalValue=fixtureVariable)=>r('ToleranceKey',{CharacterId:subject,ExposureReferentId:fixtureRuntime,RegulatoryVariableId:variable});
const path=(root:bigint,value:CanonicalValue):StatePath=>({rootStateTypeId:root,fieldId:1n,selectors:[{kind:'mapKey',key:value}]});
const magnitude=r('ToleranceValue',{Magnitude:unsigned(3)});
const binding=r('CharacterObserverBindingValue',{CharacterId:fixtureCharacter});

describe('FCT-3 PRJ state model and WRT composition',()=>{
  it('IDN model closure requires both exact roles and immutable binding storage',async()=>{
    for(const constraints of [fixtureRoleConstraints.slice(0,-1),fixtureRoleConstraints.slice(1)]){
      const context=await fixtureContentContext(constraints);
      expect(()=>compileCampaign2StateModel(ownership,canonicalEncode(set([readOnly])),canonicalEncode(set(grammars)),context)).toThrow(/IDN requires both/);
    }
    const illicit=mutationAuthorityRegistryValue([{...owner,ownedLeaves:[...owner.ownedLeaves,{pattern:roster,valueGrammar:{kind:'canonical-record',recordTypeId:267n},removalAllowed:false}]}]);
    const context=await fixtureContentContext();
    expect(()=>compileCampaign2StateModel(canonicalEncode(illicit),canonicalEncode(set([])),canonicalEncode(set(grammars)),context)).toThrow(/IDN binding family/);
  });
  it('P7b/P8a: proves grammar coverage both ways and read-only disjointness',async()=>{
    const content=await fixtureContentContext();
    const compile=(gs=grammars,rs=[readOnly])=>compileCampaign2StateModel(ownership,canonicalEncode(set(rs)),canonicalEncode(set(gs)),content);
    expect(()=>compile()).not.toThrow();
    expect(()=>compile(grammars.slice(0,1))).toThrow(/coverage/);
    expect(()=>compile([...grammars,grammar(pattern(303n),recordGrammar)])).toThrow(/coverage/);
    expect(()=>compile([grammars[0],grammar(roster,recordGrammar)])).toThrow(/duplicate/);
    const overlap=r('ReadOnlyStateFamilyDefinition',{Pattern:statePathPatternValue(tolerance),ValueGrammar:leafValueGrammarValue({kind:'canonical-record',recordTypeId:267n})});
    expect(()=>compile(grammars,[overlap])).toThrow(/overlaps/);
  });
  it('P8/P9/P10: admits immutable initial state and validates restored roles without inventing a writer',async()=>{
    const content=await fixtureContentContext(),model=compileCampaign2StateModel(ownership,canonicalEncode(set([readOnly])),canonicalEncode(set(grammars)),content);
    const state=new AuthoritativeState([{path:path(268n,fixtureObserver),value:binding},{path:path(302n,key()),value:magnitude}]);
    expect(()=>model.validateState(state)).not.toThrow();
    const restored=model.restoreState(canonicalEncode(state.canonicalValue()));
    expect(restored.canonicalValue()).toEqual(state.canonicalValue());
    expect(model.read(restored,path(268n,fixtureObserver)).value).toEqual(binding);
    expect(()=>model.applyPatch(state,{operations:[{kind:'remove',path:path(268n,fixtureObserver),expectedOldValue:binding}]},mutationAuthorityId('authority/regulatory-adaptation'))).toThrow(expect.objectContaining({code:'UNDECLARED_WRITABLE_PATH'}));
    expect(()=>model.restorePath(canonicalEncode(statePathValue(path(268n,modelId(1029,'wrong observer')))))).toThrow(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
    const bad=new AuthoritativeState([{path:path(268n,fixtureObserver),value:r('CharacterObserverBindingValue',{CharacterId:fixtureRuntime})}]);
    expect(()=>model.restoreState(canonicalEncode(bad.canonicalValue()))).toThrow(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
  });
  it('P9a/b/c/P11: rejects invalid roles before absence or write permission and names the field',async()=>{
    const model=compileCampaign2StateModel(ownership,canonicalEncode(set([readOnly])),canonicalEncode(set(grammars)),await fixtureContentContext());
    const state=new AuthoritativeState([]),badPath=path(302n,key(fixtureRuntime));
    for(const call of [()=>model.restorePath(canonicalEncode(statePathValue(badPath))),()=>model.read(state,badPath),()=>model.applyPatch(state,{operations:[{kind:'remove',path:badPath,expectedOldValue:magnitude}]},mutationAuthorityId('authority/unknown'))]){
      expect(call).toThrow(expect.objectContaining({code:'CANONICAL_ROLE_VIOLATION'}));
    }
    expect(()=>model.read(state,path(302n,key(fixtureCharacter,modelId(1000,'wrong variable'))))).toThrow(/ToleranceKey.RegulatoryVariableId/);
    expect(state.entries()).toEqual([]);
  });
  it('P11a/P7c: key type precedes contained roles; legacy non-admitting validators stay unchanged',async()=>{
    const model=compileCampaign2StateModel(ownership,canonicalEncode(set([readOnly])),canonicalEncode(set(grammars)),await fixtureContentContext());
    const wrongType=r('SensitizationKey',{CharacterId:fixtureRuntime,ExposureReferentId:fixtureRuntime,RegulatoryVariableId:fixtureVariable});
    const state=new AuthoritativeState([{path:path(302n,wrongType),value:magnitude}]);
    expect(()=>model.validateState(state)).toThrow(expect.objectContaining({code:'INVALID_PATH'}));
    expect(()=>compileMutationAuthorityRegistry([owner]).registry.validateState(state)).not.toThrow();
  });
});
