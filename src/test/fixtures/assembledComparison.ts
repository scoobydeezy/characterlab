import {expect} from 'vitest';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {COMPARISON_RULES,COMPARISON_REGISTRY} from '../../assembled/model';
import {comparisonRoles} from '../../assembled/comparison';
import {ComparisonDrawMap,type ComparisonDrawMapEntry,type RandomAddress} from '../../substrate/random';
import {canonicalEncode as enc,list,text,unsigned,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {dataItems as items,dataRecord as rec,dataField as f,dataKey as key,dataIdentity as id,dataUnsigned as uint,dataText as txt} from '../../campaign2/canonicalData';
import {decodeEmbodied as decode} from '../../campaign3/embodiedCodecs';
import {relationshipSource,relationshipData} from './assembledRelationship';
import {outputs} from './assembledInteraction';
export const source=()=>({...relationshipSource(),rulesVersion:COMPARISON_RULES,registrySchemaVersion:COMPARISON_REGISTRY});
export type Run=Awaited<ReturnType<typeof createCharacterRun>>;
export const atom=(n:number,s:string)=>typedIdentifier(n,text(s));
export const signedValue=(v:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='signed')throw Error('signed');return v.value;};
export async function through(run:Run,at:bigint){for(let n=0;run.snapshot().clock<at;n++){expect(n).toBeLessThan(32);expect(await run.settleNextInstant()).toBe(true);}expect(run.snapshot().clock).toBe(at);}
export async function finish(run:Run){for(let n=0;await run.settleNextInstant();n++)expect(n).toBeLessThan(32);expect(run.snapshot().clock).toBe(10n);expect(run.diagnostic()).toBeUndefined();}
export const decisions=(run:Run)=>outputs(run.snapshot().outputs,409n);
export const choice=(run:Run)=>{const status=rec(f(decisions(run)[0],4n),419n);if(uint(f(status,1n))!==3n)return 'None';return txt(id(f(rec(f(rec(f(status,2n),420n),1n),395n),2n)).payload);};
export function draws(run:Run,at=3n){return outputs(run.snapshot().trace,160n).filter(t=>signedValue(f(rec(f(t,4n),130n),2n))===at).flatMap(t=>items(f(t,14n),'list')).map(v=>rec(v,411n));}
export function mapFromDecision(run:Run){
 // Read occurrence and complete candidate/nucleus identity ONLY, never result field4.
 const resolution=decisions(run).find(v=>signedValue(f(v,2n))===3n)!;
 const root=id(f(resolution,1n)),context=rec(f(resolution,3n),408n),nuclei=items(f(context,3n),'list');
 const addresses:RandomAddress[]=nuclei.map(v=>{const nk=rec(f(rec(v,407n),1n),404n),candidate=rec(f(nk,1n),395n);return {causalRootId:root,purposeId:atom(1042,'purpose/task-reason-face'),drawIndex:0n,subjectBindings:[{subjectRoleId:atom(1043,'subject/actor'),subjectId:id(f(candidate,1n))},{subjectRoleId:atom(1043,'subject/action'),subjectId:id(f(candidate,2n))},{subjectRoleId:atom(1043,'subject/task'),subjectId:id(f(nk,3n))}]};});
 const actor=addresses[0].subjectBindings[0];addresses.push({causalRootId:root,purposeId:atom(1042,'purpose/task-decision-tie'),drawIndex:0n,subjectBindings:[actor]});
 return new ComparisonDrawMap(addresses.map(a=>({localRandomAddress:a,comparisonDrawKey:{keyId:atom(10006,key(list([text('M21a/first-decision/3'),a.purposeId,list(a.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId])))]))),comparisonRoleId:atom(10005,'assembled/'+txt(a.purposeId.payload).slice('purpose/'.length))}})),comparisonRoles);
}
let prepared:Promise<{model:Awaited<ReturnType<typeof prepareCharacterModel>>;maps:ComparisonDrawMap[]}>|undefined;
export function fixture(){return prepared??= (async()=>{const model=await prepareCharacterModel(source()),maps:ComparisonDrawMap[]=[];for(const history of [true,false]){const run=await createCharacterRun(model,relationshipData(history,0));await through(run,3n);maps.push(mapFromDecision(run));}return {model,maps};})();}
export function data(history:boolean,seed:number,map?:ComparisonDrawMap){const d=relationshipData(history,seed);return {...d,orderedInputs:enc(list([...(map?[map.canonicalValue]:[]),...items(decode(d.orderedInputs),'list')]))};}
export const mappedData=(history:boolean,seed:number,entries:readonly ComparisonDrawMapEntry[])=>data(history,seed,new ComparisonDrawMap(entries,comparisonRoles));
