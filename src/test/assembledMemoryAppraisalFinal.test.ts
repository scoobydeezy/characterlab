/** M175: significant retained experience changes a later live appraisal on0.126. */
import {it,expect} from 'vitest';
import {fixture172} from './fixtures/assembledEarlyDefining';
import {startMemory} from './fixtures/assembledMemoryFinal';
import {live172,positions172,acquired172} from './assembledEarlyDefining.test';
import {through,finish,reports,report,state} from './assembledDefining.test';
import {items,decode,key,enc,list} from './fixtures/assembledDefiningControls';
import {u,signed,text} from './fixtures/assembledDefining';
import {SPATIAL_MEANING} from '../assembled/goalMeaning';
import {FINAL_RECALL} from '../assembled/rehearsal';
import {RECALL,isBodyEpisodePath} from '../assembled/memory';
import {named} from '../assembled/significance';
function scenario(goal:'High'|'Wide'){
 const b=fixture172({goal}),slots=[...items(decode(b.s.registry),'list')],ret=[...items(slots[8],'list')],r=[...items(slots[52],'list')],final=[...items(r[3],'list')];
 ret[4]=list([list([signed(37),ret[1],u(8),u(2)])]);slots[8]=list(ret);final[1]=u(2);r[3]=list(final);slots[52]=list(r);
 return {...b,s:{...b.s,registry:enc(list(slots))}};
}
it('connection175: early significant retained history changes actual later spatial appraisal',async()=>{
 const a=await startMemory(scenario('High')),b=await startMemory(scenario('Wide'));
 for(const [x,goal]of [[a,'High'],[b,'Wide']] as const){await through(x.run,21n);live172(x.run,goal);}
 for(const [x,high]of [[a,true],[b,false]] as const){
  await through(x.run,37n);expect(positions172(x.run).map(acquired172)).toEqual(high?[3,15]:[14,15]);expect(state(x.run).entries().filter(e=>isBodyEpisodePath(e.path))).toHaveLength(8);
  await through(x.run,50n);const m=report(x.run,SPATIAL_MEANING,50),assessment=named(m[5],'assessment');expect(named(assessment,'kind'),'live appraisal').toEqual(text('Assessed'));
  expect(named(assessment,'relation')).toEqual(text(high?'MovingCloser':'SameDistance'));
  const consumed=items(m[4],'list').map(v=>items(v,'list')[1]),published=reports(x.run,RECALL).filter(v=>key(v[1])===key(signed(50)));
  expect(consumed.map(v=>items(v,'list')[5])).toEqual([signed(high?3:14),signed(15)]);
  for(const v of consumed)expect(published.some(p=>key(p[2])===key(v))).toBe(true);
  expect(items(report(x.run,FINAL_RECALL,50)[5],'list')).toHaveLength(2);
 }
 expect(state(a.run).entries().filter(e=>e.path.rootStateTypeId===455n)).toEqual(state(b.run).entries().filter(e=>e.path.rootStateTypeId===455n));
 for(const x of[a,b]){await finish(x.run);expect(x.run.snapshot().clock).toBe(5001n);expect(x.run.diagnostic()).toBeUndefined();}
 console.info('M175 CONNECTION PASS same current body/spatial goal; actual High3/15 recalled ->MovingCloser versus Wide14/15 ->SameDistance; real consumed memory, same reference laws, full5001. No random-choice claim.');
},590000);
