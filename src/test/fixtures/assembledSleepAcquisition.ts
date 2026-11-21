/** M213: nonsocial M212 scene; first adoption14, load800 then0 at16. */
import {fixture as prior,decode,items,key,enc,list,text,u} from './assembledProtectiveIdentity';
import {SLEEP_ACQUISITION_RULES,SLEEP_ACQUISITION_REGISTRY} from '../../assembled/model';
import {SLEEP_ACQUISITION} from '../../assembled/sleepControl';
import {CONTROL_SOURCE} from '../../assembled/control';
import {IDENTITY_CONTEXT,EXPERIMENT} from '../../assembled/identityEligibility';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
const prepared=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export function fixture(enabled=true,cancel=false){
 const b=prior(),slots=[...items(decode(b.s.registry),'list')],s=[...items(slots[55],'list')];s[0]=text(SLEEP_ACQUISITION);s.push(enabled);slots[55]=list(s);
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=[...items(v,'list')],at=(a[0] as {value:bigint}).value;
  if(key(a[2])===key(CONTROL_SOURCE)){const p=[...items(a[3],'list')];if(at===13n)p[1]=u(0);if(at===14n){p[1]=u(1);p[2]=true;}if(at===16n){p[6]=u(0);if(cancel)p[1]=u(2);}a[3]=list(p);}
  if(key(a[2])===key(IDENTITY_CONTEXT)&&at===16n){const p=items(a[3],'list');a[3]=list([text(EXPERIMENT),p[1],false]);}return list(a);
 });
 return {...b,s:{...b.s,rulesVersion:SLEEP_ACQUISITION_RULES,registrySchemaVersion:SLEEP_ACQUISITION_REGISTRY,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function start(b=fixture()){const k=JSON.stringify(b.s);let m=prepared.get(k);if(!m){m=prepareCharacterModel(b.s);prepared.set(k,m);}const handle=await m;return {b,handle,run:cachedMemory(await createCharacterRun(handle,b.d))};}
export {state,labels,through,at,decode,items,key,enc,list,text,u,signed,C,rec,f,uint,outputs,bytes,exact} from './assembledProtectiveIdentity';
export type {Run} from './assembledProtectiveIdentity';
