import {list,set,text,unsigned,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import type {ComparisonDrawMap} from '../../substrate/random';
import {DELAYED_BODY_RULES,DELAYED_BODY_REGISTRY} from '../../assembled/model';
import {DELAYED_ACTION_BODY} from '../../assembled/actionBody';
import {BODY_SAMPLE} from '../../assembled/body';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {HABIT_SOURCE} from '../../assembled/habit';
import {source as oldSource,data as oldData,decode,items,key,enc} from './assembledCausalOpportunities';
import {signedValue} from './assembledComparison';
export function source(delay=2,permitted=true,amount=80){const s=oldSource(),slots=[...items(decode(s.registry),'list')],a=items(slots[10],'list');slots[10]=list([text(DELAYED_ACTION_BODY),permitted,set(items(a[2],'set').map(v=>list([items(v,'list')[0],q(amount,1),unsigned(delay)])))]);return {...s,rulesVersion:DELAYED_BODY_RULES,registrySchemaVersion:DELAYED_BODY_REGISTRY,registry:enc(list(slots))};}
export function data(sense=true,map?:ComparisonDrawMap){const d=oldData('none'),rows=items(decode(d.orderedInputs),'list').flatMap(v=>{const a=[...items(v,'list')];if(!sense&&key(a[2])===key(BODY_SAMPLE)&&signedValue(a[0])>3n)return [];if(key(a[2])===key(PRACTICE_SETTING)){const p=[...items(a[3],'list')];p[3]=q(0,1);a[3]=list(p);}if(key(a[2])===key(HABIT_SOURCE)){const p=[...items(a[3],'list')];p[3]=true;p[4]=false;a[3]=list(p);}return [list(a)];});return {...d,orderedInputs:enc(list([...(map?[map.canonicalValue]:[]),...rows]))};}
export function actuator(s:ReturnType<typeof source>,change:(a:CanonicalValue[])=>CanonicalValue[]){const slots=[...items(decode(s.registry),'list')];slots[10]=list(change([...items(slots[10],'list')]));return {...s,registry:enc(list(slots))};}
export {decode,items,key,enc};
