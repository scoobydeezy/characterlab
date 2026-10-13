import {it,expect} from 'vitest';
import catalog from '../workbench/multisourceCatalog.json';
import {projectMultisourceCharacter} from '../workbench/multisourceCharacter';
import {fromHex,exactKey} from '../workbench/canonical';
import {createMultisourceRun,prepareMultisourceModel} from '../campaign3/multisourceFactory';
import {decodeMultisource} from '../campaign3/multisourcePublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
async function create(name:string){const p=catalog.programs.find(p=>p.name===name)!,m=catalog.models.find(m=>m.name===p.model)!,source={...catalog.versions,content:fromHex(m.content),registry:fromHex(m.registry),parameters:fromHex(m.parameters)},observer=f(rec(decodeMultisource(source.parameters),710n),1n),run=await createMultisourceRun(await prepareMultisourceModel(source),{initialState:fromHex(p.initialState),orderedInputs:fromHex(p.orderedInputs),runSeed:fromHex(p.runSeed)});return {run,observer,project:()=>projectMultisourceCharacter(items(decodeMultisource(run.snapshot().outputs),'list'),observer)};}
it('preserves hidden-bin equality, detached reads and past assessment descriptions',async()=>{
 const a=await create('hidden-21'),b=await create('hidden-29');let prior=a.project().entries;while(await a.run.settleNextInstant()){await b.run.settleNextInstant();const save=exactKey(decodeMultisource(a.run.save())),p=a.project();expect(p).toEqual(b.project());expect(p.entries.slice(0,prior.length)).toEqual(prior);prior=p.entries;expect(exactKey(decodeMultisource(a.run.save()))).toBe(save);}expect(prior.length).toBeGreaterThan(0);expect(prior.every(e=>!e.exact.includes('649')&&!e.exact.includes('MultisourceObserved'))).toBe(true);
},600000);
it('distinguishes unavailable and known-zero assessment, and rejects another observer',async()=>{
 const a=await create('unavailable--GroundAggregate'),b=await create('known-zero--GroundAggregate');await a.run.settleNextInstant();await b.run.settleNextInstant();expect(a.project().entries.every(e=>e.kind==='Unavailable assessment')).toBe(true);expect(a.project().entries.length).toBeGreaterThan(0);expect(b.project().entries.every(e=>e.human.includes('signed assessment 0/1'))).toBe(true);expect(b.project().entries.length).toBeGreaterThan(0);expect(()=>projectMultisourceCharacter(items(decodeMultisource(b.run.snapshot().outputs),'list'),f(rec(decodeMultisource(fromHex(catalog.models[0].parameters)),710n),2n))).toThrow('observer mismatch');
},600000);
