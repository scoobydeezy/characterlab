/** Explicit bounded replays; historical suites/fixtures remain the default. */
// @ts-expect-error Node-only validation selector.
import {env} from 'node:process';
// @ts-expect-error Node-only immutable historical receipts.
import {readFileSync} from 'node:fs';
import {expect} from 'vitest';
import {NEED_RULES,NEED_REGISTRY,ACTION_DOMAIN_RULES,ACTION_DOMAIN_REGISTRY,REWARD_EVIDENCE_RULES,REWARD_EVIDENCE_REGISTRY} from '../../assembled/model';
import {decode,items,enc,list,text} from './assembledIntoxicationCohort';
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
