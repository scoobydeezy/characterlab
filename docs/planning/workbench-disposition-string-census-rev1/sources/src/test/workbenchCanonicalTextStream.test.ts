import {it,expect} from 'vitest';
import {bytes,list,map,rational,record,set,signed,text,typedIdentifier,unsigned} from '../substrate/canonicalEncoding';
import {canonicalTextChunks,canonicalTextPage,EXACT_TEXT_PAGE_LIMIT} from '../workbench/canonicalTextStream';
import {exactText,fromHex} from '../workbench/canonical';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord,dataField} from '../campaign2/canonicalData';
it('preserves exact formatting across every canonical kind, escaping, empty values and page boundaries',()=>{
 const schema={typeId:999n,schemaVersion:1n,name:'Quote"Fixture',fields:[{id:1n,name:'First',required:true},{id:2n,name:'Second',required:false}]};
 const value=list([false,true,unsigned(9007199254740993n),signed(-29n),rational(-2n,3n),text('"\\\n\t\u0000é😀'.repeat(30)),bytes(new Uint8Array([0,15,255])),typedIdentifier(1000n,text('observer')),list([]),set([]),map([]),record(schema,new Map()),record(schema,new Map([[2n,text('two')],[1n,list([text('one')])]])),map([[text('key'),set([unsigned(4n)])]])]);
 const expected=exactText(value);expect([...canonicalTextChunks(value)].join('')).toBe(expected);
 for(const limit of [1,7,64,EXACT_TEXT_PAGE_LIMIT]){let offset=0,joined='';do{const p=canonicalTextPage(value,offset,limit);expect(p.totalCodeUnits).toBe(expected.length);expect(p.text).toBe(expected.slice(offset,offset+limit));joined+=p.text;if(p.nextOffset===null)break;expect(p.nextOffset).toBeGreaterThan(offset);offset=p.nextOffset;}while(true);expect(joined).toBe(expected);}
 expect(canonicalTextPage(value,expected.length).text).toBe('');for(const [o,l]of [[-1,1],[0,0],[0,65537],[0,1.5],[expected.length+1,1]])expect(()=>canonicalTextPage(value,o,l)).toThrow();
});
it('matches admitted Disposition state and historical trace without changing a checkpoint',async()=>{
 const run=await DispositionWorkbenchRun.create();await run.advance();const checkpoint=run.checkpoint(),save=dataRecord(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n);
 for(const field of [5n,11n]){const value=dataField(save,field),expected=exactText(value);expect([...canonicalTextChunks(value)].join('')).toBe(expected);for(const offset of [0,Math.floor(expected.length/2),expected.length]){const p=canonicalTextPage(value,offset);expect(p.totalCodeUnits).toBe(expected.length);expect(p.text).toBe(expected.slice(offset,offset+EXACT_TEXT_PAGE_LIMIT));}}
 expect(run.checkpoint()).toEqual(checkpoint);
},600000);
