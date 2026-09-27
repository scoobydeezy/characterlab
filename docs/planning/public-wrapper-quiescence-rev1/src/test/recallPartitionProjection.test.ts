import {it,expect} from 'vitest';
import {projectRecallPartition} from '../campaign3/recallPartitionProjection';
import {recallBodyByAcquisitionRecency} from '../campaign3/bodyRecall';
import type {SignificantAcquisition} from '../campaign3/directionalSignificanceState';
const source=():SignificantAcquisition[]=>[
 {id:1n,kind:'Interoceptive',acquiredAt:1n,units:[{key:'alpha',views:[new Uint8Array([1])],useProtection:true,outcomeSignificanceDirections:['MovingFarther']}]},
 {id:2n,kind:'EventContinuant',acquiredAt:2n,units:[{key:'object',views:[new Uint8Array([2])],useProtection:false,outcomeSignificanceDirections:[]}]},
 {id:3n,kind:'Interoceptive',acquiredAt:3n,units:[{key:'alpha',views:[new Uint8Array([3])],useProtection:false,outcomeSignificanceDirections:[]}]}
];
it('RPP-A: exact modality projection omits retention metadata and keeps actual child evidence',()=>{
 const memory=source(),before=structuredClone(memory),body=projectRecallPartition(memory,'Interoceptive',4n),event=projectRecallPartition(memory,'EventContinuant',4n);
 expect(body.map(a=>a.id)).toEqual([1n,3n]);expect(event.map(a=>a.id)).toEqual([2n]);
 for(const a of [...body,...event]){expect(Object.keys(a).sort()).toEqual(['acquiredAt','id','kind','units']);for(const u of a.units)expect(Object.keys(u).sort()).toEqual(['key','views']);}
 expect(body[0].units[0].views[0]).toEqual(new Uint8Array([1]));expect(memory).toEqual(before);
 body[0].units[0].views[0][0]=9;expect(memory).toEqual(before);
});
it('RPP-B: changing protection alone cannot change actual body ranking',()=>{
 const memory=source(),other=source();other[0]={...other[0],units:other[0].units.map(u=>({...u,useProtection:false,outcomeSignificanceDirections:[]}))};
 const results=[memory,other].map(m=>recallBodyByAcquisitionRecency(projectRecallPartition(m,'Interoceptive',4n),{kind:'Present',signals:['alpha']},4n,1));
 expect(results[0]).toEqual(results[1]);expect(results[0].recalled.map(a=>a.id)).toEqual([3n]);
});
it('RPP-C: invalid sibling state and same-instant acquisitions cannot hide behind filtering',()=>{
 const bad=source();bad[1]={...bad[1],units:[]};expect(()=>projectRecallPartition(bad,'Interoceptive',4n)).toThrow();
 expect(()=>projectRecallPartition(source(),'Interoceptive',3n)).toThrow('RECALL_PARTITION_PRIOR');
 expect(()=>projectRecallPartition(source(),'Other' as never,4n)).toThrow('RECALL_PARTITION_KIND');
});
it('RPP-D: fragmentation remains authoritative; projection cannot resurrect a lost child',()=>{
 const memory=source().filter(a=>a.id!==1n);expect(projectRecallPartition(memory,'Interoceptive',4n).map(a=>a.id)).toEqual([3n]);
 expect(projectRecallPartition([],'EventContinuant',4n)).toEqual([]);
});
