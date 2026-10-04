import {it,expect} from 'vitest';
import {createValuesOwner,restoreValuesOwner,restoreValuesPrefix,VALUE_LAWS,type ValueReceipt} from '../campaign3/valuesComponent';
const receipt=(instant:number,outcome:ValueReceipt['outcome']=1):ValueReceipt=>({instant,id:instant,category:'Care',target:'A',outcome});
it('acquires prospectively and distinguishes known neutral from unknown',()=>{
 const o=createValuesOwner('Accumulated');expect(o.view(1).mean).toBeNull();o.admit(receipt(1,0));expect(o.view(1).mean).toBeNull();expect(o.view(2)).toEqual({count:1,mean:'0/1',weight:'1/2',preference:'0/1'});
});
it('accumulation resists one contradiction and revises under sustained contrary evidence',()=>{
 const o=createValuesOwner('Accumulated');for(let i=1;i<=3;i++)o.admit(receipt(i));o.admit(receipt(4,-1));expect(o.view(5).preference).toBe('2/5');for(let i=5;i<=8;i++)o.admit(receipt(i,-1));expect(o.view(9).preference).toBe('-2/9');expect(o.view(4).preference).toBe('3/4');
});
it('latest and no-consolidation are serious distinct candidates',()=>{
 for(const law of ['Latest','NoConsolidation'] as const){const o=createValuesOwner(law);for(let i=1;i<=3;i++)o.admit(receipt(i));o.admit(receipt(4,-1));expect(o.view(5).preference).toBe(law==='Latest'?'-1/2':'0/1');}
});
it('missing category or outcome does not learn; target change alone preserves declared category scope',()=>{
 const o=createValuesOwner('Accumulated');o.admit({...receipt(1),category:null});o.admit(receipt(2,null));expect(o.view(3).mean).toBeNull();o.admit({...receipt(3),target:'B'});expect(o.view(4).preference).toBe('1/2');expect(o.view(65)).toEqual(o.view(4));
});
it('duplicates are idempotent but conflicting reuse and nonmonotone instants reject',()=>{
 const o=createValuesOwner('Accumulated');o.admit(receipt(2));const before=o.save();expect(o.admit(receipt(2))).toBe(false);expect(()=>o.admit({...receipt(2),outcome:0})).toThrow('CONFLICT');expect(()=>o.admit(receipt(1))).toThrow('ORDER');expect(o.save()).toEqual(before);
});
it('failure before commit is atomic and retry produces the same owner state',()=>{
 const o=createValuesOwner('Accumulated'),control=createValuesOwner('Accumulated');const before=o.save();expect(()=>o.admit(receipt(1),true)).toThrow('INJECTED');expect(o.save()).toEqual(before);o.admit(receipt(1));control.admit(receipt(1));expect(o.save()).toEqual(control.save());
});
it('stored/refold projections agree at all instants and every saved prefix continues exactly',()=>{
 const a=createValuesOwner('Accumulated'),b=createValuesOwner('Refold');
 for(let i=0;i<=12;i++){expect(a.view(i+1)).toEqual(b.view(i+1));for(const o of [a,b]){const law=o===a?'Accumulated':'Refold';const restored=restoreValuesOwner(law,o.save());expect(restored.save()).toEqual(o.save());if(i<12){restored.admit(receipt(i+1,i<6?1:-1));const next=restoreValuesOwner(law,o.save());next.admit(receipt(i+1,i<6?1:-1));expect(restored.save()).toEqual(next.save());}}if(i<12){a.admit(receipt(i+1,i<6?1:-1));b.admit(receipt(i+1,i<6?1:-1));}}
});
it('all candidates restore and reject a wrong law or damaged save',()=>{
 for(const law of VALUE_LAWS){const o=createValuesOwner(law);o.admit(receipt(1));expect(restoreValuesOwner(law,o.save()).save()).toEqual(o.save());expect(()=>restoreValuesOwner(law==='Latest'?'Refold':'Latest',o.save())).toThrow();const bad=o.save();bad[bad.length-1]^=1;expect(()=>restoreValuesOwner(law,bad)).toThrow();}
});
it('input and output aliases cannot change the owner',()=>{
 const o=createValuesOwner('Accumulated'),x=receipt(1);o.admit(x);const before=o.save();x.outcome=-1;o.history()[0].outcome=-1;o.view(2).preference='99/1';expect(o.save()).toEqual(before);
});
it('unknown fields, hidden truth, getters and invalid domains reject',()=>{
 const o=createValuesOwner('Accumulated');expect(()=>o.admit({...receipt(1),truth:1} as any)).toThrow('FIELDS');const x=receipt(1);Object.defineProperty(x,'outcome',{get(){throw Error('EXECUTED');}});expect(()=>o.admit(x)).toThrow('FIELDS');for(const instant of [0,65,1.5,NaN])expect(()=>o.admit(receipt(instant))).toThrow();
});
it('externally bound original prefix rejects a self-consistent save from different history',()=>{
 const inputs=[receipt(1),receipt(2)],o=createValuesOwner('Accumulated');inputs.forEach(x=>o.admit(x));
 expect(restoreValuesPrefix('Accumulated',inputs,2,o.save()).save()).toEqual(o.save());
 const other=createValuesOwner('Accumulated');other.admit(receipt(1,-1));other.admit(receipt(2,-1));
 expect(()=>restoreValuesPrefix('Accumulated',inputs,2,other.save())).toThrow('ORIGINAL_MISMATCH');
 expect(()=>restoreValuesPrefix('Accumulated',inputs,1,o.save())).toThrow('ORIGINAL_MISMATCH');
});
