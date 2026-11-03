/** M44: M43 fixed scenario; observed role is separate from physical role.
 * One holder, two social tasks, third unknown; coat stand-in; reserve10/body4;
 * A true1/B false2/Q silent3, risk1, deliberate3/4, seed0. */
import {list,text,unsigned,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {source as priorSource,data as priorData,decode,items,key,enc,target} from './assembledAffectMemory';
import {ENCODING_RULES,ENCODING_REGISTRY} from '../../assembled/model';
import {ENCODING} from '../../assembled/encoding';
import {SOCIAL_SOURCE} from '../../assembled/social';
export function source(capacity=1,attention='role-calibrated'){const s=priorSource(),a=[...items(decode(s.registry),'list')];a.push(list([text(ENCODING),unsigned(capacity),text(attention)]));return {...s,rulesVersion:ENCODING_RULES,registrySchemaVersion:ENCODING_REGISTRY,registry:enc(list(a))};}
export type Mode='main'|'unknown'|'hidden'|'target'|'unsupported'|'no-cue';
export function data(mode:Mode='main'){const d=priorData(),rows:CanonicalValue[]=[];for(const v of items(decode(d.orderedInputs),'list')){const r=[...items(v,'list')];if(key(r[2])===key(SOCIAL_SOURCE)){const a=key(r[0])===key(signed(1)),cue=key(r[0])===key(signed(3));if(mode==='no-cue'&&cue)continue;const role=cue?0:a&&mode==='unknown'?0:a&&mode==='target'?2:a&&mode==='unsupported'?4:1;r[3]=list([...items(r[3],'list'),list([unsigned(mode==='hidden'?4:1),unsigned(role)])]);}rows.push(list(r));}return {...d,orderedInputs:enc(list(rows))};}
export {decode,items,key,enc,target};
