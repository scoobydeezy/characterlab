import {it,expect} from 'vitest';
import {AffectPairSession,type AffectPairFactory} from '../workbench/affectPairSession';
import {createAffectInspection,restoreAffectInspection} from '../workbench/affectSession';
import {AFFECT_CONTRASTS,compareAffect} from '../workbench/affectComparison';
const factory:AffectPairFactory={create:createAffectInspection,restore:restoreAffectInspection};
const load=(name:string)=>import(/* @vite-ignore */ name),{default:fs}=await load('node:fs');
const references=['workbench-affect-parity-rev1','workbench-affect-supplements-rev1'].flatMap(root=>JSON.parse(fs.readFileSync(`docs/planning/${root}/receipt.json`,'utf8')).results);
function original(view:ReturnType<AffectPairSession['snapshot']>){for(const s of [view.comparison.a,view.comparison.b]){const p=references.find((r:any)=>r.id===s.program).prefixes[s.prefix];for(const k of ['stateHash','saveHash','outputsHash'] as const)expect(s[k]).toBe(p[k]);}}
it('preserves every declared initial comparison and disposes independently',async()=>{
 for(const spec of AFFECT_CONTRASTS){const pair=await AffectPairSession.create(spec.id,factory),view=pair.snapshot();original(view);expect(view.failure).toBeNull();expect(view.comparison).toEqual(compareAffect(await createAffectInspection(spec.a).then(r=>r.snapshot()),await createAffectInspection(spec.b).then(r=>r.snapshot())));pair.dispose();expect(()=>pair.snapshot()).toThrow('disposed');}
},600000);
it('advances, detaches, checkpoints, restores and continues native main and supplementary pairs',async()=>{
 for(const id of ['hidden-world','interior/2']){
  const pair=await AffectPairSession.create(id,factory),initial=pair.snapshot(),pending=pair.advance();expect(()=>pair.snapshot()).toThrow('in flight');await expect(pair.checkpoint()).rejects.toThrow('in flight');await pending;
  const first=pair.snapshot();original(first);const immutable=JSON.stringify(first),checkpoint=await pair.checkpoint();await pair.advance();original(pair.snapshot());expect(JSON.stringify(first)).toBe(immutable);
  const restored=await AffectPairSession.restore(checkpoint,factory);expect(restored.snapshot()).toEqual(first);expect(await restored.checkpoint()).toEqual(checkpoint);await restored.advance();expect(restored.snapshot()).toEqual(pair.snapshot());
  initial.comparison.a.prefix=999;expect(pair.snapshot().comparison.a.prefix).toBe(2);pair.dispose();restored.dispose();
 }
},600000);
it('retains explicit unequal horizons and preserves the published pair after partial failure',async()=>{
 const pair=await AffectPairSession.create('hidden-world',factory);await pair.advance('a');const unequal=pair.snapshot();expect(unequal.comparison.aligned).toBe(false);expect(unequal.comparison.stateEqual).toBeNull();await expect(pair.advance()).rejects.toThrow('Align');const checkpoint=await pair.checkpoint(),restored=await AffectPairSession.restore(checkpoint,factory);expect(restored.snapshot()).toEqual(unequal);await restored.advance('b');expect(restored.snapshot().comparison.aligned).toBe(true);original(restored.snapshot());
 let created=0,disposed=0;
 const failing:AffectPairFactory={...factory,async create(program){const run=await factory.create(program),second=++created===2;return {snapshot:()=>run.snapshot(),checkpoint:()=>run.checkpoint(),advance:()=>second?Promise.reject(Error('Injected second branch failure')):run.advance(),dispose:()=>{disposed++;}};}};
 const broken=await AffectPairSession.create('hidden-world',failing),before=broken.snapshot();await expect(broken.advance()).rejects.toThrow('Injected');const failed=broken.snapshot();expect({...failed,failure:null}).toEqual(before);expect(failed.failure).toContain('Injected');await expect(broken.advance()).rejects.toThrow('failed');await expect(broken.checkpoint()).rejects.toThrow('failed');broken.dispose();expect(disposed).toBe(2);
 const tampered=structuredClone(checkpoint);tampered.b.program=tampered.a.program;await expect(AffectPairSession.restore(tampered,factory)).rejects.toThrow('Invalid');pair.dispose();restored.dispose();
},600000);
