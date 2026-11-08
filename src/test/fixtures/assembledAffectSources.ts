/** M66: fixed M65 history, two social tasks/one physical target, body30 or100.
 * Probe1, risk1, observed empty mitigation catalogue1, body3/4, appraisal3/4.
 * New model changes shared-source semantics, never fixture-name dispatch. */
import {list,unsigned as u,signed,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {fixture as previous,decode,items,key,enc,target} from './assembledAffectCorrespondence';
import {changeDefinition} from './assembledCharacter';
import {SHARED_AFFECT_RULES,SHARED_AFFECT_REGISTRY} from '../../assembled/model';
import {REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {BODY_SAMPLE,bodyPath} from '../../assembled/body';
import {receivingRecord as rec,cognitiveRecord as r} from '../../assembled/codecs';
import {dataField as f} from '../../campaign2/canonicalData';
import {C} from './campaign2Cognitive';
export type Mode='main'|'high'|'wide'|'unknown'|'present'|'deniedBody'|'hidden';
export function fixture(mode:Mode='main',law='UncontrolledGain'){
 const b=previous(law,mode==='hidden'?'hidden':'main');
 let s={...b.s,rulesVersion:SHARED_AFFECT_RULES,registrySchemaVersion:SHARED_AFFECT_REGISTRY};
 s=changeDefinition(s,'definition/configurable-garden',3n,q(mode==='wide'?0:10,1));
 s=changeDefinition(s,'definition/configurable-garden',4n,q(10,1));
 s=changeDefinition(s,'definition/configurable-garden',5n,signed(2));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const row=[...items(v,'list')];if(key(row[2])===key(REAPPRAISAL_SOURCE))row[3]=list([...items(row[3],'list'),list([u(mode==='present'?2:1),mode!=='unknown'])]);return list(row);});
 const sample=items(rows.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 if(mode!=='deniedBody')rows.push(list([signed(3),...sample.slice(1)]));
 const before=restoreAuthoritativeState(decode(b.d.initialState)),path=bodyPath(C);
 const initial=new AuthoritativeState(before.entries().map(e=>e.path.rootStateTypeId===path.rootStateTypeId?{...e,value:r(454,[q(mode==='high'?100:30,1),f(rec(e.value,454n),2n)])}:e));
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue()),orderedInputs:enc(list(rows))}};
}
export {decode,items,key,enc,target};
