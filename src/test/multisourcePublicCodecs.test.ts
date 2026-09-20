import {it,expect} from 'vitest';
import {canonicalEncode as enc,record,unsigned as u,text,list} from '../substrate/canonicalEncoding';
import {multisourceRecipe,multisourceBase,MS_CASES,MS_LAWS} from '../campaign3/multisourceModelRecipe';
import {decodeMultisource as decode,multisourceRecord as r,multisourceSchema} from '../campaign3/multisourcePublicCodecs';
import {compileReceivingTaskContentDeclarations} from '../campaign2/taskDeclarations';
import {dataRecord as rec,dataField as f} from '../campaign2/canonicalData';
it('round-trips every proposed model profile and initial/input data',()=>{
 for(const c of MS_CASES)for(const law of MS_LAWS){if(law==='DescriptionDice'&&!['duplicate','aggregate','orphan-removed'].includes(c))continue;const recipe=multisourceRecipe(c,law);for(const b of [recipe.source.registry,recipe.source.parameters,recipe.source.content,recipe.initialState,recipe.orderedInputs])expect(enc(decode(b))).toEqual(b);}
});
it('retains governed two-task/one-character content and task specification closure',async()=>{const b=multisourceBase();const content=await compileReceivingTaskContentDeclarations(enc(b.content),enc(b.registry));content.qualifyCharacter(b.holder);content.qualifyTask(f(rec(b.task('b'),371n),2n));});
it('rejects omitted known assessment payload and forbidden unavailable fields',()=>{
 expect(()=>r(718,[text('wrong'),u(2)])).toThrow();
 const recipe=multisourceRecipe('shared','GroundAggregate'),profile=rec(decode(recipe.source.parameters),710n);
 const descriptions=f(profile,4n);if(typeof descriptions==='boolean'||descriptions.kind!=='list')throw Error('fixture');
 const description=f(rec(descriptions.items[0],709n),1n);
 expect(()=>r(718,[description,u(2)])).toThrow('union fields');
 expect(()=>r(718,new Map([[1n,description],[2n,u(1)],[4n,{kind:'rational',numerator:0n,denominator:1n}]]))).toThrow('union fields');
});
it('rejects extra schema fields, wrong identity namespace and unallocated schema',()=>{
 expect(()=>decode(enc(record(multisourceSchema(712),new Map([[1n,text('not observer')],[2n,text('not definition')]]))))).toThrow();
 expect(()=>decode(enc(record({...multisourceSchema(712),typeId:999n},new Map())))).toThrow();
 expect(()=>r(712,[list([]),list([])])).toThrow();
});
it('does not hide a new record substituted into an inherited boolean field',()=>{
 const base=multisourceBase(),workspace=rec(base.get('task-workspace'),378n),fields=new Map(workspace.fields);
 fields.set(3n,r(712,[base.observer,{kind:'typedIdentifier',namespaceId:1027n,payload:text('definition/multisource/profile')}]));
 expect(()=>decode(enc(record(workspace.schema,fields)))).toThrow();
});
