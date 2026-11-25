/** M255: current character; body10/seed0, social A/B and unknown third.
 * A0 attempts4/8/10/12/14, B1 attempt6; actual successful execution, fallible feedback.
 * No causal diagnostics, obstruction, learned S0, acquired motives or skill practice. */
import {fixture as prior,rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid,type CanonicalValue} from './assembledCausalDisclosure';
import {EXPECTATION_TOPIC} from '../../assembled/performanceExpectation';
import {CAUSAL_SOURCE,CAUSAL_CONTEXT} from '../../assembled/causalAttribution';
import {OBSTRUCTION_SOURCE} from '../../assembled/externalObstruction';
import {COMM_SOURCE,LEARNED_DISCLOSURE} from '../../assembled/communication';
import {PERFORMANCE,PERFORMANCE_SETTING} from '../../assembled/performance';
import {PRACTICE_SETTING} from '../../assembled/skill';
import {PRIORITY_DISPLAY} from '../../assembled/priority';
import {prepareCharacterModel,createCharacterRun} from '../../assembled/character';
import {cachedMemory} from './assembledMemoryFinal';
export type Mode='correction'|'positive'|'missing'|'nonengaged'|'denied'|'other-failure'|'hidden';
let base:ReturnType<typeof prior>|undefined;
export function fixture(mode:Mode='correction'){
 const b=base??(base=prior('hidden')),slots=[...items(decode(b.s.registry),'list')],comm=items(slots[18],'list'),topic=list([text(EXPECTATION_TOPIC),b.taskA,u(0)]);slots[18]=list([...comm.slice(0,3),topic]);
 const strategy=items(items(slots[12],'list')[1],'list'),bRoute=items(strategy.find(v=>key(items(v,'list')[0])===key(b.taskB))!,'list'),definition=items(slots[0],'set').find(v=>key(f(rec(v,171n),1n))===key(bRoute[2]))!,actionB=f(rec(f(rec(definition,171n),4n),389n),1n);
 const filtered=items(decode(b.d.orderedInputs),'list').filter(v=>![CAUSAL_SOURCE,CAUSAL_CONTEXT,OBSTRUCTION_SOURCE,COMM_SOURCE,PERFORMANCE_SETTING].some(t=>key(items(v,'list')[2])===key(t))),frame=filtered.filter(v=>key(items(v,'list')[0])===key(signed(4))),rows=filtered.filter(v=>![4,6,8].some(at=>key(items(v,'list')[0])===key(signed(at))));
 for(const at of [4,6,8,10,12,14]){
  const task=at===6?b.taskB:b.taskA;
  for(const v of frame){const a=[...items(v,'list')];a[0]=signed(at);
   if(key(a[2])===key(PRIORITY_DISPLAY)){const p=items(a[3],'list');a[3]=list([p[0],list(items(p[1],'list').map(v=>{const x=[...items(v,'list')];x[3]=key(x[0])===key(task)?list([q(1,1)]):list([]);return list(x);}))]);}
   if(key(a[2])===key(PRACTICE_SETTING)){const p=[...items(a[3],'list')];p[1]=u(0);p[2]=q(0,1);p[3]=q(mode==='hidden'&&at===4?1:0,1);p[4]=!(mode==='nonengaged'&&at===4);p[5]=false;a[3]=list(p);}
   rows.push(list(a));
  }
  const visible=!(mode==='missing'&&at===4||mode==='denied'&&[8,10,12].includes(at)),positive=at===4?mode==='positive'||mode==='nonengaged':at===6?mode!=='other-failure':true;
  rows.push(list([signed(at),u(30),PERFORMANCE_SETTING,list([text(PERFORMANCE),list(at===14?[]:[list([task,visible,u(positive?2:1)])])]),list([])]));
  rows.push(list([signed(at),u(10),COMM_SOURCE,list([text(LEARNED_DISCLOSURE),true,true,false]),list([])]));
 }
 return {...b,mode,topic,actionB,s:{...b.s,registry:enc(list(slots))},d:{...b.d,orderedInputs:enc(list(rows))}};
}
const models=new Map<string,ReturnType<typeof prepareCharacterModel>>();
export async function start(mode:Mode='correction'){const b=fixture(mode),k=key(decode(b.s.registry));let p=models.get(k);if(!p){p=prepareCharacterModel(b.s);models.set(k,p);}const m=await p;return {b,m,run:cachedMemory(await createCharacterRun(m,b.d))};}
export async function through(run:Awaited<ReturnType<typeof createCharacterRun>>,at:bigint){for(let n=0;run.snapshot().clock<at;n++)if(n>=128||!await run.settleNextInstant())throw Error('M255 did not reach '+at);if(run.snapshot().clock!==at)throw Error('M255 skipped '+at);}
export {rec,f,uint,items,key,decode,enc,list,text,signed,q,outputs,C,u,set,sid};
export type {CanonicalValue};
