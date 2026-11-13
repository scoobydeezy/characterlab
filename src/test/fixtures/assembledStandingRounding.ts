import {randomDrawRecord} from '../../assembled/codecs';
/** M103 declared in plan8f663faf. Native M89 training; current permitted readings0/0 at12.
 * Delegated amendment2be6a2fb: A urgency0 at12; original1 and c1e9940a4/5 controls retained.
 * Three nonsocial physical tasks; body30/cap100/rate10/delivery90@9; seed0. */
import {expect} from 'vitest';
import {outputs,signedValue} from './assembledComparison';
import {fixture as history,learned,standing,withoutStanding} from './assembledStandingSources';
import {ROUNDING_RULES,ROUNDING_REGISTRY,WITNESS_RULES,WITNESS_REGISTRY} from '../../assembled/model';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {taskA} from './assembledDecisionRegimes';
import {REASON_READING} from '../../assembled/reasonEvidence';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {compileDescribedReasons} from '../../assembled/reasons';
import {arbitrationOutput} from '../../assembled/arbitration';
import {comparisonRoles} from '../../assembled/comparison';
import {ComparisonDrawMap,type RandomAddress} from '../../substrate/random';
import {dataIdentity as id,dataText as txt} from '../../campaign2/canonicalData';
import {capture,rec,f,uint,items,key,decode,enc,list,set,text,u,signed,q} from './assembledValueProvenance';
import {snap,through,exact,bytes} from './assembledAffectReceiving';
import {definition,r,sid} from './assembledContextReasons';
import {record,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {readQ,qValue,ZERO,ONE,readDistribution} from '../../campaign2/cognitiveMath';
import {ExactRational as Q} from '../../substrate/exactMath';
import {ROUNDING_SPAN} from '../../assembled/standingRounding';
export function fixture(candidate=true,pressure=false,hidden=false,amended:boolean|'rolling'='rolling'){
 const b=history(true,pressure,hidden);let changed=0,urgencyChanged=0;
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{
  const row=[...items(v,'list')];
  if(key(row[0])===key(signed(12))&&key(row[2])===key(REASON_READING)){
   const p=[...items(row[3],'list')];expect(p.slice(0,4)).toEqual([q(1,1),q(1,1),true,true]);p[0]=q(0,1);p[1]=q(0,1);row[3]=list(p);changed++;
  }
  if(amended&&key(row[0])===key(signed(12))&&key(row[2])===key(PRIORITY_DISPLAY)){
   const p=items(row[3],'list');row[3]=list([p[0],list(items(p[1],'list').map(v=>{const t=[...items(v,'list')];if(key(t[0])===key(taskA)){expect(t[3]).toEqual(list([q(1,1)]));t[3]=list([amended==='rolling'?q(0,1):q(4,5)]);urgencyChanged++;}return list(t);}))]);
  }return list(row);
 });expect(changed).toBe(1);expect(urgencyChanged).toBe(amended?1:0);
 return {s:{...b.s,rulesVersion:candidate?ROUNDING_RULES:WITNESS_RULES,registrySchemaVersion:candidate?ROUNDING_REGISTRY:WITNESS_REGISTRY},d:{...b.d,orderedInputs:enc(list(rows))}};
}
export async function create(b=fixture(),at=12n){const run=await createCharacterRun(await prepareCharacterModel(b.s),b.d);await through(run,at);return {b,run};}
export const replace=(v:CanonicalValue,n:bigint,x:CanonicalValue)=>{const type=(v as Extract<CanonicalValue,{kind:'record'}>).schema.typeId,a=type===411n?randomDrawRecord(v):rec(v,type);return record(a.schema,new Map([...a.fields].map(([i,old])=>[i,i===n?x:old])));};
export function coupling(run:Awaited<ReturnType<typeof create>>['run'],candidate=true){
 // ONLY context/occurrence identities; no probabilities, sampled scores or chosen action.
 const d=outputs(run.snapshot().outputs,409n).find(v=>signedValue(f(v,2n))===12n)!,root=id(f(d,1n)),ns=items(f(rec(f(d,3n),408n),3n),'list'),addresses:RandomAddress[]=[];
 for(const n0 of ns){const n=rec(n0,407n),nk=rec(f(n,1n),404n),c=rec(f(nk,1n),395n),value=nk.schema.schemaVersion===2n;
  const subjectBindings=[{subjectRoleId:sid(1043,'subject/actor'),subjectId:id(f(c,1n))},{subjectRoleId:sid(1043,'subject/action'),subjectId:id(f(c,2n))},{subjectRoleId:sid(1043,'subject/task'),subjectId:id(f(nk,3n))}];
  for(const purpose of [value?'value-reason-face':'task-reason-face',...(candidate?[value?'value-standing-rounding':'task-standing-rounding']:[])])addresses.push({causalRootId:root,purposeId:sid(1042,'purpose/'+purpose),subjectBindings,drawIndex:0n});
 }
 addresses.push({causalRootId:root,purposeId:sid(1042,'purpose/task-decision-tie'),subjectBindings:[addresses[0].subjectBindings[0]],drawIndex:0n});
 return new ComparisonDrawMap(addresses.map(a=>({localRandomAddress:a,comparisonDrawKey:{keyId:sid(10006,key(list([text('M103/12'),a.purposeId,list(a.subjectBindings.map(b=>list([b.subjectRoleId,b.subjectId])))]))),comparisonRoleId:sid(10005,'assembled/'+txt(a.purposeId.payload).slice(8))}})),comparisonRoles);
}
export function mapped(b:ReturnType<typeof fixture>,map:ComparisonDrawMap){return {...b,d:{...b.d,orderedInputs:enc(list([map.canonicalValue,...items(decode(b.d.orderedInputs),'list')]))}};}
export function ablation(p:ReturnType<typeof capture>,source:ReturnType<typeof fixture>['s'],candidate=true){
 const raw=r(403,[f(p.raw,1n),f(p.raw,2n),withoutStanding(p.raw),f(p.raw,4n),f(p.raw,5n),list(items(f(p.raw,6n),'list').filter(v=>uint(f(rec(f(rec(items(v,'list')[2],402n),1n),401n),3n))!==3n))],3);
 const ns=compileDescribedReasons(raw,definition(source),3,'SourceCoverage',true,candidate).nuclei;
 return {raw:rec(raw,403n),ns,context:r(408,[f(p.context,1n),raw,list(ns)])};
}
export function arbitrationDefinition(s:ReturnType<typeof fixture>['s']){
 const row=items(items(decode(s.registry),'list')[0],'set').find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===171n&&key(f(v,1n))===key(sid(1027,'definition/task-arbitration')))!;return f(rec(row,171n),4n);
}
export function token(template:CanonicalValue,word:bigint,span?:bigint){
 let v=replace(template,3n,u(word));if(span){v=replace(v,4n,u(span));v=replace(v,5n,u(((1n<<128n)/(span))*span));}
 return replace(replace(v,6n,false),7n,list([r(410,[u(0),u(word),false])]));
}
export const data=(d:CanonicalValue)=>rec(f(rec(f(rec(d,409n),4n),419n),2n),420n);
export async function enumerate(p:ReturnType<typeof capture>,source:ReturnType<typeof fixture>['s'],context:CanonicalValue=p.context){
 const ns=items(f(rec(context,408n),3n),'list').map(v=>rec(v,407n));expect(ns).toHaveLength(2);
 const templates=items(f(p.data,9n),'list').map(v=>rec(v,422n)),sum=new Map<string,Q>();let cases=0,total=ZERO;
 const levels=ns.map(n=>{const t=n.schema.schemaVersion===3n?uint(f(n,10n)):0n;return t?[[t,ONE.subtract(Q.of(t,ROUNDING_SPAN))],[0n,Q.of(t,ROUNDING_SPAN)]] as const:[[undefined,ONE]] as const;});
 for(let a=0n;a<uint(f(ns[0],4n));a++)for(let b=0n;b<uint(f(ns[1],4n));b++)for(const [wa,pa] of levels[0])for(const [wb,pb] of levels[1])for(let tie=0n;tie<2n;tie++){
  const i=(n:CanonicalValue)=>ns.findIndex(v=>key(v)===key(n));
  const draws={async reason(n:CanonicalValue){const j=i(n);expect(j).toBeGreaterThanOrEqual(0);return token(f(templates[j],5n),j===0?a:b);},
   async rounding(n:CanonicalValue){const j=i(n);return token(f(templates[j],5n),(j===0?wa:wb)!,ROUNDING_SPAN);},
   async tie(){return token(f(templates[0],5n),tie,2n);}};
  const d=data(await arbitrationOutput(f(p.d,1n),12n,context,arbitrationDefinition(source),draws,3));
  expect(uint(f(d,8n))).not.toBe(1n);
  const probability=pa.multiply(pb).divide(Q.of(uint(f(ns[0],4n))*uint(f(ns[1],4n))*2n)),winner=key(f(d,1n));
  sum.set(winner,(sum.get(winner)??ZERO).add(probability));total=total.add(probability);cases++;
 }
 expect(total).toEqual(ONE);return {sum,cases};
}
export {capture,learned,standing,withoutStanding,snap,through,exact,bytes,definition,r,sid,rec,f,uint,items,key,decode,enc,list,set,text,u,signed,q,readQ,qValue,ZERO,ONE,readDistribution,Q};
