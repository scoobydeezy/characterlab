import fs from 'node:fs';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';import {createServer} from 'vite';
const path='docs/planning/SKILL_PUBLIC_EXPERIMENT_PLAN_REV1.json';assert(!fs.existsSync(path));const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'}),hash=b=>createHash('sha256').update(b).digest('hex');
try{
 const {skillInputs,skillScenario}=await server.ssrLoadModule('/src/test/skillFixtures.ts'),freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-skill-model-rev1/FREEZE.json')),runs=[];
 const add=(name,model,xs=skillScenario())=>runs.push({name,model,seed:0,orderedInputs:Buffer.from(skillInputs(xs)).toString('hex')});
 for(const m of freeze.models)add(m.name,m.name);
 const base='k0.5-p1-e1';
 for(const initial of [0,1])add('physical-'+initial,`k${initial}-p1-e1`,[{at:1,visible:false},{at:2,visible:false}]);
 for(const impairment of [0,.5])add('impair-'+impairment,base,[{at:1,impairment,visible:false},{at:2,visible:false}]);
 for(const report of [1,2])add('belief-'+report,base,[{at:1,report},{at:2,visible:false}]);
 add('skilled-insecure','k1-p1-e1',[{at:1,report:2},{at:2,visible:false}]);add('incompetent-confident','k0-p1-e1',[{at:1,report:1},{at:2,visible:false}]);
 for(const practiceLaw of [1,2,3])add('practice-'+practiceLaw,`k0-p${practiceLaw}-e1`,[{at:1,practice:true,visible:false},{at:2,practice:true,visible:false},{at:3,difficulty:.625,visible:false}]);
 for(const executionLaw of [1,2])add('impair-law-'+executionLaw,`k0.5-p1-e${executionLaw}`,[{at:1,impairment:.25,difficulty:.3125,visible:false}]);
 add('permanent-recovery','permanent-impairment',[{at:1,impairment:.5,visible:false},{at:2,visible:false}]);
 add('confidence-as-skill','k0-bad-e3',[{at:1,report:1},{at:2,visible:false}]);add('intent-as-success','k0-bad-e4',[{at:1,visible:false},{at:2,visible:false}]);
 add('blocked',base,skillScenario().map(x=>({...x,permitted:false,report:1})));add('no-feedback',base,skillScenario().map(x=>({...x,visible:false})));
 add('saturation','k1-p1-e1',Array.from({length:8},(_,i)=>({at:i+1,practice:true,visible:false})));
 for(const model of [base,'last-observation','no-learning'])add('contradiction-'+model,model,[{at:1,report:1},{at:2,report:2},{at:3,visible:false}]);
 for(const difficulty of [.4375,.5,.5625])add('threshold-'+difficulty,base,[{at:1,difficulty,visible:false}]);
 fs.writeFileSync(path,JSON.stringify({date:'2026-09-21',status:'FROZEN BEFORE PUBLIC QUALIFICATION',contract:'skill-public/0.1-candidate',modelFreezeSha256:hash(fs.readFileSync('docs/planning/campaign3-skill-model-rev1/FREEZE.json')),claims:['same intent/expression under actual skill and temporary impairment interventions','misleading visible reports change belief without changing skill','practice without observation and later influence','no practice during impairment/recovery','linear/residual and multiplicative/additive serious alternatives','three conflation controls','no opportunity, hidden feedback, unknown/zero, saturation and threshold boundaries','every complete prefix restore and next-step equality'],runs},null,2)+'\n',{flag:'wx'});console.log('Frozen '+runs.length+' runs');
}finally{await server.close();}
