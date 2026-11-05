/** Versioned source boundary only; perception and recognition remain one shared execution. */
import {list,type CanonicalValue} from '../substrate/canonicalEncoding';
import {dataItems as items,invalidModel} from '../campaign2/canonicalData';
import {recognitionSource,type RecognitionSettings} from './recognition';
import {roleChannel} from './encoding';
import {supportSource} from './attachment';
import {relationshipSetting} from './relationship';
export const ENCOUNTER_VERSION='assembled-character-encounter/0.1-candidate';
export function encounterSource(v:CanonicalValue,settings:RecognitionSettings,encoding=false,attachment=false){
 const a=items(v,'list');if(a.length!==(attachment?9:encoding?8:7))invalidModel('encounter source grammar');
 return {...recognitionSource(list(a.slice(0,6)),settings),relationship:relationshipSetting(a[6]),role:encoding?roleChannel(a[7]):undefined,support:attachment?supportSource(a[8]):undefined};
}
