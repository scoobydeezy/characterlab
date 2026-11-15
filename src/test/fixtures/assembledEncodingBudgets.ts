/** M122 plan6d43b3c4: one holder, two social tasks/third unknown.
 * Body10/sample4; seed0; A true1/B false2/A reminder3/judgment4.
 * Only A's permitted footprint changes; focal Actor and all laws fixed per model. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target,type Run,type CanonicalValue} from './assembledCompetingAttention';
import {ENCODING_BUDGET_RULES,ENCODING_BUDGET_REGISTRY} from '../../assembled/model';
import {BUDGET_ENCODING,type EncodingSettings} from '../../assembled/encoding';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {unsigned as u} from '../../substrate/canonicalEncoding';
import type {EncodingBudget} from '../../campaign3/encodingAccessMath';
import type {SelectedBudgetCalibration} from '../../campaign3/selectedEncodingBudgetControl';
export type Mode='sparse'|'dense'|'denied'|'hidden';
export function fixture(mode:Mode='dense',law:EncodingBudget='historical-shared',calibration:SelectedBudgetCalibration='UnitBudget',capacity=2,attention:EncodingSettings['attention']='role-calibrated'){
 const b=prior(mode==='sparse'?'none':mode==='dense'?'low':mode,capacity),slots=[...items(decode(b.s.registry),'list')];
 slots[30]=list([text(BUDGET_ENCODING),u(capacity),text(attention),text(law),text(calibration)]);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')];if(key(a[2])===key(SOCIAL_SOURCE)&&key(a[0])===key(signed(1))){const p=[...items(a[3],'list')],roles=[...items(p[7],'list')];roles[1]=u(1);p[7]=list(roles);a[3]=list(p);}return list(a);});
 return {s:{...b.s,rulesVersion:ENCODING_BUDGET_RULES,registrySchemaVersion:ENCODING_BUDGET_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))},legacy:b};
}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,bytes,outputs,C,exact,target};
export type {Run,CanonicalValue,EncodingBudget,SelectedBudgetCalibration};
