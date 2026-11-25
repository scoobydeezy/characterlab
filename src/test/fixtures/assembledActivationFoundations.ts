/** M270 explicit native replay; fixtures, worlds and historical defaults are unchanged. */
// @ts-expect-error Node-only replay selection.
import {env} from 'node:process';
// @ts-expect-error Immutable historical evidence.
import {readFileSync} from 'node:fs';
// @ts-expect-error Evidence identity.
import {createHash} from 'node:crypto';
import {expect} from 'vitest';
import {lift,start as nativeStart} from './assembledActivationNative';
import {ITEM_EXECUTION_RULES,CAUSAL_DISCLOSURE_RULES,POSITIVE_ACTIVATION_RULES} from '../../assembled/model';
export const replay270=env.CHARACTERLAB_ACTIVATION_REPLAY==='M270';
export {POSITIVE_ACTIVATION_RULES};
export async function start270<T extends Parameters<typeof lift>[0]>(b:T){
 expect([ITEM_EXECUTION_RULES,CAUSAL_DISCLOSURE_RULES]).toContain(b.s.rulesVersion);
 const x=await nativeStart(lift(b));return {b:x.b,m:x.m,run:x.r};
}
export const path270=(p:string)=>!replay270?p:p.replace('M245_EVIDENCE','M270_NEED_EVIDENCE').replace('M256_EVIDENCE','M270_CONTROL_EVIDENCE');
const cache=new Map<string,{data:Record<string,any>;hash:string}>();
function prior(path:string){let p=cache.get(path);if(!p){const bytes=readFileSync(path);p={data:JSON.parse(bytes.toString()),hash:createHash('sha256').update(bytes).digest('hex')};cache.set(path,p);}return p;}
export function metadata270(path:string){return {candidate:'0.160',contract:'assembled-character-positive-activation/0.1-candidate',prior:path,hash:prior(path).hash,delta:'empty intention; version/global activation; all60 original slots normalize exactly; sources/S0/seed unchanged'};}
export function compare270(path:string,k:string,v:any){
 if(!replay270)return;const old=prior(path).data[k];
 if(path.includes('M245')&&['primary','joint','commitment','one','noResponse','zero','unknown','alias11','alias19'].includes(k)){
  expect(old,'prior Need witness '+k).toBeDefined();for(const f of ['options','initial','inputs','clock','prob','need','tasks'])expect(v[f],k+'/'+f+' original correspondence').toEqual(old[f]);
 }
 if(path.includes('M256')&&k.endsWith('-proof')){expect(old,'prior efficacy witness '+k).toBeDefined();expect(v,k+' original producer/receiving proof').toEqual(old);}
}
