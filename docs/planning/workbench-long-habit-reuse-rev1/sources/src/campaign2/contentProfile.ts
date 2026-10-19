/** First Campaign-2 character-content boundary under content-definition-id/0.1-candidate.
 * Internal data-only component, not a model activation API or universal CONTENT rule.
 */
import {canonicalEncode} from '../substrate/canonicalEncoding';
import {validateGovernedContentDefinitionId} from '../substrate/contentDefinitionId';
import {ContentValidationError} from '../substrate/contentManifest';
import {decodeCampaign2} from './codecs';
import {compileValDeclarations} from './valDeclarations';
import {dataItems,dataRecord,dataField} from './canonicalData';

export async function compileFirstCampaign2Content(contentBytes:Uint8Array,valEntryBytes:Uint8Array,
  declarationBytes:Uint8Array,completeRegistryBytes:Uint8Array){
  // Decode/copy before asynchronous compilation. Profile restriction precedes generic
  // content commitment; VAL remains responsible for the exact admitted character kind.
  const content=decodeCampaign2(contentBytes);
  for(const value of dataItems(content,'set')){
    const definition=dataRecord(value,170n);
    try{validateGovernedContentDefinitionId(dataField(definition,1n));}
    catch{throw new ContentValidationError('first Campaign-2 character content requires GovernedContentDefinitionId');}
  }
  return compileValDeclarations(valEntryBytes,declarationBytes)
    .compileContent(canonicalEncode(content),completeRegistryBytes);
}
