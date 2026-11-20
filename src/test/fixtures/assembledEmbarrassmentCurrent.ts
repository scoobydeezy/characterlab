/** M188 bd8218b9: original M59 reports in the current full character. */
import {fixture as current} from './assembledAffectMemoryCurrent';
import {changeDefinition} from './assembledCharacter';
import {list,text,unsigned as u,signed,rational as q,typedIdentifier,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {fixture as previous,decode,items,key,enc} from './assembledRumination';
import {peopleData,target,other} from './assembledPersonHistory';
import {thirdKey} from './assembledConfiguration';
import {signedValue} from './assembledComparison';
import {ATTACHMENT,LOSS} from '../../assembled/attachment';
import {SOCIAL_SOURCE} from '../../assembled/social';
import {RUMINATION_SOURCE} from '../../assembled/rumination';
import {FATIGUE_SOURCE} from '../../assembled/fatigue';
import {CONTROL_SOURCE} from '../../assembled/control';
import {DISPLAY} from '../../assembled/strategy';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {EMBARRASSMENT} from '../../assembled/embarrassment';
import {EMBARRASSMENT_RULES,EMBARRASSMENT_REGISTRY} from '../../assembled/model';
import {PRACTICE_SETTING,SKILL} from '../../assembled/skill';
import {BODY_DELIVERY} from '../../assembled/body';
import {PerceptualFeatureId as CF} from '../../semanticBinding/perceptualClassification';
import {dataRecord as metadataRecord,dataField as f,dataUnsigned as uint} from '../../campaign2/canonicalData';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord} from '../../campaign3/embodiedCodecs';
type Opt={competing?:boolean;mixed?:boolean;mismatch?:boolean;seen?:boolean;judgment?:boolean;unknown?:number;denied?:boolean;truth?:boolean;signal?:string;late?:boolean;correction?:boolean;zeroBase?:boolean;duplicate?:boolean};
let base:ReturnType<typeof previous>|undefined,frames:CanonicalValue[]|undefined;
const actionA=typedIdentifier(1027,text('definition/protocol-contact-one')),actionB=typedIdentifier(1027,text('definition/protocol-contact-two'));
function original(o:Opt={},seed=0){
 const b=structuredClone(base??(base=previous())),slots=[...items(decode(b.s.registry),'list')];
 const important=items(items(slots[12],'list')[1],'list').map(v=>items(v,'list')[0]).filter(t=>key(t)!==key(thirdKey));
 slots.push(list([text(ATTACHMENT)]),list([text(LOSS),list([list([target,actionB]),list([other,actionA])])]),list([text(EMBARRASSMENT),target,important[0],actionA]));
 b.s={...b.s,rulesVersion:EMBARRASSMENT_RULES,registrySchemaVersion:EMBARRASSMENT_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return signedValue(a[0])<=3n&&![RUMINATION_SOURCE,FATIGUE_SOURCE,CONTROL_SOURCE,SOCIAL_SOURCE].some(t=>key(t)===key(a[2]));}).map(v=>{
  const a=items(v,'list');
  if((o.zeroBase||o.competing)&&key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];if(key(r[0])===key(important[0])&&items(r[1],'list').length)r[1]=list([o.zeroBase?q(0,1):q(3,5)]);return list(r);}))]),a[4]]);}
  if(key(a[2])!==key(DISPLAY))return v;const p=items(a[3],'list');return list([...a.slice(0,3),list([p[0],list(items(p[1],'list').map(v=>{const r=[...items(v,'list')];r[3]=important.some((t,i)=>key(t)===key(r[0])&&uint(r[1])===BigInt(i));return list(r);}))]),a[4]]);
 });
 frames??=items(decode(peopleData(false,0,[{at:1,signals:[['appearance/coat',true]],kind:0},{at:2,signals:[['appearance/coat',true]],continuity:true,kind:0}]).orderedInputs),'list').filter(v=>key(items(v,'list')[2])===key(SOCIAL_SOURCE));
 const selected=o.late?[list([signed(3),...items(frames[0],'list').slice(1)])]:[...frames];
 if(o.correction){selected.push(list([signed(3),...items(frames[1],'list').slice(1)]));for(const row of [...rows])if(signedValue(items(row,'list')[0])===3n)rows.push(list([signed(4),...items(row,'list').slice(1)]));}
 for(const frame of selected){const row=[...items(frame,'list')],p=[...items(row[3],'list')],s=[...items(p[1],'list')],r=[...items(p[6],'list')];const at=signedValue(row[0]);s[3]=u(0);s[4]=u(o.duplicate&&at===3n?1:Number(at));s[5]=o.denied!==true;p[1]=list(s);r[2]=false;p[6]=list(r);p[5]=list([list([text(o.signal??'appearance/coat'),true])]);
  p.push(list([u(1),u(1)]),list([false,u(0),false,false,false,true,true]),list([false,u(0),true,u(0)]),list([o.mismatch??true,o.seen??true,(at===3n&&o.correction)||(at===2n&&o.mixed)?false:o.judgment??true].map((v,i)=>list([v,o.unknown!==i,o.truth??true]))));row[3]=list(p);rows.push(list(row));
 }
 b.d={...b.d,runSeed:new Uint8Array(32).fill(seed),orderedInputs:enc(list(rows))};return b;
}

let modern:ReturnType<typeof current>|undefined;
export function fixture(o:Opt={}){
 const old=original({mixed:true,competing:true,...o}),b=structuredClone(modern??(modern=current())),slots=[...items(decode(b.s.registry),'list')],prior=items(decode(old.s.registry),'list');
 if(slots.length!==55||prior.length!==43)throw Error('M188 explicit current/prior schema');
 slots[6]=list([text('assembled-body/0.2'),...items(prior[6],'list').slice(1),signed(0)]);
 for(const i of [12,19,42])slots[i]=prior[i];
 for(const i of [32,37]){const p=[...items(slots[i],'list')];p[1]=list([]);slots[i]=list(p);}
 let s={...b.s,registry:enc(list(slots))};
 for(const v of items(prior[0],'set')){
  if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==171n)continue;
  const d=metadataRecord(v,171n),id=f(d,1n);if(typeof id==='boolean'||id.kind!=='typedIdentifier'||typeof id.payload==='boolean'||id.payload.kind!=='text'||!['definition/task-a','definition/task-b','definition/configurable-garden'].includes(id.payload.value))continue;
  const body=f(d,4n);if(typeof body==='boolean'||body.kind!=='record')throw Error('M188 task definition');
  for(const n of[3n,4n,5n,6n])s=changeDefinition(s,id.payload.value,n,f(body,n));
 }
 s=changeDefinition(changeDefinition(s,'definition/protocol-execution',1n,true),'definition/protocol-observation',4n,false);
 const rows=items(decode(old.d.orderedInputs),'list').map(v=>{
  const a=[...items(v,'list')];
  if(key(a[2])===key(SOCIAL_SOURCE)){
   const p=[...items(a[3],'list')];if(typeof p[3]!=='boolean')throw Error('M188 legacy continuity');p[3]=list([p[3],false,false,false]);
   p[4]=list([list(items(p[4],'list').map(value=>list([text(CF.ObservedPersonForm),value,true]))),list([])]);
   p[5]=list(items(p[5],'list').map(v=>list([u(1),...items(v,'list'),true])));
   p[7]=list([...items(p[7],'list'),list([])]);a[3]=list(p);
  }
  if(key(a[2])===key(BODY_DELIVERY))a[3]=list([...items(a[3],'list'),false]);
  if(key(a[2])===key(PRACTICE_SETTING))a[3]=list([text(SKILL),u(4),q(0,1),q(0,1),true,false]);
  return list(a);
 });
 const state=restoreAuthoritativeState(decode(b.d.initialState));
 return {s,d:{...b.d,orderedInputs:enc(list(rows)),runSeed:new Uint8Array(32),initialState:enc(new AuthoritativeState(state.entries().map(e=>e.path.rootStateTypeId===455n&&e.path.fieldId===1n?{...e,value:embodiedRecord(454,[q(10,1),signed(0)])}:e)).canonicalValue())}};
}
export {decode,items,key,enc,target,actionA,actionB};
export type {Opt};
