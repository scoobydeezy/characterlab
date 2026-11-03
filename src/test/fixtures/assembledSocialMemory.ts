import {peopleSource} from './assembledPersonHistory';
import {interactionData} from './assembledInteraction';
import {DISPLAY} from '../../assembled/strategy';
/** M42: one holder, perceived stand-in identified by coat, three task mappings.
 * Reserve10, sensed at8; claims F/F/T at1/2/3, repeated receipt3 at6; choice8 only.
 * No learned initial state, autonomous peer or authored recollection. */
import {list,text,signed,unsigned,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {SOCIAL_MEMORY_RULES,SOCIAL_MEMORY_REGISTRY} from '../../assembled/model';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {BODY_SAMPLE} from '../../assembled/body';
import {REAPPRAISAL_SOURCE} from '../../assembled/reappraisal';
import {RETENTION} from '../../assembled/retention';
import {RETRIEVAL} from '../../assembled/retrieval';
import {sid} from '../../assembled/skill';
import {source as baseSource,data as baseData,decode,items,key,enc,tasks} from './assembledReappraisal';
import {catalogData,target} from './assembledRecognitionCatalog';
import {data as bodyData} from './assembledTolerance';
import {changeDefinition} from './assembledCharacter';
let cachedSource:ReturnType<typeof baseSource>|undefined,cachedData:ReturnType<typeof baseData>|undefined,cachedSocial:ReturnType<typeof catalogData>|undefined,cachedBody:ReturnType<typeof bodyData>|undefined;
export function source(slots=1,capacity=8,workspace=5){const s=changeDefinition(cachedSource??(cachedSource=baseSource()),'definition/task-workspace',2n,unsigned(workspace)),a=[...items(decode(s.registry),'list')];a[19]=items(decode(peopleSource().registry),'list')[19];a[8]=list([text(RETENTION),unsigned(8),unsigned(capacity),unsigned(2)]);a[9]=list([text(RETRIEVAL),unsigned(slots)]);return {...s,rulesVersion:SOCIAL_MEMORY_RULES,registrySchemaVersion:SOCIAL_MEMORY_REGISTRY,registry:enc(list(a))};}
export function data(mode:'main'|'hidden'|'wrong'|'denied'='main'){
 const d=cachedData??(cachedData=baseData()),social=cachedSocial??(cachedSocial=catalogData(false,0,[1,2,3,6].map(at=>({at,signals:[['appearance/coat',true]],continuity:at>1,participant:false})))),body=cachedBody??(cachedBody=bodyData());
 const rows=items(decode(d.orderedInputs),'list').filter(v=>{const r=items(v,'list');return !(key(r[1])===key(unsigned(30))&&key(r[0])!==key(signed(8))&&key(r[2])!==key(DISPLAY))&&key(r[2])!==key(REAPPRAISAL_SOURCE)&&(key(r[2])!==key(sid(1001,'event/deliberation-opportunity'))||key(r[0])===key(signed(8)));});
 for(const v of items(decode(social.orderedInputs),'list')){const r=[...items(v,'list')];if(key(r[2])!==key(SOCIAL_SOURCE))continue;const at=r[0];if(typeof at==='boolean'||at.kind!=='signed')throw Error('time');const p=[...items(r[3],'list')],o=[...items(p[1],'list')];o[1]=mode!=='hidden';o[2]=unsigned(1);o[3]=unsigned(at.value<=2n?4:3);o[4]=unsigned(at.value===6n?(mode==='wrong'?4:3):at.value);o[5]=!(mode==='denied'&&at.value===6n);if(mode==='wrong'&&at.value===6n)o[3]=unsigned(0);p[1]=list(o);r[3]=list(p);rows.push(list(r));}
 const probe=items(decode(interactionData(0,0).orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(sid(1001,'event/regulatory-diagnostic-probe')))!;rows.push(probe);
 const sample=items(items(decode(body.orderedInputs),'list').find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');rows.push(list([signed(8),...sample.slice(1)]));
 return {...d,orderedInputs:enc(list(rows))};
}
export {decode,items,key,enc,tasks,target};
