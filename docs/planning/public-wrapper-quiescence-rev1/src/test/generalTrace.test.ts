import {it,expect} from 'vitest';
import {canonicalEncode as enc,record,unsigned as u} from '../substrate/canonicalEncoding';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
import {compileGeneralModelCandidate} from '../campaign3/generalModelCandidate';
import {buildGeneralDeclarationPacket} from '../campaign3/generalDeclarations';
import {createGeneralSourceRuntime} from '../campaign3/generalSourceRuntime';
import {compileGeneralTrace,type GeneralTraceFacts} from '../campaign3/generalTrace';
import {decodeGeneralAttention as decode} from '../campaign3/generalAttentionCodecs';
import {generalBindingContext} from '../campaign3/generalBindingProfile';
it('binds all nineteen trace fields and rejects fabricated reads or protocol write authority',async()=>{
 const candidate=await compileGeneralModelCandidate(buildGeneralDeclarationPacket()),runtime=createGeneralSourceRuntime(candidate.model);
 const identity=await candidate.runIdentity(runtime.originalBytes(),new Uint8Array(32)),binding=compileGeneralTrace(candidate.model,{model:candidate.identity.value,run:identity.value});
 const event=runtime.snapshot().queue.find(e=>e.dueAt===21n)!,base=candidate.model.initial.build(),actual=candidate.model.task.deadline(base,event.payload,21n);
 const facts:GeneralTraceFacts={stage:'event/task-deadline',event,base,outputs:[],children:[],reads:actual.actualReadRecords(),patch:actual.patch()};
 const trace=rec(binding.render(facts),160n);expect(()=>binding.validate(facts,trace)).not.toThrow();
 for(const field of trace.schema.fields){const values=new Map(trace.fields);values.set(field.id,false);expect(()=>binding.validate(facts,record(trace.schema,values))).toThrow('differs from actual');}
 const reads=structuredClone(actual.actualReadRecords());reads[0]={...reads[0],value:u(99)};expect(()=>binding.render({...facts,reads})).toThrow('direct read differs');
 const path={rootStateTypeId:581n,fieldId:1n,selectors:[]};
 expect(()=>binding.render({...facts,reads:[{...reads[0],path}]})).toThrow('undeclared read');
 const prior=base.read(path);expect(()=>binding.render({...facts,patch:{operations:[{kind:'set',path,expected:{presence:true,value:prior.value!},newValue:prior.value!}]}})).toThrow();
 // Inherited arbitrary canonical key projection must not collapse the three
 // distinct A/B/C reserve owner paths in the complete ownership declaration.
 const ownership=candidate.model.state.ownershipBytes();expect(enc(decode(ownership,generalBindingContext()))).toEqual(ownership);
 expect(f(trace,17n)).toBeDefined();
});
