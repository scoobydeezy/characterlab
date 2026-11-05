/** M56: M55 physical scene, no fatigue input; only A available, workspace6.
 * Action3 earns habit; all later habit feedback hidden. Unresolved4 -> access5;
 * interruption7 -> rebound9; observed resolution9 -> release11. Seed0. */
import {list,text,unsigned as u,signed,type CanonicalValue} from '../../substrate/canonicalEncoding';
import {RUMINATION_RULES,RUMINATION_REGISTRY} from '../../assembled/model';
import {RUMINATION,RUMINATION_SOURCE,type RuminationLaw} from '../../assembled/rumination';
import {FATIGUE_SOURCE} from '../../assembled/fatigue';
import {HABIT_SOURCE} from '../../assembled/habit';
import {CONTROL_SOURCE} from '../../assembled/control';
import {fixture as previous,decode,items,key,enc} from './assembledFatigue';
import {habitFrame} from './assembledHabit';
import {signedValue} from './assembledComparison';
export {decode,items,key,enc};
export type Options={interrupt?:boolean;truth?:boolean;onset?:boolean;resolution?:boolean;board?:boolean;external?:boolean;law?:RuminationLaw};
export const concernFrame=(at:number,display:number,interrupt=false,visible=true,recipient=true,board=true,truth=true)=>list([signed(at),u(10),RUMINATION_SOURCE,list([text(RUMINATION),u(display),visible,recipient,interrupt,board,truth]),list([])]);
let cached:ReturnType<typeof build>|undefined;
function build(){
 const b=previous({physical:0}),slots=[...items(decode(b.s.registry),'list')],task=items(items(items(slots[12],'list')[1],'list')[0],'list')[0];
 slots.push(list([text(RUMINATION),task,text('EveryOpportunity')]));
 b.s={...b.s,rulesVersion:RUMINATION_RULES,registrySchemaVersion:RUMINATION_REGISTRY,registry:enc(list(slots))};
 const rows=items(decode(b.d.orderedInputs),'list').filter(v=>{const a=items(v,'list');return key(a[2])!==key(FATIGUE_SOURCE)&&!(key(a[2])===key(HABIT_SOURCE)&&signedValue(a[0])>3n);});
 for(const v of [...rows])if(signedValue(items(v,'list')[0])===9n)rows.push(list([signed(11),...items(v,'list').slice(1)]));
 rows.push(...[5,7,9,11].map(at=>habitFrame(at,true,{visible:false})));
 b.d.orderedInputs=enc(list(rows));return b;
}
export function fixture(o:Options={}){
 const b=structuredClone(cached??(cached=build())),slots=[...items(decode(b.s.registry),'list')],d=items(slots[39],'list');slots[39]=list([d[0],d[1],text(o.law??'EveryOpportunity')]);b.s.registry=enc(list(slots));
 const rows=items(decode(b.d.orderedInputs),'list').map(v=>{const a=items(v,'list');if(o.external&&key(a[2])===key(CONTROL_SOURCE)&&signedValue(a[0])===7n){const p=[...items(a[3],'list')];p[4]=true;return list([...a.slice(0,3),list(p),a[4]]);}return v;});
 rows.push(...[4,5,7,9,11].map(at=>concernFrame(at,at===4?1:at===9?2:0,at===7&&(o.interrupt??true),at===4?o.onset!==false:at===9?o.resolution!==false:true,true,o.board!==false,o.truth??at<9)));
 b.d.orderedInputs=enc(list(rows));return b;
}
