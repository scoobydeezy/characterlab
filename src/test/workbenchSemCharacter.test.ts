import {it,expect} from 'vitest';
import {SemWorkbenchRun} from '../workbench/semAdapter';
import {semInspection} from '../workbench/semInspection';
import {projectSemCharacter} from '../workbench/semCharacter';
import {canonicalDecode,RecordSchemaRegistry,record,list,set,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {identitySchemas} from '../substrate/identity';
import {persistenceSchemas} from '../substrate/persistence';
import {SEMANTIC_RECORD_SCHEMAS} from '../semanticBinding/semanticSchemaRegistry';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
const replace=(v:CanonicalValue,id:bigint,x:CanonicalValue)=>{if(typeof v==='boolean'||v.kind!=='record')throw Error('record');const fields=new Map(v.fields);fields.set(id,x);return record(v.schema,fields);};
it('preserves observer isolation, original evidence time and earlier entries at every native prefix',async()=>{
 const run=await SemWorkbenchRun.create();let prior=semInspection(run).characters;
 for(let prefix=0;prefix<=3;prefix++){
  const checkpoint=run.checkpoint(),view=semInspection(run);
  expect(view.characters.map(c=>c.entries.length)).toEqual([0,1,2].map(i=>i<prefix?1:0));
  expect(semInspection(await SemWorkbenchRun.restore(checkpoint))).toEqual(view);expect(run.checkpoint()).toEqual(checkpoint);
  view.characters.forEach((c,i)=>{expect(c.entries.slice(0,prior[i].entries.length)).toEqual(prior[i].entries);for(const e of c.entries){expect(e.observedAt).toBe('10');expect(e.human).toContain('recorded time 10');expect(e.exact).not.toContain('WorldEventTruth');}});
  prior=view.characters;if(prefix<3)await run.advance();
 }
},600000);
it('ignores truth and renderer siblings but rejects nested foreign observers and unsupported evidence',async()=>{
 const run=await SemWorkbenchRun.create();await run.advance();
 const save=rec(canonicalDecode(fromHex(run.checkpoint().saveHex),new RecordSchemaRegistry([...Object.values(identitySchemas),...Object.values(persistenceSchemas),...SEMANTIC_RECORD_SCHEMAS])),132n);
 const trace=items(f(save,11n),'list'),parts=items(trace[0],'list'),chain=items(parts[3],'list'),e=rec(chain[1],227n),observer=f(e,2n);
 const rebuild=(experience:CanonicalValue,truth=chain[0])=>[list([parts[0],parts[1],parts[2],list([truth,experience,chain[2],chain[3]])])];
 expect(projectSemCharacter(rebuild(e,text('unobserved truth substitution')),observer)).toEqual(projectSemCharacter(trace,observer));
 const bindings=items(f(e,5n),'set'),b=rec(bindings[0],224n),track=replace(f(b,4n),1n,typedIdentifier(1000n,text('character/foreign')));
 expect(()=>projectSemCharacter(rebuild(replace(e,5n,set([replace(b,4n,track),...bindings.slice(1)]))),observer)).toThrow('observer mismatch');
 expect(()=>projectSemCharacter(rebuild(replace(e,7n,set([chain[0]]))),observer)).toThrow('unavailable');
 const cs=items(f(e,6n),'set'),c=rec(cs[0],225n);
 expect(()=>projectSemCharacter(rebuild(replace(e,6n,set([replace(c,6n,chain[0]),...cs.slice(1)]))),observer)).toThrow('unsupported perceived');
 expect(projectSemCharacter(trace,typedIdentifier(1000n,text('character/foreign'))).entries).toEqual([]);
},600000);
