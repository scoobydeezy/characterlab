/** M53 fixed comparison, derived from frozen M52 setup. Construct inherited data once. */
import {list,text,unsigned as u,signed,rational as q,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {AuthoritativeState,restoreAuthoritativeState} from '../../substrate/state';
import {embodiedRecord as r} from '../../campaign3/embodiedCodecs';
import {SIGNIFICANCE_RULES,SIGNIFICANCE_REGISTRY,SPATIAL_MEANING_RULES,SPATIAL_MEANING_REGISTRY} from '../../assembled/model';
import {BODY_SAMPLE,BODY_DELIVERY} from '../../assembled/body';
import {POSITION,POSITION_SOURCE,POSITION_AUTHORITY} from '../../assembled/positionPerception';
import {POSITION_MEMORY} from '../../assembled/memory';
import {RETAINED_ATTRIBUTION} from '../../assembled/retainedAttribution';
import {SIGNIFICANCE} from '../../assembled/significance';
import {SPATIAL_MEANING} from '../../assembled/goalMeaning';
import {sid} from '../../assembled/skill';
import {source as priorSource,data as priorData,decode,items,key,enc} from './assembledWorkspaceDomain';
import {signedValue} from './assembledComparison';
import {changeDefinition} from './assembledCharacter';
type Options={goal?:'High'|'Wide';retained?:number;recalled?:number;workspace?:number;confounded?:boolean;hidden?:boolean;denied?:boolean;noAfter?:boolean};
function source(o:Options={}){const s=priorSource(o.workspace??20,o.goal??'High',true),a=[...items(decode(s.registry),'list')],b=[...items(a[6],'list')],ret=items(a[8],'list');b[2]=q(10,1);a[6]=list(b);a[8]=list([ret[0],ret[1],u(o.retained??16),ret[3]]);a[9]=list([items(a[9],'list')[0],u(o.recalled??16)]);return {...s,rulesVersion:SIGNIFICANCE_RULES,registrySchemaVersion:SIGNIFICANCE_REGISTRY,registry:enc(list([...a,list([text(POSITION),POSITION_AUTHORITY]),list([text(POSITION_MEMORY)]),list([text(RETAINED_ATTRIBUTION)]),list([text(SIGNIFICANCE)])]))};}
function data(o:Options={}){const d=priorData(true),initial=restoreAuthoritativeState(decode(d.initialState)),C=initial.entries().find(e=>e.path.rootStateTypeId===455n)!.path.selectors[0];if(C.kind!=='mapKey')throw Error('body key');const rows=items(decode(d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return key(a[2])!==key(BODY_SAMPLE)||[1,4,5,8,9,12,13,16].includes(Number(signedValue(a[0])));}),frames:CanonicalValue[]=[];
 for(let at=1;at<=16;at++){const phase=(at-1)%4,trial=Math.floor((at-1)/4),motion=phase===1||phase===2,position=motion?list([u(o.denied&&o.hidden&&at===3?7:phase===2&&trial>=2?1:0),u(0),u(1),true,!(o.denied&&at===3),u(1)]):list([]);frames.push(list([signed(at),u(10),POSITION_SOURCE,list([text(POSITION),position,list([u(1),text(phase===0?'Before':phase===3?'After':'Motion'),true,!(o.noAfter&&at===16)])]),list([])]));}
 const sample=items(rows.find(v=>key(items(v,'list')[2])===key(BODY_SAMPLE))!,'list');
 for(let at=18;at<=31;at++)rows.push(list([signed(at),...sample.slice(1)]));
 frames.push(list([signed(32),u(10),POSITION_SOURCE,list([text(POSITION),list([u(2),u(0),u(1),true,true,u(1)]),list([])]),list([])]));
 const deliveries=o.confounded?[[3,40],[7,40],[11,40],[15,40]]:[[4,30],[8,30],[11,40],[15,40]];
 return {...d,initialState:enc(new AuthoritativeState(initial.entries().map(e=>e.path.rootStateTypeId===455n?{...e,value:r(454,[o.hidden&&!o.denied?q(61,2):q(30,1),signed(0)])}:e)).canonicalValue()),orderedInputs:enc(list([...rows,...frames,...deliveries.map(([at,amount])=>list([signed(at),u(110),BODY_DELIVERY,list([C.key,q(amount,1)]),list([])]))]))};}

let cached:ReturnType<typeof build>|undefined;
function build(){
 let s=source();for(const n of ['definition/task-a','definition/task-b','definition/configurable-garden'])s=changeDefinition(s,n,6n,signed(40));
 const slots=[...items(decode(s.registry),'list'),list([text(SPATIAL_MEANING),list([q(0,1),q(0,1)]),u(1),text('BothDirections'),u(1)])];
 s={...s,rulesVersion:SPATIAL_MEANING_RULES,registrySchemaVersion:SPATIAL_MEANING_REGISTRY,registry:enc(list(slots))};
 const d=data(),rows=items(decode(d.orderedInputs),'list').filter(v=>!(signedValue(items(v,'list')[0])===31n&&key(items(v,'list')[2])===key(BODY_SAMPLE)));
 const visual=rows.find(v=>signedValue(items(v,'list')[0])===32n)!;
 rows.push(list([signed(31),...items(visual,'list').slice(1)]));
 for(const v of [...rows])if(signedValue(items(v,'list')[0])===17n&&(key(items(v,'list')[1])===key(u(30))||key(items(v,'list')[2])===key(sid(1001,'event/deliberation-opportunity'))))rows.push(list([signed(33),...items(v,'list').slice(1)]));
 return {s,d:{...d,orderedInputs:enc(list(rows))}};
}
export function fixture(law:'SignificanceFirst'|'AgeOnly'='SignificanceFirst'){
 const b=structuredClone(cached??(cached=build())),a=[...items(decode(b.s.registry),'list')];a[31]=list([items(a[31],'list')[0],text(law)]);b.s.registry=enc(list(a));return b;
}
export {decode,items,key,enc};
