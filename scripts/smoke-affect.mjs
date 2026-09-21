import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{
 const {affectRecipe,compileAffectModel,compileAffectInputs}=await server.ssrLoadModule('/src/campaign3/affectModel.ts');
 const {affectRecord:r}=await server.ssrLoadModule('/src/campaign3/affectCodecs.ts');
 const {createAffectRuntime}=await server.ssrLoadModule('/src/campaign3/affectRuntime.ts');
 const {canonicalEncode:enc,list,unsigned:u,signed,rational:q}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const model=await compileAffectModel(affectRecipe()),values=[];
 for(const [glyph,action,outcome] of [[0,1,true],[1,1,true],[1,2,false]])for(const stage of [1,2,3])values.push(r(749,[signed(values.length+1),r(748,[u(glyph),u(stage),true,true,true,u(action),true,true,true,outcome,false,u(1),true,q(0,1),q(1,1),u(2)])]));
 values.push(r(749,[signed(10)]));
 const input=await compileAffectInputs(model,enc(model.initial.canonicalValue()),enc(list(values)),new Uint8Array(32)),runtime=createAffectRuntime(model,input);
 let n=0;while(await runtime.settle())n++;
 const outputs=runtime.snapshot().outputs,app=outputs.filter(v=>v.schema?.typeId===754n).at(-1);
 console.log('settlements',n,'appraisal',JSON.stringify(app,(_,x)=>typeof x==='bigint'?String(x):x instanceof Map?[...x]:x));
}finally{await server.close();}
