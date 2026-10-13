import {it,expect} from 'vitest';
import {list,map,text} from '../substrate/canonicalEncoding';
import {decodeWork} from '../campaign3/workCodecs';
import {fromHex} from '../workbench/canonical';
import catalog from '../workbench/workCatalog.json';
import {WorkWorkbenchRun} from '../workbench/workAdapter';
import {projectWorkCharacter} from '../workbench/workCharacter';
it('rejects physical ingress and suppresses violating-control narration',async()=>{
 const original=decodeWork(fromHex(catalog.programs[0].orderedInputs));if(typeof original==='boolean'||original.kind!=='list')throw Error('fixture');expect(()=>projectWorkCharacter(original.items,1)).toThrow('Unknown WORK output');
 const r=await WorkWorkbenchRun.create('c5-k1-s0');await r.advance();expect(r.snapshot().character.suppressed).toBe(true);expect(r.snapshot().character.entries).toEqual([]);
},600000);
it('keeps hidden truth out and freezes past explanations through lifecycle expiry',async()=>{
 const a=await WorkWorkbenchRun.create('c1-k1-s0'),b=await WorkWorkbenchRun.create('c1-k1-s0-hidden');for(let i=0;i<2;i++){await a.advance();await b.advance();}expect(a.snapshot().character).toEqual(b.snapshot().character);
 const past=a.snapshot().character.entries;for(let i=0;i<4;i++)await a.advance();const view=a.snapshot();expect(view.character.entries.slice(0,past.length)).toEqual(past);const selection=view.character.entries.find(e=>e.kind==='Maintained access'&&e.at==='6')!;expect(selection.human).toContain('A Open');expect(selection.human).toContain('Eligible items: neutral C');expect(selection.human).toContain('accessible task grounds: none');expect(selection.human).toContain('instant 5');
},600000);
it('does not disclose draw transcripts or realized scores even when those records change',async()=>{
 const row=catalog.programs.find(p=>p.name==='draw-1-1')!,m=catalog.models.find(m=>m.name===row.model)!;
 const {createWorkRun,prepareWorkModel}=await import('../campaign3/workFactory');const run=await createWorkRun(await prepareWorkModel({parameters:fromHex(m.parameters),content:fromHex(m.content),registry:fromHex(m.registry)}),{initialState:fromHex(m.initialState),orderedInputs:fromHex(row.orderedInputs),runSeed:Uint8Array.from({length:32},(_,i)=>i===0?1:0)});for(let i=0;i<3;i++)await run.settleNextInstant();const outputs=decodeWork(run.snapshot().outputs);if(typeof outputs==='boolean'||outputs.kind!=='list')throw Error('fixture');
 const original=projectWorkCharacter(outputs.items,1),mutated=outputs.items.map(v=>{if(typeof v==='boolean'||v.kind!=='record'||v.schema.typeId!==776n)return v;const fields=new Map(v.fields);fields.set(6n,list([text('PRIVATE-DRAW-SENTINEL')]));fields.set(7n,map([]));return {...v,fields};});expect(projectWorkCharacter(mutated,1)).toEqual(original);expect(JSON.stringify(original)).not.toContain('RandomDraw');expect(JSON.stringify(original)).not.toContain('Scores [7]');
},600000);
