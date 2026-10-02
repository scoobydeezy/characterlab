import {createServer} from 'vite';
const log=(x)=>console.log(new Date().toISOString(),x);log('start');const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const fx=await server.ssrLoadModule('/src/test/developmentPublicFixtures.ts');log('loaded');const c=fx.publicCase('Young1');log('case');const run=await fx.nativeRun(c);log('native');await run.settleNextInstant();log('step');console.log(run.rows().length);}finally{await server.close();}
