import {it,expect} from 'vitest';
// @ts-expect-error Evidence files.
import {readFileSync,writeFileSync} from 'node:fs';
// @ts-expect-error Lossless evidence.
import {inflateRawSync} from 'node:zlib';
// @ts-expect-error Evidence hash.
import {createHash} from 'node:crypto';
const file='docs/planning/ASSEMBLED_CHARACTER_M287_EVIDENCE.json';
const hash=(v:Uint8Array)=>createHash('sha256').update(v).digest('hex');
it('Family12.8 complete receipt comparison and lossless evidence integrity',()=>{
 const e=JSON.parse(readFileSync(file,'utf8')),prior=JSON.parse(readFileSync('docs/planning/ASSEMBLED_CHARACTER_M286_EVIDENCE.json','utf8'));
 expect(e.candidate).toBe('0.166');expect(e.admission.errors).toEqual([]);
 for(const p of ['trained-negative','trained-positive','untrained-positive','impaired','blocked','hidden']){
  expect(e['skill-'+p].rows.map((r:{at:number})=>r.at)).toEqual([10,12,14,16,18,20,22]);
  expect(e['skill-'+p].terminal.sha256).toMatch(/^[a-f0-9]{64}$/);
 }
 const trained=e['skill-trained-positive'],untrained=e['skill-untrained-positive'];
 expect(trained.typed).toEqual(untrained.typed);expect(Object.keys(trained.typed)).toEqual(['425','426','431']);
 expect(trained.rows[2].success).toBe(true);expect(untrained.rows[2].success).toBe(false);
 const lost=e['memory-lost'],retained=e['memory-retained'],none=e['memory-untrained'],original=e['memory-original'];
 expect(lost.episode).toBe(retained.episode);expect(lost.removed).toBe(true);expect(retained.removed).toBe(false);
 expect(lost.probe6).toEqual({K:'1/2',success:true});expect(retained.probe6).toEqual(lost.probe6);expect(none.probe6).toEqual({K:'0/1',success:false});
 expect(original.probe6).toBeNull();expect(original.probe7).toEqual({K:'1/4',success:false});expect(lost.probe7).toEqual(original.probe7);expect(lost.restored).toBe(true);
 expect(e.long.restored).toBe(true);expect(e.long.rows).toEqual([{at:30,K:'1/128',success:false},{at:32,K:'0/1',success:false},{at:34,K:'0/1',success:false},{at:36,K:'1/8',success:false}]);
 expect(e.long.receiving.sourceEdits).toEqual([]);
 expect(prior.coverage).toMatchObject({original:52,native:20,oneReference:true,restores:20,intentEquality:true});
 let blocks=0,decodedBytes=0;
 function verify(v:unknown){if(Array.isArray(v)){v.forEach(verify);return;}if(!v||typeof v!=='object')return;
  const d=v as Record<string,unknown>;
  if(typeof d.deflateBase64==='string'){
   // @ts-expect-error Node buffer.
   const bytes=inflateRawSync(Buffer.from(d.deflateBase64,'base64'));
   expect(bytes.length).toBe(d.length);expect(hash(bytes)).toBe(d.sha256);blocks++;decodedBytes+=bytes.length;
  }
  Object.values(d).forEach(verify);
 }
 verify(e);expect(blocks).toBeGreaterThanOrEqual(16);
 e.sourceHashes=Object.fromEntries(['src/test/assembledSkillCarry.test.ts','src/test/fixtures/assembledSkillCarry.ts','src/test/assembledSkillAcceptance.test.ts','src/test/fixtures/assembledSkillIntegration.ts','src/test/fixtures/assembledSkillMemory.ts','src/test/fixtures/assembledLongitudinalCompletion.ts'].map(p=>[p,hash(readFileSync(p))]));
 e.acceptance={family:'12.8',candidate:'0.166',clauses:[1,2,3,4,5,6,7,8],originalRuns:52,nativeCorpusHistories:20,affectedSkillHistories:6,memoryHistories:4,longHistories:1,intentEquality:true,losslessBlocks:blocks,decodedBytes,wholeCandidateReplay:false};
 writeFileSync(file,JSON.stringify(e,null,2)+'\n');console.info('M287 family acceptance evidence',JSON.stringify(e.acceptance));
});
