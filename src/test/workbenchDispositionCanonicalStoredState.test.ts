import {it,expect} from 'vitest';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {dispositionCanonicalStoredState} from '../workbench/dispositionCanonicalStoredState';
import {dispositionChart} from '../workbench/dispositionChart';
import {compareDisposition,DISPOSITION_CONTRASTS} from '../workbench/dispositionComparison';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord,dataField} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
import {DISPOSITION_LAWS} from '../campaign3/dispositionAdaptation';
it('preserves original chart fractions, paths, ownership and coordinates for every law and both constitutional signs',async()=>{
 const programs=[...DISPOSITION_LAWS.map(law=>law+'/Main'),'Plastic/ConstitutionPositive','Plastic/ConstitutionNegative'];
 const baseline=await DispositionWorkbenchRun.create();
 const baselineSnapshots=[baseline.snapshot()];await baseline.advance();baselineSnapshots.push(baseline.snapshot());
 for(const program of programs){
  const run=await DispositionWorkbenchRun.create(program);
  for(let prefix=0;prefix<=1;prefix++){
   const snapshot=run.snapshot(),checkpoint=run.checkpoint(),state=dataField(dataRecord(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),5n);
   const result=dispositionCanonicalStoredState(snapshot,state);
   expect(Object.keys(result.identity).sort()).toEqual(['program','seamVersion','prefix','constitution','law','saveHash'].sort());
   expect(JSON.stringify(result).length).toBeLessThan(4096);
   const read=(root:string)=>snapshot.fields.find(f=>f.root===root);
   expect(result.constitution.exact).toBe(JSON.parse(read('1457')!.exact)['Value [1]']);
   expect(result.constitution.path).toBe(read('1457')!.path);
   expect(result.plastic===null).toBe(snapshot.law==='Refold');
   if(result.plastic){expect(result.plastic.exact).toBe(JSON.parse(read('1458')!.exact)['Value [1]']);expect(result.plastic.path).toBe(read('1458')!.path);}
   if(program!=='Plastic/Main'){
    const contrast=DISPOSITION_CONTRASTS.find(c=>c.a==='Plastic/Main'&&c.b===program)!;
    const chart=dispositionChart([await compareDisposition(contrast.id,baselineSnapshots[prefix],snapshot)]).rows[0].branches[1];
    expect(result.constitution).toEqual(chart.constitution);expect(result.plastic).toEqual(chart.plastic);
   }
   expect(()=>dispositionCanonicalStoredState({...snapshot,constitution:'99/1'},state)).toThrow('constitution');
   expect(()=>dispositionCanonicalStoredState({...snapshot,law:'unknown'},state)).toThrow('law');
   expect(()=>dispositionCanonicalStoredState({...snapshot,seamVersion:'unknown'},state)).toThrow('revision');
   expect(()=>dispositionCanonicalStoredState({...snapshot,prefix:19},state)).toThrow('revision');
   expect(()=>dispositionCanonicalStoredState({...snapshot,law:snapshot.law==='Refold'?'Plastic':'Refold'},state)).toThrow('ownership');
   expect(run.checkpoint()).toEqual(checkpoint);
   if(prefix===0)await run.advance();
  }
 }
},600000);
