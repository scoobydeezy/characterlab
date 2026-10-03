/** cross-context-identity-component/0.1-candidate. Controlled task meanings, not native admission. */
import {canonicalEncode as enc,list,set,map,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {semanticReferentFromAuthoredContent} from '../substrate/referentOrigin';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {ONE,ZERO,readQ,qValue,foldIdentityHistory,compileReasonNuclei} from '../campaign2/cognitiveMath';
import {workspaceOutput,appraisalOutput,concernOutput,candidateOutput,rawSignalOutput} from '../campaign2/cognitiveTransforms';
import {arbitrationOutput,createCognitiveRandomSession} from '../campaign2/cognitiveArbitration';
import {chosenData,intentOutput,expressionOutput,qualificationOutput,planOutput,attemptOutput,executionOutput} from '../campaign2/cognitiveChoice';
import {receivingRecord as r,decodeReceiving as decode} from './receivingCodecs';
import {cognitiveNamed} from '../campaign2/cognitiveCodecs';

export const VERSION='cross-context-identity-component/0.1-candidate';
export const LAWS=['SharedMeaning','SeparateContext','NoFeedback','Graded','Frequency','Refold'] as const;
export type Law=typeof LAWS[number];
export type Context='Custody'|'Disclosure'|'Appointment';
const sid=(ns:number,name:string)=>typedIdentifier(ns,text(name));
const referent=(name:string)=>semanticReferentFromAuthoredContent(sid(1038,'content/cross-context/'+name));
export const ACTOR=referent('actor');
/** These are admitted expected effects and undertakings, not objective outcome reads. */
export const CONTEXTS={
 Custody:{actions:['return-parcel','keep-parcel'],predicate:'parcel-with-beneficiary',expected:[true,false],commitment:3,temptation:2,competingMotive:'acquire-property'},
 Disclosure:{actions:['conceal-hazard','disclose-hazard'],predicate:'beneficiary-informed-of-hazard',expected:[false,true],commitment:4,temptation:3,competingMotive:'avoid-social-disapproval'},
 Appointment:{actions:['attend-appointment','skip-appointment'],predicate:'present-with-beneficiary',expected:[true,false],commitment:3,temptation:3,competingMotive:'rest'},
} as const;
for(const spec of Object.values(CONTEXTS)){Object.freeze(spec.actions);Object.freeze(spec.expected);Object.freeze(spec);}Object.freeze(CONTEXTS);
export interface Frame {at:number;context:Context;significance:0|1|4;pressure:0|2|4;admitted:boolean;meaningAvailable:boolean;accepted:boolean;contrary:boolean;permitted:boolean;}
type Safe=Omit<Frame,'permitted'>;
const fields=['at','context','significance','pressure','admitted','meaningAvailable','accepted','contrary','permitted'];
const clone=(v:CanonicalValue)=>decode(enc(v));
const fraction=(v:CanonicalValue)=>{const n=readQ(v);return `${n.numerator}/${n.denominator}`;};
function checked(xs:readonly Frame[]){
 if(!Array.isArray(xs)||Object.getPrototypeOf(xs)!==Array.prototype||xs.length!==5||Reflect.ownKeys(xs).length!==6||Object.values(Object.getOwnPropertyDescriptors(xs)).some(d=>!('value'in d)))throw Error('CCI_FRAMES');
 for(const [i,x] of xs.entries()){
  if(!x||Object.getPrototypeOf(x)!==Object.prototype)throw Error('CCI_DATA');const ds=Object.getOwnPropertyDescriptors(x);
  if(Reflect.ownKeys(ds).length!==fields.length||fields.some(k=>!ds[k]||!('value'in ds[k])))throw Error('CCI_DATA');
  if(x.at!==i+1||!Object.hasOwn(CONTEXTS,x.context)||![0,1,4].includes(x.significance)||![0,2,4].includes(x.pressure)||fields.slice(4).some(k=>typeof ds[k].value!=='boolean'))throw Error('CCI_DOMAIN');
 }
 return structuredClone(xs);
}
const safe=(x:Frame):Safe=>({at:x.at,context:x.context,significance:x.significance,pressure:x.pressure,admitted:x.admitted,meaningAvailable:x.meaningAvailable,accepted:x.accepted,contrary:x.contrary});
const safeValue=(x:Safe)=>text(JSON.stringify(x));
function numeric(rows:readonly CanonicalValue[]){return rows.map(v=>{const x=items(v,'list');return r(413,[typedIdentifier(1138,x[0]),typedIdentifier(1135,x[0]),signed((x[0] as {value:bigint}).value),x[4]]);});}
const strength=(xs:readonly CanonicalValue[])=>foldIdentityHistory(numeric(xs),ONE).strength;

async function source(x:Safe,seed:number,history:readonly CanonicalValue[],law:Law){
 const at=BigInt(x.at),spec=CONTEXTS[x.context];let ordinal=at*100n;const occ=(ns:number)=>typedIdentifier(ns,u(ordinal++));
 const tasks=spec.actions.map((action,i)=>({key:r(371,[ACTOR,referent(x.context+'/'+action)]),specId:sid(1027,'definition/cross-context/'+x.context+'/'+i),activeFrom:1n,deadline:6n}));
 const options=spec.actions.map(action=>r(395,[ACTOR,sid(1027,'action/cross-context/'+action)]));
 const w=workspaceOutput(occ(1128),ACTOR,sid(1027,'agenda/cross-context/'+x.context),r(378,[sid(1027,'prediction/cross-context'),u(3),true,false]),tasks,at,{status:()=>r(372,[u(1)]),prediction:()=>undefined}).output;
 const a=appraisalOutput(occ(1129),w,tasks.map(t=>({taskKey:t.key,specId:t.specId,minimum:ZERO,maximum:ONE}))),c=concernOutput(occ(1130),a,r(385,[q(0,1),false]));
 // Expected fulfillment is a governed relation to this accepted undertaking. Different
 // action positions in the three contexts prevent option ordinal from carrying meaning.
 const fulfills=spec.expected.map(v=>x.contrary?!v:v),known=x.meaningAvailable&&x.accepted;
 const motive=r(394,[occ(1131),c,list(tasks.map((t,i)=>r(393,[t.key,q(spec.expected[i]?spec.commitment:spec.temptation,4)])))]);
 const context=candidateOutput(occ(1132),motive,true,task=>{const i=tasks.findIndex(t=>key(t.key)===key(task));return {instructionId:tasks[i].specId,actionId:f(rec(options[i],395n),2n)};});
 const base=rec(rawSignalOutput(occ(1133),context,false,ONE,()=>undefined).output,403n),signals=[...items(f(base,3n),'set')];
 const used=x.at===5&&known&&law!=='NoFeedback'?(law==='SeparateContext'?history.filter(v=>(items(v,'list')[1] as {value:string}).value===x.context):history):[];
 const s=strength(used),basis=r(400,[map(used.map(v=>[cognitiveNamed(399,{VariantTag:u(2),QualificationOccurrenceId:typedIdentifier(1138,items(v,'list')[0])}),q(1,1)]))]);
 if(!s.equals(ZERO))for(let i=0;i<2;i++)signals.push(r(402,[r(401,[options[i],tasks[i].key,u(3)]),qValue(fulfills[i]?s:ZERO.subtract(s)),basis]));
 const meaning=map(options.map((o,i)=>[o,q(known&&fulfills[i]?1:0,1)] as [CanonicalValue,CanonicalValue]));
 const raw=r(403,[f(base,1n),context,set(signals),meaning]),modifier=r(439,[q(1,x.at===5?16:1),u(3)]),dice=r(437,[r(438,[q(1,10),q(1,5),q(3,5),q(4,5),q(9,10)]),q(0,1),modifier,modifier]);
 const reasons=r(408,[occ(1134),raw,list(compileReasonNuclei(items(f(rec(raw,403n),3n),'set'),dice))]),root=typedIdentifier(1135,u(at)),session=createCognitiveRandomSession(new Uint8Array(32).fill(seed));session.begin();let resolution:CanonicalValue;
 try{resolution=await arbitrationOutput(root,at,reasons,r(440,[q(1,2),q(1,2)]),session.forResolution(root,reasons));session.prepareCommit();session.commit();}finally{session.close();}
 const intent=intentOutput(occ(1136),resolution!),expression=expressionOutput(occ(1137),intent),qualification=qualificationOutput(typedIdentifier(1138,u(at)),expression),chosen=chosenData(resolution!);
 const index=options.findIndex(v=>key(v)===key(f(chosen,1n)));
 return {bundle:list([safeValue(x),text(JSON.stringify({predicate:spec.predicate,expected:fulfills,accepted:x.accepted,available:x.meaningAvailable,competingMotive:spec.competingMotive})),context,raw,reasons,resolution!,intent,expression,qualification,list(session.committedAddressKeys().map(text)),qValue(s)]),intent,index,known,fulfills:fulfills[index],qualification};
}
function qualify(x:Safe,d:Awaited<ReturnType<typeof source>>,law:Law){
 const native=rec(f(rec(d.qualification,429n),3n),430n),accepted=(f(native,1n) as {value:bigint}).value===1n;
 let contribution=accepted?readQ(f(native,3n)):ZERO,status='Accepted';
 if(!x.admitted){status='Withheld';contribution=ZERO;}
 else if(!d.known){status='UnknownMeaning';contribution=ZERO;}
 else if(law==='Frequency')contribution=d.fulfills?ONE:ZERO.subtract(ONE);
 else if(law==='Graded')contribution=contribution.multiply(readQ(q(x.significance,4))).multiply(ONE.subtract(readQ(q(x.pressure,4))));
 else if(x.significance<2){status='Insignificant';contribution=ZERO;}
 else if(x.pressure>=2){status='Constrained';contribution=ZERO;}
 if(contribution.equals(ZERO)&&status==='Accepted')status='ZeroContribution';
 return list([u(x.at),text(x.context),d.bundle,text(status),qValue(contribution)]);
}
export function createCrossContextRun(law:Law,frames:readonly Frame[],seed=7){
 if(!LAWS.includes(law)||!Number.isInteger(seed)||seed<0||seed>255)throw Error('CCI_PROFILE');const originals=checked(frames);
 let prefix=0,busy=false,history:CanonicalValue[]=[],rows:CanonicalValue[]=[],world:CanonicalValue[]=[];
 const snapshot=()=>clone(list([u(prefix),list(history),list(rows),list(world)]));
 const save=()=>enc(list([text(VERSION),text(law),text(JSON.stringify(originals)),u(seed),snapshot()]));
 return Object.freeze({snapshot,save,observerView:()=>clone(list([u(prefix),list(history),list(rows)])),
  async step(fault?:'after-choice'|'before-commit'){
   if(busy)throw Error('CCI_CONCURRENT');if(prefix===5)return false;busy=true;
   try{
    const input=originals[prefix],x=safe(input),prior=law==='Refold'?rows.flatMap(v=>{const a=items(v,'list'),qs=items(a[2],'list');return qs.length&&!readQ(qs[4]).equals(ZERO)?[a[2]]:[];}):history;
    const d=await source(x,seed,prior,law);if(fault==='after-choice')throw Error('CCI_INJECTED');
    const qualification=prefix<4?qualify(x,d,law):list([]),qs=items(qualification,'list'),next=qs.length&&!readQ(qs[4]).equals(ZERO)?[...prior,qualification]:prior;
    const plan=planOutput(typedIdentifier(1139,u(x.at)),d.intent,r(391,[u(d.index+1)])),attempt=attemptOutput(typedIdentifier(1140,u(x.at)),plan),execution=executionOutput(typedIdentifier(1141,u(x.at)),attempt,input.permitted);
    const row=list([u(x.at),d.bundle,qualification,list(next),qValue(strength(next))]);clone(row);
    if(fault==='before-commit')throw Error('CCI_INJECTED');history=next;rows=[...rows,row];world=[...world,execution];prefix++;return true;
   }finally{busy=false;}
  }
 });
}
export async function restoreCrossContextRun(law:Law,frames:readonly Frame[],seed:number,prefix:number,saved:Uint8Array){
 if(!Number.isInteger(prefix)||prefix<0||prefix>5||!(saved instanceof Uint8Array))throw Error('CCI_RESTORE');const copy=saved.slice(),run=createCrossContextRun(law,frames,seed);for(let i=0;i<prefix;i++)await run.step();const actual=run.save();if(actual.length!==copy.length||actual.some((v,i)=>v!==copy[i]))throw Error('CCI_SAVE_MISMATCH');return run;
}
export function crossContextSummary(view:CanonicalValue){return items(items(view,'list')[2],'list').map(v=>{const x=items(v,'list'),b=items(x[1],'list'),d=chosenData(b[5]),qs=items(x[2],'list'),e=items(f(rec(b[7],426n),3n),'list');return {at:Number((x[0] as {value:bigint}).value),context:JSON.parse((b[0] as {value:string}).value).context,chosen:key(f(d,1n)),authorship:fraction(f(d,7n)),alignment:e.length?fraction(f(rec(e[0],427n),2n)):null,probabilities:items(f(d,2n),'list').map(p=>fraction(f(rec(p,421n),2n))),used:fraction(b[10]),strength:fraction(x[4]),disposition:qs.length?(qs[3] as {value:string}).value:'Probe',contribution:qs.length?fraction(qs[4]):'0/1',expression:key(b[7]),addresses:items(b[9],'list').map(v=>(v as {value:string}).value)};});}
