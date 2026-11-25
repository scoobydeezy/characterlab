/** Explicit M269 test replay. Historical sources and assertions remain the default. */
// @ts-expect-error Node-only validation selection.
import {env} from 'node:process';
// @ts-expect-error Immutable historical evidence.
import {readFileSync} from 'node:fs';
// @ts-expect-error Evidence identity.
import {createHash} from 'node:crypto';
import {expect} from 'vitest';
import {changeDefinition} from './assembledCharacter';
import {rational as q} from '../../substrate/canonicalEncoding';
import {ATTEMPT_RECEIPT_RULES,ATTEMPT_RECEIPT_REGISTRY,POSITIVE_ACTIVATION_RULES,POSITIVE_ACTIVATION_REGISTRY} from '../../assembled/model';
export const replay269=env.CHARACTERLAB_ACTIVATION_REPLAY==='M269';
export function candidate269<T extends {s:Parameters<typeof changeDefinition>[0]}>(b:T):T{
 if(!replay269)return b;
 expect(b.s.rulesVersion).toBe(ATTEMPT_RECEIPT_RULES);expect(b.s.registrySchemaVersion).toBe(ATTEMPT_RECEIPT_REGISTRY);
 const s={...changeDefinition(b.s,'definition/task-reason-dice',2n,q(0,1)),rulesVersion:POSITIVE_ACTIVATION_RULES,registrySchemaVersion:POSITIVE_ACTIVATION_REGISTRY};
 expect(changeDefinition(s,'definition/task-reason-dice',2n,q(37,100)).registry).toEqual(b.s.registry);
 return {...b,s};
}
export function carryPath(p:string){return !replay269?p:p.replace('M263_EVIDENCE','M269_WORKSPACE_EVIDENCE').replace('M261_EVIDENCE','M269_INTENTION_EVIDENCE').replace('M262_EVIDENCE','M269_BOUNDARY_EVIDENCE');}
const cache=new Map<string,{data:Record<string,any>;hash:string}>();
function prior(path:string){let p=cache.get(path);if(!p){const bytes=readFileSync(path);p={data:JSON.parse(bytes.toString()),hash:createHash('sha256').update(bytes).digest('hex')};cache.set(path,p);}return p;}
export function carryMetadata(path:string){return {candidate:'0.160',contract:'assembled-character-positive-activation/0.1-candidate',prior:path,hash:prior(path).hash,delta:'version/global activation only; original inputs/initial state/seed/all other registry bytes retained'};}
export function compareCarry(path:string,k:string,v:any){
 if(!replay269)return;
 const old=prior(path).data[k];
 if(k.endsWith('-gate')){expect(old,'original gate '+k).toBeDefined();expect(v.rows,k+' original semantic rows').toEqual(old.rows);}
 if(k.includes('-prefix')){expect(old,'original prefix '+k).toBeDefined();const {safe:currentSafe,...current}=v,{safe:oldSafe,...reference}=old;expect(current,k+' original intention semantics').toEqual(reference);}
}
