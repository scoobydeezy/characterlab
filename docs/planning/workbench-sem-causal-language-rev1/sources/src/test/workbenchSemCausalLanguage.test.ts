import {it,expect} from 'vitest';
import {SemWorkbenchRun} from '../workbench/semAdapter';
import {projectSemCausalLanguage as project} from '../workbench/semCausalLanguage';
import {canonicalDecode,RecordSchemaRegistry,record,list,text,typedIdentifier,type CanonicalValue} from '../substrate/canonicalEncoding';
import {identitySchemas} from '../substrate/identity';import {persistenceSchemas} from '../substrate/persistence';import {SEMANTIC_RECORD_SCHEMAS} from '../semanticBinding/semanticSchemaRegistry';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';import {fromHex} from '../workbench/canonical';
const observer=(name:string)=>typedIdentifier(1000n,text('character/'+name));
const trace=(run:SemWorkbenchRun)=>items(f(rec(canonicalDecode(fromHex(run.checkpoint().saveHex),new RecordSchemaRegistry([...Object.values(identitySchemas),...Object.values(persistenceSchemas),...SEMANTIC_RECORD_SCHEMAS])),132n),11n),'list');
const replace=(v:CanonicalValue,id:bigint,x:CanonicalValue)=>{const r=rec(v,typeof v!=='boolean'&&v.kind==='record'?v.schema.typeId:0n),fields=new Map(r.fields);fields.set(id,x);return record(r.schema,fields);};
it('keeps each observer causal-role interpretation historical, detached and replay-identical at all original prefixes',async()=>{
 const run=await SemWorkbenchRun.create(),names=['mina','darius','glen'];let prior=names.map(n=>project(trace(run),observer(n)));let descriptions=0;
 for(let prefix=0;prefix<=3;prefix++){
  const checkpoint=run.checkpoint(),views=names.map(n=>project(trace(run),observer(n)));
  views.forEach((v,i)=>{expect(v.entries.slice(0,prior[i].entries.length)).toEqual(prior[i].entries);for(const e of v.entries){expect(e.semantic.observer).toBe('character/'+names[i]);expect(e.semantic.recordedAt).toBe('10');expect(e.semantic.certainty).toBe('not supplied');expect(e.human).toContain('perceived event-role evidence');expect(e.exact).not.toContain('WorldEventTruth');}});
  const restored=await SemWorkbenchRun.restore(checkpoint);expect(names.map(n=>project(trace(restored),observer(n)))).toEqual(views);expect(run.checkpoint()).toEqual(checkpoint);prior=views;if(prefix===3)descriptions=views.reduce((n,v)=>n+v.entries.length,0);if(prefix<3)await run.advance();
 }expect(descriptions).toBe(3);
},600000);
it('isolates observer evidence and refuses unsupported or mismatched causal provenance',async()=>{
 const run=await SemWorkbenchRun.create();await run.advance();const original=trace(run),parts=items(original[0],'list'),chain=items(parts[3],'list'),experience=rec(chain[1],227n),own=f(experience,2n),r=items(chain[2],'list')[0];
 const rebuild=(causal:CanonicalValue)=>[list([text('poison renderer'),text('poison metadata'),text('poison outputs'),list([text('changed hidden truth'),experience,list([causal]),text('changed recognition')])])];
 expect(project(rebuild(r),own)).toEqual(project(original,own));
 expect(()=>project(rebuild(replace(r,3n,observer('foreign'))),own)).toThrow('observer mismatch');
 expect(()=>project(rebuild(replace(r,6n,typedIdentifier(1019n,text('causal-role/cause')))),own)).toThrow('mapping mismatch');
 expect(()=>project(rebuild(replace(r,10n,text('unknown'))),own)).toThrow('rule/version');
 expect(()=>project(rebuild(replace(r,8n,list([]))),own)).toThrow();
 expect(project(original,observer('foreign')).entries).toEqual([]);
},600000);
