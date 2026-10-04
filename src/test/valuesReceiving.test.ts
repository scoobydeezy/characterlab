import {it,expect} from 'vitest';
import {createValuesOwner} from '../campaign3/valuesComponent';
import {receiveValues,type ValuesProbe} from '../campaign3/valuesReceiving';
const probe:ValuesProbe={instant:5,seed:1,currentNeed:0,goal:1,linked:true,mode:'ValuesOnly'};
it('preserves carrier expiry and no-reason outcomes without inventing choices',async()=>{
 const o=createValuesOwner('Accumulated'),none=await receiveValues(o,{...probe,goal:0});expect(none.status).toBe('NoReasons');expect(none.chosen).toBeNull();expect(none.probabilities).toEqual([]);
 o.admit({instant:1,id:1,category:'Care',target:'A',outcome:1});const live=await receiveValues(o,{...probe,instant:64}),expired=await receiveValues(o,{...probe,instant:65});expect(live.status).toBe('Chosen');expect(expired.status).toBe('NoCandidates');expect(expired.chosen).toBeNull();expect(expired.view).toEqual(live.view);expect(expired.addresses).toEqual([]);
});
function trained(){const o=createValuesOwner('Accumulated');for(let i=1;i<=3;i++)o.admit({instant:i,id:i,category:'Care',target:'A',outcome:1});return o;}
it('acquired preference reaches actual inherited arbitration with current Need zero',async()=>{
 const o=trained(),before=o.save(),learned=await receiveValues(o,probe),empty=await receiveValues(createValuesOwner('Accumulated'),probe);
 expect(learned.contribution).toBe('3/4');expect(learned.probabilities).not.toEqual(empty.probabilities);expect(['A','B']).toContain(learned.chosen);expect(o.save()).toEqual(before);
});
it('joint shared-evidence use equals ValuesOnly and does not double count',async()=>{
 const o=trained(),a=await receiveValues(o,probe),b=await receiveValues(o,{...probe,currentNeed:1,mode:'Joint'}),c=await receiveValues(o,{...probe,currentNeed:1,mode:'NeedOnly'});
 expect(b.probabilities).toEqual(a.probabilities);expect(c.probabilities).toEqual(a.probabilities);expect(b.contribution).toBe('3/4');
});
it('NeedOnly and missing category linkage lose the durable contribution at zero demand',async()=>{
 const o=trained(),a=await receiveValues(o,{...probe,mode:'NeedOnly'}),b=await receiveValues(o,{...probe,linked:false});expect(a.contribution).toBe('0/1');expect(a.probabilities).toEqual(b.probabilities);
});
it('goal intervention changes arbitration without changing retained preference',async()=>{
 const o=trained(),a=await receiveValues(o,probe),b=await receiveValues(o,{...probe,goal:0});expect(a.view).toEqual(b.view);expect(a.probabilities).not.toEqual(b.probabilities);
});
it('later contrary evidence changes future receiving and preserves past probe projections',async()=>{
 const o=trained(),before=await receiveValues(o,probe);for(let i=6;i<=10;i++)o.admit({instant:i,id:i,category:'Care',target:'B',outcome:-1});const after=await receiveValues(o,{...probe,instant:11});expect(after.contribution).toBe('-2/9');expect(after.probabilities).not.toEqual(before.probabilities);expect((await receiveValues(o,probe)).probabilities).toEqual(before.probabilities);
});
it('NoConsolidation retains outcome learning for NeedOnly without inventing a Value',async()=>{
 const o=createValuesOwner('NoConsolidation');o.admit({instant:1,id:1,category:'Care',target:'A',outcome:1});
 expect((await receiveValues(o,probe)).contribution).toBe('0/1');expect((await receiveValues(o,{...probe,currentNeed:1,mode:'NeedOnly'})).contribution).toBe('1/2');
});
it('all eight fixed seeds retain complete choice comparisons, including equal choices',async()=>{
 const o=trained(),pairs=[];for(let seed=0;seed<8;seed++){const a=await receiveValues(o,{...probe,seed}),b=await receiveValues(o,{...probe,seed,mode:'NeedOnly'});pairs.push([a.chosen,b.chosen]);expect(a.probabilities).not.toEqual(b.probabilities);}
 expect(pairs.some(([a,b])=>a!==b)).toBe(true);
});
