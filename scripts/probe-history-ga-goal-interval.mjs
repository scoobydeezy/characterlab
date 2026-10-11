import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
const fp=path=>({path,sha256:createHash('sha256').update(fs.readFileSync(path)).digest('hex')});
try{
 const {embodiedRecord}=await server.ssrLoadModule('/src/campaign3/embodiedCodecs.ts');
 const {rational}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const {ExactRational:Q}=await server.ssrLoadModule('/src/substrate/exactMath.ts');
 const {adoptMaintenanceGoal}=await server.ssrLoadModule('/src/campaign3/bodilyMaintenanceGoal.ts');
 let zeroError;try{embodiedRecord(462,[rational(0n,1n),rational(0n,1n)]);}catch(e){zeroError=e.message;}
 assert(zeroError?.includes('interval must have positive width'));
 embodiedRecord(462,[rational(0n,1n),rational(1n,1n)]);
 const state=adoptMaintenanceGoal([],{character:'a',goal:'g',signal:'s',desired:{lower:Q.of(0n),upper:Q.of(0n)},adoptedAt:0n,activeFrom:0n,expiresAt:1n},new Map([['s',{lower:Q.of(0n),upper:Q.of(100n)}]]));
 assert.equal(state[0].desired.lower.compare(state[0].desired.upper),0);
 const result={status:'PASS; REPRESENTATION DISTINCTION',zeroWidthPhysicalInterval:{accepted:false,error:zeroError},positiveWidthPhysicalInterval:{accepted:true},pointGoalInterval:{accepted:true},sources:['src/campaign3/embodiedCodecs.ts','src/campaign3/bodilyMaintenanceGoal.ts','src/campaign2/orderedInputs.ts','scripts/probe-history-ga-goal-interval.mjs'].map(fp),limits:['Current decoder/component witness for the documented distinction; no new public goal admission or historical complete-module identity claim.']};
 const path='docs/planning/campaign3-history-ga-goal-carriers-rev1/interval-witness.json';
 if(fs.existsSync(path))assert.deepEqual(JSON.parse(fs.readFileSync(path)),result);else fs.writeFileSync(path,JSON.stringify(result,null,2)+'\n');
 console.log(result.status);
}finally{await server.close();}
