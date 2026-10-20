import {it,expect} from 'vitest';
import fs from 'node:fs';import {gunzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
import {DispositionWorkbenchRun} from '../workbench/dispositionAdapter';
import {dispositionArchitecture,dispositionArchitectureFromActivity} from '../workbench/dispositionArchitecture';
import {dispositionCanonicalArchitecture} from '../workbench/dispositionCanonicalArchitecture';
import {decodeDispositionPublic} from '../campaign3/dispositionPublicCodecs';
import {dataRecord as rec,dataField as f,dataItems as items} from '../campaign2/canonicalData';
import {fromHex} from '../workbench/canonical';
it('matches independent frozen architecture reports through both diagnostic paths',async()=>{
 const root='docs/planning/workbench-disposition-canonical-architecture-rev1',receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8'));
 for(const [program,index]of [['Plastic/Main',0],['Refold/Main',2],['Plastic/InactiveProbes',11]] as const){const name=`program-${index}.json.gz`,bytes=fs.readFileSync(root+'/'+name);expect(createHash('sha256').update(bytes).digest('hex')).toBe(receipt.results.find((a:any)=>a.path===name).sha256);const expected=JSON.parse(gunzipSync(bytes).toString()),run=await DispositionWorkbenchRun.create(program);
  for(let prefix=0;prefix<=2;prefix++){const s=run.snapshot(),checkpoint=run.checkpoint(),save=rec(decodeDispositionPublic(fromHex(checkpoint.saveHex)),132n),result=dispositionCanonicalArchitecture(s,f(save,5n),items(f(save,11n),'list'));expect(result).toEqual(expected[prefix]);expect(dispositionArchitecture(s)).toEqual(expected[prefix]);expect(run.checkpoint()).toEqual(checkpoint);expect(()=>dispositionArchitectureFromActivity({...s,seamVersion:'unknown'},{events:0,rows:[]})).toThrow('seam');expect(()=>dispositionArchitectureFromActivity(s,{events:181,rows:[]})).toThrow('bound');if(prefix<2)await run.advance();}
 }
},600000);
it('preserves the complete retained285-report box mapping and scope from authenticated activity rows',()=>{
 const root='docs/planning/workbench-disposition-canonical-architecture-rev1',receipt=JSON.parse(fs.readFileSync(root+'/receipt.json','utf8'));let count=0;
 for(const artifact of receipt.results){const bytes=fs.readFileSync(root+'/'+artifact.path);expect(createHash('sha256').update(bytes).digest('hex')).toBe(artifact.sha256);const reports=JSON.parse(gunzipSync(bytes).toString());for(const r of reports){const rows=r.rows.map(({path,root,label,reads,mutations,changes,presentAtRevision,events}:any)=>({path,root:presentAtRevision?root:null,label,reads,mutations,changes,presentAtRevision,events}));expect(dispositionArchitectureFromActivity(r.identity,{events:r.identity.prefix*10,rows})).toEqual(r);count++;}}
 expect(count).toBe(285);
});
