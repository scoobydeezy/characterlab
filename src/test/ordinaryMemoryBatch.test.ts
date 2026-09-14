import {it,expect} from 'vitest';
import {prepareOrdinaryMemoryBatch as prepare,type OrdinaryMemoryBatchInput} from '../campaign3/ordinaryMemoryBatch';
import {prepareAgeOnlyMemoryBatchControl as age,prepareUseOnlyMemoryBatchControl as use,prepareSharedProtectionMemoryBatchControl as shared} from '../campaign3/ordinaryMemoryBatch';
import {prepareAgeOnlyFormationControl,prepareUseOnlyFormationControl} from '../campaign3/significantFormationSettlement';
const observer='observer/a',character='character/a';
function fixture():OrdinaryMemoryBatchInput{
 const priorMemory=[1n,2n].map(id=>({id,kind:'EventContinuant' as const,acquiredAt:id,units:[{key:'child',views:[new Uint8Array([Number(id)])],useProtection:false,outcomeSignificanceDirections:[]}]}));
 return {observer,character,priorMemory,priorProtocol:{domain:priorMemory.map(a=>({source:'source/'+a.id,character,kind:a.kind})),successes:priorMemory.map(a=>({source:'source/'+a.id,character,kind:a.kind,acquisition:a.id,formedAt:a.acquiredAt,completeLoss:false}))},incoming:[{source:'source/3',character,kind:'EventContinuant'}],formed:[{source:'source/3',character,kind:'EventContinuant',acquisition:3n,formedAt:3n}],freshMemory:[{id:3n,kind:'EventContinuant',acquiredAt:3n,units:[{key:'child',views:[new Uint8Array([3])]}]}],now:3n,sourceLimit:32,capacity:{EventContinuant:3,Interoceptive:0},useResults:[[{acquisition:1n,unit:'child'}]],significance:[{observer,character,direction:'MovingCloser',targets:[{acquisition:1n,unit:'child'}]}]};
}
function run(input:OrdinaryMemoryBatchInput){const tx=prepare(input);try{return tx.finish(tx.resolve());}finally{tx.close();}}
it('OMB-A: complete formation/use/significance batch preserves payloads and initializes fresh content without credit',()=>{
 const f=fixture(),before=structuredClone(f),r=run(f);expect(f).toEqual(before);expect(r.memory.map(a=>a.units[0].views)).toEqual([[new Uint8Array([1])],[new Uint8Array([2])],[new Uint8Array([3])]]);expect(r.memory[0].units[0]).toMatchObject({useProtection:true,outcomeSignificanceDirections:['MovingCloser']});expect(r.memory[2].units[0]).toMatchObject({useProtection:false,outcomeSignificanceDirections:[]});expect(r.protocol.successes.every(s=>!s.completeLoss)).toBe(true);
});
it('OMB-B: current credit cannot rescue this instant’s older child or resurrect it after loss',()=>{
 const f={...fixture(),capacity:{EventContinuant:1,Interoceptive:0}},r=run(f);expect(r.memory.map(a=>a.id)).toEqual([3n]);expect(r.protocol.successes.map(s=>[s.acquisition,s.completeLoss])).toEqual([[1n,true],[2n,true],[3n,false]]);expect(r.memory[0].units[0].useProtection).toBe(false);
});
it('OMB-C: the same credit participates normally after committing into the next instant’s B0',()=>{
 const f=fixture(),first=run({...f,incoming:[],formed:[],freshMemory:[],capacity:{EventContinuant:2,Interoceptive:0}}),second=run({...f,now:4n,priorMemory:first.memory,priorProtocol:first.protocol,incoming:[],formed:[],freshMemory:[],useResults:[],significance:[],capacity:{EventContinuant:1,Interoceptive:0}});expect(second.memory.map(a=>a.id)).toEqual([1n]);expect(second.memory[0].units[0]).toMatchObject({useProtection:true,outcomeSignificanceDirections:['MovingCloser']});
});
it('OMB-D: fresh/foreign targets and duplicate addresses inside one use result reject',()=>{
 const f=fixture();expect(()=>prepare({...f,useResults:[[{acquisition:3n,unit:'child'}]]})).toThrow();expect(()=>prepare({...f,significance:[{...f.significance[0],targets:[{acquisition:3n,unit:'child'}]}]})).toThrow();expect(()=>prepare({...f,significance:[{...f.significance[0],observer:'observer/b'}]})).toThrow();expect(()=>prepare({...f,useResults:[[...f.useResults[0],...f.useResults[0]]]})).toThrow();
});
it('OMB-E: repeated real use results are binary and credit ordering does not change the batch',()=>{
 const f=fixture(),credits=[...f.significance,{...f.significance[0],direction:'MovingFarther' as const}],a=run({...f,useResults:[...f.useResults,...f.useResults],significance:credits}),b=run({...f,significance:[...credits].reverse()});expect(a).toEqual(b);expect(a.memory[0].units[0].outcomeSignificanceDirections).toEqual(['MovingCloser','MovingFarther']);
});
it('OMB-F: failed admission and isolated one-use results publish no partial candidate',()=>{
 const f=fixture(),tx=prepare(f),other=prepare(f);f.priorMemory[0].units[0].views[0][0]=99;const token=tx.resolve();expect(()=>other.finish(token)).toThrow('RESULT');expect(()=>tx.finish({...token})).toThrow('RESULT');expect(tx.finish(token).memory[0].units[0].views[0][0]).toBe(1);expect(()=>tx.finish(token)).toThrow('RESULT');expect(()=>tx.resolve()).toThrow('RESOLVED');other.close();expect(()=>other.resolve()).toThrow('CLOSED');
 const bad=fixture();Object.assign(bad.priorProtocol.successes[0],{completeLoss:true});expect(()=>prepare(bad)).toThrow();const current=fixture();Object.assign(current.priorMemory[0],{acquiredAt:3n});Object.assign(current.priorProtocol.successes[0],{formedAt:3n});expect(()=>prepare(current)).toThrow('PRIOR_INSTANT');
});
it('OMB-G: identical batch separates significance-first, shared/use and age-only predictions',()=>{
 const f=fixture();Object.assign(f.priorMemory[0].units[0],{outcomeSignificanceDirections:['MovingCloser']});Object.assign(f.priorMemory[1].units[0],{useProtection:true});
 for(const [owner,winner]of [[prepare,1n],[shared,2n],[use,2n],[age,3n]] as const){const tx=owner({...f,capacity:{EventContinuant:1,Interoceptive:0},useResults:[],significance:[]});const r=tx.finish(tx.resolve());expect(r.memory.map(a=>a.id)).toEqual([winner]);expect(r.protocol.successes.filter(s=>!s.completeLoss).map(s=>s.acquisition)).toEqual([winner]);tx.close();}
});
it('OMB-H: comparator ranking does not erase ignored significance or admit same-instant rescue',()=>{
 const f=fixture();Object.assign(f.priorMemory[0].units[0],{outcomeSignificanceDirections:['MovingCloser']});
 for(const owner of [prepareAgeOnlyFormationControl,prepareUseOnlyFormationControl]){const tx=owner(f);expect(tx.finish(tx.resolveMemory()).memory[0].units[0].outcomeSignificanceDirections).toEqual(['MovingCloser']);tx.close();}
 for(const owner of [age,use,shared]){const tx=owner(f),r=tx.finish(tx.resolve());expect(r.memory[0].units[0]).toMatchObject({outcomeSignificanceDirections:['MovingCloser'],useProtection:true});expect(r.memory[0].units[0].views).toEqual(f.priorMemory[0].units[0].views);tx.close();}
 for(const owner of [age,use,shared]){const tx=owner({...fixture(),capacity:{EventContinuant:1,Interoceptive:0}});expect(tx.finish(tx.resolve()).memory.map(a=>a.id)).toEqual([3n]);tx.close();}
});
it('OMB-I: all comparator owners retain source validation, result isolation and complete fresh loss',()=>{
 for(const owner of [age,use,shared]){const f={...fixture(),capacity:{EventContinuant:0,Interoceptive:0}},tx=owner(f),other=owner(f),token=tx.resolve();expect(()=>other.finish(token)).toThrow('RESULT');const r=tx.finish(token);expect(r.memory).toEqual([]);expect(r.protocol.successes).toHaveLength(3);expect(r.protocol.successes.every(s=>s.completeLoss)).toBe(true);expect(()=>tx.finish(token)).toThrow();tx.close();other.close();
 const bad=fixture();Object.assign(bad.priorProtocol.successes[0],{formedAt:0n});expect(()=>owner(bad)).toThrow('PRIOR_BINDING');}
});
