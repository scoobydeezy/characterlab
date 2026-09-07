import {canonicalEncode as enc,list,set,unsigned} from '../../substrate/canonicalEncoding';
import {statePathPatternValue} from '../../substrate/state';
import {leafValueGrammarValue} from '../../substrate/mutationAuthority';
import {firstTraceModel} from '../../campaign2/firstTraceModel';
import {namespaceRole} from '../../campaign2/firstModelCandidate';
import {decodeCampaign2,campaign2Record as r} from '../../campaign2/codecs';
import {dataItems as items} from '../../campaign2/canonicalData';
export function withRoster(){
 const source=firstTraceModel(),slots=[...items(decodeCampaign2(source.registry),'list')],pattern=statePathPatternValue({rootStateTypeId:268n,fieldId:1n,selectors:[{kind:'wildcard',selectorKind:'mapKey'}]});
 slots[3]=set([r('ReadOnlyStateFamilyDefinition',{Pattern:pattern,ValueGrammar:leafValueGrammarValue({kind:'canonical-record',recordTypeId:267n})})]);
 slots[4]=set([...items(slots[4],'set'),r('StateKeyGrammarDefinition',{Pattern:pattern,KeyGrammar:r('StateKeyGrammar',{VariantTag:unsigned(1)})})]);
 slots[5]=set([...items(slots[5],'set'),r('CanonicalRoleConstraint',{Position:r('CanonicalRolePosition',{VariantTag:unsigned(2),RootStateTypeId:unsigned(268),FieldId:unsigned(1)}),Role:namespaceRole(1000)})]);
 return {...source,registry:enc(list(slots))};
}
