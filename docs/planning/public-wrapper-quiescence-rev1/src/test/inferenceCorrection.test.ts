import {it,expect} from 'vitest';
import {canonicalEncode as enc,list} from '../substrate/canonicalEncoding';
import {dataItems as items,dataField as f,dataRecord as rec} from '../campaign2/canonicalData';
import {prepareAgencyModel,createAgencyRun} from '../campaign3/agencyFactory';
import {agencyRecipe} from '../campaign3/agencyModel';
import {decodeAgency} from '../campaign3/agencyCodecs';
import {inferenceCorrectionReadout as readout} from '../campaign3/inferenceCorrectionReadout';
import {correctionCases,initialState,ordered,seed} from './inferenceCorrectionFixtures';
async function run(name:keyof ReturnType<typeof correctionCases>='main',law=1){const r=await createAgencyRun(await prepareAgencyModel(agencyRecipe(law)),{initialState,orderedInputs:ordered(correctionCases()[name]),runSeed:seed});while(await r.settleNextInstant()){}return r;}
const at=(r:Awaited<ReturnType<typeof run>>,time:bigint,observer=1,episode=1)=>readout(r.observerView(observer),observer,episode).find(x=>x.at===time)!;
it('revises the same mistaken episode claim, with conflict distinct from absence and unknown',async()=>{
 const r=await run();expect(at(r,1n).diagnostic).toBe('Unknown');
 expect(at(r,3n)).toMatchObject({numerator:1n,denominator:1n,diagnostic:'SupportsObstruction'});
 expect(at(r,5n)).toMatchObject({numerator:1n,denominator:2n,diagnostic:'Mixed'});
 expect(at(r,7n)).toMatchObject({numerator:1n,denominator:3n,diagnostic:'SupportsAbsence'});
 const absent=await run('noInitialClaim');expect(at(absent,3n).diagnostic).toBe('Unknown');expect(at(absent,7n).numerator).toBe(0n);
},30000);
it('retains LastClaim as a different law and OutcomeOnly as unknown',async()=>{
 expect(at(await run('main',2),5n)).toMatchObject({numerator:0n,denominator:1n});
 expect(at(await run('main',3),7n).diagnostic).toBe('Unknown');
 expect(at(await run('reordered'),7n)).toMatchObject({numerator:1n,denominator:3n});
 expect(at(await run('reordered',2),7n).diagnostic).toBe('SupportsObstruction');
},30000);
it('does not count duplicate corrections, silence or another episode against this claim',async()=>{
 expect(at(await run('duplicate'),7n)).toMatchObject({numerator:1n,denominator:2n});
 expect(at(await run('noCorrection'),7n)).toMatchObject({numerator:1n,denominator:1n});
 const r=await run('wrongEpisode');expect(at(r,7n)).toMatchObject({numerator:1n,denominator:1n});expect(at(r,7n,1,2)).toMatchObject({numerator:0n,denominator:2n});
},30000);
it('keeps correction causal and preserves complete earlier output bytes',async()=>{
 const r=await createAgencyRun(await prepareAgencyModel(agencyRecipe()),{initialState,orderedInputs:ordered(correctionCases().main),runSeed:seed});for(let i=0;i<3;i++)await r.settleNextInstant();const prior=items(decodeAgency(r.snapshot().outputs),'list');while(await r.settleNextInstant()){}
 expect(items(decodeAgency(r.snapshot().outputs),'list').slice(0,prior.length)).toEqual(prior);
 expect(at(r,4n).denominator).toBe(1n);expect(at(r,6n).denominator).toBe(2n);
},30000);
it('preserves later public provenance under denied corrections and hidden cause changes',async()=>{
 const a=await run(),b=await run('hiddenBlock'),c=await run('denied'),d=await run('noCorrection');
 expect(a.observerView(1)).toEqual(b.observerView(1));expect(c.observerView(1)).toEqual(d.observerView(1));
 const swapped=await run('swapped');expect(at(swapped,7n,0).diagnostic).toBe('SupportsAbsence');expect(at(swapped,7n).diagnostic).toBe('Unknown');
 expect((await run('hiddenBlock',4)).observerView(1)).not.toEqual((await run('main',4)).observerView(1));
},30000);
it('keeps chosen intent and expression fixed across subsequent causal correction',async()=>{
 const a=await run(),b=await run('noCorrection');const records=(r:typeof a,t:bigint)=>items(decodeAgency(r.snapshot().outputs),'list').filter(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===t);
 for(const t of [409n,425n,426n,974n,986n])expect(records(a,t)).toEqual(records(b,t));
 const omission=await run('main',5);const archive=rec(records(omission,986n)[0],986n);expect(items(f(rec(f(archive,3n),983n),1n),'list')).toHaveLength(0);
},30000);
it('rejects another observer view and raw omniscient output as diagnostic input',async()=>{
 const r=await run();expect(()=>readout(r.observerView(0),1,1)).toThrow();expect(()=>readout(r.snapshot().outputs,1,1)).toThrow();expect(()=>readout(enc(list([])),2,1)).toThrow();
});
