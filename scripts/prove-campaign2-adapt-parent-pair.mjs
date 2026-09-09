import fs from 'node:fs';
import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true,preTransformRequests:false},optimizeDeps:{noDiscovery:true,include:[]},appType:'custom'});
try{
 const {proveAdaptParentPair}=await server.ssrLoadModule('/src/test/helpers/adaptParentPair.ts');
 const report=await proveAdaptParentPair();
 fs.writeFileSync(new URL('../docs/planning/CAMPAIGN2_ADAPT_PARENT_PAIR_PROOF.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,checks:report.checks.length,timelines:report.timelines.length}));
}finally{await server.close();}
