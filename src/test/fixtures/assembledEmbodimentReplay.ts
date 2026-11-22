/** Explicit M220 replay only; historical suites/fixtures remain the default. */
// @ts-expect-error Node-only validation selector.
import {env} from 'node:process';
// @ts-expect-error Node-only immutable historical receipts.
import {readFileSync} from 'node:fs';
import {expect} from 'vitest';
import {ACTION_DOMAIN_RULES,ACTION_DOMAIN_REGISTRY,REWARD_EVIDENCE_RULES,REWARD_EVIDENCE_REGISTRY} from '../../assembled/model';
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
