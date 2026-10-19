/** PRJ projection/0.3-candidate-addendum exact role compatibility. */
import {decodeCampaign2} from './codecs';
import {dataRecord,dataField,dataUnsigned,dataKey} from './canonicalData';
export function identityRolesCompatible(storedBytes:Uint8Array,consumerBytes:Uint8Array):boolean {
  const stored=dataRecord(decodeCampaign2(storedBytes),263n),consumer=dataRecord(decodeCampaign2(consumerBytes),263n);
  if(dataUnsigned(dataField(stored,1n))!==dataUnsigned(dataField(consumer,1n)))return false;
  const required=consumer.fields.get(2n),provided=stored.fields.get(2n);
  return required===undefined||(provided!==undefined&&dataKey(required)===dataKey(provided));
}
