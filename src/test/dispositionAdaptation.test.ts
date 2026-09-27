import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,canonicalDecode,RecordSchemaRegistry,type CanonicalValue} from '../substrate/canonicalEncoding';
import {identityPublicSupportedSchemas} from '../campaign3/identityPublicCodecs';
import {dataItems as items} from '../campaign2/canonicalData';
import {createDispositionRun,restoreDispositionRun,dispositionRows,deriveDisposition} from '../campaign3/dispositionAdaptation';
import {dispositionCase} from './dispositionAdaptationFixtures';
const emptyCase=()=>dispositionCase();
it('four authenticated choices are needed; new adaptation is prospective and baseline stays immutable',async()=>{
 const c=emptyCase(),run=createDispositionRun(c.profile,c.frames);for(let i=0;i<5;i++)await run.step();const rows=dispositionRows(run.snapshot());
 expect(rows.slice(0,3).map(r=>r.state.after)).toEqual(['0/1','0/1','0/1']);expect(rows[3].state.before).toBe('0/1');expect(rows[3].state.after).toBe('1/8');expect(rows[4].state.effectiveBefore).toBe('1/8');expect(rows[4].probabilities).toEqual(['7/9','2/9']);expect(rows.every(r=>r.state.constitution==='0/1')).toBe(true);
},600000);
it('failure at first plastic update retains journal, prior expressions, addresses and full committed snapshot',async()=>{
 const c=emptyCase(),run=createDispositionRun(c.profile,c.frames);for(let i=0;i<3;i++)await run.step();const before=run.save();await expect(run.step(true)).rejects.toThrow('INJECTED');expect(run.save()).toEqual(before);expect(dispositionRows(run.snapshot()).at(-1)!.state.after).toBe('0/1');await run.step();expect(dispositionRows(run.snapshot()).at(-1)!.state.after).toBe('1/8');
},600000);
it('in-flight save/snapshot/concurrent step reject and cannot unlock the first caller',async()=>{
 const c=emptyCase(),run=createDispositionRun(c.profile,c.frames),pending=run.step();expect(()=>run.save()).toThrow('QUIESCENT');expect(()=>run.snapshot()).toThrow('QUIESCENT');await expect(run.step()).rejects.toThrow('QUIESCENT');expect(()=>run.save()).toThrow('QUIESCENT');await pending;expect(run.save().length).toBeGreaterThan(0);
},600000);
it('missing significance and pressure do not acquire identity or plastic disposition',async()=>{
 for(const name of ['NoEvidence','Pressure']){const c=dispositionCase({name,law:'Plastic',constitution:0}),run=createDispositionRun(c.profile,c.frames);for(let i=0;i<4;i++)await run.step();expect(dispositionRows(run.snapshot()).every(r=>r.state.after==='0/1'&&r.state.count===0)).toBe(true);}
},600000);
it('captured originals and exported snapshots cannot mutate an acquired run',async()=>{
 const c=emptyCase(),run=createDispositionRun(c.profile,c.frames);c.profile.constitution=1;c.frames[0].seed=255;await run.step();const before=run.save(),snapshot=run.snapshot();(items(snapshot,'list') as CanonicalValue[]).splice(0,1,u(18));expect(run.save()).toEqual(before);expect(dispositionRows(run.snapshot())[0].state.constitution).toBe('0/1');
},600000);
it('originals reject extra fields, accessors, sparse arrays, invalid stages and horizon changes',()=>{
 const c=emptyCase();expect(()=>createDispositionRun({...c.profile,trait:1} as any,c.frames)).toThrow();const getter={...c.frames[0]};Object.defineProperty(getter,'seed',{get(){throw Error('GETTER_EXECUTED');}});expect(()=>createDispositionRun(c.profile,[getter,...c.frames.slice(1)])).toThrow('FIELDS');const sparse=c.frames.slice();delete sparse[0];expect(()=>createDispositionRun(c.profile,sparse)).toThrow();expect(()=>createDispositionRun(c.profile,c.frames.slice(1))).toThrow();expect(()=>createDispositionRun(c.profile,[{...c.frames[0],stage:'Probe'},...c.frames.slice(1)])).toThrow();
});
it('restore rejects forged state and changed originals; every field is authenticated by replay',async()=>{
 const c=emptyCase(),run=createDispositionRun(c.profile,c.frames);await run.step();const save=run.save(),xs=[...items(canonicalDecode(save,new RecordSchemaRegistry(identityPublicSupportedSchemas())),'list')];xs[3]=list([u(99)]);await expect(restoreDispositionRun(c.profile,c.frames,enc(list(xs)))).rejects.toThrow('RESTORE');const changed=structuredClone(c.frames);changed[0].seed=255;await expect(restoreDispositionRun(c.profile,changed,save)).rejects.toThrow('RESTORE');const restored=await restoreDispositionRun(c.profile,c.frames,save);expect(restored.save()).toEqual(save);
},600000);
it('derived and stored plastic values agree after accepted history without a second stored value',async()=>{
 const c=emptyCase(),run=createDispositionRun(c.profile,c.frames);for(let i=0;i<4;i++)await run.step();expect(deriveDisposition(items(run.snapshot(),'list')[1],'Plastic').numerator).toBe(1n);expect(deriveDisposition(items(run.snapshot(),'list')[1],'Plastic').denominator).toBe(8n);
},600000);
