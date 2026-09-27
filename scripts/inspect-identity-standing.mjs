import {createServer} from 'vite';
const s=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const m=await s.ssrLoadModule('/src/campaign3/multisourceModelRecipe.ts');console.log(JSON.stringify(m.multisourceBase().get('task-reason-dice'),(_,v)=>typeof v==='bigint'?String(v):v instanceof Map?[...v]:v));}finally{await s.close();}
