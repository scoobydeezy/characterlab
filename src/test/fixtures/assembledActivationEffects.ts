/** M268: deterministic composition lift; no changed stimuli or psychological state. */
import {expect} from 'vitest';
// @ts-expect-error Node evidence IO.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {cohort,C,u} from './assembledIntoxicationCohort';
import {reappraisal as oldReappraisal} from './assembledWorkspaceFamily';
import {changeDefinition} from './assembledCharacter';
import {ACTION_DOMAIN_RULES,ACTION_DOMAIN_REGISTRY,POSITIVE_ACTIVATION_RULES,POSITIVE_ACTIVATION_REGISTRY,ATTEMPT_RECEIPT_RULES,ATTEMPT_RECEIPT_REGISTRY} from '../../assembled/model';
import {NEED_RESPONSES} from '../../assembled/need';
import {SENSOR_BINDING,itemPath} from '../../assembled/itemWorld';
import {INTENTION_MEMORY} from '../../assembled/intentionMemory';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {sid} from '../../assembled/skill';
import {set} from '../../substrate/canonicalEncoding';
import {hash,zip,unpack,start as begin,through,finish,restore,exact,capture,gate,records,tags,rec,f,items,key,uint,decode,enc,list,text,q,signed,summary,type Run,type CanonicalValue} from './assembledActivationNative';
export {hash,zip,unpack,through,finish,restore,exact,capture,gate,records,tags,rec,f,items,key,uint,decode,enc,list,text,q,signed,summary,C,u,sid,restoreAuthoritativeState};
export type {Run,CanonicalValue};
export const file='docs/planning/ASSEMBLED_CHARACTER_M268_EVIDENCE.json',saved=()=>existsSync(file)?JSON.parse(readFileSync(file,'utf8')):{};
export function put(k:string,v:unknown){v=JSON.parse(JSON.stringify(v,(_k,x)=>typeof x==='bigint'?String(x):x));const data=saved();if(data[k])expect(data[k]).toEqual(v);else{data[k]=v;writeFileSync(file,JSON.stringify(data,null,2)+'\n');}}
let active:Run|undefined;
export function failed(test:string){if(active)put('failure-'+Object.keys(saved()).filter(k=>k.startsWith('failure-')).length,{test,...capture(active)});active=undefined;}
export async function start<T extends Parameters<typeof begin>[0]>(b:T){const x=await begin(b);active=x.r;return x;}
export function intox(scenario:'BlindSober'|'BlindSlow',saturated=false,positive=true){
 const b=cohort({scenario,law:'Full',seed:0},{saturated}),original={...b.s,rulesVersion:ACTION_DOMAIN_RULES,registrySchemaVersion:ACTION_DOMAIN_REGISTRY},slots=[...items(decode(b.s.registry),'list')];expect(slots).toHaveLength(58);
 const item=sid(1601,'item/m268-unobserved'),origin=sid(1602,'place/m268-origin'),destination=sid(1602,'place/m268-destination'),action=sid(1027,'definition/protocol-contact-one');
 slots.push(list([text(NEED_RESPONSES),list([])]),list([text(SENSOR_BINDING),set([item]),set([origin,destination]),list([list([action,item,destination])]),list([])]),list([text(INTENTION_MEMORY),list([])]));
 const source={...b.s,rulesVersion:positive?POSITIVE_ACTIVATION_RULES:ATTEMPT_RECEIPT_RULES,registrySchemaVersion:positive?POSITIVE_ACTIVATION_REGISTRY:ATTEMPT_RECEIPT_REGISTRY,registry:enc(list(slots))},s=positive?changeDefinition(source,'definition/task-reason-dice',2n,q(0,1)):source;
 expect(enc(list(items(decode(changeDefinition(s,'definition/task-reason-dice',2n,q(37,100)).registry),'list').slice(0,58)))).toEqual(b.s.registry);
 const prior=restoreAuthoritativeState(decode(b.d.initialState)),initial=new AuthoritativeState([...prior.entries(),{path:itemPath(item),value:origin}]);for(const e of prior.entries())expect(initial.read(e.path)).toEqual(prior.read(e.path));
 return {s,d:{...b.d,initialState:enc(initial.canonicalValue())},original,mapping:{priorRegistry:hash(b.s.registry),registry:hash(s.registry),oldInitial:hash(b.d.initialState),initial:hash(enc(initial.canonicalValue())),inputs:hash(b.d.orderedInputs),seed:hash(b.d.runSeed),parameters:hash(s.parameters),delta:'empty Need/intention, unbound physical item; activation '+(positive?'0':'37/100')}};
}
export function reappraisal(mode:'complete'|'interrupted'){
 const b=oldReappraisal(mode);expect(items(decode(b.s.registry),'list')).toHaveLength(61);
 const s={...changeDefinition(b.s,'definition/task-reason-dice',2n,q(0,1)),rulesVersion:POSITIVE_ACTIVATION_RULES,registrySchemaVersion:POSITIVE_ACTIVATION_REGISTRY};
 expect(changeDefinition(s,'definition/task-reason-dice',2n,q(37,100)).registry).toEqual(b.s.registry);
 return {...b,s,original:b.s,mapping:{priorRegistry:hash(b.s.registry),registry:hash(s.registry),initial:hash(b.d.initialState),inputs:hash(b.d.orderedInputs),seed:hash(b.d.runSeed),parameters:hash(s.parameters),delta:'version/global activation only'}};
}
export function oldEvidence(name:string){const path='docs/planning/'+name,bytes=readFileSync(path);return {value:JSON.parse(bytes.toString()),path,hash:hash(bytes)};}
