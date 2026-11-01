import {list,text,unsigned,signed} from '../../substrate/canonicalEncoding';
import {FORMATION_RULES,FORMATION_REGISTRY} from '../../assembled/model';
import {FORMATION} from '../../assembled/formation';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {source as priorSource,data as priorData,decode,items,key,enc} from './assembledSelfBelief';
export const source=()=>{const s=priorSource();return {...s,rulesVersion:FORMATION_RULES,registrySchemaVersion:FORMATION_REGISTRY,registry:enc(list([...items(decode(s.registry),'list'),list([text(FORMATION)])]))};};
export function data(early=true,seed=0,visible=true,pressure=false){const d=priorData(visible,seed,1,pressure);return {...d,orderedInputs:enc(list(items(decode(d.orderedInputs),'list').map(v=>{const row=[...items(v,'list')];if(key(row[2])===key(PRACTICE_SETTING)){const p=[...items(row[3],'list')];p[1]=unsigned(early&&key(row[0])===key(signed(3))?0:4);row[3]=list(p);}return list(row);}))) };}
export {decode,items,key,enc};
