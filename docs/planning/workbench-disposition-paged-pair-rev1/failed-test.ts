import {it,expect,vi} from 'vitest';
import {DispositionPagedRun} from '../workbench/dispositionPagedAdapter';
import {DispositionPagedPair} from '../workbench/dispositionPagedPair';
import {DISPOSITION_CONTRASTS,compareDisposition,dispositionComparisonContext} from '../workbench/dispositionComparison';
const loadBuiltin=(name:string)=>import(/* @vite-ignore */ name);
const {default:fs}=await loadBuiltin('node:fs'),{gunzipSync}=await loadBuiltin('node:zlib'),{createHash}=await loadBuiltin('node:crypto');
const root='docs/planning/workbench-disposition-comparison-rev1',receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8'));
function frozen(name:string){const bytes=fs.readFileSync(root+'/'+name);expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.artifacts.find((a:any)=>a.path===name).sha256);return JSON.parse(gunzipSync(bytes).toString());}
function comparison(id:string,prefix:number){return frozen(`comparison-${id.replaceAll('/','-')}-${prefix}.json.gz`);}
it('preserves all30 original initial comparison reports and shared identity checks',async()=>{
 const snapshots=new Map<string,any>();for(let i=0;i<15;i++){const s=frozen(`snapshot-${i}-0.json.gz`);snapshots.set(s.program,s);}
 for(const c of DISPOSITION_CONTRASTS){const a=snapshots.get(c.a),b=snapshots.get(c.b),expected=comparison(c.id,0),actual=await compareDisposition(c.id,a,b);expect(actual).toEqual(expected);expect(JSON.stringify(actual)).toBe(JSON.stringify(expected));const {fields,...metadata}=expected;expect(await dispositionComparisonContext(c.id,a,b)).toEqual(metadata);}
 const a=snapshots.get('Plastic/Main'),b=snapshots.get('Plastic/ConstitutionPositive');
 await expect(dispositionComparisonContext('model/0/13',b,a)).rejects.toThrow('ordered pair');await expect(dispositionComparisonContext('model/0/13',{...a,runHash:'00'},b)).rejects.toThrow('identity');await expect(dispositionComparisonContext('model/0/13',{...a,prefix:1},b)).rejects.toThrow('prefix');
});
it('matches native paged contrasts and exact source pages, then restores both branches',async()=>{
 for(const id of ['model/0/13','model/0/2','input/Seed0']){
  const pair=await DispositionPagedPair.create(id);
  for(let prefix=0;prefix<=1;prefix++){
   const view=pair.summary(),expected=comparison(id,prefix),{fields,...metadata}=expected;
   const {fields:actualFields,fieldEquality,...actual}=view.comparison;expect(actual).toEqual({...metadata,version:'disposition-paged-contrast/0.1'});expect(view.failure).toBeNull();
   expect(actualFields.map(f=>({path:f.path,root:f.root,equal:f.equal,aPresent:f.aPresent,bPresent:f.bPresent}))).toEqual(fields.map((f:any)=>({path:f.path,root:f.root,equal:f.equal,aPresent:f.a!==null,bPresent:f.b!==null})));
   for(const [i,field]of actualFields.entries())for(const branch of ['a','b'] as const){const source=branch==='a'?field.aSource:field.bSource;if(source){const page=pair.textPage(branch,source.saveHash,source.selector);expect(page.text).toBe(fields[i][branch].slice(0,4096));expect(page.totalCodeUnits).toBe(fields[i][branch].length);}}
   if(prefix===0){const pending=pair.advance();expect(()=>pair.summary()).toThrow('in flight');await expect(pair.checkpoint()).rejects.toThrow('in flight');await pending;expect(()=>pair.diagnostic('a',view.a.saveHash,{kind:'storedState'})).toThrow('Stale');}
  }
  const before=pair.summary(),checkpoint=await pair.checkpoint(),restored=await DispositionPagedPair.restore(checkpoint);expect(restored.summary()).toEqual(before);expect(await restored.checkpoint()).toEqual(checkpoint);
 }
},600000);
it('keeps unequal horizons explicit and stops publication after partial branch failure',async()=>{
 const pair=await DispositionPagedPair.create('model/0/13');await pair.advance('a');const unequal=pair.summary();expect(unequal.comparison.aligned).toBe(false);expect(unequal.comparison.fields).toEqual([]);expect(unequal.comparison.stateEqual).toBeNull();await expect(pair.advance()).rejects.toThrow('Align');expect(pair.summary()).toEqual(unequal);
 const unequalSave=await pair.checkpoint(),restored=await DispositionPagedPair.restore(unequalSave);expect(restored.summary()).toEqual(unequal);await restored.advance('b');expect(restored.summary().comparison.aligned).toBe(true);
 const clean=await DispositionPagedPair.create('model/0/13'),baseline=clean.summary(),checkpoint=await clean.checkpoint(),advance=DispositionPagedRun.prototype.advance,spy=vi.spyOn(DispositionPagedRun.prototype,'advance').mockImplementationOnce(function(){return advance.call(this);}).mockRejectedValueOnce(Error('Injected second branch failure'));
 try{await expect(clean.advance()).rejects.toThrow('Injected');}finally{spy.mockRestore();}
 const failed=clean.summary();expect(failed.failure).toContain('Injected');expect({...failed,failure:null}).toEqual(baseline);expect(()=>clean.diagnostic('a',baseline.a.saveHash,{kind:'storedState'})).toThrow('failed');await expect(clean.checkpoint()).rejects.toThrow('failed');expect((await DispositionPagedPair.restore(checkpoint)).summary()).toEqual(baseline);
},600000);
