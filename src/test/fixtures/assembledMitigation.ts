/** M67 fixed M66 time translation+6. Trials1..6; same single conditional task,
 * social stand-in histories7/8/cue9, body30/rate10 sampled9/10; seed0.
 * Only trial reports differ. Physical annex is deliberately non-authoritative. */
import {list,text,unsigned as u,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {fixture as previous,decode,items,key,enc,target} from './assembledAffectSources';
import {MITIGATION_RULES,MITIGATION_REGISTRY} from '../../assembled/model';
import {POSITION,POSITION_SOURCE} from '../../assembled/positionPerception';
import {REAPPRAISAL,REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {changeDefinition} from './assembledCharacter';
export type Mode='effective'|'ineffective'|'zeroBaseline'|'missingAction'|'deniedMotion'|'censored'|'noop'|'hidden';
export function fixture(mode:Mode='effective',law='UncontrolledGain'){
 const b=previous('present',law),s=changeDefinition({...b.s,rulesVersion:MITIGATION_RULES,registrySchemaVersion:MITIGATION_REGISTRY},'definition/configurable-garden',5n,signed(8));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(typeof a[0]==='boolean'||a[0].kind!=='signed')throw Error('input time');if(!(a[0].value===1n&&key(a[2])===key(PRIORITY_DISPLAY)))a[0]=signed(a[0].value+6n);return list(a);});
 for(let i=1;i<=6;i++){
  const stage=['Before','Motion','After'][(i-1)%3],mit=i>3,risk=mit?mode==='ineffective':mode!=='zeroBaseline';
  const annex=list([u(mode==='hidden'?0:mit?2:1),mode==='hidden'?!risk:risk,u(mit?2:1),!(mit&&mode==='missingAction'),true,!(mit&&mode==='noop'),!(mit&&mode==='censored'),risk]);
  rows.push(list([signed(i),u(10),POSITION_SOURCE,list([text(POSITION),list([]),list([u(1),text(stage),true,!(i===5&&mode==='deniedMotion')]),annex]),list([])]));
  rows.push(list([signed(i),u(30),REAPPRAISAL_SOURCE,list([text(REAPPRAISAL),u(0),false,false,false,u(0),false,false,false,list([u(0),false])]),list([])]));
 }
 return {s,d:{...b.d,orderedInputs:enc(list(rows))}};
}
export {decode,items,key,enc,target};
