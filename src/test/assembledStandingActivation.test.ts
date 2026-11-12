import {it,expect} from 'vitest';
import {create,mapping,rec,f,items,readQ,definition,key} from './fixtures/assembledStandingSources';
const fraction=(v:ReturnType<typeof readQ>)=>v.numerator+'/'+v.denominator;
it('M90 setup: unchanged M89 operands before declaring probe',async()=>{
 const a=await create(),p=mapping(a.run),dice=rec(definition(a.b.s),437n);
 console.info('M90 SETUP '+JSON.stringify({
 threshold:fraction(readQ(f(dice,2n))),standingUnit:fraction(readQ(f(rec(f(dice,3n),439n),1n))),
 meanings:[...p.semantics.values()].map(fraction),P:fraction(p.formation.P),
 nuclei:p.ns.map(v=>{const n=rec(v,407n),roles=rec(f(n,2n),406n);return {key:key(f(n,1n)),roles:[1n,2n,3n,5n].map(i=>fraction(readQ(f(roles,i)))),die:String((f(n,4n) as {value:bigint}).value),modifiers:[5n,6n,8n].map(i=>String((f(n,i) as {value:bigint}).value))};}),
 sources:items(f(p.raw,6n),'list').map(v=>{const d=items(v,'list'),s=rec(d[2],402n);return {label:d[0],source:key(f(s,1n)),strength:fraction(readQ(f(s,2n)))};})
 }));
 expect(p.ns).toHaveLength(2);
},570000);
