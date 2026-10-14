import {it,expect} from 'vitest';
import {runSemRecognitionIntegrity,recognitionEvaluationDiagnosticValue} from '../workbench/semRecognitionIntegrity';
import {canonicalEncode,bytesToHex} from '../substrate/canonicalEncoding';
import {semanticSchema,decodeSemanticValue} from '../semanticBinding/semanticCodecs';
import type {RecognitionEvaluation} from '../semanticBinding/recognition';
const revive=(s:string)=>JSON.parse(s,(_k,v)=>v&&typeof v==='object'&&'$bigint'in v?BigInt(v.$bigint):v&&typeof v==='object'&&'$undefined'in v?undefined:v);
it('retains canonical experience across recognition alternatives and every historical record across correction',async()=>{
 const r=await runSemRecognitionIntegrity();expect(await runSemRecognitionIntegrity()).toEqual(r);
 expect(new Set(r.alternatives.map(a=>a.experience.exact)).size).toBe(1);expect(r.alternatives[0].resolution).toBeNull();expect(r.alternatives[1].resolution?.exact).not.toBe(r.alternatives[2].resolution?.exact);
 expect(r.lifecycle.map(c=>c.records.length)).toEqual([3,2,2,3,3]);expect(r.lifecycle.map(c=>c.preservation.length)).toEqual([0,1,2,3,4]);
 for(const c of r.lifecycle)for(const p of c.preservation){expect(p.equal).toBe(true);expect(p.after).toEqual(p.before);expect(p.before).toEqual(r.lifecycle[p.index].records.map(e=>e.exact));}
 const history=revive(r.lifecycle.at(-1)!.history);expect(history).toHaveLength(3);expect(history[1].resolution.kind).toBe('withdrawn');expect(history[1].revisesRecognitionResolutionId).toBe(history[0].recognitionResolutionId);expect(history[2].revisesRecognitionResolutionId).toBe(history[1].recognitionResolutionId);
});
it('constructs exact accepted evaluation fields and discriminates changed results, time and versions',async()=>{
 const r=await runSemRecognitionIntegrity(),e=revive(r.alternatives[1].result).evaluation as RecognitionEvaluation,value=recognitionEvaluationDiagnosticValue(e),hex=bytesToHex(canonicalEncode(value));expect(hex).toBe(r.alternatives[1].evaluation.exact);
 const decoded=decodeSemanticValue(canonicalEncode(value));expect(typeof decoded).not.toBe('boolean');if(typeof decoded==='boolean'||decoded.kind!=='record')throw Error('Expected evaluation record');expect(decoded.schema).toEqual(semanticSchema('RecognitionEvaluation'));expect(decoded.fields.size).toBe(9);
 expect(bytesToHex(canonicalEncode(recognitionEvaluationDiagnosticValue({...e,occurredAt:e.occurredAt+1n})))).not.toBe(hex);
 expect(bytesToHex(canonicalEncode(recognitionEvaluationDiagnosticValue({...e,result:{kind:'withdraw-current-resolution'}})))).not.toBe(hex);
 expect(()=>recognitionEvaluationDiagnosticValue({...e,recognitionVersion:'recognition/0.1-candidate'})).toThrowError(expect.objectContaining({code:'UNADMITTED_CONTRACT_VERSION'}));
 expect(()=>recognitionEvaluationDiagnosticValue({...e,recognitionEvaluationId:-1n})).toThrow();
 for(const [index,tag,reason]of [[0,2n,undefined],[1,1n,1n],[2,1n,3n],[3,3n,undefined],[4,2n,undefined]] as const){
  const evaluation=revive(r.lifecycle[index].result).evaluation as RecognitionEvaluation,v=recognitionEvaluationDiagnosticValue(evaluation);if(typeof v==='boolean'||v.kind!=='record')throw Error('Expected evaluation');
  const result=v.fields.get(8n);if(!result||typeof result==='boolean'||result.kind!=='record')throw Error('Expected result union');expect(result.fields.get(1n)).toEqual({kind:'unsigned',value:tag});expect(result.fields.get(2n)).toEqual(reason===undefined?undefined:{kind:'unsigned',value:reason});
  expect(v.fields.has(7n)).toBe(index>0);
 }
});
