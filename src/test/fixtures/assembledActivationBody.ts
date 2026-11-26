/** M271: original physical scenarios lifted without new psychological state. */
import {expect} from 'vitest';
// @ts-expect-error Node-only selector.
import {env} from 'node:process';
// @ts-expect-error Evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {changeDefinition} from './assembledCharacter';
import {POSITIVE_ACTIVATION_RULES,POSITIVE_ACTIVATION_REGISTRY,REWARD_EVIDENCE_RULES,ACTION_DOMAIN_RULES} from '../../assembled/model';
import {NEED_RESPONSES} from '../../assembled/need';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {INTENTION_MEMORY} from '../../assembled/intentionMemory';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {sid} from '../../assembled/skill';
import {set} from '../../substrate/canonicalEncoding';
import {hash,capture,decode,items,enc,list,text,q,type Run} from './assembledActivationNative';
export const replay271=env.CHARACTERLAB_ACTIVATION_REPLAY==='M271';
export const replay272=env.CHARACTERLAB_ACTIVATION_REPLAY==='M272';
export const replay273=env.CHARACTERLAB_ACTIVATION_REPLAY==='M273';
export const normalized271=<T extends Parameters<typeof changeDefinition>[0]>(s:T)=>changeDefinition(s,'definition/task-reason-dice',2n,q(37,100));
export function candidate271<T extends {s:Parameters<typeof changeDefinition>[0];d:{initialState:Uint8Array}}>(b:T,enabled=replay271):T{
 if(!enabled)return b;
 expect([REWARD_EVIDENCE_RULES,ACTION_DOMAIN_RULES]).toContain(b.s.rulesVersion);
 const slots=[...items(decode(b.s.registry),'list')];expect(slots).toHaveLength(58);
 const item=sid(1601,'item/m271-unobserved'),origin=sid(1602,'place/m271-origin'),destination=sid(1602,'place/m271-destination'),action=sid(1027,'definition/protocol-contact-one');
 slots.push(list([text(NEED_RESPONSES),list([])]),list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([action,item,destination])]),list([])]),list([text(INTENTION_MEMORY),list([])]));
 const s=changeDefinition({...b.s,rulesVersion:POSITIVE_ACTIVATION_RULES,registrySchemaVersion:POSITIVE_ACTIVATION_REGISTRY,registry:enc(list(slots))},'definition/task-reason-dice',2n,q(0,1));
 expect(enc(list(items(decode(normalized271(s).registry),'list').slice(0,58)))).toEqual(b.s.registry);
 const prior=restoreAuthoritativeState(decode(b.d.initialState)),initial=new AuthoritativeState([...prior.entries(),{path:itemPath(item),value:origin}]);
 for(const e of prior.entries())expect(initial.read(e.path)).toEqual(prior.read(e.path));
 return {...b,s,d:{...b.d,initialState:enc(initial.canonicalValue())}};
}
export function correspondence271(kind:'BODY'|'TOLERANCE',name:string,value:any){
 const path='docs/planning/ASSEMBLED_CHARACTER_M'+(kind==='BODY'?'247':'219')+'_EVIDENCE.json',bytes=readFileSync(path),old=JSON.parse(bytes.toString())[name];expect(old).toBeDefined();
 const fields=kind==='BODY'?['input','rows']:name==='tolerance'?['arbitration']:name==='hidden'?['effects','view']:['earned'];
 for(const k of fields)expect(value[k],name+'/'+k+' prior semantic receiving').toEqual(old[k]);
 if(name==='tolerance')for(const law of ['Reciprocal','Unattenuated'])for(const k of ['effects','views','input'])expect(value[law][k],law+'/'+k).toEqual(old[law][k]);
 return {pass:true,prior:path,sha256:hash(bytes),fields,candidate:'0.160',activation:'0',mapping:'same original58 slots after threshold normalization, inputs/seed and original initial entries; empty Need/intention and unbound private item appended'};
}
let active:Run|undefined;
export function track271<T extends {run:Run}>(x:T):T{if(replay271||replay272||replay273)active=x.run;return x;}
export function failure271(name:string){
 if((!replay271&&!replay272&&!replay273)||!active)return;
 const file='docs/planning/ASSEMBLED_CHARACTER_'+(replay273?'M273':replay272?'M272':'M271')+'_FAILURES.json',d=existsSync(file)?JSON.parse(readFileSync(file,'utf8')):[];
 d.push({name,...capture(active)});writeFileSync(file,JSON.stringify(d,null,2)+'\n');active=undefined;
}
