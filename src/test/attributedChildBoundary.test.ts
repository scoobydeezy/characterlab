import {describe,it,expect} from 'vitest';
import {normalizeAttributedChildren as normalize} from '../campaign3/attributedChildBoundary';
const child=(key:string)=>({key,views:[new Uint8Array([1])]}),alpha={acquisition:812n,unit:'alpha'},gamma={acquisition:900n,unit:'gamma'};
const owner=()=>({observer:'observer/a',character:'character/a',memory:[{id:812n,kind:'EventContinuant' as const,units:[child('alpha'),child('beta')]},{id:900n,kind:'EventContinuant' as const,units:[child('gamma')]}]});
const projection=(targets=[alpha])=>({observer:'observer/a',character:'character/a',disposition:'Supported' as const,targets});
describe('supplied attribution target projection boundary',()=>{
 it('AT-A: no expansion to sibling or byte-identical comparator',()=>{const o=owner(),before=structuredClone(o);expect(normalize(o,projection())).toEqual([alpha]);expect(o).toEqual(before);});
 it('AT-B: duplicate targets collapse and input permutations normalize identically',()=>{expect(normalize(owner(),projection([gamma,alpha,alpha]))).toEqual([gamma,alpha]);expect(normalize(owner(),projection([alpha,gamma]))).toEqual(normalize(owner(),projection([gamma,alpha])));});
 it('AT-C: lost child and missing target reject without reconstruction',()=>{const o=owner();o.memory[0].units=[child('beta')];expect(()=>normalize(o,projection())).toThrow('unknown loss');expect(()=>normalize(owner(),projection([]))).toThrow('MISSING');});
 it('AT-D: foreign observer or subject rejects before returning targets',()=>{expect(()=>normalize(owner(),{...projection(),observer:'observer/b'})).toThrow('SUBJECT');expect(()=>normalize(owner(),{...projection(),character:'character/b'})).toThrow('SUBJECT');});
 it('AT-E: unavailable cannot carry targets and is distinct from supported',()=>{expect(normalize(owner(),{...projection([]),disposition:'Unavailable'})).toEqual([]);expect(()=>normalize(owner(),{...projection(),disposition:'Unavailable'})).toThrow('UNAVAILABLE');});
 it('AT-F: detached output, sparse inputs and malformed addresses',()=>{const p=projection(),result=normalize(owner(),p);p.targets[0]={acquisition:900n,unit:'gamma'};expect(result).toEqual([alpha]);expect(Object.isFrozen(result[0])).toBe(true);expect(()=>normalize(owner(),projection(Array(1)))).toThrow('BOUND');expect(()=>normalize(owner(),projection([{acquisition:-1n,unit:'alpha'}]))).toThrow('ID');});
});

