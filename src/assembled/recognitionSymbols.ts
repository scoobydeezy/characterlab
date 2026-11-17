/** Initial reservations and immutable run-owned C1 knowledge; no identity lookup from truth. */
import {type AuthoritativeState,statePathValue} from '../substrate/state';
import {text,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataIdentity as id,dataText as txt,dataUnsigned as uint,dataKey as key} from '../campaign2/canonicalData';
import {identitySymbolMappingPath,candidateCatalogEntryPath} from '../semanticBinding/semanticStateAuthority';
import {semanticRecordValue as sr,semanticOccurrenceId as occ,semanticTypedId as tid,observerIdValue} from '../semanticBinding/semanticCodecs';
import type {ObserverIdentitySymbolMapping} from '../semanticBinding/recognition';
import {OBSERVER,RECOGNITION_SYMBOL_VERSION,demand,type RecognitionSettings} from './recognition';
export function reserveSymbolMappings(settings:RecognitionSettings,nextRuntimeId=0n){
 const slots=(settings.symbols??[]).map(symbol=>{const occurrence=nextRuntimeId++;return {symbol,occurrence,path:identitySymbolMappingPath(OBSERVER,symbol)};});
 return {slots,nextRuntimeId};
}
export function symbolMappingValue(symbol:string,candidate:CanonicalValue,occurrence:bigint){
 return sr('ObserverIdentitySymbolMapping',{ObserverSymbolCandidateMappingId:occ('ObserverSymbolCandidateMappingId',occurrence),ObserverId:observerIdValue(OBSERVER),PerceivedIdentitySymbolId:tid('PerceivedIdentitySymbolId',text(symbol)),CandidateSemanticReferentId:candidate,MappingVersion:text(RECOGNITION_SYMBOL_VERSION)});
}
export function readSymbolMapping(value:CanonicalValue):ObserverIdentitySymbolMapping{
 const v=rec(value,229n);return {observerSymbolCandidateMappingId:uint(id(f(v,1n)).payload),observerId:txt(id(f(v,2n)).payload),perceivedIdentitySymbolId:txt(id(f(v,3n)).payload),candidateSemanticReferentId:key(f(v,4n)),mappingVersion:txt(f(v,5n))};
}
export function validateSymbolKnowledge(state:AuthoritativeState,settings:RecognitionSettings){
 const reserved=reserveSymbolMappings(settings).slots;
 for(const e of state.entries().filter(e=>e.path.rootStateTypeId===243n&&e.path.fieldId===2n)){
  const slot=reserved.find(x=>key(statePathValue(x.path))===key(statePathValue(e.path)));demand(!!slot,'mapping path');
  const v=rec(e.value,229n),candidate=f(v,4n);demand(settings.candidates.some(c=>key(c)===key(candidate)),'mapping candidate');
  demand(!settings.openCatalog||state.read(candidateCatalogEntryPath(OBSERVER,key(candidate))).presence,'mapping candidate absent from actual catalog');
  demand(key(e.value)===key(symbolMappingValue(slot!.symbol,candidate,slot!.occurrence)),'mapping schema/observer/occurrence/version');
 }
}
