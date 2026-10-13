import {it,expect} from 'vitest';
import {compareSemControl,runSemControl,SEM_CONTROL_IDS} from '../workbench/semControls';
import {canonicalEncode,list} from '../substrate/canonicalEncoding';
import {perceptualClassificationEvidenceValue} from '../semanticBinding/semanticEvidenceCodecs';
import {GLEN,SWAPPED_BINDING_REQUESTS,createRunAllocator,projectObserver,truthBindings} from './fixtures/phenSem001';
import {digest} from '../workbench/canonical';
it('retains hidden-truth invariance and permitted-evidence sensitivity at the original component boundary',async()=>{
 expect((await compareSemControl('hidden-causal')).equality).toEqual({truth:false,experience:true,classifications:true,causal:true});
 const permitted=await compareSemControl('permitted-role');expect(permitted.equality).toEqual({truth:true,experience:false,classifications:true,causal:false});expect(permitted.a.causalRoles).toEqual(['causal-role/actor']);expect(permitted.b.causalRoles).toEqual(['causal-role/participant']);
 const hidden=await compareSemControl('hidden-classification');expect(hidden.equality).toEqual({truth:false,experience:true,classifications:true,causal:null});
 const original=projectObserver({observerId:GLEN,truth:truthBindings(SWAPPED_BINDING_REQUESTS),allocator:createRunAllocator(),experienceId:1n});expect(hidden.b.classifications.sha256).toBe(await digest(canonicalEncode(list(original.classifications.map(perceptualClassificationEvidenceValue)))));
});
it('retains binding occurrences in both multiplicity directions and replays all component recipes',async()=>{
 const multi=await runSemControl('mina-multiple-roles'),repeated=await runSemControl('mina-repeated-role');
 const actor=multi.bindings.find(b=>b.role==='event-role/actor')!,companion=multi.bindings.find(b=>b.role==='event-role/companion')!;expect(actor.track).toBe(companion.track);expect(actor.occurrence).not.toBe(companion.occurrence);expect(multi.bindings).toHaveLength(3);
 const companions=repeated.bindings.filter(b=>b.role==='event-role/companion');expect(companions).toHaveLength(2);expect(new Set(companions.map(b=>b.track)).size).toBe(2);expect(new Set(companions.map(b=>b.occurrence)).size).toBe(2);expect(new Set(companions.map(b=>b.event)).size).toBe(1);
 for(const id of SEM_CONTROL_IDS)expect(await runSemControl(id)).toEqual(await runSemControl(id));await expect(compareSemControl('unknown')).rejects.toThrow('Unknown');
});
