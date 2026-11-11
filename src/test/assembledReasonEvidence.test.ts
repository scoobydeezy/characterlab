import {it,expect,vi} from 'vitest';
import {map,record,type CanonicalValue} from '../substrate/canonicalEncoding';
import {definition} from './fixtures/assembledReasonCorrespondence';
import {cognitiveRecord as r} from '../assembled/codecs';
import {readQ} from '../campaign2/cognitiveMath';
import * as reasons from '../assembled/reasons';
import {prepareCharacterModel,createCharacterRun,restoreCharacterRun} from '../assembled/character';
import {compileCharacterModel} from '../assembled/model';
import {compileReasonEvidence,reasonReading,REASON_EVIDENCE,REASON_PRODUCED} from '../assembled/reasonEvidence';
import {fixture,create,capture,correspondence,snap,through,decode,items,key,enc,rec,f,uint,q,list,set,text,u,signed,sid,nativeProjection} from './fixtures/assembledReasonEvidence';
import {exact,finish} from './fixtures/assembledAffectReceiving';
import {transcript} from './fixtures/assembledDecisionAlternatives';
let same:Awaited<ReturnType<typeof create>>,collective:Awaited<ReturnType<typeof create>>,denied:Awaited<ReturnType<typeof create>>;
it('M86 native: collective support joins the actual decision without double counting',async()=>{
 same=await create(2);collective=await create(3);denied=await create(3,[false,false]);
 const a=capture(same.run),b=capture(collective.run),c=capture(denied.run);
 expect(a.produced).toHaveLength(2);expect(b.produced).toHaveLength(3);expect(c.produced).toHaveLength(0);expect(c.rejected).toHaveLength(3);
 expect(b.samples).toHaveLength(2);expect(typeof b.frozen[3]!=='boolean'&&b.frozen[3].kind==='record','real frozen SEM').toBe(true);
 const legacy=await create(3,[true,true],false,false,10n,false),j=capture(legacy.run);
 correspondence(j,legacy.b.s);expect(b.raw).toEqual(j.raw);expect(b.report).toEqual(j.report);
 expect(f(rec(f(rec(j.ns[0],407n),2n),406n),1n)).toEqual(q(257,377));
 expect(f(rec(f(rec(b.ns[0],407n),2n),406n),1n)).toEqual(q(121,181));
 expect(items(b.compilation!,'list')[3]).toEqual(text('SourceCoverage'));
 expect(items(decode(snap(collective.run).trace),'list').some(t=>key(f(rec(t,160n),6n))===key(text(reasons.SOURCE_COVERAGE_VERSION))&&key(f(rec(t,160n),12n))===key(b.raw))).toBe(true);
 expect(key(set(a.ns.map(nativeProjection)))).toBe(key(set(b.ns.map(nativeProjection))));expect(f(a.data,2n)).toEqual(f(b.data,2n));
 expect(f(b.data,2n),'permitted evidence changes native probabilities').not.toEqual(f(c.data,2n));
 const draws=transcript(a.data);expect(draws).toHaveLength(0);expect(transcript(b.data)).toHaveLength(0);expect(uint(f(a.data,8n))).toBe(1n);expect(uint(f(b.data,8n))).toBe(1n);
 const probabilities=(data:CanonicalValue)=>items(f(rec(data,420n),2n),'list').map(p=>f(rec(p,421n),2n));expect(probabilities(a.data)).toEqual([q(55,64),q(9,64)]);expect(probabilities(c.data)).toEqual([q(23,32),q(9,32)]);
 const groups=items(items(b.compilation!,'list')[1],'list'),coverage=groups.flatMap(g=>items(items(g,'list')[3],'list').map(v=>items(v,'list')));
 for(const p of b.produced){const d=items(p,'list')[1],row=coverage.find(r=>key(r[0])===key(reasons.descriptionIdentity(d)))!;expect(row).toBeDefined();if(key(items(d,'list')[0])===key(text('combined'))){expect(row[4]).toEqual(q(1,1));expect(row[6]).toEqual(q(0,1));}else expect(row[6]).not.toEqual(q(0,1));}
 const old=collective.b.old,run=await createCharacterRun(await prepareCharacterModel(old.s),old.d);await through(run,10n);
 const outputs=items(decode(snap(run).outputs),'list'),d=outputs.find(v=>typeof v!=='boolean'&&v.kind==='record'&&v.schema.typeId===409n&&key(f(v,2n))===key(signed(10)))!,data=f(rec(f(rec(d,409n),4n),419n),2n);
 expect(f(rec(data,420n),2n)).toEqual(f(c.data,2n));
 const oldContext=rec(f(rec(d,409n),3n),408n),oldRaw=f(oldContext,2n);expect(reasons.compileDescribedReasons(oldRaw,definition(old.s),3,'SourceCoverage').nuclei).toEqual(items(f(oldContext,3n),'list'));expect(transcript(rec(data,420n))).toHaveLength(2);
 console.info('M86 NATIVE PASS same/collective probabilities equal; independent permitted evidence changes probabilities; automatic zero draws; matched0.76 source bytes retain residual1/8; candidate0.77 residual0; denied agrees with retained0.75 probabilities');
},570000);
it('M86 privacy and missing support: denied/absent/zero sources never become motivation',async()=>{
 const hidden=await create(3,[true,true],true),partial=await create(3,[true,false]),zero=await create(3,[true,true],false,true);
 const h=capture(hidden.run),p=capture(partial.run),z=capture(zero.run),normal=capture((collective??await create()).run);
 expect(h.report).toEqual(normal.report);expect(h.ns).toEqual(normal.ns);expect(f(h.data,2n)).toEqual(f(normal.data,2n));expect(transcript(h.data)).toEqual(transcript(normal.data));
 expect(p.samples).toHaveLength(1);expect(p.produced).toHaveLength(1);expect(p.rejected.map(v=>items(v,'list')[1])).toEqual([text('MissingEvidence'),text('MissingEvidence')]);
 expect(z.produced).toHaveLength(0);expect(z.rejected.map(v=>items(v,'list')[1])).toEqual([text('Zero'),text('Zero'),text('Zero')]);
 console.info('M86 PRIVACY PASS hidden diagnostic unchanged cognition; absent second channel suppresses dependent descriptions; zero samples reject all three sources');
},570000);
it('M86 persistence and rollback: one transaction and exact continued save',async()=>{
 const a=await create(3,[true,true],false,false,9n),b=await create(3,[true,true],false,false,9n);exact(a.run,b.run);
 const restored=await restoreCharacterRun(a.b.s,{initialState:a.b.d.initialState,orderedInputs:a.b.d.orderedInputs,save:a.run.save()});exact(a.run,restored);
 for(const at of [10n,11n]){for(const run of [a.run,b.run,restored])await through(run,at);exact(a.run,b.run);exact(a.run,restored);}
 for(const run of [a.run,b.run,restored])await finish(run);exact(a.run,b.run);exact(a.run,restored);
 const fault=await create(3,[true,true],false,false,9n),before=fault.run.snapshot(),original=reasons.compileDescribedReasons;let reached=false;
 const spy=vi.spyOn(reasons,'compileDescribedReasons').mockImplementation((raw,dice,max,coverage)=>{const result=original(raw,dice,max,coverage);if(items(f(rec(raw,403n),6n),'list').some(v=>key(items(v,'list')[0])===key(text('combined')))){reached=true;throw Error('M86 after actual source compilation');}return result;});
 try{await expect(fault.run.settleNextInstant()).rejects.toThrow('M86 after actual source compilation');expect(reached).toBe(true);expect({...fault.run.snapshot(),status:before.status}).toEqual(before);}finally{spy.mockRestore();}
 console.info('M86 PERSISTENCE PASS repeat9/restore9->10->11->101; failure after actual source compilation rolls whole instant back');
},570000);
it('M86 admission: governed descriptions and original evidence domain stay closed',async()=>{
 const b=fixture(),model=await compileCharacterModel(b.s),slot=items(decode(b.s.registry),'list')[45],rows=items(items(slot,'list')[1],'list');
 const bad=(n:number,value:ReturnType<typeof text>)=>{const d=[...items(rows[0],'list')];d[n]=value;return list([text(REASON_EVIDENCE),list([list(d)])]);};
 expect(()=>compileReasonEvidence(bad(0,text('primary')),model.strategy!,[])).toThrow('label');
 expect(()=>compileReasonEvidence(list([text(REASON_EVIDENCE),list([rows[0],rows[0]])]),model.strategy!,[])).toThrow('label');
 const d=[...items(rows[0],'list')];d[4]=set([u(3)]);expect(()=>compileReasonEvidence(list([text(REASON_EVIDENCE),list([list(d)])]),model.strategy!,[])).toThrow('channels');
 expect(()=>reasonReading(list([q(2,1),q(1,1),true,true,q(0,1)]))).toThrow('domain');
 await expect(createCharacterRun(await prepareCharacterModel(b.old.s),b.d)).rejects.toThrow('version/capacity');
 console.info('M86 ADMISSION PASS old model rejects reading input; duplicate/reserved labels and invalid channels/readings reject');
},120000);

it('M86 coverage: weighted partial overlap, empty evidence and sign partitions',async()=>{
 const w=collective??await create(),p=capture(w.run),rows=p.produced.map(x=>items(x,'list')[1]),dice=definition(w.b.s);
 const replace=(v:CanonicalValue,n:bigint,next:CanonicalValue)=>{const a=rec(v,typeof v!=='boolean'&&v.kind==='record'?v.schema.typeId:0n);return record(a.schema,new Map([...a.fields].map(([k,x])=>[k,k===n?next:x])));};
 const atoms=rows.flatMap(row=>{const basis=f(rec(f(rec(items(row,'list')[2],402n),3n),400n),1n);if(typeof basis==='boolean'||basis.kind!=='map')throw Error('basis');return basis.entries.map(([a])=>a);});
 const other=items(f(p.raw,6n),'list').find(v=>key(items(v,'list')[0])===key(text('primary'))&&uint(f(rec(f(rec(items(v,'list')[2],402n),1n),401n),3n))===1n)!;
 const priorBasis=f(rec(f(rec(items(other,'list')[2],402n),3n),400n),1n);if(typeof priorBasis==='boolean'||priorBasis.kind!=='map')throw Error('basis');const third=priorBasis.entries[0][0];
 const compile=(descriptions:CanonicalValue[])=>{const raw=r(403,[f(p.raw,1n),f(p.raw,2n),set(descriptions.map(v=>items(v,'list')[2])),f(p.raw,4n),set([]),list(descriptions)],3);return reasons.compileDescribedReasons(raw,dice,3,'SourceCoverage');};
 const source=(row:CanonicalValue,basis:CanonicalValue,strength?:CanonicalValue)=>{const d=items(row,'list'),old=rec(d[2],402n),changed=replace(old,3n,r(400,[basis]));return list([d[0],d[1],strength?replace(changed,2n,strength):changed]);};
 const weighted=[source(rows[0],map([[atoms[0],q(2,1)]])),source(rows[1],map([[atoms[0],q(1,1)],[atoms[1],q(1,1)]])),source(rows[2],map([[atoms[0],q(1,1)],[atoms[1],q(1,1)],[third,q(2,1)]]))];
 const coverage=(result:ReturnType<typeof compile>)=>items(items(items(result.report,'list')[1],'list')[0],'list')[3];
 const effective=items(coverage(compile(weighted)),'list').map(row=>items(row,'list')[6]);
 expect(effective).toEqual([q(3,4),q(1,3),q(1,8)]);
 const empty=compile([rows[0],source(rows[2],map([]))]);expect(items(coverage(empty),'list').map(row=>items(row,'list')[4])).toEqual([q(0,1),q(0,1)]);
 const negative=compile([rows[0],rows[1],source(rows[2],f(rec(f(rec(items(rows[2],'list')[2],402n),3n),400n),1n),q(-1,4))]);
 expect(f(rec(f(rec(negative.nuclei[0],407n),2n),406n),1n)).toEqual(q(7,13));
 console.info('M86 COMPONENT PASS weighted partial contributions3/4,1/3,1/8; empty basis overlap0; negative partition remains independent; component operands never enter a character');
},120000);
