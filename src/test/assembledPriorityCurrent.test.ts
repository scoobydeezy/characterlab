import {it,expect} from 'vitest';
import {start,through,capture,items,f,rec,q,type Run} from './fixtures/assembledPriorityCurrent';
import {createImportanceRun,LAWS} from '../campaign3/importanceUrgency';
import {importanceFrames} from './importanceUrgencyFixtures';
import {analyze} from './fixtures/assembledMultiComparison';
it('priority222 current six-frame matrix consumes retained importance and fresh urgency',async()=>{
 const cells=new Map<string,ReturnType<typeof capture>[]>();
 for(const I of [500,1000])for(const U of [0,1000]){
  const x=await start({importance:I,initialUrgency:U}),rows:ReturnType<typeof capture>[]=[],controls=new Map<string,number[]>();
  for(const law of LAWS){const old=createImportanceRun(law,importanceFrames(I,U),0);while(await old.step()){}controls.set(law,old.observerView().rows.map(r=>r.strength));}
  expect(controls.get('RefoldImportance')).toEqual(controls.get('Factored'));
  for(let i=0;i<6;i++){
   await through(x.run,BigInt(i+2));const c=capture(x.run,x.b.task,i+2);rows.push(c);
   expect(c.operand[1],'live retained importance').toEqual({kind:'list',items:[q(I,1000)]});
   expect(c.operand[3]).toEqual(q(controls.get('Factored')![i],1000));
   expect(c.ns.length,'live actual receiving nuclei').toBeGreaterThan(0);
   expect(items(f(c.raw,7n),'list'),'fixed independent Need responses').toHaveLength(2);
   const analysis=analyze(c.raw,c.ns,x.b.s);
   expect(c.prob).toEqual(analysis.probabilities.map(v=>({kind:'rational',numerator:v.probability.numerator,denominator:v.probability.denominator})));
  }
  cells.set(I+'/'+U,rows);
  console.info('M222 MATRIX',JSON.stringify({I,U,motive:rows.map(r=>r.operand[3]),probabilities:rows.map(r=>r.prob),controls:Object.fromEntries(controls)},(_,v)=>typeof v==='bigint'?String(v):v));
 }
 const a=cells.get('1000/0')!,b=cells.get('500/1000')!;
 expect(a[0].operand[3]).toEqual(b[0].operand[3]);expect(a[0].prob).toEqual(b[0].prob);
 expect(a[3].operand[3]).not.toEqual(b[3].operand[3]);expect(a[3].prob,'retained importance changes actual production probabilities under common urgency1').not.toEqual(b[3].prob);
 expect(a[2].operand[2]).toEqual({kind:'list',items:[]});expect(a[2].operand[3]).toEqual(q(0,1));
 console.info('M222 PRIMARY PASS current0.145; exact six-frame Factored/Refold correspondence; probability separation; no sampled/coupled claim');
},590000);
