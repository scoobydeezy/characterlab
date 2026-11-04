import {beforeAll,afterAll} from 'vitest';
import {Session} from 'node:inspector';
import {writeFileSync} from 'node:fs';
import {gzipSync} from 'node:zlib';
// Explicitly stop inside the worker: Windows fork termination loses CLI CPU files.
const session=new Session();
const post=(method:string,params:object={})=>new Promise<any>((resolve,reject)=>session.post(method,params,(error,result)=>error?reject(error):resolve(result)));
beforeAll(async()=>{session.connect();await post('Profiler.enable');await post('Profiler.setSamplingInterval',{interval:10000});await post('Profiler.start');});
afterAll(async()=>{const {profile}=await post('Profiler.stop');session.disconnect();writeFileSync('docs/planning/assembled-verification-performance/'+process.env.ASSEMBLED_PROFILE_LABEL+'-worker.cpuprofile.gz',gzipSync(JSON.stringify(profile)));});
