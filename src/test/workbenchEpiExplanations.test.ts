import {expect,it} from 'vitest';
import {EpiWorkbenchRun} from '../workbench/epiAdapter';
import {explainEpi} from '../workbench/epiExplanations';
import {epiRecord} from '../campaign3/epiCodecs';
import {signed,list} from '../substrate/canonicalEncoding';
it('keeps historical encoding wording fixed after later belief updates and hidden truth changes',async()=>{
 const a=await EpiWorkbenchRun.create('1/1/informativeA'),b=await EpiWorkbenchRun.create('1/1/informativeB');
 await a.advance();const historical=a.snapshot().explanations[0];expect(historical.priorKnown).toBe(false);expect(historical.human).toContain('without storing a zero belief');
 while(await a.advance()){}while(await b.advance()){}
 expect(a.snapshot().explanations[0]).toEqual(historical);expect(a.snapshot().explanations).toEqual(b.snapshot().explanations);
 const later=a.snapshot().explanations[1];expect(later.priorKnown).toBe(true);expect(later.kind).toBe('Lower bound');expect(later.human).toContain('does not identify an exact value');expect(later.human).toContain('not confidence');
},600000);
it('withholds violating explanations and preserves missing versus admitted zero observations',async()=>{
 const missing=await EpiWorkbenchRun.create('1/1/missingA'),zero=await EpiWorkbenchRun.create('1/1/zero'),leak=await EpiWorkbenchRun.create('2/1/establishedA');
 for(const run of [missing,zero,leak])while(await run.advance()){}
 expect(missing.snapshot().explanations).toEqual([]);expect(zero.snapshot().explanations).toHaveLength(1);expect(zero.snapshot().explanations[0].measurement).toBe('0/1');expect(leak.snapshot().explanations).toEqual([]);
 expect(()=>explainEpi([epiRecord(899,[signed(1),list([])])],true)).toThrow('Unclassified');
},600000);
