import {it,expect} from 'vitest';
import {canonicalEncode as enc,list,unsigned as u,signed,record,text} from '../substrate/canonicalEncoding';
import {AuthoritativeState,statePathValue} from '../substrate/state';
import {dataRecord as rec,dataField as f,dataItems as items,dataKey as key} from '../campaign2/canonicalData';
import {multisourceRecipe,msPath,msId} from '../campaign3/multisourceModelRecipe';
import {compileMultisourceModel} from '../campaign3/multisourceModel';
import {compileMultisourceInputs} from '../campaign3/multisourceInputs';
import {decodeMultisource as decode,multisourceRecord as r} from '../campaign3/multisourcePublicCodecs';
import {receivingRecord as old} from '../campaign3/receivingCodecs';
it('compiles a committed finite model and authentic original sequence',async()=>{
 const recipe=multisourceRecipe('aggregate','GroundAggregate'),model=await compileMultisourceModel(recipe.source);
 expect(model.name).toBe(recipe.name);expect(model.initialState(recipe.initialState).entries()).toHaveLength(9);
 const compiled=await compileMultisourceInputs(model,recipe.initialState,recipe.orderedInputs,new Uint8Array(32).fill(1));
 expect(compiled.events.map(e=>e.phase)).toEqual([10n,10n,140n,140n]);
},30000);
it('rejects model edits, state outside ownership, mismatched adoptions and future anchors',async()=>{
 const recipe=multisourceRecipe('shared','GroundAggregate'),model=await compileMultisourceModel(recipe.source),profile=model.profile();
 await expect(compileMultisourceModel({...recipe.source,rulesVersion:'unadmitted'})).rejects.toThrow('version');
 await expect(compileMultisourceModel({...recipe.source,parameters:enc(list([]))})).rejects.toThrow('finite');
 const initial=model.initialState(recipe.initialState),entries=initial.entries();
 expect(()=>model.initialState(enc(new AuthoritativeState([...entries,{path:msPath(999n,msId(1000,'foreign')),value:text('foreign')}]).canonicalValue()))).toThrow();
 const reserve=f(rec(items(f(profile,5n),'list')[0],707n),1n),path=msPath(649n,reserve);
 const changed=new AuthoritativeState(entries.map(e=>encPath(e.path)===encPath(path)?{path,value:old(454,[{kind:'rational',numerator:20n,denominator:1n},signed(1)])}:e));
 expect(()=>model.initialState(enc(changed.canonicalValue()))).toThrow('anchor');
 const absent=new AuthoritativeState(entries.filter(e=>e.path.rootStateTypeId!==373n||e.path.fieldId!==2n));expect(()=>model.initialState(enc(absent.canonicalValue()))).toThrow('co-presence');
 function encPath(p:typeof path){return key(statePathValue(p));}
});
it('rejects generated originals, duplicate opportunities and wrong profile references',async()=>{
 const recipe=multisourceRecipe('shared','GroundAggregate'),model=await compileMultisourceModel(recipe.source),rows=items(decode(recipe.orderedInputs),'list'),first=items(rows[0],'list');
 const compile=(value:ReturnType<typeof list>)=>compileMultisourceInputs(model,recipe.initialState,enc(value),new Uint8Array([1]));
 await expect(compile(list([rows[0],rows[0]]))).rejects.toThrow('one original');
 await expect(compile(list([list([first[0],u(14),msId(1001,'event/multisource/freeze'),first[3],first[4]])]))).rejects.toThrow('generated');
 await expect(compile(list([list([first[0],first[1],first[2],r(712,[f(model.profile(),1n),msId(1027,'foreign')]),first[4]])]))).rejects.toThrow('observer/profile');
});
