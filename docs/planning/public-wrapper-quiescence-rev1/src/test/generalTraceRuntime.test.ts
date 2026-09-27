import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {compileGeneralModelCandidate} from '../campaign3/generalModelCandidate';
import {buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralSourceRuntime} from '../campaign3/generalSourceRuntime';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {generalBindingContext} from '../campaign3/generalBindingProfile';

it.each(['baseline','credit-significance-first'])('emits canonical event traces with actual common-B0 owner patches for %s',async recipe=>{
 const candidate=await compileGeneralModelCandidate(buildGeneralDeclarationPacket(recipe));
 const originals=createGeneralSourceRuntime(candidate.model).originalBytes(),identity=await candidate.runIdentity(originals,new Uint8Array(32));
 const run=createGeneralSourceRuntime(candidate.model,{model:candidate.identity.value,run:identity.value});let eventCount=0;
 while(run.snapshot().queue.length){const result=await run.settleNextInstant();eventCount+=result!.executedEvents.length;await new Promise(resolve=>setTimeout(resolve,0));}
 const snapshot=run.snapshot();expect(snapshot.committedTrace).toHaveLength(eventCount);
 const trace=snapshot.committedTrace.map(v=>rec(v,160n));
 for(const row of trace){expect(key(f(row,2n))).toBe(key(candidate.identity.value));expect(key(f(row,3n))).toBe(key(identity.value));}
 const protocol=trace.filter(row=>items(f(row,19n),'list').length);
 expect(protocol.length).toBeGreaterThan(0);
 for(const row of trace){const patch=rec(f(row,16n),144n);expect(items(f(patch,1n),'list').some(v=>key(f(rec(f(v as ReturnType<typeof rec>,1n),140n),1n))===key(u(581)))).toBe(false);}
 const bytes=enc(list(trace)),again=enc(decode(bytes,generalBindingContext()));expect(again.length===bytes.length&&again.every((v,i)=>v===bytes[i])).toBe(true);
},90000);
