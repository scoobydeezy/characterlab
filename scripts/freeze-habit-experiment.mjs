import fs from 'node:fs';import {createServer} from 'vite';import {createHash} from 'node:crypto';
const server=await createServer({configFile:false,server:{middlewareMode:true,hmr:false},appType:'custom'});
try{const {habitInputs,habitScenario}=await server.ssrLoadModule('/src/test/habitFixtures.ts'),freeze=JSON.parse(fs.readFileSync('docs/planning/campaign3-habit-model-rev1/FREEZE.json')),runs=[],base='candidate-1-law-1',add=(name,model,xs=habitScenario())=>runs.push({name,model,orderedInputs:Buffer.from(habitInputs(xs)).toString('hex')});
for(const m of freeze.models)add(m.name,m.name);
add('unrewarded-training',base,habitScenario().map(x=>x.at<=3?{...x,reward:false}:x));
add('hidden-reversal',base,habitScenario().map(x=>({...x,report:1})));
add('hidden-unchanged',base,habitScenario().map(x=>({...x,reward:true,report:1})));
add('reward-reader-reversal','candidate-4-law-1',habitScenario().map(x=>({...x,report:1})));
add('reward-reader-unchanged','candidate-4-law-1',habitScenario().map(x=>({...x,reward:true,report:1})));
add('uncorrected',base,habitScenario().map(x=>x.at>=4?{...x,visible:false}:x));
add('other-cue',base,habitScenario().map(x=>x.at>=5?{...x,cue:false}:x));
add('unseen-training',base,habitScenario().map(x=>x.at<=3?{...x,visible:false}:x));
add('false-training-reports',base,habitScenario().map(x=>x.at<=3?{...x,reward:false,report:1}:x));
add('empty',base,[]);add('maximum',base,Array.from({length:16},(_,i)=>({at:i+1,mode:1,reward:i<8})));
fs.writeFileSync('docs/planning/HABIT_PUBLIC_EXPERIMENT_PLAN_REV1.json',JSON.stringify({date:'2026-09-21',status:'FROZEN BEFORE PUBLIC QUALIFICATION',contract:'habit-public/0.1-candidate',freezeSha256:createHash('sha256').update(fs.readFileSync('docs/planning/campaign3-habit-model-rev1/FREEZE.json')).digest('hex'),claims:['equal explicit expectation/different acquired tendency','persistence after reversal and eventual update','derived/cache representation equivalence','current-reward and explicit-belief alternatives','hidden reward noninterference','cue-specificity and absent evidence','residual/linear/no-history alternatives','every whole prefix restore and addressed-random continuation'],runs},null,2)+'\n',{flag:'wx'});console.log('Frozen '+runs.length+' runs');
}finally{await server.close();}
