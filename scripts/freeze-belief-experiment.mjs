/** Freeze original data and comparison claims before public execution. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createServer} from 'vite';
const destination='docs/planning/BELIEF_EXPERIMENT_PLAN_REV1.json';assert(!fs.existsSync(destination));
const server=await createServer({configFile:false,server:{middlewareMode:true},appType:'custom'});
try{
 const {beliefRecord:r}=await server.ssrLoadModule('/src/campaign3/beliefCodecs.ts');
 const {PROPOSITIONS}=await server.ssrLoadModule('/src/campaign3/beliefModel.ts');
 const {canonicalEncode:enc,list,set,signed}=await server.ssrLoadModule('/src/substrate/canonicalEncoding.ts');
 const frame=(report=true,opportunity=true,monitor=true,visible=true,truth=false,p=0,truthOpportunity=true)=>r(735,[PROPOSITIONS[p],truthOpportunity,truth,visible,opportunity,monitor,report]);
 const repeat=(n,f)=>Array.from({length:n},()=>[f()]);
 const scenarios={misleading:[...repeat(8,()=>frame()),[]],accurate:[...repeat(8,()=>frame(false)),[]],corrected:[...repeat(8,()=>frame()),...repeat(9,()=>frame(false)),[]],hidden:[...repeat(8,()=>frame(true,true,true,true,true,0,false)),[]],safeAbsence:[[frame()],...repeat(5,()=>frame(false)),[]],noOpportunity:[[frame()],...repeat(5,()=>frame(false,false)),[]],censored:[[frame()],...repeat(5,()=>frame(false,true,false)),[]],unavailable:[[frame()],...repeat(5,()=>frame(false,true,true,false)),[]],unknown:[[frame(false,true,true,false)],[]],knownZero:[[frame(false)],[]],mixed:[[frame()],[frame(false)],[frame()],[frame(false)],[]],independent:[[frame(),frame(false,true,true,true,false,1)],[frame(false),frame(true,true,true,true,false,1)],[]],permuted:[[frame(false,true,true,true,false,1),frame()],[frame(true,true,true,true,false,1),frame(false)],[]],empty:[[],[],[],[],[]]};
 const runs=[];
 for(const [name,frames] of Object.entries(scenarios))for(const law of [1,2,3]){
  const orderedInputs=Buffer.from(enc(list(frames.map((v,i)=>r(736,[signed(i+1),list(v)]))))).toString('hex');runs.push({name:name+'-law-'+law,caseName:name,law,goal:-1,orderedInputs});
 }
 for(const law of [1,2,3])for(const goal of [0,1])runs.push({...runs.find(r=>r.caseName==='misleading'&&r.law===law),name:'goal-'+goal+'-law-'+law,caseName:'goal-'+goal,goal});
 const plan={date:'2026-09-20',status:'FROZEN BEFORE PUBLIC EXECUTION',contract:'belief-public/0.1-candidate',comparisonVersion:'belief-comparison/0.1-candidate',initialState:Buffer.from(enc(set([]))).toString('hex'),runSeed:Buffer.alloc(32,7).toString('hex'),modelFreeze:'docs/planning/campaign3-belief-model-rev1/FREEZE.json',modelFreezeSha256:createHash('sha256').update(fs.readFileSync('docs/planning/campaign3-belief-model-rev1/FREEZE.json')).digest('hex'),claims:['fixed truth/different evidence','same safe observations/changed hidden truth and opportunity','directional correction and contradiction resistance','goal changes appraisal but not belief','safe opportunity versus censored/no opportunity/denied channel','unknown versus known zero','independent target permutation','no same-instant consequence reentry','every complete prefix restore and next-step continuation'],runs};
 fs.writeFileSync(destination,JSON.stringify(plan,null,2)+'\n',{flag:'wx'});console.log('Frozen '+runs.length+' public runs and original bytes.');
}finally{await server.close();}
