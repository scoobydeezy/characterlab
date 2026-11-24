/** Explicit bounded replays; historical suites/fixtures remain the default. */
// @ts-expect-error Node-only validation selector.
import {env} from 'node:process';
// @ts-expect-error Node-only immutable historical receipts.
import {readFileSync} from 'node:fs';
import {expect} from 'vitest';
import {NEED_RULES,NEED_REGISTRY,ACTION_DOMAIN_RULES,ACTION_DOMAIN_REGISTRY,REWARD_EVIDENCE_RULES,REWARD_EVIDENCE_REGISTRY} from '../../assembled/model';
import {decode,items,enc,list,text,key,rec,f} from './assembledIntoxicationCohort';
import {NEED_RESPONSES} from '../../assembled/need';
export const replay224=env.CHARACTERLAB_EMBODIMENT_REPLAY==='M224';
export const replay220=env.CHARACTERLAB_EMBODIMENT_REPLAY==='M220';
export function candidate220<T extends {s:{rulesVersion:string;registrySchemaVersion:string}}>(b:T):T {
 if(!replay220)return b;
 expect(b.s.rulesVersion).toBe(REWARD_EVIDENCE_RULES);
 expect(b.s.registrySchemaVersion).toBe(REWARD_EVIDENCE_REGISTRY);
 return {...b,s:{...b.s,rulesVersion:ACTION_DOMAIN_RULES,registrySchemaVersion:ACTION_DOMAIN_REGISTRY}};
}
export function correspondence220(priorFile:string,name:string,result:any,cohort=false){
 if(!replay220)return;
 const data=JSON.parse(readFileSync(priorFile,'utf8')),old=cohort?data.runs[name]:data[name];
 expect(old,'frozen original case '+name).toBeDefined();
 const fields=cohort?['input','initial','rows','physical','decisions','presentation','safe','safeBytes','closureInstants','terminalClock']:['input','initial','registry','rows','safe','safeBytes'];
 for(const field of fields)expect(result[field],name+'/'+field+' exact prior receiving').toEqual(old[field]);
 if(cohort){
  expect(result.model).not.toBe(old.model);expect(result.run).not.toBe(old.run);
  expect(result.prefixes.map((p:any)=>[p.logical,p.native,p.terminal])).toEqual(old.prefixes.map((p:any)=>[p.logical,p.native,p.terminal]));
 }
 return {candidate:'0.144',prior:priorFile,case:name,fields,pass:true};
}

/** M224 is BODY-only. Never reuse the M220 cohort output paths for this candidate. */
export function candidate224<T extends {s:{rulesVersion:string;registrySchemaVersion:string;registry:Uint8Array}}>(b:T):T {
 if(!replay224)return candidate220(b);
 expect(b.s.rulesVersion).toBe(REWARD_EVIDENCE_RULES);
 expect(b.s.registrySchemaVersion).toBe(REWARD_EVIDENCE_REGISTRY);
 const slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(58);
 const registry=enc(list([...slots,list([text(NEED_RESPONSES),list([])])]));
 return {...b,s:{...b.s,rulesVersion:NEED_RULES,registrySchemaVersion:NEED_REGISTRY,registry}};
}
export function correspondence224(name:string,result:any){
 if(!replay224)return correspondence220('docs/planning/ASSEMBLED_CHARACTER_M218_EVIDENCE.json',name,result);
 const prior='docs/planning/ASSEMBLED_CHARACTER_M220_BODY_EVIDENCE.json';
 const old=JSON.parse(readFileSync(prior,'utf8'))[name];expect(old,'preserved M220 BODY case').toBeDefined();
 const fields=['input','initial','rows'];
 for(const field of fields)expect(result[field],name+'/'+field+' exact prior receiving').toEqual(old[field]);
 expect(result.registry).not.toBe(old.registry);
 return {candidate:'0.145',prior,case:name,fields,pass:true,
  mapping:'same inputs/S0/seed and original58 registry slots; empty Need slot appended; changed model/run and raw403 schema are not byte-compared'};
}

/** M247 BODY transfer: preserve original scalar task/sensor meaning on0.155. */
import {SENSOR_BINDING_RULES,SENSOR_BINDING_REGISTRY} from '../../assembled/model';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {sid} from '../../assembled/skill';
import {set} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
export const replay247=env.CHARACTERLAB_EMBODIMENT_REPLAY==='M247';
export function candidate247<T extends {s:{rulesVersion:string;registrySchemaVersion:string;registry:Uint8Array};d:{initialState:Uint8Array}}>(b:T):T {
 if(!replay247)return candidate224(b);
 expect(b.s.rulesVersion).toBe(REWARD_EVIDENCE_RULES);
 const slots=items(decode(b.s.registry),'list');expect(slots).toHaveLength(58);
 const route=items(items(items(slots[12],'list')[1],'list')[0],'list');
 const definition=items(slots[0],'set').find(v=>key(f(rec(v,171n),1n))===key(route[1]))!;
 const action=f(rec(f(rec(definition,171n),4n),389n),1n);
 const item=sid(1601,'item/m247-parcel'),origin=sid(1602,'place/m247-origin'),destination=sid(1602,'place/m247-destination');
 const declaration=list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([action,item,destination])]),list([])]);
 const initial=new AuthoritativeState([...restoreAuthoritativeState(decode(b.d.initialState)).entries(),{path:itemPath(item),value:origin}]);
 return {...b,s:{...b.s,rulesVersion:SENSOR_BINDING_RULES,registrySchemaVersion:SENSOR_BINDING_REGISTRY,registry:enc(list([...slots,list([text(NEED_RESPONSES),list([])]),declaration]))},d:{...b.d,initialState:enc(initial.canonicalValue())}};
}
export function correspondence247(name:string,result:any){
 if(!replay247)return correspondence224(name,result);
 const prior='docs/planning/ASSEMBLED_CHARACTER_M224_BODY_EVIDENCE.json',old=JSON.parse(readFileSync(prior,'utf8'))[name];
 expect(old,'preserved M224 BODY case').toBeDefined();
 for(const field of ['input','rows'])expect(result[field],name+'/'+field+' exact prior receiving').toEqual(old[field]);
 return {candidate:'0.155',prior,case:name,fields:['input','rows'],pass:true,
  mapping:'original58 registry slots/input/seed and all original initial entries preserved; empty Need + unbound item0.3 and one physical location appended; no task/sensor retargeting'};
}
